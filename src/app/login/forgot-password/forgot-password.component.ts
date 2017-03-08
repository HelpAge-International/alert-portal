import { Component, OnInit, Inject } from '@angular/core';
import {AngularFire, FirebaseApp, AuthProviders, AuthMethods} from 'angularfire2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  private inactive: Boolean = true;
  private errorMessage: any;
  private email: string = '';
  private auth: any;

  constructor(@Inject(FirebaseApp) fa: any, private router: Router) {
    this.auth = fa.auth();
  }

  onSubmit() {

    if (this.validate()) {
      this.auth.sendPasswordResetEmail(this.email).then(
        (success) => {
          console.log("Password reset email sent");
          this.router.navigate(['login']);
        }).catch(
        (err) => {
          this.errorMessage = err;
          this.inactive = false;
        });
      this.inactive = true;

    } else {
      this.inactive = false;
    }
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered,
   * @returns {boolean}
   */
  validate() {
    if (!Boolean(this.email)) {
      this.errorMessage = "Please enter your email address";
      return false;
    }
    return true;
  }

  ngOnInit() {
  }

}
