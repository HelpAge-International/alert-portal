import {Component, OnInit} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  inactive: Boolean = true;
  errorMessage: any;

  localUser = {
    userEmail: '',
    password: ''
  };

  constructor(public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        // TODO - Check user type, navigate to dashboard
        this.router.navigate(['login']);
        console.log("Logged In");
      } else {
        // user is not logged in - Login page is presented
        this.router.navigate(['login']);
        console.log("Not Logged In");
      }
    });
  }

  onSubmit() {
    console.log("Login Button Pressed");
    if (this.validate()) {
      this.af.auth.login({
          email: this.localUser.userEmail,
          password: this.localUser.password
        },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password,
        }).then(
        (success) => {
          console.log(success);
          console.log(this.localUser.userEmail);
          console.log(this.localUser.password);
          // TODO - Check user type, navigate to relevant dashboard

          this.router.navigate(['system-admin']);
        }).catch(
        (err) => {
          this.errorMessage = err;
          this.inactive = false;
        })
      this.inactive = true;
    } else {
      this.inactive = false;
    }
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered,
   * if the email field is empty,
   * if the password field is empty,
   * @returns {boolean}
   */
  validate() {
    if ((!Boolean(this.localUser.userEmail)) && (!Boolean(this.localUser.password))) {
      this.errorMessage = "Please enter your email address and password to login";
      console.log("Please enter your email address and password to login");
      return false;

    } else if (!Boolean(this.localUser.userEmail)) {
      this.errorMessage = "Please enter your email address";
      console.log("Please enter your email address");
      return false;

    } else if (!Boolean(this.localUser.password)) {
      this.errorMessage = "Please enter your password";
      console.log("Please enter your password");
      return false;
    }
    return true;
  }

  ngOnInit() {
  }
}

//
//           /*switch (res.userType) {
//             case USER_TYPE.SYSTEM_ADMIN:
//               this._router.navigate(['system-admin']);
//               break;
//             case USER_TYPE.AGENCY_ADMIN:
//               this._router.navigate(['agency-admin']);
//               break;
//             // case USER_TYPE.COUNTRY_ADMIN:
//             //   this._router.navigate(['country-admin']);
//             //   break;
//             default:
//               this._router.navigate(['']); // Redirecting to login page
//           }*/


