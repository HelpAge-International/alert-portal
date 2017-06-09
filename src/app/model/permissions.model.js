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
var PermissionsModel = (function (_super) {
    __extends(PermissionsModel, _super);
    function PermissionsModel() {
        var _this = _super.call(this) || this;
        _this.assignCHS = false;
        _this.assignMandatedApa = false;
        _this.assignMandatedMpa = false;
        _this.contacts = new ContactsPermissionModel();
        _this.crossCountry = new CrossCountryPermissionModel();
        _this.customApa = new CustomPAPermissionModel();
        _this.customMpa = new CustomPAPermissionModel();
        _this.interAgency = new InterAgencyPermissionModel();
        _this.notes = new NotesPermissionModel();
        _this.other = new OtherPermissionModel();
        return _this;
    }
    PermissionsModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return PermissionsModel;
}(base_model_1.BaseModel));
exports.PermissionsModel = PermissionsModel;
var ContactsPermissionModel = (function (_super) {
    __extends(ContactsPermissionModel, _super);
    function ContactsPermissionModel() {
        var _this = _super.call(this) || this;
        _this.delete = false;
        _this.edit = false;
        _this.new = false;
        return _this;
    }
    ContactsPermissionModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return ContactsPermissionModel;
}(base_model_1.BaseModel));
exports.ContactsPermissionModel = ContactsPermissionModel;
var CrossCountryPermissionModel = (function (_super) {
    __extends(CrossCountryPermissionModel, _super);
    function CrossCountryPermissionModel() {
        var _this = _super.call(this) || this;
        _this.addNote = false;
        _this.copyAction = false;
        _this.download = false;
        _this.edit = false;
        _this.view = false;
        _this.viewContacts = false;
        return _this;
    }
    CrossCountryPermissionModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return CrossCountryPermissionModel;
}(base_model_1.BaseModel));
exports.CrossCountryPermissionModel = CrossCountryPermissionModel;
var CustomPAPermissionModel = (function (_super) {
    __extends(CustomPAPermissionModel, _super);
    function CustomPAPermissionModel() {
        var _this = _super.call(this) || this;
        _this.assign = false;
        _this.edit = false;
        _this.delete = false;
        _this.new = false;
        return _this;
    }
    CustomPAPermissionModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return CustomPAPermissionModel;
}(base_model_1.BaseModel));
exports.CustomPAPermissionModel = CustomPAPermissionModel;
var InterAgencyPermissionModel = (function (_super) {
    __extends(InterAgencyPermissionModel, _super);
    function InterAgencyPermissionModel() {
        var _this = _super.call(this) || this;
        _this.addNote = false;
        _this.copyAction = false;
        _this.download = false;
        _this.edit = false;
        _this.view = false;
        _this.viewContacts = false;
        return _this;
    }
    InterAgencyPermissionModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return InterAgencyPermissionModel;
}(base_model_1.BaseModel));
exports.InterAgencyPermissionModel = InterAgencyPermissionModel;
var NotesPermissionModel = (function (_super) {
    __extends(NotesPermissionModel, _super);
    function NotesPermissionModel() {
        var _this = _super.call(this) || this;
        _this.edit = false;
        _this.delete = false;
        _this.new = false;
        return _this;
    }
    NotesPermissionModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return NotesPermissionModel;
}(base_model_1.BaseModel));
exports.NotesPermissionModel = NotesPermissionModel;
var OtherPermissionModel = (function (_super) {
    __extends(OtherPermissionModel, _super);
    function OtherPermissionModel() {
        var _this = _super.call(this) || this;
        _this.downloadDoc = false;
        _this.uploadDoc = false;
        return _this;
    }
    OtherPermissionModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return OtherPermissionModel;
}(base_model_1.BaseModel));
exports.OtherPermissionModel = OtherPermissionModel;
