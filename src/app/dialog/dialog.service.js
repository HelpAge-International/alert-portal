"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var dialog_component_1 = require("./dialog.component");
/**
 * Created by Fei on 15/03/2017.
 */
var DialogService = (function () {
    function DialogService(dialog) {
        this.dialog = dialog;
    }
    DialogService.prototype.createDialog = function (title, content) {
        var dialogRef = this.dialog.open(dialog_component_1.DialogComponent);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.content = content;
        return dialogRef.afterClosed();
    };
    DialogService = __decorate([
        core_1.Injectable()
    ], DialogService);
    return DialogService;
}());
exports.DialogService = DialogService;
