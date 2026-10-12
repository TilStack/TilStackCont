import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Planche d'icônes SVG, insérée une seule fois dans la page ; `<app-icon>` y fait référence avec <use>. */
@Component({
  selector: 'app-icon-sprite',
  templateUrl: './icon-sprite.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSprite {}
