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
var MessagesComponent = (function () {
    function MessagesComponent(af, router) {
        this.af = af;
        this.router = router;
        this.sentMessages = [];
        this.msgData = {};
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    MessagesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/systemAdmin/' + _this.uid + '/sentmessages')
                    .flatMap(function (list) {
                    _this.sentMessages = [];
                    var tempList = [];
                    list.forEach(function (x) {
                        tempList.push(x);
                    });
                    return rxjs_1.Observable.from(tempList);
                })
                    .flatMap(function (item) {
                    return _this.af.database.object(Constants_1.Constants.APP_STATUS + '/message/' + item.$key);
                })
                    .distinctUntilChanged()
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (x) {
                    _this.sentMessages.push(x);
                });
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    MessagesComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    MessagesComponent.prototype.deleteMessage = function (sentMessage) {
        this.messageToDelete = sentMessage.$key;
        jQuery("#delete-message").modal("show");
    };
    MessagesComponent.prototype.deleteFromFirebase = function () {
        var _this = this;
        this.msgData = {};
        this.msgData['/systemAdmin/' + this.uid + '/sentmessages/' + this.messageToDelete] = null;
        this.msgData['/message/' + this.messageToDelete] = null;
        var allUsersGroupPath = Constants_1.Constants.APP_STATUS + '/group/systemadmin/allusersgroup';
        var allAgencyAdminsGroupPath = Constants_1.Constants.APP_STATUS + '/group/systemadmin/allagencyadminsgroup';
        var allCountryAdminsGroupPath = Constants_1.Constants.APP_STATUS + '/group/systemadmin/allcountryadminsgroup';
        var allNetworkAdminsGroupPath = Constants_1.Constants.APP_STATUS + '/group/systemadmin/allnetworkadminsgroup';
        var allUsersMsgRefPath = '/messageRef/systemadmin/allusersgroup/';
        var allAgencyAdminsMsgRef = '/messageRef/systemadmin/allagencyadminsgroup/';
        var allCountryAdminsMsgRef = '/messageRef/systemadmin/allcountryadminsgroup/';
        var allNetworkAdminsMsgRef = '/messageRef/systemadmin/allnetworkadminsgroup/';
        this.af.database.list(allUsersGroupPath)
            .do(function (list) {
            list.forEach(function (item) {
                _this.msgData[allUsersMsgRefPath + item.$key + '/' + _this.messageToDelete] = null;
            });
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function () {
            _this.af.database.list(allAgencyAdminsGroupPath)
                .do(function (list) {
                list.forEach(function (item) {
                    _this.msgData[allAgencyAdminsMsgRef + item.$key + '/' + _this.messageToDelete] = null;
                });
            })
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function () {
                _this.af.database.list(allCountryAdminsGroupPath)
                    .do(function (list) {
                    list.forEach(function (item) {
                        _this.msgData[allCountryAdminsMsgRef + item.$key + '/' + _this.messageToDelete] = null;
                    });
                })
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function () {
                    _this.af.database.list(allNetworkAdminsGroupPath)
                        .do(function (list) {
                        list.forEach(function (item) {
                            _this.msgData[allNetworkAdminsMsgRef + item.$key + '/' + _this.messageToDelete] = null;
                        });
                    })
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function () {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS).update(_this.msgData).then(function () {
                            console.log('Message Ref successfully deleted from all nodes');
                            jQuery("#delete-message").modal("hide");
                            // this.router.navigate(['/system-admin/messages']);
                        });
                    });
                });
            });
        });
    };
    MessagesComponent.prototype.closeModal = function () {
        jQuery("#delete-message").modal("hide");
    };
    MessagesComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return MessagesComponent;
}());
MessagesComponent = __decorate([
    core_1.Component({
        selector: 'app-messages',
        templateUrl: './messages.component.html',
        styleUrls: ['./messages.component.css']
    })
], MessagesComponent);
exports.MessagesComponent = MessagesComponent;
