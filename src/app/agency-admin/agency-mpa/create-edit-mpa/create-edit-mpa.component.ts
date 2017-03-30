import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {MandatedPreparednessAction} from '../../../model/mandatedPA';
import {Constants} from '../../../utils/Constants';
import {ActionType, ActionLevel} from '../../../utils/Enums';
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";
declare var jQuery:any;

@Component({
  selector: 'app-create-edit-mpa',
  templateUrl: 'create-edit-mpa.component.html',
  styleUrls: ['create-edit-mpa.component.css']
})

export class CreateEditMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private successInactive: boolean = true;
  private successMessage: string = 'New department added';
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;
  private alerts = {};
  private newDepartment;
  private departmentsPath: string;
  private departments: FirebaseListObservable<any>;
  private path: string;
  private inactive: Boolean = true;
  private errorMessage: string = '';
  private pageTitle: string = 'AGENCY_MANDATED_PA.CREATE_NEW_MANDATED_PA';
  private buttonText: string = 'AGENCY_MANDATED_PA.SAVE_BUTTON_TEXT';
  private textArea: string;
  private isMpa: Boolean = true;
  private forEditing: Boolean = false;
  private idOfMpaToEdit: string;
  private subscriptions: RxHelper;
  departmentSelected: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.path = Constants.APP_STATUS + '/action/' + this.uid;
        this.departmentsPath = Constants.APP_STATUS + "/agency/" + this.uid + "/departments";
        console.log("uid: " + auth.uid);
        this.departments = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments/");
        console.log("Departments: " + this.departments);
        console.log("Departments Path: " + Constants.APP_STATUS + "/agency/" + this.uid + "/departments");
      } else {
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });

    let subscriptionEdit = this.route.params
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = 'AGENCY_MANDATED_PA.EDIT_MANDATED_PA';
          this.buttonText = 'AGENCY_MANDATED_PA.EDIT_BUTTON_TEXT';
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

  // checkDepartmentSelected() {
  //
  //   // TODO - Add department here when front end (Add department model) is available
  //   if (this.departmentSelected == 'addNewDepartment') {
  //     console.log("Add new department selected");
  //   }
  // }

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

    console.log("this.departmentSelected"+ this.departmentSelected);

    let level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;
    let newAction: MandatedPreparednessAction = new MandatedPreparednessAction(this.textArea, ActionType.mandated, this.departmentSelected, level);

    this.af.database.list(this.path).push(newAction)
      .then(_ => {
          console.log('New CHS action added');
          this.router.navigateByUrl("/agency-admin/agency-mpa");
        }
      );
  }

  private editMandatedPA() {

    let level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;
    let editedAction: MandatedPreparednessAction = new MandatedPreparednessAction(this.textArea, ActionType.mandated, this.departmentSelected, level);

    this.af.database.object(this.path + "/" + this.idOfMpaToEdit).set(editedAction).then(_ => {
        console.log('Mandated action updated');
        this.router.navigateByUrl("/agency-admin/agency-mpa");
      }
    );
  }

  addNewDepartment() {

    if (this.validateNewDepartment()) {
      this.af.database.object(this.departmentsPath + '/' + this.newDepartment).set(true).then(_ => {
        console.log('New departmentadded');
        jQuery("#add_department").modal("hide");
        this.departmentSelected = this.newDepartment;
        this.newDepartment = '';
        this.showAlert(false);
      })
    } else {
      this.showAlert(true);
    }
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

    if (!Boolean(this.textArea)) {
      this.errorMessage = "AGENCY_MANDATED_PA.NO_CONTENT_ERROR";
      return false;
    } else if (!Boolean(this.departmentSelected)) {
      this.errorMessage = "AGENCY_MANDATED_PA.NO_DEPARTMENT_ERROR";
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
      this.newDepartmentErrorMessage = 'Please enter department name';
      return false;
    }
    return true;
  }
}
