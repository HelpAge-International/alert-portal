import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {
  ActionLevel,
  ActionType,
  AlertLevels,
  AlertMessageType,
  Currency,
  DurationType,
  HazardScenario,
  UserType,
} from "../../../utils/Enums";
import {NetworkModulesEnabledModel, PageControlService} from "../../../services/pagecontrol.service";
import {AngularFire} from "angularfire2";
import {NetworkService} from "../../../services/network.service";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {CreateEditPrepActionHolder} from "../../../preparedness/create-edit/create-edit.component";
import {PrepActionService, PreparednessUser} from "../../../services/prepactions.service";
import {ModelHazard} from "../../../model/hazard.model";
import {MessageModel} from "../../../model/message.model";
import {Location} from "@angular/common";
import {LocalStorageService} from "angular-2-local-storage";
import {HazardImages} from "../../../utils/HazardImages";

@Component({
  selector: 'app-network-country-create-edit-actionn',
  templateUrl: './network-country-create-edit-actionn.component.html',
  styleUrls: ['./network-country-create-edit-actionn.component.scss']
})
export class NetworkCountryCreateEditActionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private showLoader: boolean;


  //copy over
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
  public dueDate: Date;

  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;
  private oldAction;

  private actionType = ActionType;
  private actionLevel = Constants.ACTION_LEVEL;
  private actionLevelEnum = ActionLevel;
  private actionLevelList: number[] = [ActionLevel.MPA, ActionLevel.APA];

  private hazardCategory = Constants.HAZARD_SCENARIOS;
  private hazards: ModelHazard[] = [];
  private hazardCategoryIconClass = Constants.HAZARD_CATEGORY_ICON_CLASS;

  private frequencyQuantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private durationType = Constants.DURATION_TYPE;
  private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

  private filterLockTask: boolean = true;
  private filterLockLevel: boolean = true;
  private filterLockDepartment: boolean = true;
  private filterLockDueDate: boolean = true;
  private filterLockBudget: boolean = true;
  private filterLockDocument: boolean = true;
  private showDueDate: boolean = true;

  private copyDepartmentId: string;

  private prepActionService: PrepActionService = new PrepActionService();

  private moduleAccess: NetworkModulesEnabledModel = new NetworkModulesEnabledModel();

  private hazardRedAlert: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();

  private now: Date = new Date();


  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private _location: Location,
              private networkService: NetworkService,
              private notificationService: NotificationService,
              private userService: UserService,
              private storage: LocalStorageService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params) =>{
      if (params['id']) {
        this.action.id = params['id'];
        this.editDisableLoading = true;
      }

      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.showLoader = true;

        //get network id
        this.networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.showLoader = false;
            this.networkId = selection["id"];
            this.networkCountryId = selection["networkCountryId"];

            this.networkService.getNetworkModuleMatrix(this.networkCountryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(modules => this.moduleAccess = modules);

            this.getHazards();
            this.initStaff();
            this.calculateCurrency();

            if (this.action.id != null) {
              this.showDueDate = true;
              this.initFromExistingActionId(true, true);
            }
            else {
              this.action.isAllHazards = true;
            }
            // return this.networkService.getNetworkResponsePlanClockSettingsDuration(this.networkId);
          });
        // .takeUntil(this.ngUnsubscribe)
        // .subscribe(duration => {
        // this.networkPlanExpireDuration = duration;
        // this.getResponsePlans(this.networkCountryId);
        // this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
        //   .takeUntil(this.ngUnsubscribe)
        //   .subscribe(map => {

        // this.agencyCountryMap = map;
        // this.agenciesNeedToApprove = [];
        // CommonUtils.convertMapToKeysInArray(this.agencyCountryMap).forEach(agencyId => {
        //   this.userService.getAgencyModel(agencyId)
        //     .takeUntil(this.ngUnsubscribe)
        //     .subscribe(model => {
        //       console.log(model);
        //       this.agenciesNeedToApprove.push(model);
        //     });
        // });
        // });
        // });
      });

    });

  }

  ngOnDestroy() {
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
      if (action.type == ActionLevel.MPA) {
        this.showDueDate = true;
        this.editDisableLoading = false;
      }
      else {
        this.initialiseListOfHazardsHazards();
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

      if (!this.oldAction) {
        this.oldAction = Object.assign({}, this.action); // clones the object to see if the assignee changes in order to send notification
      }

      console.log(action);
      console.log(this.action);
    });
  }

  /**
   * Selecting the date on the material date picker
   */
  public selectDate(date: any) {
    this.action.dueDate = this.convertDateToTimestamp(date);
    if (this.action.dueDate >= (new Date().getTime() - (1000 * 60 * 60 * 24))) {
      console.log("Valid date!");
    }
    else {
      console.log("INVALID DATE!");
      this.action.dueDate = null;
      this.dueDate = null;
    }
    this.removeFilterLockDueDate();
    return true;
  }

  private convertDateToTimestamp(date: any) {
    return date.getTime();
  }

  private convertTimestampToDate(timestamp: number) {
    return new Date(timestamp);
  }

  private initialiseListOfHazardsHazards() {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.val().alertLevel == AlertLevels.Red) {
            let res: boolean = false;
            for (const userTypes in snapshot.val().approval) {
              for (const thisUid in snapshot.val().approval[userTypes]) {
                if (snapshot.val().approval[userTypes][thisUid] != 0) {
                  res = true;
                }
              }
            }
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, res);
            }
          }
          else {
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, false);
            }
          }
        });
        this.evaluateDueDate(0);
        this.editDisableLoading = false;
      });

    // Populate actions
  }

  /**
   * Initialising hazards
   */
  private getHazards() {
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkCountryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.hazards = [];
        snap.forEach((snapshot) => {
          if (snapshot.val().hazardScenario != -1) {
            let x: ModelHazard = new ModelHazard();
            x.id = snapshot.key;
            x.category = snapshot.val().category;
            x.hazardScenario = snapshot.val().hazardScenario;
            x.isSeasonal = snapshot.val().isSeasonal;
            this.hazards.push(x);
          } else {
            this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + snapshot.val().otherName, {preserveSnapshot: true})
              .takeUntil(this.ngUnsubscribe)
              .subscribe(snapOther => {
                let x: ModelHazard = new ModelHazard();
                x.id = snapshot.key;
                x.category = snapshot.val().category;
                x.hazardScenario = snapshot.val().hazardScenario;
                x.isSeasonal = snapshot.val().isSeasonal;
                x.displayName = snapOther.val().name;
                this.hazards.push(x);
              })
          }

        });
      });
  }

  /**
   * Error handling disabled methods for all the inputs
   */
  protected removeFilterLockTask() {
    this.filterLockTask = false;
  }

  protected removeFilterLockLevel() {
    this.filterLockLevel = false;
    if (this.action.id == null) {
      this.showDueDate = this.action.level == ActionLevel.MPA;
    }
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

  protected evaluateDueDate(hazardKey: number) {
    let result: boolean = false;
    if (this.action.isAllHazards == true) {
      this.hazardRedAlert.forEach((value, key) => {
        if (value) {
          result = true;
        }
      });
    }
    this.action.hazards.forEach((value, key) => {
      if (value && this.hazardRedAlert.get(key) && this.hazardRedAlert.get(key) == true) {
        result = true;
      }
    });

    this.showDueDate = this.action.level == ActionLevel.MPA || result;
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
    if (this.action.validate(this.showDueDate)) {
      let updateObj: any = {};
      console.log(this.showDueDate);
      console.log(this.action.dueDate);
      if (this.showDueDate) {
        updateObj.dueDate = this.action.dueDate;
      }
      updateObj.requireDoc = this.action.requireDoc;
      updateObj.type = this.action.type;
      updateObj.budget = this.action.budget;
      if (this.action.asignee != null && this.action.asignee != '' && this.action.asignee != undefined) {
        updateObj.asignee = this.action.asignee;
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
      if (this.action.type == ActionType.custom) {
        updateObj.task = this.action.task;
        updateObj.level = this.action.level;
      }
      updateObj.updatedAt = new Date().getTime();

      if (this.action.isComplete && (this.action.isCompleteAt + this.action.computedClockSetting < this.getNow())) {
        console.log("Removing complete status!");
        updateObj.isComplete = null;
        updateObj.isCompleteAt = null;
        updateObj.calculatedIsComplete = null;
      }

      if (this.action.id != null) {
        // Updating
        this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id).update(updateObj).then(() => {

          if (updateObj.asignee && updateObj.asignee != this.oldAction.asignee) {
            // Send notification to the assignee
            let notification = new MessageModel();
            const translateText = (this.action.level == ActionLevel.MPA) ? "ASSIGNED_MPA_ACTION" : "ASSIGNED_APA_ACTION";
            notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_TITLE");
            notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_CONTENT", {actionName: (updateObj.task ? updateObj.task : (this.action.task ? this.action.task : ''))});
            console.log("Updating:");
            console.log(notification.content);

            notification.time = new Date().getTime();
            this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).subscribe(() => {
            });
          }

          this._location.back();
        })
      }
      else {
        // Saving
        updateObj.createdAt = new Date().getTime();
        console.log(updateObj);
        // this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId).push(updateObj).then(_ => {
        //
        //   if (updateObj.asignee) {
        //     // Send notification to the assignee
        //     let notification = new MessageModel();
        //     notification.title = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE")
        //       : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_TITLE");
        //     notification.content = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: updateObj.task})
        //       : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_CONTENT", {actionName: updateObj.task});
        //
        //     notification.time = new Date().getTime();
        //     this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).subscribe(() => {
        //     });
        //   }
        //
        //   this._location.back();
        // });
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
      this.action.isAllHazards = !this.action.isAllHazards;
    }
    else {
      this.action.isAllHazards = false;
      this.action.hazards.set(hazardKey, event.target.checked ? event.target.checked : false);
      this.action.hazards.forEach((value, ) => {
        if (value) {
          this.action.allHazardsEnabled = true;
        }
      });
    }

    // Evaluate DueDate
    this.evaluateDueDate(hazardKey);
  }

  /**
   * Calculate the currency
   */
  private currency: number = Currency.GBP;
  private CURRENCIES = Constants.CURRENCY_SYMBOL;

  public calculateCurrency() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/currency", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.currency = snap.val();
      });
  }

  /**
   * Get the hazard image for the list of hazards
   */
  public getHazardImage(key) {
    return HazardImages.init().getCSS(key);
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


  protected backButtonAction() {
    this._location.back();
  }

}
