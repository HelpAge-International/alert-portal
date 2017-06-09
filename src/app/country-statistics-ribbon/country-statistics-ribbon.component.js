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
var Enums_1 = require("../utils/Enums");
var CountryStatisticsRibbonComponent = (function () {
    function CountryStatisticsRibbonComponent(af, router) {
        this.af = af;
        this.router = router;
        // TODO - Check when other users are implemented
        this.USER_TYPE = 'administratorCountry';
        this.AlertLevels = Enums_1.AlertLevels;
        this.overallAlertLevel = Enums_1.AlertLevels.Green; // TODO - Find this value
        this.CountriesList = Constants_1.Constants.COUNTRIES;
        this.count = 0;
        this.numOfApprovedResponsePlans = 0;
        this.sysAdminMinThreshold = [];
        this.sysAdminAdvThreshold = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CountryStatisticsRibbonComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.loadData();
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    CountryStatisticsRibbonComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    /**
     * Private functions
     */
    CountryStatisticsRibbonComponent.prototype.loadData = function () {
        var _this = this;
        this.getCountryId().then(function () {
            _this.getApprovedResponsePlansCount();
        });
        this.getAgencyID().then(function () {
            _this.getCountryData();
        });
        this.getSystemAdminID().then(function () {
            _this.getSystemThreshold('minThreshold').then(function (minThreshold) {
                _this.sysAdminMinThreshold = minThreshold;
                _this.getSystemThreshold('advThreshold').then(function (advThreshold) {
                    _this.sysAdminAdvThreshold = advThreshold;
                    _this.getAllActions();
                });
            });
        });
    };
    CountryStatisticsRibbonComponent.prototype.getCountryId = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + "/countryId")
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (countryId) {
                _this.countryId = countryId.$value;
                res(true);
            });
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getAgencyID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + '/agencyAdmin')
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (agencyIds) {
                _this.agencyAdminId = agencyIds[0].$key ? agencyIds[0].$key : "";
                res(true);
            });
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getSystemAdminID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + '/systemAdmin')
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (systemAdminIds) {
                _this.systemAdminId = systemAdminIds[0].$key ? systemAdminIds[0].$key : "";
                res(true);
            });
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getCountryData = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.agencyAdminId + '/' + _this.countryId + "/location")
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (location) {
                _this.countryLocation = location.$value;
                res(true);
            });
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getApprovedResponsePlansCount = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/responsePlan/" + _this.countryId)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (responsePlans) {
                _this.getCountApprovalStatus(responsePlans);
                res(true);
            });
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getCountApprovalStatus = function (responsePlans) {
        var _this = this;
        responsePlans.forEach(function (responsePlan) {
            var approvals = responsePlan.approval;
            _this.count = 0;
            _this.recursiveParseArray(approvals);
        });
    };
    CountryStatisticsRibbonComponent.prototype.recursiveParseArray = function (approvals) {
        for (var A in approvals) {
            if (typeof (approvals[A]) == 'object') {
                this.recursiveParseArray(approvals[A]);
            }
            else {
                var approvalStatus = approvals[A];
                if (approvalStatus == Enums_1.ApprovalStatus.Approved) {
                    this.count = this.count + 1;
                    this.numOfApprovedResponsePlans = this.count;
                }
            }
        }
    };
    CountryStatisticsRibbonComponent.prototype.getSystemThreshold = function (thresholdType) {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/system/" + _this.systemAdminId + '/' + thresholdType)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (threshold) {
                res(threshold);
            });
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getAllActions = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.countryId)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (actions) {
                _this.getPercenteActions(actions);
                res(true);
            });
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getPercenteActions = function (actions) {
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
            if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= _this.sysAdminMinThreshold[0].$value) {
                _this.mpaStatusColor = 'green';
                _this.mpaStatusIcon = 'fa-check';
            }
            if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= _this.sysAdminMinThreshold[1].$value) {
                _this.mpaStatusColor = 'orange';
                _this.mpaStatusIcon = 'fa-ellipsis-h';
            }
            if (!percentageMinimumCompletedActions || percentageMinimumCompletedActions < _this.sysAdminMinThreshold[1].$value) {
                _this.mpaStatusColor = 'red';
                _this.mpaStatusIcon = 'fa-times';
            }
            if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= _this.sysAdminAdvThreshold[0].$value) {
                _this.advStatusColor = 'green';
                _this.advStatusIcon = 'fa-check';
            }
            if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= _this.sysAdminAdvThreshold[1].$value) {
                _this.advStatusColor = 'orange';
                _this.advStatusIcon = 'fa-ellipsis-h';
            }
            if (!percentageAdvancedCompletedActions || percentageAdvancedCompletedActions < _this.sysAdminAdvThreshold[1].$value) {
                _this.advStatusColor = 'red';
                _this.advStatusIcon = 'fa-times';
            }
            _this.getActionsBySystemAdmin().then(function (actions) {
                var countAllActionsSysAdmin = actions.length && actions.length > 0 ? actions.length : 0;
                _this.percentageCHS = Math.round((countCompletedAllActions / countAllActionsSysAdmin) * 100);
            });
            res(true);
        });
        return promise;
    };
    CountryStatisticsRibbonComponent.prototype.getActionsBySystemAdmin = function () {
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
    CountryStatisticsRibbonComponent.prototype.getCountryCodeFromLocation = function (location) {
        return Enums_1.Countries[location];
    };
    CountryStatisticsRibbonComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return CountryStatisticsRibbonComponent;
}());
CountryStatisticsRibbonComponent = __decorate([
    core_1.Component({
        selector: 'app-country-statistics-ribbon',
        templateUrl: './country-statistics-ribbon.component.html',
        styleUrls: ['./country-statistics-ribbon.component.css']
    })
], CountryStatisticsRibbonComponent);
exports.CountryStatisticsRibbonComponent = CountryStatisticsRibbonComponent;
