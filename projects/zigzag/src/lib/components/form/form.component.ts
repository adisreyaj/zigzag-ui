import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';

@Component({
  selector: 'zz-form',
  template: ` <ng-content></ng-content>`,
  standalone: true,
})
export class FormComponent {
  @Input()
  public id: Nullable<string>;
}

@NgModule({
  declarations: [],
  exports: [FormComponent],
  imports: [FormComponent, CommonModule],
})
export class FormModule {}
