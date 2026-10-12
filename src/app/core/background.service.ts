import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

/** Les quatre fonds, dans l'ordre de la rotation. */
export const BACKGROUNDS = ['echecs', 'damiers', 'pions', 'bible'] as const;
export type Background = (typeof BACKGROUNDS)[number];

/** Un fond dure 5 heures. */
export const ROTATION_MS = 5 * 60 * 60 * 1000;

/** Fond à afficher à un instant donné (millisecondes depuis 1970) : le même pour tous les visiteurs. */
export const backgroundAt = (time: number): Background =>
  BACKGROUNDS[Math.floor(time / ROTATION_MS) % BACKGROUNDS.length];

/** Prochain changement de fond après cet instant. */
export const nextChangeAt = (time: number): number => (Math.floor(time / ROTATION_MS) + 1) * ROTATION_MS;

/**
 * Tient l'attribut `data-bg` de la page à jour. `theme.js` le pose avant le premier affichage ;
 * ce service le corrige si besoin et change de fond à l'heure pile si la page reste ouverte.
 */
@Injectable({ providedIn: 'root' })
export class BackgroundService {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly current = signal<Background>('echecs');

  start(): void {
    let timer: ReturnType<typeof setTimeout>;
    const apply = (): void => {
      const now = Date.now();
      const bg = backgroundAt(now);
      this.current.set(bg);
      this.doc.documentElement.setAttribute('data-bg', bg);
      timer = setTimeout(apply, nextChangeAt(now) - now + 50);
    };
    apply();
    this.destroyRef.onDestroy(() => clearTimeout(timer));
  }
}
