import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'custom-form-controls';

const c = console.log.bind(this);
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

  public onSelectionChanged(event: string | null) {
   // console.log(event);

    c(event);
  }
}
