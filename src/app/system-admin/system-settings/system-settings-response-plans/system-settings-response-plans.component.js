"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Constants_1 = require("../../../utils/Constants");
var SystemSettingsResponsePlansComponent = (function () {
    function SystemSettingsResponsePlansComponent(af, router) {
        this.af = af;
        this.router = router;
        this.alerts = {};
        this.errorInactive = true;
        this.successInactive = true;
        this.isEditing = false;
        this.editedGroups = [];
        this.groupsToShow = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    SystemSettingsResponsePlansComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.groups = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/system/" + _this.uid + '/groups');
                _this.storeGroups();
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    SystemSettingsResponsePlansComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    SystemSettingsResponsePlansComponent.prototype.addGroup = function () {
        var _this = this;
        if (this.validateNewGroup() && this.newGroup) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + this.uid + "/groups" + '/' + this.newGroup).set(true).then(function (_) {
                console.log('New group added');
                _this.newGroup = '';
                _this.successMessage = "SYSTEM_ADMIN.SETTING.SUCCESS_ADD_GROUP";
                _this.showAlert(false);
            });
            this.storeGroups();
        }
        else {
            this.showAlert(true);
        }
    };
    SystemSettingsResponsePlansComponent.prototype.editGroups = function (event) {
        this.isEditing = true;
        console.log("isEditing : " + this.isEditing);
    };
    SystemSettingsResponsePlansComponent.prototype.setGroupValue = function (prop, value) {
        this.editedGroups[prop] = {
            "new_key": value,
            "value": true
        };
    };
    SystemSettingsResponsePlansComponent.prototype.cancelEditGroups = function (event) {
        this.isEditing = false;
        this.editedGroups = {};
    };
    SystemSettingsResponsePlansComponent.prototype.saveEditedGroups = function (event) {
        var _this = this;
        if (this.validateEditedGroups()) {
            for (var group in this.editedGroups) {
                this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + this.uid + '/groups/' + group).remove();
                var groups = this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + this.uid + '/groups');
                var newGroup = {};
                newGroup[this.editedGroups[group]["new_key"]] = this.editedGroups[group]["value"];
                groups.update(newGroup).then(function (_) {
                    console.log("Editing successful");
                }).catch(function (error) {
                    _this.errorMessage = "GLOBAL.GENERAL_ERROR";
                    _this.showAlert(true);
                    console.log("Editing unsuccessful");
                });
            }
            this.isEditing = false;
        }
        else {
            this.showAlert(true);
        }
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
    SystemSettingsResponsePlansComponent.prototype.showAlert = function (error) {
        var _this = this;
        if (error) {
            this.errorInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.errorInactive = true;
            });
        }
        else {
            this.successInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.successInactive = true;
            });
        }
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    SystemSettingsResponsePlansComponent.prototype.validateEditedGroups = function () {
        for (var group in this.editedGroups) {
            if (!(this.editedGroups[group]["new_key"])) {
                this.errorMessage = "SYSTEM_ADMIN.SETTING.ERROR_NO_EDIT_GROUP_NAME";
                return false;
            }
        }
        return true;
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    SystemSettingsResponsePlansComponent.prototype.validateNewGroup = function () {
        var _this = this;
        if (!(this.newGroup)) {
            this.alerts[this.newGroup] = true;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.alerts[_this.newGroup] = false;
            });
            this.errorMessage = "SYSTEM_ADMIN.SETTING.ERROR_NO_GROUP_NAME";
            return false;
        }
        return true;
    };
    return SystemSettingsResponsePlansComponent;
}());
SystemSettingsResponsePlansComponent = __decorate([
    core_1.Component({
        selector: 'app-system-settings-response-plans',
        templateUrl: './system-settings-response-plans.component.html',
        styleUrls: ['./system-settings-response-plans.component.css']
    })
], SystemSettingsResponsePlansComponent);
exports.SystemSettingsResponsePlansComponent = SystemSettingsResponsePlansComponent;
