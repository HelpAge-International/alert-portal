"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var rxjs_1 = require("rxjs");
var AgencyMpaComponent = (function () {
    function AgencyMpaComponent(af, router) {
        this.af = af;
        this.router = router;
        this.isFiltered = false;
        this.ActionLevel = Enums_1.ActionLevel;
        this.departments = [];
        this.All_Department = "allDepartments"; // <option value="allDepartments">
        this.departmentSelected = this.All_Department;
        this.actionLevelSelected = 0;
        this.ActionPrepLevel = Constants_1.Constants.ACTION_LEVEL;
        this.levelsList = [Enums_1.ActionLevel.ALL, Enums_1.ActionLevel.MPA, Enums_1.ActionLevel.APA];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AgencyMpaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.actions = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.uid, {
                    query: {
                        orderByChild: "type",
                        equalTo: Enums_1.ActionType.mandated
                    }
                });
                _this.getDepartments();
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    AgencyMpaComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AgencyMpaComponent.prototype.deleteAction = function (actionKey) {
        this.actionToDelete = actionKey;
        jQuery("#delete-action").modal("show");
    };
    AgencyMpaComponent.prototype.deleteMandatedAction = function () {
        console.log("Delete button pressed");
        var actionPath = Constants_1.Constants.APP_STATUS + '/action/' + this.uid + '/' + this.actionToDelete;
        this.af.database.object(actionPath).remove()
            .then(function (_) {
            console.log("Mandated preparedness action deleted");
            jQuery("#delete-action").modal("hide");
        });
    };
    AgencyMpaComponent.prototype.closeModal = function () {
        jQuery("#delete-action").modal("hide");
    };
    AgencyMpaComponent.prototype.editAction = function (actionKey) {
        this.router.navigate(["/agency-admin/agency-mpa/create-edit-mpa", { id: actionKey }]);
    };
    AgencyMpaComponent.prototype.lookUpGenericActionsPressed = function () {
        this.router.navigate(['agency-admin/agency-mpa/add-generic-action']);
    };
    AgencyMpaComponent.prototype.filter = function () {
        var _this = this;
        console.log("Selected Department ---- " + this.departmentSelected);
        if (this.actionLevelSelected == Enums_1.ActionLevel.ALL && this.departmentSelected == this.All_Department) {
            //no filter. show all
            this.isFiltered = false;
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            });
        }
        else if (this.actionLevelSelected != Enums_1.ActionLevel.ALL && this.departmentSelected == this.All_Department) {
            //filter only with mpa
            this.isFiltered = true;
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var item = list_1[_i];
                    if (item.level == _this.actionLevelSelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
        else if (this.actionLevelSelected == Enums_1.ActionLevel.ALL && this.departmentSelected != this.All_Department) {
            //filter only with apa
            this.isFiltered = true;
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                    var item = list_2[_i];
                    if (item.department == _this.departmentSelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
        else {
            // filter both action level and category
            this.isFiltered = true;
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                    var item = list_3[_i];
                    if (item.level == _this.actionLevelSelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                    var item = list_4[_i];
                    if (item.department == _this.departmentSelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
    };
    AgencyMpaComponent.prototype.getDepartments = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
            .map(function (departmentList) {
            var departments = [];
            departmentList.forEach(function (x) {
                departments.push(x.$key);
            });
            return departments;
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (x) {
            _this.departments = x;
        });
    };
    return AgencyMpaComponent;
}());
AgencyMpaComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-mpa',
        templateUrl: './agency-mpa.component.html',
        styleUrls: ['./agency-mpa.component.css'],
    })
], AgencyMpaComponent);
exports.AgencyMpaComponent = AgencyMpaComponent;
