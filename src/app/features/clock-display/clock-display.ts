import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ClockService } from '../../core/clock.service';
import { I18nService } from '../../core/i18n.service';

/** Grande horloge de Douala (heures, minutes, secondes) et date du jour. */
@Component({
  selector: 'app-clock-display',
  templateUrl: './clock-display.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockDisplay {
  protected readonly clock = inject(ClockService);
  protected readonly i18n = inject(I18nService);
}
