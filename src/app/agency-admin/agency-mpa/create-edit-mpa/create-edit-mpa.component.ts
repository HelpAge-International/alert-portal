import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {MandatedPreparednessAction} from '../../../model/mandatedPA';
import {Constants} from '../../../utils/Constants';
import {ActionType, ActionLevel} from '../../../utils/Enums';
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";
declare var jQuery: any;

@Component({
  selector: 'app-create-edit-mpa',
  templateUrl: 'create-edit-mpa.component.html',
  styleUrls: ['create-edit-mpa.component.css']
})

export class CreateEditMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private successInactive: boolean = true;
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;
  private alerts = {};
  private newDepartment: string;
  private departmentsPath: string;
  private departments: Observable<any>;
  private path: string;
  private inactive: Boolean = true;
  private errorMessage: string = '';
  private pageTitle: string = 'AGENCY_ADMIN.MANDATED_PA.CREATE_NEW_MANDATED_PA';
  private buttonText: string = 'AGENCY_ADMIN.MANDATED_PA.SAVE_BUTTON_TEXT';
  private textArea: string;
  private isMpa: Boolean = true;
  private forEditing: Boolean = false;
  private idOfMpaToEdit: string;
  private departmentSelected: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {

        this.uid = auth.uid;
        this.path = '/action/' + this.uid;
        this.departmentsPath = "/agency/" + this.uid + "/departments";
        console.log("uid: " + auth.uid);
        this.getDepartments();
      } else {
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });

    let subscriptionEdit = this.route.params
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = 'AGENCY_ADMIN.MANDATED_PA.EDIT_MANDATED_PA';
          this.buttonText = 'AGENCY_ADMIN.MANDATED_PA.EDIT_BUTTON_TEXT';
          this.loadMandatedPAInfo(params["id"]);
          this.idOfMpaToEdit = params["id"];
        }
      });
    this.subscriptions.add(subscription);
    this.subscriptions.add(subscriptionEdit);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {
    if (this.validate()) {

      if (this.forEditing) {
        this.editMandatedPA();
      } else {
        this.addNewMandatedPA();
        this.inactive = true;
      }
    } else {
      this.inactive = false;
      Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.inactive = true;
      })
    }
  }

  mpaSelected() {
    this.isMpa = true;
  }

  apaSelected() {
    this.isMpa = false;
  }

  checkSelectedDepartment() {
    console.log("Selected Department ---- " + this.departmentSelected);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private loadMandatedPAInfo(actionId: string) {

    let subscription = this.af.database.object(this.path + '/' + actionId).subscribe((action: MandatedPreparednessAction) => {
      this.textArea = action.task;
      this.isMpa = action.level == ActionLevel.MPA ? true : false;
      this.departmentSelected = action.department;
    });
    this.subscriptions.add(subscription);
  }

  private addNewMandatedPA() {

    let currentDateTime = new Date().getTime();

    let level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;
    let newAction: MandatedPreparednessAction = new MandatedPreparednessAction();
    newAction.task = this.textArea;
    newAction.type = ActionType.mandated;
    newAction.department = this.departmentSelected;
    newAction.level = level;
    newAction.createdAt = currentDateTime;

    this.af.database.list(this.path).push(newAction)
      .then(_ => {
        console.log('New CHS action added');
        this.router.navigateByUrl("/agency-admin/agency-mpa");
      });
  }

  private editMandatedPA() {

    let level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;
    let editedAction: MandatedPreparednessAction = new MandatedPreparednessAction();
    editedAction.task = this.textArea;
    editedAction.type = ActionType.mandated;
    editedAction.department = this.departmentSelected;
    editedAction.level = level;

    this.af.database.object(this.path + "/" + this.idOfMpaToEdit).update(editedAction).then(_ => {
        console.log('Mandated action updated');
        this.router.navigateByUrl("/agency-admin/agency-mpa");
      }
    );
  }

  addNewDepartment() {

    if (this.validateNewDepartment()) {
      this.af.database.object(this.departmentsPath + '/' + this.newDepartment).set(true).then(_ => {
        console.log('New department added');
        jQuery("#add_department").modal("hide");
        this.departmentSelected = this.newDepartment;
        this.newDepartment = '';
        this.showAlert(false);
      })
    } else {
      this.showAlert(true);
    }
  }

  closeModal() {
    this.departmentSelected = '';
    jQuery("#add_department").modal("hide");
  }

  private getDepartments() {

    this.departments = this.af.database.list("/agency/" + this.uid + "/departments/")
      .map(list => {
        let tempList = [];
        for (let item of list) {
          tempList.push(item.$key);
        }
        return tempList;
      });
  }

  private showAlert(error: boolean) {
    if (error) {
      this.newDepartmentErrorInactive = false;
      let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.newDepartmentErrorInactive = true;
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
  private validate() {

    if (!(this.textArea)) {
      this.alerts[this.textArea] = true;
      this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_CONTENT_ERROR";
      return false;
    } else if (!(this.departmentSelected)) {
      this.alerts[this.departmentSelected] = true;
      this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_ERROR";
      return false;
    }
    return true;
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validateNewDepartment() {

    this.alerts = {};

    if (!(this.newDepartment)) {
      this.alerts[this.newDepartment] = true;
      this.newDepartmentErrorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_NAME";
      return false;
    }
    return true;
  }
}
