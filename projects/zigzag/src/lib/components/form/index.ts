import { FormComponent } from './form.component';
import { FormGroupComponent } from './form-group.component';
import { FormGroupErrorComponent } from './form-group-error.component';
import { FormGroupLabelComponent } from './form-group-label.component';
import { FormInputComponent } from './form-input.component';

export const FORM_COMPONENTS = [
  FormComponent,
  FormGroupComponent,
  FormGroupErrorComponent,
  FormGroupLabelComponent,
  FormInputComponent,
] as const;

export * from './form.component';
export * from './form-input.component';
export * from './form-group.component';
export * from './form-group-label.component';
export * from './form-group-error.component';
