"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SessionService = (function () {
    function SessionService(subscriptions) {
        this.subscriptions = subscriptions;
    }
    Object.defineProperty(SessionService.prototype, "user", {
        get: function () {
            return this._user;
        },
        set: function (user) {
            this._user = user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionService.prototype, "partner", {
        get: function () {
            return this._partner;
        },
        set: function (partner) {
            this._partner = partner;
        },
        enumerable: true,
        configurable: true
    });
    return SessionService;
}());
SessionService = __decorate([
    core_1.Injectable()
], SessionService);
exports.SessionService = SessionService;
