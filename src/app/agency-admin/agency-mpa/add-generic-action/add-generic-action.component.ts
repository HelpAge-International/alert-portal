import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {ActionLevel, ActionType, GenericActionCategory} from "../../../utils/Enums";
import {MandatedPreparednessAction} from "../../../model/mandatedPA";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-add-generic-action',
  templateUrl: './add-generic-action.component.html',
  styleUrls: ['./add-generic-action.component.css']
})

export class AddGenericActionComponent implements OnInit, OnDestroy {

  private uid: string;
  private systemAdminUid: string;

  private errorInactive: boolean = true;
  private successInactive: boolean = true;
  private newDepartmentErrorInactive: boolean = true;
  private errorMessage: string;
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
  private newDepartmentErrorMessage: string;
  private alerts = {};

  private genericActions: Observable<any>;
  private departments: Observable<any>;

  private ActionLevel = ActionLevel;
  private GenericActionCategory = GenericActionCategory;

  private isFiltered: boolean = false;

  private departmentsPath: string;
  private newDepartment;

  private numOfDepartmentSelected: number = 0;
  private actionLevelSelected = 0;
  private categorySelected = 0;

  private actionsSelected: any = {};

  private Category = Constants.CATEGORY;
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private categoriesList = [
    GenericActionCategory.ALL,
    GenericActionCategory.Category1,
    GenericActionCategory.Category2,
    GenericActionCategory.Category3,
    GenericActionCategory.Category4,
    GenericActionCategory.Category5,
    GenericActionCategory.Category6,
    GenericActionCategory.Category7,
    GenericActionCategory.Category8,
    GenericActionCategory.Category9,
    GenericActionCategory.Category10
  ];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.departmentsPath = Constants.APP_STATUS + "/agency/" + this.uid + "/departments";
        this.af.database.list(Constants.APP_STATUS + "/administratorAgency/" + this.uid + '/systemAdmin')
          .takeUntil(this.ngUnsubscribe)
          .subscribe((systemAdminIds) => {
          this.systemAdminUid = systemAdminIds[0].$key;
          this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
            query: {
              orderByChild: "type",
              equalTo: ActionType.mandated
            }
          });
          this.getDepartments();
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.actionsSelected = {};
  }

  updateSelectedActions(genericAction) {

    let notIntheList: boolean = this.actionsSelected[genericAction.$key] == null;

    if (notIntheList) {
      let newMandatePA: MandatedPreparednessAction = new MandatedPreparednessAction();
      newMandatePA.task = genericAction.task;
      newMandatePA.type = ActionType.mandated;
      newMandatePA.level = genericAction.level;
      newMandatePA.isActive = true;
      newMandatePA.createdAt = genericAction.createdAt;
      this.actionsSelected[genericAction.$key] = newMandatePA;
    } else {
      console.log("Remove from the list");
      delete this.actionsSelected[genericAction.$key];
    }
  }

  setDepartment(department, genericAction) {

    if (department != "addNewDepartment") {
      this.actionsSelected[genericAction.$key].department = department;
    } else {
      console.log("Add a department selected");
    }
  }

  addSelectedActionsToAgency() {

    if (this.validate()) {
      let agencyActionsPath: string = Constants.APP_STATUS + '/action/' + this.uid;

      for (var action in this.actionsSelected) {
        this.af.database.list(agencyActionsPath).push(this.actionsSelected[action])
          .then(_ => {
            console.log('New mandated action added');
            this.router.navigateByUrl("/agency-admin/agency-mpa");
          });
      }
    } else {
      this.showError();
    }
  }

  addNewDepartment() {

    if (this.validateNewDepartment()) {
      this.af.database.object(this.departmentsPath + '/' + this.newDepartment).set(false).then(_ => {
        console.log('New department added');
        jQuery("#add_department").modal("hide");
        this.showDepartmentAlert(false);
      })
    } else {
      this.showDepartmentAlert(true);
    }
  }

  filter() {

    if (this.actionLevelSelected == GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //no filter. show all
      this.isFiltered = false;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (this.actionLevelSelected != GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //filter only with mpa
      this.isFiltered = true;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
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
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
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
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
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
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.errorInactive = true;
    });
  }

  private showDepartmentAlert(error: boolean) {

    if (error) {
      this.newDepartmentErrorInactive = false;
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.newDepartmentErrorInactive = true;
      });
    } else {
      this.successInactive = false;
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.successInactive = true;
      });
    }
  }

  private getNumOfSelectedActions() {

    var num: number = 0;
    for (var action in this.actionsSelected) {
      num++;
    }
    return num;
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validate() {

    this.alerts = {};
    if (this.getNumOfSelectedActions() == 0) {
      this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_ACTION_SELECTED";
      return false;
    }
    for (let action in this.actionsSelected) {
      if (this.actionsSelected[action].department == null) {
        this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_ERROR";
        return false;
      }
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
