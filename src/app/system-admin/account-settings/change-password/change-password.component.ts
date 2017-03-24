import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  private uid: string;
  private successInactive: boolean = true;
  private succesMessage: string = 'Password successfully updated!';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private currentPasswordEntered: string;
  private newPasswordEntered: string;
  private confirmPasswordEntered: string;
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("System admin uid: " + this.uid)
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {
    console.log("Update password");
    console.log(this.currentPasswordEntered);
    console.log(this.newPasswordEntered);
    console.log(this.confirmPasswordEntered);

    if (this.newPasswordEntered != this.confirmPasswordEntered) {
      this.errorMessage = "Passwords don't match";
      this.errorInactive = false;
      Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.errorInactive = true;
      })
    }
  }
}
