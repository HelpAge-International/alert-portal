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
var Constants_1 = require("../../../utils/Constants");
var rxjs_1 = require("rxjs");
var CustomValidator_1 = require("../../../utils/CustomValidator");
var AgencyChangePasswordComponent = (function () {
    function AgencyChangePasswordComponent(af, router) {
        this.af = af;
        this.router = router;
        this.successInactive = true;
        this.successMessage = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD';
        this.errorInactive = true;
        this.alerts = {};
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AgencyChangePasswordComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.authState = auth;
                _this.uid = auth.uid;
                console.log('Agency admin uid: ' + _this.uid);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    AgencyChangePasswordComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AgencyChangePasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            this.af.auth.login({
                email: this.af.auth.getAuth().auth.email,
                password: this.currentPasswordEntered
            }, {
                provider: angularfire2_1.AuthProviders.Password,
                method: angularfire2_1.AuthMethods.Password,
            })
                .then(function () {
                _this.authState.auth.updatePassword(_this.newPasswordEntered).then(function () {
                    _this.currentPasswordEntered = '';
                    _this.newPasswordEntered = '';
                    _this.confirmPasswordEntered = '';
                    _this.showAlert(false);
                }, function (error) {
                    console.log(error.message);
                });
            })
                .catch(function () {
                _this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.INCORRECT_CURRENT_PASSWORD';
                _this.showAlert(true);
            });
        }
        else {
            this.showAlert(true);
        }
    };
    AgencyChangePasswordComponent.prototype.showAlert = function (error) {
        var _this = this;
        if (error) {
            this.errorInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.errorInactive = true;
            });
        }
        else {
            this.successInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.successInactive = true;
            });
        }
    };
    /**
     * Returns false and specific error messages
     * @returns {boolean}
     */
    AgencyChangePasswordComponent.prototype.validate = function () {
        this.alerts = {};
        if (!(this.currentPasswordEntered)) {
            this.alerts[this.currentPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_CURRENT_PASSWORD';
            return false;
        }
        else if (!(this.newPasswordEntered)) {
            this.alerts[this.newPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_NEW_PASSWORD';
            return false;
        }
        else if (!(this.confirmPasswordEntered)) {
            this.alerts[this.confirmPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_CONFIRM_PASSWORD';
            return false;
        }
        else if (this.currentPasswordEntered == this.newPasswordEntered) {
            this.alerts[this.currentPasswordEntered] = true;
            this.alerts[this.newPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.SAME_PASSWORD';
            return false;
        }
        else if (!CustomValidator_1.CustomerValidator.PasswordValidator(this.newPasswordEntered)) {
            this.alerts[this.newPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.INVALID_PASSWORD';
            return false;
        }
        else if (this.newPasswordEntered != this.confirmPasswordEntered) {
            this.alerts[this.newPasswordEntered] = true;
            this.alerts[this.confirmPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.UNMATCHED_PASSWORD';
            return false;
        }
        return true;
    };
    return AgencyChangePasswordComponent;
}());
AgencyChangePasswordComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-change-password',
        templateUrl: './agency-change-password.component.html',
        styleUrls: ['./agency-change-password.component.css']
    })
], AgencyChangePasswordComponent);
exports.AgencyChangePasswordComponent = AgencyChangePasswordComponent;
