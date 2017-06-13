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
var CustomValidator_1 = require("../../../utils/CustomValidator");
var firebase = require("firebase");
var app_module_1 = require("../../../app.module");
var user_public_model_1 = require("../../../model/user-public.model");
var countryoffice_model_1 = require("../../../model/countryoffice.model");
var rxjs_1 = require("rxjs");
var CreateEditCountryComponent = (function () {
    function CreateEditCountryComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.countryNames = Constants_1.Constants.COUNTRY;
        this.countrySelections = Constants_1.Constants.COUNTRY_SELECTION;
        this.titleNames = Constants_1.Constants.PERSON_TITLE;
        this.titleSelections = Constants_1.Constants.PERSON_TITLE_SELECTION;
        this.countryOfficeLocation = Enums_1.Country.UK;
        this.countryAdminTitle = Enums_1.PersonTitle.Mr;
        this.hideWarning = true;
        this.isEdit = false;
        this.alerts = {};
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateEditCountryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.auth.uid;
            _this.secondApp = firebase.initializeApp(app_module_1.firebaseConfig, "second");
            _this.route.params
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (param) {
                if (param["id"]) {
                    _this.countryOfficeId = param["id"];
                    _this.isEdit = true;
                    _this.loadCountryInfo(_this.countryOfficeId);
                }
            });
        });
    };
    CreateEditCountryComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
        this.secondApp.delete();
    };
    CreateEditCountryComponent.prototype.loadCountryInfo = function (countryOfficeId) {
        var _this = this;
        console.log("edit: " + countryOfficeId);
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + this.uid + "/" + countryOfficeId)
            .do(function (result) {
            console.log(result);
            _this.countryOfficeLocation = result.location;
            _this.preCountryOfficeLocation = result.location;
            _this.tempAdminId = result.adminId;
        })
            .flatMap(function (result) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + result.adminId);
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            console.log(user);
            _this.countryAdminTitle = user.title;
            _this.countryAdminFirstName = user.firstName;
            _this.countryAdminLastName = user.lastName;
            _this.countryAdminEmail = user.email;
            //store for compare later
            _this.preEmail = user.email;
            _this.countryAdminAddress1 = user.addressLine1;
            _this.countryAdminAddress2 = user.addressLine2;
            _this.countryAdminAddress3 = user.addressLine3;
            _this.countryAdminCountry = user.country;
            _this.countryAdminCity = user.city;
            _this.countryAdminPostcode = user.postCode;
        });
    };
    CreateEditCountryComponent.prototype.cancel = function () {
        this.backHome();
    };
    CreateEditCountryComponent.prototype.backHome = function () {
        this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_HOME);
    };
    CreateEditCountryComponent.prototype.submit = function () {
        console.log("submit");
        if (!this.validateForm()) {
            return;
        }
        if (this.isEdit) {
            this.updateCountryOffice();
        }
        else {
            this.createCountryOffice();
        }
    };
    CreateEditCountryComponent.prototype.validate = function () {
        console.log("validate form");
        if (this.countryOfficeLocation < 0) {
            this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.NAME_MISSING";
            this.showAlert();
            return;
        }
        else if (!this.countryAdminFirstName) {
            this.alerts[this.countryAdminFirstName] = true;
            this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.F_NAME_MISSING";
            this.showAlert();
            return;
        }
        else if (!this.countryAdminLastName) {
            this.alerts[this.countryAdminLastName] = true;
            this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.L_NAME_MISSING";
            this.showAlert();
            return;
        }
        else if (!this.countryAdminEmail) {
            this.alerts[this.countryAdminEmail] = true;
            this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.EMAIL_MISSING";
            this.showAlert();
            return;
        }
        else {
            this.hideWarning = true;
        }
    };
    CreateEditCountryComponent.prototype.validateForm = function () {
        if (!CustomValidator_1.CustomerValidator.EmailValidator(this.countryAdminEmail)) {
            this.waringMessage = "GLOBAL.EMAIL_NOT_VALID";
            this.showAlert();
            return false;
        }
        else {
            this.hideWarning = true;
            return true;
        }
    };
    CreateEditCountryComponent.prototype.updateCountryOffice = function () {
        if (this.preEmail == this.countryAdminEmail) {
            this.updateNoEmailChange();
        }
        else {
            this.updateWithNewEmail();
        }
    };
    CreateEditCountryComponent.prototype.updateNoEmailChange = function () {
        console.log("no email change");
        if (this.preCountryOfficeLocation == this.countryOfficeLocation) {
            console.log("location not change: " + this.countryOfficeId);
            this.updateFirebase(this.countryOfficeId);
        }
        else {
            console.log("check location");
            this.validateLocation();
        }
    };
    CreateEditCountryComponent.prototype.updateWithNewEmail = function () {
        console.log("change with new email");
        this.isUserChange = true;
        if (this.preCountryOfficeLocation == this.countryOfficeLocation) {
            this.createNewUser();
        }
        else {
            this.validateLocation();
        }
    };
    CreateEditCountryComponent.prototype.createCountryOffice = function () {
        this.validateLocation();
    };
    CreateEditCountryComponent.prototype.validateLocation = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/" + this.uid, {
            query: {
                orderByChild: "location",
                equalTo: this.countryOfficeLocation
            }
        })
            .takeUntil(this.ngUnsubscribe)
            .take(1)
            .subscribe(function (result) {
            if (result.length != 0) {
                _this.hideWarning = false;
                _this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_DUPLICATE_COUNTRY";
                return;
            }
            if (_this.isEdit && _this.isUserChange) {
                _this.createNewUser();
            }
            else if (_this.isEdit) {
                _this.updateFirebase(_this.countryOfficeId);
            }
            else {
                _this.createNewUser();
            }
        });
    };
    CreateEditCountryComponent.prototype.createNewUser = function () {
        var _this = this;
        console.log("create new user...");
        var tempPass = "testtest";
        this.secondApp.auth().createUserWithEmailAndPassword(this.countryAdminEmail, tempPass).then(function (success) {
            console.log(success.uid + " was successfully created");
            var countryId = success.uid;
            _this.updateFirebase(countryId);
            _this.secondApp.auth().signOut();
        }, function (error) {
            console.log(error.message);
            _this.waringMessage = error.message;
            _this.hideWarning = false;
        });
    };
    CreateEditCountryComponent.prototype.updateFirebase = function (countryId) {
        if (this.isEdit && this.isUserChange) {
            this.changeAdminAndUpdate(countryId);
        }
        else if (this.isEdit) {
            this.updateData(countryId);
        }
        else {
            this.writeNewData(countryId);
        }
    };
    CreateEditCountryComponent.prototype.changeAdminAndUpdate = function (countryId) {
        var _this = this;
        var updateAdminData = {};
        var countryAdmin = new user_public_model_1.ModelUserPublic(this.countryAdminFirstName, this.countryAdminLastName, this.countryAdminTitle, this.countryAdminEmail);
        countryAdmin.addressLine1 = this.countryAdminAddress1 ? this.countryAdminAddress1 : "";
        countryAdmin.addressLine2 = this.countryAdminAddress2 ? this.countryAdminAddress2 : "";
        countryAdmin.addressLine3 = this.countryAdminAddress3 ? this.countryAdminAddress3 : "";
        countryAdmin.country = this.countryAdminCountry ? this.countryAdminCountry : -1;
        countryAdmin.city = this.countryAdminCity ? this.countryAdminCity : "";
        countryAdmin.postCode = this.countryAdminPostcode ? this.countryAdminPostcode : "";
        updateAdminData["/userPublic/" + countryId] = countryAdmin;
        updateAdminData["/administratorCountry/" + countryId + "/firstLogin"] = true;
        updateAdminData["/administratorCountry/" + countryId + "/agencyAdmin/" + this.uid] = true;
        updateAdminData["/administratorCountry/" + countryId + "/countryId"] = this.countryOfficeId;
        // updateAdminData["/group/systemadmin/allcountryadminsgroup/" + countryId] = true;
        // updateAdminData["/group/agency/" + this.uid + "/countryadmins/" + countryId] = true;
        updateAdminData["/countryOffice/" + this.uid + "/" + this.countryOfficeId + "/adminId"] = countryId;
        updateAdminData["/countryOffice/" + this.uid + "/" + this.countryOfficeId + "/location"] = this.countryOfficeLocation;
        //previous admin data need to be removed
        updateAdminData["/userPublic/" + this.tempAdminId] = null;
        updateAdminData["/administratorCountry/" + this.tempAdminId] = null;
        // updateAdminData["/group/systemadmin/allcountryadminsgroup/" + this.tempAdminId] = null;
        // updateAdminData["/group/agency/" + this.uid + "/countryadmins/" + this.tempAdminId] = null;
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(updateAdminData).then(function () {
            _this.backHome();
        }, function (error) {
            _this.hideWarning = false;
            _this.waringMessage = error.message;
            console.log(error.message);
        });
    };
    CreateEditCountryComponent.prototype.updateData = function (countryId) {
        var _this = this;
        this.countryData = {};
        this.countryData["/userPublic/" + countryId + "/firstName/"] = this.countryAdminFirstName;
        this.countryData["/userPublic/" + countryId + "/lastName/"] = this.countryAdminLastName;
        this.countryData["/userPublic/" + countryId + "/title/"] = this.countryAdminTitle;
        this.countryData["/userPublic/" + countryId + "/email/"] = this.countryAdminEmail;
        this.countryData["/userPublic/" + countryId + "/addressLine1/"] = this.countryAdminAddress1;
        this.countryData["/userPublic/" + countryId + "/addressLine2/"] = this.countryAdminAddress2;
        this.countryData["/userPublic/" + countryId + "/addressLine3/"] = this.countryAdminAddress3;
        this.countryData["/userPublic/" + countryId + "/country/"] = this.countryAdminCountry;
        this.countryData["/userPublic/" + countryId + "/city/"] = this.countryAdminCity;
        this.countryData["/userPublic/" + countryId + "/postCode/"] = this.countryAdminPostcode;
        this.countryData["/administratorCountry/" + countryId + "/agencyAdmin/" + this.uid] = true;
        this.countryData["/administratorCountry/" + countryId + "/countryId/"] = countryId;
        // this.countryData["/group/systemadmin/allcountryadminsgroup/" + countryId] = true;
        // this.countryData["/group/agency/" + this.uid + "/countryadmins/" + countryId] = true;
        this.countryData["/countryOffice/" + this.uid + "/" + countryId + "/adminId/"] = countryId;
        this.countryData["/countryOffice/" + this.uid + "/" + countryId + "/location/"] = this.countryOfficeLocation;
        this.countryData["/countryOffice/" + this.uid + "/" + countryId + "/isActive/"] = true;
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(this.countryData).then(function () {
            _this.backHome();
        }, function (error) {
            console.log(error.message);
        });
    };
    CreateEditCountryComponent.prototype.writeNewData = function (countryId) {
        var _this = this;
        this.countryData = {};
        var countryAdmin = new user_public_model_1.ModelUserPublic(this.countryAdminFirstName, this.countryAdminLastName, this.countryAdminTitle, this.countryAdminEmail);
        countryAdmin.addressLine1 = this.countryAdminAddress1 ? this.countryAdminAddress1 : "";
        countryAdmin.addressLine2 = this.countryAdminAddress2 ? this.countryAdminAddress2 : "";
        countryAdmin.addressLine3 = this.countryAdminAddress3 ? this.countryAdminAddress3 : "";
        countryAdmin.country = this.countryAdminCountry ? this.countryAdminCountry : -1;
        countryAdmin.city = this.countryAdminCity ? this.countryAdminCity : "";
        countryAdmin.postCode = this.countryAdminPostcode ? this.countryAdminPostcode : "";
        this.countryData["/userPublic/" + countryId] = countryAdmin;
        this.countryData["/administratorCountry/" + countryId + "/agencyAdmin/" + this.uid] = true;
        this.countryData["/administratorCountry/" + countryId + "/countryId"] = countryId;
        this.countryData["/group/systemadmin/allcountryadminsgroup/" + countryId] = true;
        this.countryData["/group/agency/" + this.uid + "/countryadmins/" + countryId] = true;
        var countryOffice = new countryoffice_model_1.ModelCountryOffice();
        countryOffice.adminId = countryId;
        countryOffice.location = this.countryOfficeLocation;
        countryOffice.isActive = true;
        this.countryData["/countryOffice/" + this.uid + "/" + countryId] = countryOffice;
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(this.countryData).then(function () {
            _this.backHome();
        }, function (error) {
            console.log(error.message);
        });
    };
    CreateEditCountryComponent.prototype.showAlert = function () {
        var _this = this;
        this.hideWarning = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.hideWarning = true;
        });
    };
    return CreateEditCountryComponent;
}());
CreateEditCountryComponent = __decorate([
    core_1.Component({
        selector: 'app-create-edit-country',
        templateUrl: './create-edit-country.component.html',
        styleUrls: ['./create-edit-country.component.css']
    })
], CreateEditCountryComponent);
exports.CreateEditCountryComponent = CreateEditCountryComponent;
