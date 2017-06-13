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
var CountryNotificationSettingsComponent = (function () {
    function CountryNotificationSettingsComponent(_userService, _settingsService, _messageService, router, route, subscriptions) {
        this._userService = _userService;
        this._settingsService = _settingsService;
        this._messageService = _messageService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        // Constants and enums
        this.NOTIFICATION_SETTINGS = Enums_1.NotificationSettingEvents;
        this.NOTIFICATION_SETTINGS_SELECTION = Constants_1.Constants.NOTIFICATION_SETTINGS;
        this.USER_TYPE = Constants_1.Constants.USER_TYPE;
        this.USER_TYPE_SELECTION = Constants_1.Constants.USER_TYPE_SELECTION.filter(function (x) { return x != Enums_1.UserType.All && x != Enums_1.UserType.NonAlert && x != Enums_1.UserType.GlobalUser; });
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
    }
    CountryNotificationSettingsComponent.prototype.ngOnInit = function () {
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
                    _this._settingsService.getCountryNotificationSettings(_this.agencyId, _this.countryId).subscribe(function (notificationSettings) {
                        _this.notificationSettings = notificationSettings;
                    });
                    _this._messageService.getCountryExternalRecipients(_this.countryId).subscribe(function (externalRecipients) {
                        _this.externalRecipients = externalRecipients;
                    });
                }
            });
        });
        this.subscriptions.add(authSubscription);
    };
    CountryNotificationSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryNotificationSettingsComponent.prototype.validateForm = function () {
        var _this = this;
        this.notificationSettings.forEach(function (notification) {
            _this.alertMessage = notification.validate();
            if (_this.alertMessage) {
                return;
            }
        });
        return !this.alertMessage;
    };
    CountryNotificationSettingsComponent.prototype.submit = function () {
        var _this = this;
        this._settingsService.saveCountryNotificationSettings(this.agencyId, this.countryId, this.notificationSettings)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.SAVED_SUCCESS', Enums_1.AlertMessageType.Success);
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
    CountryNotificationSettingsComponent.prototype.selectUserType = function (activeNotification, action, notificationName) {
        this.activeNotification = action;
        this.activeNotificationSetting = activeNotification;
        //this.activeNotificationSetting.mapFromObject(activeNotification);
        this.notificationName = notificationName;
        jQuery("#select-user-type").modal("show");
    };
    CountryNotificationSettingsComponent.prototype.saveUserType = function () {
        var _this = this;
        this.notificationSettings.forEach(function (notification) {
            if (notification == _this.activeNotification) {
                console.log(notification);
                notification = _this.activeNotificationSetting;
            }
        });
        //this.notificationSettings.pop();
        this.closeModal();
    };
    CountryNotificationSettingsComponent.prototype.closeModal = function () {
        jQuery("#select-user-type").modal("hide");
    };
    CountryNotificationSettingsComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/dashboard');
    };
    CountryNotificationSettingsComponent.prototype.addRecipient = function () {
        this.router.navigateByUrl('/country-admin/settings/country-notification-settings/country-add-external-recipient');
    };
    CountryNotificationSettingsComponent.prototype.editRecipient = function (recipientId) {
        this.router.navigate(['/country-admin/settings/country-notification-settings/country-add-external-recipient', {
                id: recipientId
            }], { skipLocationChange: true });
    };
    return CountryNotificationSettingsComponent;
}());
CountryNotificationSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-country-notification-settings',
        templateUrl: './country-notification-settings.component.html',
        styleUrls: ['./country-notification-settings.component.css']
    })
], CountryNotificationSettingsComponent);
exports.CountryNotificationSettingsComponent = CountryNotificationSettingsComponent;
