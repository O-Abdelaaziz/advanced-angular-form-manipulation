import { UserService } from './../../services/user.service';
import { Directive, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of, finalize } from 'rxjs';

@Directive({
  selector: '[appUniqueUsername]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueUsernameDirective,
      multi: true,
    },
  ],
})
export class UniqueUsernameDirective implements AsyncValidator {
  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  validate(
    control: AbstractControl<string>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.userService.checkUsername(control.value).pipe(
      map((users) => {
        return users.length === 0
          ? null
          : { appUniqueUsername: { isTaken: true } };
      }),
      catchError(() => of({ appUniqueUsername: { unknownError: true } })),
      finalize(() => this.changeDetectorRef.markForCheck())
    );
  }
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }
}
