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
var Enums_1 = require("../../../utils/Enums");
var alert_message_model_1 = require("../../../model/alert-message.model");
var display_error_1 = require("../../../errors/display.error");
var CountryModulesSettingsComponent = (function () {
    function CountryModulesSettingsComponent(_userService, _settingsService, router, route, subscriptions) {
        this._userService = _userService;
        this._settingsService = _settingsService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        // Constants and enums
        this.moduleName = Constants_1.Constants.MODULE_NAME;
        this.privacyOptions = Enums_1.Privacy;
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
    }
    CountryModulesSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            _this._userService.getCountryAdminUser(_this.uid).subscribe(function (countryAdminUser) {
                if (countryAdminUser) {
                    _this.countryId = countryAdminUser.countryId;
                    _this._settingsService.getCountryModulesSettings(_this.countryId).subscribe(function (modules) {
                        _this.moduleSettings = modules;
                    });
                }
            });
        });
        this.subscriptions.add(authSubscription);
    };
    CountryModulesSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryModulesSettingsComponent.prototype.setModulePrivacy = function (module, value) {
        module.privacy = value;
    };
    CountryModulesSettingsComponent.prototype.validateForm = function () {
        var _this = this;
        this.moduleSettings.forEach(function (module) {
            _this.alertMessage = module.validate();
        });
        return !this.alertMessage;
    };
    CountryModulesSettingsComponent.prototype.submit = function () {
        var _this = this;
        this._settingsService.saveCountryModuleSettings(this.countryId, this.moduleSettings)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.MODULES.SAVED_SUCCESS', Enums_1.AlertMessageType.Success);
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
    CountryModulesSettingsComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/dashboard');
    };
    return CountryModulesSettingsComponent;
}());
CountryModulesSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-country-modules-settings',
        templateUrl: './country-modules-settings.component.html',
        styleUrls: ['./country-modules-settings.component.css']
    })
], CountryModulesSettingsComponent);
exports.CountryModulesSettingsComponent = CountryModulesSettingsComponent;
