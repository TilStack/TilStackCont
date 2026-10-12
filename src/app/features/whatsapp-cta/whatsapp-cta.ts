import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { PERSON, whatsappUrl } from '../../data/site.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-whatsapp-cta',
  imports: [Icon],
  templateUrl: './whatsapp-cta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappCta {
  protected readonly i18n = inject(I18nService);
  protected readonly phone = PERSON.phoneDisplay;
  protected readonly href = computed(() => whatsappUrl(this.i18n.m().waMessage));
}
