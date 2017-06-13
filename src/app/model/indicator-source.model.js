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
var IndicatorSourceModel = (function (_super) {
    __extends(IndicatorSourceModel, _super);
    function IndicatorSourceModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndicatorSourceModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        console.log('excluded ' + excludedFields);
        if (!this.name && !this.isExcluded('name', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_SOURCE_NAME');
        }
        if (!this.link && !this.isExcluded('link', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_SOURCE_LINK');
        }
        return null;
    };
    IndicatorSourceModel.prototype.setData = function (source) {
        this.link = source.link;
        this.name = source.name;
    };
    return IndicatorSourceModel;
}(base_model_1.BaseModel));
exports.IndicatorSourceModel = IndicatorSourceModel;
