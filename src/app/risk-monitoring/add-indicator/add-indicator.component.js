"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var indicator_1 = require("../../model/indicator");
var Enums_1 = require("../../utils/Enums");
var Constants_1 = require("../../utils/Constants");
var common_service_1 = require("../../services/common.service");
var operation_area_model_1 = require("../../model/operation-area.model");
var indicator_source_model_1 = require("../../model/indicator-source.model");
var indicator_trigger_model_1 = require("../../model/indicator-trigger.model");
var alert_message_model_1 = require("../../model/alert-message.model");
var AddIndicatorRiskMonitoringComponent = (function () {
    function AddIndicatorRiskMonitoringComponent(subscriptions, af, router, _commonService, route, storage) {
        this.subscriptions = subscriptions;
        this.af = af;
        this.router = router;
        this._commonService = _commonService;
        this.route = route;
        this.storage = storage;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.alertMessage = null;
        this.alertLevels = Constants_1.Constants.ALERT_LEVELS;
        this.alertColors = Constants_1.Constants.ALERT_COLORS;
        this.alertImages = Constants_1.Constants.ALERT_IMAGES;
        this.alertLevelsList = [Enums_1.AlertLevels.Green, Enums_1.AlertLevels.Amber, Enums_1.AlertLevels.Red];
        this.durationType = Constants_1.Constants.DURATION_TYPE;
        this.durationTypeList = [Enums_1.DurationType.Week, Enums_1.DurationType.Month, Enums_1.DurationType.Year];
        this.geoLocation = Constants_1.Constants.GEO_LOCATION;
        this.geoLocationList = [Enums_1.GeoLocation.national, Enums_1.GeoLocation.subnational];
        this.countries = Constants_1.Constants.COUNTRY;
        this.countriesList = [Enums_1.Country.UK, Enums_1.Country.France, Enums_1.Country.Germany];
        this.frequency = new Array(100);
        this.countryLevels = [];
        this.countryLevelsValues = [];
        this.hazardScenario = Constants_1.Constants.HAZARD_SCENARIOS;
        this.hazardScenariosList = [
            Enums_1.HazardScenario.HazardScenario0,
            Enums_1.HazardScenario.HazardScenario1,
            Enums_1.HazardScenario.HazardScenario2,
            Enums_1.HazardScenario.HazardScenario3,
            Enums_1.HazardScenario.HazardScenario4,
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
            Enums_1.HazardScenario.HazardScenario24,
            Enums_1.HazardScenario.HazardScenario25,
            Enums_1.HazardScenario.HazardScenario26,
        ];
        this.usersForAssign = [];
        this.isEdit = false;
        this.hazards = [];
        this.hazardsObject = {};
        this.initIndicatorData();
    }
    AddIndicatorRiskMonitoringComponent.prototype.initIndicatorData = function () {
        var _this = this;
        var subscription = this.route.params.subscribe(function (params) {
            _this.indicatorData = new indicator_1.Indicator();
            if (!params['hazardID']) {
                console.log('hazardID cannot be empty');
                _this.router.navigate(["/risk-monitoring"]);
                return false;
            }
            _this.hazardID = params['hazardID'];
            if (params['indicatorID']) {
                _this.isEdit = true;
                _this.hazardID = params['hazardID'];
                _this.indicatorID = params['indicatorID'];
                _this.af.auth.subscribe(function (auth) {
                    if (auth) {
                        _this.uid = auth.uid;
                        _this.getCountryID().then(function () {
                            _this._getIndicator(_this.hazardID, _this.indicatorID);
                        });
                    }
                    else {
                        _this.navigateToLogin();
                    }
                });
            }
            else {
                _this.addAnotherSource();
                _this.addAnotherLocation();
                _this.addIndicatorTrigger();
            }
        });
        this.subscriptions.add(subscription);
    };
    AddIndicatorRiskMonitoringComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.getCountryID().then(function () {
                    _this._getHazards();
                    _this.getUsersForAssign();
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
    AddIndicatorRiskMonitoringComponent.prototype.stateGeoLocation = function (event) {
        var geoLocation = parseInt(event.target.value);
        this.indicatorData.geoLocation = geoLocation;
    };
    AddIndicatorRiskMonitoringComponent.prototype.addAnotherSource = function () {
        this.indicatorData.source.push(new indicator_source_model_1.IndicatorSourceModel());
    };
    AddIndicatorRiskMonitoringComponent.prototype.removeAnotherSource = function (key) {
        this.indicatorData.source.splice(key, 1);
    };
    AddIndicatorRiskMonitoringComponent.prototype.addAnotherLocation = function () {
        this.indicatorData.affectedLocation.push(new operation_area_model_1.OperationAreaModel());
    };
    AddIndicatorRiskMonitoringComponent.prototype.removeAnotherLocation = function (key) {
        this.indicatorData.affectedLocation.splice(key, 1);
    };
    AddIndicatorRiskMonitoringComponent.prototype.addIndicatorTrigger = function () {
        for (var alertLevelKey in this.alertLevelsList) {
            this.indicatorData.trigger.push(new indicator_trigger_model_1.IndicatorTriggerModel());
        }
    };
    AddIndicatorRiskMonitoringComponent.prototype.getUsersForAssign = function () {
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
    AddIndicatorRiskMonitoringComponent.prototype.getCountryID = function () {
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
    AddIndicatorRiskMonitoringComponent.prototype.saveIndicator = function () {
        var _this = this;
        if (typeof (this.indicatorData.hazardScenario) == 'undefined') {
            this.indicatorData.hazardScenario = this.hazardsObject[this.hazardID];
        }
        this._validateData().then(function (isValid) {
            if (isValid) {
                _this.indicatorData.triggerSelected = 0;
                _this.indicatorData.category = parseInt(_this.indicatorData.category);
                _this.indicatorData.dueDate = _this._calculationDueDate(_this.indicatorData.trigger[_this.indicatorData.triggerSelected].durationType, _this.indicatorData.trigger[_this.indicatorData.triggerSelected].frequencyValue);
                var dataToSave = _this.indicatorData;
                var urlToPush;
                var urlToEdit;
                if (_this.hazardID == 'countryContext') {
                    urlToPush = Constants_1.Constants.APP_STATUS + '/indicator/' + _this.countryID;
                    ;
                    urlToEdit = Constants_1.Constants.APP_STATUS + '/indicator/' + _this.countryID + '/' + _this.indicatorID;
                    ;
                }
                else {
                    urlToPush = Constants_1.Constants.APP_STATUS + '/indicator/' + _this.hazardID;
                    urlToEdit = Constants_1.Constants.APP_STATUS + '/indicator/' + _this.hazardID + '/' + _this.indicatorID;
                }
                if (!_this.isEdit) {
                    _this.af.database.list(urlToPush)
                        .push(dataToSave)
                        .then(function () {
                        _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.SUCCESS_MESSAGE_ADD_INDICATOR', Enums_1.AlertMessageType.Success);
                        _this.indicatorData = new indicator_1.Indicator();
                        _this.addAnotherSource();
                        _this.addAnotherLocation();
                        _this.addIndicatorTrigger();
                    }).catch(function (error) {
                        console.log(error, 'You do not have access!');
                    });
                }
                else {
                    delete dataToSave.id;
                    _this.af.database.object(urlToEdit)
                        .set(dataToSave)
                        .then(function () {
                        _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.SUCCESS_MESSAGE_UPDATE_INDICATOR', Enums_1.AlertMessageType.Success);
                        return true;
                    }).catch(function (error) {
                        console.log(error, 'You do not have access!');
                    });
                }
            }
        });
    };
    AddIndicatorRiskMonitoringComponent.prototype.setNewHazardID = function (event) {
        var hazardID = event.target.value ? event.target.value : false;
        if (!hazardID) {
            console.log('hazardID cannot be empty');
            return false;
        }
        this.hazardID = hazardID;
        this.indicatorData.hazardScenario = this.hazardsObject[hazardID].hazardScenario;
    };
    AddIndicatorRiskMonitoringComponent.prototype._getHazards = function () {
        var _this = this;
        var subscription = this.af.database.object(Constants_1.Constants.APP_STATUS + "/hazard/" + this.countryID).subscribe(function (hazards) {
            _this.hazards = [];
            _this.hazardsObject = {};
            for (var hazard in hazards) {
                hazards[hazard].key = hazard;
                _this.hazards.push(hazards[hazard]);
                _this.hazardsObject[hazard] = hazards[hazard];
            }
        });
        this.subscriptions.add(subscription);
    };
    AddIndicatorRiskMonitoringComponent.prototype._getIndicator = function (hazardID, indicatorID) {
        //this.indicatorData = new Indicator();
        var _this = this;
        if (this.hazardID == 'countryContext') {
            this.url = Constants_1.Constants.APP_STATUS + "/indicator/" + this.countryID + '/' + indicatorID;
        }
        else {
            this.url = Constants_1.Constants.APP_STATUS + "/indicator/" + hazardID + "/" + indicatorID;
        }
        var subscription = this.af.database.object(this.url).subscribe(function (indicator) {
            if (indicator.$value === null) {
                _this.router.navigate(['/risk-monitoring']);
                return false;
            }
            indicator.id = indicatorID;
            _this.indicatorData.setData(indicator);
        });
        this.subscriptions.add(subscription);
    };
    AddIndicatorRiskMonitoringComponent.prototype._validateData = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.alertMessage = _this.indicatorData.validate();
            if (_this.alertMessage) {
                res(false);
            }
            if (!_this.alertMessage) {
                _this.indicatorData.source.forEach(function (val, key) {
                    _this._validateIndicatorSource(val);
                    if (_this.alertMessage) {
                        res(false);
                    }
                });
                _this.indicatorData.trigger.forEach(function (val, key) {
                    _this._validateIndicatorTrigger(val);
                    if (_this.alertMessage) {
                        res(false);
                    }
                });
                if (!_this.alertMessage) {
                    if (_this.indicatorData.geoLocation == 1) {
                        _this.indicatorData.affectedLocation.forEach(function (val, key) {
                            _this._validateOperationArea(val);
                            if (_this.alertMessage) {
                                res(false);
                            }
                        });
                    }
                }
                if (!_this.alertMessage) {
                    res(true);
                }
            }
        });
        return promise;
    };
    AddIndicatorRiskMonitoringComponent.prototype._validateIndicatorSource = function (indicatorSource) {
        this.alertMessage = indicatorSource.validate();
        return this.alertMessage;
    };
    AddIndicatorRiskMonitoringComponent.prototype._validateIndicatorTrigger = function (indicatorTrigger) {
        this.alertMessage = indicatorTrigger.validate();
        return this.alertMessage;
    };
    AddIndicatorRiskMonitoringComponent.prototype._validateOperationArea = function (operationArea) {
        var excludeFields = [];
        var countryLevel1Exists = operationArea.country
            && this.countryLevelsValues[operationArea.country].levelOneValues
            && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
        if (!countryLevel1Exists) {
            excludeFields.push("level1", "level2");
        }
        else if (countryLevel1Exists && operationArea.level1
            && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues
                || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].length < 1)) {
            excludeFields.push("level2");
        }
        this.alertMessage = operationArea.validate(excludeFields);
        return this.alertMessage;
    };
    AddIndicatorRiskMonitoringComponent.prototype._calculationDueDate = function (durationType, frequencyValue) {
        var currentUnixTime = new Date().getTime();
        var CurrentDate = new Date();
        var currentYear = new Date().getFullYear();
        var day = 86400;
        var week = 604800;
        if (durationType == 0) {
            var differenceTime = frequencyValue * week;
        }
        else if (durationType == 1) {
            var resultDate = CurrentDate.setMonth(CurrentDate.getMonth() + frequencyValue);
            var differenceTime = resultDate - currentUnixTime;
        }
        else if (durationType == 2) {
            differenceTime = this._getDifferenceTimeByYear(frequencyValue);
        }
        var dueDate = currentUnixTime + differenceTime;
        return dueDate;
    };
    AddIndicatorRiskMonitoringComponent.prototype._getDifferenceTimeByYear = function (years) {
        var currentYear = new Date().getFullYear();
        var year = 315036000;
        var leapYear = 31622400;
        var i;
        var differenceTime = 0;
        for (i = 0; i < years; i++) {
            currentYear = currentYear + 1;
            var seconds = this._isLeapYear(currentYear) ? leapYear : year;
            differenceTime = differenceTime + seconds;
        }
        return differenceTime;
    };
    AddIndicatorRiskMonitoringComponent.prototype._isLeapYear = function (year) {
        var isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
        if (!isLeapYear) {
            return false;
        }
        return true;
    };
    AddIndicatorRiskMonitoringComponent.prototype.checkTypeof = function (param) {
        if (typeof (param) == 'undefined') {
            return false;
        }
        else {
            return true;
        }
    };
    AddIndicatorRiskMonitoringComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return AddIndicatorRiskMonitoringComponent;
}());
AddIndicatorRiskMonitoringComponent = __decorate([
    core_1.Component({
        selector: 'app-add-indicator',
        templateUrl: './add-indicator.component.html',
        styleUrls: ['./add-indicator.component.css'],
        providers: [common_service_1.CommonService]
    })
], AddIndicatorRiskMonitoringComponent);
exports.AddIndicatorRiskMonitoringComponent = AddIndicatorRiskMonitoringComponent;
