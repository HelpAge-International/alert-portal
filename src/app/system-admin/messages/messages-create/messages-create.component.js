"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var message_1 = require("../../../model/message");
var Constants_1 = require("../../../utils/Constants");
var rxjs_1 = require("rxjs");
var MessagesCreateComponent = (function () {
    function MessagesCreateComponent(af, router) {
        this.af = af;
        this.router = router;
        this.inactive = true;
        this.alerts = {};
        this.msgData = {};
        this.groups = [];
        this.systemAdminGroupPath = Constants_1.Constants.APP_STATUS + '/group/systemadmin/';
        this.systemAdminMessageRefPath = '/messageRef/systemadmin/';
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    MessagesCreateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                console.log("uid: " + _this.uid);
            }
            else {
                console.log("Error occurred - User isn't logged in");
                _this.navigateToLogin();
            }
        });
    };
    MessagesCreateComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.msgData = {};
    };
    MessagesCreateComponent.prototype.onSubmit = function () {
        if (this.validate()) {
            this.createNewMessage();
            this.inactive = true;
        }
        else {
            this.showAlert();
        }
    };
    MessagesCreateComponent.prototype.createNewMessage = function () {
        var _this = this;
        this.af.database.list(this.systemAdminGroupPath)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (groups) {
            if (groups.length == 0) {
                _this.errorMessage = "MESSAGES.NO_USERS_IN_GROUP";
                _this.showAlert();
                return;
            }
            else {
                _this.currentDateTimeInMilliseconds = new Date().getTime();
                var newMessage = new message_1.Message(_this.uid, _this.messageTitle, _this.messageContent, _this.currentDateTimeInMilliseconds);
                var messagePath = Constants_1.Constants.APP_STATUS + '/message';
                _this.af.database.list(messagePath).push(newMessage)
                    .then(function (msgId) {
                    console.log('New Message added to message node');
                    var sentMsgPath = '/systemAdmin/' + _this.uid + '/sentmessages/' + msgId.key;
                    _this.msgData[sentMsgPath] = true;
                    _this.addMsgToMessageRef(msgId.key);
                });
            }
        });
    };
    MessagesCreateComponent.prototype.addMsgToMessageRef = function (key) {
        var _this = this;
        if (this.allUsersSelected) {
            var systemAdminAllUsersSelected = this.systemAdminGroupPath + 'allusersgroup/';
            var systemAdminAllUsersMessageRefPath_1 = this.systemAdminMessageRefPath + 'allusersgroup/';
            this.af.database.list(systemAdminAllUsersSelected)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (allUsersIds) {
                allUsersIds.forEach(function (userId) {
                    _this.msgData[systemAdminAllUsersMessageRefPath_1 + userId.$key + '/' + key] = _this.currentDateTimeInMilliseconds;
                });
                _this.af.database.object(Constants_1.Constants.APP_STATUS).update(_this.msgData).then(function (_) {
                    console.log("Message Ref successfully added to all nodes");
                    _this.router.navigate(['/system-admin/messages']);
                }).catch(function (error) {
                    console.log("Message creation unsuccessful" + error);
                });
            });
        }
        else {
            if (this.agencyAdminsSelected) {
                this.groups.push('allagencyadminsgroup');
            }
            if (this.countryAdminsSelected) {
                this.groups.push('allcountryadminsgroup');
            }
            if (this.networkAdminsSelected) {
                this.groups.push('allnetworkadminsgroup');
            }
            var _loop_1 = function (group) {
                var path = this_1.systemAdminGroupPath + group;
                this_1.af.database.list(path)
                    .takeUntil(this_1.ngUnsubscribe)
                    .subscribe(function (list) {
                    list.forEach(function (item) {
                        _this.msgData[_this.systemAdminMessageRefPath + group + '/' + item.$key + '/' + key] = _this.currentDateTimeInMilliseconds;
                    });
                    if (_this.groups.indexOf(group) == _this.groups.length - 1) {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS).update(_this.msgData).then(function (_) {
                            console.log("Message Ref successfully added to all nodes");
                            _this.router.navigate(['/system-admin/messages']);
                        }).catch(function (error) {
                            console.log("Message creation unsuccessful" + error);
                        });
                    }
                });
            };
            var this_1 = this;
            for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
                var group = _a[_i];
                _loop_1(group);
            }
        }
    };
    MessagesCreateComponent.prototype.showAlert = function () {
        var _this = this;
        this.inactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.inactive = true;
        });
    };
    /**
     * Returns false and specific error messages-
     * if no input is entered
     * @returns {boolean}
     */
    MessagesCreateComponent.prototype.validate = function () {
        if (!(this.messageTitle)) {
            this.alerts[this.messageTitle] = true;
            this.errorMessage = "MESSAGES.NO_TITLE_ERROR";
            return false;
        }
        else if (!(this.messageContent)) {
            this.alerts[this.messageContent] = true;
            this.errorMessage = "MESSAGES.NO_CONTENT_ERROR";
            return false;
        }
        else if ((!this.allUsersSelected) && (!this.agencyAdminsSelected) && (!this.countryAdminsSelected) && (!this.networkAdminsSelected)) {
            this.errorMessage = "MESSAGES.NO_RECIPIENTS_ERROR";
            return false;
        }
        return true;
    };
    MessagesCreateComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return MessagesCreateComponent;
}());
MessagesCreateComponent = __decorate([
    core_1.Component({
        selector: 'app-messages-create',
        templateUrl: './messages-create.component.html',
        styleUrls: ['./messages-create.component.css']
    })
], MessagesCreateComponent);
exports.MessagesCreateComponent = MessagesCreateComponent;
