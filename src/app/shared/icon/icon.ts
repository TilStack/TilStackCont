import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'github' | 'linkedin' | 'x' | 'tiktok' | 'facebook' | 'youtube' | 'heart' | 'mail' | 'whatsapp' | 'moon' | 'sun'
  | 'globe' | 'file' | 'bag' | 'user' | 'play';

/** Icône décorative (le texte accessible est porté par le lien ou le bouton qui la contient). */
@Component({
  selector: 'app-icon',
  template: `<svg class="ico" aria-hidden="true" focusable="false"><use [attr.href]="href()" /></svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon-host' },
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly href = computed(() => `#i-${this.name()}`);
}
