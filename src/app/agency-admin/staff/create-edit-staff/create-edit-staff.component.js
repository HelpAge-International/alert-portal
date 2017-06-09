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
var rxjs_1 = require("rxjs");
var CustomValidator_1 = require("../../../utils/CustomValidator");
var user_public_model_1 = require("../../../model/user-public.model");
var app_module_1 = require("../../../app.module");
var UUID_1 = require("../../../utils/UUID");
var firebase = require("firebase");
var staff_model_1 = require("../../../model/staff.model");
var CreateEditStaffComponent = (function () {
    function CreateEditStaffComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.PERSON_TITLE = Constants_1.Constants.PERSON_TITLE;
        this.PERSON_TITLE_SELECTION = Constants_1.Constants.PERSON_TITLE_SELECTION;
        this.USER_TYPE = Constants_1.Constants.USER_TYPE;
        this.USER_TYPE_SELECTION = Constants_1.Constants.USER_TYPE_SELECTION;
        this.STAFF_POSITION = Constants_1.Constants.STAFF_POSITION;
        this.STAFF_POSITION_SELECTION = Constants_1.Constants.STAFF_POSITION_SELECTION;
        this.OFFICE_TYPE = Constants_1.Constants.OFFICE_TYPE;
        this.OFFICE_TYPE_SELECTION = Constants_1.Constants.OFFICE_TYPE_SELECTION;
        this.NOTIFICATION_SETTINGS = Constants_1.Constants.NOTIFICATION_SETTINGS;
        this.Country = Enums_1.Country;
        this.skills = [];
        this.notifications = [];
        this.hideWarning = true;
        this.hideRegion = true;
        this.hideCountry = false;
        this.notificationSettings = [];
        this.skillsMap = new Map();
        this.staffSkills = [];
        this.notificationsMap = new Map();
        this.staffNotifications = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateEditStaffComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.auth.uid;
            _this.secondApp = firebase.initializeApp(app_module_1.firebaseConfig, UUID_1.UUID.createUUID());
            _this.initData();
            _this.route.params.takeUntil(_this.ngUnsubscribe).subscribe(function (params) {
                if (params["id"]) {
                    _this.selectedStaffId = params["id"];
                    _this.selectedOfficeId = params["officeId"];
                    _this.isEdit = true;
                    _this.loadStaffInfo(_this.selectedStaffId, _this.selectedOfficeId);
                }
            });
        });
    };
    CreateEditStaffComponent.prototype.ngOnDestroy = function () {
        this.secondApp.delete();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    CreateEditStaffComponent.prototype.loadStaffInfo = function (staffId, officeId) {
        var _this = this;
        console.log("load staff info: " + staffId + "/ " + officeId);
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + staffId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            // console.log(user);
            _this.title = user.title;
            _this.firstName = user.firstName;
            _this.lastName = user.lastName;
            _this.email = user.email;
            _this.emailInDatabase = user.email;
            _this.phone = user.phone;
        });
        var path = officeId != "null" ? Constants_1.Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId : Constants_1.Constants.APP_STATUS + "/staff/globalUser/" + this.uid + "/" + staffId;
        this.af.database.object(path)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (staff) {
            _this.userType = staff.userType;
            _this.checkUserType();
            _this.department = staff.department;
            _this.position = staff.position;
            _this.officeType = staff.officeType;
            if (staff.skill && staff.skill.length > 0) {
                for (var _i = 0, _a = staff.skill; _i < _a.length; _i++) {
                    var skill = _a[_i];
                    _this.skillsMap.set(skill, true);
                }
            }
            _this.trainingNeeds = staff.training;
            _this.isResponseMember = staff.isResponseMember;
            if (staff.notification && staff.notification.length > 0) {
                for (var _b = 0, _c = staff.notification; _b < _c.length; _b++) {
                    var notification = _c[_b];
                    _this.notificationSettings[Number(notification)] = true;
                    _this.notificationsMap.set(Number(notification), true);
                }
            }
            if (staff.userType == Enums_1.UserType.RegionalDirector) {
                var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/region/" + _this.uid, {
                    query: {
                        orderByChild: "directorId",
                        equalTo: staffId,
                        limitToFirst: 1
                    }
                })
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (regions) {
                    _this.region = regions[0];
                });
            }
        });
        if (officeId != "null") {
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + this.uid + "/" + officeId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (x) {
                _this.countryOffice = x;
            });
        }
    };
    CreateEditStaffComponent.prototype.initData = function () {
        this.countryList = this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/" + this.uid);
        this.regionList = this.af.database.list(Constants_1.Constants.APP_STATUS + "/region/" + this.uid);
        this.departmentList = this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
            .map(function (departments) {
            var names = [];
            departments.forEach(function (department) {
                names.push(department.$key);
            });
            return names;
        });
        this.supportSkillList = this.af.database.list(Constants_1.Constants.APP_STATUS + "/skill", {
            query: {
                orderByChild: "type",
                equalTo: Enums_1.SkillType.Support
            }
        });
        this.techSkillsList = this.af.database.list(Constants_1.Constants.APP_STATUS + "/skill", {
            query: {
                orderByChild: "type",
                equalTo: Enums_1.SkillType.Tech
            }
        });
        this.notificationList = this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency/" + this.uid + "/notificationSetting");
    };
    CreateEditStaffComponent.prototype.validateForm = function () {
        console.log("validate form");
        if (!this.title) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_TITLE";
            this.showAlert();
            return;
        }
        if (!this.firstName) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_FIRST_NAME";
            this.showAlert();
            return;
        }
        if (!this.lastName) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_LAST_NAME";
            this.showAlert();
            return;
        }
        if (!this.userType) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_USER_TYPE";
            this.showAlert();
            return;
        }
        if (!this.region && !this.hideRegion) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_REGION";
            this.showAlert();
            return;
        }
        if (!this.countryOffice && !this.hideCountry) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_COUNTRY_OFFICE";
            this.showAlert();
            return;
        }
        if (!this.department) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_DEPARTMENT";
            this.showAlert();
            return;
        }
        if (!this.position) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_POSITION";
            this.showAlert();
            return;
        }
        if (!this.officeType) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_OFFICE_TYPE";
            this.showAlert();
            return;
        }
        if (!this.email) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_EMAIL";
            this.showAlert();
            return;
        }
        if (!this.phone) {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_PHONE";
            this.showAlert();
            return;
        }
        if (typeof (this.isResponseMember) == "undefined") {
            this.waringMessage = "AGENCY_ADMIN.STAFF.NO_REPONSE_TEAM_ANSWER";
            this.showAlert();
            return;
        }
    };
    CreateEditStaffComponent.prototype.submit = function () {
        if (!CustomValidator_1.CustomerValidator.EmailValidator(this.email)) {
            this.waringMessage = "GLOBAL.EMAIL_NOT_VALID";
            this.showAlert();
            return;
        }
        console.log("submit");
        this.collectData();
    };
    CreateEditStaffComponent.prototype.collectData = function () {
        var _this = this;
        this.skillsMap.forEach(function (value, key) {
            if (value) {
                _this.staffSkills.push(key);
            }
        });
        this.notificationsMap.forEach(function (value, key) {
            if (value) {
                _this.staffNotifications.push(Number(key));
            }
        });
        if (!this.isEdit) {
            if (this.userType != Enums_1.UserType.NonAlert) {
                this.createNewUser();
            }
            else {
                this.createNonAlertUser();
            }
        }
        else {
            console.log("edit");
            if (this.emailInDatabase == this.email) {
                this.updateNoEmailChange();
            }
            else if (this.emailInDatabase == this.email && this.countryOffice && this.countryOffice.$key != this.selectedOfficeId) {
                this.updateOfficeChange();
            }
            else {
                this.updateWithNewEmail();
            }
        }
    };
    CreateEditStaffComponent.prototype.createNonAlertUser = function () {
        var key = firebase.database().ref(Constants_1.Constants.APP_STATUS).push().key;
        console.log("Non-alert user key: " + key);
        this.updateFirebase(key);
    };
    CreateEditStaffComponent.prototype.updateOfficeChange = function () {
        console.log("no new email but new office");
        this.isUpdateOfficeOnly = true;
        this.updateFirebase(this.selectedStaffId);
    };
    CreateEditStaffComponent.prototype.updateWithNewEmail = function () {
        console.log("new email new user");
        this.isEmailChange = true;
        this.createNewUser();
    };
    CreateEditStaffComponent.prototype.updateNoEmailChange = function () {
        console.log("no email change no office change");
        this.updateFirebase(this.selectedStaffId);
    };
    CreateEditStaffComponent.prototype.createNewUser = function () {
        var _this = this;
        this.secondApp.auth().createUserWithEmailAndPassword(this.email, Constants_1.Constants.TEMP_PASSWORD).then(function (newUser) {
            console.log(newUser.uid + " was successfully created");
            _this.updateFirebase(newUser.uid);
            _this.secondApp.auth().signOut();
        }, function (error) {
            _this.waringMessage = error.message;
            _this.showAlert();
        });
    };
    CreateEditStaffComponent.prototype.updateFirebase = function (uid) {
        var _this = this;
        console.log("update - country office:");
        console.log(this.countryOffice);
        var staffData = {};
        //user public
        var user = new user_public_model_1.ModelUserPublic(this.firstName, this.lastName, this.title, this.email);
        user.phone = this.phone;
        user.country = -1;
        user.addressLine1 = "";
        user.addressLine2 = "";
        user.addressLine3 = "";
        user.city = "";
        user.postCode = "";
        staffData["/userPublic/" + uid + "/"] = user;
        //add to group
        staffData["/group/systemadmin/allusersgroup/" + uid + "/"] = true;
        staffData["/group/agency/" + this.uid + "/agencyallusersgroup/" + uid + "/"] = true;
        staffData["/group/agency/" + this.uid + "/" + Constants_1.Constants.GROUP_PATH_AGENCY[this.userType - 1] + "/" + uid + "/"] = true;
        //staff extra info
        var staff = new staff_model_1.ModelStaff();
        staff.userType = Number(this.userType);
        // if (!this.hideRegion) {
        //   staff.region = this.region;
        // }
        // if (!this.hideCountry) {
        //   staff.countryOffice = this.countryOffice.$key;
        // }
        staff.department = this.department;
        staff.position = this.position;
        staff.officeType = Number(this.officeType);
        staff.skill = this.staffSkills;
        staff.training = this.trainingNeeds ? this.trainingNeeds : "None";
        staff.notification = this.staffNotifications;
        staff.isResponseMember = this.isResponseMember;
        if (this.isUpdateOfficeOnly) {
            staffData["/staff/" + this.selectedOfficeId + "/" + uid + "/"] = null;
        }
        if (!this.hideCountry) {
            staffData["/staff/" + this.countryOffice.$key + "/" + uid + "/"] = staff;
        }
        else if (!this.hideRegion) {
            staffData["/staff/globalUser/" + this.uid + "/" + uid + "/"] = staff;
            staffData["/region/" + this.uid + "/" + this.region.$key + "/directorId"] = uid;
        }
        else {
            staffData["/staff/globalUser/" + this.uid + "/" + uid + "/"] = staff;
        }
        if (this.isEmailChange) {
            staffData["/userPublic/" + this.selectedStaffId + "/"] = null;
            if (!this.hideCountry) {
                staffData["/staff/" + this.selectedOfficeId + "/" + this.selectedStaffId + "/"] = null;
            }
            else {
                staffData["/staff/globalUser/" + this.uid + "/" + this.selectedStaffId + "/"] = null;
            }
        }
        if (this.userType == Enums_1.UserType.CountryDirector) {
            staffData["/directorCountry/" + this.countryOffice.$key + "/"] = uid;
        }
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(staffData).then(function () {
            _this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_STARFF);
        }, function (error) {
            _this.waringMessage = error.message;
            _this.showAlert();
        });
    };
    CreateEditStaffComponent.prototype.selectedUserType = function (userType) {
        var _this = this;
        //userType-1 to ignore first all option
        this.notificationSettings = [];
        this.notificationList
            .takeUntil(this.ngUnsubscribe)
            .first()
            .subscribe(function (settingList) {
            settingList.forEach(function (setting) {
                _this.notificationSettings.push(setting.usersNotified[userType - 1]);
                _this.notificationsMap.set(Number(setting.$key), setting.usersNotified[userType - 1]);
            });
        });
        console.log(this.userType);
        this.checkUserType();
    };
    CreateEditStaffComponent.prototype.checkUserType = function () {
        if (this.userType == Enums_1.UserType.RegionalDirector) {
            this.hideCountry = true;
            this.hideRegion = false;
        }
        else if (this.userType == Enums_1.UserType.GlobalDirector || this.userType == Enums_1.UserType.GlobalUser) {
            this.hideCountry = true;
            this.hideRegion = true;
        }
        else {
            this.hideCountry = false;
            this.hideRegion = true;
        }
    };
    CreateEditStaffComponent.prototype.supportSkillCheck = function (skill, isCheck) {
        this.skillsMap.set(skill.$key, isCheck);
    };
    CreateEditStaffComponent.prototype.techSkillCheck = function (skill, isCheck) {
        this.skillsMap.set(skill.$key, isCheck);
    };
    CreateEditStaffComponent.prototype.notificationCheck = function (notification, isCheck) {
        this.notificationsMap.set(Number(notification.$key), isCheck);
    };
    CreateEditStaffComponent.prototype.cancel = function () {
        this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_STARFF);
    };
    CreateEditStaffComponent.prototype.showAlert = function () {
        var _this = this;
        this.hideWarning = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.hideWarning = true;
        });
    };
    CreateEditStaffComponent.prototype.deleteStaff = function () {
        console.log("delete staff:" + this.selectedOfficeId + "/" + this.selectedStaffId);
        jQuery("#delete-action").modal("show");
    };
    CreateEditStaffComponent.prototype.closeModal = function () {
        jQuery("#delete-action").modal("hide");
    };
    CreateEditStaffComponent.prototype.deleteAction = function () {
        var _this = this;
        jQuery("#delete-action").modal("hide");
        var delData = {};
        delData["/userPublic/" + this.selectedStaffId + "/"] = null;
        delData["/staff/" + this.selectedOfficeId + "/" + this.selectedStaffId + "/"] = null;
        delData["/group/systemadmin/allusersgroup/" + this.selectedStaffId + "/"] = null;
        delData["/group/agency/" + this.uid + "/agencyallusersgroup/" + this.selectedStaffId + "/"] = null;
        delData["/group/agency/" + this.uid + "/" + Constants_1.Constants.GROUP_PATH_AGENCY[this.userType - 1] + "/" + this.selectedStaffId + "/"] = null;
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(delData).then(function () {
            _this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_STARFF);
        }, function (error) {
            _this.waringMessage = error.message;
            _this.showAlert();
        });
    };
    return CreateEditStaffComponent;
}());
CreateEditStaffComponent = __decorate([
    core_1.Component({
        selector: 'app-create-edit-staff',
        templateUrl: 'create-edit-staff.component.html',
        styleUrls: ['create-edit-staff.component.css']
    })
], CreateEditStaffComponent);
exports.CreateEditStaffComponent = CreateEditStaffComponent;
