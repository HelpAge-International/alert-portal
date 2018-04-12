import {ActionsService} from './../../services/actions.service';
import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {
  ActionLevel, ActionType, AlertLevels, AlertMessageType, Currency, DurationType, HazardScenario,
  UserType
} from "../../utils/Enums";
import {LocalStorageService} from 'angular-2-local-storage';
import {AlertMessageModel} from '../../model/alert-message.model';
import {AgencyModulesEnabled, CountryPermissionsMatrix, PageControlService} from "../../services/pagecontrol.service";
import {Subject} from "rxjs";
import {HazardImages} from "../../utils/HazardImages";
import {Location} from "@angular/common";
import {PrepActionService, PreparednessUser} from "../../services/prepactions.service";
import {ModelDepartment} from "../../model/department.model";
import {UserService} from "../../services/user.service";
import {ModelHazard} from "../../model/hazard.model";
import {NotificationService} from "../../services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageModel} from "../../model/message.model";
import {takeUntil} from "rxjs/operator/takeUntil";

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
  public dueDate: Date;

  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;
  private oldAction;

  private departments: ModelDepartment[] = [];

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

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private prepActionService: PrepActionService = new PrepActionService();

  private moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();
  private permissionsAreEnabled: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  private hazardRedAlert: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();

  private now: Date = new Date();

  //Local Agency
  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private _location: Location, private route: ActivatedRoute,
              private af: AngularFire, private router: Router, private storage: LocalStorageService, private userService: UserService,
              private notificationService: NotificationService, private translate: TranslateService, private actionsService: ActionsService) {
    /* if selected generic action */
    this.actionSelected = this.storage.get('selectedAction');
    if (this.actionSelected && typeof (this.actionSelected) != 'undefined') {
      this.action.task = (typeof (this.actionSelected.task) != 'undefined') ? this.actionSelected.task : '';
      this.action.level = (typeof (this.actionSelected.level) != 'undefined') ? parseInt(this.actionSelected.level) : 0;
      this.action.requireDoc = (typeof (this.actionSelected.requireDoc) != 'undefined') ? this.actionSelected.requireDoc : 0;
      this.action.budget = (typeof (this.actionSelected.budget) != 'undefined') ? this.actionSelected.budget : 0;
      this.copyDepartmentId = (typeof (this.actionSelected.department) != 'undefined') ? this.actionSelected.department : 0;
      console.log(this.actionSelected);
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
      this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
        this.uid = user.uid;
        this.userType = userType;
        this.countryId = countryId;
        this.agencyId = agencyId;
        this.getStaffDetails(this.uid, true);

        PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, user.uid, Constants.USER_PATHS[userType], (isEnabled) => {
          this.moduleAccess = isEnabled;
        });

        if (this.isLocalAgency) {
          if (this.action.id != null) {
            this.showDueDate = true;
            this.initFromExistingActionIdLocalAgency(true, true);
          }
          else {
            this.action.isAllHazards = true;
          }
        } else {
          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, user.uid, userType, (isEnabled) => {
            this.permissionsAreEnabled = isEnabled;
            if (this.action.id != null) {
              this.showDueDate = true;
              this.initFromExistingActionId(userType == UserType.CountryAdmin ? true : this.permissionsAreEnabled.customMPA.Edit, userType == UserType.CountryAdmin ? true : this.permissionsAreEnabled.customAPA.Edit);
            }
            else {
              this.action.isAllHazards = true;
            }
          });
        }


        this.getHazards();
        this.initStaff();
        this.getDepartments();
        this.calculateCurrency();
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
          this.router.navigateByUrl("/preparedness/minimum")
        }
        else {
          this.router.navigateByUrl("/preparedness/advanced")
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
      this.action.isAllHazards = (action.assignedHazards != null ? action.assignedHazards && action.assignedHazards.length == 0 : true);
      this.action.isComplete = action.isComplete;
      this.action.isCompleteAt = action.isCompleteAt;
      if (action.frequencyValue != null && action.frequencyBase != null) {
        this.action.isFrequencyActive = true;
        this.action.frequencyType = action.frequencyBase;
        this.action.frequencyQuantity = action.frequencyValue;
      }
      this.action.computedClockSetting = action.computedClockSetting;

      if (!this.oldAction) {
        this.oldAction = Object.assign({}, this.action); // clones the object to see if the assignee changes in order to send notification
      }
    });
  }

  public initFromExistingActionIdLocalAgency(canEditMPA: boolean, canEditAPA: boolean) {
    this.prepActionService.initOneActionLocalAgency(this.af, this.ngUnsubscribe, this.uid, this.userType, this.action.id, (action) => {
      if ((action.level == ActionLevel.MPA && !canEditMPA) || (action.level == ActionLevel.APA && !canEditAPA)) {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/local-agency/preparedness/minimum")
        }
        else {
          this.router.navigateByUrl("/local-agency/preparedness/advanced")
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
      this.action.isAllHazards = (action.assignedHazards != null ? action.assignedHazards && action.assignedHazards.length == 0 : true);
      this.action.isComplete = action.isComplete;
      this.action.isCompleteAt = action.isCompleteAt;
      if (action.frequencyValue != null && action.frequencyBase != null) {
        this.action.isFrequencyActive = true;
        this.action.frequencyType = action.frequencyBase;
        this.action.frequencyQuantity = action.frequencyValue;
      }
      this.action.computedClockSetting = action.computedClockSetting;

      if (!this.oldAction) {
        this.oldAction = Object.assign({}, this.action); // clones the object to see if the assignee changes in order to send notification
      }
    });
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

    if (this.isLocalAgency) {

      this.af.database.list(Constants.APP_STATUS + "/alert/" + this.agencyId, {preserveSnapshot: true})
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

    } else {

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

    }


    // Populate actions
  }

  /**
   * Initialising departments
   */
  private getDepartments() {
    this.departments = []
    //for agency level
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
        });
        if (this.copyDepartmentId != null) {
          this.departments.forEach((value, key) => {
            if (this.copyDepartmentId == value.id) {
              // Copied Department exists in Action - Set current selection to it!
              this.action.department = this.copyDepartmentId;
            }
          })
        }
      });
    //for country level
    this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
        });
        if (this.copyDepartmentId != null) {
          this.departments.forEach((value, key) => {
            if (this.copyDepartmentId == value.id) {
              // Copied Department exists in Action - Set current selection to it!
              this.action.department = this.copyDepartmentId;
            }
          })
        }
      });
  }

  /**
   * Initialising hazards
   */
  private getHazards() {
    if (this.isLocalAgency) {
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.agencyId, {preserveSnapshot: true})
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
    } else {
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryId, {preserveSnapshot: true})
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
    if (this.isLocalAgency) {
      this.af.database.list(Constants.APP_STATUS + "/staff/" + this.agencyId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          snap.forEach((snapshot) => {
            this.getStaffDetails(snapshot.key, false);
          });
        });
    } else {
      this.af.database.list(Constants.APP_STATUS + "/staff/" + this.countryId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          snap.forEach((snapshot) => {
            this.getStaffDetails(snapshot.key, false);
          });
        });
    }
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

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};

    // Save/update the action
    if (this.action.validate(this.showDueDate)) {
      let updateObj: any = {};
      updateObj.dueDate = this.action.dueDate;
      updateObj.requireDoc = this.action.requireDoc;
      updateObj.type = this.action.type;
      updateObj.budget = this.action.budget;
      if (this.action.asignee != null && this.action.asignee != '' && this.action.asignee != undefined) {
        updateObj.asignee = this.action.asignee;
      }else {
        updateObj.asignee = null
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
      updateObj.updatedAt = currentTime;

      if (this.action.isComplete && (this.action.isCompleteAt + this.action.computedClockSetting < this.getNow())) {
        updateObj.isComplete = null;
        updateObj.isCompleteAt = null;
        updateObj.calculatedIsComplete = null;
      }

      if (this.action.id != null) {


        // Updating
        if (this.isLocalAgency) {

          this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.action.id)
            .take(1)
            .subscribe(action => {

              if (action.timeTracking) {
                // Change from unassigned to in progress

                if (updateObj.level == 2) {
                  if (action['timeTracking']['timeSpentInGrey'] && !action['timeTracking']['timeSpentInGrey'].includes(x => x.finish == -1)) {

                    if (action['timeTracking']['timeSpentInRed'] && !action['timeTracking']['timeSpentInAmber'] && updateObj.asignee) {
                      action['timeTracking']['timeSpentInRed'][0].finish = currentTime;
                      action['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                      updateObj['timeTracking'] = action['timeTracking']
                    }

                    // Change from complete to in progress
                    if (action['timeTracking']['timeSpentInGreen'] && action['timeTracking']['timeSpentInGreen'].includes(x => x.finish == -1) && this.action.isComplete && !updateObj.isComplete) {
                      action['timeTracking']['timeSpentInGreen'].forEach(timeObject => {
                        if (timeObject.finish == -1) {
                          action['timeTracking']['timeSpentInGreen'][timeObject].finish = currentTime
                          action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
                          updateObj['timeTracking'] = action['timeTracking']
                          return;
                        }
                      })
                    }

                  }
                } else {
                  if (action['timeTracking']['timeSpentInRed'] && !action['timeTracking']['timeSpentInAmber'] && updateObj.asignee) {
                    action['timeTracking']['timeSpentInRed'][0].finish = currentTime;
                    action['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                    updateObj['timeTracking'] = action['timeTracking']
                  }

                  // Change from complete to in progress
                  if (action['timeTracking']['timeSpentInGreen'] && action['timeTracking']['timeSpentInGreen'].includes(x => x.finish == -1) && this.action.isComplete && !updateObj.isComplete) {
                    action['timeTracking']['timeSpentInGreen'].forEach(timeObject => {
                      if (timeObject.finish == -1) {
                        action['timeTracking']['timeSpentInGreen'][timeObject].finish = currentTime
                        action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
                        updateObj['timeTracking'] = action['timeTracking']
                        return;
                      }
                    })
                  }
                }

              }


              this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.action.id).update(updateObj).then(_ => {

                if (updateObj.asignee && updateObj.asignee != this.oldAction.asignee) {
                  // Send notification to the assignee
                  let notification = new MessageModel();
                  const translateText = (this.action.level == ActionLevel.MPA) ? "ASSIGNED_MPA_ACTION" : "ASSIGNED_APA_ACTION";
                  notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_TITLE");
                  notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_CONTENT", {actionName: (updateObj.task ? updateObj.task : (this.action.task ? this.action.task : ''))});
                  console.log("Updating:");
                  console.log(notification.content);

                  notification.time = new Date().getTime();
                  this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).first().subscribe(() => {
                  });
                }

                //this._location.back();
                if (this.action.level == ActionLevel.MPA) {
                  this.router.navigateByUrl("/local-agency/preparedness/minimum")
                }
                else {
                  this.router.navigateByUrl("/local-agency/preparedness/advanced")
                }
              })
            })
        } else {

          this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id)
            .first()
            .subscribe(action => {

              if (action.timeTracking) {

                if (updateObj.level) {
                  if (action['timeTracking']['timeSpentInGrey'] && !action['timeTracking']['timeSpentInGrey'].includes(x => x.finish == -1)) {

                    // Change from unassigned to in progress
                    if (action['timeTracking']['timeSpentInRed'] && !action['timeTracking']['timeSpentInAmber'] && updateObj.asignee) {
                      action['timeTracking']['timeSpentInRed'][0].finish = currentTime;
                      action['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                      updateObj['timeTracking'] = action['timeTracking']
                    }

                    // Change from complete to in progress
                    if (action['timeTracking']['timeSpentInGreen'] && action['timeTracking']['timeSpentInGreen'].includes(x => x.finish == -1) && this.action.isComplete && !updateObj.isComplete) {
                      console.log('switch from complete to in progress')
                      action['timeTracking']['timeSpentInGreen'].forEach(timeObject => {
                        if (timeObject.finish == -1) {
                          action['timeTracking']['timeSpentInGreen'][timeObject].finish = currentTime
                          action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
                          updateObj['timeTracking'] = action['timeTracking']
                          return;
                        }
                      })
                    }
                  }
                } else {

                  // Change from unassigned to in progress
                  if (action['timeTracking']['timeSpentInRed'] && !action['timeTracking']['timeSpentInAmber'] && updateObj.asignee) {
                    action['timeTracking']['timeSpentInRed'][0].finish = currentTime;
                    action['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                    updateObj['timeTracking'] = action['timeTracking']
                  }

                  // Change from complete to in progress
                  if (action['timeTracking']['timeSpentInGreen'] && action['timeTracking']['timeSpentInGreen'].includes(x => x.finish == -1) && this.action.isComplete && !updateObj.isComplete) {
                    console.log('switch from complete to in progress')
                    action['timeTracking']['timeSpentInGreen'].forEach(timeObject => {
                      if (timeObject.finish == -1) {
                        action['timeTracking']['timeSpentInGreen'][timeObject].finish = currentTime
                        action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
                        updateObj['timeTracking'] = action['timeTracking']
                        return;
                      }
                    })
                  }

                }

              }

              this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id).update(updateObj).then(_ => {

                if (updateObj.asignee && updateObj.asignee != this.oldAction.asignee) {
                  // Send notification to the assignee
                  let notification = new MessageModel();
                  const translateText = (this.action.level == ActionLevel.MPA) ? "ASSIGNED_MPA_ACTION" : "ASSIGNED_APA_ACTION";
                  notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_TITLE");
                  notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_CONTENT", {actionName: (updateObj.task ? updateObj.task : (this.action.task ? this.action.task : ''))});
                  console.log("Updating:");
                  console.log(notification.content);

                  notification.time = new Date().getTime();

                  this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).first().subscribe(() => {
                  });
                }

                //this._location.back();
                if (this.action.level == ActionLevel.MPA) {
                  this.router.navigateByUrl("/preparedness/minimum");
                }
                else {
                  this.router.navigateByUrl("/preparedness/advanced");
                }
              })
            })
        }
      } else {
        // Saving

        updateObj['timeTracking'] = {}

        updateObj.createdAt = currentTime;
        if (this.isLocalAgency) {

          this.actionsService.getAlerts(this.agencyId, true)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(alerts => {
              let isRedAlert = false;

              if (updateObj.level == 2) {
                alerts.forEach(alert => {
                  if (!updateObj.assignHazard) {
                    isRedAlert = true;
                  } else if (updateObj.assignHazard.includes(alert.hazardScenario) && alert.alertLevel == 2) {
                    isRedAlert = true;
                  }
                })
              }

              if (updateObj.level == 2) {
                if (isRedAlert) {
                  if (updateObj.asignee) {
                    updateObj['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                  } else {
                    updateObj['timeTracking']['timeSpentInRed'] = [newTimeObject]
                  }
                } else {
                  updateObj['timeTracking']['timeSpentInGrey'] = [newTimeObject]
                }
              } else {
                if (updateObj.asignee) {
                  updateObj['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                } else {
                  updateObj['timeTracking']['timeSpentInRed'] = [newTimeObject]
                }
              }

              this.af.database.list(Constants.APP_STATUS + "/action/" + this.agencyId).push(updateObj).then(_ => {

                if (updateObj.asignee) {
                  // Send notification to the assignee
                  let notification = new MessageModel();
                  notification.title = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE")
                    : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_TITLE");
                  notification.content = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: updateObj.task})
                    : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_CONTENT", {actionName: updateObj.task});

                  notification.time = new Date().getTime();
                  this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).first().subscribe(() => {
                  });
                }

                //this._location.back();
                if (this.action.level == ActionLevel.MPA) {
                  this.router.navigateByUrl("/local-agency/preparedness/minimum")
                }
                else {
                  this.router.navigateByUrl("/local-agency/preparedness/advanced")
                }

              });


            })


        } else {

          this.actionsService.getAlerts(this.countryId, false)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(alerts => {
              let isRedAlert = false;

              console.log(updateObj)
              if (updateObj.level == 2) {
                alerts.forEach(alert => {
                  if (!updateObj.assignHazard) {
                    isRedAlert = true;
                  } else if (updateObj.assignHazard.includes(alert.hazardScenario) && alert.alertLevel == 2) {
                    isRedAlert = true;
                  }
                })
              }

              if (updateObj.level == 2) {
                if (isRedAlert) {
                  if (updateObj.asignee) {
                    updateObj['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                  } else {
                    updateObj['timeTracking']['timeSpentInRed'] = [newTimeObject]
                  }
                } else {
                  updateObj['timeTracking']['timeSpentInGrey'] = [newTimeObject]
                }
              } else {
                if (updateObj.asignee) {
                  updateObj['timeTracking']['timeSpentInAmber'] = [newTimeObject]
                } else {
                  updateObj['timeTracking']['timeSpentInRed'] = [newTimeObject]
                }
              }


              this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId).push(updateObj).then(_ => {

                if (updateObj.asignee) {
                  // Send notification to the assignee
                  let notification = new MessageModel();
                  notification.title = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE")
                    : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_TITLE");
                  notification.content = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: updateObj.task})
                    : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_CONTENT", {actionName: updateObj.task});

                  notification.time = new Date().getTime();
                  this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).first().subscribe(() => {
                  });
                }

                //this._location.back();
                if (this.action.level == ActionLevel.MPA) {
                  this.router.navigateByUrl("/preparedness/minimum");
                }
                else {
                  this.router.navigateByUrl("/preparedness/advanced");
                }
              });

            })


        }
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
      this.action.hazards.forEach((value, key) => {
        if (value) {
          this.action.allHazardsEnabled = true;
        }
      });
    }

    // Evaluate DueDate
    this.evaluateDueDate(hazardKey);
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
    if (this.isLocalAgency) {
      this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.action.id).update(updateObj).then(_ => {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/local-agency/preparedness/minimum");
        }
        else {
          this.router.navigateByUrl("/local-agency/preparedness/advanced");
        }
      });
    } else {
      this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id).update(updateObj).then(_ => {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/preparedness/minimum");
        }
        else {
          this.router.navigateByUrl("/preparedness/advanced");
        }
      });
    }
  }

  /**
   * Delete an action
   */
  public deleteAction() {
    this.closeActionCancel('delete-action');
    if (this.isLocalAgency) {
      this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.action.id).set(null).then(_ => {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/local-agency/preparedness/minimum");
        }
        else {
          this.router.navigateByUrl("/local-agency/preparedness/advanced");
        }
      });
    } else {
      this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + this.action.id).set(null).then(_ => {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/preparedness/minimum");
        }
        else {
          this.router.navigateByUrl("/preparedness/advanced");
        }
      });
    }
  }


  /**
   * Get the hazard image for the list of hazards
   */
  public getHazardImage(key) {
    return HazardImages.init().getCSS(key);
  }


  protected backButtonAction() {
    if(this.isLocalAgency){
      if (this.action.level == ActionLevel.MPA) {
        this.router.navigateByUrl("/local-agency/preparedness/minimum");
      }
      else {
        this.router.navigateByUrl("/local-agency/preparedness/advanced");
      }
    }else{
      if (this.action.level == ActionLevel.MPA) {
        this.router.navigateByUrl("/preparedness/minimum");
      }
      else {
        this.router.navigateByUrl("/preparedness/advanced");
      }
    }
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
  public createdByAgencyId: string;
  public createdByCountryId: string;
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

  public agencyAssign?:string
  public timeTracking?:any

  constructor() {
    this.type = ActionType.custom;
  }

  public validate(amShowingDueDate: boolean) {
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
    if ((this.dueDate == undefined || this.dueDate == 0) && amShowingDueDate) {
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
