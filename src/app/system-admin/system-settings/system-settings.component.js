"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var rxjs_1 = require("rxjs");
var Constants_1 = require("../../utils/Constants");
var system_model_1 = require("../../model/system.model");
var SystemSettingsComponent = (function () {
    function SystemSettingsComponent(af, router, subscriptions) {
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.successMessage = "SYSTEM_ADMIN.SETTING.SETTING_SAVED";
        this.isSaved = false;
        this.thresholdValue = Constants_1.Constants.THRESHOLD_VALUE;
    }
    SystemSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (x) {
            if (x) {
                _this.uid = x.uid;
                _this.initData(_this.uid);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
        this.subscriptions.add(subscription);
    };
    SystemSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    SystemSettingsComponent.prototype.saveSetting = function () {
        if (this.uid) {
            this.writeToFirebase();
        }
        else {
            this.router.navigateByUrl("/login");
        }
    };
    SystemSettingsComponent.prototype.initData = function (uid) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + uid).subscribe(function (x) {
            _this.modelSystem = new system_model_1.ModelSystem();
            _this.modelSystem.advThreshold = x.advThreshold;
            _this.modelSystem.minThreshold = x.minThreshold;
            //load minimum threshold from database
            _this.minGreen = x.minThreshold[0];
            _this.minAmber = x.minThreshold[1];
            _this.minRed = x.minThreshold[2];
            //load advanced threshold from database
            _this.advGreen = x.advThreshold[0];
            _this.advAmber = x.advThreshold[1];
            _this.advRed = x.advThreshold[2];
        });
    };
    SystemSettingsComponent.prototype.writeToFirebase = function () {
        var _this = this;
        this.modelSystem.minThreshold[0] = this.minGreen;
        this.modelSystem.minThreshold[1] = this.minAmber;
        this.modelSystem.minThreshold[2] = this.minRed;
        this.modelSystem.advThreshold[0] = this.advGreen;
        this.modelSystem.advThreshold[1] = this.advAmber;
        this.modelSystem.advThreshold[2] = this.advRed;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + this.uid).update(this.modelSystem).then(function (_) {
            _this.showAlert();
        }, function (error) {
            console.log(error.message);
        });
    };
    SystemSettingsComponent.prototype.showAlert = function () {
        var _this = this;
        this.isSaved = true;
        var subscription = rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION).subscribe(function () {
            _this.isSaved = false;
        });
        this.subscriptions.add(subscription);
    };
    SystemSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-system-settings',
            templateUrl: './system-settings.component.html',
            styleUrls: ['./system-settings.component.css']
        })
    ], SystemSettingsComponent);
    return SystemSettingsComponent;
}());
exports.SystemSettingsComponent = SystemSettingsComponent;
