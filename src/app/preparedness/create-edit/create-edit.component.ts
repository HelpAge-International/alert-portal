import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {
  ActionLevel, ActionType, AlertMessageType, DurationType, HazardCategory,
  HazardScenario, UserType
} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {LocalStorageService} from 'angular-2-local-storage';
import {AlertMessageModel} from '../../model/alert-message.model';
import {AgencyModulesEnabled, CountryPermissionsMatrix, PageControlService} from "../../services/pagecontrol.service";
import {Observable, Subject} from "rxjs";
import {HazardImages} from "../../utils/HazardImages";
import {Location} from "@angular/common";
import {PrepActionService, PreparednessUser} from "../../services/prepactions.service";
import {ModelDepartment} from "../../model/department.model";
import {UserService} from "../../services/user.service";
import {ModelHazard} from "../../model/hazard.model";
import {NotificationService} from "../../services/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { MessageModel } from "../../model/message.model";
declare var jQuery: any;

@Component({
  selector: 'app-preparedness',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditPreparednessComponent implements OnInit, OnDestroy {

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";

  private uid: string;
  private userType: UserType;
  private userTypes = UserType;
  private agencyId: string;
  private countryId: string;
  public myFirstName: string;
  public myLastName: string;

  private action: CreateEditPrepActionHolder = new CreateEditPrepActionHolder();
  private editDisableLoading: boolean = false;
  private alerts = {};
  private errorMessage: string = "";

  private actionSelected: any = {};
  private copyActionData: any = {};

  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;

  private departments: ModelDepartment[] = [];

  private actionType = ActionType;
  private actionLevel = Constants.ACTION_LEVEL;
  private actionLevelEnum = ActionLevel;
  private actionLevelList: number[] = [ActionLevel.MPA, ActionLevel.APA];

  private hazardCategory = Constants.HAZARD_SCENARIOS;
  private hazards: ModelHazard[] = [];
  private hazardCategoryIconClass = Constants.HAZARD_CATEGORY_ICON_CLASS;

  private frequencyQuantities = [1,2,3,4,5,6,7,8,9,10];
  private durationType = Constants.DURATION_TYPE;
  private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

  private filterLockTask: boolean = true;
  private filterLockLevel: boolean = true;
  private filterLockDepartment: boolean = true;
  private filterLockDueDate: boolean = true;
  private filterLockBudget: boolean = true;
  private filterLockDocument: boolean = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private prepActionService: PrepActionService = new PrepActionService();

  private moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();
  private permissionsAreEnabled: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  private now: Date = new Date();

  constructor(private pageControl: PageControlService, private _location: Location, private route: ActivatedRoute,
              private af: AngularFire, private router: Router, private storage: LocalStorageService, private userService: UserService) {
    /* if selected generic action */
    this.actionSelected = this.storage.get('selectedAction');
    if (this.actionSelected && typeof (this.actionSelected) != 'undefined') {
      this.action.task = (typeof (this.actionSelected.task) != 'undefined') ? this.actionSelected.task : '';
      this.action.level = (typeof (this.actionSelected.level) != 'undefined') ? parseInt(this.actionSelected.level) : 0;
      this.action.requireDoc = (typeof (this.actionSelected.requireDoc) != 'undefined') ? this.actionSelected.requireDoc : 0;
      // TODO: Check if this is being used anywhere else and potentially remove it?
      // TODO: This causes a bug with going back and forth on the page
      this.storage.remove('selectedAction');
      this.actionSelected = {};
    }

    /* if copy action */
    this.copyActionData = this.storage.get('copyActionData');
    if (this.copyActionData && typeof (this.copyActionData) != 'undefined') {
      this.action = this.copyActionData;
      this.action.level = this.copyActionData.level;
      this.action.dueDate = this.copyActionData.dueDate;
      // TODO: Check if this is being used anywhere else and potentially remove it?
      // TODO: This causes a bug with going back and forth on the page
      this.storage.remove('copyActionData');
      this.copyActionData = {};
    }
  }

  ngOnInit() {
    this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
      if (params['id']) {
        this.action.id = params['id'];
        this.editDisableLoading = true;
      }
      this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.userType = userType;
        this.getStaffDetails(this.uid, true);

        PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, user.uid, Constants.USER_PATHS[userType], (isEnabled) => {
          this.moduleAccess = isEnabled;
        });

        PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, user.uid, userType, (isEnabled) => {
          this.permissionsAreEnabled = isEnabled;
          if (this.action.id != null) {
            this.initFromExistingActionId(userType == UserType.CountryAdmin ? true : this.permissionsAreEnabled.customMPA.Edit, userType == UserType.CountryAdmin ? true : this.permissionsAreEnabled.customAPA.Edit);
          }
        });

        this.userService.getCountryId(Constants.USER_PATHS[userType], this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((countryId) => {
            this.countryId = countryId;
            this.getHazards();
            this.initStaff();
          });
        this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((agencyId) => {
            this.agencyId = agencyId;
            this.getDepartments();
          });
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Initialisation
   */
  public initFromExistingActionId(canEditMPA: boolean, canEditAPA: boolean) {
    this.prepActionService.initOneAction(this.af, this.ngUnsubscribe, this.uid, this.userType, this.action.id, (action) => {

      if ((action.level == ActionLevel.MPA && !canEditMPA) || (action.level == ActionLevel.APA && !canEditAPA)) {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/preparedness/minimum");
        }
        else {
          this.router.navigateByUrl("/preparedness/advanced");
        }
      }

      this.action.id = action.id;
      this.action.type = action.type;
      this.action.level = action.level;
      this.action.task = action.task;
      this.action.requireDoc = action.requireDoc;
      this.action.dueDate = action.dueDate;
      if (action.assignedHazards != null) {
        for (let x of action.assignedHazards) {
          this.action.hazards.set((+x), true);
        }
      }
      this.action.asignee = action.asignee;
      this.action.department = action.department;
      this.action.budget = action.budget;
      this.action.isAllHazards = (action.assignedHazards != null ? action.assignedHazards.length == 0 : true);
      this.action.isComplete = action.isComplete;
      this.action.isCompleteAt = action.isCompleteAt;
      if (action.frequencyValue != null && action.frequencyBase != null) {
        console.log("Frequency Values are here!");
        this.action.isFrequencyActive = true;
        this.action.frequencyType = action.frequencyBase;
        this.action.frequencyQuantity = action.frequencyValue;
      }
      this.action.computedClockSetting = action.computedClockSetting;
      this.editDisableLoading = false;

      console.log(action);
      console.log(this.action);
    });
  }


  /**
   * Selecting the date on the material date picker
   */
  public selectDate(date: any) {
    this.action.dueDate = this.convertDateToTimestamp(date);
    this.removeFilterLockDueDate();
    return true;
  }

  private convertDateToTimestamp(date: any) {
    return date.getTime();
  }

  private convertTimestampToDate(timestamp: number) {
    return new Date(timestamp);
  }

  /**
   * Initialising departments
   */
  private getDepartments() {
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.departments = [];
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
        });
      });
  }

  /**
   * Initialising hazards
   */
  private getHazards() {
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.hazards = [];
        snap.forEach((snapshot) => {
          let x: ModelHazard = new ModelHazard();
          x.id = snapshot.key;
          x.category = snapshot.val().category;
          x.hazardScenario = snapshot.val().hazardScenario;
          x.isSeasonal = snapshot.val().isSeasonal;
          this.hazards.push(x);
        });
      });
  }

  /**
   * Initialising Staff
   */

  private initCountryAdmin() {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.getStaffDetails(snap.val().adminId, false);
        }
      });
  }
  private initStaff() {
    this.af.database.list(Constants.APP_STATUS + "/staff/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          this.getStaffDetails(snapshot.key, false);
        });
      });
  }

  /**
   * Get staff member public user data (names, etc.)
   */

  public getStaffDetails(uid: string, isMe: boolean) {
    if (!this.CURRENT_USERS.get(uid)) {
      this.CURRENT_USERS.set(uid, PreparednessUser.placeholder(uid));
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          let prepUser: PreparednessUser = new PreparednessUser(uid, this.uid == uid);
          prepUser.firstName = snap.firstName;
          prepUser.lastName = snap.lastName;
          this.CURRENT_USERS.set(uid, prepUser);
          this.updateUser(prepUser);
          if (isMe) {
            this.myFirstName = snap.firstName;
            this.myLastName = snap.lastName;
          }
        });
    }
  }
  /**
   * Update method for the user. This will check if it already exists, so as to not cause duplicates in the list
   */
  public updateUser(user: PreparednessUser) {
    let ran: boolean = false;
    for (let x of this.ASSIGNED_TOO) {
      if (x.id == user.id) {
        x = user;
        ran = true;
      }
      x.isMe = (x.id == this.uid);
    }
    if (!ran) {
      user.isMe = (user.id == this.uid);
      this.ASSIGNED_TOO.push(user);
    }
  }


  /**
   * Creating / updating the action
   */
  public createOrUpdateAction() {
    // Remove all the filter locks.
    this.removeFilterLockTask();
    this.removeFilterLockDueDate();
    this.removeFilterLockDepartment();
    this.removeFilterLockLevel();
    this.removeFilterLockBudget();
    this.removeFilterLockDoc();

    // Save/update the action
    if (this.action.validate()) {
      let updateObj: any = {};
      updateObj.dueDate = this.action.dueDate;
      updateObj.requireDoc = this.action.requireDoc;
      updateObj.type = this.action.type;
      updateObj.budget = this.action.budget;
      if (this.action.asignee != null && this.action.asignee != '' && this.action.asignee != undefined) {
        updateObj.asignee = this.action.asignee;
      }
      else {
        updateObj.asignee = null;
      }
      if (this.action.level == ActionLevel.APA && this.action.hazards.size != 0) {
        updateObj.assignHazard = [];
        this.action.hazards.forEach((value, key) => {
          if (value) {
            updateObj.assignHazard.push(key);
          }
        });
      }
      if (this.action.isFrequencyActive) {
        updateObj.frequencyBase = this.action.frequencyType;
        updateObj.frequencyValue = this.action.frequencyQuantity
      }
      else {
        updateObj.frequencyBase = null;
        updateObj.frequencyValue = null;
      }
      if (this.action.type != ActionType.mandated) {
        updateObj.department = this.action.department;
      }
      if (this.action.type == ActionType.custom) {
        updateObj.task = this.action.task;
        updateObj.level = this.action.level;
      }
      updateObj.updatedAt = new Date().getTime();

      if (this.action.isComplete && (this.action.isCompleteAt + this.action.computedClockSetting < this.getNow())) {
        console.log("Removing complete status!");
        updateObj.isCompleteAt = null;
        updateObj.isComplete = null;
      }

      if (this.action.id != null) {
        // Updating
        this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id).update(updateObj).then(_ => {
          if (this.action.level == ActionLevel.MPA) {
            this.router.navigateByUrl("/preparedness/minimum");
          }
          else {
            this.router.navigateByUrl("/preparedness/advanced");
          }
        })
      }
      else {
        // Saving
        updateObj.createdAt = new Date().getTime();
        this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId).push(updateObj).then(_ => {
          if (this.action.level == ActionLevel.MPA) {
            this.router.navigateByUrl("/preparedness/minimum");
          }
          else {
            this.router.navigateByUrl("/preparedness/advanced");
          }
        });
      }
    }
  }

  public getNow() {
    return this.now.getTime();
  }
  public getNowDate() {
    return this.now;
  }

  /**
   * Error handling disabled methods for all the inputs
   */
  protected removeFilterLockTask() {
    this.filterLockTask = false;
  }
  protected removeFilterLockLevel() {
    this.filterLockLevel = false;
  }
  protected removeFilterLockDepartment() {
    this.filterLockDepartment = false;
  }
  protected removeFilterLockDueDate() {
    this.filterLockDueDate = false;
  }
  protected removeFilterLockBudget() {
    this.filterLockBudget = false;
  }
  protected removeFilterLockDoc() {
    this.filterLockDocument = false;
  }

  /**
   * Update if the "check more often" frequency filter is active
   */
  protected updateFrequencyActive() {
    this.action.isFrequencyActive = !this.action.isFrequencyActive;
  }


  /**
   * Selecting a hazard in the list of hazards
   */
  protected selectHazardCategory(hazardKey: number, event: any) {
    if (hazardKey == -1) {
      this.action.hazards = new Map<HazardScenario, boolean>();
      this.action.isAllHazards = true;
    }
    else {
      this.action.isAllHazards = false;
      this.action.hazards.set(hazardKey, event.target.checked ? event.target.checked : false);
      this.action.hazards.forEach((value, key) => {
        if (value) {
          this.action.allHazardsEnabled = true;
        }
      });
    }

    console.log(this.action.hazards);
  }

  protected showActionConfirm(modal: string) {
    jQuery("#" + modal).modal('show');
  }
  protected closeActionCancel(modal: string) {
    jQuery("#" + modal).modal('hide');
  }

  /**
   * Copy an action
   */
  public copyAction() {

  }

  /**
   * Archive an action
   */
  public archiveAction() {
    // Updating
    let updateObj = {
      isArchived: true
    };
    this.closeActionCancel('archive-action');
    this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id).update(updateObj).then(_ => {
      if (this.action.level == ActionLevel.MPA) {
        this.router.navigateByUrl("/preparedness/minimum");
      }
      else {
        this.router.navigateByUrl("/preparedness/advanced");
      }
    });
  }

  /**
   * Delete an action
   */
  public deleteAction() {
    this.closeActionCancel('delete-action');
    this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id).set(null).then(_ => {
      if (this.action.level == ActionLevel.MPA) {
        this.router.navigateByUrl("/preparedness/minimum");
      }
      else {
        this.router.navigateByUrl("/preparedness/advanced");
      }
    });
  }


  /**
   * Get the hazard image for the list of hazards
   */
  public getHazardImage(key) {
    return HazardImages.init().getCSS(key);
  }


  protected backButtonAction() {
    this._location.back();
  }
}


/**
 * Create Edit Prep Action holder for the create-edit page
 */
export class CreateEditPrepActionHolder {
  public id: string = null;
  public task: string;
  public level: number;
  public budget: number = null;
  public isAllHazards: boolean;
  public hazards: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();
  public dueDate: number;
  public asignee: string = "";
  public department: string;
  public requireDoc: boolean;
  public type: number = -1;

  public isComplete;
  public isCompleteAt;
  public computedClockSetting;

  public frequencyQuantity: number = 1;
  public frequencyType: number = 0;

  public isFrequencyActive: boolean = false;
  public allHazardsEnabled: boolean;

  constructor() {
    this.type = ActionType.custom;
  }

  public validate() {
    if (this.task != undefined)
      this.task = this.task.trim();
    if (this.task == '' || this.task == undefined || this.task.length == 0) {
      console.log("Failed task check");
      return false;
    }
    if (this.level != ActionLevel.MPA && this.level != ActionLevel.APA) {
      console.log("Failed level check");
      return false;
    }
    if (this.dueDate == undefined || this.dueDate == 0) {
      console.log("Failed dueDate check");
      return false;
    }
    if (this.budget == undefined || this.budget == null) {
      console.log("Failed budget check");
      return false;
    }
    if (this.requireDoc == undefined) {
      console.log("Failed requireDoc check");
      return false;
    }

    return true;
  }
}
