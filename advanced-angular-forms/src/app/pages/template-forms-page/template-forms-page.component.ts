import { BannedWordsDirective } from './../../directives/validators/banned-words.directive';
import { PasswordShouldMatchDirective } from './../../directives/validators/password-should-match.directive';
import { UserInfo } from './../../model/user-info';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BannedWordsDirective,
    PasswordShouldMatchDirective,
  ],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    './template-forms-page.component.scss',
    '../../style/common-form.scss',
    '../../style/common-page.scss',
  ],
})
export class TemplateFormsPageComponent implements OnInit {
  public bannedWords = ['admin', 'administrator', 'super_admin', 'moderator'];
  userInfo: UserInfo = {
    firstName: 'Ouakala',
    lastName: 'Abdelaaziz',
    nickname: '',
    username: 'a.ouakala',
    email: '',
    yearOfBirth: 0,
    passport: '',
    fullAdress: '',
    city: '',
    postCode: 0,
    password: 123456,
    cofirmPassword: 0,
  };

  constructor() {}

  ngOnInit(): void {}

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - 1949)
      .fill('')
      .map((_, index) => now - index);
  }

  onSubmit(ngForm: NgForm, event: SubmitEvent) {
    console.log('ngForm' + ngForm);
    console.log('event' + event);
    console.log('Form submitted!');
    ngForm.reset();
    console.log('Form reset!');
  }
}
