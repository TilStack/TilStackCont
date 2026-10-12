import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { SOCIALS } from '../../data/site.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-socials',
  imports: [Icon],
  templateUrl: './socials.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Socials {
  protected readonly i18n = inject(I18nService);
  protected readonly socials = SOCIALS;
}
