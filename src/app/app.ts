import { DOCUMENT, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { BackgroundService } from './core/background.service';
import { ClockService } from './core/clock.service';
import { I18nService } from './core/i18n.service';
import { buildStructuredData } from './core/structured-data';
import { ThemeService } from './core/theme.service';
import { AppsList } from './features/apps-list/apps-list';
import { BoardSwarm } from './features/board-swarm/board-swarm';
import { ClockDisplay } from './features/clock-display/clock-display';
import { ProductCard } from './features/product-card/product-card';
import { Profile } from './features/profile/profile';
import { QuickLinks } from './features/quick-links/quick-links';
import { Socials } from './features/socials/socials';
import { WhatsappCta } from './features/whatsapp-cta/whatsapp-cta';
import { SiteFooter } from './layout/site-footer/site-footer';
import { SiteHeader } from './layout/site-header/site-header';
import { IconSprite } from './shared/icon/icon-sprite';

@Component({
  selector: 'app-root',
  imports: [IconSprite, BoardSwarm, SiteHeader, ClockDisplay, Profile, ProductCard, WhatsappCta, AppsList, QuickLinks, Socials, SiteFooter],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);
  private readonly clock = inject(ClockService);
  private readonly background = inject(BackgroundService);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    // Au pré-rendu seulement : le JSON-LD est écrit dans le HTML statique (pas de script inline à l'exécution, CSP stricte).
    if (isPlatformServer(inject(PLATFORM_ID))) this.writeStructuredData();

    // Après l'hydratation : préférences du visiteur (langue, thème) et horloge.
    afterNextRender(() => {
      this.i18n.init();
      this.theme.init();
      this.clock.start();
      this.background.start();
    });
  }

  private writeStructuredData(): void {
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(buildStructuredData());
    this.doc.head.appendChild(script);
  }
}
