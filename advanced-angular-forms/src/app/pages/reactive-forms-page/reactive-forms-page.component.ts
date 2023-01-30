import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  public userForm = new FormGroup({
    firstName: new FormControl('Ouakala'),
    lastName: new FormControl('Abdelaaziz'),
    username: new FormControl('a.ouakala'),
    nickname: new FormControl(''),
    email: new FormControl(''),
    yearOfBirth: new FormControl(''),
    passport: new FormControl(''),
    fullAddress: new FormControl(''),
    city: new FormControl(''),
    postCode: new FormControl(''),
  });

  constructor() {}

  ngOnInit(): void {}

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - 1949)
      .fill('')
      .map((_, index) => now - index);
  }
}
