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
var ModuleSettingsModel = (function (_super) {
    __extends(ModuleSettingsModel, _super);
    function ModuleSettingsModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModuleSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.privacy && !this.isExcluded('privacy', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.MODULES.NO_PRIVACY');
        }
        if (!this.status && !this.isExcluded('status', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.MODULES.NO_STATUS');
        }
        return null;
    };
    return ModuleSettingsModel;
}(base_model_1.BaseModel));
exports.ModuleSettingsModel = ModuleSettingsModel;
