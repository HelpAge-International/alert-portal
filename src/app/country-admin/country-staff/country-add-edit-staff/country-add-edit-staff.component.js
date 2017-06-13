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
var app_module_1 = require("../../../app.module");
var UUID_1 = require("../../../utils/UUID");
var firebase = require("firebase");
var user_public_model_1 = require("../../../model/user-public.model");
var staff_model_1 = require("../../../model/staff.model");
var CountryAddEditStaffComponent = (function () {
    function CountryAddEditStaffComponent(af, router, route, subscriptions) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        this.isEdit = false;
        this.hideWarning = true;
        this.successMessage = 'COUNTRY_ADMIN.STAFF.SUCCESS_STAFF_MEMBER_ADDED';
        this.hideSuccess = true;
        this.countryEnum = Enums_1.Country;
        this.userTypeConstant = Constants_1.Constants.COUNTRY_ADMIN_USER_TYPE;
        this.userTypeSelection = Constants_1.Constants.COUNTRY_ADMIN_USER_TYPE_SELECTION;
        this.userTitle = Constants_1.Constants.PERSON_TITLE;
        this.userTitleSelection = Constants_1.Constants.PERSON_TITLE_SELECTION;
        this.officeTypeConstant = Constants_1.Constants.OFFICE_TYPE;
        this.officeTypeSelection = Constants_1.Constants.OFFICE_TYPE_SELECTION;
        this.notificationsSettingsSelection = Constants_1.Constants.NOTIFICATION_SETTINGS;
        this.notificationSettings = [];
        this.skillsMap = new Map();
        this.notificationsMap = new Map();
        this.staffSkills = [];
        this.staffNotifications = [];
        this.skills = [];
        this.notifications = [];
    }
    CountryAddEditStaffComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.secondApp = firebase.initializeApp(app_module_1.firebaseConfig, UUID_1.UUID.createUUID());
            _this.uid = user.auth.uid;
            var countryAdminSubscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + '/administratorCountry/' + _this.uid)
                .subscribe(function (countryAdmin) {
                // Get the country id and agency administrator id
                _this.countryId = countryAdmin.countryId;
                _this.agencyAdminId = countryAdmin.agencyAdmin ? Object.keys(countryAdmin.agencyAdmin)[0] : '';
                _this.initData();
                var editSubscription = _this.route.params.subscribe(function (params) {
                    if (params['id']) {
                        _this.selectedStaffId = params['id'];
                        _this.selectedOfficeId = _this.countryId;
                        _this.isEdit = true;
                        _this.loadStaffInfo(_this.selectedStaffId, _this.selectedOfficeId);
                    }
                });
                _this.subscriptions.add(editSubscription);
            }, function (error) {
                _this.warningMessage = 'GLOBAL.GENERAL_ERROR';
                _this.showAlert();
            });
            _this.subscriptions.add(countryAdminSubscription);
        });
        this.subscriptions.add(subscription);
    };
    CountryAddEditStaffComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryAddEditStaffComponent.prototype.showAlert = function () {
        var _this = this;
        this.hideWarning = false;
        var subscribe = rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION).subscribe(function () {
            _this.hideWarning = true;
        });
        this.subscriptions.add(subscribe);
    };
    CountryAddEditStaffComponent.prototype.initData = function () {
        var _this = this;
        var countryOfficeSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId + '/' + this.countryId)
            .subscribe(function (countryOffice) {
            _this.countryOffice = countryOffice;
        });
        this.subscriptions.add(countryOfficeSubscription);
        this.countryList = this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId);
        this.departmentList = this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments')
            .map(function (departments) {
            var names = [];
            departments.forEach(function (department) {
                names.push(department.$key);
            });
            return names;
        });
        var skillSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/skill').subscribe(function (skills) {
            _this.techSkillsList = skills.filter(function (skill) { return skill.type === Enums_1.SkillType.Tech; });
            _this.supportSkillList = skills.filter(function (skill) { return skill.type === Enums_1.SkillType.Support; });
        });
        this.notificationList = this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/notificationSetting');
    };
    CountryAddEditStaffComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/country-admin/country-staff');
    };
    CountryAddEditStaffComponent.prototype.validateForm = function () {
        if (!this.title) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_TITLE';
            this.showAlert();
            return;
        }
        if (!this.firstName) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_FIRST_NAME';
            this.showAlert();
            return;
        }
        if (!this.lastName) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_LAST_NAME';
            this.showAlert();
            return;
        }
        if (!this.userType) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_USER_TYPE';
            this.showAlert();
            return;
        }
        if (!this.countryOffice) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_COUNTRY_OFFICE';
            this.showAlert();
            return;
        }
        if (!this.department) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_DEPARTMENT';
            this.showAlert();
            return;
        }
        if (!this.position) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_POSITION';
            this.showAlert();
            return;
        }
        if (!this.officeType) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_OFFICE_TYPE';
            this.showAlert();
            return;
        }
        if (!this.email) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_EMAIL';
            this.showAlert();
            return;
        }
        if (!this.phone) {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_PHONE';
            this.showAlert();
            return;
        }
        if (typeof (this.isResponseMember) === 'undefined') {
            this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_RESPONSE_TEAM_ANSWER';
            this.showAlert();
            return;
        }
        if (!CustomValidator_1.CustomerValidator.EmailValidator(this.email)) {
            this.warningMessage = 'GLOBAL.EMAIL_NOT_VALID';
            this.showAlert();
            return;
        }
    };
    CountryAddEditStaffComponent.prototype.submit = function () {
        this.collectData();
    };
    CountryAddEditStaffComponent.prototype.collectData = function () {
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
            if (this.emailInDatabase === this.email && this.countryOffice && this.countryOffice.$key !== this.selectedOfficeId) {
                this.updateOfficeChange();
            }
            else if (this.emailInDatabase === this.email) {
                this.updateNoEmailChange();
            }
            else {
                this.updateWithNewEmail();
            }
        }
    };
    CountryAddEditStaffComponent.prototype.createNonAlertUser = function () {
        var key = firebase.database().ref(Constants_1.Constants.APP_STATUS).push().key;
        console.log("Non-alert user key: " + key);
        this.updateFirebase(key);
    };
    CountryAddEditStaffComponent.prototype.supportSkillCheck = function (skill, isCheck) {
        this.skillsMap.set(skill.$key, isCheck);
    };
    CountryAddEditStaffComponent.prototype.techSkillCheck = function (skill, isCheck) {
        this.skillsMap.set(skill.$key, isCheck);
    };
    CountryAddEditStaffComponent.prototype.notificationCheck = function (notification, isCheck) {
        this.notificationsMap.set(Number(notification.$key), isCheck);
    };
    CountryAddEditStaffComponent.prototype.updateOfficeChange = function () {
        this.isUpdateOfficeOnly = true;
        this.updateFirebase(this.selectedStaffId);
    };
    CountryAddEditStaffComponent.prototype.updateWithNewEmail = function () {
        this.isEmailChange = true;
        this.createNewUser();
    };
    CountryAddEditStaffComponent.prototype.updateNoEmailChange = function () {
        this.updateFirebase(this.selectedStaffId);
    };
    CountryAddEditStaffComponent.prototype.createNewUser = function () {
        var _this = this;
        this.secondApp.auth().createUserWithEmailAndPassword(this.email, Constants_1.Constants.TEMP_PASSWORD).then(function (newUser) {
            _this.updateFirebase(newUser.uid);
            _this.secondApp.auth().signOut();
        }, function (error) {
            _this.warningMessage = error.message;
            _this.showAlert();
        });
    };
    CountryAddEditStaffComponent.prototype.updateFirebase = function (uid) {
        var _this = this;
        var staffData = {};
        // user public
        var user = new user_public_model_1.ModelUserPublic(this.firstName, this.lastName, this.title, this.email);
        user.phone = this.phone;
        user.country = -1;
        user.addressLine1 = '';
        user.addressLine2 = '';
        user.addressLine3 = '';
        user.city = '';
        user.postCode = '';
        staffData['/userPublic/' + uid + '/'] = user;
        // add to group
        staffData['/group/systemadmin/allusersgroup/' + uid + '/'] = true;
        staffData['/group/agency/' + this.agencyAdminId + '/agencyallusersgroup/' + uid + '/'] = true;
        staffData['/group/agency/' + this.agencyAdminId + '/' + Constants_1.Constants.GROUP_PATH_AGENCY[this.userType - 1] + '/' + uid + '/'] = true;
        // staff extra info
        var staff = new staff_model_1.ModelStaff();
        console.log(this.userType);
        staff.userType = Number(this.userType);
        staff.department = this.department;
        staff.position = this.position;
        staff.officeType = Number(this.officeType);
        staff.skill = this.staffSkills;
        staff.training = this.trainingNeeds ? this.trainingNeeds : 'None';
        staff.notification = this.staffNotifications;
        staff.isResponseMember = this.isResponseMember;
        if (this.isUpdateOfficeOnly) {
            staffData['/staff/' + this.selectedOfficeId + '/' + uid + '/'] = null;
        }
        if (!this.hideCountry) {
            staffData['/staff/' + this.countryOffice.$key + '/' + uid + '/'] = staff;
        }
        else if (!this.hideRegion) {
            staffData['/staff/globalUser/' + this.agencyAdminId + '/' + uid + '/'] = staff;
            //staffData['/region/' + this.uid + '/' + this.region.$key + '/directorId'] = uid;
        }
        else {
            staffData['/staff/' + this.countryOffice.$key + '/' + uid + '/'] = staff;
            staffData['/staff/globalUser/' + this.agencyAdminId + '/' + uid + '/'] = staff;
        }
        if (this.isEmailChange) {
            staffData['/userPublic/' + this.selectedStaffId + '/'] = null;
            if (!this.hideCountry) {
                staffData['/staff/' + this.selectedOfficeId + '/' + this.selectedStaffId + '/'] = null;
            }
            else {
                staffData['/staff/globalUser/' + this.uid + '/' + this.selectedStaffId + '/'] = null;
            }
        }
        if (this.userType === Enums_1.UserType.CountryDirector) {
            staffData['/directorCountry/' + this.countryOffice.$key + '/'] = uid;
        }
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(staffData).then(function () {
            _this.hideWarning = true;
            _this.hideSuccess = false;
            var subscription = rxjs_1.Observable.timer(1500).subscribe(function () {
                _this.router.navigateByUrl('/country-admin/country-staff');
            });
            _this.subscriptions.add(subscription);
        }, function (error) {
            _this.warningMessage = error.message;
            _this.showAlert();
        });
    };
    CountryAddEditStaffComponent.prototype.loadStaffInfo = function (staffId, officeId) {
        var _this = this;
        var subscriptionUser = this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + staffId)
            .subscribe(function (user) {
            _this.title = user.title;
            _this.firstName = user.firstName;
            _this.lastName = user.lastName;
            _this.email = user.email;
            _this.emailInDatabase = user.email;
            _this.phone = user.phone;
        });
        this.subscriptions.add(subscriptionUser);
        var path = officeId !== 'null'
            ? Constants_1.Constants.APP_STATUS + '/staff/' + officeId + '/' + staffId
            : Constants_1.Constants.APP_STATUS + '/staff/globalUser/' + this.agencyAdminId + '/' + staffId;
        var subscriptionStaff = this.af.database.object(path)
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
        });
        this.subscriptions.add(subscriptionStaff);
    };
    CountryAddEditStaffComponent.prototype.checkUserType = function () {
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
    CountryAddEditStaffComponent.prototype.selectedUserType = function (userType) {
        var _this = this;
        // userType-1 to ignore first all option
        this.notificationSettings = [];
        var subscription = this.notificationList
            .first()
            .subscribe(function (settingList) {
            settingList.forEach(function (setting) {
                _this.notificationSettings.push(setting.usersNotified[userType - 1]);
                _this.notificationsMap.set(Number(setting.$key), setting.usersNotified[userType - 1]);
            });
        });
        this.subscriptions.add(subscription);
        this.checkUserType();
    };
    CountryAddEditStaffComponent.prototype.deleteStaff = function () {
        jQuery('#delete-action').modal('show');
    };
    CountryAddEditStaffComponent.prototype.closeModal = function () {
        jQuery('#delete-action').modal('hide');
    };
    CountryAddEditStaffComponent.prototype.deleteAction = function () {
        var _this = this;
        jQuery('#delete-action').modal('hide');
        var delData = {};
        delData['/userPublic/' + this.selectedStaffId + '/'] = null;
        delData['/staff/' + this.selectedOfficeId + '/' + this.selectedStaffId + '/'] = null;
        delData['/group/systemadmin/allusersgroup/' + this.selectedStaffId + '/'] = null;
        delData['/group/agency/' + this.agencyAdminId + '/agencyallusersgroup/' + this.selectedStaffId + '/'] = null;
        delData['/group/agency/' + this.agencyAdminId + '/' + Constants_1.Constants.GROUP_PATH_AGENCY[this.userType - 1]
            + '/' + this.selectedStaffId + '/'] = null;
        if (this.userType === Enums_1.UserType.CountryDirector) {
            delData['/directorCountry/' + this.countryOffice.$key + '/'] = null;
        }
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(delData).then(function () {
            _this.router.navigateByUrl('/country-admin/country-staff');
        }, function (error) {
            _this.warningMessage = error.message;
            _this.showAlert();
        });
    };
    return CountryAddEditStaffComponent;
}());
CountryAddEditStaffComponent = __decorate([
    core_1.Component({
        selector: 'app-country-add-edit-staff',
        templateUrl: './country-add-edit-staff.component.html',
        styleUrls: ['./country-add-edit-staff.component.css']
    })
], CountryAddEditStaffComponent);
exports.CountryAddEditStaffComponent = CountryAddEditStaffComponent;
