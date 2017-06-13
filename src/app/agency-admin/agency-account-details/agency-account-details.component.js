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
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var rxjs_1 = require("rxjs");
var agency_model_1 = require("../../model/agency.model");
var AgencyAccountDetailsComponent = (function () {
    function AgencyAccountDetailsComponent(firebaseApp, af, router) {
        this.af = af;
        this.router = router;
        this.successInactive = true;
        this.successMessage = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
        this.errorInactive = true;
        this.alerts = {};
        this.agencyLogo = '';
        this.agencyAddressLine1 = '';
        this.agencyAddressLine2 = '';
        this.agencyAddressLine3 = '';
        this.agencyCity = '';
        this.agencyPostCode = '';
        this.agencyPhone = '';
        this.agencyWebAddress = '';
        this.Country = Constants_1.Constants.COUNTRY;
        this.countriesList = [Enums_1.Country.UK, Enums_1.Country.France, Enums_1.Country.Germany];
        this.Currency = Constants_1.Constants.CURRENCY;
        this.currenciesList = [Enums_1.Currency.GBP, Enums_1.Currency.USD, Enums_1.Currency.EUR];
        this.showReplaceRemoveLinks = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
        this.firebase = firebaseApp;
    }
    AgencyAccountDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorAgency/" + _this.uid + "/agencyId")
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (id) {
                    _this.agencyId = id.$value;
                    _this.loadAgencyData(_this.agencyId);
                });
                console.log("Agency admin uid: " + _this.agencyId);
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    AgencyAccountDetailsComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AgencyAccountDetailsComponent.prototype.fileChange = function (event) {
        var _this = this;
        if (event.target.files.length > 0) {
            this.logoFile = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.showReplaceRemoveLinks = true;
                _this.setLogoPreview(event.target.result);
            };
            reader.readAsDataURL(this.logoFile);
        }
    };
    AgencyAccountDetailsComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            if (this.modalAgency) {
                var editedAgency = new agency_model_1.ModelAgency(this.modalAgency.name);
                editedAgency.addressLine1 = this.agencyAddressLine1;
                editedAgency.addressLine2 = this.agencyAddressLine2;
                editedAgency.addressLine3 = this.agencyAddressLine3;
                editedAgency.country = this.agencyCountry;
                editedAgency.city = this.agencyCity;
                editedAgency.postCode = this.agencyPostCode;
                editedAgency.phone = this.agencyPhone;
                editedAgency.website = this.agencyWebAddress;
                editedAgency.currency = this.agencyCurrency;
                var noChanges = editedAgency.addressLine1 == this.modalAgency.addressLine1
                    && editedAgency.addressLine2 == this.modalAgency.addressLine2
                    && editedAgency.addressLine3 == this.modalAgency.addressLine3
                    && editedAgency.country == this.modalAgency.country
                    && editedAgency.city == this.modalAgency.city
                    && editedAgency.postCode == this.modalAgency.postCode
                    && editedAgency.phone == this.modalAgency.phone
                    && editedAgency.website == this.modalAgency.website
                    && editedAgency.currency == this.modalAgency.currency
                    && this.logoFile == null; // no image was uploaded
                if (noChanges) {
                    this.errorMessage = 'GLOBAL.NO_CHANGES_MADE';
                    this.showAlert(true);
                }
                else {
                    if (this.logoFile == null) {
                        this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.agencyId).update(editedAgency).then(function () {
                            _this.showAlert(false);
                        }, function (error) {
                            _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                            _this.showAlert(true);
                            console.log(error.message);
                        });
                    }
                    else {
                        this.uploadAgencyLogo().then(function (result) {
                            var oldLogo = _this.agencyLogo;
                            // update the logo preview default placeholder and agency model
                            _this.agencyLogo = result;
                            console.log(_this.agencyLogo);
                            editedAgency.logoPath = _this.agencyLogo;
                            // remove the old logo from firebase
                            try {
                                // check if the newly uploaded image is diferrent than the old one
                                if (_this.firebase.storage().refFromURL(oldLogo).location.path != _this.firebase.storage().refFromURL(_this.agencyLogo).location.path) {
                                    _this.firebase.storage().refFromURL(oldLogo).delete();
                                }
                            }
                            catch (error) {
                            }
                            _this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + _this.agencyId).update(editedAgency).then(function () {
                                _this.showAlert(false);
                            }, function (error) {
                                _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                                _this.showAlert(true);
                                console.log(error.message);
                            });
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
    AgencyAccountDetailsComponent.prototype.removeLogo = function () {
        if (this.logoFile == null) {
            jQuery("#delete-logo").modal("show");
        }
        else {
            this.setLogoPreview(this.agencyLogo);
            this.logoFile = null; // remove the uploaded file
            jQuery("#imgInp").val(""); // reset file to trigger change event if the same file is uploaded
        }
    };
    AgencyAccountDetailsComponent.prototype.removeLogoFromStorage = function () {
        var _this = this;
        try {
            this.firebase.storage().refFromURL(this.agencyLogo).delete().then(function () {
                _this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + _this.agencyId + '/logoPath').remove().then(function () {
                    jQuery("#delete-logo").modal("hide");
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    AgencyAccountDetailsComponent.prototype.closeModal = function () {
        jQuery("#delete-logo").modal("hide");
    };
    AgencyAccountDetailsComponent.prototype.loadAgencyData = function (uid) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (agency) {
            _this.modalAgency = agency;
            _this.agencyLogo = agency.logoPath;
            _this.agencyAddressLine1 = agency.addressLine1;
            _this.agencyAddressLine2 = agency.addressLine2;
            _this.agencyAddressLine3 = agency.addressLine3;
            _this.agencyCity = agency.city;
            _this.agencyPostCode = agency.postCode;
            _this.agencyPhone = agency.phone;
            _this.agencyWebAddress = agency.website;
            _this.agencyCountry = agency.country;
            _this.agencyCurrency = agency.currency;
            _this.showReplaceRemoveLinks = !!_this.agencyLogo;
        });
    };
    AgencyAccountDetailsComponent.prototype.setLogoPreview = function (logoImage) {
        jQuery(".Agency-details__logo__preview").css("background-image", "url(" + logoImage + ")");
        if (logoImage) {
            jQuery(".Agency-details__logo__preview").addClass("Selected");
        }
        else {
            this.showReplaceRemoveLinks = false;
            jQuery(".Agency-details__logo__preview").removeClass("Selected");
        }
    };
    AgencyAccountDetailsComponent.prototype.uploadAgencyLogo = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            if (_this.logoFile) {
                var storageRef = _this.firebase.storage().ref().child('agency/' + _this.agencyId + '/' + _this.logoFile.name);
                var uploadTask = storageRef.put(_this.logoFile);
                uploadTask.on('state_changed', function (snapshot) {
                }, function (error) {
                    rej(error);
                }, function () {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    res(downloadURL);
                });
            }
            else {
                res(_this.agencyLogo);
            }
        });
        return promise;
    };
    AgencyAccountDetailsComponent.prototype.showAlert = function (error) {
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
    AgencyAccountDetailsComponent.prototype.validate = function () {
        this.alerts = {};
        if (!(this.agencyAddressLine1)) {
            this.alerts[this.agencyAddressLine1] = true;
            this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
            return false;
        }
        else if (!(this.agencyCity)) {
            this.alerts[this.agencyCity] = true;
            this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_CITY";
            return false;
        }
        else if (!(this.agencyPhone)) {
            this.alerts[this.agencyPhone] = true;
            this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_PHONE";
            return false;
        }
        else if (this.logoFile) {
            // Check for file size
            if (this.logoFile.size > Constants_1.Constants.AGENCY_ADMIN_LOGO_MAX_SIZE) {
                this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.AGENCY_LOGO_SIZE_EXCEEDED";
                return false;
            }
            // Check for file type
            if (!(Constants_1.Constants.AGENCY_ADMIN_LOGO_FILE_TYPES.indexOf(this.logoFile.type) > -1)) {
                this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.AGENCY_LOGO_INVALID_FILETYPE";
                return false;
            }
        }
        return true;
    };
    AgencyAccountDetailsComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return AgencyAccountDetailsComponent;
}());
AgencyAccountDetailsComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-account-details',
        templateUrl: './agency-account-details.component.html',
        styleUrls: ['./agency-account-details.component.css']
    }),
    __param(0, core_1.Inject(angularfire2_1.FirebaseApp))
], AgencyAccountDetailsComponent);
exports.AgencyAccountDetailsComponent = AgencyAccountDetailsComponent;
