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
var IndicatorTriggerModel = (function (_super) {
    __extends(IndicatorTriggerModel, _super);
    function IndicatorTriggerModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndicatorTriggerModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.triggerValue && !this.isExcluded('triggerValue', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_TRIGGER_VALUE');
        }
        if (!this.frequencyValue && !this.isExcluded('frequencyValue', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_TRIGGER_FREQUENCY_VALUE');
        }
        if (typeof (this.durationType) == 'undefined' && !this.isExcluded('durationType', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_TRIGGER_DURATION_TYPE');
        }
        return null;
    };
    IndicatorTriggerModel.prototype.setData = function (trigger) {
        this.durationType = trigger.durationType;
        this.frequencyValue = trigger.frequencyValue;
        this.triggerValue = trigger.triggerValue;
    };
    return IndicatorTriggerModel;
}(base_model_1.BaseModel));
exports.IndicatorTriggerModel = IndicatorTriggerModel;
