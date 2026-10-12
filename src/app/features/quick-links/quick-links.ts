import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { MessageKey } from '../../core/messages';
import { CV_URL, PORTFOLIO_URL, STORE_URL, withUtm } from '../../data/site.data';
import { Icon, IconName } from '../../shared/icon/icon';

interface Tile {
  id: string;
  icon: IconName;
  url: string;
  /** Libellé court affiché sous la tuile. */
  labelKey: MessageKey;
  /** Nom accessible complet (contient le libellé court). */
  ariaKey: MessageKey;
  variant: 'navy' | 'white' | 'yellow' | 'lilac';
  download?: string;
}

const TILES: readonly Tile[] = [
  { id: 'portfolio', icon: 'globe', url: PORTFOLIO_URL, labelKey: 'portfolio', ariaKey: 'portfolio', variant: 'navy' },
  { id: 'cv', icon: 'file', url: CV_URL, labelKey: 'cv', ariaKey: 'cv', variant: 'white' },
  { id: 'store', icon: 'bag', url: withUtm(`${STORE_URL}/`), labelKey: 'storeShort', ariaKey: 'store', variant: 'yellow' },
  { id: 'vcard', icon: 'user', url: 'israel-tientcheu.vcf', labelKey: 'vcardShort', ariaKey: 'vcard', variant: 'lilac', download: 'israel-tientcheu.vcf' },
];

@Component({
  selector: 'app-quick-links',
  imports: [Icon],
  templateUrl: './quick-links.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickLinks {
  protected readonly i18n = inject(I18nService);
  protected readonly tiles = TILES;
}
