"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../../utils/Constants");
var rxjs_1 = require("rxjs");
var CustomValidator_1 = require("../../../utils/CustomValidator");
var NewCountryPasswordComponent = (function () {
    function NewCountryPasswordComponent(af, router, subscriptions) {
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.successInactive = true;
        this.successMessage = "GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD";
        this.errorInactive = true;
        this.alerts = {};
    }
    NewCountryPasswordComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.authState = auth;
                _this.uid = auth.uid;
                var subscription_1 = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid).subscribe(function (user) {
                    _this.countryAdminName = user.firstName;
                });
                _this.subscriptions.add(subscription_1);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
        this.subscriptions.add(subscription);
    };
    NewCountryPasswordComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    NewCountryPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            this.authState.auth.updatePassword(this.passwordEntered).then(function () {
                _this.successInactive = false;
                var subscription = rxjs_1.Observable.timer(1500).subscribe(function () {
                    _this.successInactive = true;
                    _this.router.navigateByUrl('/country-admin/new-country/new-country-details');
                });
                _this.subscriptions.add(subscription);
            }, function (error) {
                _this.router.navigateByUrl('/login');
            });
        }
        else {
            this.showAlert();
        }
    };
    NewCountryPasswordComponent.prototype.showAlert = function () {
        var _this = this;
        this.errorInactive = false;
        var subscription = rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION).subscribe(function () {
            _this.errorInactive = true;
        });
        this.subscriptions.add(subscription);
    };
    /**
     * Returns false and specific error messages
     * @returns {boolean}
     */
    NewCountryPasswordComponent.prototype.validate = function () {
        this.alerts = {};
        if (!(this.passwordEntered)) {
            this.alerts[this.passwordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_NEW_PASSWORD';
            return false;
        }
        else if (!(this.confirmPasswordEntered)) {
            this.alerts[this.confirmPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_CONFIRM_PASSWORD';
            return false;
        }
        else if (!CustomValidator_1.CustomerValidator.PasswordValidator(this.passwordEntered)) {
            this.alerts[this.passwordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.INVALID_PASSWORD';
            return false;
        }
        else if (this.passwordEntered != this.confirmPasswordEntered) {
            this.alerts[this.passwordEntered] = true;
            this.alerts[this.confirmPasswordEntered] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.UNMATCHED_PASSWORD';
            return false;
        }
        return true;
    };
    return NewCountryPasswordComponent;
}());
NewCountryPasswordComponent = __decorate([
    core_1.Component({
        selector: 'app-new-country-password',
        templateUrl: './new-country-password.component.html',
        styleUrls: ['./new-country-password.component.css']
    })
], NewCountryPasswordComponent);
exports.NewCountryPasswordComponent = NewCountryPasswordComponent;
