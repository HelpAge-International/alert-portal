import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {ActionLevel, ActionType, GenericActionCategory} from "../../../utils/Enums";
import {MandatedPreparednessAction} from "../../../model/mandatedPA";
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";
declare var jQuery:any;

@Component({
  selector: 'app-add-generic-action',
  templateUrl: './add-generic-action.component.html',
  styleUrls: ['./add-generic-action.component.css']
})

export class AddGenericActionComponent implements OnInit, OnDestroy {

  private uid: string;
  private successInactive: boolean = true;
  private successMessage: string = 'New department added';
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;
  private alerts = {};
  private genericActions: Observable<any>;
  private departments: FirebaseListObservable<any>;
  private ActionLevel = ActionLevel;
  private GenericActionCategory = GenericActionCategory;
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
    GenericActionCategory.Category8, GenericActionCategory.Category9, GenericActionCategory.Category10];  private selectedActions: MandatedPreparednessAction[] = [];
  private departmentsPath: string;
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper();
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

    let newMandatePA: MandatedPreparednessAction = new MandatedPreparednessAction(genericAction.task, ActionType.mandated, this.departmentSelected, genericAction.level);

    console.log('actionSelected ---- ' + this.actionSelected);

    if (this.actionSelected) {

      var index = this.selectedActions.indexOf(newMandatePA);
      console.log('index ----' + index);

      if (index < 0) {
        this.selectedActions.push(newMandatePA);
        console.log("Adding");
      } else {
        this.selectedActions[index] = newMandatePA;
        console.log("Not added coz index is ---- " + index);
      }

    } else {

      var index = this.selectedActions.indexOf(newMandatePA);

      if (index > -1) {
        this.selectedActions.splice(index, 1);
      }
    }
    console.log('selectedActionsCount ---- ' + this.selectedActions.length);
    console.log('selectedActions ---- ' + this.selectedActions);

    this.actionSelected = null;
  }

  filter() {
    if (this.actionLevelSelected == GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //no filter. show all
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (this.actionLevelSelected != GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //filter only with mpa
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
        console.log('New departmentadded');
        jQuery("#add_department").modal("hide");
        this.showAlert(false);
      })
    } else {
      this.showAlert(true);
    }
  }

  private getDepartments() {
    this.departments = this.af.database.list(this.departmentsPath);
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
