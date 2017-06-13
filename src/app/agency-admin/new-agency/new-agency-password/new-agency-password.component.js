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
var NewAgencyPasswordComponent = (function () {
    function NewAgencyPasswordComponent(af, router) {
        this.af = af;
        this.router = router;
        this.successInactive = true;
        this.successMessage = "GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD";
        this.errorInactive = true;
        this.alerts = {};
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    NewAgencyPasswordComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.authState = auth;
                _this.uid = auth.uid;
                console.log('New agency admin uid: ' + _this.uid);
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (user) {
                    _this.agencyAdminName = user.firstName;
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    NewAgencyPasswordComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    NewAgencyPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            this.authState.auth.updatePassword(this.passwordEntered).then(function () {
                _this.successInactive = false;
                rxjs_1.Observable.timer(Constants_1.Constants.ALERT_REDIRECT_DURATION)
                    .takeUntil(_this.ngUnsubscribe).subscribe(function () {
                    _this.successInactive = true;
                    _this.router.navigateByUrl('/agency-admin/new-agency/new-agency-details');
                });
            }, function (error) {
                console.log(error.message);
            });
        }
        else {
            this.showAlert();
        }
    };
    NewAgencyPasswordComponent.prototype.showAlert = function () {
        var _this = this;
        this.errorInactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.errorInactive = true;
        });
    };
    /**
     * Returns false and specific error messages
     * @returns {boolean}
     */
    NewAgencyPasswordComponent.prototype.validate = function () {
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
    return NewAgencyPasswordComponent;
}());
NewAgencyPasswordComponent = __decorate([
    core_1.Component({
        selector: 'app-new-agency-password',
        templateUrl: './new-agency-password.component.html',
        styleUrls: ['./new-agency-password.component.css']
    })
], NewAgencyPasswordComponent);
exports.NewAgencyPasswordComponent = NewAgencyPasswordComponent;
