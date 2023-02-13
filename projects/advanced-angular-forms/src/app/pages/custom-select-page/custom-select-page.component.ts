import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'custom-form-controls';

@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  imports: [CommonModule, SelectModule],
  templateUrl: './custom-select-page.component.html',
  styleUrls: [
    './custom-select-page.component.scss',
    '../../style/common-page.scss',
  ],
})
export class CustomSelectPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
