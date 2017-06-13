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
var MinPrepComponent = (function () {
    function MinPrepComponent(af, router) {
        this.af = af;
        this.router = router;
        this.path = '';
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    MinPrepComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.path = Constants_1.Constants.APP_STATUS + "/action/" + auth.uid;
                _this.chsMinPrepActions = _this.af.database.list(_this.path, {
                    query: {
                        orderByChild: 'type',
                        equalTo: Enums_1.ActionType.chs
                    }
                });
            }
            else {
                // user is not logged in
                console.log("Error occurred - User isn't logged in");
                _this.navigateToLogin();
            }
        });
    };
    MinPrepComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    MinPrepComponent.prototype.editChsMinPrepAction = function (chsMinPrepAction) {
        console.log("Edit button pressed");
        this.router.navigate(['/system-admin/min-prep/create', { id: chsMinPrepAction.$key }]);
    };
    MinPrepComponent.prototype.deleteChsMinPrepAction = function (chsMinPrepAction) {
        this.actionToDelete = chsMinPrepAction;
        jQuery("#delete-action").modal("show");
    };
    MinPrepComponent.prototype.deleteAction = function () {
        console.log("Delete button pressed");
        this.af.database.object(this.path + "/" + this.actionToDelete.$key).remove()
            .then(function (_) {
            console.log("Chs action deleted");
            jQuery("#delete-action").modal("hide");
        });
    };
    MinPrepComponent.prototype.closeModal = function () {
        jQuery("#delete-action").modal("hide");
    };
    MinPrepComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return MinPrepComponent;
}());
MinPrepComponent = __decorate([
    core_1.Component({
        selector: 'app-min-prep',
        templateUrl: './min-prep.component.html',
        styleUrls: ['./min-prep.component.css']
    })
], MinPrepComponent);
exports.MinPrepComponent = MinPrepComponent;
