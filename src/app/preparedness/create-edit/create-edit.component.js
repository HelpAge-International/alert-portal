"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var action_1 = require("../../model/action");
var CreateEditPreparednessComponent = (function () {
    function CreateEditPreparednessComponent(af, subscriptions, router, route, storage) {
        var _this = this;
        this.af = af;
        this.subscriptions = subscriptions;
        this.router = router;
        this.route = route;
        this.storage = storage;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.alertMessage = null;
        this.actionSelected = {};
        this.copyActionData = {};
        this.frequencyDefaultSettings = {};
        this.allowedFrequencyValue = [];
        this.frequencyActive = false;
        this.usersForAssign = [];
        this.frequency = new Array(100);
        this.department = Constants_1.Constants.DEPARTMENT;
        this.departmentList = [Enums_1.Department.CHS, Enums_1.Department.Finance, Enums_1.Department.HR, Enums_1.Department.Logistics, Enums_1.Department.Programme];
        this.actionLevel = Constants_1.Constants.ACTION_LEVEL;
        this.actionLevelList = [Enums_1.ActionLevel.MPA, Enums_1.ActionLevel.APA];
        this.hazardCategory = Constants_1.Constants.HAZARD_CATEGORY;
        this.hazardCategoryList = [Enums_1.HazardCategory.Earthquake, Enums_1.HazardCategory.Tsunami, Enums_1.HazardCategory.Drought];
        this.hazardCategoryIconClass = Constants_1.Constants.HAZARD_CATEGORY_ICON_CLASS;
        this.durationType = Constants_1.Constants.DURATION_TYPE;
        this.durationTypeList = [Enums_1.DurationType.Week, Enums_1.DurationType.Month, Enums_1.DurationType.Year];
        this.allowedDurationList = [];
        this.actionData = new action_1.Action();
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
        var subscription = this.route.params.subscribe(function (params) {
            if (params['id']) {
                /* TODO remove hardcode actionID */
                _this.actionID = params['id'];
                //                this.actionID = '-KjwQyhlExYqstjk75GD';
            }
        });
        this.subscriptions.add(subscription);
    }
    CreateEditPreparednessComponent.prototype.processSave = function () {
        console.log(this.actionData);
    };
    CreateEditPreparednessComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this._defaultHazardCategoryValue();
                _this.processPage();
            }
            else {
                _this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    };
    CreateEditPreparednessComponent.prototype.setDefaultActionDataValue = function () {
        this.actionData.type = 2;
        this.actionData.isComplete = false;
        this.actionData.isActive = true;
        this.actionData.actionStatus = 1;
        if (typeof (this.actionData.frequencyBase) == 'undefined' && typeof (this.actionData.frequencyValue) == 'undefined') {
            this.actionData.frequencyBase = 0;
            this.actionData.frequencyValue = 1;
        }
    };
    CreateEditPreparednessComponent.prototype.saveAction = function (isValid) {
        var _this = this;
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
        var dataToSave = Object.assign({}, this.actionData);
        dataToSave.requireDoc = (dataToSave.requireDoc == 1) ? true : false;
        if (!this.actionID) {
            this.af.database.list(Constants_1.Constants.APP_STATUS + '/action/' + this.countryID)
                .push(dataToSave)
                .then(function () {
                _this.backButtonAction();
                console.log('success save data');
            }).catch(function (error) {
                console.log(error, 'You do not have access!');
            });
        }
        else {
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID)
                .set(dataToSave)
                .then(function () {
                _this.backButtonAction();
                console.log('success update');
            }).catch(function (error) {
                console.log(error, 'You do not have access!');
            });
        }
    };
    CreateEditPreparednessComponent.prototype.processPage = function () {
        var _this = this;
        this.getCountryID().then(function () {
            _this.getUsersForAssign();
            _this.getAgencyID().then(function () {
                _this._getPreparednessFrequency().then(function () {
                    if (_this.actionID) {
                        _this.getActionData().then(function () {
                            console.log('test');
                        });
                    }
                    console.log('1111111111111111111111');
                    _this._parseSelectParams();
                    console.log('2222222222222222222');
                    _this._frequencyIsActive();
                });
            });
        });
    };
    CreateEditPreparednessComponent.prototype.selectHazardCategory = function (hazardKey, event) {
        var val = event.target.checked ? event.target.checked : false;
        this.actionData.assignHazard[hazardKey] = val;
    };
    CreateEditPreparednessComponent.prototype.selectAllHazard = function (event) {
        var _this = this;
        var value = event.target.checked ? event.target.checked : false;
        this.actionData.assignHazard.forEach(function (val, key) {
            _this.actionData.assignHazard[key] = value;
        });
    };
    CreateEditPreparednessComponent.prototype.selectDepartment = function (event) {
        this.actionData.department = parseInt(event.target.value);
        return true;
    };
    CreateEditPreparednessComponent.prototype.selectActionLevel = function (levelKey) {
        this.actionData.level = levelKey;
        return true;
    };
    CreateEditPreparednessComponent.prototype.selectDate = function (date) {
        var dueDateTimestamp = this._convertDateToTimestamp(date);
        this.actionData.dueDate = dueDateTimestamp;
        return true;
    };
    CreateEditPreparednessComponent.prototype.selectFrequencyBase = function (event) {
        var frequencyBase = event.target.value;
        this.actionData.frequencyBase = parseInt(frequencyBase);
        if (!jQuery.isEmptyObject(this.frequencyDefaultSettings)) {
            this.frequency = new Array(this.allowedFrequencyValue[frequencyBase]);
        }
        return true;
    };
    CreateEditPreparednessComponent.prototype.selectFrequency = function (event) {
        this.actionData.frequencyValue = parseInt(event.target.value);
        return;
    };
    CreateEditPreparednessComponent.prototype.selectAssignUser = function (event) {
        var selectedUser = event.target.value ? event.target.value : "";
        if (!selectedUser) {
            delete this.actionData.asignee;
            return true;
        }
        this.actionData.asignee = event.target.value;
        return true;
    };
    CreateEditPreparednessComponent.prototype.checkTypeOf = function (departmentKey) {
        if (typeof (departmentKey) == 'undefined') {
            return false;
        }
        else {
            return true;
        }
    };
    CreateEditPreparednessComponent.prototype.getUsersForAssign = function () {
        var _this = this;
        /* TODO if user ERT OR Partner, assign only me */
        var subscription = this.af.database.object(Constants_1.Constants.APP_STATUS + "/staff/" + this.countryID).subscribe(function (data) {
            var _loop_1 = function (userID) {
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + userID).subscribe(function (user) {
                    var userToPush = { userID: userID, firstName: user.firstName };
                    _this.usersForAssign.push(userToPush);
                });
            };
            for (var userID in data) {
                _loop_1(userID);
            }
        });
        this.subscriptions.add(subscription);
    };
    CreateEditPreparednessComponent.prototype.frequencyIsActive = function (event) {
        this.frequencyActive = event.target.checked;
        return true;
    };
    CreateEditPreparednessComponent.prototype.getCountryID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + _this.uid + '/countryId').subscribe(function (countryID) {
                _this.countryID = countryID.$value ? countryID.$value : "";
                console.log('1111111111111111111111');
                console.log(_this.uid);
                console.log(_this.countryID);
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CreateEditPreparednessComponent.prototype.getAgencyID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + _this.uid + '/agencyAdmin').subscribe(function (agencyIDs) {
                _this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CreateEditPreparednessComponent.prototype.copyAction = function () {
        /* added route for create action page */
        this.storage.set('copyActionData', this.actionData);
        this.router.navigate(["/preparedness/create-edit-preparedness"]);
        this.closeModal();
    };
    CreateEditPreparednessComponent.prototype.archiveAction = function () {
        this.closeModal();
        this.actionData.isActive = false;
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID)
            .set(this.actionData)
            .then(function () {
            console.log('success update archive');
        }).catch(function (error) {
            console.log(error, 'You do not have access!');
        });
    };
    CreateEditPreparednessComponent.prototype.getActionData = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/action/" + _this.countryID + '/' + _this.actionID).subscribe(function (action) {
                _this.actionData = action;
                _this.actionData.requireDoc = action.requireDoc ? 1 : 2;
                _this.level = action.level;
                _this.dueDate = _this._convertTimestampToDate(action.dueDate);
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CreateEditPreparednessComponent.prototype.showActionConfirm = function (modalID) {
        this.modalID = modalID;
        jQuery("#" + this.modalID).modal("show");
    };
    CreateEditPreparednessComponent.prototype.deleteAction = function () {
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + this.countryID + '/' + this.actionID).remove();
        this.closeModal();
        this.router.navigate(['/preparedness/minimum']);
    };
    CreateEditPreparednessComponent.prototype.closeModal = function () {
        jQuery("#" + this.modalID).modal("hide");
    };
    CreateEditPreparednessComponent.prototype.backButtonAction = function () {
        /* TODO get last route and implemented this functionality */
        this.router.navigate(['/preparedness/minimum']);
        console.log('back button');
    };
    CreateEditPreparednessComponent.prototype._parseSelectParams = function () {
        var _this = this;
        this.allowedFrequencyValue = [];
        if (!jQuery.isEmptyObject(this.frequencyDefaultSettings)) {
            var multipliers = [[1, 1 / 4.4, 1 / 52.1], [4.4, 1, 1 / 12], [52.1, 12, 1]];
            multipliers[this.frequencyDefaultSettings.type].forEach(function (val, key) {
                var result = Math.trunc(val * _this.frequencyDefaultSettings.value);
                if (result) {
                    _this.allowedDurationList.push(_this.durationTypeList[key]);
                    _this.allowedFrequencyValue.push(Math.min(100, result));
                }
            });
            var frequencyBaseKey = this.actionID ? this.actionData.frequencyBase : 0;
            this.frequency = new Array(this.allowedFrequencyValue[frequencyBaseKey]);
        }
        else {
            this.allowedDurationList = this.durationTypeList;
        }
    };
    CreateEditPreparednessComponent.prototype._getPreparednessFrequency = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.agencyID + '/' + _this.countryID + '/clockSettings/preparedness').subscribe(function (frequencySetting) {
                if (typeof (frequencySetting.durationType) != 'undefined' && typeof (frequencySetting.value) != 'undefined') {
                    _this.frequencyDefaultSettings.type = frequencySetting.durationType;
                    _this.frequencyDefaultSettings.value = frequencySetting.value;
                }
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CreateEditPreparednessComponent.prototype._convertDateToTimestamp = function (date) {
        return date.getTime();
    };
    CreateEditPreparednessComponent.prototype._convertTimestampToDate = function (timestamp) {
        return new Date(timestamp);
    };
    CreateEditPreparednessComponent.prototype._defaultHazardCategoryValue = function () {
        this.actionData.assignHazard = [];
        var countHazardCategory = this.hazardCategoryList.length;
        for (var i = 0; i < countHazardCategory; i++) {
            this.actionData.assignHazard.push(false);
        }
    };
    CreateEditPreparednessComponent.prototype._isValidForm = function () {
        if (typeof (this.actionData.department) == 'undefined') {
            return false;
        }
        if (typeof (this.actionData.dueDate) == 'undefined') {
            return false;
        }
        return true;
    };
    CreateEditPreparednessComponent.prototype._frequencyIsActive = function () {
        if (this.actionID || this.copyActionData) {
            if (this.frequencyDefaultSettings.type != this.actionData.frequencyBase && this.frequencyDefaultSettings.value != this.actionData.frequencyValue) {
                this.frequencyActive = true;
            }
        }
    };
    CreateEditPreparednessComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return CreateEditPreparednessComponent;
}());
CreateEditPreparednessComponent = __decorate([
    core_1.Component({
        selector: 'app-preparedness',
        templateUrl: './create-edit.component.html',
        styleUrls: ['./create-edit.component.css']
    })
], CreateEditPreparednessComponent);
exports.CreateEditPreparednessComponent = CreateEditPreparednessComponent;
