"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Enums_1 = require("../../../utils/Enums");
var Constants_1 = require("../../../utils/Constants");
var rxjs_1 = require("rxjs");
var NotificationComponent = (function () {
    function NotificationComponent(af, router, translate) {
        this.af = af;
        this.router = router;
        this.translate = translate;
        this.agencyNotificationSettings = [];
        this.notificationSettings = Constants_1.Constants.NOTIFICATION_SETTINGS;
        this.notificationSettingsList = [
            Enums_1.NotificationSettingEvents.AlertLevelChanged,
            Enums_1.NotificationSettingEvents.RedAlertRequest,
            Enums_1.NotificationSettingEvents.UpdateHazard,
            Enums_1.NotificationSettingEvents.ActionExpired,
            Enums_1.NotificationSettingEvents.PlanExpired,
            Enums_1.NotificationSettingEvents.PlanRejected
        ];
        this.userTypes = Constants_1.Constants.USER_TYPE;
        this.userTypesList = [
            Enums_1.UserType.All,
            Enums_1.UserType.GlobalDirector,
            Enums_1.UserType.RegionalDirector,
            Enums_1.UserType.CountryDirector,
            Enums_1.UserType.ErtLeader,
            Enums_1.UserType.Ert,
            Enums_1.UserType.Donor,
            Enums_1.UserType.GlobalUser,
            Enums_1.UserType.CountryAdmin
        ];
        this.userNotified = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    NotificationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.loadAgencyData(_this.uid);
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    NotificationComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    NotificationComponent.prototype.selectUserType = function (settingID) {
        this.notificationID = settingID;
        this.loadAgencyData(this.uid);
        jQuery("#select-user-type").modal("show");
    };
    NotificationComponent.prototype.checkType = function (typeKey, event) {
        if (!typeKey) {
            var elements = this.agencyNotificationSettings[this.notificationID].usersNotified;
            for (var element in elements) {
                this.agencyNotificationSettings[this.notificationID].usersNotified[element] = event;
            }
        }
        else {
            this.agencyNotificationSettings[this.notificationID].usersNotified[0] = false;
            this.agencyNotificationSettings[this.notificationID].usersNotified[typeKey] = event;
        }
        return true;
    };
    NotificationComponent.prototype.saveNotificationSettings = function () {
        var _this = this;
        var checkedTypes = this.agencyNotificationSettings[this.notificationID].usersNotified;
        var dataToSend = [];
        checkedTypes.forEach(function (val, key) {
            if (key) {
                dataToSend.push(val);
            }
        });
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/notificationSetting/' + this.notificationID + '/usersNotified')
            .set(dataToSend)
            .then(function () {
            _this.closeModal();
        }).catch(function (error) {
            console.log(error, 'You do not have access!');
        });
    };
    NotificationComponent.prototype.closeModal = function () {
        jQuery("#select-user-type").modal("hide");
    };
    NotificationComponent.prototype.loadAgencyData = function (uid) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (agency) {
            _this.agencyNotificationSettings = agency.notificationSetting;
            _this.notificationSettingsList.forEach(function (item, iItem) {
                var userNotified = _this.agencyNotificationSettings[item].usersNotified;
                var userNotifiedText = [];
                var allEnable = true;
                userNotified.forEach(function (val, iVal) {
                    if (val) {
                        userNotifiedText.push(_this.translate.instant(_this.userTypes[iVal + 1]));
                    }
                    else {
                        allEnable = false;
                    }
                });
                _this.agencyNotificationSettings[item].usersNotified.unshift(allEnable);
                _this.userNotified[iItem] = userNotifiedText;
            });
        });
    };
    NotificationComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return NotificationComponent;
}());
NotificationComponent = __decorate([
    core_1.Component({
        selector: 'app-notification',
        templateUrl: './notification.component.html',
        styleUrls: ['./notification.component.css']
    })
], NotificationComponent);
exports.NotificationComponent = NotificationComponent;
