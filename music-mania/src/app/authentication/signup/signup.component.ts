import { Component, Optional } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { countryList } from '../../common/constants';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  passwordType = 'password';
  signUpForm: UntypedFormGroup;
  errorMessage = '';
  countries = countryList;
  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService, fb: UntypedFormBuilder,
    @Optional() public dialogRef: MatDialogRef<LoginComponent>) {
    this.signUpForm = fb.group({
      firstNameFormControl: ['', [Validators.required]],
      lastNameFormControl: [''],
      emailFormControl: ['', [Validators.required, Validators.email]],
      confirmPasswordFormControl: [''],
      passwordFormControl: ['', [Validators.required, Validators.minLength(8), Validators.pattern('.*[0-9].*')]],
      phoneFormControl: ['', [Validators.required, Validators.minLength(10)]],
      nationalityFormControl: ['', [Validators.required]]
    }, { validators: this.validateAreEqual });
  }

  public validateAreEqual: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('passwordFormControl')?.value;
    let confirmPass = group.get('confirmPasswordFormControl')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  onKeyDown(event: Event) {
    event.stopPropagation();
  }

  save(form: UntypedFormGroup) {
    let finalData: User = {
      email: this.signUpForm.get('emailFormControl')?.value,
      password: this.signUpForm.get('passwordFormControl')?.value,
      contact: this.signUpForm.get('phoneFormControl')?.value,
      firstName: this.signUpForm.get('firstNameFormControl')?.value,
      lastName: this.signUpForm.get('lastNameFormControl')?.value,
      country: this.signUpForm.get('nationalityFormControl')?.value,
      liked: []
    }
    if (form.valid) {
      this.authService.signUp(finalData).subscribe((res) => {
        if (res.body.success == true) {
          this.dialogRef.close('success');
        }
        if (res.body.success === false) {
          this.errorMessage = res.body.message;
        }
      });
    }
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
    return invalidCtrl || invalidParent;
  }
}