import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { APPS, withUtm } from '../../data/site.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-apps-list',
  imports: [Icon, NgTemplateOutlet],
  templateUrl: './apps-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppsList {
  protected readonly i18n = inject(I18nService);
  protected readonly apps = APPS;
  protected readonly withUtm = withUtm;
}
