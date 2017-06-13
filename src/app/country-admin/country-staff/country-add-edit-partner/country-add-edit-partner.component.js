"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../../utils/Constants");
var Enums_1 = require("../../../utils/Enums");
var alert_message_model_1 = require("../../../model/alert-message.model");
var partner_organisation_service_1 = require("../../../services/partner-organisation.service");
var partner_model_1 = require("../../../model/partner.model");
var notification_settings_service_1 = require("../../../services/notification-settings.service");
var user_public_model_1 = require("../../../model/user-public.model");
var user_service_1 = require("../../../services/user.service");
var display_error_1 = require("../../../errors/display.error");
var CountryAddEditPartnerComponent = (function () {
    function CountryAddEditPartnerComponent(_userService, _partnerOrganisationService, _notificationSettingsService, _sessionService, router, route, subscriptions) {
        this._userService = _userService;
        this._partnerOrganisationService = _partnerOrganisationService;
        this._notificationSettingsService = _notificationSettingsService;
        this._sessionService = _sessionService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        this.isEdit = false;
        // Constants and enums
        this.userTitle = Constants_1.Constants.PERSON_TITLE;
        this.userTitleSelection = Constants_1.Constants.PERSON_TITLE_SELECTION;
        this.notificationsSettingsSelection = Constants_1.Constants.NOTIFICATION_SETTINGS;
        this.alertMessageType = Enums_1.AlertMessageType;
        // Models
        this.alertMessage = null;
        this.partnerOrganisations = [];
        this.partner = this._sessionService.partner || new partner_model_1.PartnerModel();
        this.partnerOrganisations = [];
        this.userPublic = this._sessionService.user || new user_public_model_1.ModelUserPublic(null, null, null, null); // no parameterless constructor
    }
    CountryAddEditPartnerComponent.prototype.ngOnDestroy = function () {
        this._sessionService.partner = null;
        this._sessionService.user = null;
        this.subscriptions.releaseAll();
    };
    CountryAddEditPartnerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            try {
                _this._userService.getCountryAdminUser(_this.uid).subscribe(function (countryAdminUser) {
                    _this.countryAdmin = countryAdminUser;
                    _this._partnerOrganisationService.getPartnerOrganisations()
                        .subscribe(function (partnerOrganisations) { _this.partnerOrganisations = partnerOrganisations; });
                    var editSubscription = _this.route.params.subscribe(function (params) {
                        if (params['id']) {
                            _this.isEdit = true;
                            var userSubscription = _this._userService.getUser(params['id']).subscribe(function (user) {
                                if (user) {
                                    if (user) {
                                        _this.userPublic = user;
                                    }
                                }
                            });
                            _this.subscriptions.add(userSubscription);
                            var partnerSubscription = _this._userService.getPartnerUser(params['id']).subscribe(function (partner) {
                                if (partner) {
                                    if (partner) {
                                        _this.partner = partner;
                                    }
                                }
                            });
                            _this.subscriptions.add(partnerSubscription);
                        }
                        else {
                            _this._notificationSettingsService.getNotificationSettings(Object.keys(_this.countryAdmin.agencyAdmin)[0])
                                .subscribe(function (notificationSettings) { _this.partner.notificationSettings = notificationSettings; });
                        }
                    });
                    _this.subscriptions.add(editSubscription);
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        this.subscriptions.add(authSubscription);
    };
    CountryAddEditPartnerComponent.prototype.setPartnerOrganisation = function (optionSelected) {
        if (optionSelected === 'addNewPartnerOrganisation') {
            this.router.navigateByUrl('response-plans/add-partner-organisation');
        }
    };
    CountryAddEditPartnerComponent.prototype.validateForm = function () {
        this.alertMessage = this.partner.validate() || this.userPublic.validate(['city']);
        /*
        *  Specific component validation BELOW
        *
        * if(this.partner.projectName === this.userPublic.firstName  )
        * {
        *   this.alertMessage = new AlertMessageModel('ERROR message');
        * }
        */
        return !this.alertMessage;
    };
    CountryAddEditPartnerComponent.prototype.submit = function () {
        var _this = this;
        this._userService.savePartnerUser(this.partner, this.userPublic)
            .then(function (user) {
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.PARTNER.SUCCESS_SAVED', Enums_1.AlertMessageType.Success);
            setTimeout(function () { return _this.router.navigateByUrl('/country-admin/country-staff'); }, Constants_1.Constants.ALERT_REDIRECT_DURATION);
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
    CountryAddEditPartnerComponent.prototype.deletePartner = function () {
        jQuery('#delete-action').modal('show');
    };
    CountryAddEditPartnerComponent.prototype.deleteAction = function () {
        var _this = this;
        this.closeModal();
        this._userService.deletePartnerUser(this.partner.id)
            .then(function () {
            _this.router.navigateByUrl('/country-admin/country-staff');
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('COUNTRY_ADMIN.PARTNER.SUCCESS_DELETED', Enums_1.AlertMessageType.Success);
        })
            .catch(function (err) { return _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR'); });
    };
    CountryAddEditPartnerComponent.prototype.closeModal = function () {
        jQuery('#delete-action').modal('hide');
    };
    CountryAddEditPartnerComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/country-admin/country-staff');
    };
    return CountryAddEditPartnerComponent;
}());
CountryAddEditPartnerComponent = __decorate([
    core_1.Component({
        selector: 'app-country-add-edit-partner',
        templateUrl: './country-add-edit-partner.component.html',
        styleUrls: ['./country-add-edit-partner.component.css'],
        providers: [partner_organisation_service_1.PartnerOrganisationService, notification_settings_service_1.NotificationSettingsService, user_service_1.UserService]
    })
], CountryAddEditPartnerComponent);
exports.CountryAddEditPartnerComponent = CountryAddEditPartnerComponent;
