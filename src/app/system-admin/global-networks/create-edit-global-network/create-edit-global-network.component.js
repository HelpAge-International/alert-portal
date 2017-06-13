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
var rxjs_1 = require("rxjs");
var CustomValidator_1 = require("../../../utils/CustomValidator");
var app_module_1 = require("../../../app.module");
var firebase = require("firebase");
var user_public_model_1 = require("../../../model/user-public.model");
var network_model_1 = require("../../../model/network.model");
var UUID_1 = require("../../../utils/UUID");
var CreateEditGlobalNetworkComponent = (function () {
    function CreateEditGlobalNetworkComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.hideWarning = true;
        this.adminTitle = 0;
        this.isEdit = false;
        this.COUNTRY = Constants_1.Constants.COUNTRY;
        this.COUNTRY_SELECTION = Constants_1.Constants.COUNTRY_SELECTION;
        this.PERSON_TITLE = Constants_1.Constants.PERSON_TITLE;
        this.PERSON_TITLE_SELECTION = Constants_1.Constants.PERSON_TITLE_SELECTION;
        this.alerts = {};
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateEditGlobalNetworkComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.auth.uid;
            _this.secondApp = firebase.initializeApp(app_module_1.firebaseConfig, UUID_1.UUID.createUUID());
            _this.route.params.takeUntil(_this.ngUnsubscribe).subscribe(function (params) {
                console.log("load: " + params["id"]);
                if (params["id"]) {
                    _this.isEdit = true;
                    _this.networkId = params["id"];
                    _this.loadNetworkInfo(_this.networkId);
                }
            });
        });
    };
    CreateEditGlobalNetworkComponent.prototype.loadNetworkInfo = function (networkId) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/network/" + networkId)
            .flatMap(function (network) {
            _this.preNetworkName = network.name;
            _this.networkName = network.name;
            _this.adminId = network.adminId;
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + network.adminId);
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            //create model for later use
            _this.modelAdmin = new user_public_model_1.ModelUserPublic(user.firstName, user.lastName, user.title, user.email);
            _this.modelAdmin.addressLine1 = user.addressLine1;
            _this.modelAdmin.addressLine2 = user.addressLine2;
            _this.modelAdmin.addressLine3 = user.addressLine3;
            _this.modelAdmin.country = user.country;
            _this.modelAdmin.city = user.city;
            _this.modelAdmin.postCode = user.postCode;
            //show data in ui
            _this.adminTitle = user.title;
            _this.adminFirstName = user.firstName;
            _this.adminLastName = user.lastName;
            _this.adminEmail = user.email;
            _this.preEmail = user.email;
            _this.adminAddressLine1 = user.addressLine1;
            _this.adminAddressLine2 = user.addressLine2;
            _this.adminAddressLine3 = user.addressLine3;
            _this.adminCountry = user.country;
            _this.adminCity = user.city;
            _this.adminPostcode = user.postCode;
        });
    };
    CreateEditGlobalNetworkComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.secondApp.delete();
    };
    CreateEditGlobalNetworkComponent.prototype.showAlert = function () {
        var _this = this;
        this.hideWarning = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.hideWarning = true;
        });
    };
    CreateEditGlobalNetworkComponent.prototype.submit = function () {
        console.log("submit");
        this.refreshData();
        if (!CustomValidator_1.CustomerValidator.EmailValidator(this.adminEmail)) {
            this.waringMessage = "GLOBAL.EMAIL_NOT_VALID";
            this.showAlert();
            return;
        }
        if (this.isEdit && this.preNetworkName == this.networkName) {
            console.log("no name change update");
            this.editNetwork();
            return;
        }
        this.validateNetworkName();
    };
    CreateEditGlobalNetworkComponent.prototype.validateNetworkName = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/network", {
            query: {
                orderByChild: "name",
                equalTo: this.networkName
            }
        })
            .take(1)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (networks) {
            if (networks.length != 0) {
                _this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_NAME_DUPLICATE";
                _this.showAlert();
                return;
            }
            if (_this.isEdit) {
                _this.editNetwork();
            }
            else {
                _this.createNewAdmin();
            }
        });
    };
    CreateEditGlobalNetworkComponent.prototype.createNewAdmin = function () {
        var _this = this;
        var tempPassword = Constants_1.Constants.TEMP_PASSWORD;
        this.secondApp.auth().createUserWithEmailAndPassword(this.adminEmail, tempPassword).then(function (success) {
            console.log("admin " + success.uid + " created successfully");
            var uid = success.uid;
            _this.updateFirebase(uid);
            _this.secondApp.auth().signOut();
        }, function (error) {
            console.log(error.message);
            if (error.message.includes("The email address is already in use by another account")) {
                console.log("need to find email id");
                _this.findUidForExistingEmail(_this.adminEmail);
                return;
            }
            _this.waringMessage = "GLOBAL.GENERAL_ERROR";
            _this.showAlert();
        });
    };
    CreateEditGlobalNetworkComponent.prototype.findUidForExistingEmail = function (adminEmail) {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/userPublic/", {
            query: {
                orderByChild: "email",
                equalTo: adminEmail,
                limitToFirst: 1
            }
        })
            .do(function (users) {
            if (users.length > 0) {
                _this.isUserExist = true;
                _this.uidUserExist = users[0].$key;
            }
        })
            .flatMap(function (users) {
            return _this.af.database.list(Constants_1.Constants.APP_STATUS + "/adminNetwork/", {
                query: {
                    orderByKey: true,
                    equalTo: users[0].$key
                }
            });
        })
            .do(function (admins) {
            if (admins.length > 0) {
                _this.isAdminExist = true;
            }
        })
            .first()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function () {
            if (_this.isUserExist && !_this.isAdminExist) {
                console.log("user exist but not network admin, proceed to update database");
                _this.updateFirebase(_this.uidUserExist);
                return;
            }
            _this.waringMessage = "GLOBAL.GENERAL_ERROR";
            _this.showAlert();
            // if (users.length > 0) {
            //   this.isUserExist = true;
            //   console.log("found key: "+users[0].$key);
            //   this.updateFirebase(users[0].$key);
            // }
        });
    };
    CreateEditGlobalNetworkComponent.prototype.validate = function () {
        this.validForm();
    };
    CreateEditGlobalNetworkComponent.prototype.cancel = function () {
        this.router.navigateByUrl(Constants_1.Constants.SYSTEM_ADMIN_NETWORK_HOME);
    };
    CreateEditGlobalNetworkComponent.prototype.validForm = function () {
        if (!this.networkName) {
            this.alerts[this.networkName] = true;
            this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_NAME_EMPTY";
            this.showAlert();
            return false;
        }
        else if (!this.adminFirstName) {
            this.alerts[this.adminFirstName] = true;
            this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_ADMIN_FIRST_NAME";
            this.showAlert();
            return false;
        }
        else if (!this.adminLastName) {
            this.alerts[this.adminLastName] = true;
            this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_ADMIN_LAST_NAME";
            this.showAlert();
            return false;
        }
        else if (!this.adminEmail) {
            this.alerts[this.adminEmail] = true;
            this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_ADMIN_EMAIL";
            this.showAlert();
            return false;
        }
        else {
            this.hideWarning = true;
            return true;
        }
    };
    CreateEditGlobalNetworkComponent.prototype.updateFirebase = function (uid) {
        var _this = this;
        var networkData = {};
        if (!this.isUserExist) {
            //userPublic node
            var newNetworkAdmin = new user_public_model_1.ModelUserPublic(this.adminFirstName, this.adminLastName, this.adminTitle, this.adminEmail);
            newNetworkAdmin.addressLine1 = this.adminAddressLine1 ? this.adminAddressLine1 : "";
            newNetworkAdmin.addressLine2 = this.adminAddressLine2 ? this.adminAddressLine2 : "";
            newNetworkAdmin.addressLine3 = this.adminAddressLine3 ? this.adminAddressLine3 : "";
            newNetworkAdmin.city = this.adminCity ? this.adminCity : "";
            newNetworkAdmin.country = this.adminCountry ? this.adminCountry : -1;
            newNetworkAdmin.postCode = this.adminPostcode ? this.adminPostcode : "";
            newNetworkAdmin.phone = "";
            networkData["/userPublic/" + uid] = newNetworkAdmin;
        }
        //admin node
        if (this.isEdit) {
            networkData["/adminNetwork/" + uid + "/networkId/"] = this.networkId;
        }
        else {
            networkData["/adminNetwork/" + uid + "/networkId/"] = uid;
        }
        networkData["/adminNetwork/" + uid + "/systemAdmin/" + this.uid + "/"] = true;
        //group
        networkData["/group/systemadmin/allusersgroup/" + uid + "/"] = true;
        networkData["/group/systemadmin/allnetworkadminsgroup/" + uid + "/"] = true;
        //network node
        if (this.isEdit) {
            networkData["/network/" + this.networkId + "/adminId"] = uid;
            networkData["/network/" + this.networkId + "/name"] = this.networkName;
            //clean up previous admin
            networkData["/userPublic/" + this.adminId] = null;
            networkData["/adminNetwork/" + this.adminId] = null;
            networkData["/group/systemadmin/allusersgroup/" + this.adminId] = null;
            networkData["/group/systemadmin/allnetworkadminsgroup/" + this.adminId] = null;
        }
        else {
            var network = new network_model_1.ModelNetwork();
            network.adminId = uid;
            network.name = this.networkName;
            network.isActive = true;
            network.logoPath = "https://lh3.googleusercontent.com/-9ETHQFY_l6A/AAAAAAAAAAI/AAAAAAAAAAA/lN3q2-pbJHU/W40-H40/photo.jpg?sz=64";
            networkData["/network/" + uid + "/"] = network;
        }
        //actual update
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(networkData).then(function () {
            _this.router.navigateByUrl(Constants_1.Constants.SYSTEM_ADMIN_NETWORK_HOME);
        }, function (error) {
            console.log(error.message);
            _this.waringMessage = "GLOBAL.GENERAL_ERROR";
            _this.showAlert();
        });
    };
    CreateEditGlobalNetworkComponent.prototype.editNetwork = function () {
        console.log("edit network");
        if (this.adminEmail == this.preEmail) {
            this.editNoEmailChange();
        }
        else {
            this.editWithNewEmail();
        }
    };
    CreateEditGlobalNetworkComponent.prototype.editWithNewEmail = function () {
        console.log("editWithNewEmail");
        this.createNewAdmin();
    };
    CreateEditGlobalNetworkComponent.prototype.editNoEmailChange = function () {
        var _this = this;
        console.log("editNoEmailChange");
        var networkData = {};
        //network detail
        networkData["/network/" + this.networkId + "/name"] = this.networkName;
        //admin detail
        networkData["/userPublic/" + this.adminId + "/title"] = this.adminTitle;
        networkData["/userPublic/" + this.adminId + "/firstName"] = this.adminFirstName;
        networkData["/userPublic/" + this.adminId + "/lastName"] = this.adminLastName;
        networkData["/userPublic/" + this.adminId + "/email"] = this.adminEmail;
        networkData["/userPublic/" + this.adminId + "/addressLine1"] = this.adminAddressLine1;
        networkData["/userPublic/" + this.adminId + "/addressLine2"] = this.adminAddressLine2;
        networkData["/userPublic/" + this.adminId + "/addressLine3"] = this.adminAddressLine3;
        networkData["/userPublic/" + this.adminId + "/country"] = this.adminCountry;
        networkData["/userPublic/" + this.adminId + "/city"] = this.adminCity;
        networkData["/userPublic/" + this.adminId + "/postCode"] = this.adminPostcode;
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(networkData).then(function () {
            _this.router.navigateByUrl(Constants_1.Constants.SYSTEM_ADMIN_NETWORK_HOME);
        }, function (error) {
            console.log(error.message);
            _this.waringMessage = "GLOBAL.GENERAL_ERROR";
            _this.showAlert();
        });
    };
    CreateEditGlobalNetworkComponent.prototype.refreshData = function () {
        this.isUserExist = false;
        this.isAdminExist = false;
        this.uidUserExist = "";
    };
    return CreateEditGlobalNetworkComponent;
}());
CreateEditGlobalNetworkComponent = __decorate([
    core_1.Component({
        selector: 'app-create-edit-global-network',
        templateUrl: 'create-edit-global-network.component.html',
        styleUrls: ['create-edit-global-network.component.css']
    })
], CreateEditGlobalNetworkComponent);
exports.CreateEditGlobalNetworkComponent = CreateEditGlobalNetworkComponent;
