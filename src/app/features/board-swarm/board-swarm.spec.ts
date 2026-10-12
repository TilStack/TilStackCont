import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BoardSwarm } from './board-swarm';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Part (en %) de pixels dessinés dans un carré autour d'un point du canvas. */
function lit(canvas: HTMLCanvasElement, cx: number, cy: number, r: number): number {
  const x = Math.max(0, cx - r);
  const y = Math.max(0, cy - r);
  const data = canvas.getContext('2d')!.getImageData(x, y, 2 * r, 2 * r).data;
  let n = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 20) n++;
  return (100 * n) / (data.length / 4);
}

describe('BoardSwarm (échiquiers attirés par le curseur)', () => {
  let canvas: HTMLCanvasElement;
  const move = (x: number, y: number, target: Element = document.body) =>
    target.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y, pointerType: 'mouse', bubbles: true }));

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [BoardSwarm], providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(BoardSwarm);
    await fixture.whenStable();
    canvas = fixture.nativeElement.querySelector('canvas');
  });

  it('est décoratif : masqué aux lecteurs d\'écran', () => {
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
  });

  it('attire des échiquiers autour du curseur, puis les envoie ailleurs quand il bouge', async () => {
    if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = { x: Math.round(innerWidth * 0.3), y: Math.round(innerHeight * 0.3) };
    const b = { x: Math.round(innerWidth * 0.7), y: Math.round(innerHeight * 0.65) };

    move(a.x, a.y);
    await wait(1800);
    expect(lit(canvas, a.x, a.y, 110)).toBeGreaterThan(1.5);

    await wait(450);
    move(b.x, b.y);
    await wait(1800);
    expect(lit(canvas, b.x, b.y, 110)).toBeGreaterThan(1.5);
    expect(lit(canvas, a.x, a.y, 70)).toBeLessThan(1);
  });

  for (const motif of ['damiers', 'pions', 'bible']) {
    it(`dessine aussi le motif du fond « ${motif} » autour du curseur`, async () => {
      if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.documentElement.setAttribute('data-bg', motif);
      const a = { x: Math.round(innerWidth * 0.4), y: Math.round(innerHeight * 0.4) };
      move(a.x, a.y);
      await wait(1800);
      expect(lit(canvas, a.x, a.y, 110)).toBeGreaterThan(1);
      document.documentElement.removeAttribute('data-bg');
    });
  }

  it('retire tous les échiquiers quand le curseur passe sur un élément cliquable', async () => {
    if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = { x: Math.round(innerWidth * 0.3), y: Math.round(innerHeight * 0.3) };
    move(a.x, a.y);
    await wait(1800);
    const button = document.createElement('button');
    document.body.appendChild(button);
    move(a.x + 120, a.y, button);
    await wait(1500);
    expect(lit(canvas, a.x, a.y, 150)).toBeLessThan(0.5);
    button.remove();
  });
});
