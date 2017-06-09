"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Constants_1 = require("../utils/Constants");
var MapHelper_1 = require("../utils/MapHelper");
var map_countries_list_component_1 = require("../map/map-countries-list/map-countries-list.component");
var Enums_1 = require("../utils/Enums");
var actions_service_1 = require("../services/actions.service");
var moment = require("moment");
var agency_service_service_1 = require("../services/agency-service.service");
var DirectorComponent = (function () {
    function DirectorComponent(af, router, actionService, userService) {
        this.af = af;
        this.router = router;
        this.actionService = actionService;
        this.userService = userService;
        this.UserType = Enums_1.UserType;
        this.loaderInactive = true;
        this.agencyName = '';
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.indicatorsToday = [];
        this.indicatorsThisWeek = [];
        this.approvalPlans = [];
        this.regionName = '';
        this.locationsOfCountriesInRegion = [];
        this.countryIdsForOther = new Set();
        this.allCountries = new Set();
        this.otherRegion = map_countries_list_component_1.RegionHolder.create("Other Countries", "unassigned");
        this.AlertLevels = Enums_1.AlertLevels;
        this.alertLevels = Constants_1.Constants.ALERT_LEVELS;
        this.alertColors = Constants_1.Constants.ALERT_COLORS;
        this.alertLevelsList = [Enums_1.AlertLevels.Green, Enums_1.AlertLevels.Amber, Enums_1.AlertLevels.Red, Enums_1.AlertLevels.All];
        this.overallAlertLevels = [];
        this.alertLevelColours = [];
        this.countResponsePlans = [];
        this.count = 0;
        this.minTreshold = [];
        this.advTreshold = [];
        this.mpaStatusIcons = [];
        this.mpaStatusColors = [];
        this.advStatusIcons = [];
        this.advStatusColors = [];
        this.percentageCHS = [];
        // Filter
        this.alertLevelSelected = Enums_1.AlertLevels.All;
        this.userPaths = Constants_1.Constants.USER_PATHS;
        this.ngUnsubscribe = new rxjs_1.Subject();
        this.countryIds = [];
        this.mapHelper = MapHelper_1.SuperMapComponents.init(af, this.ngUnsubscribe);
        this.regions = [];
        this.countries = [];
        this.idsOfCountriesInRegion = [];
    }
    DirectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        //clear data
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.indicatorsToday = [];
        this.indicatorsThisWeek = [];
        this.approvalPlans = [];
        //set initial loader status
        this.loaderInactive = false;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.userService.getUserType(_this.uid)
                    .flatMap(function (userType) {
                    _this.userType = userType;
                    return _this.userService.getAgencyId(Constants_1.Constants.USER_PATHS[userType], _this.uid);
                })
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (agencyId) {
                    _this.agencyId = agencyId;
                    _this.userService.getUserType(_this.uid)
                        .flatMap(function (userType) {
                        return _this.userService.getSystemAdminId(Constants_1.Constants.USER_PATHS[userType], _this.uid);
                    })
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function (systemAdminId) {
                        _this.systemAdminId = systemAdminId;
                        _this.loadData();
                    });
                });
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    DirectorComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    DirectorComponent.prototype.planReview = function (planId, countryId) {
        this.router.navigate(["/dashboard/review-response-plan", {
                "id": planId,
                "countryId": countryId,
                "isDirector": true
            }]);
    };
    DirectorComponent.prototype.countryOverview = function (countryId) {
        this.router.navigate(["/director/director-overview", { "countryId": countryId, "isViewing": true }]);
    };
    DirectorComponent.prototype.getCountryCodeFromLocation = function (location) {
        return Enums_1.Countries[location];
    };
    DirectorComponent.prototype.getCountryCodeFromCountryId = function (countryId) {
        console.log("countryId - " + countryId);
        var location;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (country) {
            if (country.location || country.location == 0) {
                location = country.location;
                return Enums_1.Countries[location];
            }
        });
    };
    DirectorComponent.prototype.getDirectorName = function (directorId) {
        var _this = this;
        this.directorName = "AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED";
        if (directorId && directorId != "null") {
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + directorId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (user) {
                _this.directorName = user.firstName + " " + user.lastName;
            });
        }
        return this.directorName;
    };
    DirectorComponent.prototype.filter = function () {
        if (this.userType != Enums_1.UserType.RegionalDirector) {
            if (this.alertLevelSelected == Enums_1.AlertLevels.All) {
                // TODO - No filter. show all
                console.log('All Filter');
                console.log("Selected Alert level ---- " + this.alertLevelSelected);
            }
            else {
                console.log('Filter selected');
                console.log("Selected Alert level ---- " + this.alertLevelSelected);
            }
        }
    };
    /**
     * Private functions
     */
    DirectorComponent.prototype.loadData = function () {
        var _this = this;
        console.log("Agency Admin ---- " + this.agencyId);
        console.log("System Admin ---- " + this.systemAdminId);
        this.userService.getAllCountryIdsForAgency(this.agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (countryIds) {
            _this.countryIds = countryIds;
            _this.userService.getAllCountryAlertLevelsForAgency(_this.agencyId)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (countryAlertLevels) {
                _this.overallAlertLevels = countryAlertLevels;
                _this.initData();
            });
        });
    };
    DirectorComponent.prototype.initData = function () {
        var _this = this;
        var startOfToday = moment().startOf("day").valueOf();
        var endOfToday = moment().endOf("day").valueOf();
        this.countryIds.forEach(function (countryId) {
            //for each country do following
            _this.actionService.getActionsDueInWeek(countryId, _this.uid)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (actions) {
                _this.actionsToday = actions.filter(function (action) { return action.dueDate >= startOfToday && action.dueDate <= endOfToday; }).concat(_this.actionsToday);
                _this.actionsThisWeek = actions.filter(function (action) { return action.dueDate > endOfToday; }).concat(_this.actionsThisWeek);
            });
            _this.actionService.getIndicatorsDueInWeek(countryId, _this.uid)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (indicators) {
                var dayIndicators = indicators.filter(function (indicator) { return indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday; });
                var weekIndicators = indicators.filter(function (indicator) { return indicator.dueDate > endOfToday; });
                if (dayIndicators.length > 0) {
                    dayIndicators.forEach(function (indicator) {
                        if (_this.actionService.isExist(indicator.$key, _this.indicatorsToday)) {
                            var index = _this.actionService.indexOfItem(indicator.$key, _this.indicatorsToday);
                            if (index != -1) {
                                _this.indicatorsToday[index] = indicator;
                            }
                        }
                        else {
                            _this.indicatorsToday.push(indicator);
                        }
                    });
                }
                if (weekIndicators.length > 0) {
                    weekIndicators.forEach(function (indicator) {
                        if (_this.actionService.isExist(indicator.$key, _this.indicatorsThisWeek)) {
                            var index = _this.actionService.indexOfItem(indicator.$key, _this.indicatorsThisWeek);
                            if (index != -1) {
                                _this.indicatorsThisWeek[index] = indicator;
                            }
                        }
                        else {
                            _this.indicatorsThisWeek.push(indicator);
                        }
                    });
                }
            });
            _this.actionService.getResponsePlanFoGlobalDirectorToApproval(countryId, _this.uid)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (plans) {
                _this.approvalPlans = _this.approvalPlans.concat(plans);
            });
        });
        this.getAgencyName();
        this.getAllRegionsAndCountries();
        this.setupAlertLevelColours();
        this.getResponsePlans();
        this.getThresholds();
        if (this.userType == Enums_1.UserType.RegionalDirector) {
            this.getCountriesForRegion();
        }
        this.loaderInactive = true;
    };
    DirectorComponent.prototype.getAgencyName = function () {
        var _this = this;
        if (this.agencyId) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + this.agencyId + '/name')
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (agencyName) {
                _this.agencyName = agencyName ? agencyName.$value : "Agency";
            });
        }
    };
    DirectorComponent.prototype.getCountriesForRegion = function () {
        var _this = this;
        this.userService.getRegionId(this.userPaths[this.userType], this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (regionId) {
            _this.regionId = regionId;
            if (_this.agencyId && _this.regionId) {
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/region/" + _this.agencyId + '/' + _this.regionId)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (region) {
                    _this.regionName = region.name ? region.name : "Region";
                    for (var country in region.countries) {
                        _this.idsOfCountriesInRegion.push(country);
                    }
                    _this.getCountryCodesForCountriesInRegion();
                });
            }
        });
    };
    DirectorComponent.prototype.getCountryCodesForCountriesInRegion = function () {
        var _this = this;
        if (this.idsOfCountriesInRegion) {
            this.idsOfCountriesInRegion.forEach(function (countryId) {
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.agencyId + "/" + countryId)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (country) {
                    if (country.location || country.location == 0) {
                        _this.locationsOfCountriesInRegion[countryId] = Enums_1.Countries[country.location];
                    }
                });
            });
        }
    };
    DirectorComponent.prototype.getAllRegionsAndCountries = function () {
        var _this = this;
        this.otherRegion = new map_countries_list_component_1.RegionHolder();
        this.otherRegion.regionId = "Unassigned";
        this.otherRegion.regionName = "Other Countries";
        this.mapHelper.getRegionsForAgency(this.uid, this.userPaths[this.userType], function (key, obj) {
            var hRegion = new map_countries_list_component_1.RegionHolder();
            hRegion.regionName = obj.name;
            hRegion.directorId = obj.directorId;
            hRegion.regionId = key;
            for (var x in obj.countries) {
                hRegion.countries.add(x);
                _this.countryIdsForOther.add(x);
            }
            _this.evaluateOthers();
            _this.addOrUpdateRegion(hRegion);
        });
        this.mapHelper.initCountries(this.uid, this.userPaths[this.userType], function (departments) {
            _this.allCountries.clear();
            for (var _i = 0, departments_1 = departments; _i < departments_1.length; _i++) {
                var x = departments_1[_i];
                _this.addOrUpdateCountry(x);
                _this.allCountries.add(x.countryId);
            }
            _this.evaluateOthers();
        });
    };
    DirectorComponent.prototype.evaluateOthers = function () {
        if (this.allCountries.size > 0) {
            for (var x in this.allCountries) {
                if (!this.countryIdsForOther.has(x)) {
                    this.otherRegion.countries.add(x);
                }
                else {
                    this.otherRegion.countries.delete(x);
                }
            }
        }
    };
    DirectorComponent.prototype.addOrUpdateCountry = function (holder) {
        for (var _i = 0, _a = this.countries; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.countryId == holder.countryId) {
                x.location = holder.location;
                x.departments = holder.departments;
                return;
            }
        }
        this.countries.push(holder);
        return;
    };
    DirectorComponent.prototype.addOrUpdateRegion = function (holder) {
        for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.regionId == holder.regionId) {
                x.regionName = holder.regionName;
                x.directorId = holder.directorId;
                x.countries = holder.countries;
                return;
            }
        }
        this.regions.push(holder);
        return;
    };
    DirectorComponent.prototype.setupAlertLevelColours = function () {
        for (var country in this.overallAlertLevels) {
            if (this.overallAlertLevels[country] == Enums_1.AlertLevels.Green) {
                this.alertLevelColours[country] = 'green';
            }
            else if (this.overallAlertLevels[country] == Enums_1.AlertLevels.Amber) {
                this.alertLevelColours[country] = 'orange';
            }
            else if (this.overallAlertLevels[country] == Enums_1.AlertLevels.Red) {
                this.alertLevelColours[country] = 'red';
            }
            else {
                this.alertLevelColours[country] = 'grey';
            }
        }
    };
    DirectorComponent.prototype.getResponsePlans = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.countryIds.forEach(function (countryID) {
                _this.af.database.list(Constants_1.Constants.APP_STATUS + "/responsePlan/" + countryID)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (responsePlans) {
                    _this.getCountApprovalStatus(responsePlans, countryID);
                    res(true);
                });
            });
        });
        return promise;
    };
    DirectorComponent.prototype.getCountApprovalStatus = function (responsePlans, countryID) {
        var _this = this;
        responsePlans.forEach(function (responsePlan) {
            var approvals = responsePlan.approval;
            _this.count = 0;
            _this.recursiveParseArray(approvals, countryID);
        });
    };
    DirectorComponent.prototype.recursiveParseArray = function (approvals, countryID) {
        for (var A in approvals) {
            if (typeof (approvals[A]) == 'object') {
                this.recursiveParseArray(approvals[A], countryID);
            }
            else {
                var approvalStatus = approvals[A];
                if (approvalStatus == 2) {
                    this.count = this.count + 1;
                    this.countResponsePlans[countryID] = this.count;
                }
            }
        }
    };
    DirectorComponent.prototype.getThresholds = function () {
        var _this = this;
        this.getSystemThreshold('minThreshold').then(function (minTreshold) {
            _this.minTreshold = minTreshold;
            _this.getSystemThreshold('advThreshold').then(function (advTreshold) {
                _this.advTreshold = advTreshold;
                _this.getAllActions();
            });
        });
    };
    DirectorComponent.prototype.getSystemThreshold = function (tresholdType) {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/system/" + _this.systemAdminId + '/' + tresholdType)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (treshold) {
                res(treshold);
            });
        });
        return promise;
    };
    DirectorComponent.prototype.getAllActions = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.countryIds.forEach(function (countryId) {
                _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + countryId)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (actions) {
                    _this.getPercenteActions(actions, countryId);
                    res(true);
                });
            });
        });
        return promise;
    };
    DirectorComponent.prototype.getPercenteActions = function (actions, countryId) {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var countAllMinimumActions = 0;
            var countAllAdvancedActions = 0;
            var countCompletedMinimumActions = 0;
            var countCompletedAdvancedActions = 0;
            var countCompletedAllActions = 0;
            actions.forEach(function (action) {
                if (action.level == 1) {
                    countAllMinimumActions = countAllMinimumActions + 1;
                    if (action.actionStatus == 2) {
                        countCompletedMinimumActions = countCompletedMinimumActions + 1;
                    }
                }
                if (action.level == 2) {
                    countAllAdvancedActions = countAllAdvancedActions + 1;
                    if (action.actionStatus == 2) {
                        countCompletedAdvancedActions = countCompletedAdvancedActions + 1;
                    }
                }
                if (action.actionStatus == 2) {
                    countCompletedAllActions = countCompletedAllActions + 1;
                }
            });
            var percentageMinimumCompletedActions = (countCompletedMinimumActions / countAllMinimumActions) * 100;
            percentageMinimumCompletedActions = percentageMinimumCompletedActions ? percentageMinimumCompletedActions : 0;
            var percentageAdvancedCompletedActions = (countCompletedAdvancedActions / countAllAdvancedActions) * 100;
            percentageAdvancedCompletedActions = percentageAdvancedCompletedActions ? percentageAdvancedCompletedActions : 0;
            if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= _this.minTreshold[0].$value) {
                _this.mpaStatusColors[countryId] = 'green';
                _this.mpaStatusIcons[countryId] = 'fa-check';
            }
            if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= _this.minTreshold[1].$value) {
                _this.mpaStatusColors[countryId] = 'orange';
                _this.mpaStatusIcons[countryId] = 'fa-ellipsis-h';
            }
            if (!percentageMinimumCompletedActions || percentageMinimumCompletedActions < _this.minTreshold[1].$value) {
                _this.mpaStatusColors[countryId] = 'red';
                _this.mpaStatusIcons[countryId] = 'fa-times';
            }
            if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= _this.advTreshold[0].$value) {
                _this.advStatusColors[countryId] = 'green';
                _this.advStatusIcons[countryId] = 'fa-check';
            }
            if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= _this.advTreshold[1].$value) {
                _this.advStatusColors[countryId] = 'orange';
                _this.advStatusIcons[countryId] = 'fa-ellipsis-h';
            }
            if (!percentageAdvancedCompletedActions || percentageAdvancedCompletedActions < _this.advTreshold[1].$value) {
                _this.advStatusColors[countryId] = 'red';
                _this.advStatusIcons[countryId] = 'fa-times';
            }
            _this.getActionsBySystemAdmin().then(function (actions) {
                var countAllActionsSysAdmin = actions.length && actions.length > 0 ? actions.length : 0;
                _this.percentageCHS[countryId] = Math.round((countCompletedAllActions / countAllActionsSysAdmin) * 100);
            });
            res(true);
        });
        return promise;
    };
    DirectorComponent.prototype.getActionsBySystemAdmin = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.systemAdminId)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (actions) {
                res(actions);
            });
        });
        return promise;
    };
    DirectorComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return DirectorComponent;
}());
DirectorComponent = __decorate([
    core_1.Component({
        selector: 'app-director',
        templateUrl: './director.component.html',
        styleUrls: ['./director.component.css'],
        providers: [actions_service_1.ActionsService, agency_service_service_1.AgencyService]
    })
], DirectorComponent);
exports.DirectorComponent = DirectorComponent;
