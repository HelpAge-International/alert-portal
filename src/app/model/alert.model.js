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
//import {ModelAffectedArea} from "./affectedArea.model";
var ModelAlert = (function (_super) {
    __extends(ModelAlert, _super);
    function ModelAlert() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.affectedAreas = [];
        _this.approval = [];
        return _this;
    }
    ModelAlert.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (typeof (this.hazardScenario) == 'undefined' && !this.isExcluded('hazardScenario', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_HAZARD');
        }
        if (typeof (this.alertLevel) == 'undefined' && !this.isExcluded('alertLevel', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_ALERT_LEVEL');
        }
        if (!this.reasonForRedAlert && !this.isExcluded('reasonForRedAlert', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_REASONS_FOR_REQUEST');
        }
        if (!this.estimatedPopulation && !this.isExcluded('estimatedPopulation', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_ESTIMATED');
        }
        if (!this.infoNotes && !this.isExcluded('infoNotes', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_NOTES');
        }
        return null;
    };
    return ModelAlert;
}(base_model_1.BaseModel));
exports.ModelAlert = ModelAlert;
