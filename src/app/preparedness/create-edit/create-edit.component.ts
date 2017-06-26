import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ActionLevel, AlertMessageType, DurationType, HazardCategory} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {LocalStorageService} from 'angular-2-local-storage';
import {AlertMessageModel} from '../../model/alert-message.model';
import {AgencyModulesEnabled, PageControlService} from "../../services/pagecontrol.service";
import {Observable, Subject} from "rxjs";
import {HazardImages} from "../../utils/HazardImages";
import {Location} from "@angular/common";
declare var jQuery: any;

@Component({
  selector: 'app-preparedness',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditPreparednessComponent implements OnInit, OnDestroy {
  private disableAll: boolean;
  private UserType: number;
  private hazardSelectionMap = new Map<number, boolean>();
  private requireDoc:boolean;

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  private uid: string;

  private actionID: string;
  private modalID: string;
  private departmentsPath: string;
  private departments: Observable<any>;
  private newDepartmentErrorInactive: boolean = true;


  private actionSelected: any = {};
  private copyActionData: any = {};

  private countryID: string;
  private agencyID: string;
  private actionData: Action;
  private dueDate: any;

  private frequencyDefaultSettings: any = {};
  private allowedFrequencyValue: any = [];

  private level: number;
  private frequencyActive: boolean = false;
  private usersForAssign: any = [];
  private frequency = new Array(100);

  private department = Constants.DEPARTMENT;
  private departmentList: any = [];
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";

  private actionLevel = Constants.ACTION_LEVEL;
  private actionLevelList: number[] = [ActionLevel.MPA, ActionLevel.APA];

  // private hazardCategory = Constants.HAZARD_CATEGORY;
  private hazardCategory = Constants.HAZARD_SCENARIOS;
  // private hazardCategoryList: number[] = [HazardCategory.Earthquake, HazardCategory.Tsunami, HazardCategory.Drought];
  private hazardCategoryList = [];
  private hazardCategoryIconClass = Constants.HAZARD_CATEGORY_ICON_CLASS;

  private durationType = Constants.DURATION_TYPE;
  private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];
  private allowedDurationList: number[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();

  constructor(private pageControl: PageControlService, private _location: Location, private route: ActivatedRoute, private af: AngularFire, private router: Router, private storage: LocalStorageService) {
    this.actionData = new Action();
    this.setDefaultActionDataValue();
    /* if selected generic action */
    this.actionSelected = this.storage.get('selectedAction');
    if (this.actionSelected && typeof (this.actionSelected) != 'undefined') {
      this.actionData.task = (typeof (this.actionSelected.task) != 'undefined') ? this.actionSelected.task : '';
      this.level = (typeof (this.actionSelected.level) != 'undefined') ? parseInt(this.actionSelected.level) - 1 : 0;
      this.actionData.requireDoc = (typeof (this.actionSelected.requireDoc) != 'undefined') ? this.actionSelected.requireDoc : 0;
      this.storage.remove('selectedAction');
      this.actionSelected = {};
    }

    /* if copy action */
    this.copyActionData = this.storage.get('copyActionData');
    if (this.copyActionData && typeof (this.copyActionData) != 'undefined') {
      this.actionData = this.copyActionData;
      this.level = this.copyActionData.level + 1;
      this.dueDate = this._convertTimestampToDate(this.copyActionData.dueDate);
      this.storage.remove('copyActionData');
      this.copyActionData = {};
      this.setDefaultActionDataValue();
    }

    this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
      if (params['id']) {
        /* TODO remove hardcode actionID */
        this.actionID = params['id'];
      }
    });
  }

  processSave() {
    console.log(this.actionData);
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;

      PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, user.uid, Constants.USER_PATHS[userType], (isEnabled) => {
        this.moduleAccess = isEnabled;
        this.actionData.level = 0;
      });

      this._defaultHazardCategoryValue();
      this.processPage();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  _departmentList() {
    this.af.database.object(this.departmentsPath).takeUntil(this.ngUnsubscribe).subscribe((departments: any) => {
      this.departmentList = [];
      for (let department in departments) {
        if (department != '$key' && department != '$exists') {
          this.departmentList.push(department)
        }
      }
    });
  }

  setDefaultActionDataValue() {
    this.actionData.type = 2;
    this.actionData.isComplete = false;
    this.actionData.isActive = true;
    this.actionData.actionStatus = 1;
    if (typeof (this.actionData.frequencyBase) == 'undefined' && typeof (this.actionData.frequencyValue) == 'undefined') {
      this.actionData.frequencyBase = 0;
      this.actionData.frequencyValue = 1;
    }
  }

  saveAction(isValid: boolean) {
    if (!isValid || !this._isValidForm()) {
      return false;
    }
    if (!this.actionID) {
      if (typeof (this.actionData.frequencyBase) == 'undefined' && typeof (this.actionData.frequencyValue) == 'undefined') {
        this.actionData.frequencyBase = this.frequencyDefaultSettings.type;
        this.actionData.frequencyValue = this.frequencyDefaultSettings.value;
      }
    }

    if (typeof (this.actionData.level) == 'undefined') {
      this.actionData.level = this.level;
    }
    if (!this.actionData.level) {
      this._defaultHazardCategoryValue();
    }
    if (!this.frequencyActive) {
      this.actionData.frequencyBase = this.frequencyDefaultSettings.type;
      this.actionData.frequencyValue = this.frequencyDefaultSettings.value;
    }

    //store all selected hazards
    let selectedHazard = [];
    if (this.hazardSelectionMap.get(-1)) {
      for (let i = 0; i < Constants.HAZARD_SCENARIOS.length; i++) {
        selectedHazard.push(i);
      }
    } else {
      this.hazardSelectionMap.forEach((v, k) => {
        if (v) {
          selectedHazard.push(k);
        }
      });
    }
    this.actionData.assignHazard = selectedHazard;
    //check at least one selected
    let oneChecked = false;
    this.hazardSelectionMap.forEach((v, k) => {
      if (v) {
        oneChecked = true;
      }
    });
    if (!oneChecked && this.actionData.level == ActionLevel.APA) {
      console.log("at least one need to be selected");
      this.alertMessage = new AlertMessageModel("At least one hazard need to be selected");
      return;
    }

    let dataToSave = Object.assign({}, this.actionData);
    dataToSave.requireDoc = (dataToSave.requireDoc == 1) ? true : false;


    if (!this.actionID) {
      this.af.database.list(Constants.APP_STATUS + '/action/' + this.countryID)
        .push(dataToSave)
        .then(() => {
          this.backButtonAction();
          console.log('success save data');
        }).catch((error: any) => {
        console.log(error, 'You do not have access!')
      });
    } else {
      this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID)
        .set(dataToSave)
        .then(() => {
          this.backButtonAction();
          console.log('success update');
        }).catch((error: any) => {
        console.log(error, 'You do not have access!')
      });
    }
  }

  processPage() {
    this.getCountryID().then(() => {
      this.getUsersForAssign();
      this.getAgencyID().then(() => {
        this._getPreparednessFrequency().then(() => {
          if (this.actionID) {
            this.getActionData().then(() => {
            });
          }
          this._parseSelectParams();
          this._frequencyIsActive();

          //get all monitored hazards
          this.getAssociatedHazards();
        });
      });
    });
  }

  private getAssociatedHazards() {
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(hazards => {
        console.log(hazards);
        this.hazardCategoryList = hazards;
      });
  }

  selectHazardCategory(hazardKey: number, event: any) {
    this.hazardSelectionMap.set(hazardKey, event.target.checked);
    this.anySelected();
    // var val = event.target.checked ? event.target.checked : false;
    // this.actionData.assignHazard[hazardKey] = val;
  }

  selectAllHazard(event: any) {
    this.hazardSelectionMap.set(-1, event.target.checked);
    this.anySelected();
    console.log(this.hazardSelectionMap);
    // var value = event.target.checked ? event.target.checked : false;
    // this.actionData.assignHazard.forEach((val, key) => {
    //   this.actionData.assignHazard[key] = value;
    // });
  }

  selectDepartment(event: any) {
    this.actionData.department = event.target.value;
    if (event.target.value == '+ Add a department') {
      this.modalID = 'add_department';
      jQuery("#" + this.modalID).modal("show");
    }
    return true;
  }

  selectActionLevel(levelKey: number) {
    if (!this.moduleAccess.minimumPreparedness && levelKey == 1) {
      // Ignore
    }
    else if (!this.moduleAccess.advancedPreparedness && levelKey == 2) {
      // Ignore
    }
    else {
      this.actionData.level = levelKey;
    }
    return true;
  }

  selectDate(date: any) {
    var dueDateTimestamp = this._convertDateToTimestamp(date);
    this.actionData.dueDate = dueDateTimestamp;
    return true;
  }

  selectFrequencyBase(event: any) {
    var frequencyBase = event.target.value;
    this.actionData.frequencyBase = parseInt(frequencyBase);
    if (!jQuery.isEmptyObject(this.frequencyDefaultSettings)) {
      this.frequency = new Array(this.allowedFrequencyValue[frequencyBase]);
    }
    return true;
  }

  selectFrequency(event: any) {
    this.actionData.frequencyValue = parseInt(event.target.value);
    return;
  }

  selectAssignUser(event: any) {
    var selectedUser = event.target.value ? event.target.value : "";
    if (!selectedUser) {
      delete this.actionData.asignee;
      return true;
    }
    this.actionData.asignee = event.target.value;
    return true;
  }

  checkTypeOf(departmentKey: any) {
    if (typeof (departmentKey) == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  getUsersForAssign() {
    /* TODO if user ERT OR Partner, assign only me */
    this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: any) => {
        console.log("***")
        console.log(data);
        for (let userID in data) {
          if (userID.indexOf("$") < 0) {
            this.addUsersToAssign(userID);
          }
        }
      });
    this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data) => {
        let cId = data.val().countryId;
        let aId = "";
        for (let x in data.val().agencyAdmin) {
          aId = x;
        }
        this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + aId + "/" + cId, {preserveSnapshot: true})
          .takeUntil(this.ngUnsubscribe)
          .subscribe((snap) => {
            this.addUsersToAssign(snap.val().adminId);
          })
      });
  }

  addUsersToAssign(userID: string) {
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID)
      .subscribe((data: ModelUserPublic) => {
      let skip = false;
        for (let x of this.usersForAssign) {
          if (x.userID == userID) {
            x.firstName = data.firstName;
            skip = true;
          }
        }
        if (!skip) {
          let userToPush = {userID: userID, firstName: data.firstName};
          this.usersForAssign.push(userToPush);
        }
      });
  }

  frequencyIsActive(event: any) {
    this.frequencyActive = event.target.checked;
    return true;
  }

  getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/countryId').takeUntil(this.ngUnsubscribe).subscribe((countryID: any) => {
        this.countryID = countryID.$value ? countryID.$value : "";
        console.log("country id: " + this.countryID);
        res(true);
      });
    });
    return promise;
  }

  getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/agencyAdmin').takeUntil(this.ngUnsubscribe).subscribe((agencyIDs: any) => {
        this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
        this.departmentsPath = Constants.APP_STATUS + "/agency/" + this.agencyID + '/departments/';
        this._departmentList();
        res(true);
      });
    });
    return promise;
  }

  copyAction() {
    /* added route for create action page */
    this.storage.set('copyActionData', this.actionData);
    this.router.navigate(["/preparedness/create-edit-preparedness"]);
    this.closeModal();
  }

  archiveAction() {

    this.closeModal();
    this.actionData.isActive = false;
    this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID)
      .update({isActive: false})
      .then(() => {
        this._location.back();
      }).catch((error: any) => {
      console.log(error, 'You do not have access!')
    });
  }

  getActionData() {
    let promise = new Promise((res, rej) => {

      this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryID + '/' + this.actionID).takeUntil(this.ngUnsubscribe).subscribe((action: Action) => {
        this.actionData = action;
        this.actionData.requireDoc = action.requireDoc ? 1 : 2;
        this.level = action.level;
        this.dueDate = this._convertTimestampToDate(action.dueDate);
        res(true);
      });
    });
    return promise;
  }

  showActionConfirm(modalID: string) {
    this.modalID = modalID;
    jQuery("#" + this.modalID).modal("show");
  }

  deleteAction() {
    this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID).remove();
    this.closeModal();
    this._location.back();
    // this.router.navigate(['/preparedness/minimum']);
  }

  closeModal() {
    jQuery("#" + this.modalID).modal("hide");
  }

  backButtonAction() {
    /* TODO get last route and implemented this functionality */
    this._location.back();
  }

  _parseSelectParams() {
    this.allowedFrequencyValue = [];
    if (!jQuery.isEmptyObject(this.frequencyDefaultSettings)) {
      let multipliers: any = [[1, 1 / 4.4, 1 / 52.1], [4.4, 1, 1 / 12], [52.1, 12, 1]];
      multipliers[this.frequencyDefaultSettings.type].forEach((val, key) => {
        var result = Math.trunc(val * this.frequencyDefaultSettings.value);
        if (result) {
          this.allowedDurationList.push(this.durationTypeList[key]);
          this.allowedFrequencyValue.push(Math.min(100, result));
        }
      });
      var frequencyBaseKey = this.actionID ? this.actionData.frequencyBase : 0;
      this.frequency = new Array(this.allowedFrequencyValue[frequencyBaseKey]);
    } else {
      this.allowedDurationList = this.durationTypeList;
    }
  }

  createNewDepartment(newDepartment) {
    if (newDepartment.value != '') {
      let key = newDepartment.value;
      let saveDepartment = {[key]: false};
      this.af.database.object(this.departmentsPath).update(saveDepartment);
      this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS', AlertMessageType.Success);
    }
    this.closeModal();
  }

  _getPreparednessFrequency() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyID + '/' + this.countryID + '/clockSettings/preparedness').takeUntil(this.ngUnsubscribe).subscribe((frequencySetting: any) => {
        if (typeof (frequencySetting.durationType) != 'undefined' && typeof (frequencySetting.value) != 'undefined') {
          this.frequencyDefaultSettings.type = frequencySetting.durationType;
          this.frequencyDefaultSettings.value = frequencySetting.value;
        }
        res(true);
      });


    });
    return promise;
  }

  _convertDateToTimestamp(date: any) {
    return date.getTime();
  }

  _convertTimestampToDate(timestamp: number) {
    return new Date(timestamp);
  }

  _defaultHazardCategoryValue() {
    this.actionData.assignHazard = [];
    var countHazardCategory = this.hazardCategoryList.length;
    for (var i = 0; i < countHazardCategory; i++) {
      this.actionData.assignHazard.push(false);
    }
  }

  _isValidForm() {
    if (typeof (this.actionData.department) == 'undefined') {
      return false;
    }
    if (typeof (this.actionData.dueDate) == 'undefined') {
      return false;
    }
    return true;
  }

  _frequencyIsActive() {
    if (this.actionID || this.copyActionData) {
      if (this.frequencyDefaultSettings.type != this.actionData.frequencyBase && this.frequencyDefaultSettings.value != this.actionData.frequencyValue) {
        this.frequencyActive = true;
      }
    }
  }

  _getHazardImage(key) {
    return HazardImages.init().getCSS(key);
  }

  anySelected() {
    let temp = false;
    this.hazardSelectionMap.forEach((v, k) => {
      if (k != -1 && v == true) {
        this.disableAll = true;
        temp = true;
      }
    });
    if (!temp) {
      this.disableAll = false;
    }
  }

  test() {
    console.log(this.actionData.requireDoc);
  }
}
