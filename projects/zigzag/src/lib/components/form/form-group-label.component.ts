import { Component, Input, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroupComponent } from './form-group.component';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';
import { isNil } from 'lodash-es';

@Component({
  selector: 'zz-form-group-label',
  template: ` <label
    class="relative mb-1 flex items-center gap-1 text-sm font-medium text-slate-500"
    [for]="labelFor"
  >
    <ng-content></ng-content>
    <ng-container *ngIf="isRequired">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" class="h-2 w-2 text-red-500">
        <path
          fill="currentColor"
          d="M503.7 990h-7.4c-41 0-74.6-33.6-74.6-74.6V84.6c0-41 33.6-74.6 74.6-74.6h7.4c41 0 74.6 33.6 74.6 74.6v830.6c.1 41.1-33.5 74.8-74.6 74.8z"
        />
        <path
          fill="currentColor"
          d="m77.5 748.2-3.7-6.5c-20.5-35.6-8.2-81.5 27.3-102.1l719.4-415.3c35.6-20.6 81.5-8.2 102.1 27.3l3.7 6.5c20.6 35.6 8.2 81.5-27.3 102.1L179.5 775.5c-35.5 20.6-81.5 8.2-102-27.3z"
        />
        <path
          fill="currentColor"
          d="m73.7 258.2 3.7-6.5c20.6-35.6 66.4-47.9 102.1-27.3l719.4 415.3c35.6 20.6 47.9 66.4 27.3 102.1l-3.7 6.5c-20.6 35.6-66.4 47.9-102.1 27.3L101.1 360.1c-35.6-20.4-47.8-66.4-27.4-101.9z"
        />
      </svg>
    </ng-container>
  </label>`,
  standalone: true,
  imports: [CommonModule],
})
export class FormGroupLabelComponent {
  isRequired = false;
  labelFor = '';

  constructor(@Optional() public readonly formGroup: FormGroupComponent) {
    this.labelFor = this.formGroup?.id ?? '';
  }

  @Input()
  set required(value: boolean | string) {
    if (typeof value === 'string') {
      this.isRequired = value === '';
    } else {
      this.isRequired = value;
    }
  }

  @Input()
  set for(value: Nullable<string>) {
    if (!isNil(value)) {
      this.labelFor = value;
    }
  }
}

@NgModule({
  declarations: [],
  exports: [FormGroupLabelComponent],
  imports: [FormGroupLabelComponent, CommonModule],
})
export class FormGroupLabelModule {}
