import { BaseDynamicControl } from './base-dynamic-control';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <input
        [formControlName]="control.controlKey"
        [id]="control.controlKey"
        [type]="control.config.type"
        [value]="control.config.value"
      />
    </ng-container>
  `,
  styles: [],
})
export class DynamicInputComponent extends BaseDynamicControl {}
