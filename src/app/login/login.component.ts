import {Component, OnInit} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
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

  systemAdmins: FirebaseListObservable<any>;
  agencyAdmins: FirebaseListObservable<any>;
  countryAdmins: FirebaseListObservable<any>;

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
          //console.log(success);
          // TODO - FIX - Remove .subscribe and use something similar like observeSingleEvent(iOS)
          this.af.database.list('sand/systemAdmin', { preserveSnapshot: true})
            .subscribe(snapshots=>{
              snapshots.forEach(snapshot => {
                console.log(snapshot.key, snapshot.val());
                if (snapshot.key == success.uid) {
                  this.router.navigate(['system-admin']);
                }
              });
            });
          this.af.database.list('sand/administratorAgency', { preserveSnapshot: true})
            .subscribe(snapshots=>{
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigate(['agency-admin']);
                }
              });
            });
          // TODO - Uncomment when the country admin is setup
          /*this.af.database.list('sand/administratorCountry', { preserveSnapshot: true})
            .subscribe(snapshots=>{
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigate(['country-admin']);
                } else {
                  console.log("Not a country admin")
                }
              });
            });*/

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
      return false;
    } else if (!Boolean(this.localUser.userEmail)) {
      this.errorMessage = "Please enter your email address";
      return false;
    } else if (!Boolean(this.localUser.password)) {
      this.errorMessage = "Please enter your password";
      return false;
    }
    return true;
  }

  ngOnInit() {
  }

}
