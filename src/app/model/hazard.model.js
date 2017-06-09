"use strict";
/**
 * Created by jordan on 05/05/2017.
 */
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
var ModelHazard = (function (_super) {
    __extends(ModelHazard, _super);
    function ModelHazard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.seasons = [];
        return _this;
    }
    ModelHazard.prototype.validate = function (excludedFields) {
        if (typeof (this.hazardScenario) == 'undefined' || this.hazardScenario.length == 0 || this.hazardScenario == 'Other' && !this.isExcluded('hazardType', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_HAZARD');
        }
        if (this.isActive == false && !this.isExcluded('hazardType', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_HAZARD.HAZARD_DETECTED');
        }
        if (excludedFields > 1) {
            if (typeof (this.isSeasonal) == 'undefined' && !this.isExcluded('isSeasonal', excludedFields)) {
                return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_SEASONAL');
            }
            if (this.isSeasonal == true) {
                if (typeof (this.seasons) == 'undefined' || this.seasons.length == 0 && !this.isExcluded('isSeasonal', excludedFields)) {
                    return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_SEASONAL');
                }
            }
        }
        return null;
    };
    return ModelHazard;
}(base_model_1.BaseModel));
exports.ModelHazard = ModelHazard;
