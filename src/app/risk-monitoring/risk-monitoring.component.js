"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Enums_1 = require("../utils/Enums");
var Constants_1 = require("../utils/Constants");
var alert_message_model_1 = require("../model/alert-message.model");
var log_model_1 = require("../model/log.model");
var RiskMonitoringComponent = (function () {
    function RiskMonitoringComponent(subscriptions, af, router, storage, translate) {
        this.subscriptions = subscriptions;
        this.af = af;
        this.router = router;
        this.storage = storage;
        this.translate = translate;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.alertMessage = null;
        this.hazards = [];
        this.activeHazards = [];
        this.archivedHazards = [];
        this.indicators = {};
        this.indicatorsCC = [];
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
        this.isIndicatorUpdate = [];
        this.durationType = Constants_1.Constants.DURATION_TYPE;
        this.durationTypeList = [Enums_1.DurationType.Week, Enums_1.DurationType.Month, Enums_1.DurationType.Year];
        this.indicatorTrigger = [];
        this.alertImages = Constants_1.Constants.ALERT_IMAGES;
        this.logContent = [];
        this.isIndicatorCountryUpdate = [];
        this.tmpHazardData = [];
        this.tmpLogData = [];
        this.tmpLogData['content'] = '';
        this.successAddNewHazardMessage();
    }
    RiskMonitoringComponent.prototype.successAddNewHazardMessage = function () {
        var _this = this;
        this.successAddHazardMsg = this.storage.get('successAddHazard');
        this.storage.remove('successAddHazard');
        if (typeof (this.successAddHazardMsg) != 'undefined') {
            setTimeout(function () {
                _this.successAddHazardMsg = 'waiting';
                return;
            }, 4000);
        }
    };
    RiskMonitoringComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this._getCountryID().then(function () {
                    _this._getHazards().then(function () {
                    });
                    _this._getCountryContextIndicators();
                });
            }
            else {
                _this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    };
    RiskMonitoringComponent.prototype._getCountryID = function () {
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
    RiskMonitoringComponent.prototype._getCountryContextIndicators = function () {
        var _this = this;
        var subscription = this.af.database.list(Constants_1.Constants.APP_STATUS + "/indicator/" + this.countryID).subscribe(function (indicators) {
            indicators.forEach(function (indicator, key) {
                _this.getLogs(indicator.$key).subscribe(function (logs) {
                    logs.forEach(function (log, key) {
                        _this.getUsers(log.addedBy).subscribe(function (user) {
                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                        });
                    });
                    indicator.logs = _this._sortLogsByDate(logs);
                });
            });
            _this.indicatorsCC = indicators;
        });
        this.subscriptions.add(subscription);
    };
    RiskMonitoringComponent.prototype._getHazards = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/hazard/" + _this.countryID).subscribe(function (hazards) {
                _this.activeHazards = [];
                _this.archivedHazards = [];
                hazards.forEach(function (hazard, key) {
                    hazard.id = hazard.$key;
                    hazard.imgName = _this.translate.instant(_this.hazardScenario[hazard.hazardScenario]).replace(" ", "_");
                    _this.getIndicators(hazard.id).subscribe(function (indicators) {
                        indicators.forEach(function (indicator, key) {
                            _this.getLogs(indicator.$key).subscribe(function (logs) {
                                logs.forEach(function (log, key) {
                                    _this.getUsers(log.addedBy).subscribe(function (user) {
                                        log.addedByFullName = user.firstName + ' ' + user.lastName;
                                    });
                                });
                                indicator.logs = _this._sortLogsByDate(logs);
                            });
                        });
                        hazard.indicators = indicators;
                    });
                    if (hazard.isActive) {
                        _this.activeHazards.push(hazard);
                    }
                    else {
                        _this.archivedHazards.push(hazard);
                    }
                });
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    RiskMonitoringComponent.prototype.getIndicators = function (hazardID) {
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/indicator/" + hazardID);
    };
    RiskMonitoringComponent.prototype.getLogs = function (indicatorID) {
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/log/" + indicatorID, {
            query: {
                orderByChild: 'timeStamp'
            }
        });
    };
    RiskMonitoringComponent.prototype.getUsers = function (userID) {
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + userID);
    };
    RiskMonitoringComponent.prototype.deleteHazard = function (modalID) {
        var _this = this;
        if (!this.tmpHazardData['ID']) {
            console.log('hazardID cannot be empty');
            return false;
        }
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + this.tmpHazardData['ID']).remove().then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_DELETE_HAZARD', Enums_1.AlertMessageType.Success);
            _this.removeTmpHazardID();
        });
        jQuery("#" + modalID).modal("hide");
    };
    RiskMonitoringComponent.prototype.collapseAll = function (mode) {
        if (mode == 'expand') {
            jQuery('.collapse').collapse('show');
        }
        else {
            jQuery('.collapse').collapse('hide');
        }
    };
    RiskMonitoringComponent.prototype.changeIndicatorState = function (state, hazardID, indicatorKey) {
        var key = hazardID + '_' + indicatorKey;
        if (state) {
            this.isIndicatorUpdate[key] = true;
            return true;
        }
        this.isIndicatorUpdate[key] = false;
    };
    RiskMonitoringComponent.prototype.setCheckedTrigger = function (indicatorID, triggerSelected) {
        this.indicatorTrigger[indicatorID] = triggerSelected;
    };
    RiskMonitoringComponent.prototype.setClassForIndicator = function (trigger, triggerSelected) {
        var indicatorClass = 'btn btn-ghost';
        if (trigger == 0 && trigger == triggerSelected) {
            indicatorClass = 'btn btn-primary';
        }
        if (trigger == 1 && trigger == triggerSelected) {
            indicatorClass = 'btn btn-amber';
        }
        if (trigger == 2 && trigger == triggerSelected) {
            indicatorClass = 'btn btn-red';
        }
        return indicatorClass;
    };
    RiskMonitoringComponent.prototype.updateIndicatorStatus = function (hazardID, indicatorID, indicatorKey) {
        var _this = this;
        if (!hazardID || !indicatorID) {
            console.log('hazardID or indicatorID cannot be empty');
            return false;
        }
        var triggerSelected = this.indicatorTrigger[indicatorID];
        var dataToSave = { triggerSelected: triggerSelected };
        var urlToUpdate;
        if (hazardID == 'countryContext') {
            urlToUpdate = Constants_1.Constants.APP_STATUS + '/indicator/' + this.countryID + '/' + indicatorID;
        }
        else {
            urlToUpdate = Constants_1.Constants.APP_STATUS + '/indicator/' + hazardID + '/' + indicatorID;
        }
        this.af.database.object(urlToUpdate)
            .update(dataToSave)
            .then(function (_) {
            _this.changeIndicatorState(false, hazardID, indicatorKey);
        }).catch(function (error) {
            console.log("Message creation unsuccessful" + error);
        });
    };
    RiskMonitoringComponent.prototype.saveLog = function (indicatorID, triggerSelected) {
        var _this = this;
        var log = new log_model_1.LogModel();
        log.content = this.logContent[indicatorID] ? this.logContent[indicatorID] : '';
        log.addedBy = this.uid;
        log.timeStamp = this._getCurrentTimestamp();
        log.triggerAtCreation = triggerSelected;
        this.alertMessage = log.validate();
        if (!this.alertMessage) {
            var dataToSave = log;
            this.af.database.list(Constants_1.Constants.APP_STATUS + '/log/' + indicatorID)
                .push(dataToSave)
                .then(function () {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_ADDED_LOG', Enums_1.AlertMessageType.Success);
                _this.logContent[indicatorID] = '';
            }).catch(function (error) {
                console.log(error, 'You do not have access!');
            });
        }
        return true;
    };
    RiskMonitoringComponent.prototype.setTmpHazard = function (hazardID, activeStatus, hazardScenario) {
        if (!hazardID) {
            return false;
        }
        this.tmpHazardData['ID'] = hazardID;
        this.tmpHazardData['activeStatus'] = activeStatus;
        this.tmpHazardData['scenario'] = hazardScenario;
    };
    RiskMonitoringComponent.prototype.setTmpLog = function (logID, logData, indicatorID) {
        if (!logID) {
            return false;
        }
        this.tmpLogData['ID'] = logID;
        this.tmpLogData['content'] = logData;
        this.tmpLogData['indicatorID'] = indicatorID;
    };
    RiskMonitoringComponent.prototype.removeTmpHazardID = function () {
        this.tmpHazardData = [];
    };
    RiskMonitoringComponent.prototype.removeTmpLog = function () {
        this.tmpLogData = [];
    };
    RiskMonitoringComponent.prototype.editLog = function (modalID) {
        var _this = this;
        var dataToUpdate = { content: this.tmpLogData['content'] };
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/log/' + this.tmpLogData['indicatorID'] + '/' + this.tmpLogData['ID'])
            .update(dataToUpdate)
            .then(function (_) {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_UPDATE_LOG', Enums_1.AlertMessageType.Success);
            _this.removeTmpLog();
            return true;
        }).catch(function (error) {
            console.log("Message creation unsuccessful" + error);
        });
        jQuery("#" + modalID).modal("hide");
    };
    RiskMonitoringComponent.prototype.deleteLog = function (modalID) {
        var _this = this;
        if (!this.tmpLogData || !this.tmpLogData['ID'] || !this.tmpLogData['indicatorID']) {
            console.log('logID cannot be empty');
            return false;
        }
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/log/' + this.tmpLogData['indicatorID'] + '/' + this.tmpLogData['ID']).remove().then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_DELETE_LOG', Enums_1.AlertMessageType.Success);
            _this.tmpLogData = [];
        });
        jQuery("#" + modalID).modal("hide");
    };
    RiskMonitoringComponent.prototype.updateHazardActiveStatus = function (modalID) {
        var _this = this;
        if (!this.tmpHazardData['ID']) {
            console.log('hazardID cannot be empty!');
            return false;
        }
        var dataToUpdate = { isActive: this.tmpHazardData['activeStatus'] };
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + this.tmpHazardData['ID'])
            .update(dataToUpdate)
            .then(function (_) {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCESS_UPDATE_HAZARD', Enums_1.AlertMessageType.Success);
            return true;
        }).catch(function (error) {
            console.log("Message creation unsuccessful" + error);
        });
        jQuery("#" + modalID).modal("hide");
    };
    RiskMonitoringComponent.prototype._getCurrentTimestamp = function () {
        var currentTimeStamp = new Date().getTime();
        return currentTimeStamp;
    };
    RiskMonitoringComponent.prototype._sortLogsByDate = function (array) {
        var byDate = array.slice(0);
        var result = byDate.sort(function (a, b) {
            return b.timeStamp - a.timeStamp;
        });
        return result;
    };
    RiskMonitoringComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return RiskMonitoringComponent;
}());
RiskMonitoringComponent = __decorate([
    core_1.Component({
        selector: 'app-risk-monitoring',
        templateUrl: './risk-monitoring.component.html',
        styleUrls: ['./risk-monitoring.component.css']
    })
], RiskMonitoringComponent);
exports.RiskMonitoringComponent = RiskMonitoringComponent;
