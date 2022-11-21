import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgModule,
} from '@angular/core';

@Component({
  selector: '[zzButton]',
  template: ` <ng-content></ng-content>`,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ButtonComponent {
  @Input()
  variant: ButtonVariant = 'neutral';

  @Input()
  size: ButtonSize = 'base';

  constructor(@Inject(BUTTON_CONFIG) private readonly buttonConfig: ButtonGlobalConfig) {}

  @HostBinding('class')
  get classes() {
    return `zz-button zz-button-${this.variant} size-${this.size} rounded-${[
      this.buttonConfig.rounded,
    ]}`;
  }
}

export type ButtonSize = 'sm' | 'base' | 'md' | 'lg';
export type ButtonVariant =
  | 'link'
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

export interface ButtonGlobalConfig {
  rounded: 'sm' | 'md' | 'lg' | 'full';
}

export const BUTTON_CONFIG = new InjectionToken<ButtonGlobalConfig>('Global Button Configuration', {
  providedIn: 'root',
  factory: () => ({
    rounded: 'md',
  }),
});
