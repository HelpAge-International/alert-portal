"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var alert_message_model_1 = require("../../model/alert-message.model");
var Enums_1 = require("../../utils/Enums");
var Constants_1 = require("../../utils/Constants");
var display_error_1 = require("../../errors/display.error");
var CountryAccountSettingsComponent = (function () {
    function CountryAccountSettingsComponent(_userService, router, route, subscriptions) {
        this._userService = _userService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        // Constants and enums
        this.PERSON_TITLE = Constants_1.Constants.PERSON_TITLE;
        this.PERSON_TITLE_SELECTION = Constants_1.Constants.PERSON_TITLE_SELECTION;
        this.COUNTRY = Constants_1.Constants.COUNTRY;
        this.COUNTRY_SELECTION = Constants_1.Constants.COUNTRY_SELECTION;
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
    }
    CountryAccountSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            _this._userService.getUser(_this.uid).subscribe(function (userPublic) {
                if (userPublic.id) {
                    _this.userPublic = userPublic;
                }
                else {
                    throw new Error('Cannot find user profile');
                }
            });
        });
    };
    CountryAccountSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryAccountSettingsComponent.prototype.validateForm = function () {
        var excludedFields = ["phone", "city"];
        this.alertMessage = this.userPublic.validate(excludedFields);
        return !this.alertMessage;
    };
    CountryAccountSettingsComponent.prototype.submit = function () {
        var _this = this;
        this._userService.saveUserPublic(this.userPublic)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE', Enums_1.AlertMessageType.Success);
        })
            .catch(function (err) {
            if (err instanceof display_error_1.DisplayError) {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel(err.message);
            }
            else {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
        });
    };
    CountryAccountSettingsComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/dashboard');
    };
    return CountryAccountSettingsComponent;
}());
CountryAccountSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-country-account-settings',
        templateUrl: './country-account-settings.component.html',
        styleUrls: ['./country-account-settings.component.css']
    })
], CountryAccountSettingsComponent);
exports.CountryAccountSettingsComponent = CountryAccountSettingsComponent;
