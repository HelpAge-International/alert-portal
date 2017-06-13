"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var Constants_1 = require("../../../utils/Constants");
var Enums_1 = require("../../../utils/Enums");
var rxjs_1 = require("rxjs");
var countryoffice_address_model_1 = require("../../../model/countryoffice.address.model");
var NewCountryDetailsComponent = (function () {
    function NewCountryDetailsComponent(firebaseApp, af, router, subscriptions) {
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.countryAdminCountryId = '';
        this.successInactive = true;
        this.successMessage = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
        this.errorInactive = true;
        this.alerts = {};
        this.CountryOfficeAddressModel = new countryoffice_address_model_1.CountryOfficeAddressModel();
        this.Country = Constants_1.Constants.COUNTRY;
        this.countriesList = [];
        this.firebase = firebaseApp;
    }
    NewCountryDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                var userPublicSubscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid).subscribe(function (user) {
                    _this.countryAdminName = user.firstName;
                });
                var countryAdminSubscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + '/administratorCountry/' + _this.uid)
                    .subscribe(function (countryAdmin) {
                    // Get the country administrator id and agency administrator id
                    _this.countryAdminCountryId = countryAdmin.countryId;
                    _this.agencyAdminId = countryAdmin.agencyAdmin ? Object.keys(countryAdmin.agencyAdmin)[0] : '';
                    var countryOfficeSubscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.agencyAdminId + "/" + _this.countryAdminCountryId)
                        .subscribe(function (countryOffice) {
                        // Get the country office location to pre populate the country select
                        _this.CountryOfficeAddressModel.location = countryOffice.location;
                        // Set the phone prefix
                        _this.CountryOfficeAddressModel.phone = '+' + Enums_1.PhonePrefix[Enums_1.Countries[countryOffice.location]];
                    });
                    // If there are any errors raised by firebase, the Country select will not be disabled and will allow user input
                });
                _this.subscriptions.add(userPublicSubscription);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
        this.subscriptions.add(subscription);
    };
    NewCountryDetailsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    NewCountryDetailsComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId + '/' + this.countryAdminCountryId + '/')
                .update(this.CountryOfficeAddressModel).then(function () {
                // update the firstLogin flag
                _this.af.database.object(Constants_1.Constants.APP_STATUS + '/administratorCountry/' + _this.uid + '/').update({ firstLogin: false });
                _this.successInactive = false;
                var subscription = rxjs_1.Observable.timer(1500).subscribe(function () {
                    _this.successInactive = true;
                    _this.router.navigateByUrl(Constants_1.Constants.COUNTRY_ADMIN_HOME);
                });
                _this.subscriptions.add(subscription);
            }, function (error) {
                _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                _this.showAlert();
            });
        }
        else {
            this.showAlert();
        }
    };
    NewCountryDetailsComponent.prototype.showAlert = function () {
        var _this = this;
        this.errorInactive = false;
        var subscription = rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION).subscribe(function () {
            _this.errorInactive = true;
        });
        this.subscriptions.add(subscription);
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    NewCountryDetailsComponent.prototype.validate = function () {
        this.alerts = {};
        if (!(this.CountryOfficeAddressModel.addressLine1)) {
            this.alerts[this.CountryOfficeAddressModel.addressLine1] = true;
            this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
            return false;
        }
        else if (!(this.CountryOfficeAddressModel.location)) {
            this.alerts[this.CountryOfficeAddressModel.location] = true;
            this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_COUNTRY";
            return false;
        }
        else if (!(this.CountryOfficeAddressModel.city)) {
            this.alerts[this.CountryOfficeAddressModel.city] = true;
            this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_CITY";
            return false;
        }
        else if (!(this.CountryOfficeAddressModel.phone)) {
            this.alerts[this.CountryOfficeAddressModel.phone] = true;
            this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_PHONE";
            return false;
        }
        return true;
    };
    return NewCountryDetailsComponent;
}());
NewCountryDetailsComponent = __decorate([
    core_1.Component({
        selector: 'app-new-country-details',
        templateUrl: './new-country-details.component.html',
        styleUrls: ['./new-country-details.component.css']
    }),
    __param(0, core_1.Inject(angularfire2_1.FirebaseApp))
], NewCountryDetailsComponent);
exports.NewCountryDetailsComponent = NewCountryDetailsComponent;
