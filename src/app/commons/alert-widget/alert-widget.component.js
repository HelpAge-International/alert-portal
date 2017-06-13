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
var RxHelper_1 = require("../../utils/RxHelper");
var Enums_1 = require("../../utils/Enums");
var HazardImages_1 = require("../../utils/HazardImages");
var AlertWidgetComponent = (function () {
    function AlertWidgetComponent(af, sanitizer) {
        this.af = af;
        this.sanitizer = sanitizer;
        this.RedAlertStatus = Enums_1.ThresholdName.Red;
        this.AmberAlertStatus = Enums_1.ThresholdName.Amber;
        this.alertLevels = Constants_1.Constants.ALERTS;
        this.hazardScenarios = Constants_1.Constants.HAZARD_SCENARIOS;
        this.alerts = [];
        this.subscriptions = new RxHelper_1.RxHelper;
    }
    AlertWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.add(this.af.database.list(Constants_1.Constants.APP_STATUS + '/alert/' + this.countryId).subscribe(function (alerts) {
            _this.alerts = alerts.map(function (alert) {
                console.log(alert.alertLevel);
                console.log(Enums_1.ThresholdName.Red);
                if (alert.alertLevel == Enums_1.ThresholdName.Red || alert.alertLevel == Enums_1.ThresholdName.Amber) {
                    return alert;
                }
            });
        }));
    };
    AlertWidgetComponent.prototype.ngOnDestroy = function () {
        try {
            this.subscriptions.releaseAll();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    AlertWidgetComponent.prototype.getCSSHazard = function (hazard) {
        return HazardImages_1.HazardImages.init().getCSS(hazard);
    };
    return AlertWidgetComponent;
}());
__decorate([
    core_1.Input()
], AlertWidgetComponent.prototype, "countryId", void 0);
AlertWidgetComponent = __decorate([
    core_1.Component({
        selector: 'app-alert-widget',
        templateUrl: './alert-widget.component.html',
        styleUrls: ['./alert-widget.component.css']
    })
], AlertWidgetComponent);
exports.AlertWidgetComponent = AlertWidgetComponent;
