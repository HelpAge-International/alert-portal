
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {ActionLevel, ActionType, GenericActionCategory} from "../../../utils/Enums";
import {MandatedPreparednessAction} from "../../../model/mandatedPA";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ModelDepartment} from "../../../model/department.model";
import {UserService} from "../../../services/user.service";

declare var jQuery: any;

@Component({
  selector: 'app-add-generic-action',
  templateUrl: './add-generic-action.component.html',
  styleUrls: ['./add-generic-action.component.css']
})

export class AddGenericActionComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;
  private systemAdminUid: string;

  private departments: ModelDepartment[] = [];
  private departmentSelected: string = "0";

  private actions: GenericToMandatedListModel[] = [];

  private errorInactive: boolean = true;
  private successInactive: boolean = true;
  private newDepartmentErrorInactive: boolean = true;
  private errorMessage: string;
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
  private newDepartmentErrorMessage: string;
  private alerts = {};

  private genericActions: Observable<any>;

  private ActionLevel = ActionLevel;
  private GenericActionCategory = GenericActionCategory;

  private isFiltered: boolean = false;

  private departmentsPath: string;
  private newDepartment;

  private numOfDepartmentSelected: number = 0;
  private actionLevelSelected = 0;
  private categorySelected = 0;

  private actionsSelected: any = {};

  private addDepartmentSelectedAction: string = null;

  private Category = Constants.CATEGORY;
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private categoriesList = [GenericActionCategory.OfficeAdministration, GenericActionCategory.Finance, GenericActionCategory.ITFieldCommunications,
    GenericActionCategory.Logistics, GenericActionCategory.CommunicationsMedia, GenericActionCategory.HumanResources, GenericActionCategory.DonorFundingReporting,
    GenericActionCategory.Accountability, GenericActionCategory.Security, GenericActionCategory.Programmes, GenericActionCategory.EmergencyResponseTeamManagement];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.systemAdminUid = systemId;

      this.getDepartments();
      this.getGenericActions();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.actionsSelected = {};
  }

  protected addSelectedActionsToAgency() {
    if (this.validate()) {
      // Push them here! All Departments are valid
      for (let x of this.actions) {
        if (x.addNew) {
          let newMandated = {
            category: x.category,
            level: x.level,
            task: x.task,
            type: x.type,
            department: x.department,
            createdAt: new Date().getTime()
          };
          this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + this.agencyId).push(newMandated).then(_ => {
            this.router.navigateByUrl("/agency-admin/agency-mpa");
          });
        }
      }
    } else {
      this.showError();
    }
  }

  public addNewDepartment() {
    if (this.validateNewDepartment()) {
      let dep = {
        name: this.newDepartment
      };
      this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments").push(dep).then(snapshot => {
        jQuery("#add_department").modal("hide");
        this.departmentSelected = this.newDepartment;
        // this.newDepartment = '';
        console.log(snapshot);
        if (this.addDepartmentSelectedAction != null) {
          for (let x of this.actions) {
            if (x.id == this.addDepartmentSelectedAction) {
              console.log("Assigning department of " + x.task + " to '" + snapshot.key + "'");
              x.department = snapshot.key;
            }
          }
          console.log(this.actions);
          this.addDepartmentSelectedAction = null;
        }
      });
    } else {
      this.showAlert(true);
    }
  }


  private getGenericActions() {
    this.af.database.list(Constants.APP_STATUS + "/actionGeneric/" + this.systemAdminUid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          let x: GenericToMandatedListModel = new GenericToMandatedListModel();
          x.id = snapshot.key;
          x.level = snapshot.val().level;
          x.category = snapshot.val().category;
          x.task = snapshot.val().task;
          x.type = snapshot.val().type;
          this.actions.push(x);
        });
      });
  }

  private getDepartments() {
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments/", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          let found = false;
          for (let x of this.departments) {
            if (x.id == snapshot.key) {
              found = true;
              x.name = snapshot.val().name;
            }
          }
          if (!found) {
            let x: ModelDepartment = new ModelDepartment();
            x.id = snapshot.key;
            x.name = snapshot.val().name;
            this.departments.push(x);
          }
        });
        for (let x of this.actions) {
          x.department = "" + x.department;
          console.log("Assigning department of " + x.task + " to '" + x.department + "'");
        }
      });
  }

  private showError() {

    this.errorInactive = false;
    observableTimer(Constants.ALERT_DURATION).pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.errorInactive = true;
    });
  }

  private showDepartmentAlert(error: boolean) {
    if (error) {
      this.newDepartmentErrorInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.newDepartmentErrorInactive = true;
      });
    } else {
      this.successInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.successInactive = true;
      });
    }
  }

  private showAlert(error: boolean) {
    if (error) {
      this.newDepartmentErrorInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.newDepartmentErrorInactive = true;
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
  private validate() {
    this.alerts = {};
    let atLeastOneActionEnabled: boolean = false;
    for (let x of this.actions) {
      if (x.addNew) {
        atLeastOneActionEnabled = true;
      }
    }
    if (!atLeastOneActionEnabled) {
      this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_ACTION_SELECTED";
      return false;
    }
    for (let x of this.actions) {
      if (x.addNew && x.department == null) {
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


  public addDepartmentDialogClicked(action) {
    this.addDepartmentSelectedAction = action.id;
  }
}


export class GenericToMandatedListModel {
  public category: GenericActionCategory;
  public level: number;
  public task: string;
  public type: number;
  public id: string;
  public department: string;
  public addNew: boolean;

  constructor() {
    this.addNew = false;
  }
}
