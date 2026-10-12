import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { PERSON } from '../../data/site.data';

@Component({
  selector: 'app-site-footer',
  template: `<footer class="foot">
    <p>© 2026 {{ person.name }} · {{ person.alias }} · {{ i18n.m().footer }}</p>
  </footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly i18n = inject(I18nService);
  protected readonly person = PERSON;
}
