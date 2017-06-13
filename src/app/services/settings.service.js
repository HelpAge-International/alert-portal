"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../utils/Constants");
var permission_settings_model_1 = require("../model/permission-settings.model");
var module_settings_model_1 = require("../model/module-settings.model");
var clock_settings_model_1 = require("../model/clock-settings.model");
var notification_settings_model_1 = require("../model/notification-settings.model");
var SettingsService = (function () {
    function SettingsService(af, subscriptions) {
        this.af = af;
        this.subscriptions = subscriptions;
    }
    // COUNTRY PERMISSIONS
    SettingsService.prototype.getCountryPermissionSettings = function (agencyId, countryId) {
        if (!agencyId || !countryId) {
            return null;
        }
        var permissionSettingsSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/permissionSettings')
            .map(function (items) {
            if (items.$key) {
                var permissions = new permission_settings_model_1.PermissionSettingsModel();
                permissions.mapFromObject(items);
                return permissions;
            }
            return null;
        });
        return permissionSettingsSubscription;
    };
    SettingsService.prototype.saveCountryPermissionSettings = function (agencyId, countryId, permissionSettings) {
        if (!agencyId || !countryId) {
            return null;
        }
        var permissionSettingsData = {};
        permissionSettingsData['/countryOffice/' + agencyId + '/' + countryId + '/permissionSettings'] = permissionSettings;
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(permissionSettingsData);
    };
    // COUNTRY MODULES
    SettingsService.prototype.getCountryModulesSettings = function (countryId) {
        if (!countryId) {
            return null;
        }
        var moduleSettingsSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/module/' + countryId)
            .map(function (items) {
            if (items.$key) {
                var modules_1 = [];
                items.forEach(function (item) {
                    var module = new module_settings_model_1.ModuleSettingsModel();
                    module.mapFromObject(item);
                    modules_1.push(module);
                });
                return modules_1;
            }
            return null;
        });
        return moduleSettingsSubscription;
    };
    SettingsService.prototype.saveCountryModuleSettings = function (countryId, moduleSettings) {
        if (!countryId || !moduleSettings) {
            throw new Error('Country or module value is null');
        }
        var moduleSettingsData = {};
        moduleSettingsData['/module/' + countryId] = moduleSettings;
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(moduleSettingsData);
    };
    // COUNTRY CLOCK SETTINGS
    SettingsService.prototype.getCountryClockSettings = function (agencyId, countryId) {
        if (!agencyId || !countryId) {
            throw new Error("No agencyID or countryID");
        }
        var clockSettingsSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/clockSettings')
            .map(function (items) {
            if (items.$key) {
                var clockSettings = new clock_settings_model_1.ClockSettingsModel();
                clockSettings.mapFromObject(items);
                return clockSettings;
            }
            return null;
        });
        return clockSettingsSubscription;
    };
    SettingsService.prototype.saveCountryClockSettings = function (agencyId, countryId, clockSettings) {
        if (!agencyId || !countryId) {
            return null;
        }
        var clockSettingsData = {};
        clockSettingsData['/countryOffice/' + agencyId + '/' + countryId + '/clockSettings'] = clockSettings;
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(clockSettingsData);
    };
    // COUNTRY NOTIFICATION SETTINGS
    SettingsService.prototype.getCountryNotificationSettings = function (agencyId, countryId) {
        var notificationSettingsSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/defaultNotificationSettings')
            .map(function (items) {
            var notificationSettings = [];
            items.forEach(function (item) {
                var notificationSetting = new notification_settings_model_1.NotificationSettingsModel();
                notificationSetting.mapFromObject(item);
                notificationSettings.push(notificationSetting);
            });
            return notificationSettings;
        });
        return notificationSettingsSubscription;
    };
    SettingsService.prototype.saveCountryNotificationSettings = function (agencyId, countryId, notificationSettings) {
        if (!agencyId || !countryId) {
            return null;
        }
        var notificationsSettingsData = {};
        notificationsSettingsData['/countryOffice/' + agencyId + '/' + countryId + '/defaultNotificationSettings'] = notificationSettings;
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(notificationsSettingsData);
    };
    return SettingsService;
}());
SettingsService = __decorate([
    core_1.Injectable()
], SettingsService);
exports.SettingsService = SettingsService;
