import { Component, HostBinding, Inject, Input } from '@angular/core';
import { FORM_INPUT_CONFIG, FormInputGlobalConfig, InputVariant } from './form-input.component';

@Component({
  selector: '[zzSelect]',
  template: ` <ng-content></ng-content>`,
  standalone: true,
  styles: [
    //language=SCSS
    `
      :host {
        @apply h-[42px] border border-transparent focus:ring-1 focus:ring-primary;
        @apply p-2 outline-none;
        @apply focus:border-primary;
        transition: all 0.3s;

        &:disabled {
          @apply cursor-not-allowed text-gray-400 opacity-50;
        }
      }

      :host-context(.zz-outline) {
        @apply border border-slate-400 bg-transparent;
        &:disabled {
          @apply border-slate-300;
        }
      }

      :host-context(.zz-fill) {
        @apply border-slate-200 bg-slate-100 focus:ring-1;
      }
    `,
  ],
})
export class FormSelectComponent {
  @Input()
  variant: InputVariant = 'outline';

  constructor(@Inject(FORM_INPUT_CONFIG) private readonly formInputConfig: FormInputGlobalConfig) {}

  @HostBinding('class')
  get classes() {
    return `zz-select zz-${this.variant} rounded-${[this.formInputConfig.rounded]}`;
  }
}
