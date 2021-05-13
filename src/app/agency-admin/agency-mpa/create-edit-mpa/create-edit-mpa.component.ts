
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MandatedPreparednessAction} from "../../../model/mandatedPA";
import {Constants} from "../../../utils/Constants";
import {ActionLevel, ActionStatus, ActionType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ModelDepartment} from "../../../model/department.model";
declare var jQuery: any;

@Component({
  selector: 'app-create-edit-mpa',
  templateUrl: 'create-edit-mpa.component.html',
  styleUrls: ['create-edit-mpa.component.css']
})

export class CreateEditMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;
  private editActionId: string;
  private inactive: boolean = true;
  private fieldsDisabled: boolean = false;

  private successInactive: boolean = true;
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";

  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;
  private newDepartment: string;

  private alerts: {} = {};

  private departments: ModelDepartment[] = [];
  private departmentSelected: string;

  private isMpa: boolean = false;

  private errorMessage: string = '';
  private pageTitle: string = 'AGENCY_ADMIN.MANDATED_PA.CREATE_NEW_MANDATED_PA';
  private buttonText: string = 'PREPAREDNESS.SAVE_NEW_ACTION';
  private textArea: string;
  private forEditing: boolean = false;
  private addDepartmentSelectedAction: string = null;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.pageTitle = 'AGENCY_ADMIN.MANDATED_PA.EDIT_MANDATED_PA';
          this.buttonText = 'GLOBAL.SAVE_CHANGES';
          this.editActionId = params["id"];
          this.fieldsDisabled = true;
        }
        this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
          this.uid = user.uid;
          this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + this.uid + "/agencyId", {preserveSnapshot: true})
            .takeUntil(this.ngUnsubscribe)
            .subscribe((agencyId) => {
              this.agencyId = agencyId.val();
              if (this.editActionId != null) {
                this.initialLoadMandated();
              }
              this.getDepartments();
            });
        });
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    if (this.validate()) {
      this.updateMandatedPrepAction();
    } else {
      this.inactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.inactive = true;
      });
    }
  }

  protected initialLoadMandated() {
    this.af.database.object(Constants.APP_STATUS + "/actionMandated/" + this.agencyId + "/" + this.editActionId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.textArea = snap.val().task;
        this.isMpa = snap.val().level == ActionLevel.MPA;
        this.departmentSelected = snap.val().department;
        this.fieldsDisabled = false;
      });
  }

  protected mpaSelected() {
    this.isMpa = true;
  }

  protected apaSelected() {
    this.isMpa = false;
  }

  private updateMandatedPrepAction() {
    if (this.editActionId != null) {
      // update
      let updateObj = {
        department: this.departmentSelected,
        level: this.isMpa ? ActionLevel.MPA : ActionLevel.APA,
        task: this.textArea,
        type: ActionType.mandated
      };
      this.af.database.object(Constants.APP_STATUS + "/actionMandated/" + this.agencyId + "/" + this.editActionId).update(updateObj).then(_ => {
        this.router.navigateByUrl("/agency-admin/agency-mpa");
      });
    }
    else {
      // Push
      let pushObj = {
        createdAt: new Date().getTime(),
        department: this.departmentSelected,
        level: this.isMpa ? ActionLevel.MPA : ActionLevel.APA,
        task: this.textArea,
        type: ActionType.mandated
      };
      this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + this.agencyId).push(pushObj).then(_ => {
        this.router.navigateByUrl("/agency-admin/agency-mpa");
      });
    }
  }

  protected closeModal() {
    this.departmentSelected = '';
    jQuery("#add_department").modal("hide");
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
      });
  }


  public addNewDepartment() {
    if (this.validateNewDepartment()) {
      let dep = {
        name: this.newDepartment
      };
      this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments").push(dep).then(snapshot => {
        jQuery("#add_department").modal("hide");
        this.departmentSelected = snapshot.key;
        this.newDepartment = '';
        // if (this.addDepartmentSelectedAction != null) {
        //   this.departmentSelected = this.addDepartmentSelectedAction;
        //   this.addDepartmentSelectedAction = null;
        // }
      });
    } else {
      this.showAlert(true);
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

  public addDepartmentDialogClicked(action) {
    this.addDepartmentSelectedAction = action.id;
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
