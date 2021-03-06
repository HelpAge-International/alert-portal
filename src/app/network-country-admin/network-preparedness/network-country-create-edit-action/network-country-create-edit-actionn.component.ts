import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ActionsService} from './../../../services/actions.service';
import {
  ActionLevel,
  ActionType,
  AlertLevels,
  AlertMessageType,
  Currency,
  DurationType,
  HazardScenario,
  UserType,
  NetworkUserAccountType
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
import {AgencyService} from "../../../services/agency-service.service";
import {ModelAgency} from "../../../model/agency.model";
import {identifierModuleUrl} from '@angular/compiler';
import {CommonUtils} from "../../../utils/CommonUtils";
import {Observable} from "rxjs/Observable";

declare var jQuery: any;

@Component({
  selector: 'app-network-country-create-edit-actionn',
  templateUrl: './network-country-create-edit-actionn.component.html',
  styleUrls: ['./network-country-create-edit-actionn.component.css']
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
  private systemId: string;
  private isViewing: boolean;


  //copy over
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";

  private uid: string;
  private userType: number;
  private networkUserType: NetworkUserAccountType;
  private userTypes = UserType;
  private networkUserTypes = NetworkUserAccountType;
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
  private isApproved: boolean;
  private agencyName: string;
  private selectedAgency = [];
  private agenciesInNetwork = [];

  //for local network admin
  private isLocalNetworkAdmin: boolean;
  private networkViewValues: {};
  private copyCountryOfficeCode: any;
  private usersForAssign: any = [];
  private hasUsers: boolean = false;


  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private _location: Location,
              private networkService: NetworkService,
              private notificationService: NotificationService,
              private userService: UserService,
              private storage: LocalStorageService,
              private _agencyService: AgencyService,
              private _userService: UserService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private actionsService: ActionsService,
              private router: Router) {

    /* if selected generic action */
    this.actionSelected = this.storage.get('selectedAction');
    if (this.actionSelected && typeof (this.actionSelected) != 'undefined') {
      this.action.task = (typeof (this.actionSelected.task) != 'undefined') ? this.actionSelected.task : '';
      this.action.level = (typeof (this.actionSelected.level) != 'undefined') ? parseInt(this.actionSelected.level) : 0;
      this.action.requireDoc = (typeof (this.actionSelected.requireDoc) != 'undefined') ? this.actionSelected.requireDoc : 0;
      this.action.budget = (typeof (this.actionSelected.budget) != 'undefined') ? this.actionSelected.budget : 0;
      this.copyDepartmentId = (typeof (this.actionSelected.department) != 'undefined') ? this.actionSelected.department : 0;
      // TODO: Check if this is being used anywhere else and potentially remove it?
      // TODO: This causes a bug with going back and forth on the page
      this.storage.remove('selectedAction');
      this.actionSelected = {};
    }

  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }
      if (params['id']) {
        this.action.id = params['id'];
        this.editDisableLoading = true;
      }
      if (params["isViewing"]) {
        this.isViewing = params["isViewing"];
      }
      if (params["systemId"]) {
        this.systemId = params["systemId"];
      }
      if (params["agencyId"]) {
        this.agencyId = params["agencyId"];
      }
      if (params["countryId"]) {
        this.countryId = params["countryId"];
      }
      if (params["userType"]) {
        this.userType = params["userType"];
      }
      if (params["networkId"]) {
        this.networkId = params["networkId"];
      }
      if (params["networkCountryId"]) {
        this.networkCountryId = params["networkCountryId"];
      }
      if (params["countryOfficeCode"]) {
        this.copyCountryOfficeCode = params["countryOfficeCode"];
      }
      if (params["uid"]) {
        this.uid = params["uid"];
      }

      this.isViewing ? this.initViewNetworkAccess() : this.isLocalNetworkAdmin ? this.initLocalNetworkAccess() : this.initNetworkAccess();
    })

  }

  private initNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      console.log('network access')
      this.showLoader = true;
      this.uid = user.uid;


      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.showLoader = false;
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          this.userType = selection["userType"];
          this.networkUserType = selection["userType"];
          this.agencyId = selection["agencyId"];

          this.getStaffDetails(this.uid, true);


          this.networkService.getNetworkModuleMatrix(this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(modules => {
              this.moduleAccess = modules
            });

          this.getHazards();
          // this.initStaff();
          this.calculateCurrency();

          this.networkService.getSystemIdForNetworkCountryAdmin(this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(systemId => {
              this.systemId = systemId;

              if (this.action.id != null) {
                this.showDueDate = true;
                this.initFromExistingActionId(true, true);
              }
              else {
                this.action.isAllHazards = true;
              }
              this.getAgencyList();
            });
        });
    });
  }

  private initLocalNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.showLoader = false;
          this.networkId = selection["id"];
          this.userType = selection["userType"];
          this.networkUserType = selection["userType"];

          this.getStaffDetails(this.uid, true);

          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(modules => {
              this.moduleAccess = modules
            });

          this.getHazards();
          // this.initStaff();
          this.calculateCurrency();

          this.networkService.getSystemIdForNetworkAdmin(this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(systemId => {
              this.systemId = systemId;

              if (this.action.id != null) {
                this.showDueDate = true;
                this.initFromExistingActionId(true, true);
              }
              else {
                this.action.isAllHazards = true;
              }
            });

          this.getAgenciesForLocalNetwork();
        });
    });
  }

  private initViewNetworkAccess() {
    this.getStaffDetails(this.uid, true);

    let id = this.networkCountryId && this.networkCountryId != "undefined" ? this.networkCountryId : this.networkId

    this.networkService.getNetworkModuleMatrix(id)
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

    this.networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  getAgencyList() {

    // get agencies in network
    this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + this.networkId + '/' + this.networkCountryId + '/agencyCountries', {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {

        let filterList = Object.keys(list.val()).map(key => {
          let obj = {}
          obj["agencyId"] = key
          let approved = Object.keys(list.val()[key]).map(id => list.val()[key][id])[0].isApproved
          obj["isApproved"] = approved;
          this.selectedAgency.push(key);
          return obj
        }).filter(obj => obj["isApproved"]).map(item => item["agencyId"])


        filterList.forEach(item => {
          this._agencyService.getAgencyModel(item)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(get => {
              this.agenciesInNetwork.push(get);
            })

        })

      })

  }

  /**
   * Initialisation
   */
  public initFromExistingActionId(canEditMPA: boolean, canEditAPA: boolean) {
    this.isLocalNetworkAdmin ? this.loadForLocalNetworkAdmin(canEditMPA, canEditAPA) : this.loadForNetworkCountry(canEditMPA, canEditAPA);
  }

  private loadForNetworkCountry(canEditMPA: boolean, canEditAPA: boolean) {
    this.prepActionService.initOneActionNetwork(this.af, this.ngUnsubscribe, this.networkCountryId, this.networkId, this.systemId, this.action.id, (action) => {
      if ((action.level == ActionLevel.MPA && !canEditMPA) || (action.level == ActionLevel.APA && !canEditAPA)) {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/network-country/network-country-mpa");
        }
        else {
          this.router.navigateByUrl("/network-country/network-country-apa");
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

  private loadForLocalNetworkAdmin(canEditMPA: boolean, canEditAPA: boolean) {
    this.prepActionService.initOneActionNetworkLocal(this.af, this.ngUnsubscribe, this.networkId, this.systemId, this.action.id, (action) => {
      if ((action.level == ActionLevel.MPA && !canEditMPA) || (action.level == ActionLevel.APA && !canEditAPA)) {
        if (this.action.level == ActionLevel.MPA) {
          this.router.navigateByUrl("/network/local-network-preparedness-mpa");
        }
        else {
          this.router.navigateByUrl("/network/local-network-preparedness-apa");
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
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.list(Constants.APP_STATUS + "/alert/" + id, {preserveSnapshot: true})
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
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + id, {preserveSnapshot: true})
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

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};

    // Save/update the action
    if (this.action.validate(this.showDueDate)) {
      let updateObj: any = {};
      // if (this.showDueDate) {
      updateObj.dueDate = this.action.dueDate;
      // }
      updateObj.requireDoc = this.action.requireDoc;
      updateObj.type = this.action.type;
      updateObj.budget = this.action.budget;
      if (this.action.asignee != null && this.action.asignee != '' && this.action.asignee != undefined && this.action.asignee != 'null') {
        updateObj.asignee = this.action.asignee;
        // if (this.isViewing) {
        //   updateObj.createdByAgencyId = this.agencyId;
        //   updateObj.createdByCountryId = this.countryId;
        // }
      } else {
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

      let id;

      if (this.isViewing) {
        id = this.networkCountryId ? this.networkCountryId : this.networkId
      } else {
        id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
      }

      if (updateObj.asignee && updateObj.asignee == 'null') {
        updateObj.asignee = null
      }

      if (updateObj.asignee) {
        if (this.userType != NetworkUserAccountType.NetworkAdmin || this.userType != NetworkUserAccountType.NetworkCountryAdmin) {
          updateObj.createdByAgencyId = this.agencyId;
          updateObj.createdByCountryId = this.countryId ? this.countryId : this.agencyId;

        } else {
          updateObj.createdByAgencyId = null
          updateObj.createdByCountryId = null
        }

        if (this.action.id != null) {
          this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.action.id)
            .first()
            .subscribe(action => {

              if (action.timeTracking) {

                if (action.level == 2) {
                  if (action['timeTracking']['timeSpentInGrey'] && !action['timeTracking']['timeSpentInGrey'].includes(x => x.finish == -1)) {
                    // Change from unassigned to in progress
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
                  // Change from unassigned to in progress
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

              // Updating
              console.log(updateObj)
              this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.action.id).update(updateObj).then(() => {

                if (updateObj.asignee != this.oldAction.asignee) {

                  // Send notification to the assignee
                  let notification = new MessageModel();
                  const translateText = (this.action.level == ActionLevel.MPA) ? "ASSIGNED_MPA_ACTION" : "ASSIGNED_APA_ACTION";
                  notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_TITLE");
                  notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES." + translateText + "_CONTENT", {actionName: (updateObj.task ? updateObj.task : (this.action.task ? this.action.task : ''))});

                  notification.time = new Date().getTime();
                  this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).first().subscribe();
                }
                // this._location.back()
                this.backToRightPage(this.action)
              })
            });
        } else {

          updateObj['timeTracking'] = {}
          this.actionsService.getAlerts(this.agencyId, true)
            .first()
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
              // Saving
              updateObj.createdAt = new Date().getTime();
              updateObj.networkId = this.networkId;
              updateObj.agencyAssign = this.action.agencyAssign && this.action.agencyAssign != 'null' ? this.action.agencyAssign : null
              console.log(updateObj);
              this.af.database.list(Constants.APP_STATUS + "/action/" + id)
                .push(updateObj)
                .then(() => {
                  // Send notification to the assignee
                  if (updateObj.asignee) {
                    let notification = new MessageModel();
                    notification.title = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE")
                      : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_TITLE");
                    notification.content = (this.action.level == ActionLevel.MPA) ? this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: updateObj.task})
                      : this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_CONTENT", {actionName: updateObj.task});

                    notification.time = new Date().getTime();
                    this.notificationService.saveUserNotificationWithoutDetails(updateObj.asignee, notification).first().subscribe();
                  }
                  // this._location.back();
                  this.backToRightPage(this.action)
                });
            })
        }
      } else {

        if (this.action.id != null) {
          this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.action.id)
            .first()
            .subscribe(action => {
              if (action.timeTracking) {

                if (action.level == 2) {
                  if (action['timeTracking']['timeSpentInGrey'] && !action['timeTracking']['timeSpentInGrey'].includes(x => x.finish == -1)) {
                    // Change from unassigned to in progress
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
                  // Change from unassigned to in progress
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

              // Updating
              updateObj.agencyAssign = this.action.agencyAssign && this.action.agencyAssign != 'null' ? this.action.agencyAssign : null
              console.log(updateObj);
              this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.action.id).update(updateObj).then(() => {
                // this._location.back();
                this.backToRightPage(this.action)
              });
            })
        } else {

          updateObj['timeTracking'] = {}

          this.actionsService.getAlerts(this.agencyId, true)
            .first()
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
              // Saving
              updateObj.createdAt = new Date().getTime();
              updateObj.networkId = this.networkId;
              updateObj.agencyAssign = this.action.agencyAssign && this.action.agencyAssign != 'null' ? this.action.agencyAssign : null
              console.log(updateObj);
              this.af.database.list(Constants.APP_STATUS + "/action/" + id).push(updateObj)
                .then(() => {
                  // this._location.back();
                  this.backToRightPage(this.action)
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
      this.action.hazards.forEach((value,) => {
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
    this.initCountryAdmin()
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
   * Archive an action
   */
  public archiveAction() {
    // Updating
    let updateObj = {
      isArchived: true
    };
    // this.closeActionCancel('archive-action');
    jQuery("#archive-action").modal('hide');
    let id = this.networkCountryId ? this.networkCountryId : this.networkId;
    this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.action.id).update(updateObj).then(() => {
      this.isViewing ?
        this.networkCountryId ?
          this.router.navigate(this.action.level == ActionLevel.MPA ? ["/network-country/network-country-mpa", this.networkViewValues] : ["/network-country/network-country-apa", this.networkViewValues])
          :
          this.router.navigate(this.action.level == ActionLevel.MPA ? ["/network/local-network-preparedness-mpa", this.networkViewValues] : ["/network/local-network-preparedness-apa", this.networkViewValues])
        :
        this.isLocalNetworkAdmin ? this.router.navigateByUrl(this.action.level == ActionLevel.MPA ? "/network/local-network-preparedness-mpa" : "/network/local-network-preparedness-apa") : this.router.navigateByUrl(this.action.level == ActionLevel.MPA ? "/network-country/network-country-mpa" : "/network-country/network-country-apa");
    });
  }

  /**
   * Delete an action
   */
  public deleteAction() {
    // this.closeActionCancel('delete-action');
    jQuery("#delete-action").modal('hide');
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.action.id).set(null).then(() => {
      this.isViewing ?
        this.router.navigate(this.action.level == ActionLevel.MPA ? ["/network-country/network-country-mpa", this.networkViewValues] : ["/network-country/network-country-apa", this.networkViewValues])
        :
        this.isLocalNetworkAdmin ? this.router.navigateByUrl(this.action.level == ActionLevel.MPA ? "/network/local-network-preparedness-mpa" : "/network/local-network-preparedness-apa") : this.router.navigateByUrl(this.action.level == ActionLevel.MPA ? "/network-country/network-country-mpa" : "/network-country/network-country-apa");
    });
  }


  protected backButtonAction() {
    // this._location.back();
    this.backToRightPage(this.action)
  }

  protected showActionConfirm(modal: string) {
    jQuery("#" + modal).modal('show');
  }

  private getAgenciesForLocalNetwork() {
    this.networkService.mapAgencyCountryForLocalNetworkCountry(this.networkId)
      .flatMap(agencyCountryMap => {
        this.agenciesInNetwork = []
        return Observable.from(CommonUtils.convertMapToKeysInArray(agencyCountryMap))
      })
      .flatMap(agencyId => {
        return this._agencyService.getAgencyModel(agencyId)
      })
      .distinct(agency => agency.id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agency => this.agenciesInNetwork.push(agency))
  }

  private backToRightPage(action: CreateEditPrepActionHolder) {
    this.isViewing ? this._location.back()
      :
      this.isLocalNetworkAdmin ?
        action.level === ActionLevel.APA ? this.router.navigateByUrl('/network/local-network-preparedness-apa') : this.router.navigateByUrl('/network/local-network-preparedness-mpa')
        :
        action.level === ActionLevel.APA ? this.router.navigateByUrl('/network-country/network-country-apa') : this.router.navigateByUrl('/network-country/network-country-mpa')
  }
}
