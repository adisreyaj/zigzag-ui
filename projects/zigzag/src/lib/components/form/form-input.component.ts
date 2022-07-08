import { Component, HostBinding, Inject, InjectionToken, Input, NgModule } from '@angular/core';

@Component({
  selector: '[zzInput]',
  template: ` <ng-content></ng-content>`,
  styles: [
    //language=SCSS
    `
      :host-context([type='text'], [type='email'], [type='number'], [type='url'], [type='password'], textarea) {
        @apply border border-transparent focus:ring-1 focus:ring-primary;
        @apply p-2 outline-none;
        @apply focus:border-primary;
        transition: all 0.3s;

        &::placeholder {
          @apply text-gray-300;
        }

        &:disabled {
          @apply cursor-not-allowed text-gray-400 opacity-50;
        }
      }

      :host-context([type='checkbox'], [type='radio']) {
        @apply text-primary focus:ring-primary;
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
  standalone: true,
})
export class FormInputComponent {
  @Input()
  variant: InputVariant = 'outline';

  constructor(@Inject(FORM_INPUT_CONFIG) private readonly formInputConfig: FormInputGlobalConfig) {}

  @HostBinding('class')
  get classes() {
    return `zz-input zz-${this.variant} rounded-${[this.formInputConfig.rounded]}`;
  }
}

export type InputVariant = 'outline' | 'fill';

@NgModule({
  declarations: [],
  imports: [FormInputComponent],
  exports: [FormInputComponent],
})
export class FormInputModule {}

export interface FormInputGlobalConfig {
  rounded: 'sm' | 'md' | 'lg' | 'full' | 'none';
}

export const FORM_INPUT_CONFIG = new InjectionToken<FormInputGlobalConfig>(
  'Global Form Input Configuration',
  {
    providedIn: 'root',
    factory: () => ({
      rounded: 'md',
    }),
  }
);
