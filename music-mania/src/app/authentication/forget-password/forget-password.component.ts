import { Component, Inject, Optional } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MyErrorStateMatcher } from '../signup/signup.component';

export interface ForgetPasswordResult {
  contact: { [key: string]: string };
  email: string;
  length: number;
}

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  passwordType = 'password';
  emailFormGroup: UntypedFormGroup;
  contactFormGroup: UntypedFormGroup;
  passwordFormGroup: UntypedFormGroup;
  contact: any = [];
  matcher = new MyErrorStateMatcher();
  updateError = "";
  forgetError = "";

  constructor(private _formBuilder: UntypedFormBuilder, private authService: AuthService,
    @Optional() public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }) {
    this.emailFormGroup = this._formBuilder.group({
      emailFormControl: [data.email || '', [Validators.required, Validators.email]],
    });

    this.contactFormGroup = this._formBuilder.group({
      contacts: new UntypedFormArray([])
    });

    this.passwordFormGroup = this._formBuilder.group({
      passwordFormControl: ['', [Validators.required, Validators.minLength(8), Validators.pattern('.*[0-9].*')]],
      confirmPasswordFormControl: ['', Validators.required],
    }, { validators: this.validateAreEqual });
  }

  public validateAreEqual: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('passwordFormControl')?.value;
    let confirmPass = group.get('confirmPasswordFormControl')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  forgetPassword() {
    this.authService.forgetPassword({ email: this.emailFormGroup.get('emailFormControl')?.value }).subscribe((data: any) => {
      if (data.body.success) {
        let result: ForgetPasswordResult = data.body.user;
        let length = result.length;
        this.contact = Object.entries(result.contact).reduce((ini, [k, v]) => (ini.splice(k as unknown as number, 1, v), ini), new Array(length).fill(null))
        this.setContact();
        this.forgetError = "";
      }
      else {
        this.forgetError = data.body.message;
      }
    })
  }

  submit() {
    const output = {
      email: this.emailFormGroup.get('emailFormControl')?.value,
      contact: this.contactFormGroup.get('contacts')?.value.join(''),
      password: this.passwordFormGroup.get('passwordFormControl')?.value
    }
    this.authService.updatePassword(output).subscribe((res) => {
      if (res.body.success == true) {
        this.dialogRef.close();
      }
      else {
        this.updateError = res.body.message;
      }
    });;
  }

  setContact() {
    for (let i = 0; i < this.contact.length; ++i) {
      if (this.contact.length !== this.contactFormGroup.get('contacts')?.value?.length) {
        const control = new UntypedFormControl(this.contactFormGroup.get('contacts')?.value[i] || this.contact[i] || null, [Validators.required]);
        (<UntypedFormArray>this.contactFormGroup.get('contacts')).push(control);
      }
    }
  }

  onKeyDown(event: Event) {
    event.stopPropagation();
  }

  getControls() {
    return (this.contactFormGroup.get('contacts') as UntypedFormArray).controls;
  }

  onContactKeyDown(i: number, e: KeyboardEvent, isFiredNow: boolean = true) {
    if (e.keyCode === 8) {
      let currValue = document.getElementById("array-" + i);
      if (isFiredNow) {
        (<UntypedFormArray>this.contactFormGroup.get('contacts')).at(i)?.patchValue(null);
      }
      if (i >= 0) {
        let prevValue = document.getElementById("array-" + (i - 1));
        if (prevValue?.hasAttribute("readonly")) {
          this.onContactKeyDown(i - 1, e, false);
        } else {
          setTimeout((index = i - 1) => {
            document.getElementById("array-" + (index))?.focus();
          }, 10);
        }
      }
      if (i === 0)
        currValue?.blur();
    }

    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      let currValue = document.getElementById("array-" + i);
      if (isFiredNow) {
        (<UntypedFormArray>this.contactFormGroup.get('contacts')).at(i)?.patchValue(String.fromCharCode(e.keyCode));
      }

      if (i < this.contact.length - 1) {
        let nextValue = document.getElementById("array-" + (i + 1));

        if (nextValue?.hasAttribute("readonly")) {
          this.onContactKeyDown(i + 1, e, false);
        } else {
          setTimeout((index = i + 1) => {
            document.getElementById("array-" + (index))?.focus();
          }, 10);
        }
        currValue?.blur();
      }
    }
    e.stopPropagation();
  }

  isValidFormArray() {
    let result = true;
    for (let j = 0; j < (<UntypedFormArray>this.contactFormGroup.get('contacts')).value.length; ++j) {
      result = result && ((<UntypedFormArray>this.contactFormGroup.get('contacts')).value[j] !== null);
    }
    return result;
  }
}
