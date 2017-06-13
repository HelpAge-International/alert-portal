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
/*
* Custom error type which if thrown will display the thrown error message instead of the generic one
*/
var DisplayError = (function (_super) {
    __extends(DisplayError, _super);
    function DisplayError(message) {
        return _super.call(this, message) || this;
    }
    return DisplayError;
}(Error));
exports.DisplayError = DisplayError;
