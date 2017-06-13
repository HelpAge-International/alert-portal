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
var rxjs_1 = require("rxjs");
var Enums_1 = require("../../utils/Enums");
var actions_service_1 = require("../../services/actions.service");
var CountryAdminHeaderComponent = (function () {
    function CountryAdminHeaderComponent(af, router, alertService, userService) {
        this.af = af;
        this.router = router;
        this.alertService = alertService;
        this.userService = userService;
        this.firstName = "";
        this.lastName = "";
        this.Countries = Enums_1.Countries;
        this.ngUnsubscribe = new rxjs_1.Subject();
        this.isAnonym = false;
    }
    CountryAdminHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.subscribe(function (user) {
            _this.isAnonym = user.anonymous ? user.anonymous : false;
            if (user) {
                console.log(user);
                if (!user.anonymous) {
                    _this.uid = user.auth.uid;
                    _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid)
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function (user) {
                        _this.firstName = user.firstName;
                        _this.lastName = user.lastName;
                    });
                    _this.userService.getUserType(_this.uid)
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function (userType) {
                        if (userType == Enums_1.UserType.CountryAdmin) {
                            _this.USER_TYPE = 'administratorCountry';
                        }
                        //after user type check, start to do the job
                        if (_this.USER_TYPE) {
                            _this.getCountryId().then(function () {
                                _this.getAgencyID().then(function () {
                                    _this.getCountryData();
                                    _this.checkAlerts();
                                });
                            });
                        }
                    });
                }
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    CountryAdminHeaderComponent.prototype.checkAlerts = function () {
        var _this = this;
        this.alertService.getAlerts(this.countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (alerts) {
            alerts.forEach(function (alert) {
                if (alert.alertLevel == Enums_1.AlertLevels.Red && alert.approvalStatus == Enums_1.AlertStatus.Approved) {
                    _this.isRed = true;
                }
                if (alert.alertLevel == Enums_1.AlertLevels.Amber && alert.approvalStatus == Enums_1.AlertStatus.Approved) {
                    _this.isAmber = true;
                }
            });
            if (_this.isRed) {
                _this.alertLevel = Enums_1.AlertLevels.Red;
                _this.alertTitle = "ALERT.RED_ALERT_LEVEL";
            }
            else if (_this.isAmber) {
                _this.alertLevel = Enums_1.AlertLevels.Amber;
                _this.alertTitle = "ALERT.AMBER_ALERT_LEVEL";
            }
            else {
                _this.alertLevel = Enums_1.AlertLevels.Green;
                _this.alertTitle = "ALERT.GREEN_ALERT_LEVEL";
            }
        });
    };
    CountryAdminHeaderComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    CountryAdminHeaderComponent.prototype.logout = function () {
        console.log("logout");
        this.af.auth.logout();
    };
    /**
     * Private functions
     */
    CountryAdminHeaderComponent.prototype.getCountryId = function () {
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
    CountryAdminHeaderComponent.prototype.getAgencyID = function () {
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
    CountryAdminHeaderComponent.prototype.getCountryData = function () {
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
    return CountryAdminHeaderComponent;
}());
CountryAdminHeaderComponent = __decorate([
    core_1.Component({
        selector: 'app-country-admin-header',
        templateUrl: './country-admin-header.component.html',
        styleUrls: ['./country-admin-header.component.css'],
        providers: [actions_service_1.ActionsService]
    })
], CountryAdminHeaderComponent);
exports.CountryAdminHeaderComponent = CountryAdminHeaderComponent;
