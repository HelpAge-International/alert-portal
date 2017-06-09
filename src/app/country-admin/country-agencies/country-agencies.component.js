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
var CountryAgenciesComponent = (function () {
    function CountryAgenciesComponent(subscriptions, af, router) {
        this.subscriptions = subscriptions;
        this.af = af;
        this.router = router;
        this.countryOffices = [];
        this.countryIDs = [];
        this.countries = Constants_1.Constants.COUNTRIES;
        this.alertLevels = Constants_1.Constants.ALERT_LEVELS;
        this.alertColors = Constants_1.Constants.ALERT_COLORS;
        this.alertLevelsList = [Enums_1.AlertLevels.Green, Enums_1.AlertLevels.Amber, Enums_1.AlertLevels.Red];
        this.count = 0;
        this.countResponsePlans = [];
        this.percentageCHS = [];
        this.filter = 'all';
        this.defaultAgencyLogo = 'assets/images/alert_logo--grey.svg';
        this.minTreshold = [];
        this.advTreshold = [];
        this.mpaStatusIcons = [];
        this.mpaStatusColors = [];
        this.advStatusIcons = [];
        this.advStatusColors = [];
    }
    CountryAgenciesComponent.prototype.ngOnInit = function () {
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
    CountryAgenciesComponent.prototype.filterAlertLevel = function (event) {
        var _this = this;
        this.filter = event.target.value;
        this._getCountryOfficeByLocation().then(function () {
            console.log(_this.countryOffices);
        });
    };
    CountryAgenciesComponent.prototype._loadData = function () {
        var _this = this;
        this._getUserInfo().then(function () {
            _this._getAgencyID().then(function () {
                _this._getCountryOfficeByLocation().then(function () {
                    _this._getResponsePlans();
                    _this._getSystemAdminID().then(function () {
                        _this._getSystemThreshold('minThreshold').then(function (minTreshold) {
                            _this.minTreshold = minTreshold;
                        });
                        _this._getSystemThreshold('advThreshold').then(function (advTreshold) {
                            _this.advTreshold = advTreshold;
                        });
                    }).then(function () {
                        _this._getAllActions();
                    });
                });
            });
        });
    };
    CountryAgenciesComponent.prototype._getUserInfo = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid).subscribe(function (user) {
                if (typeof (user.country) == 'undefined') {
                    console.log('country undefined');
                    return false;
                }
                _this.countryKey = user.country;
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CountryAgenciesComponent.prototype._getAgencyID = function () {
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
    CountryAgenciesComponent.prototype._getCountryOfficeByLocation = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.agencyID).subscribe(function (countryOffices) {
                _this.countryOffices = [];
                _this.countryIDs = [];
                countryOffices.forEach(function (countryOffice) {
                    if (_this.filter == 'all') {
                        if (countryOffice.location == _this.countryKey) {
                            _this.countryIDs.push(countryOffice.$key);
                            _this.countryOffices.push(countryOffice);
                        }
                    }
                    else {
                        if (countryOffice.location == _this.countryKey && parseInt(countryOffice.alertLevel) == _this.filter) {
                            _this.countryOffices.push(countryOffice);
                            _this.countryIDs.push(countryOffice.$key);
                        }
                    }
                });
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CountryAgenciesComponent.prototype._getResponsePlans = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.countryIDs.forEach(function (countryID) {
                var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/responsePlan/" + countryID).subscribe(function (responsePlans) {
                    _this._getCountApprovalStatus(responsePlans, countryID);
                    res(true);
                });
                _this.subscriptions.add(subscription);
            });
        });
        return promise;
    };
    CountryAgenciesComponent.prototype._getCountApprovalStatus = function (responsePlans, countryID) {
        var _this = this;
        responsePlans.forEach(function (responsePlan) {
            var approvals = responsePlan.approval;
            _this.count = 0;
            _this._recursiveParseArray(approvals, countryID);
        });
    };
    CountryAgenciesComponent.prototype._recursiveParseArray = function (approvals, countryID) {
        for (var A in approvals) {
            if (typeof (approvals[A]) == 'object') {
                this._recursiveParseArray(approvals[A], countryID);
            }
            else {
                var approvalStatus = approvals[A];
                if (approvalStatus == 2) {
                    this.count = this.count + 1;
                    this.countResponsePlans[countryID] = this.count;
                }
                else {
                    this.countResponsePlans[countryID] = 0;
                }
            }
        }
    };
    CountryAgenciesComponent.prototype._getAllActions = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.countryIDs.forEach(function (countryID) {
                var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + countryID).subscribe(function (actions) {
                    _this._getPercenteActions(actions, countryID);
                    res(true);
                });
                _this.subscriptions.add(subscription);
            });
        });
        return promise;
    };
    CountryAgenciesComponent.prototype._getSystemThreshold = function (tresholdType) {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/system/" + _this.systemAdminID + '/' + tresholdType).subscribe(function (treshold) {
                res(treshold);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CountryAgenciesComponent.prototype._getSystemAdminID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + _this.uid + '/systemAdmin').subscribe(function (agencyIDs) {
                _this.systemAdminID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CountryAgenciesComponent.prototype._getPercenteActions = function (actions, countryID) {
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
                _this.mpaStatusColors[countryID] = 'green';
                _this.mpaStatusIcons[countryID] = 'fa-check';
            }
            if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= _this.minTreshold[1].$value) {
                _this.mpaStatusColors[countryID] = 'orange';
                _this.mpaStatusIcons[countryID] = 'fa-ellipsis-h';
            }
            if (!percentageMinimumCompletedActions) {
                _this.mpaStatusColors[countryID] = 'red';
                _this.mpaStatusIcons[countryID] = 'fa-times';
            }
            if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= _this.advTreshold[0].$value) {
                _this.advStatusColors[countryID] = 'green';
                _this.advStatusIcons[countryID] = 'fa-check';
            }
            if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= _this.advTreshold[1].$value) {
                _this.advStatusColors[countryID] = 'orange';
                _this.advStatusIcons[countryID] = 'fa-ellipsis-h';
            }
            if (!percentageAdvancedCompletedActions) {
                _this.advStatusColors[countryID] = 'red';
                _this.advStatusIcons[countryID] = 'fa-times';
            }
            _this._getActionsBySystemAdmin().then(function (actions) {
                var countAllActionsSysAdmin = actions.length && actions.length > 0 ? actions.length : 0;
                _this.percentageCHS[countryID] = Math.round((countCompletedAllActions / countAllActionsSysAdmin) * 100);
            });
            res(true);
        });
        return promise;
    };
    CountryAgenciesComponent.prototype._getActionsBySystemAdmin = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.systemAdminID).subscribe(function (actions) {
                res(actions);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    CountryAgenciesComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return CountryAgenciesComponent;
}());
CountryAgenciesComponent = __decorate([
    core_1.Component({
        selector: 'app-country-account-settings',
        templateUrl: './country-agencies.component.html',
        styleUrls: ['./country-agencies.component.css']
    })
], CountryAgenciesComponent);
exports.CountryAgenciesComponent = CountryAgenciesComponent;
