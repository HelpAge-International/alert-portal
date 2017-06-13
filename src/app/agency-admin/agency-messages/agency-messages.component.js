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
var AgencyMessagesComponent = (function () {
    function AgencyMessagesComponent(af, router) {
        this.af = af;
        this.router = router;
        this.sentMessages = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AgencyMessagesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/administratorAgency/' + _this.uid + '/sentmessages')
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
    AgencyMessagesComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AgencyMessagesComponent.prototype.deleteMessage = function (sentMessage) {
        this.messageToDelete = sentMessage.$key;
        jQuery("#delete-message").modal("show");
    };
    // TODO - FIX
    AgencyMessagesComponent.prototype.deleteFromFirebase = function () {
        var _this = this;
        var msgData = {};
        var groups = [
            'agencyallusersgroup',
            'globaldirector',
            'globaluser',
            'regionaldirector',
            'countryadmins',
            'countrydirectors',
            'ertleads',
            'erts',
            'donor',
            'partner'
        ];
        console.log(groups.length);
        msgData['/administratorAgency/' + this.uid + '/sentmessages/' + this.messageToDelete] = null;
        msgData['/message/' + this.messageToDelete] = null;
        var agencyGroupPath = Constants_1.Constants.APP_STATUS + '/group/agency/' + this.uid + '/';
        var agencyMessageRefPath = '/messageRef/agency/' + this.uid + '/';
        var _loop_1 = function (group) {
            var groupPath = agencyGroupPath + group;
            var msgRefPath = agencyMessageRefPath + group;
            this_1.af.database.list(groupPath)
                .takeUntil(this_1.ngUnsubscribe)
                .subscribe(function (list) {
                list.forEach(function (item) {
                    msgData[msgRefPath + '/' + item.$key + '/' + _this.messageToDelete] = null;
                });
                if (groups.indexOf(group) == groups.length - 1) {
                    _this.af.database.object(Constants_1.Constants.APP_STATUS).update(msgData).then(function () {
                        console.log("Message Ref successfully deleted from all nodes");
                        jQuery("#delete-message").modal("hide");
                    }).catch(function (error) {
                        console.log("Message deletion unsuccessful" + error);
                    });
                }
            });
        };
        var this_1 = this;
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var group = groups_1[_i];
            _loop_1(group);
        }
    };
    AgencyMessagesComponent.prototype.closeModal = function () {
        jQuery("#delete-message").modal("hide");
    };
    AgencyMessagesComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return AgencyMessagesComponent;
}());
AgencyMessagesComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-messages',
        templateUrl: './agency-messages.component.html',
        styleUrls: ['./agency-messages.component.css']
    })
], AgencyMessagesComponent);
exports.AgencyMessagesComponent = AgencyMessagesComponent;
