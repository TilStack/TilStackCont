import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'tl-theme';

/** Clair par défaut. Le script `theme.js` pose `data-theme` avant le premier affichage ; ce service le lit. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly theme = signal<Theme>('light');

  init(): void {
    this.theme.set(this.doc.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.doc.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignoré */
    }
  }
}
