import { UserSkillsService } from './../../services/user-skills.service';
import { Observable, tap } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
export class ReactiveFormsPageComponent implements OnInit {
  public phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];
  public skills$!: Observable<string[]>;

  public userForm = this._formBuilder.group({
    firstName: ['Ouakala', [Validators.required, Validators.minLength(2)]],
    lastName: ['Abdelaaziz', Validators.required],
    username: ['a.ouakala', Validators.required],
    nickname: '',
    email: '',
    yearOfBirth: this._formBuilder.nonNullable.control(
      this.years[this.years.length - 1]
    ),
    passport: '',
    address: this._formBuilder.group({
      fullAddress: this._formBuilder.nonNullable.control(''),
      city: this._formBuilder.nonNullable.control(''),
      postCode: this._formBuilder.nonNullable.control(0),
    }),
    phones: this._formBuilder.array([
      this._formBuilder.group({
        label: this._formBuilder.nonNullable.control(this.phoneLabels[0]),
        phone: '',
      }),
    ]),
    //FormRecord extends FormGroup{<[key: string]: TControl}>{}
    skills: this._formBuilder.record<FormControl<boolean>>({}),
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
}
