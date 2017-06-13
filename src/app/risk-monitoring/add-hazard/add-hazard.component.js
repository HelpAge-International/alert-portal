"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Enums_1 = require("../../utils/Enums");
var Constants_1 = require("../../utils/Constants");
var hazard_model_1 = require("../../model/hazard.model");
var AddHazardRiskMonitoringComponent = (function () {
    function AddHazardRiskMonitoringComponent(af, subscriptions, router, storage) {
        this.af = af;
        this.subscriptions = subscriptions;
        this.router = router;
        this.storage = storage;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.alertMessage = null;
        this.alertMsgSeasonAddToCalendar = false;
        this.count = 1;
        this.customHazards = [];
        this.AllSeasons = [];
        this.checkedSeasons = [];
        this.otherHazard = false;
        this.saveSelectSeasonsBtn = true;
        this.selectHazard = false;
        this.season = false;
        this.isCustomDisabled = true;
        this.HazardScenario = Constants_1.Constants.HAZARD_SCENARIOS;
        this.scenarioColors = Constants_1.Constants.SCENARIO_COLORS;
        this.hazardScenariosListTop = [
            Enums_1.HazardScenario.HazardScenario4,
            Enums_1.HazardScenario.HazardScenario3,
            Enums_1.HazardScenario.HazardScenario24
        ];
        this.hazardScenariosList = [
            Enums_1.HazardScenario.HazardScenario0,
            Enums_1.HazardScenario.HazardScenario1,
            Enums_1.HazardScenario.HazardScenario2,
            Enums_1.HazardScenario.HazardScenario5,
            Enums_1.HazardScenario.HazardScenario6,
            Enums_1.HazardScenario.HazardScenario7,
            Enums_1.HazardScenario.HazardScenario8,
            Enums_1.HazardScenario.HazardScenario9,
            Enums_1.HazardScenario.HazardScenario10,
            Enums_1.HazardScenario.HazardScenario11,
            Enums_1.HazardScenario.HazardScenario12,
            Enums_1.HazardScenario.HazardScenario13,
            Enums_1.HazardScenario.HazardScenario14,
            Enums_1.HazardScenario.HazardScenario15,
            Enums_1.HazardScenario.HazardScenario16,
            Enums_1.HazardScenario.HazardScenario17,
            Enums_1.HazardScenario.HazardScenario18,
            Enums_1.HazardScenario.HazardScenario19,
            Enums_1.HazardScenario.HazardScenario20,
            Enums_1.HazardScenario.HazardScenario21,
            Enums_1.HazardScenario.HazardScenario22,
            Enums_1.HazardScenario.HazardScenario23,
            Enums_1.HazardScenario.HazardScenario25,
            Enums_1.HazardScenario.HazardScenario26,
        ];
        this.hazardData = {};
        this.hazardData.seasons = [];
        this.initHazardData();
    }
    AddHazardRiskMonitoringComponent.prototype.initHazardData = function () {
        this.hazardData = new hazard_model_1.ModelHazard();
    };
    AddHazardRiskMonitoringComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this._loadData();
            }
            else {
                _this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    };
    AddHazardRiskMonitoringComponent.prototype._getCountryID = function () {
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
    AddHazardRiskMonitoringComponent.prototype._loadData = function () {
        var _this = this;
        this._getCountryID().then(function () {
            _this._getCustomHazards();
        });
    };
    AddHazardRiskMonitoringComponent.prototype._getCustomHazards = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/otherHazardScenario/" + _this.countryID).subscribe(function (customHazards) {
                _this.customHazards = customHazards;
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    AddHazardRiskMonitoringComponent.prototype._getAllSeasons = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/season/" + _this.countryID).subscribe(function (AllSeasons) {
                _this.AllSeasons = AllSeasons;
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    AddHazardRiskMonitoringComponent.prototype._validateData = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.alertMessage = _this.hazardData.validate(_this.count);
            if (_this.alertMessage) {
                res(false);
            }
            if (!_this.alertMessage) {
                if (!_this.alertMessage) {
                }
                if (!_this.alertMessage) {
                    res(true);
                }
            }
        });
        return promise;
    };
    AddHazardRiskMonitoringComponent.prototype.submit = function () {
        var _this = this;
        this._validateData().then(function (isValid) {
            if (isValid) {
                _this.count = 2;
            }
        });
    };
    AddHazardRiskMonitoringComponent.prototype.cancel = function () {
        this.count = 1;
    };
    AddHazardRiskMonitoringComponent.prototype._checkHazard = function (hazard) {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/hazard/" + _this.countryID).subscribe(function (hazardFb) {
                for (var index = 0; index < hazardFb.length; index++) {
                    if (hazardFb[index].hazardScenario == hazard) {
                        _this.hazardData.isActive = false;
                        return promise;
                    }
                    else {
                        _this.hazardData.isActive = true;
                    }
                }
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    AddHazardRiskMonitoringComponent.prototype.stateIsCustom = function (isCustom, event, hazard) {
        this.hazardName = event.target.value;
        this.hazardData.hazardScenario = '';
        this._checkHazard(hazard);
        this.isCustomDisabled = isCustom;
        if (event.target.value != 'on') {
            this.hazardData.hazardScenario = hazard;
            this.otherHazard = false;
        }
        else {
        }
    };
    AddHazardRiskMonitoringComponent.prototype.setHazardValue = function (event) {
        this._checkHazard(event.target.value);
        this.hazardData.hazardScenario = event.target.value;
        this.otherHazard = false;
        if (this.hazardData.hazardScenario == 'Other') {
            this.otherHazard = true;
        }
    };
    AddHazardRiskMonitoringComponent.prototype.addHazardBtn = function () {
        var _this = this;
        this._validateData().then(function (isValid) {
            if (isValid) {
                _this.hazardData.timeCreated = _this._getCurrentTimestamp();
                _this.hazardData.hazardScenario = parseInt(_this.hazardData.hazardScenario);
                /* TODO RISK PARAM */
                _this.hazardData.risk = 10;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + "/hazard/" + _this.countryID)
                    .push(_this.hazardData)
                    .then(function () {
                    _this.storage.set('successAddHazard', _this.hazardData.hazardScenario);
                    _this.router.navigate(['/risk-monitoring/']);
                }).catch(function (error) {
                    console.log(error, 'You do not have access!');
                });
            }
        });
        if (this.addHazardSeason == 'true') {
            return false;
        }
        else {
            return true;
        }
    };
    AddHazardRiskMonitoringComponent.prototype._getCurrentTimestamp = function () {
        var currentTimeStamp = new Date().getTime();
        return currentTimeStamp;
    };
    AddHazardRiskMonitoringComponent.prototype.seasonHazard = function (event) {
        this.hazardData.seasons = [];
        this.addHazardSeason = event.target.value;
        if (this.addHazardSeason == 'true') {
            this.hazardData.isSeasonal = false;
            this.selectHazard = false;
            this.season = false;
        }
        else {
            this.hazardData.isSeasonal = true;
            this.selectHazard = true;
            this.season = false;
        }
    };
    AddHazardRiskMonitoringComponent.prototype.saveSelectSeasons = function (modalID) {
        this.checkedSeasons = [];
        for (var i in this.hazardData.seasons) {
            this.checkedSeasons.push(this.AllSeasons[i]);
        }
        this.modalID = modalID;
        this.addHazardSeason = 'true';
        this.selectHazard = false;
        this.season = true;
        if (this.checkedSeasons.length == 0) {
            this.season = false;
            this.selectHazard = true;
        }
        else {
            this.season = true;
        }
        this.closeModal();
    };
    AddHazardRiskMonitoringComponent.prototype.selectSeason = function (event, seasonKey) {
        if (event.target.checked) {
            this.hazardData.seasons[seasonKey] = true;
        }
        else {
            delete this.hazardData.seasons[seasonKey];
        }
        if (Object.keys(this.hazardData.seasons).length == 0) {
            this.saveSelectSeasonsBtn = true;
        }
        else {
            this.saveSelectSeasonsBtn = false;
        }
    };
    AddHazardRiskMonitoringComponent.prototype.detected = function (i) {
        for (var key in this.hazardData.seasons) {
            if (i == key) {
                return true;
            }
        }
    };
    AddHazardRiskMonitoringComponent.prototype.newCustomHazard = function (event) {
        if (event.target.value.length > 3) {
            this.hazardData.hazardScenario = event.target.value;
            this.hazardName = event.target.value;
        }
    };
    AddHazardRiskMonitoringComponent.prototype.showActionConfirm = function (modalID) {
        this._getAllSeasons();
        this.modalID = modalID;
        jQuery("#" + this.modalID).modal("show");
    };
    AddHazardRiskMonitoringComponent.prototype.msgSeasonToCalendar = function (form) {
        if (form.value.startTime > form.value.endTime && form.value.endTime != "" && form.value.startTime != "") {
            this.alertMsgSeasonAddToCalendar = true;
            this.classAlertInvalid = 'invalid';
            this.classAlertValid = '';
        }
        else {
            this.classAlertValid = 'valid';
            this.classAlertInvalid = '';
            this.alertMsgSeasonAddToCalendar = false;
        }
    };
    AddHazardRiskMonitoringComponent.prototype.createSeasonToCalendar = function (form) {
        this.saveSelectSeasonsBtn = true;
        var dataToSave = form.value;
        dataToSave.startTime = new Date(dataToSave.startTime).getTime();
        dataToSave.endTime = new Date(dataToSave.endTime).getTime();
        if (dataToSave.startTime > dataToSave.endTime) {
            this.alertMsgSeasonAddToCalendar = false;
        }
        else {
            this.alertMsgSeasonAddToCalendar = true;
            this.closeModal();
            this.af.database.list(Constants_1.Constants.APP_STATUS + "/season/" + this.countryID)
                .push(dataToSave)
                .then(function () {
                console.log('success save data');
            }).catch(function (error) {
                console.log(error, 'You do not have access!');
            });
        }
    };
    AddHazardRiskMonitoringComponent.prototype.closeModalAddCalendar = function (modal) {
        jQuery("#" + modal).modal("hide");
    };
    AddHazardRiskMonitoringComponent.prototype.closeModal = function () {
        jQuery("#" + this.modalID).modal("hide");
    };
    AddHazardRiskMonitoringComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return AddHazardRiskMonitoringComponent;
}());
AddHazardRiskMonitoringComponent = __decorate([
    core_1.Component({
        selector: 'app-add-hazard',
        templateUrl: './add-hazard.component.html',
        styleUrls: ['./add-hazard.component.css']
    })
], AddHazardRiskMonitoringComponent);
exports.AddHazardRiskMonitoringComponent = AddHazardRiskMonitoringComponent;
