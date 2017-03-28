"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var Constants_1 = require("../../utils/Constants");
var SystemAdminHeaderComponent = (function () {
    function SystemAdminHeaderComponent(af, router, dialog, translate) {
        this.af = af;
        this.router = router;
        this.dialog = dialog;
        this.translate = translate;
        this.firstName = "";
        this.lastName = "";
        this.counter = 0;
    }
    SystemAdminHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.af.auth.subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid).subscribe(function (user) {
                    _this.firstName = user.firstName;
                    _this.lastName = user.lastName;
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    SystemAdminHeaderComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    SystemAdminHeaderComponent.prototype.goToAccountSettings = function () {
        this.router.navigateByUrl('system-admin/account-settings');
    };
    SystemAdminHeaderComponent.prototype.logout = function () {
        console.log("logout");
        this.af.auth.logout();
    };
    SystemAdminHeaderComponent.prototype.test = function () {
        this.counter++;
        if (this.counter % 2 == 0) {
            this.translate.use("en");
        }
        else {
            this.translate.use("fr");
        }
        //   console.log("open dialog")
        //   let dialogRef = this.dialog.open(DialogComponent);
        //   dialogRef.afterClosed().subscribe(result => {
        //     console.log(result);
        //   });
    };
    SystemAdminHeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-system-admin-header',
            templateUrl: 'system-admin-header.component.html',
            styleUrls: ['system-admin-header.component.css']
        })
    ], SystemAdminHeaderComponent);
    return SystemAdminHeaderComponent;
}());
exports.SystemAdminHeaderComponent = SystemAdminHeaderComponent;
