import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    './template-forms-page.component.scss',
    '../../style/common-form.scss',
    '../../style/common-page.scss',
  ],
})
export class TemplateFormsPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - 1949)
      .fill('')
      .map((_, index) => now - index);
  }
}
