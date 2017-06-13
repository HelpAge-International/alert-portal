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
var indicator_source_model_1 = require("./indicator-source.model");
var indicator_trigger_model_1 = require("./indicator-trigger.model");
var operation_area_model_1 = require("./operation-area.model");
var Indicator = (function (_super) {
    __extends(Indicator, _super);
    function Indicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.category = 0;
        _this.name = '';
        _this.source = [];
        _this.affectedLocation = [];
        _this.trigger = [];
        return _this;
    }
    Indicator.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (typeof (this.category) == 'undefined' && !this.isExcluded('category', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_CATEGORY');
        }
        if (!this.name && !this.isExcluded('name', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_NAME');
        }
        if (typeof (this.geoLocation) == 'undefined' && !this.isExcluded('geoLocation', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_GEO_LOCATION');
        }
        return null;
    };
    Indicator.prototype.setData = function (indicator) {
        var _this = this;
        this.id = indicator.id;
        this.category = indicator.category;
        this.name = indicator.name;
        this.assignee = indicator.assignee;
        this.geoLocation = indicator.geoLocation;
        this.source = [];
        this.affectedLocation = [];
        this.trigger = [];
        indicator.source.forEach(function (source, key) {
            _this.source.push(new indicator_source_model_1.IndicatorSourceModel());
            _this.source[key].setData(source);
        });
        indicator.trigger.forEach(function (trigger, key) {
            _this.trigger.push(new indicator_trigger_model_1.IndicatorTriggerModel());
            _this.trigger[key].setData(trigger);
        });
        if (this.geoLocation == 1) {
            indicator.affectedLocation.forEach(function (location, key) {
                _this.affectedLocation.push(new operation_area_model_1.OperationAreaModel());
                _this.affectedLocation[key].setData(location);
            });
        }
    };
    return Indicator;
}(base_model_1.BaseModel));
exports.Indicator = Indicator;
