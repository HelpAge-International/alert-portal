"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var Constants_1 = require("../utils/Constants");
var rxjs_1 = require("rxjs");
var CustomValidator_1 = require("../utils/CustomValidator");
var agency_service_service_1 = require("../services/agency-service.service");
var LoginComponent = (function () {
    function LoginComponent(af, router, route, agencyService) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.agencyService = agencyService;
        this.loaderInactive = true;
        this.inactive = true;
        this.successInactive = true;
        this.alerts = {};
        this.localUser = {
            userEmail: '',
            password: ''
        };
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (params) {
            if (params["emailEntered"]) {
                _this.successMessage = "FORGOT_PASSWORD.SUCCESS_MESSAGE";
                _this.emailEntered = params["emailEntered"];
                _this.showAlert(false);
                console.log("From Forgot Password");
            }
        });
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.loaderInactive = true;
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.loaderInactive = false;
        this.successInactive = true;
        if (this.validate()) {
            this.af.auth.login({
                email: this.localUser.userEmail,
                password: this.localUser.password
            }, {
                provider: angularfire2_1.AuthProviders.Password,
                method: angularfire2_1.AuthMethods.Password,
            })
                .then(function (success) {
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/system', { preserveSnapshot: true })
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (snapshots) {
                    snapshots.forEach(function (snapshot) {
                        if (snapshot.key == success.uid) {
                            _this.router.navigateByUrl(Constants_1.Constants.SYSTEM_ADMIN_HOME);
                        }
                    });
                    _this.af.database.list(Constants_1.Constants.APP_STATUS + '/administratorAgency', { preserveSnapshot: true })
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function (snapshots) {
                        snapshots.forEach(function (snapshot) {
                            if (snapshot.key == success.uid) {
                                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorAgency/" + snapshot.key + '/firstLogin')
                                    .takeUntil(_this.ngUnsubscribe)
                                    .subscribe(function (value) {
                                    var firstLogin = value.$value;
                                    if (firstLogin) {
                                        _this.router.navigateByUrl('agency-admin/new-agency/new-agency-password');
                                    }
                                    else {
                                        _this.agencyService.getAgencyId(snapshot.key)
                                            .takeUntil(_this.ngUnsubscribe)
                                            .subscribe(function (agencyId) {
                                            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + agencyId + '/isActive')
                                                .takeUntil(_this.ngUnsubscribe)
                                                .subscribe(function (value) {
                                                var isActive = value.$value;
                                                if (isActive) {
                                                    _this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_HOME);
                                                }
                                                else {
                                                    _this.errorMessage = 'Your account is deactivated - Please check with your system administrator'; // TODO - Translate
                                                    _this.showAlert(true);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                        _this.af.database.list(Constants_1.Constants.APP_STATUS + '/administratorCountry', { preserveSnapshot: true })
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (snapshots) {
                            snapshots.forEach(function (snapshot) {
                                if (snapshot.key == success.uid) {
                                    _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + snapshot.key + '/firstLogin')
                                        .takeUntil(_this.ngUnsubscribe)
                                        .subscribe(function (value) {
                                        var firstLogin = value.$value;
                                        if (firstLogin) {
                                            _this.router.navigateByUrl('country-admin/new-country/new-country-password');
                                        }
                                        else {
                                            _this.router.navigateByUrl(Constants_1.Constants.COUNTRY_ADMIN_HOME);
                                        }
                                    });
                                }
                            });
                            _this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryDirector', { preserveSnapshot: true })
                                .takeUntil(_this.ngUnsubscribe)
                                .subscribe(function (snapshots) {
                                snapshots.forEach(function (snapshot) {
                                    if (snapshot.key == success.uid) {
                                        _this.router.navigateByUrl(Constants_1.Constants.COUNTRY_ADMIN_HOME);
                                    }
                                });
                                _this.errorMessage = "LOGIN.UNRECOGNISED_ERROR";
                                _this.showAlert(true);
                            });
                        });
                    });
                });
            })
                .catch(function (error) {
                // error.message can't be used here as they won't be translated. A global message is shown here instead.
                _this.errorMessage = "GLOBAL.GENERAL_ERROR";
                console.log(error.message);
                _this.showAlert(true);
            });
            this.inactive = true;
        }
        else {
            this.showAlert(true);
        }
    };
    LoginComponent.prototype.showAlert = function (error) {
        var _this = this;
        this.loaderInactive = true;
        if (error) {
            this.inactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function () {
                _this.inactive = true;
            });
        }
        else {
            this.successInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function () {
                _this.successInactive = true;
            });
        }
    };
    /**
     * Returns false and specific error messages-
     * if no input is entered,
     * if the email field is empty,
     * if the password field is empty,
     * @returns {boolean}
     */
    LoginComponent.prototype.validate = function () {
        if ((!(this.localUser.userEmail)) && (!(this.localUser.password))) {
            this.alerts[this.localUser.userEmail] = true;
            this.alerts[this.localUser.password] = true;
            this.errorMessage = "LOGIN.NO_DATA_ERROR";
            return false;
        }
        else if (!(this.localUser.userEmail)) {
            this.alerts[this.localUser.userEmail] = true;
            this.errorMessage = "LOGIN.NO_EMAIL_ERROR";
            return false;
        }
        else if (!CustomValidator_1.CustomerValidator.EmailValidator(this.localUser.userEmail)) {
            this.alerts[this.localUser.userEmail] = true;
            this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
            return false;
        }
        else if (!(this.localUser.password)) {
            this.alerts[this.localUser.password] = true;
            this.errorMessage = "LOGIN.NO_PASSWORD_ERROR";
            return false;
        }
        return true;
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css'],
        providers: [agency_service_service_1.AgencyService]
    })
], LoginComponent);
exports.LoginComponent = LoginComponent;
