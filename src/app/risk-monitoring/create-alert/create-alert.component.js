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
var operation_area_model_1 = require("../../model/operation-area.model");
var alert_model_1 = require("../../model/alert.model");
var alert_message_model_1 = require("../../model/alert-message.model");
var CreateAlertRiskMonitoringComponent = (function () {
    function CreateAlertRiskMonitoringComponent(subscriptions, af, router, _commonService, translate) {
        this.subscriptions = subscriptions;
        this.af = af;
        this.router = router;
        this._commonService = _commonService;
        this.translate = translate;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.alertMessage = null;
        this.alertLevels = Constants_1.Constants.ALERT_LEVELS;
        this.alertColors = Constants_1.Constants.ALERT_COLORS;
        this.alertButtonsClass = Constants_1.Constants.ALERT_BUTTON_CLASS;
        this.alertLevelsList = [Enums_1.AlertLevels.Amber, Enums_1.AlertLevels.Red];
        this.durationType = Constants_1.Constants.DURATION_TYPE;
        this.durationTypeList = [Enums_1.DurationType.Week, Enums_1.DurationType.Month, Enums_1.DurationType.Year];
        this.countries = Constants_1.Constants.COUNTRY;
        this.countriesList = [Enums_1.Country.UK, Enums_1.Country.France, Enums_1.Country.Germany];
        this.frequency = new Array(100);
        this.countryLevels = [];
        this.countryLevelsValues = [];
        this.hazardScenario = Constants_1.Constants.HAZARD_SCENARIOS;
        this.hazards = [];
        this.initAlertData();
    }
    CreateAlertRiskMonitoringComponent.prototype.initAlertData = function () {
        this.alertData = new alert_model_1.ModelAlert();
        this.addAnotherAreas();
    };
    CreateAlertRiskMonitoringComponent.prototype.addAnotherAreas = function () {
        this.alertData.affectedAreas.push(new operation_area_model_1.OperationAreaModel());
    };
    CreateAlertRiskMonitoringComponent.prototype.removeAnotherArea = function (key) {
        this.alertData.affectedAreas.splice(key, 1);
    };
    CreateAlertRiskMonitoringComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this._getCountryID().then(function () {
                    _this._getHazards();
                    _this._getDirectorCountryID();
                });
                // get the country levels values
                _this._commonService.getJsonContent(Constants_1.Constants.COUNTRY_LEVELS_VALUES_FILE)
                    .subscribe(function (content) {
                    _this.countryLevelsValues = content;
                    (function (err) { return console.log(err); });
                });
            }
            else {
                _this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    };
    CreateAlertRiskMonitoringComponent.prototype.saveAlert = function () {
        var _this = this;
        if (!this.directorCountryID) {
            this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_DIRECTOR_COUNTRY_ID');
            return false;
        }
        this._validateData().then(function (isValid) {
            if (isValid) {
                _this.alertData.createdBy = _this.uid;
                _this.alertData.timeCreated = _this._getCurrentTimestamp();
                _this.alertData.approval['countryDirector'] = [];
                _this.alertData.approval['countryDirector'][_this.directorCountryID] = 0;
                _this.alertData.estimatedPopulation = parseInt(_this.alertData.estimatedPopulation);
                var dataToSave = _this.alertData;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/alert/' + _this.countryID)
                    .push(dataToSave)
                    .then(function () {
                    _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.SUCCESS_MESSAGE_ADD_ALERT', Enums_1.AlertMessageType.Success);
                    _this.initAlertData();
                }).catch(function (error) {
                    console.log(error, 'You do not have access!');
                });
            }
        });
    };
    CreateAlertRiskMonitoringComponent.prototype._getCountryID = function () {
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
    CreateAlertRiskMonitoringComponent.prototype._validateOperationArea = function (operationArea) {
        var excludeFields = [];
        var countryLevel1Exists = operationArea.country
            && this.countryLevelsValues[operationArea.country].levelOneValues
            && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
        if (!countryLevel1Exists) {
            excludeFields.push("level1", "level2");
        }
        else if (countryLevel1Exists && operationArea.level1
            && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues
                || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level2].length < 1)) {
            excludeFields.push("level2");
        }
        this.alertMessage = operationArea.validate(excludeFields);
        return this.alertMessage;
    };
    CreateAlertRiskMonitoringComponent.prototype._validateData = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var excludedFields = [];
            if (typeof (_this.alertData.alertLevel) == 'undefined' || _this.alertData.alertLevel == 1) {
                excludedFields.push('reasonForRedAlert');
            }
            _this.alertMessage = _this.alertData.validate(excludedFields);
            if (_this.alertMessage) {
                res(false);
            }
            if (!_this.alertMessage) {
                if (!_this.alertMessage) {
                    _this.alertData.affectedAreas.forEach(function (val, key) {
                        _this._validateOperationArea(val);
                        if (_this.alertMessage) {
                            res(false);
                        }
                    });
                }
                if (!_this.alertMessage) {
                    res(true);
                }
            }
        });
        return promise;
    };
    CreateAlertRiskMonitoringComponent.prototype._getHazards = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/hazard/" + _this.countryID).subscribe(function (hazards) {
                _this.hazards = [];
                for (var hazard in hazards) {
                    hazards[hazard].imgName = _this.translate.instant(_this.hazardScenario[hazards[hazard].hazardScenario]).replace(" ", "_");
                    _this.hazards.push(hazards[hazard]);
                }
            });
            _this.subscriptions.add(subscription);
        });
    };
    CreateAlertRiskMonitoringComponent.prototype._getDirectorCountryID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/directorCountry/" + _this.countryID).subscribe(function (directorCountryID) {
                _this.directorCountryID = directorCountryID.$value ? directorCountryID.$value : false;
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CreateAlertRiskMonitoringComponent.prototype._getCurrentTimestamp = function () {
        var currentTimeStamp = new Date().getTime();
        return currentTimeStamp;
    };
    CreateAlertRiskMonitoringComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    CreateAlertRiskMonitoringComponent.prototype.checkTypeof = function (param) {
        if (typeof (param) == 'undefined') {
            return false;
        }
        else {
            return true;
        }
    };
    CreateAlertRiskMonitoringComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\.\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar) && event.charCode) {
            // invalid character, prevent input
            event.preventDefault();
            this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.ERROR_ONLY_NUMBERS', Enums_1.AlertMessageType.Error);
        }
    };
    return CreateAlertRiskMonitoringComponent;
}());
CreateAlertRiskMonitoringComponent = __decorate([
    core_1.Component({
        selector: 'app-create-alert',
        templateUrl: './create-alert.component.html',
        styleUrls: ['./create-alert.component.css']
    })
], CreateAlertRiskMonitoringComponent);
exports.CreateAlertRiskMonitoringComponent = CreateAlertRiskMonitoringComponent;
