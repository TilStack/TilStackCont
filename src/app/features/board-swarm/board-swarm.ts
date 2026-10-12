import { DOCUMENT } from '@angular/common';
import { BIBLE_PATH, PAWN_PATH } from '../../core/motifs';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';

type State = 'idle' | 'come' | 'rest' | 'leave';

interface Piece {
  state: State;
  x: number;
  y: number;
  /** Position cible (autour du curseur au moment de l'appel). */
  tx: number;
  ty: number;
  rot: number;
  trot: number;
  size: number;
  alpha: number;
  /** Retard avant le départ (ms) : les pièces n'arrivent pas toutes ensemble. */
  delay: number;
  vx: number;
  vy: number;
  accent: boolean;
  phase: number;
}

const POOL = 18;
const BATCH_MIN = 5;
const BATCH_MAX = 8;
/** Distance parcourue par le curseur avant d'appeler un nouveau groupe. */
const MOVE_THRESHOLD = 70;
const BATCH_COOLDOWN_MS = 380;
/** Éléments au-dessus desquels le curseur n'est plus « dans le vide ». */
const CONTENT = 'a, button, .product, .app, .socials, .profile, .clock, .tile, .foot, .top__tools';

const rand = (min: number, max: number): number => min + Math.random() * (max - min);

/**
 * Effet « sucre et fourmis » : quand le curseur est dans le vide, de petits échiquiers viennent se poser autour de lui ;
 * dès qu'il bouge, ils repartent et d'autres arrivent. Dessiné sur un canvas, animé seulement quand il y a des pièces
 * (aucune boucle au repos). Désactivé pour le tactile et si l'utilisateur réduit les animations.
 */
@Component({
  selector: 'app-board-swarm',
  template: `<canvas #canvas class="swarm" aria-hidden="true"></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardSwarm {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private dpr = 1;
  private w = 0;
  private h = 0;
  private raf = 0;
  private lastFrame = 0;
  private cursor = { x: 0, y: 0 };
  private lastBatch = { x: -9999, y: -9999, t: 0 };
  private readonly pieces: Piece[] = Array.from({ length: POOL }, () => ({
    state: 'idle' as State, x: 0, y: 0, tx: 0, ty: 0, rot: 0, trot: 0, size: 24, alpha: 0, delay: 0, vx: 0, vy: 0, accent: false, phase: 0,
  }));

  constructor() {
    afterNextRender(() => this.init());
  }

  private init(): void {
    const win = this.doc.defaultView;
    if (!win || win.matchMedia('(prefers-reduced-motion: reduce)').matches || !win.matchMedia('(hover: hover)').matches) return;
    const ctx = this.canvasRef().nativeElement.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.resize();

    const onMove = (e: PointerEvent): void => this.onMove(e);
    const onLeave = (e: MouseEvent): void => {
      if (!e.relatedTarget) this.releaseAll();
    };
    const onResize = (): void => this.resize();
    this.doc.addEventListener('pointermove', onMove, { passive: true });
    this.doc.addEventListener('mouseout', onLeave);
    win.addEventListener('resize', onResize);
    this.destroyRef.onDestroy(() => {
      this.doc.removeEventListener('pointermove', onMove);
      this.doc.removeEventListener('mouseout', onLeave);
      win.removeEventListener('resize', onResize);
      cancelAnimationFrame(this.raf);
    });
  }

  private resize(): void {
    const win = this.doc.defaultView!;
    const canvas = this.canvasRef().nativeElement;
    this.dpr = Math.min(win.devicePixelRatio || 1, 2);
    this.w = win.innerWidth;
    this.h = win.innerHeight;
    canvas.width = Math.round(this.w * this.dpr);
    canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private onMove(e: PointerEvent): void {
    if (e.pointerType === 'touch') return;
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
    const inVoid = !(e.target as Element | null)?.closest?.(CONTENT);
    if (!inVoid) {
      this.releaseAll();
      return;
    }
    const now = performance.now();
    const moved = Math.hypot(this.cursor.x - this.lastBatch.x, this.cursor.y - this.lastBatch.y);
    if (moved > MOVE_THRESHOLD && now - this.lastBatch.t > BATCH_COOLDOWN_MS) {
      this.releaseAll();
      this.summon();
      this.lastBatch = { x: this.cursor.x, y: this.cursor.y, t: now };
      this.start();
    }
  }

  /** Appelle un groupe de pièces libres : elles arrivent de loin, échelonnées, et se posent autour du curseur. */
  private summon(): void {
    const idle = this.pieces.filter((p) => p.state === 'idle');
    const n = Math.min(idle.length, Math.round(rand(BATCH_MIN, BATCH_MAX)));
    for (let i = 0; i < n; i++) {
      const p = idle[i];
      const slot = (i / n) * Math.PI * 2 + rand(-0.3, 0.3);
      const radius = rand(26, 72);
      const from = rand(0, Math.PI * 2);
      const away = rand(180, 380);
      p.tx = this.cursor.x + Math.cos(slot) * radius;
      p.ty = this.cursor.y + Math.sin(slot) * radius;
      p.x = p.tx + Math.cos(from) * away;
      p.y = p.ty + Math.sin(from) * away;
      p.rot = rand(0, Math.PI * 2);
      p.trot = rand(-0.5, 0.5);
      p.size = rand(20, 34);
      p.alpha = 0;
      p.delay = i * 45 + rand(0, 100);
      p.accent = Math.random() < 0.22;
      p.phase = rand(0, Math.PI * 2);
      p.state = 'come';
    }
  }

  /** Les pièces posées ou en route repartent, en s'éloignant du curseur. */
  private releaseAll(): void {
    for (const p of this.pieces) {
      if (p.state !== 'come' && p.state !== 'rest') continue;
      if (p.state === 'come' && p.delay > 0) {
        p.state = 'idle';
        continue;
      }
      const a = Math.atan2(p.y - this.cursor.y, p.x - this.cursor.x) + rand(-0.6, 0.6);
      const speed = rand(140, 260);
      p.vx = Math.cos(a) * speed;
      p.vy = Math.sin(a) * speed;
      p.state = 'leave';
    }
    this.start();
  }

  private start(): void {
    if (this.raf) return;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private frame(now: number): void {
    const dt = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    let active = false;

    for (const p of this.pieces) {
      if (p.state === 'idle') continue;
      active = true;
      if (p.state === 'come') {
        if (p.delay > 0) {
          p.delay -= dt * 1000;
          continue;
        }
        const k = 1 - Math.exp(-dt * 7);
        p.x += (p.tx - p.x) * k;
        p.y += (p.ty - p.y) * k;
        p.rot += (p.trot - p.rot) * k;
        p.alpha = Math.min(0.95, p.alpha + dt * 3);
        if (Math.hypot(p.tx - p.x, p.ty - p.y) < 2.5) p.state = 'rest';
      } else if (p.state === 'leave') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += dt * 1.2;
        p.alpha -= dt * 1.8;
        if (p.alpha <= 0) {
          p.alpha = 0;
          p.state = 'idle';
        }
      }
    }

    this.draw(now);
    this.raf = active ? requestAnimationFrame((t) => this.frame(t)) : 0;
  }

  private draw(now: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    const root = this.doc.documentElement;
    const dark = root.getAttribute('data-theme') === 'dark';
    const motif = root.getAttribute('data-bg') ?? 'echecs';
    const ink = dark ? '#ffffff' : '#14213d';
    const accent = dark ? '#ffde59' : '#d9a900';

    for (const p of this.pieces) {
      if (p.state === 'idle' || p.alpha <= 0 || (p.state === 'come' && p.delay > 0)) continue;
      // Trajet sinueux, comme une fourmi : léger écart latéral qui s'éteint à l'arrivée.
      let ox = 0;
      let oy = 0;
      if (p.state === 'come') {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const wob = Math.sin(now * 0.011 + p.phase) * Math.min(d * 0.16, 22);
        ox = (-dy / d) * wob;
        oy = (dx / d) * wob;
      } else if (p.state === 'rest') {
        ox = Math.sin(now * 0.002 + p.phase) * 1.5;
        oy = Math.cos(now * 0.0023 + p.phase) * 1.5;
      }
      const color = p.accent ? accent : ink;
      ctx.save();
      ctx.translate(p.x + ox, p.y + oy);
      ctx.rotate(p.rot);
      ctx.translate(-p.size / 2, -p.size / 2);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      if (motif === 'pions' || motif === 'bible') {
        ctx.scale(p.size / 24, p.size / 24);
        ctx.globalAlpha = p.alpha * 0.85;
        ctx.fill(new Path2D(motif === 'pions' ? PAWN_PATH : BIBLE_PATH), motif === 'bible' ? 'evenodd' : 'nonzero');
      } else {
        // « echecs » : échiquier 4 × 4 ; « damiers » : petit carreau 3 × 3.
        const n = motif === 'damiers' ? 3 : 4;
        const c = p.size / n;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            ctx.globalAlpha = p.alpha * ((i + j) % 2 ? 0.8 : 0.16);
            ctx.fillRect(i * c, j * c, c, c);
          }
        }
        ctx.globalAlpha = p.alpha * 0.9;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(0, 0, p.size, p.size);
      }
      ctx.restore();
    }
  }
}
