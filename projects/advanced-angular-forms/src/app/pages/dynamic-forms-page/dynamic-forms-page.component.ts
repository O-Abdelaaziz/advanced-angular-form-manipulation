import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: [
    './dynamic-forms-page.component.scss',
    '../../style/common-page.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsPageComponent implements OnInit {
  protected formLoadingTrigger: Subject<'user' | 'company'> = new Subject<
    'user' | 'company'
  >();

  protected formConfig$!: Observable<object>;

  constructor(private _httpClient: HttpClient) {}

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger.pipe(
      switchMap((config) => this._httpClient.get(`assets/${config}.form.json`))
    );
  }
}
