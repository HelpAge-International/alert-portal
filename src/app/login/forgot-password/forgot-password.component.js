"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var rxjs_1 = require("rxjs");
var Constants_1 = require("../../utils/Constants");
var CustomValidator_1 = require("../../utils/CustomValidator");
var ForgotPasswordComponent = (function () {
    function ForgotPasswordComponent(fa, router) {
        this.router = router;
        this.inactive = true;
        this.alerts = {};
        this.email = '';
        this.ngUnsubscribe = new rxjs_1.Subject();
        this.auth = fa.auth();
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
    };
    ForgotPasswordComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    ForgotPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            this.auth.sendPasswordResetEmail(this.email)
                .then(function (success) {
                console.log("Password reset email sent");
                _this.router.navigate(['/login', { emailEntered: _this.email }]);
            })
                .catch(function (err) {
                _this.errorMessage = "GLOBAL.GENERAL_ERROR";
                _this.showAlert();
            });
            this.inactive = true;
        }
        else {
            this.showAlert();
        }
    };
    ForgotPasswordComponent.prototype.showAlert = function () {
        var _this = this;
        this.inactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.inactive = true;
        });
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    ForgotPasswordComponent.prototype.validate = function () {
        if (!(this.email)) {
            this.alerts[this.email] = true;
            this.errorMessage = "FORGOT_PASSWORD.NO_EMAIL_ERROR";
            return false;
        }
        else if (!CustomValidator_1.CustomerValidator.EmailValidator(this.email)) {
            this.alerts[this.email] = true;
            this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
            return false;
        }
        return true;
    };
    return ForgotPasswordComponent;
}());
ForgotPasswordComponent = __decorate([
    core_1.Component({
        selector: 'app-forgot-password',
        templateUrl: './forgot-password.component.html',
        styleUrls: ['./forgot-password.component.css']
    }),
    __param(0, core_1.Inject(angularfire2_1.FirebaseApp))
], ForgotPasswordComponent);
exports.ForgotPasswordComponent = ForgotPasswordComponent;
