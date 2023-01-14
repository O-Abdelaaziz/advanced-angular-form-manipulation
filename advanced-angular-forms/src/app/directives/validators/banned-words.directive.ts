import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appBannedWords]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: BannedWordsDirective, multi: true },
  ],
})
export class BannedWordsDirective implements Validator {
  private bannedWords: string[] = [];
  constructor() {}

  validate(control: AbstractControl<string>): ValidationErrors | null {
    const foundBannedWord = this.bannedWords.find(
      (word) => word.toLowerCase() === control.value?.toLowerCase()
    );
    return !foundBannedWord
      ? null
      : { appBannedWords: { bannedWord: foundBannedWord } };
  }

  @Input()
  set appBannedWords(value: string | string[]) {
    this.bannedWords = Array.isArray(value) ? value : [value];
  }
}
