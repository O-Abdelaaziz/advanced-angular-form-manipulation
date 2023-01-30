import { UserSkillsService } from './../../services/user-skills.service';
import { Observable, tap } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

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

  public userForm = new FormGroup({
    //(property) firstName: FormControl<string | null> because if we want to rest the control is become null
    firstName: new FormControl<string>('Ouakala'),
    lastName: new FormControl<string>('Abdelaaziz'),
    //in this scenario username can't be null and a.ouakala is the default value when reset the form.
    username: new FormControl<string>('a.ouakala', { nonNullable: true }),
    nickname: new FormControl(''),
    email: new FormControl(''),
    yearOfBirth: new FormControl(''),
    passport: new FormControl(''),
    address: new FormGroup({
      fullAddress: new FormControl(''),
      city: new FormControl(''),
      postCode: new FormControl(''),
    }),
    phones: new FormArray([
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
        phone: new FormControl(''),
      }),
    ]),
    skills: new FormGroup<{ [key: string]: FormControl<boolean> }>({}),
  });

  constructor(private _userSkills: UserSkillsService) {}

  ngOnInit(): void {
    this.skills$ = this._userSkills
      .getSkills()
      .pipe(tap((skills) => this.buildSkillControls(skills)));
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
