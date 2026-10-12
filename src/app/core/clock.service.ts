import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { I18nService } from './i18n.service';

const TIME_ZONE = 'Africa/Douala';

/** Heure de Douala, secondes comprises. Démarrée seulement dans le navigateur : le pré-rendu ne connaît pas l'heure du visiteur. */
@Injectable({ providedIn: 'root' })
export class ClockService {
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly now = signal<Date | null>(null);

  private readonly locale = computed(() => (this.i18n.lang() === 'fr' ? 'fr-FR' : 'en-GB'));
  private readonly timeFormat = computed(
    () =>
      new Intl.DateTimeFormat(this.locale(), {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
        timeZone: TIME_ZONE,
      }),
  );
  private readonly dateFormat = computed(
    () => new Intl.DateTimeFormat(this.locale(), { weekday: 'long', day: 'numeric', month: 'long', timeZone: TIME_ZONE }),
  );

  /** « 04:13:07 » découpé en heures:minutes et secondes (mise en forme différente). */
  private readonly parts = computed(() => {
    const now = this.now();
    return now ? this.timeFormat().format(now).split(':') : ['--', '--', '--'];
  });
  readonly hm = computed(() => `${this.parts()[0]}:${this.parts()[1]}`);
  readonly ss = computed(() => this.parts()[2]);
  readonly iso = computed(() => this.now()?.toISOString() ?? '');
  /** « Lundi 12 octobre » (vide avant le démarrage). */
  readonly date = computed(() => {
    const now = this.now();
    if (!now) return '';
    const d = this.dateFormat().format(now);
    return d.charAt(0).toUpperCase() + d.slice(1);
  });

  start(): void {
    this.now.set(new Date());
    const id = setInterval(() => this.now.set(new Date()), 1000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }
}
