"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var RxHelper_1 = require("../../utils/RxHelper");
var AgencyMpaComponent = (function () {
    function AgencyMpaComponent(af, router, dialogService) {
        this.af = af;
        this.router = router;
        this.dialogService = dialogService;
        this.Department = Enums_1.Department;
        this.ActionLevel = Enums_1.ActionLevel;
        this.departments = Enums_1.Department;
        this.actionLevels = Enums_1.ActionLevel;
        this.subscriptions = new RxHelper_1.RxHelper();
    }
    AgencyMpaComponent.prototype.keys = function () {
        var keys = Object.keys(this.departments);
        return keys.slice(keys.length / 2);
    };
    AgencyMpaComponent.prototype.actionLevelsKeys = function () {
        var keys = Object.keys(this.actionLevels);
        return keys.slice(keys.length / 2);
    };
    AgencyMpaComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.actions = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.uid, {
                    query: {
                        orderByChild: "type",
                        equalTo: 1
                    }
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
        this.subscriptions.add(subscription);
    };
    AgencyMpaComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    AgencyMpaComponent.prototype.checkActionLevelFilter = function () {
        console.log("Action level selected - " + this.actionLevelSelected);
    };
    AgencyMpaComponent.prototype.checkDepartmentFilter = function () {
        console.log("Department selected - " + this.departmentSelected);
    };
    AgencyMpaComponent.prototype.deleteAction = function (actionKey) {
        var _this = this;
        var subscription = this.dialogService.createDialog('DELETE_ACTION_DIALOG.TITLE', 'DELETE_ACTION_DIALOG.CONTENT').subscribe(function (result) {
            if (result) {
                console.log("Delete button pressed");
                var actionPath = Constants_1.Constants.APP_STATUS + '/action/' + _this.uid + '/' + actionKey;
                console.log(actionPath);
                _this.af.database.object(actionPath).remove()
                    .then(function (_) {
                    return console.log("MPA deleted");
                });
            }
        });
        this.subscriptions.add(subscription);
    };
    AgencyMpaComponent.prototype.editAction = function (actionKey) {
        console.log("Navigate to edit");
        this.router.navigate(["/agency-admin/agency-mpa/create-edit-mpa", { id: actionKey }]);
    };
    AgencyMpaComponent = __decorate([
        core_1.Component({
            selector: 'app-agency-mpa',
            templateUrl: './agency-mpa.component.html',
            styleUrls: ['./agency-mpa.component.css'],
        })
    ], AgencyMpaComponent);
    return AgencyMpaComponent;
}());
exports.AgencyMpaComponent = AgencyMpaComponent;
