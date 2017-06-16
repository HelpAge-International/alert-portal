import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable, Subject} from 'rxjs';
import Promise = firebase.Promise;

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent implements OnInit, OnDestroy {

  private uid: string = "";
  private departments: FirebaseListObservable<any>;
  private deleting: boolean = false;
  private editing: boolean = false;
  private saved: boolean = false;
  private departmentName: string = "";
  private deleteCandidates: any = {};
  private depts: any = {};
  private editDepts: any = {};
  private alerts = {};
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;

  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;

        this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(_ => {
          this.depts = _;
        });

      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } catch (e) {
      console.log('Unable to releaseAll');
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  deleteDepartments(event) {
    this.deleting = !this.deleting;
  }

  cancelDeleteDepartments(event) {
    this.deleting = !this.deleting;
    this.deleteCandidates = {};
  }

  deleteSelectedDepartments(event) {
    this.deleting = !this.deleting;

    for (var item in this.deleteCandidates)
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + item)
    .remove()
    .then(_ => {
      if (!this.alertShow){
        this.saved = true;
        this.alertSuccess = true;
        this.alertShow = true;
        this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_REMOVED_SUCCESS";
      }
    })
    .catch(err => console.log(err, 'You do not have access!'));
  }

  onDepartmentSelected(department) {
    if (department in this.deleteCandidates)
      delete this.deleteCandidates[department];
    else
      this.deleteCandidates[department] = true;
  }

  editDepartments(event) {
    this.editing = !this.editing;
  }

  cancelEditDepartments(event) {
    this.editing = !this.editing;
    this.editDepts = {};
    this.deleteCandidates = {};
    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(_ => {
      this.depts = _;
    });
  }

  saveEditedDepartments(event) {
    this.editing = !this.editing;

    for (var dept in this.editDepts) {
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + dept).remove();

      let departments = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments');

      var newDepartment = {};
      newDepartment[this.editDepts[dept]["new_key"]] = this.editDepts[dept]["value"];
      departments
      .update(newDepartment)
      .then(_ => {
        if (!this.alertShow){
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_SAVED_SUCCESS";
        }
      })
      .catch(err => console.log(err, 'You do not have access!'));
    }
  }

  setDepartmentValue(prop, value) {
    this.editDepts[prop] = {
      "new_key": value,
      "value": this.depts[prop]
    };
  }

  addDepartment(event) {

    if (this.validateNewDepartment()) {

      let departments = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments');
      var newDepartment = {};
      newDepartment[this.departmentName] = false;
      departments
      .update(newDepartment)
      .then(_ => {
        if (!this.alertShow){
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_NEW_SUCCESS";
        }
      })
      .catch(err => console.log(err, 'You do not have access!'));
      this.departmentName = "";

    } else {
      this.showAlert();
    }
  }

  private showAlert() {

    this.newDepartmentErrorInactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.newDepartmentErrorInactive = true;
    });
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validateNewDepartment() {

    this.alerts = {};

    if (!(this.departmentName)) {
      this.alerts[this.departmentName] = true;
      this.alertSuccess = false;
      this.alertShow = true;
      this.alertMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_NAME";
      return false;
    }
    return true;
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

}
