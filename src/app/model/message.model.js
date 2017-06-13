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
var MessageModel = (function (_super) {
    __extends(MessageModel, _super);
    function MessageModel() {
        var _this = _super.call(this) || this;
        _this.userType = [];
        return _this;
    }
    MessageModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.title && !this.isExcluded('title', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('MESSAGES.NO_TITLE_ERROR');
        }
        if (!this.content && !this.isExcluded('content', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('MESSAGES.NO_CONTENT_ERROR');
        }
        if (this.userType.length < 1 && !this.isExcluded('content', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('MESSAGES.NO_RECIPIENTS_ERROR');
        }
        return null;
    };
    return MessageModel;
}(base_model_1.BaseModel));
exports.MessageModel = MessageModel;
