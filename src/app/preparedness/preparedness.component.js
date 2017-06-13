"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../utils/Constants");
var Enums_1 = require("../utils/Enums");
var action_1 = require("../model/action");
var PreparednessComponent = (function () {
    function PreparednessComponent(af, subscriptions, router) {
        this.af = af;
        this.subscriptions = subscriptions;
        this.router = router;
        this.submitted = false;
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
        this.actionData.type = 2;
        this.actionData.frequencyBase = 0;
        this.actionData.frequencyValue = 1;
        this.actionID = '-KjISAZw6zOsD0pGtFwp';
    }
    PreparednessComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                console.log(_this.uid);
                _this._defaultHazardCategoryValue();
                _this.getUsersForAssign();
                _this.processPage();
            }
            else {
                _this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    };
    PreparednessComponent.prototype.ngOnDestroy = function () {
        try {
            this.subscriptions.releaseAll();
        }
        catch (e) {
            console.log(e.message);
        }
    };
    PreparednessComponent.prototype.saveAction = function (isValid) {
        if (!isValid || !this._isValidForm()) {
            return false;
        }
        if (!this.actionID) {
            if (typeof (this.actionData.frequencyBase) == 'undefined' && typeof (this.actionData.frequencyValue) == 'undefined') {
                this.actionData.frequencyBase = this.frequencyDefaultSettings.type;
                this.actionData.frequencyValue = this.frequencyDefaultSettings.value;
            }
        }
        if (!this.actionData.level) {
            this._defaultHazardCategoryValue();
        }
        if (!this.frequencyActive) {
            this.actionData.frequencyBase = this.frequencyDefaultSettings.type;
            this.actionData.frequencyValue = this.frequencyDefaultSettings.value;
        }
        var dataToSave = Object.assign({}, this.actionData);
        if (dataToSave && dataToSave.requireDoc) {
            dataToSave.requireDoc = (dataToSave.requireDoc == 1) ? true : false;
        }
        if (!this.actionID) {
            this.af.database.list(Constants_1.Constants.APP_STATUS + '/action/' + this.uid)
                .push(dataToSave)
                .then(function () {
                console.log('success save data');
            }).catch(function (error) {
                console.log(error, 'You do not have access!');
            });
        }
        else {
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + this.uid + '/' + this.actionID)
                .set(dataToSave)
                .then(function () {
                console.log('success update');
            }).catch(function (error) {
                console.log(error, 'You do not have access!');
            });
        }
    };
    PreparednessComponent.prototype.processPage = function () {
        var _this = this;
        this.getCountryID().then(function () {
            _this.getAgencyID().then(function () {
                _this._getPreparednessFrequency().then(function () {
                    if (_this.actionID) {
                        _this.getActionData().then(function () {
                            _this._parseSelectParams();
                            if (_this.frequencyDefaultSettings.type != _this.actionData.frequencyBase && _this.frequencyDefaultSettings.value != _this.actionData.frequencyValue) {
                                _this.frequencyActive = true;
                            }
                        });
                    }
                    else {
                        _this._parseSelectParams();
                    }
                });
            });
        });
    };
    PreparednessComponent.prototype.selectHazardCategory = function (hazardKey, event) {
        var val = event.target.checked ? event.target.checked : false;
        this.actionData.assignHazard[hazardKey] = val;
    };
    PreparednessComponent.prototype.selectAllHazard = function (event) {
        var _this = this;
        var value = event.target.checked ? event.target.checked : false;
        this.actionData.assignHazard.forEach(function (val, key) {
            _this.actionData.assignHazard[key] = value;
        });
    };
    PreparednessComponent.prototype.selectDepartment = function (event) {
        this.actionData.department = parseInt(event.target.value);
        return true;
    };
    PreparednessComponent.prototype.selectActionLevel = function (levelKey) {
        this.actionData.level = levelKey - 1;
        return true;
    };
    PreparednessComponent.prototype.selectDate = function (date) {
        var dueDateTimestamp = this._convertDateToTimestamp(date);
        this.actionData.dueDate = dueDateTimestamp;
        return true;
    };
    PreparednessComponent.prototype.selectFrequencyBase = function (event) {
        var frequencyBase = event.target.value;
        this.actionData.frequencyBase = parseInt(frequencyBase);
        if (!jQuery.isEmptyObject(this.frequencyDefaultSettings)) {
            this.frequency = new Array(this.allowedFrequencyValue[frequencyBase]);
        }
        return true;
    };
    PreparednessComponent.prototype.selectFrequency = function (event) {
        this.actionData.frequencyValue = parseInt(event.target.value);
        return;
    };
    PreparednessComponent.prototype.selectAssignUser = function (event) {
        var selectedUser = event.target.value ? event.target.value : "";
        if (!selectedUser) {
            delete this.actionData.asignee;
            return true;
        }
        this.actionData.asignee = event.target.value;
        return true;
    };
    PreparednessComponent.prototype.checkTypeOf = function (departmentKey) {
        if (typeof (departmentKey) == 'undefined') {
            return false;
        }
        else {
            return true;
        }
    };
    PreparednessComponent.prototype.getUsersForAssign = function () {
        var _this = this;
        var uid = 'wRptKhnORhTud5B0jjEA7P2uMb03';
        var subscription = this.af.database.object(Constants_1.Constants.APP_STATUS + "/staff/" + uid).subscribe(function (data) {
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
    PreparednessComponent.prototype.frequencyIsActive = function (event) {
        this.frequencyActive = event.target.checked;
        return true;
    };
    PreparednessComponent.prototype.getCountryID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + _this.uid + '/countryId').subscribe(function (countryID) {
                _this.countryID = countryID.$value ? countryID.$value : "";
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    PreparednessComponent.prototype.getAgencyID = function () {
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
    PreparednessComponent.prototype.copyAction = function () {
        /* added route for create action page */
        console.log(this.actionData);
        this.closeModal();
    };
    PreparednessComponent.prototype.archiveAction = function () {
        console.log('archive');
        this.closeModal();
        this.actionData.isActive = false;
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + this.uid + '/' + this.actionID)
            .set(this.actionData)
            .then(function () {
            console.log('success update archive');
        }).catch(function (error) {
            console.log(error, 'You do not have access!');
        });
    };
    PreparednessComponent.prototype._getPreparednessFrequency = function () {
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
    PreparednessComponent.prototype.getActionData = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/action/" + _this.uid + '/' + _this.actionID).subscribe(function (action) {
                _this.actionData = action;
                _this.level = action.level + 1;
                _this.dueDate = _this._convertTimestampToDate(action.dueDate);
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    PreparednessComponent.prototype.showActionConfirm = function (modalID) {
        this.modalID = modalID;
        jQuery("#" + this.modalID).modal("show");
    };
    PreparednessComponent.prototype.deleteAction = function () {
        console.log(this.actionID);
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + this.uid + '/' + this.actionID).remove();
        this.closeModal();
    };
    PreparednessComponent.prototype.closeModal = function () {
        jQuery("#" + this.modalID).modal("hide");
    };
    PreparednessComponent.prototype._parseSelectParams = function () {
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
    PreparednessComponent.prototype._convertDateToTimestamp = function (date) {
        return date.getTime();
    };
    PreparednessComponent.prototype._convertTimestampToDate = function (timestamp) {
        return new Date(timestamp);
    };
    PreparednessComponent.prototype._defaultHazardCategoryValue = function () {
        this.actionData.assignHazard = [];
        var countHazardCategory = this.hazardCategoryList.length;
        for (var i = 0; i < countHazardCategory; i++) {
            this.actionData.assignHazard.push(false);
        }
    };
    PreparednessComponent.prototype._isValidForm = function () {
        if (typeof (this.actionData.department) == 'undefined') {
            return false;
        }
        if (typeof (this.actionData.dueDate) == 'undefined') {
            return false;
        }
        return true;
    };
    PreparednessComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return PreparednessComponent;
}());
PreparednessComponent = __decorate([
    core_1.Component({
        selector: 'app-preparedness',
        templateUrl: './preparedness.component.html',
        styleUrls: ['./preparedness.component.css']
    })
], PreparednessComponent);
exports.PreparednessComponent = PreparednessComponent;
