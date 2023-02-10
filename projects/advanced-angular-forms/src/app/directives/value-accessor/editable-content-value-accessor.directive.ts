import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  SecurityContext,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

const DEFAULT_REVIEW_TEMPLATE = `
  <h4 data-placeholder="Title..."></h4>
  <p data-placeholder="Describe Your Experiance..."></p>
`;

@Directive({
  selector: '[formControlName][contenteditable],[ngModel][contenteditable]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EditableContentValueAccessorDirective,
      multi: true,
    },
  ],
})
export class EditableContentValueAccessorDirective
  implements ControlValueAccessor
{
  onChange!: (newValue: string) => void;
  onTouch!: () => void;

  @HostListener('input', ['$event'])
  onInput(e: Event) {
    this.onChange((e.target as HTMLElement).innerHTML);
  }
  @HostListener('blur')
  onBlur() {
    this.onTouch();
  }

  constructor(
    private _randerer: Renderer2,
    private _elementRef: ElementRef,
    private _domSanitizer: DomSanitizer
  ) {}

  writeValue(obj: any): void {
    this._randerer.setProperty(
      this._elementRef.nativeElement,
      'innerHTML',
      this._domSanitizer.sanitize(SecurityContext.HTML, obj) ||
        DEFAULT_REVIEW_TEMPLATE
    );
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._randerer.setProperty(
      this._elementRef.nativeElement,
      'contentEditable',
      !isDisabled
    );
  }
}
