"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_model_1 = require("./base.model");
var alert_message_model_1 = require("./alert-message.model");
var ClockSettingsModel = (function (_super) {
    __extends(ClockSettingsModel, _super);
    function ClockSettingsModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClockSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.preparedness && !this.isExcluded('preparedness', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_PREPAREDNESS_DURATION');
        }
        if (!this.responsePlans && !this.isExcluded('responsePlans', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_RESPONSE_PLANS_DURATION');
        }
        if (!this.riskMonitoring && !this.isExcluded('riskMonitoring', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_RISK_MONITORING_DURATION');
        }
        return null;
    };
    return ClockSettingsModel;
}(base_model_1.BaseModel));
exports.ClockSettingsModel = ClockSettingsModel;
var ClockSettingModel = (function (_super) {
    __extends(ClockSettingModel, _super);
    function ClockSettingModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClockSettingModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.durationType && !this.isExcluded('durationType', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_DURATION');
        }
        if (!this.value && !this.isExcluded('value', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_DURATION');
        }
        return null;
    };
    return ClockSettingModel;
}(base_model_1.BaseModel));
exports.ClockSettingModel = ClockSettingModel;
