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
var CountryPermissionSettingsComponent = (function () {
    function CountryPermissionSettingsComponent(_userService, _settingsService, router, route, subscriptions) {
        this._userService = _userService;
        this._settingsService = _settingsService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        // Constants and enums
        this.userTypeConstant = Constants_1.Constants.USER_TYPE;
        this.userTypeSelection = Constants_1.Constants.USER_TYPE_SELECTION.filter(function (x) { return x != Enums_1.UserType.All && x != Enums_1.UserType.NonAlert && x != Enums_1.UserType.GlobalUser; });
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
    }
    CountryPermissionSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            _this._userService.getCountryAdminUser(_this.uid).subscribe(function (countryAdminUser) {
                if (countryAdminUser) {
                    _this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
                    _this.countryId = countryAdminUser.countryId;
                    _this._settingsService.getCountryPermissionSettings(_this.agencyId, _this.countryId).subscribe(function (permissions) {
                        _this.permissionSettings = permissions;
                    });
                }
            });
        });
        this.subscriptions.add(authSubscription);
    };
    CountryPermissionSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryPermissionSettingsComponent.prototype.validateForm = function () {
        this.alertMessage = this.permissionSettings.validate();
        return !this.alertMessage;
    };
    CountryPermissionSettingsComponent.prototype.submit = function () {
        var _this = this;
        this._settingsService.saveCountryPermissionSettings(this.agencyId, this.countryId, this.permissionSettings)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('PERMISSIONS.SAVED_PERMISSIONS', Enums_1.AlertMessageType.Success);
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
    CountryPermissionSettingsComponent.prototype.selectUserType = function (activePermission, action, permissionName, settingName) {
        this.activePermission = action;
        this.activePermissionSetting = Object.assign([], activePermission);
        this.permissionName = permissionName;
        this.settingName = settingName;
        jQuery("#select-user-type").modal("show");
    };
    CountryPermissionSettingsComponent.prototype.saveUserType = function () {
        var firstIndex = this.activePermission[0];
        var secondIndex = this.activePermission[1];
        if (firstIndex && secondIndex) {
            this.permissionSettings[firstIndex][secondIndex] = this.activePermissionSetting;
        }
        else if (firstIndex) {
            this.permissionSettings[firstIndex] = this.activePermissionSetting;
        }
        this.closeModal();
    };
    CountryPermissionSettingsComponent.prototype.closeModal = function () {
        jQuery("#select-user-type").modal("hide");
    };
    CountryPermissionSettingsComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/dashboard');
    };
    return CountryPermissionSettingsComponent;
}());
CountryPermissionSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-country-permission-settings',
        templateUrl: './country-permission-settings.component.html',
        styleUrls: ['./country-permission-settings.component.css']
    })
], CountryPermissionSettingsComponent);
exports.CountryPermissionSettingsComponent = CountryPermissionSettingsComponent;
