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
var mandatedPA_1 = require("../../../model/mandatedPA");
var rxjs_1 = require("rxjs");
var AddGenericActionComponent = (function () {
    function AddGenericActionComponent(af, router) {
        this.af = af;
        this.router = router;
        this.errorInactive = true;
        this.successInactive = true;
        this.newDepartmentErrorInactive = true;
        this.successMessage = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
        this.alerts = {};
        this.ActionLevel = Enums_1.ActionLevel;
        this.GenericActionCategory = Enums_1.GenericActionCategory;
        this.isFiltered = false;
        this.numOfDepartmentSelected = 0;
        this.actionLevelSelected = 0;
        this.categorySelected = 0;
        this.actionsSelected = {};
        this.Category = Constants_1.Constants.CATEGORY;
        this.ActionPrepLevel = Constants_1.Constants.ACTION_LEVEL;
        this.levelsList = [Enums_1.ActionLevel.ALL, Enums_1.ActionLevel.MPA, Enums_1.ActionLevel.APA];
        this.categoriesList = [
            Enums_1.GenericActionCategory.ALL,
            Enums_1.GenericActionCategory.Category1,
            Enums_1.GenericActionCategory.Category2,
            Enums_1.GenericActionCategory.Category3,
            Enums_1.GenericActionCategory.Category4,
            Enums_1.GenericActionCategory.Category5,
            Enums_1.GenericActionCategory.Category6,
            Enums_1.GenericActionCategory.Category7,
            Enums_1.GenericActionCategory.Category8,
            Enums_1.GenericActionCategory.Category9,
            Enums_1.GenericActionCategory.Category10
        ];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AddGenericActionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.departmentsPath = Constants_1.Constants.APP_STATUS + "/agency/" + _this.uid + "/departments";
                _this.af.database.list(Constants_1.Constants.APP_STATUS + "/administratorAgency/" + _this.uid + '/systemAdmin')
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (systemAdminIds) {
                    _this.systemAdminUid = systemAdminIds[0].$key;
                    _this.genericActions = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.systemAdminUid, {
                        query: {
                            orderByChild: "type",
                            equalTo: Enums_1.ActionType.mandated
                        }
                    });
                    _this.getDepartments();
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    AddGenericActionComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.actionsSelected = {};
    };
    AddGenericActionComponent.prototype.updateSelectedActions = function (genericAction) {
        var notIntheList = this.actionsSelected[genericAction.$key] == null;
        if (notIntheList) {
            var newMandatePA = new mandatedPA_1.MandatedPreparednessAction();
            newMandatePA.task = genericAction.task;
            newMandatePA.type = Enums_1.ActionType.mandated;
            newMandatePA.level = genericAction.level;
            newMandatePA.createdAt = genericAction.createdAt;
            this.actionsSelected[genericAction.$key] = newMandatePA;
        }
        else {
            console.log("Remove from the list");
            delete this.actionsSelected[genericAction.$key];
        }
    };
    AddGenericActionComponent.prototype.setDepartment = function (department, genericAction) {
        if (department != "addNewDepartment") {
            this.actionsSelected[genericAction.$key].department = department;
        }
        else {
            console.log("Add a department selected");
        }
    };
    AddGenericActionComponent.prototype.addSelectedActionsToAgency = function () {
        var _this = this;
        if (this.validate()) {
            var agencyActionsPath = Constants_1.Constants.APP_STATUS + '/action/' + this.uid;
            for (var action in this.actionsSelected) {
                this.af.database.list(agencyActionsPath).push(this.actionsSelected[action])
                    .then(function (_) {
                    console.log('New mandated action added');
                    _this.router.navigateByUrl("/agency-admin/agency-mpa");
                });
            }
        }
        else {
            this.showError();
        }
    };
    AddGenericActionComponent.prototype.addNewDepartment = function () {
        var _this = this;
        if (this.validateNewDepartment()) {
            this.af.database.object(this.departmentsPath + '/' + this.newDepartment).set(false).then(function (_) {
                console.log('New department added');
                jQuery("#add_department").modal("hide");
                _this.showDepartmentAlert(false);
            });
        }
        else {
            this.showDepartmentAlert(true);
        }
    };
    AddGenericActionComponent.prototype.filter = function () {
        var _this = this;
        if (this.actionLevelSelected == Enums_1.GenericActionCategory.ALL && this.categorySelected == Enums_1.GenericActionCategory.ALL) {
            //no filter. show all
            this.isFiltered = false;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            });
        }
        else if (this.actionLevelSelected != Enums_1.GenericActionCategory.ALL && this.categorySelected == Enums_1.GenericActionCategory.ALL) {
            //filter only with mpa
            this.isFiltered = true;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
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
        else if (this.actionLevelSelected == Enums_1.GenericActionCategory.ALL && this.categorySelected != Enums_1.GenericActionCategory.ALL) {
            //filter only with apa
            this.isFiltered = true;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                    var item = list_2[_i];
                    if (item.category == _this.categorySelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
        else {
            // filter both action level and category
            this.isFiltered = true;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
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
                    if (item.category == _this.categorySelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
    };
    AddGenericActionComponent.prototype.getDepartments = function () {
        this.departments = this.af.database.list(this.departmentsPath)
            .map(function (list) {
            var tempList = [];
            for (var _i = 0, list_5 = list; _i < list_5.length; _i++) {
                var item = list_5[_i];
                tempList.push(item.$key);
            }
            return tempList;
        });
    };
    AddGenericActionComponent.prototype.showError = function () {
        var _this = this;
        this.errorInactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.errorInactive = true;
        });
    };
    AddGenericActionComponent.prototype.showDepartmentAlert = function (error) {
        var _this = this;
        if (error) {
            this.newDepartmentErrorInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.newDepartmentErrorInactive = true;
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
    AddGenericActionComponent.prototype.getNumOfSelectedActions = function () {
        var num = 0;
        for (var action in this.actionsSelected) {
            num++;
        }
        return num;
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    AddGenericActionComponent.prototype.validate = function () {
        this.alerts = {};
        if (this.getNumOfSelectedActions() == 0) {
            this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_ACTION_SELECTED";
            return false;
        }
        for (var action in this.actionsSelected) {
            if (this.actionsSelected[action].department == null) {
                this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_ERROR";
                return false;
            }
        }
        return true;
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    AddGenericActionComponent.prototype.validateNewDepartment = function () {
        this.alerts = {};
        if (!(this.newDepartment)) {
            this.alerts[this.newDepartment] = true;
            this.newDepartmentErrorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_NAME";
            return false;
        }
        return true;
    };
    return AddGenericActionComponent;
}());
AddGenericActionComponent = __decorate([
    core_1.Component({
        selector: 'app-add-generic-action',
        templateUrl: './add-generic-action.component.html',
        styleUrls: ['./add-generic-action.component.css']
    })
], AddGenericActionComponent);
exports.AddGenericActionComponent = AddGenericActionComponent;
