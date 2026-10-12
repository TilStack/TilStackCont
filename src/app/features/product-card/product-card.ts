import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatEur, formatXaf, xafToEur } from '../../core/format';
import { I18nService } from '../../core/i18n.service';
import { PRODUCT, withUtm } from '../../data/site.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-product-card',
  imports: [Icon],
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  protected readonly i18n = inject(I18nService);
  protected readonly product = PRODUCT;
  protected readonly buyUrl = withUtm(PRODUCT.url);

  protected readonly eur = computed(() => `≈ ${formatEur(xafToEur(PRODUCT.priceXaf), this.i18n.lang())}`);
  protected readonly xaf = computed(() => formatXaf(PRODUCT.priceXaf, this.i18n.lang()));
  protected readonly oldXaf = computed(() => formatXaf(PRODUCT.oldPriceXaf, this.i18n.lang()));
}
