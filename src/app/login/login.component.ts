import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Constants } from "../utils/Constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  private inactive: Boolean = true;
  private errorMessage: string;
  private successInactive: Boolean = true;
  private successMessage: string;
  private emailEntered:string;

  private localUser = {
    userEmail: '',
    password: ''
  };

  constructor(public af: AngularFire, private router: Router, private route: ActivatedRoute) {

    // TODO - Remove if unnecessary
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl("/login");
        console.log("Logged In");
      } else {
        // user is not logged in - Login page is presented
        this.router.navigateByUrl("/login");
        console.log("Not Logged In");
      }
    });

    this.route.params
      .subscribe((params: Params) => {
        if (params["emailEntered"]) {
          this.successMessage = "FORGOT_PASSWORD.SUCCESS_MESSAGE";
          this.emailEntered = params["emailEntered"];
          this.successInactive = false;
          console.log("From Forgot Password");
        }
      });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.successInactive = true;

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
          this.af.database.list(Constants.APP_STATUS + '/systemAdmin', { preserveSnapshot: true})
            .subscribe(snapshots=>{
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigateByUrl("/system-admin");
                }
              });
            });
          this.af.database.list(Constants.APP_STATUS + '/administratorAgency', { preserveSnapshot: true})
            .subscribe(snapshots=>{
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigateByUrl("/agency-admin");
                }
              });
            });
          this.af.database.list(Constants.APP_STATUS + '/administratorCountry', { preserveSnapshot: true})
            .subscribe(snapshots=>{
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigateByUrl("/country-admin");
                }
              });
            });
        }).catch(
        (err) => {
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
   * if the email field is empty,
   * if the password field is empty,
   * @returns {boolean}
   */
  validate() {

    if ((!Boolean(this.localUser.userEmail)) && (!Boolean(this.localUser.password))) {
      this.errorMessage = "LOGIN.NO_DATA_ERROR";
      return false;
    } else if (!Boolean(this.localUser.userEmail)) {
      this.errorMessage = "LOGIN.NO_EMAIL_ERROR";
      return false;
    } else if (!Boolean(this.localUser.password)) {
      this.errorMessage = "LOGIN.NO_PASSWORD_ERROR";
      return false;
    }
    return true;

  }

}
