import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class EmailValidator {
 static emailMatchingValidatior: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const email = control.get('email');
    const confirmEmail = control.get('confirm_email');
    return email?.value === confirmEmail?.value
      ? null
      : {notmatched: true} ;
  };
}
