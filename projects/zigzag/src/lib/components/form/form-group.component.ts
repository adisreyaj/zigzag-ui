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
import { FormGroupErrorComponent, FormGroupErrorModule } from './form-group-error.component';
import { BehaviorSubject, map } from 'rxjs';
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
  standalone: true,
  imports: [FormGroupErrorComponent, CommonModule],
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
          map(() => this.ngControl?.control?.errors ?? undefined),
          map((errors?: ValidationErrors) => {
            if (errors && this.form?.id && this.id) {
              const errorKeys: string[] = Object.keys(errors);
              if (errorKeys.length > 0) {
                const key = `${this.form.id}.${this.id}.${errorKeys[0]}`;
                return this.errors[key];
              }
            }
            return '';
          })
        )
        .subscribe((value) => {
          this.errorSubject.next(value);
        });
  }
}

@NgModule({
  exports: [FormGroupComponent],
  imports: [FormGroupComponent, CommonModule, FormGroupErrorModule],
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
  'Form errors for the configured module',
  {
    providedIn: 'root',
    factory: () => ({}),
  }
);
