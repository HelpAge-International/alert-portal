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
var rxjs_1 = require("rxjs");
var DepartmentComponent = (function () {
    function DepartmentComponent(af, router) {
        this.af = af;
        this.router = router;
        this.uid = "";
        this.deleting = false;
        this.editing = false;
        this.saved = false;
        this.departmentName = "";
        this.deleteCandidates = {};
        this.depts = {};
        this.editDepts = {};
        this.alerts = {};
        this.newDepartmentErrorInactive = true;
        this.alertMessage = "Message";
        this.alertSuccess = true;
        this.alertShow = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    DepartmentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + _this.uid + '/departments')
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    _this.depts = _;
                });
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    DepartmentComponent.prototype.ngOnDestroy = function () {
        try {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    DepartmentComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    DepartmentComponent.prototype.deleteDepartments = function (event) {
        this.deleting = !this.deleting;
    };
    DepartmentComponent.prototype.cancelDeleteDepartments = function (event) {
        this.deleting = !this.deleting;
        this.deleteCandidates = {};
    };
    DepartmentComponent.prototype.deleteSelectedDepartments = function (event) {
        var _this = this;
        this.deleting = !this.deleting;
        for (var item in this.deleteCandidates)
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + item)
                .remove()
                .then(function (_) {
                if (!_this.alertShow) {
                    _this.saved = true;
                    _this.alertSuccess = true;
                    _this.alertShow = true;
                    _this.alertMessage = "Departments succesfully removed!";
                }
            })
                .catch(function (err) { return console.log(err, 'You do not have access!'); });
    };
    DepartmentComponent.prototype.onDepartmentSelected = function (department) {
        if (department in this.deleteCandidates)
            delete this.deleteCandidates[department];
        else
            this.deleteCandidates[department] = true;
    };
    DepartmentComponent.prototype.editDepartments = function (event) {
        this.editing = !this.editing;
    };
    DepartmentComponent.prototype.cancelEditDepartments = function (event) {
        var _this = this;
        this.editing = !this.editing;
        this.editDepts = {};
        this.deleteCandidates = {};
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/departments')
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (_) {
            _this.depts = _;
        });
    };
    DepartmentComponent.prototype.saveEditedDepartments = function (event) {
        var _this = this;
        this.editing = !this.editing;
        for (var dept in this.editDepts) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + dept).remove();
            var departments = this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/departments');
            var newDepartment = {};
            newDepartment[this.editDepts[dept]["new_key"]] = this.editDepts[dept]["value"];
            departments
                .update(newDepartment)
                .then(function (_) {
                if (!_this.alertShow) {
                    _this.saved = true;
                    _this.alertSuccess = true;
                    _this.alertShow = true;
                    _this.alertMessage = "Departments succesfully saved!";
                }
            })
                .catch(function (err) { return console.log(err, 'You do not have access!'); });
        }
    };
    DepartmentComponent.prototype.setDepartmentValue = function (prop, value) {
        this.editDepts[prop] = {
            "new_key": value,
            "value": this.depts[prop]
        };
    };
    DepartmentComponent.prototype.addDepartment = function (event) {
        var _this = this;
        if (this.validateNewDepartment()) {
            var departments = this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/departments');
            var newDepartment = {};
            newDepartment[this.departmentName] = false;
            departments
                .update(newDepartment)
                .then(function (_) {
                if (!_this.alertShow) {
                    _this.saved = true;
                    _this.alertSuccess = true;
                    _this.alertShow = true;
                    _this.alertMessage = "New department succesfully created!";
                }
            })
                .catch(function (err) { return console.log(err, 'You do not have access!'); });
            this.departmentName = "";
        }
        else {
            this.showAlert();
        }
    };
    DepartmentComponent.prototype.showAlert = function () {
        var _this = this;
        this.newDepartmentErrorInactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.newDepartmentErrorInactive = true;
        });
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    DepartmentComponent.prototype.validateNewDepartment = function () {
        this.alerts = {};
        if (!(this.departmentName)) {
            this.alerts[this.departmentName] = true;
            this.alertSuccess = false;
            this.alertShow = true;
            this.alertMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_NAME";
            return false;
        }
        return true;
    };
    DepartmentComponent.prototype.onAlertHidden = function (hidden) {
        this.alertShow = !hidden;
        this.alertSuccess = true;
        this.alertMessage = "";
    };
    return DepartmentComponent;
}());
DepartmentComponent = __decorate([
    core_1.Component({
        selector: 'app-department',
        templateUrl: './department.component.html',
        styleUrls: ['./department.component.css']
    })
], DepartmentComponent);
exports.DepartmentComponent = DepartmentComponent;
