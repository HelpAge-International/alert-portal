"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var genericMPAAPA_1 = require("../../../model/genericMPAAPA");
var Constants_1 = require("../../../utils/Constants");
var Enums_1 = require("../../../utils/Enums");
var rxjs_1 = require("rxjs");
var CreateMpaActionComponent = (function () {
    function CreateMpaActionComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.inactive = true;
        this.alerts = {};
        this.pageTitle = 'SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CREATE_NEW_GENERIC_MPA';
        this.buttonText = 'SYSTEM_ADMIN.ACTIONS.SAVE_BUTTON_TEXT';
        this.isMpa = true;
        this.forEditing = false;
        this.Category = Enums_1.GenericActionCategory;
        this.categoriesList = [Enums_1.GenericActionCategory.Category1, Enums_1.GenericActionCategory.Category2, Enums_1.GenericActionCategory.Category3,
            Enums_1.GenericActionCategory.Category4, Enums_1.GenericActionCategory.Category5, Enums_1.GenericActionCategory.Category6, Enums_1.GenericActionCategory.Category7,
            Enums_1.GenericActionCategory.Category8, Enums_1.GenericActionCategory.Category9, Enums_1.GenericActionCategory.Category10];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateMpaActionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.path = Constants_1.Constants.APP_STATUS + "/action/" + auth.uid;
                console.log("uid: " + auth.uid);
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
                _this.pageTitle = 'SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.EDIT_MPA_APA';
                _this.buttonText = 'SYSTEM_ADMIN.ACTIONS.EDIT_BUTTON_TEXT';
                _this.loadGenericActionInfo(params["id"]);
                _this.idOfGenericActionToEdit = params["id"];
            }
        });
    };
    CreateMpaActionComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    CreateMpaActionComponent.prototype.onSubmit = function () {
        if (this.validate()) {
            if (this.forEditing) {
                this.editGenericAction();
            }
            else {
                this.addNewGenericAction();
                this.inactive = true;
            }
        }
        else {
            this.showAlert();
        }
    };
    CreateMpaActionComponent.prototype.mpaSelected = function () {
        this.isMpa = true;
    };
    CreateMpaActionComponent.prototype.apaSelected = function () {
        this.isMpa = false;
    };
    CreateMpaActionComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    CreateMpaActionComponent.prototype.loadGenericActionInfo = function (actionId) {
        var _this = this;
        this.af.database.object(this.path + '/' + actionId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (action) {
            _this.textArea = action.task;
            _this.isMpa = action.level == Enums_1.ActionLevel.MPA ? true : false;
            _this.categorySelected = Enums_1.GenericActionCategory[action.category];
        });
    };
    CreateMpaActionComponent.prototype.addNewGenericAction = function () {
        var _this = this;
        var level = this.isMpa ? Enums_1.ActionLevel.MPA : Enums_1.ActionLevel.APA;
        var currentDateTime = new Date().getTime();
        var newAction = new genericMPAAPA_1.GenericMpaOrApaAction();
        newAction.task = this.textArea;
        newAction.type = Enums_1.ActionType.mandated;
        newAction.level = level;
        newAction.category = Enums_1.GenericActionCategory[this.categorySelected];
        newAction.createdAt = currentDateTime;
        this.af.database.list(this.path).push(newAction)
            .then(function (_) {
            console.log('New Generic action added');
            _this.router.navigateByUrl("/system-admin/mpa");
        });
    };
    CreateMpaActionComponent.prototype.editGenericAction = function () {
        var _this = this;
        var level = this.isMpa ? Enums_1.ActionLevel.MPA : Enums_1.ActionLevel.APA;
        var editedAction = new genericMPAAPA_1.GenericMpaOrApaAction();
        editedAction.task = this.textArea;
        editedAction.type = Enums_1.ActionType.mandated;
        editedAction.level = level;
        editedAction.category = Enums_1.GenericActionCategory[this.categorySelected];
        this.af.database.object(this.path + "/" + this.idOfGenericActionToEdit).update(editedAction).then(function (_) {
            console.log('Generic action updated');
            _this.router.navigateByUrl("/system-admin/mpa");
        });
    };
    CreateMpaActionComponent.prototype.showAlert = function () {
        var _this = this;
        this.inactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.inactive = true;
        });
    };
    /**
     * Returns false and specific error messages-
     * if no input is entered
     * if no category is selected
     * @returns {boolean}
     */
    CreateMpaActionComponent.prototype.validate = function () {
        if (!(this.textArea)) {
            this.alerts[this.textArea] = true;
            this.errorMessage = "SYSTEM_ADMIN.ACTIONS.NO_CONTENT_ERROR";
            return false;
        }
        else if (!(this.categorySelected)) {
            this.alerts[this.categorySelected] = true;
            this.errorMessage = "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.NO_CATEGORY_ERROR";
            return false;
        }
        return true;
    };
    return CreateMpaActionComponent;
}());
CreateMpaActionComponent = __decorate([
    core_1.Component({
        selector: 'app-create-mpa-action',
        templateUrl: './create-mpa-action.component.html',
        styleUrls: ['./create-mpa-action.component.css']
    })
], CreateMpaActionComponent);
exports.CreateMpaActionComponent = CreateMpaActionComponent;
