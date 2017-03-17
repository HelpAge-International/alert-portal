import { Component, OnInit, Inject } from '@angular/core';
import {FirebaseApp} from 'angularfire2';
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

  ngOnInit() {
  }

  onSubmit() {

    if (this.validate()) {

      this.auth.sendPasswordResetEmail(this.email)
        .then((success) => {
          console.log("Password reset email sent");
          this.router.navigate(['/login', {emailEntered: this.email}]);
        })
        .catch((err) => {
          this.errorMessage = "GLOBAL.GENERAL_ERROR";
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
      this.errorMessage = "FORGOT_PASSWORD.NO_EMAIL_ERROR";
      return false;
    }
    return true;

  }



}
