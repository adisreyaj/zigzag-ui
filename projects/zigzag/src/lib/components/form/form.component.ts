import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';

@Component({
  selector: 'zz-form',
  template: `<ng-content></ng-content>`,
})
export class FormComponent {
  @Input()
  public id: Nullable<string>;
}

@NgModule({
  declarations: [FormComponent],
  exports: [FormComponent],
  imports: [CommonModule],
})
export class FormModule {}
