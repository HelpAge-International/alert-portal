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
var rxjs_1 = require("rxjs");
var SystemAdminComponent = (function () {
    function SystemAdminComponent(af, router, overlay, vcRef, modal) {
        this.af = af;
        this.router = router;
        this.modal = modal;
        this.ngUnsubscribe = new rxjs_1.Subject();
        overlay.defaultViewContainer = vcRef;
    }
    SystemAdminComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (x) {
            if (x) {
                _this.uid = x.auth.uid;
                console.log("uid: " + _this.uid);
                _this.agencies = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency");
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    SystemAdminComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    SystemAdminComponent.prototype.update = function (agency) {
        this.agencyToUpdate = agency;
        jQuery("#update-agency").modal("show");
    };
    SystemAdminComponent.prototype.toggleActive = function () {
        var state = !this.agencyToUpdate.isActive;
        console.log(this.agencyToUpdate.isActive);
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + this.agencyToUpdate.$key + "/isActive").set(state).then(function (_) {
            console.log("Agency state updated");
            jQuery("#update-agency").modal("hide");
        });
    };
    SystemAdminComponent.prototype.closeModal = function () {
        jQuery("#update-agency").modal("hide");
    };
    SystemAdminComponent.prototype.editAgency = function (agency) {
        this.router.navigate(['/system-admin/add-agency', { id: agency.$key }]);
    };
    SystemAdminComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return SystemAdminComponent;
}());
SystemAdminComponent = __decorate([
    core_1.Component({
        selector: 'app-system-admin',
        templateUrl: './system-admin.component.html',
        styleUrls: ['./system-admin.component.css']
    })
], SystemAdminComponent);
exports.SystemAdminComponent = SystemAdminComponent;
