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
var CreateEditMessageComponent = (function () {
    function CreateEditMessageComponent(af, router) {
        this.af = af;
        this.router = router;
        this.inactive = true;
        this.alerts = {};
        this.msgData = {};
        this.groups = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateEditMessageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                console.log('uid: ' + _this.uid);
                _this.agencyGroupPath = Constants_1.Constants.APP_STATUS + '/group/agency/' + _this.uid + '/';
                _this.agencyMessageRefPath = '/messageRef/agency/' + _this.uid + '/';
            }
            else {
                console.log("Error occurred - User isn't logged in");
                _this.navigateToLogin();
            }
        });
    };
    CreateEditMessageComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.msgData = {};
    };
    CreateEditMessageComponent.prototype.onSubmit = function () {
        if (this.validate()) {
            this.createNewMessage();
            this.inactive = true;
        }
        else {
            this.showAlert();
        }
    };
    CreateEditMessageComponent.prototype.createNewMessage = function () {
        var _this = this;
        this.af.database.list(this.agencyGroupPath)
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
                    var sentMsgPath = '/administratorAgency/' + _this.uid + '/sentmessages/' + msgId.key;
                    _this.msgData[sentMsgPath] = true;
                    _this.addMsgToMessageRef(msgId.key);
                });
            }
        });
    };
    CreateEditMessageComponent.prototype.addMsgToMessageRef = function (key) {
        var _this = this;
        if (this.allUsersSelected) {
            var agencyAllUsersSelected = this.agencyGroupPath + 'agencyallusersgroup/';
            var agencyAllUsersMessageRefPath_1 = this.agencyMessageRefPath + 'agencyallusersgroup/';
            this.af.database.list(agencyAllUsersSelected)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (agencyAllUsersIds) {
                agencyAllUsersIds.forEach(function (agencyAllUsersId) {
                    _this.msgData[agencyAllUsersMessageRefPath_1 + agencyAllUsersId.$key + '/' + key] = _this.currentDateTimeInMilliseconds;
                });
                _this.af.database.object(Constants_1.Constants.APP_STATUS).update(_this.msgData).then(function (_) {
                    console.log("Message Ref successfully added to all nodes");
                    _this.router.navigate(['/agency-admin/agency-messages']);
                }).catch(function (error) {
                    console.log("Message creation unsuccessful" + error);
                });
            });
        }
        else {
            if (this.globalDirectorSelected) {
                this.groups.push('globaldirector');
            }
            if (this.globalUserSelected) {
                this.groups.push('globaluser');
            }
            if (this.regionalDirectorSelected) {
                this.groups.push('regionaldirector');
            }
            if (this.countryAdminsSelected) {
                this.groups.push('countryadmins');
            }
            if (this.countryDirectorsSelected) {
                this.groups.push('countrydirectors');
            }
            if (this.ertLeadsSelected) {
                this.groups.push('ertleads');
            }
            if (this.ertsSelected) {
                this.groups.push('erts');
            }
            if (this.donorSelected) {
                this.groups.push('donor');
            }
            if (this.partnerSelected) {
                this.groups.push('partner');
            }
            var _loop_1 = function (group) {
                var path = this_1.agencyGroupPath + group;
                this_1.af.database.list(path)
                    .takeUntil(this_1.ngUnsubscribe)
                    .subscribe(function (list) {
                    list.forEach(function (item) {
                        _this.msgData[_this.agencyMessageRefPath + group + '/' + item.$key + '/' + key] = _this.currentDateTimeInMilliseconds;
                    });
                    if (_this.groups.indexOf(group) == _this.groups.length - 1) {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS).update(_this.msgData).then(function (_) {
                            console.log("Message Ref successfully added to all nodes");
                            _this.router.navigate(['/agency-admin/agency-messages']);
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
    CreateEditMessageComponent.prototype.showAlert = function () {
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
    CreateEditMessageComponent.prototype.validate = function () {
        if (!Boolean(this.messageTitle)) {
            this.alerts[this.messageTitle] = true;
            this.errorMessage = 'MESSAGES.NO_TITLE_ERROR';
            return false;
        }
        else if (!Boolean(this.messageContent)) {
            this.alerts[this.messageContent] = true;
            this.errorMessage = 'MESSAGES.NO_CONTENT_ERROR';
            return false;
        }
        else if ((!this.allUsersSelected)
            && (!this.globalDirectorSelected)
            && (!this.globalUserSelected)
            && (!this.regionalDirectorSelected)
            && (!this.countryAdminsSelected)
            && (!this.countryDirectorsSelected)
            && (!this.ertLeadsSelected)
            && (!this.ertsSelected)
            && (!this.donorSelected)
            && (!this.partnerSelected)) {
            this.errorMessage = 'MESSAGES.NO_RECIPIENTS_ERROR';
            return false;
        }
        return true;
    };
    CreateEditMessageComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return CreateEditMessageComponent;
}());
CreateEditMessageComponent = __decorate([
    core_1.Component({
        selector: 'app-create-edit-message',
        templateUrl: './create-edit-message.component.html',
        styleUrls: ['./create-edit-message.component.css']
    })
], CreateEditMessageComponent);
exports.CreateEditMessageComponent = CreateEditMessageComponent;
