"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var mandatedPA_1 = require("../../../model/mandatedPA");
var Constants_1 = require("../../../utils/Constants");
var Enums_1 = require("../../../utils/Enums");
var rxjs_1 = require("rxjs");
var CreateEditMpaComponent = (function () {
    function CreateEditMpaComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.successInactive = true;
        this.successMessage = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
        this.newDepartmentErrorInactive = true;
        this.alerts = {};
        this.inactive = true;
        this.errorMessage = '';
        this.pageTitle = 'AGENCY_ADMIN.MANDATED_PA.CREATE_NEW_MANDATED_PA';
        this.buttonText = 'AGENCY_ADMIN.MANDATED_PA.SAVE_BUTTON_TEXT';
        this.isMpa = true;
        this.forEditing = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateEditMpaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.path = Constants_1.Constants.APP_STATUS + '/action/' + _this.uid;
                _this.departmentsPath = Constants_1.Constants.APP_STATUS + "/agency/" + _this.uid + "/departments";
                console.log("uid: " + auth.uid);
                _this.getDepartments();
            }
            else {
                console.log("Error occurred - User isn't logged in");
                _this.navigateToLogin();
            }
        });
        this.route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (params) {
            if (params["id"]) {
                _this.forEditing = true;
                _this.pageTitle = 'AGENCY_ADMIN.MANDATED_PA.EDIT_MANDATED_PA';
                _this.buttonText = 'AGENCY_ADMIN.MANDATED_PA.EDIT_BUTTON_TEXT';
                _this.loadMandatedPAInfo(params["id"]);
                _this.idOfMpaToEdit = params["id"];
            }
        });
    };
    CreateEditMpaComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    CreateEditMpaComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            if (this.forEditing) {
                this.editMandatedPA();
            }
            else {
                this.addNewMandatedPA();
                this.inactive = true;
            }
        }
        else {
            this.inactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.inactive = true;
            });
        }
    };
    CreateEditMpaComponent.prototype.mpaSelected = function () {
        this.isMpa = true;
    };
    CreateEditMpaComponent.prototype.apaSelected = function () {
        this.isMpa = false;
    };
    CreateEditMpaComponent.prototype.checkSelectedDepartment = function () {
        console.log("Selected Department ---- " + this.departmentSelected);
    };
    CreateEditMpaComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    CreateEditMpaComponent.prototype.loadMandatedPAInfo = function (actionId) {
        var _this = this;
        this.af.database.object(this.path + '/' + actionId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (action) {
            _this.textArea = action.task;
            _this.isMpa = action.level == Enums_1.ActionLevel.MPA ? true : false;
            _this.departmentSelected = action.department;
        });
    };
    CreateEditMpaComponent.prototype.addNewMandatedPA = function () {
        var _this = this;
        var currentDateTime = new Date().getTime();
        var level = this.isMpa ? Enums_1.ActionLevel.MPA : Enums_1.ActionLevel.APA;
        var newAction = new mandatedPA_1.MandatedPreparednessAction();
        newAction.task = this.textArea;
        newAction.type = Enums_1.ActionType.mandated;
        newAction.department = this.departmentSelected;
        newAction.level = level;
        newAction.createdAt = currentDateTime;
        this.af.database.list(this.path).push(newAction)
            .then(function (_) {
            _this.af.database.object(_this.departmentsPath + '/' + _this.departmentSelected).set(true)
                .then(function (_) {
                console.log('Department updated');
                _this.router.navigateByUrl("/agency-admin/agency-mpa");
            });
        });
    };
    CreateEditMpaComponent.prototype.editMandatedPA = function () {
        var _this = this;
        var level = this.isMpa ? Enums_1.ActionLevel.MPA : Enums_1.ActionLevel.APA;
        var editedAction = new mandatedPA_1.MandatedPreparednessAction();
        editedAction.task = this.textArea;
        editedAction.type = Enums_1.ActionType.mandated;
        editedAction.department = this.departmentSelected;
        editedAction.level = level;
        this.af.database.object(this.path + "/" + this.idOfMpaToEdit).update(editedAction).then(function (_) {
            console.log('Mandated action updated');
            _this.router.navigateByUrl("/agency-admin/agency-mpa");
        });
    };
    CreateEditMpaComponent.prototype.addNewDepartment = function () {
        var _this = this;
        if (this.validateNewDepartment()) {
            this.af.database.object(this.departmentsPath + '/' + this.newDepartment).set(false).then(function (_) {
                console.log('New department added');
                jQuery("#add_department").modal("hide");
                _this.departmentSelected = _this.newDepartment;
                _this.newDepartment = '';
                _this.showAlert(false);
            });
        }
        else {
            this.showAlert(true);
        }
    };
    CreateEditMpaComponent.prototype.closeModal = function () {
        this.departmentSelected = '';
        jQuery("#add_department").modal("hide");
    };
    CreateEditMpaComponent.prototype.getDepartments = function () {
        this.departments = this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency/" + this.uid + "/departments/")
            .map(function (list) {
            var tempList = [];
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var item = list_1[_i];
                tempList.push(item.$key);
            }
            return tempList;
        });
    };
    CreateEditMpaComponent.prototype.showAlert = function (error) {
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
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    CreateEditMpaComponent.prototype.validate = function () {
        if (!(this.textArea)) {
            this.alerts[this.textArea] = true;
            this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_CONTENT_ERROR";
            return false;
        }
        else if (!(this.departmentSelected)) {
            this.alerts[this.departmentSelected] = true;
            this.errorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_ERROR";
            return false;
        }
        return true;
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    CreateEditMpaComponent.prototype.validateNewDepartment = function () {
        this.alerts = {};
        if (!(this.newDepartment)) {
            this.alerts[this.newDepartment] = true;
            this.newDepartmentErrorMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_NAME";
            return false;
        }
        return true;
    };
    return CreateEditMpaComponent;
}());
CreateEditMpaComponent = __decorate([
    core_1.Component({
        selector: 'app-create-edit-mpa',
        templateUrl: 'create-edit-mpa.component.html',
        styleUrls: ['create-edit-mpa.component.css']
    })
], CreateEditMpaComponent);
exports.CreateEditMpaComponent = CreateEditMpaComponent;
