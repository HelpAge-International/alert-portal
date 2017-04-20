import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Constants} from "../../../utils/Constants";
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

  private isEditing: boolean = false;
  private editedGroups: any = [];
  private groups: FirebaseListObservable<any>;
  private groupsToShow: string[] = [];

  private newGroup: string;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.groups = this.af.database.list(Constants.APP_STATUS + "/system/" + this.uid + '/groups');
        this.storeGroups();
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH)
      }
    });
    this.subscriptions.add(subscription)
  }

  private storeGroups() {

    this.groups.forEach(groupsList => {
      this.groupsToShow = [];
      groupsList.forEach(group => {
        this.groupsToShow.push(group.$key);
      });
      return this.groupsToShow;
    });
  }

  ngOnDestroy() {

    this.subscriptions.releaseAll();
  }

  addGroup() {

    if (this.validateNewGroup() && this.newGroup) {
      this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid + "/groups" + '/' + this.newGroup).set(true).then(_ => {
        console.log('New group added');
        this.newGroup = '';
        this.successMessage = "SYSTEM_ADMIN.SETTING.SUCCESS_ADD_GROUP";
        this.showAlert(false);
      });
      this.storeGroups();
    } else {
      this.showAlert(true);
    }
  }

  editGroups(event) {
    this.isEditing = true;
    console.log("isEditing : " + this.isEditing);
  }

  setGroupValue(prop, value) {

    this.editedGroups[prop] = {
      "new_key": value,
      "value": true
    };
  }

  cancelEditGroups(event) {

    this.isEditing = false;
    this.editedGroups = {};
  }

  saveEditedGroups(event) {
    if (this.validateEditedGroups()) {
      for (var group in this.editedGroups) {
        this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid + '/groups/' + group).remove();

        let groups = this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid + '/groups');

        var newGroup = {};
        newGroup[this.editedGroups[group]["new_key"]] = this.editedGroups[group]["value"];
        groups.update(newGroup).then(_ => {
          console.log("Editing successful");
        }).catch(error => {
          this.errorMessage = "GLOBAL.GENERAL_ERROR";
          this.showAlert(true);
          console.log("Editing unsuccessful");
        });
      }
      this.isEditing = false;
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
  private validateEditedGroups() {

    for (var group in this.editedGroups) {
      if (!(this.editedGroups[group]["new_key"])) {
        this.errorMessage = "SYSTEM_ADMIN.SETTING.ERROR_NO_EDIT_GROUP_NAME";
        return false;
      }
    }
    return true;
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validateNewGroup() {

    if (!(this.newGroup)) {
      this.alerts[this.newGroup] = true;
      let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.alerts[this.newGroup] = false;
      });
      this.subscriptions.add(subscription);
      this.errorMessage = "SYSTEM_ADMIN.SETTING.ERROR_NO_GROUP_NAME";
      return false;
    }
    return true;
  }
}
