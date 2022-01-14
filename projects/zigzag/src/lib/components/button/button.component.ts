import { ChangeDetectionStrategy, Component, HostBinding, Input, NgModule } from '@angular/core';

@Component({
  selector: '[zzButton]',
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input()
  variant: ButtonVariant = 'neutral';

  @Input()
  size: ButtonSize = 'base';

  @HostBinding('class')
  get classes() {
    return `zz-button ${this.variant} ${this.size}`;
  }
}

export type ButtonSize = 'sm' | 'base' | 'md' | 'lg';
export type ButtonVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'outline';

@NgModule({
  declarations: [ButtonComponent],
  imports: [],
  exports: [ButtonComponent],
})
export class ButtonModule {}
