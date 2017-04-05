import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {ActionLevel, ActionType, GenericActionCategory} from "../../../utils/Enums";
import {MandatedPreparednessAction} from "../../../model/mandatedPA";
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";
declare var jQuery: any;

@Component({
  selector: 'app-add-generic-action',
  templateUrl: './add-generic-action.component.html',
  styleUrls: ['./add-generic-action.component.css']
})

export class AddGenericActionComponent implements OnInit, OnDestroy {

  private uid: string;
  private errorInactive: boolean = true;
  private errorMessage: string = "";
  private successInactive: boolean = true;
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;
  private alerts = {};
  private genericActions: Observable<any>;
  private departments: Observable<any>;
  private ActionLevel = ActionLevel;
  private GenericActionCategory = GenericActionCategory;
  private isFiltered: boolean = false;
  private actionSelected: boolean;
  private departmentSelected;
  private newDepartment;
  private actionLevelSelected = 0;
  private categorySelected = 0;
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private Category = Constants.CATEGORY;
  private categoriesList = [GenericActionCategory.ALL, GenericActionCategory.Category1, GenericActionCategory.Category2, GenericActionCategory.Category3,
    GenericActionCategory.Category4, GenericActionCategory.Category5, GenericActionCategory.Category6, GenericActionCategory.Category7,
    GenericActionCategory.Category8, GenericActionCategory.Category9, GenericActionCategory.Category10];
  private selectedActions: MandatedPreparednessAction[] = [];
  private departmentsPath: string;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.departmentsPath = Constants.APP_STATUS + "/agency/" + this.uid + "/departments";
        this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
          query: {
            orderByChild: "type",
            equalTo: ActionType.mandated
          }
        });
        this.getDepartments();
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
    this.selectedActions = [];
  }

  updateSelectedActions(genericAction) {

    let newMandatePA: MandatedPreparednessAction = new MandatedPreparednessAction();
    newMandatePA.task = genericAction.task;
    newMandatePA.type = ActionType.mandated;
    newMandatePA.department = 'test dep';
    newMandatePA.level = genericAction.level;
    newMandatePA.createdAt = genericAction.createdAt;

    console.log('actionSelected ---- ' + this.actionSelected);

    if (this.actionSelected) {
      this.selectedActions.push(newMandatePA);
    } else {
      this.selectedActions.splice(this.selectedActions.indexOf(newMandatePA), 1);
    }

    console.log('selectedActionsCount ---- ' + this.selectedActions.length);

    this.actionSelected = null;
  }

  addSelectedActionsToAgency() {

    if (!(this.selectedActions.length == 0)) {
      let agencyActionsPath: string = Constants.APP_STATUS + '/action/' + this.uid;
      this.selectedActions.forEach(action => {
        this.af.database.list(agencyActionsPath).push(action)
          .then(_ => {
            console.log('New mandated action added');
            this.router.navigateByUrl("/agency-admin/agency-mpa");
            this.selectedActions = [];
          });
      });
    } else {
      this.errorMessage = 'Please select generic action(s) to be added to mandated actions';
      this.showError();
    }

  }

  filter() {

    if (this.actionLevelSelected == GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //no filter. show all
      this.isFiltered = false;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (this.actionLevelSelected != GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //filter only with mpa
      this.isFiltered = true;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.actionLevelSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else if (this.actionLevelSelected == GenericActionCategory.ALL && this.categorySelected != GenericActionCategory.ALL) {
      //filter only with apa
      this.isFiltered = true;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.category == this.categorySelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else {
      // filter both action level and category
      this.isFiltered = true;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.actionLevelSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.category == this.categorySelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    }
  }

  addNewDepartment() {

    if (this.validateNewDepartment()) {
      this.af.database.object(this.departmentsPath + '/' + this.newDepartment).set(true).then(_ => {
        console.log('New department added');
        jQuery("#add_department").modal("hide");
        this.showDepartmentAlert(false);
      })
    } else {
      this.showDepartmentAlert(true);
    }
  }

  checkSelectedDepartment() {
    console.log("Selected Department ---- " + this.departmentSelected);
  }

  private getDepartments() {

    this.departments = this.af.database.list(this.departmentsPath)
      .map(list => {
        let tempList = [];
        for (let item of list) {
          tempList.push(item.$key);
        }
        return tempList;
      });
  }

  private showError() {

    this.errorInactive = false;
    let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.errorInactive = true;
    });
    this.subscriptions.add(subscription);
  }

  private showDepartmentAlert(error: boolean) {

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
