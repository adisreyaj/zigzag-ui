import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';

@Component({
  selector: 'zz-form-group-error',
  template: ` <p>{{ error }}</p>`,
})
export class FormGroupErrorComponent {
  @Input()
  public error: Nullable<string>;
}

@NgModule({
  declarations: [FormGroupErrorComponent],
  exports: [FormGroupErrorComponent],
  imports: [CommonModule],
})
export class FormGroupErrorModule {}
