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
var message_model_1 = require("../../model/message.model");
var alert_message_model_1 = require("../../model/alert-message.model");
var Enums_1 = require("../../utils/Enums");
var CountryMessagesComponent = (function () {
    function CountryMessagesComponent(_userService, _messageService, router, route, subscriptions) {
        this._userService = _userService;
        this._messageService = _messageService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.sentMessages = [new message_model_1.MessageModel()];
    }
    CountryMessagesComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            _this._userService.getCountryAdminUser(_this.uid).subscribe(function (countryAdminUser) {
                if (countryAdminUser) {
                    _this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
                    _this.countryId = countryAdminUser.countryId;
                    _this._messageService.getCountrySentMessages(_this.countryId)
                        .subscribe(function (sentMessages) {
                        if (sentMessages) {
                            _this.sentMessages = sentMessages;
                        }
                    });
                }
            });
        });
        this.subscriptions.add(authSubscription);
    };
    CountryMessagesComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryMessagesComponent.prototype.deleteMessage = function (deleteMessageId) {
        jQuery('#delete-action').modal('show');
        this.deleteMessageId = deleteMessageId;
    };
    CountryMessagesComponent.prototype.deleteAction = function () {
        var _this = this;
        this.closeModal();
        console.log('delete called');
        this._messageService.deleteCountryMessage(this.countryId, this.agencyId, this.deleteMessageId)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('MESSAGES.DELETE_SUCCESS', Enums_1.AlertMessageType.Success);
        })
            .catch(function (err) { _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR'); });
    };
    CountryMessagesComponent.prototype.closeModal = function () {
        jQuery('#delete-action').modal('hide');
    };
    return CountryMessagesComponent;
}());
CountryMessagesComponent = __decorate([
    core_1.Component({
        selector: 'app-country-messages',
        templateUrl: './country-messages.component.html',
        styleUrls: ['./country-messages.component.css']
    })
], CountryMessagesComponent);
exports.CountryMessagesComponent = CountryMessagesComponent;
