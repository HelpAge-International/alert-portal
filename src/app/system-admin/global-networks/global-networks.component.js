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
var GlobalNetworksComponent = (function () {
    function GlobalNetworksComponent(af, router) {
        this.af = af;
        this.router = router;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    GlobalNetworksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.loadNetworks();
        });
    };
    GlobalNetworksComponent.prototype.loadNetworks = function () {
        this.networks = this.af.database.list(Constants_1.Constants.APP_STATUS + "/network");
        console.log(this.networks);
    };
    GlobalNetworksComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    GlobalNetworksComponent.prototype.addNetwork = function () {
        this.router.navigateByUrl(Constants_1.Constants.SYSTEM_ADMIN_ADD_NETWORK);
    };
    GlobalNetworksComponent.prototype.update = function (network) {
        this.networkToUpdate = network;
        if (this.networkToUpdate.isActive) {
            this.alertTitle = "GLOBAL.DEACTIVATE";
            this.alertContent = "SYSTEM_ADMIN.GLOBAL_NETWORKS.DIALOG.DEACTIVATE_CONTENT";
        }
        else {
            this.alertTitle = "GLOBAL.ACTIVATE";
            this.alertContent = "SYSTEM_ADMIN.GLOBAL_NETWORKS.DIALOG.ACTIVATE_CONTENT";
        }
        jQuery("#update-network").modal("show");
    };
    GlobalNetworksComponent.prototype.toggleActive = function () {
        var newState = !this.networkToUpdate.isActive;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/network/" + this.networkToUpdate.$key + "/isActive").set(newState)
            .then(function (_) {
            console.log("Network state updated");
            jQuery("#update-network").modal("hide");
        });
    };
    GlobalNetworksComponent.prototype.closeModal = function () {
        jQuery("#update-network").modal("hide");
    };
    GlobalNetworksComponent.prototype.edit = function (network) {
        this.router.navigate([Constants_1.Constants.SYSTEM_ADMIN_ADD_NETWORK, { id: network.$key }], { skipLocationChange: true });
    };
    return GlobalNetworksComponent;
}());
GlobalNetworksComponent = __decorate([
    core_1.Component({
        selector: 'app-global-networks',
        templateUrl: 'global-networks.component.html',
        styleUrls: ['global-networks.component.css']
    })
], GlobalNetworksComponent);
exports.GlobalNetworksComponent = GlobalNetworksComponent;
