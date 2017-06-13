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
var permissions_model_1 = require("./permissions.model");
var Enums_1 = require("../utils/Enums");
var PartnerModel = (function (_super) {
    __extends(PartnerModel, _super);
    function PartnerModel() {
        var _this = _super.call(this) || this;
        _this.permissions = new permissions_model_1.PermissionsModel();
        // set the default status to awaiting validations
        _this.status = Enums_1.PartnerStatus.AwaitingValidation;
        return _this;
    }
    PartnerModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.partnerOrganisationId && !this.isExcluded('partnerOrganisationId', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.PARTNER.NO_PARTNER_ORGANISATION');
        }
        if (!this.position && !this.isExcluded('position', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.PARTNER.NO_POSITION');
        }
        if (typeof (this.hasValidationPermission) !== typeof (true) && !this.isExcluded('hasValidationPermission', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.PARTNER.NO_VALIDATION_PERMISSION');
        }
    };
    return PartnerModel;
}(base_model_1.BaseModel));
exports.PartnerModel = PartnerModel;
