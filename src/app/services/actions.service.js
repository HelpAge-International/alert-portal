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
var moment = require("moment");
var Observable_1 = require("rxjs/Observable");
var Enums_1 = require("../utils/Enums");
var alert_model_1 = require("../model/alert.model");
var affectedArea_model_1 = require("../model/affectedArea.model");
var Subject_1 = require("rxjs/Subject");
var json_location_model_1 = require("../model/json-location.model");
var ActionsService = (function () {
    function ActionsService(af, userService, jsonService, router) {
        this.af = af;
        this.userService = userService;
        this.jsonService = jsonService;
        this.router = router;
        this.ngUnsubscribe = new Subject_1.Subject();
    }
    ActionsService.prototype.getActionsDueInWeek = function (countryId, uid) {
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + countryId, {
            query: {
                orderByChild: "dueDate",
                startAt: moment().startOf('day').valueOf()
            }
        })
            .filter(function (action) { return action.assignee === uid; });
    };
    ActionsService.prototype.getIndicatorsDueInWeek = function (countryId, uid) {
        var _this = this;
        var startOfToday = moment().startOf('day').valueOf();
        var countryContextIndicators = this.af.database.list(Constants_1.Constants.APP_STATUS + "/indicator/" + countryId, {
            query: {
                orderByChild: "dueDate",
                startAt: startOfToday
            }
        })
            .filter(function (indicator) { return indicator.assignee === uid; });
        var countryIndicators = this.af.database.list(Constants_1.Constants.APP_STATUS + "/hazard/" + countryId)
            .flatMap(function (hazards) {
            return Observable_1.Observable.from(hazards.map(function (hazard) { return hazard.$key; }));
        })
            .flatMap(function (hazardId) {
            return _this.af.database.list(Constants_1.Constants.APP_STATUS + "/indicator/" + hazardId, {
                query: {
                    orderByChild: "dueDate",
                    startAt: startOfToday
                }
            });
        })
            .map(function (indicators) {
            return indicators.filter(function (indicator) { return indicator.assignee === uid; });
        });
        return countryContextIndicators.merge(countryIndicators);
    };
    ActionsService.prototype.isExist = function (key, list) {
        return list.some(function (item) { return item.$key === key; });
    };
    ActionsService.prototype.indexOfItem = function (key, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].$key === key) {
                return i;
            }
        }
        return -1;
    };
    ActionsService.prototype.getActionTitle = function (action) {
        var title = "";
        if (action.type == Enums_1.ActionType.chs) {
            title = "A CHS preparedness action needs to be completed";
        }
        else if (action.level == Enums_1.ActionLevel.MPA) {
            title = "A minimum preparedness action needs to be completed";
        }
        else if (action.level == Enums_1.ActionLevel.APA) {
            title = "An advanced preparedness action needs to be completed";
        }
        return title;
    };
    ActionsService.prototype.getIndicatorTitle = function (indicator) {
        var title = "";
        if (indicator.triggerSelected == Enums_1.AlertLevels.Green) {
            title = "A green level indicator needs to be completed";
        }
        else if (indicator.triggerSelected == Enums_1.AlertLevels.Amber) {
            title = "An amber level indicator needs to be completed";
        }
        else if (indicator.triggerSelected == Enums_1.AlertLevels.Red) {
            title = "A red level indicator needs to be completed";
        }
        return title;
    };
    ActionsService.prototype.getAlerts = function (countryId) {
        var _this = this;
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/alert/" + countryId, {
            query: {
                orderByChild: "alertLevel",
                startAt: Enums_1.AlertLevels.Amber
            }
        })
            .map(function (alerts) {
            var alertList = [];
            alerts.forEach(function (alert) {
                var modelAlert = new alert_model_1.ModelAlert();
                modelAlert.id = alert.$key;
                modelAlert.alertLevel = alert.alertLevel;
                modelAlert.hazardScenario = alert.hazardScenario;
                modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
                modelAlert.infoNotes = alert.infoNotes;
                modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
                modelAlert.timeCreated = alert.timeCreated;
                modelAlert.createdBy = alert.createdBy;
                if (alert.updatedBy) {
                    modelAlert.updatedBy = alert.updatedBy;
                }
                var affectedAreas = [];
                var countries = Object.keys(alert.affectedAreas);
                countries.forEach(function (country) {
                    var modelAffectedArea = new affectedArea_model_1.ModelAffectedArea();
                    modelAffectedArea.affectedCountry = Number(country);
                    modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] : -1;
                    modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] : -1;
                    affectedAreas.push(modelAffectedArea);
                });
                modelAlert.affectedAreas = affectedAreas;
                modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
                modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];
                alertList.push(modelAlert);
            });
            return alertList;
        })
            .do(function (alertList) {
            alertList.forEach(function (alert) {
                _this.userService.getUser(alert.createdBy)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (user) {
                    alert.createdByName = user.firstName + " " + user.lastName;
                });
            });
        })
            .do(function (alertList) {
            alertList.forEach(function (alert) {
                if (alert.updatedBy) {
                    _this.userService.getUser(alert.updatedBy)
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function (user) {
                        alert.updatedByName = user.firstName + " " + user.lastName;
                    });
                }
            });
        })
            .do(function (alertList) {
            alertList.forEach(function (alert) {
                var displayArea = [];
                // let displayArea: UpdateArea[] = [];
                alert.affectedAreas.forEach(function (area) {
                    if (area.affectedLevel2 && area.affectedLevel2 != -1) {
                        // let temp:UpdateArea = {"country":area.affectedCountry, "level1":-1, "level2":-1};
                        displayArea.push(area.affectedLevel2);
                    }
                    else if (area.affectedLevel1 && area.affectedLevel1 != -1) {
                        displayArea.push(area.affectedLevel1);
                    }
                    else {
                        displayArea.push(area.affectedCountry);
                    }
                });
                alert.affectedAreasDisplay = displayArea;
            });
        });
    };
    ActionsService.prototype.getAlert = function (alertId, countryId) {
        var _this = this;
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/alert/" + countryId + "/" + alertId)
            .map(function (alert) {
            var modelAlert = new alert_model_1.ModelAlert();
            modelAlert.id = alert.$key;
            modelAlert.alertLevel = alert.alertLevel;
            modelAlert.hazardScenario = alert.hazardScenario;
            modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
            modelAlert.infoNotes = alert.infoNotes;
            modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
            modelAlert.timeCreated = alert.timeCreated;
            modelAlert.timeUpdated = alert.timeUpdated ? alert.timeUpdated : -1;
            modelAlert.createdBy = alert.createdBy;
            var affectedAreas = [];
            var countries = Object.keys(alert.affectedAreas);
            countries.forEach(function (country) {
                var modelAffectedArea = new affectedArea_model_1.ModelAffectedArea();
                modelAffectedArea.affectedCountry = Number(country);
                modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'];
                modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'];
                affectedAreas.push(modelAffectedArea);
            });
            modelAlert.affectedAreas = affectedAreas;
            modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
            modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];
            return modelAlert;
        })
            .do(function (modelAlert) {
            _this.userService.getUser(modelAlert.updatedBy ? modelAlert.updatedBy : modelAlert.createdBy)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (user) {
                modelAlert.createdByName = user.firstName + " " + user.lastName;
            });
        });
    };
    ActionsService.prototype.getAllLevelInfo = function (country) {
        return this.jsonService.getJsonContent(Constants_1.Constants.COUNTRY_LEVELS_VALUES_FILE)
            .map(function (result) {
            var level1values = [];
            if (result[country] && result[country]['levelOneValues']) {
                result[country]['levelOneValues'].forEach(function (item) {
                    var modelLevel1 = new json_location_model_1.ModelJsonLocation();
                    modelLevel1.id = item.id;
                    modelLevel1.value = item.value;
                    var level2models = [];
                    if (item.levelTwoValues) {
                        item.levelTwoValues.forEach(function (item) {
                            var modelLevel2 = new json_location_model_1.ModelJsonLocation();
                            modelLevel2.id = item.id;
                            modelLevel2.value = item.value;
                            level2models.push(modelLevel2);
                        });
                    }
                    modelLevel1.levelTwoValues = level2models;
                    level1values.push(modelLevel1);
                });
            }
            return level1values;
        });
    };
    ActionsService.prototype.updateAlert = function (alert, countryId, alertId) {
        var _this = this;
        console.log("update alert");
        var updateData = {};
        var areaData = {};
        alert.affectedAreas.forEach(function (area) {
            var subData = {};
            subData["country"] = Number(area.affectedCountry);
            if (area.affectedLevel1) {
                subData["level1"] = Number(area.affectedLevel1);
            }
            if (area.affectedLevel2) {
                subData["level2"] = Number(area.affectedLevel2);
            }
            areaData[area.affectedCountry] = subData;
        });
        updateData["affectedAreas"] = areaData;
        updateData["alertLevel"] = alert.alertLevel;
        var countryDirectorData = {};
        countryDirectorData[alert.approvalDirectorId] = alert.approvalStatus;
        var countryDirector = {};
        countryDirector["countryDirector"] = countryDirectorData;
        updateData["approval"] = countryDirector;
        updateData["createdBy"] = alert.createdBy;
        updateData["estimatedPopulation"] = alert.estimatedPopulation;
        updateData["hazardScenario"] = alert.hazardScenario;
        updateData["infoNotes"] = alert.infoNotes;
        updateData["reasonForRedAlert"] = alert.reasonForRedAlert;
        updateData["timeCreated"] = alert.timeCreated;
        updateData["timeUpdated"] = alert.timeUpdated;
        updateData["updatedBy"] = alert.updatedBy;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/alert/" + countryId + "/" + alertId).set(updateData).then(function () {
            _this.router.navigateByUrl(Constants_1.Constants.COUNTRY_ADMIN_HOME);
        }, function (error) {
            console.log(error.message);
        });
    };
    ActionsService.prototype.getAlertsForDirectorToApprove = function (uid, countryId) {
        var _this = this;
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/alert/" + countryId, {
            query: {
                orderByChild: "approval/countryDirector/" + uid,
                equalTo: Enums_1.AlertStatus.WaitingResponse
            }
        })
            .map(function (alerts) {
            console.log(alerts);
            var alertList = [];
            alerts.forEach(function (alert) {
                var modelAlert = new alert_model_1.ModelAlert();
                modelAlert.id = alert.$key;
                modelAlert.alertLevel = alert.alertLevel;
                modelAlert.hazardScenario = alert.hazardScenario;
                modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
                modelAlert.infoNotes = alert.infoNotes;
                modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
                modelAlert.timeCreated = alert.timeCreated;
                modelAlert.createdBy = alert.createdBy;
                var affectedAreas = [];
                var countries = Object.keys(alert.affectedAreas);
                countries.forEach(function (country) {
                    var modelAffectedArea = new affectedArea_model_1.ModelAffectedArea();
                    modelAffectedArea.affectedCountry = Number(country);
                    modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] : -1;
                    modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] : -1;
                    affectedAreas.push(modelAffectedArea);
                });
                modelAlert.affectedAreas = affectedAreas;
                modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
                modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];
                alertList.push(modelAlert);
            });
            return alertList;
        })
            .do(function (alertList) {
            alertList.forEach(function (alert) {
                _this.userService.getUser(alert.createdBy)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (user) {
                    alert.createdByName = user.firstName + " " + user.lastName;
                });
            });
        })
            .do(function (alertList) {
            alertList.forEach(function (alert) {
                var displayArea = [];
                // let displayArea: UpdateArea[] = [];
                alert.affectedAreas.forEach(function (area) {
                    if (area.affectedLevel2 && area.affectedLevel2 != -1) {
                        // let temp:UpdateArea = {"country":area.affectedCountry, "level1":-1, "level2":-1};
                        displayArea.push(area.affectedLevel2);
                    }
                    else if (area.affectedLevel1 && area.affectedLevel1 != -1) {
                        displayArea.push(area.affectedLevel1);
                    }
                    else {
                        displayArea.push(area.affectedCountry);
                    }
                });
                alert.affectedAreasDisplay = displayArea;
            });
        });
    };
    ActionsService.prototype.approveRedAlert = function (countryId, alertId, uid) {
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/alert/" + countryId + "/" + alertId + "/approval/countryDirector/" + uid).set(Enums_1.AlertStatus.Approved);
    };
    ActionsService.prototype.rejectRedAlert = function (countryId, alertId, uid) {
        var update = {};
        update["/alert/" + countryId + "/" + alertId + "/approval/countryDirector/" + uid] = Enums_1.AlertStatus.Rejected;
        update["/alert/" + countryId + "/" + alertId + "/alertLevel/"] = Enums_1.AlertLevels.Amber;
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(update);
    };
    ActionsService.prototype.getResponsePlanForDirectorToApproval = function (countryId, uid) {
        var _this = this;
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/responsePlan/" + countryId, ({
            query: {
                orderByChild: "/approval/countryDirector/" + uid,
                equalTo: Enums_1.ApprovalStatus.WaitingApproval
            }
        }))
            .map(function (plans) {
            plans.forEach(function (plan) {
                var userId = plan.updatedBy ? plan.updatedBy : plan.createdBy;
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + userId)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (user) {
                    plan["displayName"] = user.firstName + " " + user.lastName;
                });
            });
            return plans;
        });
    };
    ActionsService.prototype.unSubscribeNow = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    return ActionsService;
}());
ActionsService = __decorate([
    core_1.Injectable()
], ActionsService);
exports.ActionsService = ActionsService;
