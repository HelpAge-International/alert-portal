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
var CountryAdminModel = (function (_super) {
    __extends(CountryAdminModel, _super);
    function CountryAdminModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO implement validation
    CountryAdminModel.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        return null;
    };
    return CountryAdminModel;
}(base_model_1.BaseModel));
exports.CountryAdminModel = CountryAdminModel;
