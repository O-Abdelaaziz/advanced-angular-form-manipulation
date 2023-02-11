import { EditableContentValueAccessorDirective } from './../../directives/value-accessor/editable-content-value-accessor.directive';
import { FormBuilder, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@polymer/paper-input/paper-textarea';
import { RatingOptions, RatingPickerComponent } from 'custom-form-controls';

interface Rating {
  reviewText: string;
  reviewRating: RatingOptions;
}

@Component({
  selector: 'app-custom-rating-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditableContentValueAccessorDirective,
    RatingPickerComponent,
  ],
  templateUrl: './custom-rating-picker.component.html',
  styleUrls: [
    './custom-rating-picker.component.scss',
    '../../style/common-form.scss',
    '../../style/common-page.scss',
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomRatingPickerComponent implements OnInit {
  public form = this._formBuilder.group<Rating>({
    reviewText: '',
    reviewRating: 'great',
  });

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  public onSubmit() {
    console.log(this.form.value);
  }
}
