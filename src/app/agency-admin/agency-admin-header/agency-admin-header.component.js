"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../utils/Constants");
var rxjs_1 = require("rxjs");
var AgencyAdminHeaderComponent = (function () {
    function AgencyAdminHeaderComponent(af, router, translate) {
        this.af = af;
        this.router = router;
        this.translate = translate;
        this.firstName = "";
        this.lastName = "";
        this.agencyName = "";
        this.counter = 0;
        this.unreadMessages = [];
        this.unreadSortedMessages = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AgencyAdminHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.getMessages();
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid)
                    .takeUntil(_this.ngUnsubscribe).subscribe(function (user) {
                    _this.firstName = user.firstName;
                    _this.lastName = user.lastName;
                });
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + _this.uid)
                    .takeUntil(_this.ngUnsubscribe).subscribe(function (agency) {
                    _this.agencyName = agency.name;
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    AgencyAdminHeaderComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AgencyAdminHeaderComponent.prototype.logout = function () {
        console.log("logout");
        this.af.auth.logout();
    };
    AgencyAdminHeaderComponent.prototype.test = function () {
        this.counter++;
        if (this.counter % 2 == 0) {
            this.translate.use("en");
        }
        else {
            this.translate.use("fr");
        }
    };
    AgencyAdminHeaderComponent.prototype.goToNotifications = function () {
        this.router.navigateByUrl("agency-admin/agency-notifications/agency-notifications");
    };
    AgencyAdminHeaderComponent.prototype.getMessages = function () {
        this._getMessageByType('allagencyadminsgroup');
        this._getMessageByType('allusersgroup');
    };
    AgencyAdminHeaderComponent.prototype._getMessageByType = function (groupType) {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/messageRef/systemadmin/" + groupType + "/" + this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (list) {
            list.forEach(function (x) {
                _this._getMessageData(x.$key, x.$value);
            });
        });
    };
    AgencyAdminHeaderComponent.prototype._getMessageData = function (messageID, messageTime) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/message/" + messageID)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (message) {
            if (message.time > messageTime) {
                _this.unreadMessages.push(message);
                _this._sortMessages();
            }
        });
    };
    AgencyAdminHeaderComponent.prototype._sortMessages = function () {
        this.unreadSortedMessages = this.unreadMessages.sort(function (a, b) {
            return b.time - a.time;
        });
    };
    return AgencyAdminHeaderComponent;
}());
AgencyAdminHeaderComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-admin-header',
        templateUrl: './agency-admin-header.component.html',
        styleUrls: ['./agency-admin-header.component.css']
    })
], AgencyAdminHeaderComponent);
exports.AgencyAdminHeaderComponent = AgencyAdminHeaderComponent;
