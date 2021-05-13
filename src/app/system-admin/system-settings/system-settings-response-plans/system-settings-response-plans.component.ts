
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {PageControlService} from "../../../services/pagecontrol.service";

declare var jQuery: any;

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
  private editedGroups = [];
  private groups: FirebaseListObservable<any>;
  private newGroupName: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public groupToDelete: string;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.groups = this.af.database.list(Constants.APP_STATUS + "/system/" + this.uid + '/groups');
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  addGroup() {
    if (this.validateNewGroup() && this.newGroupName) {
      let groupPath: string = Constants.APP_STATUS + "/system/" + this.uid + '/groups';
      let newGroup = {"name": this.newGroupName};

      this.af.database.list(groupPath).push(newGroup).then(() => {
        console.log("Group creation successful");
        this.newGroupName = "";
        this.successMessage = "SYSTEM_ADMIN.SETTING.SUCCESS_ADD_GROUP";
        this.showAlert(false);
      }).catch(error => {
        console.log("Group creation unsuccessful with error --> " + error.message);
      });
    } else {
      this.showAlert(true);
    }
  }

  deleteGroup(){
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid + '/groups/' + this.groupToDelete)
      .remove()
      .then(_ => {
        this.successMessage = "Group successfully deleted.";
        this.showAlert(false);
      })
  }

  editGroups(event) {
    this.isEditing = true;
  }

  setGroupValue(group, value: string) {
    if (value || value != "") {
      var isExistingGroup = false;
      this.editedGroups.forEach(exisitngGroup =>{
          if(exisitngGroup.$key == group.$key){
            console.log("Existing group");
            isExistingGroup = true;
            exisitngGroup.name = value;
          }
      });

      if(!isExistingGroup){
        console.log("New group");
        group.name = value;
        this.editedGroups.push(group);
      }
    }
  }

  cancelEditGroups(event) {
    this.isEditing = false;
    this.editedGroups = [];
  }

  saveEditedGroups() {
    console.log(this.editedGroups);

    this.editedGroups.forEach(editedGroup => {
      this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid + '/groups/' + editedGroup.$key + "/name").set(editedGroup.name);
    });
    this.isEditing = false;
    this.editedGroups = [];
  }

  private showAlert(error: boolean) {
    if (error) {
      this.errorInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.errorInactive = true;
      });
    } else {
      this.successInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.successInactive = true;
      });
    }
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */

  private validateNewGroup() {
    if (!(this.newGroupName)) {
      this.alerts[this.newGroupName] = true;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.alerts[this.newGroupName] = false;
      });
      this.errorMessage = "SYSTEM_ADMIN.SETTING.ERROR_NO_GROUP_NAME";
      return false;
    }
    return true;
  }


  openModal(id) {
    jQuery('#delete-action').modal('show');
    this.groupToDelete = id;
  }
  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

  deleteAction() {
    this.deleteGroup()
    jQuery('#delete-action').modal('hide');
  }
}
