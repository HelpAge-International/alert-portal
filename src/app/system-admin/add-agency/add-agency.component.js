"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CustomValidator_1 = require("../../utils/CustomValidator");
var firebase = require("firebase");
var app_module_1 = require("../../app.module");
var user_public_model_1 = require("../../model/user-public.model");
var Constants_1 = require("../../utils/Constants");
var agency_model_1 = require("../../model/agency.model");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/mergeMap");
var Enums_1 = require("../../utils/Enums");
var rxjs_1 = require("rxjs");
var UUID_1 = require("../../utils/UUID");
var AddAgencyComponent = (function () {
    function AddAgencyComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.inactive = true;
        this.alerts = {};
        this.agencyAdminTitle = 0;
        this.isEdit = false;
        this.Country = Constants_1.Constants.COUNTRY;
        this.countryList = [Enums_1.Country.UK, Enums_1.Country.France, Enums_1.Country.Germany];
        this.PersonTitle = Constants_1.Constants.PERSON_TITLE;
        this.personTitleList = [Enums_1.PersonTitle.Mr, Enums_1.PersonTitle.Mrs, Enums_1.PersonTitle.Miss, Enums_1.PersonTitle.Dr, Enums_1.PersonTitle.Prof];
        this.deleteAgency = {};
        this.isDonor = true;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AddAgencyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.systemAdminUid = user.auth.uid;
                _this.secondApp = firebase.initializeApp(app_module_1.firebaseConfig, UUID_1.UUID.createUUID());
                _this.inactive = true;
                _this.route.params
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (params) {
                    if (params["id"]) {
                        _this.agencyId = params["id"];
                        _this.isEdit = true;
                        _this.loadAgencyInfo(params["id"]);
                    }
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    AddAgencyComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AddAgencyComponent.prototype.loadAgencyInfo = function (agencyId) {
        var _this = this;
        //load from agency
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (agency) {
            _this.agencyName = agency.name;
            _this.preAgencyName = agency.name;
            _this.adminId = agency.adminId;
            _this.isDonor = agency.isDonor;
            //load from user public
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + agency.adminId)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (user) {
                _this.userPublic = new user_public_model_1.ModelUserPublic(user.firstName, user.lastName, user.title, user.email);
                _this.userPublic.addressLine1 = user.addressLine1;
                _this.userPublic.addressLine2 = user.addressLine2;
                _this.userPublic.addressLine3 = user.addressLine3;
                _this.userPublic.country = user.country;
                _this.userPublic.city = user.city;
                _this.userPublic.postCode = user.postCode;
                _this.agencyAdminTitle = user.title;
                _this.agencyAdminFirstName = user.firstName;
                _this.agencyAdminLastName = user.lastName;
                _this.agencyAdminTitle = user.title;
                _this.agencyAdminEmail = user.email;
                _this.emailInDatabase = user.email;
                _this.agencyAdminAddressLine1 = user.addressLine1;
                _this.agencyAdminAddressLine2 = user.addressLine2;
                _this.agencyAdminAddressLine3 = user.addressLine3;
                _this.agencyAdminCountry = user.country;
                _this.agencyAdminCity = user.city;
                _this.agencyAdminPostCode = user.postCode;
            });
        });
    };
    AddAgencyComponent.prototype.onSubmit = function () {
        if (this.validate()) {
            if (this.isEdit) {
                this.updateAgencyInfo();
            }
            else {
                this.registerNewAgency();
            }
        }
        else {
            this.showAlert();
        }
    };
    AddAgencyComponent.prototype.donorSelected = function () {
        this.isDonor = true;
    };
    AddAgencyComponent.prototype.notDonorSelected = function () {
        this.isDonor = false;
    };
    AddAgencyComponent.prototype.updateAgencyInfo = function () {
        console.log("update");
        console.log(this.agencyAdminEmail);
        console.log(this.emailInDatabase);
        console.log(this.isDonor);
        if (this.agencyAdminEmail == this.emailInDatabase) {
            this.updateNoEmailChange();
        }
        else {
            this.updateWithNewEmail();
        }
    };
    AddAgencyComponent.prototype.updateWithNewEmail = function () {
        var _this = this;
        console.log("new email");
        // let secondApp = firebase.initializeApp(firebaseConfig, "second");
        var tempPassword = "testtest";
        this.secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(function (x) {
            console.log("user " + x.uid + " created successfully");
            var uid = x.uid;
            _this.writeToFirebase(uid);
            _this.secondApp.auth().signOut();
        }, function (error) {
            console.log(error.message);
        });
    };
    AddAgencyComponent.prototype.updateNoEmailChange = function () {
        console.log("no email change");
        console.log("agencyId: " + this.agencyId);
        this.validateAgencyName();
    };
    AddAgencyComponent.prototype.updateToFirebase = function () {
        var _this = this;
        //update user
        if (this.userPublic) {
            this.userPublic.firstName = this.agencyAdminFirstName;
            this.userPublic.lastName = this.agencyAdminLastName;
            this.userPublic.title = this.agencyAdminTitle;
            if (this.agencyAdminAddressLine1) {
                this.userPublic.addressLine1 = this.agencyAdminAddressLine1;
            }
            if (this.agencyAdminAddressLine2) {
                this.userPublic.addressLine2 = this.agencyAdminAddressLine2;
            }
            if (this.agencyAdminAddressLine3) {
                this.userPublic.addressLine3 = this.agencyAdminAddressLine3;
            }
            if (this.agencyAdminCountry) {
                this.userPublic.country = this.agencyAdminCountry;
            }
            if (this.agencyAdminCity) {
                this.userPublic.city = this.agencyAdminCity;
            }
            if (this.agencyAdminPostCode) {
                this.userPublic.postCode = this.agencyAdminPostCode;
            }
            var updateData = {};
            updateData["/userPublic/" + this.adminId] = this.userPublic;
            updateData["/agency/" + this.agencyId + "/name"] = this.agencyName;
            updateData["/agency/" + this.agencyId + "/isDonor"] = this.isDonor;
            this.af.database.object(Constants_1.Constants.APP_STATUS).update(updateData).then(function () {
                _this.backToHome();
            }, function (error) {
                console.log(error.message);
            });
        }
    };
    AddAgencyComponent.prototype.registerNewAgency = function () {
        this.validateAgencyName();
    };
    AddAgencyComponent.prototype.validateAgencyName = function () {
        var _this = this;
        if (this.preAgencyName && this.preAgencyName == this.agencyName) {
            this.updateToFirebase();
            return;
        }
        console.log("validate agency name");
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency", {
            query: {
                orderByChild: "name",
                equalTo: this.agencyName
            }
        })
            .take(1)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (agencyList) {
            if (agencyList.length == 0) {
                if (_this.isEdit) {
                    _this.updateToFirebase();
                }
                else {
                    console.log("create new user");
                    _this.createNewUser();
                }
            }
            else {
                _this.errorMessage = "SYSTEM_ADMIN.AGENCIES.NAME_DUPLICATE";
                _this.showAlert();
            }
        });
    };
    AddAgencyComponent.prototype.createNewUser = function () {
        var _this = this;
        console.log("start register new agency");
        // let secondApp = firebase.initializeApp(firebaseConfig, "fourth");
        var tempPassword = "testtest";
        this.secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(function (success) {
            console.log("user " + success.uid + " created successfully");
            var uid = success.uid;
            _this.writeToFirebase(uid);
            // this.secondApp.auth().sendPasswordResetEmail(this.agencyAdminEmail);
            _this.secondApp.auth().signOut();
        }, function (error) {
            console.log(error.message);
            _this.errorMessage = "GLOBAL.GENERAL_ERROR";
            _this.showAlert();
        });
    };
    AddAgencyComponent.prototype.writeToFirebase = function (uid) {
        var _this = this;
        var agencyData = {};
        //write to userPublic node
        var newAgencyAdmin = new user_public_model_1.ModelUserPublic(this.agencyAdminFirstName, this.agencyAdminLastName, this.agencyAdminTitle, this.agencyAdminEmail);
        newAgencyAdmin.addressLine1 = this.agencyAdminAddressLine1 ? this.agencyAdminAddressLine1 : "";
        newAgencyAdmin.addressLine2 = this.agencyAdminAddressLine2 ? this.agencyAdminAddressLine2 : "";
        newAgencyAdmin.addressLine3 = this.agencyAdminAddressLine3 ? this.agencyAdminAddressLine3 : "";
        newAgencyAdmin.city = this.agencyAdminCity ? this.agencyAdminCity : "";
        newAgencyAdmin.country = this.agencyAdminCountry ? this.agencyAdminCountry : -1;
        newAgencyAdmin.postCode = this.agencyAdminPostCode ? this.agencyAdminPostCode : "";
        newAgencyAdmin.phone = "";
        agencyData["/userPublic/" + uid] = newAgencyAdmin;
        agencyData["/administratorAgency/" + uid + "/systemAdmin/" + this.systemAdminUid] = true;
        if (this.isEdit) {
            agencyData["/administratorAgency/" + uid + "/agencyId"] = this.agencyId;
            console.log(this.emailInDatabase + "/" + this.agencyAdminEmail);
            if (this.emailInDatabase != this.agencyAdminEmail) {
                agencyData["/administratorAgency/" + uid + "/firstLogin"] = true;
            }
            agencyData["/agency/" + this.agencyId + "/adminId"] = uid;
            agencyData["/agency/" + this.agencyId + "/isDonor"] = this.isDonor;
            agencyData["/administratorAgency/" + this.adminId] = null;
            // agencyData["/group/systemadmin/allagencyadminsgroup/" + this.adminId] = null;
            // agencyData["/group/systemadmin/allusersgroup/" + this.adminId] = null;
            agencyData["/userPublic/" + this.adminId] = null;
            agencyData["/userPrivate/" + this.adminId] = null;
        }
        else {
            agencyData["/administratorAgency/" + uid + "/agencyId"] = uid;
            agencyData["/administratorAgency/" + uid + "/firstLogin"] = true;
            agencyData["/group/systemadmin/allagencyadminsgroup/" + uid] = true;
            agencyData["/group/systemadmin/allusersgroup/" + uid] = true;
            var agency = new agency_model_1.ModelAgency(this.agencyName);
            agency.isDonor = this.isDonor;
            agency.isActive = true;
            agency.adminId = uid;
            // agency.logoPath = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIccywWWDQhnGZDG6P4g4A9pJfSF9k8Xmsknac5C0TO-w_axRH";
            agencyData["/agency/" + uid] = agency;
        }
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(agencyData).then(function () {
            _this.backToHome();
        }, function (error) {
            console.log(error.message);
        });
    };
    AddAgencyComponent.prototype.backToHome = function () {
        this.router.navigateByUrl(Constants_1.Constants.SYSTEM_ADMIN_HOME);
    };
    AddAgencyComponent.prototype.cancelSubmit = function () {
        this.backToHome();
    };
    // Deletion of an agency is no longer needed for the client
    // delete() {
    //   jQuery("#delete-agency").modal("show");
    // }
    //
    // deleteAgencyFromFirebase() {
    //   console.log("Delete agency button pressed");
    //
    //   if (this.agencyId && this.adminId) {
    //     //TODO delete agency (cant finish till whole system done)
    //     this.deleteAgency["/userPublic/" + this.adminId] = null;
    //     this.deleteAgency["/administratorAgency/" + this.adminId] = null;
    //     this.deleteAgency["/group/systemadmin/allagencyadminsgroup/" + this.adminId] = null;
    //     this.deleteAgency["/group/systemadmin/allusersgroup/" + this.adminId] = null;
    //     this.deleteAgency["/agency/" + this.agencyId] = null;
    //     this.deleteAgency["/messageRef/agencygroup/" + this.agencyId] = null;
    //     this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/sentmessages").subscribe(result => {
    //       result.forEach(item => {
    //         console.log(item.$key);
    //         this.deleteAgency["/message/" + item.$key] = null;
    //       });
    //       console.log(JSON.stringify(this.deleteAgency));
    //       this.af.database.object(Constants.APP_STATUS).update(this.deleteAgency).then(() => {
    //         console.log("Agency deleted");
    //         jQuery("#delete-agency").modal("hide");
    //         this.router.navigateByUrl(Constants.SYSTEM_ADMIN_HOME);
    //       }, error => {
    //         console.log(error.message);
    //       });
    //     })
    //   }
    // }
    //
    // closeModal() {
    //   jQuery("#delete-agency").modal("hide");
    // }
    AddAgencyComponent.prototype.showAlert = function () {
        var _this = this;
        this.inactive = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function () {
            _this.inactive = true;
        });
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    AddAgencyComponent.prototype.validate = function () {
        if (!(this.agencyName)) {
            this.alerts[this.agencyName] = true;
            this.errorMessage = "SYSTEM_ADMIN.AGENCIES.NAME_MISSING";
            return false;
        }
        else if (!(this.agencyAdminFirstName)) {
            this.alerts[this.agencyAdminFirstName] = true;
            this.errorMessage = "SYSTEM_ADMIN.AGENCIES.F_NAME_MISSING";
            return false;
        }
        else if (!(this.agencyAdminLastName)) {
            this.alerts[this.agencyAdminLastName] = true;
            this.errorMessage = "SYSTEM_ADMIN.AGENCIES.L_NAME_MISSING";
            return false;
        }
        else if (!(this.agencyAdminEmail)) {
            this.alerts[this.agencyAdminEmail] = true;
            this.errorMessage = "SYSTEM_ADMIN.AGENCIES.EMAIL_MISSING";
            return false;
        }
        else if (!CustomValidator_1.CustomerValidator.EmailValidator(this.agencyAdminEmail)) {
            this.alerts[this.agencyAdminEmail] = true;
            this.errorMessage = "SYSTEM_ADMIN.AGENCIES.EMAIL_INVALID";
            return false;
        }
        return true;
    };
    return AddAgencyComponent;
}());
AddAgencyComponent = __decorate([
    core_1.Component({
        selector: 'app-add-agency',
        templateUrl: './add-agency.component.html',
        styleUrls: ['./add-agency.component.css']
    })
], AddAgencyComponent);
exports.AddAgencyComponent = AddAgencyComponent;
