import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isSet = false;
  passwordType = 'password';
  errorMessage='';

  constructor(private authService: AuthService, fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<LoginComponent>) {
    this.loginForm = fb.group({
      emailFormControl: ['', [Validators.required, Validators.email]],
      passwordFormControl: ['', [Validators.required, Validators.minLength(8), Validators.pattern('.*[0-9].*')]]
    });
  }

  ngOnInit(): void {
    this.authService.isRemembered().subscribe((data: Boolean) => {
      if (data) {
        this.authService.getCurrentLoginDetails().subscribe((userData?: User) => {
          this.loginForm.setValue({
            emailFormControl: userData?.email,
            passwordFormControl: userData?.password
          });
          this.isSet = true;
        });
      }
    });
  }

  onKeyDown(event: Event) {
    event.stopPropagation();
  }

  save(form: FormGroup) {
    let finalData = { email: this.loginForm.get('emailFormControl')?.value, password: this.loginForm.get('passwordFormControl')?.value }
    if (form.valid) {
      this.authService.login(finalData).subscribe((res) => {
        if (res.body.success == true) {
          const user = res.body.user;
          this.authService.setCurrentUserData(finalData, this.isSet);
          sessionStorage.setItem("user", JSON.stringify(user));

          if (user.roles.indexOf("Admin") > -1) {
            this.authService.setCurentRole('Admin')
          }

          else if (user.roles.indexOf("User") > -1) {
            this.authService.setCurentRole('User');
          }
          this.dialogRef.close(user);
        }
        if(res.body.success===false){
          this.errorMessage=res.body.message;
        }
      });
    }
  }
}
