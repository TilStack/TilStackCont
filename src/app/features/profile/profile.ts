import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { PERSON } from '../../data/site.data';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  protected readonly i18n = inject(I18nService);
  protected readonly person = PERSON;
}
