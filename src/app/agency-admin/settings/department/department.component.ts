import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';
import Promise = firebase.Promise;


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";//TODO remove hard coded agency ID
  private departments: FirebaseListObservable<any>;
  private subscriptions: RxHelper;
  private deleting: boolean = false;
  private editing: boolean = false;
  private departmentName: string = "";
  private deleteCandidates: any = {};
  private depts: any = {};
  private editDepts: any = {};
  private alerts = {};
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid; //TODO remove comment

        let deptsSubscription = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments').subscribe(_ => {
          this.depts = _;
        })
        this.subscriptions.add(deptsSubscription);

        this.subscriptions.add(subscription);
      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    try {
      this.subscriptions.releaseAll();
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
    for (var item in this.deleteCandidates)
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + item).remove();
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
    let deptsSubscription = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments').subscribe(_ => {
      this.depts = _;
    })
    this.subscriptions.add(deptsSubscription);
  }

  saveEditedDepartments(event) {
    this.editing = !this.editing;

    for (var dept in this.editDepts) {
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + dept).remove();

      let departments = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments');

      var newDepartment = {};
      newDepartment[this.editDepts[dept]["new_key"]] = this.editDepts[dept]["value"];
      departments.update(newDepartment);
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
      departments.update(newDepartment);
      this.departmentName = "";

    } else {
      this.showAlert();
    }
  }

  private showAlert() {

    this.newDepartmentErrorInactive = false;
    let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.newDepartmentErrorInactive = true;
    });
    this.subscriptions.add(subscription);
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validateNewDepartment() {

    this.alerts = {};

    if (!(this.departmentName)) {
      this.alerts[this.departmentName] = true;
      this.newDepartmentErrorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_NAME";
      return false;
    }
    return true;
  }

}
