"use strict";
/**
 * Created by ser-j on 25/05/2017.
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
var LogModel = (function (_super) {
    __extends(LogModel, _super);
    function LogModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.content && !this.isExcluded('content', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('RISK_MONITORING.MAIN_PAGE.LOGS_NO_CONTENT');
        }
        return null;
    };
    return LogModel;
}(base_model_1.BaseModel));
exports.LogModel = LogModel;
