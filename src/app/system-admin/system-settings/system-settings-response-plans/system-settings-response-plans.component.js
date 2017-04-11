"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var rxjs_1 = require("rxjs");
var Constants_1 = require("../../../utils/Constants");
var SystemSettingsResponsePlansComponent = (function () {
    function SystemSettingsResponsePlansComponent(af, router, subscriptions) {
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.alerts = {};
        this.errorInactive = true;
        this.successInactive = true;
        this.groupsToShow = [];
    }
    SystemSettingsResponsePlansComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.groups = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/system/" + _this.uid + '/groups');
                _this.storeGroups();
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
        this.subscriptions.add(subscription);
    };
    SystemSettingsResponsePlansComponent.prototype.storeGroups = function () {
        var _this = this;
        this.groups.forEach(function (groupsList) {
            _this.groupsToShow = [];
            groupsList.forEach(function (group) {
                _this.groupsToShow.push(group.$key);
            });
            return _this.groupsToShow;
        });
    };
    SystemSettingsResponsePlansComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    SystemSettingsResponsePlansComponent.prototype.editGroups = function () {
        console.log("groupForEdit ====" + this.groupForEdit);
    };
    SystemSettingsResponsePlansComponent.prototype.addGroup = function () {
        var _this = this;
        if (this.validateNewGroup() && this.newGroup) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + this.uid + "/groups" + '/' + this.newGroup).set(true).then(function (_) {
                console.log('New group added');
                _this.newGroup = '';
                _this.successMessage = "SYSTEM_ADMIN.SETTING.SUCCESS_ADD_GROUP";
                _this.router.navigateByUrl('/system-admin/system-settings/system-settings-response-plans');
                _this.showAlert(false);
            });
            this.storeGroups();
        }
        else {
            this.showAlert(true);
        }
    };
    SystemSettingsResponsePlansComponent.prototype.showAlert = function (error) {
        var _this = this;
        if (error) {
            this.errorInactive = false;
            var subscription = rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION).subscribe(function () {
                _this.errorInactive = true;
            });
            this.subscriptions.add(subscription);
        }
        else {
            this.successInactive = false;
            var subscription = rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION).subscribe(function () {
                _this.successInactive = true;
            });
            this.subscriptions.add(subscription);
        }
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    SystemSettingsResponsePlansComponent.prototype.validateNewGroup = function () {
        if (!(this.newGroup)) {
            this.alerts[this.newGroup] = true;
            this.errorMessage = "SYSTEM_ADMIN.SETTING.ERROR_NO_GROUP_NAME";
            return false;
        }
        return true;
    };
    SystemSettingsResponsePlansComponent = __decorate([
        core_1.Component({
            selector: 'app-system-settings-response-plans',
            templateUrl: './system-settings-response-plans.component.html',
            styleUrls: ['./system-settings-response-plans.component.css']
        })
    ], SystemSettingsResponsePlansComponent);
    return SystemSettingsResponsePlansComponent;
}());
exports.SystemSettingsResponsePlansComponent = SystemSettingsResponsePlansComponent;
