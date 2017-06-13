"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var alert_message_model_1 = require("../../../model/alert-message.model");
var Enums_1 = require("../../../utils/Enums");
var message_model_1 = require("../../../model/message.model");
var Constants_1 = require("../../../utils/Constants");
var display_error_1 = require("../../../errors/display.error");
var CountryCreateEditMessageComponent = (function () {
    function CountryCreateEditMessageComponent(_userService, _messageService, router, route, subscriptions) {
        this._userService = _userService;
        this._messageService = _messageService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        // Constants and enums
        this.USER_TYPE = Constants_1.Constants.USER_TYPE;
        this.USER_TYPE_SELECTION = Constants_1.Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION;
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.userMessage = new message_model_1.MessageModel();
        console.log(this.USER_TYPE_SELECTION);
    }
    CountryCreateEditMessageComponent.prototype.ngOnInit = function () {
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
                }
            });
        });
        this.subscriptions.add(authSubscription);
    };
    CountryCreateEditMessageComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryCreateEditMessageComponent.prototype.validateForm = function () {
        this.alertMessage = this.userMessage.validate();
        return !this.alertMessage;
    };
    CountryCreateEditMessageComponent.prototype.submit = function () {
        var _this = this;
        console.log('submit called');
        this.userMessage.time = new Date().getTime();
        this.userMessage.senderId = this.uid;
        this._messageService.saveCountryMessage(this.countryId, this.agencyId, this.userMessage).then(function () {
            console.log('function out!');
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('MESSAGES.SENT_SUCCESS', Enums_1.AlertMessageType.Success);
            setTimeout(function () { return _this.router.navigateByUrl('/country-admin/country-messages'); }, Constants_1.Constants.ALERT_REDIRECT_DURATION);
        })
            .catch(function (err) {
            if (err instanceof display_error_1.DisplayError) {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel(err.message);
            }
            else {
                console.log(err);
                _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
        });
    };
    CountryCreateEditMessageComponent.prototype.recipientSelected = function (selectedRecipient) {
        var _this = this;
        var allUserChecked = this.userMessage.userType[Enums_1.UserType.All];
        if (selectedRecipient == Enums_1.UserType.All && !allUserChecked) {
            Constants_1.Constants.USER_TYPE_SELECTION.forEach(function (userType) {
                _this.userMessage.userType[userType] = true;
            });
        }
        else if (selectedRecipient == Enums_1.UserType.All && allUserChecked) {
            Constants_1.Constants.USER_TYPE_SELECTION.forEach(function (userType) {
                _this.userMessage.userType[userType] = false;
            });
        }
        else if (selectedRecipient != Enums_1.UserType.CountryAdmin && selectedRecipient !== Enums_1.UserType.CountryDirector && allUserChecked) {
            this.userMessage.userType[Enums_1.UserType.All] = false;
        }
    };
    return CountryCreateEditMessageComponent;
}());
CountryCreateEditMessageComponent = __decorate([
    core_1.Component({
        selector: 'app-country-create-edit-message',
        templateUrl: './country-create-edit-message.component.html',
        styleUrls: ['./country-create-edit-message.component.css']
    })
], CountryCreateEditMessageComponent);
exports.CountryCreateEditMessageComponent = CountryCreateEditMessageComponent;
