import { banWords } from 'src/app/validators/ban-words.validator';
import { UserSkillsService } from './../../services/user-skills.service';
import { Observable, startWith, Subscription, tap } from 'rxjs';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordShouldMatch } from 'src/app/validators/password-should-match.validator';

// interface Address {
//   fullAddress: FormControl<string>;
//   city?: FormControl<string>;
//   postCode?: FormControl<string>;
// }

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: [
    './reactive-forms-page.component.scss',
    '../../style/common-form.scss',
    '../../style/common-page.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormsPageComponent implements OnInit, OnDestroy {
  public phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];
  public skills$!: Observable<string[]>;
  public ageValidators!: Subscription;

  public userForm = this._formBuilder.group({
    firstName: [
      'Ouakala',
      [
        Validators.required,
        Validators.minLength(2),
        banWords(['admin', 'dummy']),
      ],
    ],
    lastName: ['Abdelaaziz', [Validators.required, Validators.minLength(2)]],
    nickname: [
      'a.ouakala',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[\w.]+$/),
      ],
    ],
    username: ['', [Validators.required, Validators.minLength(2)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(2)],
    ],
    yearOfBirth: this._formBuilder.nonNullable.control(
      this.years[this.years.length - 1]
    ),
    passport: ['', [Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)]],
    address: this._formBuilder.group({
      fullAddress: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
    }),
    phones: this._formBuilder.array([
      this._formBuilder.group({
        label: this._formBuilder.nonNullable.control(this.phoneLabels[0]),
        phone: '',
      }),
    ]),
    skills: this._formBuilder.record<FormControl<boolean>>({}),
    password: this._formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: '',
      },
      { validator: passwordShouldMatch }
    ),
  });

  constructor(
    private _userSkills: UserSkillsService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.skills$ = this._userSkills
      .getSkills()
      .pipe(tap((skills) => this.buildSkillControls(skills)));
    // this.userForm.controls.address.addControl('city', new FormControl());

    this.ageValidators = this.userForm.controls.yearOfBirth.valueChanges
      .pipe(
        tap(() => this.userForm.controls.passport.markAsDirty()),
        startWith(this.userForm.controls.yearOfBirth.value)
      )
      .subscribe((yearOfBirth) => {
        this.isAdult(yearOfBirth)
          ? this.userForm.controls.passport.addValidators(Validators.required)
          : this.userForm.controls.passport.removeValidators(
              Validators.required
            );
        this.userForm.controls.passport.updateValueAndValidity();
      });
  }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - 1949)
      .fill('')
      .map((_, index) => now - index);
  }

  public onAddPhone() {
    console.log('add phone button clicked!!!');
    this.userForm.controls.phones.insert(
      0,
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
        phone: new FormControl(''),
      })
    );
  }

  public onRemovePhone(index: number) {
    console.log('remove phone button clicked!!!');
    this.userForm.controls.phones.removeAt(index);
  }

  public onSubmit(event: Event) {
    console.log('Form submitted: ' + this.userForm.value);
    this.userForm.controls.username.reset();
  }

  private buildSkillControls(skills: string[]) {
    skills.forEach((skill) =>
      this.userForm.controls.skills.addControl(
        skill,
        new FormControl(false, { nonNullable: true })
      )
    );
  }

  private isAdult(yearOfBirth: number): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth >= 18;
  }

  ngOnDestroy(): void {
    this.ageValidators.unsubscribe();
  }
}
