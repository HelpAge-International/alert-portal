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
var BudgetPreparednessComponent = (function () {
    function BudgetPreparednessComponent(af, subscriptions, router) {
        this.af = af;
        this.subscriptions = subscriptions;
        this.router = router;
        this.preparednessBudget = [];
        this.minimumPreparednessBudget = [];
        this.advancedPreparednessBudget = [];
        this.department = Constants_1.Constants.DEPARTMENT;
        this.departmentList = [Enums_1.Department.CHS, Enums_1.Department.Finance, Enums_1.Department.HR, Enums_1.Department.Logistics, Enums_1.Department.Programme];
        this.actionLevel = Constants_1.Constants.ACTION_LEVEL;
        this.actionLevelList = [Enums_1.ActionLevel.MPA, Enums_1.ActionLevel.APA];
        this.generateArray();
    }
    BudgetPreparednessComponent.prototype.ngOnInit = function () {
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
    BudgetPreparednessComponent.prototype.savePreparednessBudget = function () {
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/minPreparednessBudget')
            .set(this.minimumPreparednessBudget)
            .then(function () {
            console.log('success save MPA budget settings');
        }).catch(function (error) {
            console.log(error, 'You do not have access!');
        });
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/advPreparednessBudget')
            .set(this.advancedPreparednessBudget)
            .then(function () {
            console.log('success save APA budget settings');
        }).catch(function (error) {
            console.log(error, 'You do not have access!');
        });
    };
    BudgetPreparednessComponent.prototype.generateArray = function () {
        for (var dKey in this.departmentList) {
            this.minimumPreparednessBudget[dKey] = [];
            this.minimumPreparednessBudget[dKey]['value'] = '';
            this.minimumPreparednessBudget[dKey]['narrative'] = '';
            this.advancedPreparednessBudget[dKey] = [];
            this.advancedPreparednessBudget[dKey]['value'] = '';
            this.advancedPreparednessBudget[dKey]['narrative'] = '';
        }
    };
    BudgetPreparednessComponent.prototype.setTotal = function (level) {
        var _this = this;
        if (level == 'MPA') {
            this.minimumBudgetTotal = 0;
            this.minimumPreparednessBudget.forEach(function (val, key) {
                var value = !val['value'] ? 0 : parseFloat(val['value']);
                if (value && value > 0) {
                    _this.minimumBudgetTotal = _this.minimumBudgetTotal + value;
                }
            });
        }
        if (level == 'APA') {
            this.advancedBudgetTotal = 0;
            this.advancedPreparednessBudget.forEach(function (val, key) {
                var value = !val['value'] ? 0 : parseFloat(val['value']);
                if (value && value > 0) {
                    _this.advancedBudgetTotal = _this.advancedBudgetTotal + value;
                }
            });
        }
        this.setTotalAll();
    };
    BudgetPreparednessComponent.prototype.setTotalAll = function () {
        var minimumTotal = this.minimumBudgetTotal && this.minimumBudgetTotal > 0 ? this.minimumBudgetTotal : 0;
        var advancedTotal = this.advancedBudgetTotal && this.advancedBudgetTotal > 0 ? this.advancedBudgetTotal : 0;
        var grandTotal = minimumTotal + advancedTotal;
        this.grandTotal = grandTotal;
    };
    BudgetPreparednessComponent.prototype._getAgencyID = function () {
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
    BudgetPreparednessComponent.prototype._getCountryID = function () {
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
    BudgetPreparednessComponent.prototype._getBudgetSettings = function () {
        var _this = this;
        var subscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID).subscribe(function (budgetSettings) {
            if (budgetSettings && budgetSettings.minPreparednessBudget) {
                _this.minimumPreparednessBudget = budgetSettings.minPreparednessBudget;
                _this.setTotal('MPA');
            }
            if (budgetSettings && budgetSettings.advPreparednessBudget) {
                _this.advancedPreparednessBudget = budgetSettings.advPreparednessBudget;
                _this.setTotal('APA');
            }
        });
        this.subscriptions.add(subscription);
    };
    BudgetPreparednessComponent.prototype._loadData = function () {
        var _this = this;
        this._getAgencyID().then(function () {
            _this._getCountryID().then(function () {
                _this._getBudgetSettings();
            });
        });
    };
    BudgetPreparednessComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\.\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar) && event.charCode) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    BudgetPreparednessComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return BudgetPreparednessComponent;
}());
BudgetPreparednessComponent = __decorate([
    core_1.Component({
        selector: 'app-budget',
        templateUrl: './budget.component.html',
        styleUrls: ['./budget.component.css']
    })
], BudgetPreparednessComponent);
exports.BudgetPreparednessComponent = BudgetPreparednessComponent;
