import { BaseDynamicControl } from './base-dynamic-control';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <select
        [id]="control.controlKey"
        [formControlName]="control.controlKey"
        [value]="control.config.value"
      >
        <option
          *ngFor="let option of control.config.options"
          [value]="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </ng-container>
  `,
  styles: [],
})
export class DynamicSelectComponent extends BaseDynamicControl {}
