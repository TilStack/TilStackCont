import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { ThemeService } from '../../core/theme.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-site-header',
  imports: [Icon],
  templateUrl: './site-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
}
