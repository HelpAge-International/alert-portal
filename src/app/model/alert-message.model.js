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
var Enums_1 = require("../utils/Enums");
var AlertMessageModel = (function (_super) {
    __extends(AlertMessageModel, _super);
    function AlertMessageModel(message, type) {
        if (type === void 0) { type = Enums_1.AlertMessageType.Error; }
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.message = message;
        return _this;
    }
    // No validation required
    AlertMessageModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return AlertMessageModel;
}(base_model_1.BaseModel));
exports.AlertMessageModel = AlertMessageModel;
