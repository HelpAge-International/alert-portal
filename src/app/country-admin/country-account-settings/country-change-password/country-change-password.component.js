"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var alert_message_model_1 = require("../../../model/alert-message.model");
var Enums_1 = require("../../../utils/Enums");
var change_password_model_1 = require("../../../model/change-password.model");
var display_error_1 = require("../../../errors/display.error");
var CountryChangePasswordComponent = (function () {
    function CountryChangePasswordComponent(_userService, router, route, subscriptions) {
        this._userService = _userService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.changePassword = new change_password_model_1.ChangePasswordModel();
    }
    CountryChangePasswordComponent.prototype.ngOnInit = function () { };
    CountryChangePasswordComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryChangePasswordComponent.prototype.submit = function () {
        var _this = this;
        this._userService.getAuthUser().subscribe(function (user) {
            var changePasswordSubscription = _this._userService.changePassword(user.email, _this.changePassword)
                .then(function () {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD', Enums_1.AlertMessageType.Success);
                _this.changePassword = new change_password_model_1.ChangePasswordModel();
            })
                .catch(function (err) {
                if (err instanceof display_error_1.DisplayError) {
                    _this.alertMessage = new alert_message_model_1.AlertMessageModel(err.message);
                }
                else {
                    _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR');
                }
            });
        }).unsubscribe(); // prevent calling the changePassword() twice
    };
    CountryChangePasswordComponent.prototype.validateForm = function () {
        this.alertMessage = this.changePassword.validate();
        return !this.alertMessage;
    };
    CountryChangePasswordComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/dashboard');
    };
    return CountryChangePasswordComponent;
}());
CountryChangePasswordComponent = __decorate([
    core_1.Component({
        selector: 'app-country-change-password',
        templateUrl: './country-change-password.component.html',
        styleUrls: ['./country-change-password.component.css']
    })
], CountryChangePasswordComponent);
exports.CountryChangePasswordComponent = CountryChangePasswordComponent;
