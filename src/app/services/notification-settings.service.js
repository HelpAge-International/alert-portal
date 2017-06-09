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
var NotificationSettingsService = (function () {
    function NotificationSettingsService(af, subscriptions) {
        this.af = af;
        this.subscriptions = subscriptions;
    }
    NotificationSettingsService.prototype.getNotificationSettings = function (agencyId) {
        var notificationSettingsSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + agencyId + '/notificationSetting')
            .map(function (items) {
            var notificationSettings = [];
            items.forEach(function (item) { notificationSettings[item.$key] = false; });
            return notificationSettings;
        });
        return notificationSettingsSubscription;
    };
    return NotificationSettingsService;
}());
NotificationSettingsService = __decorate([
    core_1.Injectable()
], NotificationSettingsService);
exports.NotificationSettingsService = NotificationSettingsService;
