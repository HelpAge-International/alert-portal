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
/**
 * Created by Fei on 07/03/2017.
 */
var alert_message_model_1 = require("../model/alert-message.model");
var CustomValidator_1 = require("../utils/CustomValidator");
var base_model_1 = require("./base.model");
var ModelUserPublic = (function (_super) {
    __extends(ModelUserPublic, _super);
    function ModelUserPublic(firstName, lastName, title, email) {
        var _this = _super.call(this) || this;
        _this.firstName = firstName;
        _this.lastName = lastName;
        _this.title = title;
        _this.email = email;
        return _this;
    }
    ModelUserPublic.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.title && !this.isExcluded('title', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_TITLE');
        }
        if (!this.firstName && !this.isExcluded('firstName', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME');
        }
        if (!this.lastName && !this.isExcluded('lastName', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME');
        }
        if (!this.email && !this.isExcluded('email', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_EMAIL');
        }
        if (!CustomValidator_1.CustomerValidator.EmailValidator(this.email) && !this.isExcluded('email', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.EMAIL_NOT_VALID');
        }
        if (!this.phone && !this.isExcluded('phone', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_PHONE');
        }
        if (!this.city && !this.isExcluded('city', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_CITY');
        }
        return null;
    };
    return ModelUserPublic;
}(base_model_1.BaseModel));
exports.ModelUserPublic = ModelUserPublic;
