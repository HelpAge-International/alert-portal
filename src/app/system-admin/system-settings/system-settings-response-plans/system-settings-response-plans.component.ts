import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Constants} from "../../../utils/Constants";
import {ModelSystem} from "../../../model/system.model";
import {RxHelper} from "../../../utils/RxHelper";

@Component({
  selector: 'app-system-settings-response-plans',
  templateUrl: './system-settings-response-plans.component.html',
  styleUrls: ['./system-settings-response-plans.component.css']
})
export class SystemSettingsResponsePlansComponent implements OnInit, OnDestroy {

  private uid: string;

  private alerts = {};
  private errorMessage: string;
  private successMessage: string;
  private errorInactive: boolean = true;
  private successInactive: boolean = true;

  private groups: FirebaseListObservable<any> ;
  private modelSystem: ModelSystem;
  private newGroup: string;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.groups = this.af.database.list(Constants.APP_STATUS + "/system/" + this.uid + '/groups');
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH)
      }
    });
    this.subscriptions.add(subscription)
  }

  ngOnDestroy() {

    this.subscriptions.releaseAll();
  }

  addGroup() {

    if (this.validateNewGroup() && this.newGroup) {
      this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid + "/groups" + '/' + this.newGroup).set(true).then(_ => {
        console.log('New group added');
        this.newGroup = '';
        this.successMessage = 'New group added';
        this.showAlert(false);
      })
    } else {
      this.showAlert(true);
    }
  }

  private showAlert(error: boolean) {

    if (error) {
      this.errorInactive = false;
      let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.errorInactive = true;
      });
      this.subscriptions.add(subscription);
    } else {
      this.successInactive = false;
      let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.successInactive = true;
      });
      this.subscriptions.add(subscription);
    }
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validateNewGroup() {

    if (!(this.newGroup)) {
      this.alerts[this.newGroup] = true;
      this.errorMessage = "Please enter the group name to add the new group";
      return false;
    }
    return true;
  }
}
