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
var Frequency_1 = require("../../../utils/Frequency");
var rxjs_1 = require("rxjs");
var ClockSettingsComponent = (function () {
    function ClockSettingsComponent(af, router) {
        this.af = af;
        this.router = router;
        this.DURATION_TYPE = Constants_1.Constants.DURATION_TYPE;
        this.DURATION_TYPE_SELECTION = Constants_1.Constants.DURATION_TYPE_SELECTION;
        this.durations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.uid = "";
        this.settings = [];
        this.saved = false;
        this.alertMessage = "";
        this.alertSuccess = true;
        this.alertShow = false;
        this.riskMonitorShowLogForFreq = new Frequency_1.Frequency({ value: -1, type: -1 });
        this.riskMonitorHazardFreq = new Frequency_1.Frequency({ value: -1, type: -1 });
        this.preparednessFreq = new Frequency_1.Frequency({ value: -1, type: -1 });
        this.responsePlansFreq = new Frequency_1.Frequency({ value: -1, type: -1 });
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    ClockSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + _this.uid + '/clockSettings/')
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    _.map(function (setting) {
                        _this.settings[setting.$key] = setting;
                    });
                    _this.riskMonitorShowLogForFreq = new Frequency_1.Frequency(_this.settings['riskMonitoring']['showLogsFrom']);
                    _this.riskMonitorHazardFreq = new Frequency_1.Frequency(_this.settings['riskMonitoring']['hazardsValidFor']);
                    _this.preparednessFreq = new Frequency_1.Frequency(_this.settings['preparedness']);
                    _this.responsePlansFreq = new Frequency_1.Frequency(_this.settings['responsePlans']);
                });
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    ClockSettingsComponent.prototype.ngOnDestroy = function () {
        try {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    ClockSettingsComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    ClockSettingsComponent.prototype.cancelChanges = function () {
        this.ngOnInit();
    };
    ClockSettingsComponent.prototype.saveChanges = function () {
        var _this = this;
        this.settings['riskMonitoring']['showLogsFrom']['value'] = this.riskMonitorShowLogForFreq.value;
        this.settings['riskMonitoring']['showLogsFrom']['durationType'] = this.riskMonitorShowLogForFreq.type;
        this.settings['riskMonitoring']['hazardsValidFor']['value'] = this.riskMonitorHazardFreq.value;
        this.settings['riskMonitoring']['hazardsValidFor']['durationType'] = this.riskMonitorHazardFreq.type;
        this.settings['responsePlans']['value'] = this.responsePlansFreq.value;
        this.settings['responsePlans']['durationType'] = this.responsePlansFreq.type;
        this.settings['preparedness']['value'] = this.preparednessFreq.value;
        this.settings['preparedness']['durationType'] = this.preparednessFreq.type;
        this.updateCountriesClockSettings();
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/clockSettings/')
            .set(this.settings)
            .then(function (_) {
            if (!_this.alertShow) {
                _this.saved = true;
                _this.alertSuccess = true;
                _this.alertShow = true;
                _this.alertMessage = "Clock Settings succesfully saved!";
            }
            // try {
            //   this.countryOfficesSubscriptions.releaseAll();
            // } catch (e) {
            //   console.log('Unable to releaseAll');
            // }
        })
            .catch(function (err) {
            console.log(err, 'Error occurred!');
            _this.alertSuccess = false;
            _this.alertShow = true;
            _this.alertMessage = "Error occurred!";
            // try {
            //   this.countryOfficesSubscriptions.releaseAll();
            // } catch (e) {
            //   console.log('Unable to releaseAll');
            // }
        });
    };
    ClockSettingsComponent.prototype.onAlertHidden = function (hidden) {
        this.alertShow = !hidden;
        this.alertSuccess = true;
        this.alertMessage = "";
    };
    ClockSettingsComponent.prototype.updateCountriesClockSettings = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (_) {
            _.map(function (setting) {
                if ('clockSettings' in setting) {
                    var clockSettings = setting['clockSettings'];
                    var update = false;
                    if (_this.riskMonitorShowLogForFreq.gt(new Frequency_1.Frequency(clockSettings['riskMonitoring']['showLogsFrom']))) {
                        update = true;
                        clockSettings['riskMonitoring']['showLogsFrom']['value'] = _this.riskMonitorShowLogForFreq.value;
                        clockSettings['riskMonitoring']['showLogsFrom']['durationType'] = _this.riskMonitorShowLogForFreq.type;
                    }
                    if (_this.riskMonitorHazardFreq.gt(new Frequency_1.Frequency(clockSettings['riskMonitoring']['hazardsValidFor']))) {
                        update = true;
                        clockSettings['riskMonitoring']['hazardsValidFor']['value'] = _this.riskMonitorHazardFreq.value;
                        clockSettings['riskMonitoring']['hazardsValidFor']['durationType'] = _this.riskMonitorHazardFreq.type;
                    }
                    if (_this.preparednessFreq.gt(new Frequency_1.Frequency(clockSettings['preparedness']))) {
                        update = true;
                        clockSettings['preparedness']['value'] = _this.preparednessFreq.value;
                        clockSettings['preparedness']['durationType'] = _this.preparednessFreq.type;
                    }
                    if (_this.responsePlansFreq.gt(new Frequency_1.Frequency(clockSettings['responsePlans']))) {
                        update = true;
                        clockSettings['responsePlans']['value'] = _this.responsePlansFreq.value;
                        clockSettings['responsePlans']['durationType'] = _this.responsePlansFreq.type;
                    }
                    if (update) {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + _this.uid + '/' + setting.$key + '/clockSettings/')
                            .set(clockSettings)
                            .catch(function (err) { return console.log(err, 'Error occurred!'); });
                    }
                }
            });
        });
    };
    return ClockSettingsComponent;
}());
ClockSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-clock-settings',
        templateUrl: './clock-settings.component.html',
        styleUrls: ['./clock-settings.component.css']
    })
], ClockSettingsComponent);
exports.ClockSettingsComponent = ClockSettingsComponent;
