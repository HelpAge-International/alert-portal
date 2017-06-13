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
var operation_area_model_1 = require("./operation-area.model");
var alert_message_model_1 = require("./alert-message.model");
var CustomValidator_1 = require("../utils/CustomValidator");
var PartnerOrganisationModel = (function (_super) {
    __extends(PartnerOrganisationModel, _super);
    function PartnerOrganisationModel() {
        var _this = _super.call(this) || this;
        _this.projects = [new PartnerOrganisationProjectModel()];
        return _this;
    }
    PartnerOrganisationModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.organisationName && !this.isExcluded('organisationName', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_ORGANISATION_NAME');
        }
        if (!this.relationship && !this.isExcluded('relationship', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_RELATIONSHIP');
        }
        if (!this.title && !this.isExcluded('title', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_TITLE');
        }
        if (!this.firstName && !this.isExcluded('firstName', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME');
        }
        if (!this.lastName && !this.isExcluded('lastName', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME');
        }
        if (!this.position && !this.isExcluded('position', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_POSITION');
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
        return null;
    };
    return PartnerOrganisationModel;
}(base_model_1.BaseModel));
exports.PartnerOrganisationModel = PartnerOrganisationModel;
var PartnerOrganisationProjectModel = (function (_super) {
    __extends(PartnerOrganisationProjectModel, _super);
    function PartnerOrganisationProjectModel() {
        var _this = _super.call(this) || this;
        _this.operationAreas = [new operation_area_model_1.OperationAreaModel()];
        _this.sector = [];
        return _this;
    }
    PartnerOrganisationProjectModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.title && !this.isExcluded('title', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_PROJECT_TITLE');
        }
        if (Object.keys(this.sector).length < 1 && !this.isExcluded('sector', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_PROJECT_SECTOR');
        }
        if (!this.endDate && !this.isExcluded('endDate', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('ADD_PARTNER.NO_PROJECT_END_DATE');
        }
        return null;
    };
    return PartnerOrganisationProjectModel;
}(base_model_1.BaseModel));
exports.PartnerOrganisationProjectModel = PartnerOrganisationProjectModel;
