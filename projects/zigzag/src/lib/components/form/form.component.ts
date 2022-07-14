import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zz-form',
  template: ` <ng-content></ng-content>`,
  standalone: true,
})
export class FormComponent {
  @Input()
  public id?: string;
}

@NgModule({
  declarations: [],
  exports: [FormComponent],
  imports: [FormComponent, CommonModule],
})
export class FormModule {}
