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
// TODO - Modify data types when the enums are created
var Action = (function (_super) {
    __extends(Action, _super);
    function Action() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.assignHazard = [];
        return _this;
    }
    Action.prototype.validate = function (excludedFields) {
        if (excludedFields === void 0) { excludedFields = []; }
        if (!this.task && !this.isExcluded('task', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PREPAREDNESS.NO_TASK');
        }
        if (typeof (this.level) == 'undefined' && !this.isExcluded('level', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PREPAREDNESS.NO_LEVEL');
        }
        if (typeof (this.department) == 'undefined' && !this.isExcluded('department', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PREPAREDNESS.NO_DEPARTMENT');
        }
        if (!this.dueDate && !this.isExcluded('dueDate', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PREPAREDNESS.NO_DUE_DATE');
        }
        if (!this.budjet && !this.isExcluded('budjet', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PREPAREDNESS.NO_BUDJET');
        }
        if (typeof (this.requireDoc) == 'undefined' && !this.isExcluded('requireDoc', excludedFields)) {
            return new alert_message_model_1.AlertMessageModel('PREPAREDNESS.NO_REQUIRE_DOC');
        }
        return null;
    };
    return Action;
}(base_model_1.BaseModel));
exports.Action = Action;
