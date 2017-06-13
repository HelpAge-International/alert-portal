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
var OperationAreaModel = (function (_super) {
    __extends(OperationAreaModel, _super);
    function OperationAreaModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationAreaModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (typeof (this.country) == 'undefined' && !this.isExcluded('country', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_COUNTRY');
        }
        if (typeof (this.level1) == 'undefined' && !this.isExcluded('level1', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL1');
        }
        if (typeof (this.level2) == 'undefined' && !this.isExcluded('level2', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL2');
        }
        return null;
    };
    OperationAreaModel.prototype.setData = function (location) {
        this.country = location.country;
        this.level1 = location.level1;
        this.level2 = location.level2;
    };
    return OperationAreaModel;
}(base_model_1.BaseModel));
exports.OperationAreaModel = OperationAreaModel;
