import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Lang, MESSAGES } from './messages';

const STORAGE_KEY = 'tl-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly lang = signal<Lang>('fr');
  readonly m = computed(() => MESSAGES[this.lang()]);
  readonly otherLang = computed<Lang>(() => (this.lang() === 'fr' ? 'en' : 'fr'));

  constructor() {
    effect(() => {
      const m = this.m();
      this.doc.documentElement.lang = this.lang();
      this.title.setTitle(m.title);
      this.meta.updateTag({ name: 'description', content: m.description });
    });
  }

  /** Après l'hydratation : langue mémorisée, sinon langue du navigateur (français par défaut). */
  init(): void {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible : on ignore */
    }
    const browser = (navigator.language || 'fr').slice(0, 2);
    this.lang.set(saved === 'en' || saved === 'fr' ? saved : browser === 'fr' ? 'fr' : 'en');
  }

  toggle(): void {
    this.setLang(this.otherLang());
  }

  setLang(next: Lang): void {
    this.lang.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignoré */
    }
  }
}
