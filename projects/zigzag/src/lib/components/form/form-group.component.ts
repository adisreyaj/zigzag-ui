import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  InjectionToken,
  Input,
  ModuleWithProviders,
  NgModule,
  Optional,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ValidationErrors } from '@angular/forms';
import { FormGroupErrorModule } from './form-group-error.component';
import { BehaviorSubject, map, tap } from 'rxjs';
import { get, isNil } from 'lodash-es';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';
import { FormComponent } from './form.component';

@Component({
  selector: 'zz-form-group',
  template: `
    <ng-content></ng-content>
    <section class="absolute bottom-2 left-0 text-sm text-red-500">
      <zz-form-group-error [error]="error$ | async"></zz-form-group-error>
    </section>
  `,
  styles: [
    `
      :host {
        @apply relative pb-8;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FormGroupComponent implements AfterContentInit {
  @Input()
  id!: string;

  @ContentChild(NgControl) ngControl: NgControl | undefined;
  private readonly errorSubject = new BehaviorSubject<string>('');
  error$ = this.errorSubject.asObservable();

  constructor(
    @Inject(FORM_ERRORS) private readonly errors: Record<string, string>,
    @Optional() private readonly form: FormComponent
  ) {}

  get control() {
    return this.ngControl?.control;
  }

  ngAfterContentInit() {
    if (this.control?.valueChanges)
      this.control.statusChanges
        .pipe(
          tap(console.log),
          map(() => this.ngControl?.control?.errors),
          map((errors: Nullable<ValidationErrors>) => {
            if (errors) {
              const errorKeys: string[] = Object.keys(errors);
              if (!isNil(errors) && errorKeys.length > 0) {
                const key = `${this.form.id}.${this.id}.${errorKeys[0]}`;
                return get(this.errors, key);
              }
            }
            return '';
          }),
          tap((value) => {
            console.log(value, this.control);
          })
        )
        .subscribe((value) => {
          this.errorSubject.next(value);
        });
  }
}

@NgModule({
  declarations: [FormGroupComponent],
  exports: [FormGroupComponent],
  imports: [CommonModule, FormGroupErrorModule],
})
export class FormGroupModule {
  static configure(errors: Record<string, unknown>): ModuleWithProviders<any> {
    return {
      ngModule: FormGroupModule,
      providers: [
        {
          provide: FORM_ERRORS,
          useValue: errors,
        },
      ],
    };
  }
}

export const FORM_ERRORS = new InjectionToken<Record<string, unknown>>(
  'Form errors for the configured module'
);
