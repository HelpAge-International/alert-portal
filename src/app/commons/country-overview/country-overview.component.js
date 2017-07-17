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
var AgencyNotificationsComponent = (function () {
    function AgencyNotificationsComponent(af, router) {
        this.af = af;
        this.router = router;
        this.messages = [];
        this.sortedMessages = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AgencyNotificationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.getMessages();
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    AgencyNotificationsComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AgencyNotificationsComponent.prototype.getMessages = function () {
        this.messages = [];
        this.sortedMessages = [];
        this._getMessageByType('allagencyadminsgroup');
        this._getMessageByType('allusersgroup');
    };
    AgencyNotificationsComponent.prototype.deleteMessage = function (messageID, groupType) {
        if (!messageID || !groupType) {
            console.log('message ID and groupType requried params!');
            return;
        }
        this.messageToDeleteID = messageID;
        this.messageToDeleteType = groupType;
        jQuery("#delete-message").modal("show");
    };
    AgencyNotificationsComponent.prototype.processDeleteMessage = function () {
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/messageRef/systemadmin/' + this.messageToDeleteType + '/' + this.uid + '/' + this.messageToDeleteID).remove();
        this.closeModal();
        this.getMessages();
        return;
    };
    AgencyNotificationsComponent.prototype.closeModal = function () {
        jQuery("#delete-message").modal("hide");
    };
    AgencyNotificationsComponent.prototype._getMessageByType = function (groupType) {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/messageRef/systemadmin/" + groupType + "/" + this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (list) {
            list.forEach(function (x) {
                _this._getMessageData(x.$key, x.$value, groupType);
            });
        });
    };
    AgencyNotificationsComponent.prototype._getMessageData = function (messageID, messageTime, groupType) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/message/" + messageID)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (message) {
            if (message.time > messageTime) {
                _this._updateReadMessageTime(groupType, messageID);
            }
            message.groupType = groupType;
            _this.messages.push(message);
            _this._sortMessages();
        });
    };
    AgencyNotificationsComponent.prototype._sortMessages = function () {
        this.sortedMessages = this.messages.sort(function (a, b) {
            return b.time - a.time;
        });
    };
    AgencyNotificationsComponent.prototype._updateReadMessageTime = function (groupType, messageID) {
        var currentTime = new Date().getTime();
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/messageRef/systemadmin/' + groupType + '/' + this.uid + '/' + messageID)
            .set(currentTime)
            .then(function () {
            console.log('success update');
        }).catch(function (error) {
            console.log(error, 'You do not have access!');
        });
    };
    AgencyNotificationsComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return AgencyNotificationsComponent;
}());
AgencyNotificationsComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-notifications',
        templateUrl: './agency-notifications.component.html',
        styleUrls: ['./agency-notifications.component.css']
    })
], AgencyNotificationsComponent);
exports.AgencyNotificationsComponent = AgencyNotificationsComponent;
