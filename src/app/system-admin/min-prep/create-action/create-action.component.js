"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var chsMinPreparednessAction_1 = require("../../../model/chsMinPreparednessAction");
var Constants_1 = require("../../../utils/Constants");
var Enums_1 = require("../../../utils/Enums");
var rxjs_1 = require("rxjs");
var CreateActionComponent = (function () {
    function CreateActionComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.inactive = true;
        this.alerts = {};
        this.pageTitle = 'SYSTEM_ADMIN.ACTIONS.CREATE_NEW_ACTION';
        this.buttonText = 'SYSTEM_ADMIN.ACTIONS.SAVE_BUTTON_TEXT';
        this.forEditing = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateActionComponent.prototype.ngOnInit = function () {
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
                _this.pageTitle = 'SYSTEM_ADMIN.ACTIONS.EDIT_CHS_ACTION';
                _this.buttonText = 'SYSTEM_ADMIN.ACTIONS.EDIT_BUTTON_TEXT';
                _this.loadCHSActionInfo(params["id"]);
                _this.idOfChsActionToEdit = params["id"];
            }
        });
    };
    CreateActionComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    CreateActionComponent.prototype.onSubmit = function () {
        if (this.validate()) {
            if (this.forEditing) {
                this.editChsAction();
            }
            else {
                this.addNewChsAction();
                this.inactive = true;
            }
        }
        else {
            this.showAlert();
        }
    };
    CreateActionComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    CreateActionComponent.prototype.loadCHSActionInfo = function (actionId) {
        var _this = this;
        this.af.database.object(this.path + '/' + actionId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (action) {
            _this.textArea = action.task;
        });
    };
    CreateActionComponent.prototype.addNewChsAction = function () {
        var _this = this;
        var currentDateTime = new Date().getTime();
        var newAction = new chsMinPreparednessAction_1.ChsMinPreparednessAction();
        newAction.task = this.textArea;
        newAction.type = Enums_1.ActionType.chs;
        newAction.createdAt = currentDateTime;
        this.af.database.list(this.path).push(newAction)
            .then(function (_) {
            console.log('New CHS action added');
            _this.router.navigateByUrl("/system-admin/min-prep");
        });
    };
    CreateActionComponent.prototype.editChsAction = function () {
        var _this = this;
        var editedAction = new chsMinPreparednessAction_1.ChsMinPreparednessAction();
        editedAction.task = this.textArea;
        editedAction.type = Enums_1.ActionType.chs;
        this.af.database.object(this.path + "/" + this.idOfChsActionToEdit).update(editedAction).then(function (_) {
            console.log('CHS action updated');
            _this.router.navigateByUrl("/system-admin/min-prep");
        });
    };
    CreateActionComponent.prototype.showAlert = function () {
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
     * @returns {boolean}
     */
    CreateActionComponent.prototype.validate = function () {
        if (!(this.textArea)) {
            this.alerts[this.textArea] = true;
            this.errorMessage = "SYSTEM_ADMIN.ACTIONS.NO_CONTENT_ERROR";
            return false;
        }
        return true;
    };
    return CreateActionComponent;
}());
CreateActionComponent = __decorate([
    core_1.Component({
        selector: 'app-create-action',
        templateUrl: './create-action.component.html',
        styleUrls: ['./create-action.component.css']
    })
], CreateActionComponent);
exports.CreateActionComponent = CreateActionComponent;
