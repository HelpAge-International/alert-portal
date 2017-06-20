import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {Constants} from "../../../utils/Constants";
import {PageControlService} from "../../../services/pagecontrol.service";

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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.groups = this.af.database.list(Constants.APP_STATUS + "/system/" + this.uid + '/groups');
        this.storeGroups();
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
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

  private storeGroups() {

    this.groups.forEach(groupsList => {
      this.groupsToShow = [];
      groupsList.forEach(group => {
        this.groupsToShow.push(group.$key);
      });
      return this.groupsToShow;
    });
  }

  private showAlert(error: boolean) {

    if (error) {
      this.errorInactive = false;
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.errorInactive = true;
      });
    } else {
      this.successInactive = false;
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.successInactive = true;
      });
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
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.alerts[this.newGroup] = false;
      });
      this.errorMessage = "SYSTEM_ADMIN.SETTING.ERROR_NO_GROUP_NAME";
      return false;
    }
    return true;
  }
}
