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

  private successInactive: boolean = true;
  private succesMessage: string = 'Password successfully updated!';
  private errorInactive: boolean = true;
  private errorMessage: string = 'No changes made!';
  private currentPasswordEntered: string;
  private newPasswordEntered: string;
  private confirmPasswordEntered: string;
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {
    console.log("Update password");
    console.log(this.currentPasswordEntered);
    console.log(this.newPasswordEntered);
    console.log(this.confirmPasswordEntered);
  }
}
