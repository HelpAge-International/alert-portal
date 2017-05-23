import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Department, ActionType, ActionLevel, HazardCategory, DurationType} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {LocalStorageService} from 'angular-2-local-storage';
declare var jQuery: any;
@Component({
    selector: 'app-preparedness',
    templateUrl: './create-edit.component.html',
    styleUrls: ['./create-edit.component.css']
})
export class CreateEditPreparednessComponent implements OnInit {

    submitted = false;

    private uid: string;

    private actionID: string;
    private modalID: string;

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
    private departmentList: number[] = [Department.CHS, Department.Finance, Department.HR, Department.Logistics, Department.Programme];

    private actionLevel = Constants.ACTION_LEVEL;
    private actionLevelList: number[] = [ActionLevel.MPA, ActionLevel.APA];

    private hazardCategory = Constants.HAZARD_CATEGORY;
    private hazardCategoryList: number[] = [HazardCategory.Earthquake, HazardCategory.Tsunami, HazardCategory.Drought];
    private hazardCategoryIconClass = Constants.HAZARD_CATEGORY_ICON_CLASS;

    private durationType = Constants.DURATION_TYPE;
    private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];
    private allowedDurationList: number[] = [];

    constructor(private af: AngularFire, private subscriptions: RxHelper, private router: Router, private route: ActivatedRoute, private storage: LocalStorageService) {
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

        let subscription = this.route.params.subscribe((params: Params) => {
            if (params['id']) {
                /* TODO remove hardcode actionID */
                //this.actionID = params['id'];
                this.actionID = '-KjwQyhlExYqstjk75GD';
            }
        });
        this.subscriptions.add(subscription);

    }

    ngOnInit() {
        let subscription = this.af.auth.subscribe(auth => {
            if (auth) {
                this.uid = auth.uid;
                this._defaultHazardCategoryValue();
                this.processPage();
            } else {
                this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
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

        var dataToSave = this.actionData;

        if (!this.actionID) {
            this.af.database.list(Constants.APP_STATUS + '/action/' + this.countryID)
                .push(dataToSave)
                .then(() => {
                    console.log('success save data');
                }).catch((error: any) => {
                    console.log(error, 'You do not have access!')
                });
        } else {
            this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID)
                .set(dataToSave)
                .then(() => {
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
                });
            });
        });
    }

    selectHazardCategory(hazardKey: number, event: any) {
        var val = event.target.checked ? event.target.checked : false;
        this.actionData.assignHazard[hazardKey] = val;
    }

    selectAllHazard(event: any) {
        var value = event.target.checked ? event.target.checked : false;
        this.actionData.assignHazard.forEach((val, key) => {
            this.actionData.assignHazard[key] = value;
        });
    }

    selectDepartment(event: any) {
        this.actionData.department = parseInt(event.target.value);
        return true;
    }

    selectActionLevel(levelKey: number) {
        this.actionData.level = levelKey;
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
        let subscription = this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID).subscribe((data: any) => {
            for (let userID in data) {
                this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).subscribe((user: ModelUserPublic) => {
                    var userToPush = {userID: userID, firstName: user.firstName};
                    this.usersForAssign.push(userToPush);
                });
            }
        });
        this.subscriptions.add(subscription);
    }

    frequencyIsActive(event: any) {
        this.frequencyActive = event.target.checked;
        return true;
    }

    getCountryID() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId').subscribe((countryID: any) => {
                this.countryID = countryID.$value ? countryID.$value : "";
                res(true);
            });
            this.subscriptions.add(subscription);
        });
        return promise;
    }

    getAgencyID() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/agencyAdmin').subscribe((agencyIDs: any) => {
                this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
                res(true);
            });
            this.subscriptions.add(subscription);
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
        console.log('archive');
        this.closeModal();
        this.actionData.isActive = false;

        this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID)
            .set(this.actionData)
            .then(() => {
                console.log('success update archive');
            }).catch((error: any) => {
                console.log(error, 'You do not have access!')
            });

    }

    getActionData() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryID + '/' + this.actionID).subscribe((action: Action) => {
                this.actionData = action;
                this.level = action.level;
                this.dueDate = this._convertTimestampToDate(action.dueDate);
                res(true);
            });
            this.subscriptions.add(subscription);
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
        this.router.navigate(['/preparedness/minimum']);
    }

    closeModal() {
        jQuery("#" + this.modalID).modal("hide");
    }

    backButtonAction() {
        /* TODO get last route and implemented this functionality */
      this.router.navigate(['/preparedness/minimum']);
      console.log('back button');
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

    _getPreparednessFrequency() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyID + '/' + this.countryID + '/clockSettings/preparedness').subscribe((frequencySetting: any) => {
                if (typeof (frequencySetting.durationType) != 'undefined' && typeof (frequencySetting.value) != 'undefined') {
                    this.frequencyDefaultSettings.type = frequencySetting.durationType;
                    this.frequencyDefaultSettings.value = frequencySetting.value;
                }
                res(true);
            });

            this.subscriptions.add(subscription);

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

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }
}
