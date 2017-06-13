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
var alert_message_model_1 = require("../../../model/alert-message.model");
var display_error_1 = require("../../../errors/display.error");
var Enums_1 = require("../../../utils/Enums");
var CountryClockSettingsComponent = (function () {
    function CountryClockSettingsComponent(_userService, _settingsService, router, route, subscriptions) {
        this._userService = _userService;
        this._settingsService = _settingsService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        this.DURATION_TYPE = Constants_1.Constants.DURATION_TYPE;
        this.DURATION_TYPE_SELECTION = Constants_1.Constants.DURATION_TYPE_SELECTION;
        this.durations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
    }
    CountryClockSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            _this._userService.getCountryAdminUser(_this.uid).subscribe(function (countryAdminUser) {
                if (countryAdminUser) {
                    _this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
                    _this.countryId = countryAdminUser.countryId;
                    _this._settingsService.getCountryClockSettings(_this.agencyId, _this.countryId).subscribe(function (clockSettings) {
                        _this.clockSettings = clockSettings;
                    });
                }
            });
        });
        this.subscriptions.add(authSubscription);
    };
    CountryClockSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryClockSettingsComponent.prototype.validateForm = function () {
        this.alertMessage = this.clockSettings.validate();
        return !this.alertMessage;
    };
    CountryClockSettingsComponent.prototype.submit = function () {
        var _this = this;
        this._settingsService.saveCountryClockSettings(this.agencyId, this.countryId, this.clockSettings)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.SAVED_SUCCESS', Enums_1.AlertMessageType.Success);
        })
            .catch(function (err) {
            if (err instanceof display_error_1.DisplayError) {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel(err.message);
            }
            else {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
        });
    };
    CountryClockSettingsComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/dashboard');
    };
    return CountryClockSettingsComponent;
}());
CountryClockSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-country-clock-settings',
        templateUrl: './country-clock-settings.component.html',
        styleUrls: ['./country-clock-settings.component.css']
    })
], CountryClockSettingsComponent);
exports.CountryClockSettingsComponent = CountryClockSettingsComponent;
