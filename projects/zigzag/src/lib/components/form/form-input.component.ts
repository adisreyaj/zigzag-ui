import { Component, HostBinding, Input, NgModule } from '@angular/core';

@Component({
  selector: '[zzInput]',
  template: ` <ng-content></ng-content>`,
  styles: [
    //language=SCSS
    `
      :host-context(.outline) {
        @apply border border-slate-400;
        @apply focus:border-transparent;
        &:disabled {
          @apply border-slate-300;
        }
      }

      :host-context([type='text'], [type='email'], [type='number'], [type='url'], [type='password']) {
        @apply focus:ring-1 focus:ring-primary;
        @apply outline-none p-2;
        @apply focus:border-primary;
        transition: all 0.3s;

        &::placeholder {
          @apply text-gray-300;
        }

        &:disabled {
          @apply text-gray-400 cursor-not-allowed;
        }
      }

      :host-context([type='checkbox'], [type='radio']) {
        @apply text-primary focus:ring-primary;
      }

      :host-context(.fill) {
        @apply border-slate-300 bg-slate-100 focus:ring-2;
      }
    `,
  ],
})
export class FormInputComponent {
  @Input()
  variant: InputVariant = 'outline';

  @HostBinding('class')
  get classes() {
    return `zz-input ${this.variant}`;
  }
}

export type InputVariant = 'outline' | 'fill';

@NgModule({
  declarations: [FormInputComponent],
  imports: [],
  exports: [FormInputComponent],
})
export class FormInputModule {}
