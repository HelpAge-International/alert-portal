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
var Enums_1 = require("../../utils/Enums");
var user_public_model_1 = require("../../model/user-public.model");
var rxjs_1 = require("rxjs");
var CustomValidator_1 = require("../../utils/CustomValidator");
var AgencyAccountSettingsComponent = (function () {
    function AgencyAccountSettingsComponent(af, router) {
        this.af = af;
        this.router = router;
        this.successInactive = true;
        this.successMessage = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
        this.errorInactive = true;
        this.alerts = {};
        this.agencyAdminTitle = 0;
        this.PersonTitle = Constants_1.Constants.PERSON_TITLE;
        this.personTitleList = [Enums_1.PersonTitle.Mr, Enums_1.PersonTitle.Mrs, Enums_1.PersonTitle.Miss, Enums_1.PersonTitle.Dr, Enums_1.PersonTitle.Prof];
        this.Country = Constants_1.Constants.COUNTRY;
        this.countriesList = [Enums_1.Country.UK, Enums_1.Country.France, Enums_1.Country.Germany];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AgencyAccountSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.authState = auth;
                _this.uid = auth.uid;
                console.log("Agency admin uid: " + _this.uid);
                _this.loadAgencyAdminData(_this.uid);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    AgencyAccountSettingsComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AgencyAccountSettingsComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            if (this.userPublic) {
                var editedUser = new user_public_model_1.ModelUserPublic(this.agencyAdminFirstName, this.agencyAdminLastName, this.agencyAdminTitle, this.agencyAdminEmail);
                editedUser.addressLine1 = this.agencyAdminAddressLine1;
                editedUser.addressLine2 = this.agencyAdminAddressLine2;
                editedUser.addressLine3 = this.agencyAdminAddressLine3;
                editedUser.country = this.agencyAdminCountry;
                editedUser.city = this.agencyAdminCity;
                editedUser.postCode = this.agencyAdminPostCode;
                var noChanges = editedUser.title == this.userPublic.title
                    && editedUser.firstName == this.userPublic.firstName
                    && editedUser.lastName == this.userPublic.lastName
                    && editedUser.email == this.userPublic.email
                    && editedUser.addressLine1 == this.userPublic.addressLine1
                    && editedUser.addressLine2 == this.userPublic.addressLine2
                    && editedUser.addressLine3 == this.userPublic.addressLine3
                    && editedUser.country == this.userPublic.country
                    && editedUser.city == this.userPublic.city
                    && editedUser.postCode == this.userPublic.postCode;
                if (noChanges) {
                    this.errorMessage = 'GLOBAL.NO_CHANGES_MADE';
                    this.showAlert(true);
                }
                else {
                    var emailChanged = editedUser.email != this.userPublic.email;
                    if (emailChanged) {
                        this.authState.auth.updateEmail(this.agencyAdminEmail).then(function (_) {
                            _this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + _this.uid).update(editedUser).then(function () {
                                _this.showAlert(false);
                            }, function (error) {
                                _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                                _this.showAlert(true);
                                console.log(error.message);
                            });
                        });
                    }
                    else {
                        this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + this.uid).update(editedUser).then(function () {
                            _this.showAlert(false);
                        }, function (error) {
                            _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                            _this.showAlert(true);
                            console.log(error.message);
                        });
                    }
                }
            }
        }
        else {
            this.showAlert(true);
        }
    };
    AgencyAccountSettingsComponent.prototype.loadAgencyAdminData = function (uid) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (agencyAdmin) {
            _this.userPublic = agencyAdmin;
            _this.agencyAdminTitle = agencyAdmin.title;
            _this.agencyAdminFirstName = agencyAdmin.firstName;
            _this.agencyAdminLastName = agencyAdmin.lastName;
            _this.agencyAdminEmail = agencyAdmin.email;
            _this.agencyAdminAddressLine1 = agencyAdmin.addressLine1;
            _this.agencyAdminAddressLine2 = agencyAdmin.addressLine2;
            _this.agencyAdminAddressLine3 = agencyAdmin.addressLine3;
            _this.agencyAdminCountry = agencyAdmin.country;
            _this.agencyAdminCity = agencyAdmin.city;
            _this.agencyAdminPostCode = agencyAdmin.postCode;
        });
    };
    AgencyAccountSettingsComponent.prototype.showAlert = function (error) {
        var _this = this;
        if (error) {
            this.errorInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.errorInactive = true;
            });
        }
        else {
            this.successInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe).subscribe(function () {
                _this.successInactive = true;
            });
        }
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    AgencyAccountSettingsComponent.prototype.validate = function () {
        this.alerts = {};
        if (!(this.agencyAdminFirstName)) {
            this.alerts[this.agencyAdminFirstName] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME';
            return false;
        }
        else if (!(this.agencyAdminLastName)) {
            this.alerts[this.agencyAdminLastName] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME';
            return false;
        }
        else if (!(this.agencyAdminEmail)) {
            this.alerts[this.agencyAdminEmail] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_EMAIL';
            return false;
        }
        else if (!CustomValidator_1.CustomerValidator.EmailValidator(this.agencyAdminEmail)) {
            this.alerts[this.agencyAdminEmail] = true;
            this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
            return false;
        }
        return true;
    };
    return AgencyAccountSettingsComponent;
}());
AgencyAccountSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-account-settings',
        templateUrl: './agency-account-settings.component.html',
        styleUrls: ['./agency-account-settings.component.css']
    })
], AgencyAccountSettingsComponent);
exports.AgencyAccountSettingsComponent = AgencyAccountSettingsComponent;
