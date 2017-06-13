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
var NewAgencyDetailsComponent = (function () {
    function NewAgencyDetailsComponent(firebaseApp, af, router) {
        this.af = af;
        this.router = router;
        this.successInactive = true;
        this.successMessage = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
        this.errorInactive = true;
        this.alerts = {};
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
    NewAgencyDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorAgency/" + _this.uid + "/agencyId")
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (id) {
                    _this.agencyId = id.$value;
                });
                console.log("New agency admin uid: " + _this.uid);
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + _this.uid)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (user) {
                    _this.agencyAdminName = user.firstName;
                });
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + _this.uid)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (agency) {
                    _this.agencyName = agency.name;
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    NewAgencyDetailsComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    NewAgencyDetailsComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log("New agency name: " + this.agencyName);
        if (this.validate()) {
            var agencyData_1 = {};
            agencyData_1['/agency/' + this.agencyId + '/addressLine1'] = this.agencyAddressLine1;
            agencyData_1['/agency/' + this.agencyId + '/addressLine2'] = this.agencyAddressLine2;
            agencyData_1['/agency/' + this.agencyId + '/addressLine3'] = this.agencyAddressLine3;
            agencyData_1['/agency/' + this.agencyId + '/country'] = this.agencyCountry;
            agencyData_1['/agency/' + this.agencyId + '/city'] = this.agencyCity;
            agencyData_1['/agency/' + this.agencyId + '/postCode'] = this.agencyPostCode;
            agencyData_1['/agency/' + this.agencyId + '/phone'] = this.agencyPhone;
            agencyData_1['/agency/' + this.agencyId + '/website'] = this.agencyWebAddress;
            agencyData_1['/agency/' + this.agencyId + '/currency'] = this.agencyCurrency;
            agencyData_1['/administratorAgency/' + this.uid + '/firstLogin'] = false;
            if (this.logoFile) {
                console.log("With logo");
                this.uploadAgencyLogo().then(function (result) {
                    _this.agencyLogo = result;
                    agencyData_1['/agency/' + _this.agencyId + '/logoPath'] = _this.agencyLogo;
                    _this.af.database.object(Constants_1.Constants.APP_STATUS).update(agencyData_1).then(function () {
                        _this.successInactive = false;
                        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_REDIRECT_DURATION)
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function () {
                            _this.successInactive = true;
                            _this.router.navigateByUrl('/agency-admin/country-office');
                        });
                    }, function (error) {
                        _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                        _this.showAlert();
                        console.log(error.message);
                    });
                }, function (error) {
                    _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                    _this.showAlert();
                    console.log(error.message);
                });
            }
            else {
                console.log("Without logo");
                console.log("agencyData" + agencyData_1['/agency/' + this.agencyId + '/addressLine2']);
                this.af.database.object(Constants_1.Constants.APP_STATUS).update(agencyData_1).then(function () {
                    _this.successInactive = false;
                    rxjs_1.Observable.timer(Constants_1.Constants.ALERT_REDIRECT_DURATION)
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function () {
                        _this.successInactive = true;
                        _this.router.navigateByUrl('/agency-admin/country-office');
                    });
                }, function (error) {
                    _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                    _this.showAlert();
                    console.log(error.message);
                });
            }
        }
        else {
            this.showAlert();
        }
    };
    NewAgencyDetailsComponent.prototype.fileChange = function (event) {
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
    NewAgencyDetailsComponent.prototype.removeLogoPreview = function () {
        this.agencyLogo = '';
        this.logoFile = null; // remove the uploaded file
        jQuery("#imgInp").val(""); // reset file to trigger change event if the same file is uploaded
        this.setLogoPreview(this.agencyLogo);
    };
    NewAgencyDetailsComponent.prototype.setLogoPreview = function (logoImage) {
        jQuery(".Agency-details__logo__preview").css("background-image", "url(" + logoImage + ")");
        if (logoImage) {
            jQuery(".Agency-details__logo__preview").addClass("Selected");
        }
        else {
            this.showReplaceRemoveLinks = false;
            jQuery(".Agency-details__logo__preview").removeClass("Selected");
        }
    };
    NewAgencyDetailsComponent.prototype.uploadAgencyLogo = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var storageRef = _this.firebase.storage().ref().child('agency/' + _this.agencyId + '/' + _this.logoFile.name);
            var uploadTask = storageRef.put(_this.logoFile);
            uploadTask.on('state_changed', function (snapshot) {
            }, function (error) {
                rej(error);
            }, function () {
                var downloadURL = uploadTask.snapshot.downloadURL;
                res(downloadURL);
            });
        });
        return promise;
    };
    NewAgencyDetailsComponent.prototype.showAlert = function () {
        var _this = this;
        this.errorInactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.errorInactive = true;
        });
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    NewAgencyDetailsComponent.prototype.validate = function () {
        this.alerts = {};
        if (!(this.agencyAddressLine1)) {
            this.alerts[this.agencyAddressLine1] = true;
            this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
            return false;
        }
        else if (!(this.agencyCountry)) {
            this.alerts[this.agencyCountry] = true;
            this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_COUNTRY";
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
        else if (!(this.agencyCurrency)) {
            this.alerts[this.agencyCurrency] = true;
            this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_CURRENCY";
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
    return NewAgencyDetailsComponent;
}());
NewAgencyDetailsComponent = __decorate([
    core_1.Component({
        selector: 'app-new-agency-details',
        templateUrl: './new-agency-details.component.html',
        styleUrls: ['./new-agency-details.component.css']
    }),
    __param(0, core_1.Inject(angularfire2_1.FirebaseApp))
], NewAgencyDetailsComponent);
exports.NewAgencyDetailsComponent = NewAgencyDetailsComponent;
