"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var alert_message_model_1 = require("../../../../model/alert-message.model");
var Enums_1 = require("../../../../utils/Enums");
var external_recipient_model_1 = require("../../../../model/external-recipient.model");
var Constants_1 = require("../../../../utils/Constants");
var display_error_1 = require("../../../../errors/display.error");
var CountryAddExternalRecipientComponent = (function () {
    function CountryAddExternalRecipientComponent(_userService, _notificationSettingsService, _messageService, router, route, subscriptions) {
        this._userService = _userService;
        this._notificationSettingsService = _notificationSettingsService;
        this._messageService = _messageService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        this.isEdit = false;
        // Constants and enums
        this.PERSON_TITLE = Constants_1.Constants.PERSON_TITLE;
        this.PERSON_TITLE_SELECTION = Constants_1.Constants.PERSON_TITLE_SELECTION;
        this.NOTIFICATION_SETTINGS = Constants_1.Constants.NOTIFICATION_SETTINGS;
        // Models
        this.alertMessage = null;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.externalRecipient = new external_recipient_model_1.ExternalRecipientModel();
    }
    CountryAddExternalRecipientComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            try {
                _this._userService.getCountryAdminUser(_this.uid).subscribe(function (countryAdminUser) {
                    if (countryAdminUser) {
                        _this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
                        _this.countryId = countryAdminUser.countryId;
                        var editSubscription = _this.route.params.subscribe(function (params) {
                            if (params['id']) {
                                _this.isEdit = true;
                                var getExternalRecipientSubscription = _this._messageService.getCountryExternalRecipient(_this.countryId, params['id'])
                                    .subscribe(function (externalRecipient) {
                                    if (externalRecipient) {
                                        _this.externalRecipient = externalRecipient;
                                    }
                                    else {
                                        throw new display_error_1.DisplayError('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.RECIPIENT_NOT_FOUND');
                                    }
                                }, function (err) { throw new Error(err.message); });
                                _this.subscriptions.add(getExternalRecipientSubscription);
                            }
                            else {
                                var notificationSettingsSubscription = _this._notificationSettingsService.getNotificationSettings(_this.agencyId)
                                    .subscribe(function (notificationSettings) { _this.externalRecipient.notificationsSettings = notificationSettings; });
                                _this.subscriptions.add(notificationSettingsSubscription);
                            }
                        });
                        _this.subscriptions.add(editSubscription);
                    }
                });
            }
            catch (err) {
                if (err instanceof display_error_1.DisplayError) {
                    _this.alertMessage = new alert_message_model_1.AlertMessageModel(err.message);
                }
                else {
                    _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR');
                }
            }
        });
        this.subscriptions.add(authSubscription);
    };
    CountryAddExternalRecipientComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryAddExternalRecipientComponent.prototype.validateForm = function () {
        this.alertMessage = this.externalRecipient.validate();
        return !this.alertMessage;
    };
    CountryAddExternalRecipientComponent.prototype.submit = function () {
        var _this = this;
        this._messageService.saveCountryExternalRecipient(this.externalRecipient, this.countryId)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.SAVED_RECIPIENT_SUCCESS', Enums_1.AlertMessageType.Success);
            setTimeout(function () { return _this.goBack(); }, Constants_1.Constants.ALERT_REDIRECT_DURATION);
        })
            .catch(function (err) {
            if (err instanceof display_error_1.DisplayError) {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel(err.message);
            }
            else {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
        });
    };
    CountryAddExternalRecipientComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/country-admin/settings/country-notification-settings');
    };
    CountryAddExternalRecipientComponent.prototype.deleteRecipient = function () {
        jQuery('#delete-action').modal('show');
    };
    CountryAddExternalRecipientComponent.prototype.deleteAction = function () {
        var _this = this;
        this.closeModal();
        var deleteCountryExternalRecipientSubscription = this._messageService.deleteCountryExternalRecipient(this.countryId, this.externalRecipient.id)
            .then(function () {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.SUCCESS_DELETED', Enums_1.AlertMessageType.Success);
            _this.goBack();
        })
            .catch(function (err) { return _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR'); });
    };
    CountryAddExternalRecipientComponent.prototype.closeModal = function () {
        jQuery('#delete-action').modal('hide');
    };
    return CountryAddExternalRecipientComponent;
}());
CountryAddExternalRecipientComponent = __decorate([
    core_1.Component({
        selector: 'app-country-add-external-recipient',
        templateUrl: './country-add-external-recipient.component.html',
        styleUrls: ['./country-add-external-recipient.component.css']
    })
], CountryAddExternalRecipientComponent);
exports.CountryAddExternalRecipientComponent = CountryAddExternalRecipientComponent;
