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
var alert_message_model_1 = require("./alert-message.model");
var base_model_1 = require("./base.model");
var CustomValidator_1 = require("../utils/CustomValidator");
var ChangePasswordModel = (function (_super) {
    __extends(ChangePasswordModel, _super);
    function ChangePasswordModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangePasswordModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.currentPassword && !this.isExcluded('currentPassword', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_CURRENT_PASSWORD');
        }
        if (!this.newPassword && !this.isExcluded('newPassword', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_NEW_PASSWORD');
        }
        if (!this.confirmPassword && !this.isExcluded('confirmPassword', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_CONFIRM_PASSWORD');
        }
        if (this.newPassword !== this.confirmPassword) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.UNMATCHED_PASSWORD');
        }
        if (this.currentPassword === this.newPassword) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SAME_PASSWORD');
        }
        if (!CustomValidator_1.CustomerValidator.PasswordValidator(this.newPassword)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.INVALID_PASSWORD');
        }
        return null;
    };
    return ChangePasswordModel;
}(base_model_1.BaseModel));
exports.ChangePasswordModel = ChangePasswordModel;
