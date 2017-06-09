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
var PermissionSettingsModel = (function (_super) {
    __extends(PermissionSettingsModel, _super);
    function PermissionSettingsModel() {
        var _this = _super.call(this) || this;
        _this.chsActions = [];
        _this.countryContacts = new ContactsPermissionSettingsModel();
        _this.crossCountry = new CrossCountryPermissionSettingsModel();
        _this.customApa = new CustomPAPermissionSettingsModel();
        _this.customMpa = new CustomPAPermissionSettingsModel();
        _this.interAgency = new InterAgencyPermissionSettingsModel();
        _this.notes = new NotesPermissionSettingsModel();
        _this.other = new OtherPermissionSettingsModel();
        return _this;
    }
    PermissionSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.chsActions && !this.isExcluded('chsActions', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_CSH_ACTIONS');
        }
        if (!this.mandatedApaAssign && !this.isExcluded('mandatedApaAssign', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_MANDATED_APA_ASSIGN');
        }
        if (!this.mandatedMpaAssign && !this.isExcluded('mandatedMpaAssign', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_MANDATED_MPA_ASSIGN');
        }
        if (!this.countryContacts && !this.isExcluded('countryContacts', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_COUNTRY_CONTACTS');
        }
        if (!this.crossCountry && !this.isExcluded('crossCountry', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_CROSS_COUNTRY');
        }
        if (!this.customApa && !this.isExcluded('customApa', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_CUSTOM_APA');
        }
        if (!this.customMpa && !this.isExcluded('customMpa', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_CUSTOM_MPA');
        }
        if (!this.interAgency && !this.isExcluded('interAgency', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_INTER_AGENCY');
        }
        if (!this.notes && !this.isExcluded('notes', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_NOTES');
        }
        if (!this.other && !this.isExcluded('other', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PERMISSIONS.NO_OTHER');
        }
        return null;
    };
    return PermissionSettingsModel;
}(base_model_1.BaseModel));
exports.PermissionSettingsModel = PermissionSettingsModel;
var ContactsPermissionSettingsModel = (function (_super) {
    __extends(ContactsPermissionSettingsModel, _super);
    function ContactsPermissionSettingsModel() {
        var _this = _super.call(this) || this;
        _this.delete = [];
        _this.edit = [];
        _this.new = [];
        return _this;
    }
    ContactsPermissionSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return ContactsPermissionSettingsModel;
}(base_model_1.BaseModel));
exports.ContactsPermissionSettingsModel = ContactsPermissionSettingsModel;
var CrossCountryPermissionSettingsModel = (function (_super) {
    __extends(CrossCountryPermissionSettingsModel, _super);
    function CrossCountryPermissionSettingsModel() {
        var _this = _super.call(this) || this;
        _this.addNote = [];
        _this.copyAction = [];
        _this.download = [];
        _this.edit = [];
        _this.view = [];
        _this.viewContacts = [];
        return _this;
    }
    CrossCountryPermissionSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return CrossCountryPermissionSettingsModel;
}(base_model_1.BaseModel));
exports.CrossCountryPermissionSettingsModel = CrossCountryPermissionSettingsModel;
var CustomPAPermissionSettingsModel = (function (_super) {
    __extends(CustomPAPermissionSettingsModel, _super);
    function CustomPAPermissionSettingsModel() {
        var _this = _super.call(this) || this;
        _this.assign = [];
        _this.edit = [];
        _this.delete = [];
        _this.new = [];
        return _this;
    }
    CustomPAPermissionSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return CustomPAPermissionSettingsModel;
}(base_model_1.BaseModel));
exports.CustomPAPermissionSettingsModel = CustomPAPermissionSettingsModel;
var InterAgencyPermissionSettingsModel = (function (_super) {
    __extends(InterAgencyPermissionSettingsModel, _super);
    function InterAgencyPermissionSettingsModel() {
        var _this = _super.call(this) || this;
        _this.addNote = [];
        _this.copyAction = [];
        _this.download = [];
        _this.edit = [];
        _this.view = [];
        _this.viewContacts = [];
        return _this;
    }
    InterAgencyPermissionSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return InterAgencyPermissionSettingsModel;
}(base_model_1.BaseModel));
exports.InterAgencyPermissionSettingsModel = InterAgencyPermissionSettingsModel;
var NotesPermissionSettingsModel = (function (_super) {
    __extends(NotesPermissionSettingsModel, _super);
    function NotesPermissionSettingsModel() {
        var _this = _super.call(this) || this;
        _this.edit = [];
        _this.delete = [];
        _this.new = [];
        return _this;
    }
    NotesPermissionSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return NotesPermissionSettingsModel;
}(base_model_1.BaseModel));
exports.NotesPermissionSettingsModel = NotesPermissionSettingsModel;
var OtherPermissionSettingsModel = (function (_super) {
    __extends(OtherPermissionSettingsModel, _super);
    function OtherPermissionSettingsModel() {
        var _this = _super.call(this) || this;
        _this.downloadDoc = [];
        _this.uploadDoc = [];
        return _this;
    }
    OtherPermissionSettingsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return OtherPermissionSettingsModel;
}(base_model_1.BaseModel));
exports.OtherPermissionSettingsModel = OtherPermissionSettingsModel;
