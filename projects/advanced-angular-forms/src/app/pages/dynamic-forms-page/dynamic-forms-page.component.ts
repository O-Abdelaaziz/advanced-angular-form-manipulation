import { DynamicControl } from './../../model/dynamic-forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { DynamicFormConfig } from '../../model/dynamic-forms';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { banWords } from '../../validators/ban-words.validator';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: [
    './dynamic-forms-page.component.scss',
    '../../style/common-page.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsPageComponent implements OnInit {
  public form!: FormGroup;
  protected formLoadingTrigger: Subject<'user' | 'company'> = new Subject<
    'user' | 'company'
  >();

  protected formConfig$!: Observable<DynamicFormConfig>;

  constructor(private _httpClient: HttpClient) {}

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger.pipe(
      switchMap((config) =>
        this._httpClient.get<DynamicFormConfig>(`assets/${config}.form.json`)
      ),
      tap(({ controls }) => this.buildForm(controls))
    );
  }

  public buildForm(controls: DynamicFormConfig['controls']): void {
    this.form = new FormGroup({});
    Object.keys(controls).forEach((key) => {
      const vlaidators = this.resolveValidators(controls[key]);
      this.form.addControl(
        key,
        new FormControl(controls[key].value, vlaidators)
      );
    });
  }

  private resolveValidators({ validators = {} }: DynamicControl) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map(
      (validatorKey) => {
        const validatorValue = validators[validatorKey];
        if (validatorKey == 'required') {
          return Validators.required;
        }
        if (validatorKey == 'minLength' && typeof validatorValue == 'number') {
          return Validators.minLength(validatorValue);
        }
        if (validatorKey == 'email') {
          return Validators.email;
        }
        if (validatorKey == 'banWords' && Array.isArray(validatorValue)) {
          return banWords(validatorValue);
        }
        return Validators.nullValidator;
      }
    );
  }

  public onSubmitForm() {
    console.log('Form Submited ' + this.form.value);
    this.form.reset();
  }
}
