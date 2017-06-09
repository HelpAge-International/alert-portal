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
var rxjs_1 = require("rxjs");
var staff_model_1 = require("../../model/staff.model");
var user_public_model_1 = require("../../model/user-public.model");
var Enums_1 = require("../../utils/Enums");
var user_service_1 = require("../../services/user.service");
var partner_organisation_service_1 = require("../../services/partner-organisation.service");
var CountryStaffComponent = (function () {
    function CountryStaffComponent(_userService, _partnerOrganisationService, af, router, subscriptions) {
        this._userService = _userService;
        this._partnerOrganisationService = _partnerOrganisationService;
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.Position = Constants_1.Constants.STAFF_POSITION;
        this.UserType = Constants_1.Constants.COUNTRY_ADMIN_USER_TYPE;
        this.userTypesList = Constants_1.Constants.COUNTRY_ADMIN_USER_TYPE_SELECTION;
        this.OfficeType = Constants_1.Constants.OFFICE_TYPE;
        this.officeTypesList = [Enums_1.OfficeType.All, Enums_1.OfficeType.FieldOffice, Enums_1.OfficeType.LabOffice];
        this.notificationSettings = Constants_1.Constants.NOTIFICATION_SETTINGS;
        this.All_Department = 'All departments';
        this.filterDepartment = this.All_Department;
        this.filterUserType = 0;
        this.filterOffice = 0;
        this.staffPublicUser = [];
        this.staffList = [];
        this.skillSet = new Set();
        this.skillNames = [];
        this.staffMap = new Map();
        this.partnerPublicUser = [];
        this.partnerOrganisations = [];
        this.supportSkills = [];
        this.techSkills = [];
        this.departments = [];
    }
    CountryStaffComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.auth.uid;
            var countryAdminSubscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + '/administratorCountry/' + _this.uid)
                .subscribe(function (countryAdmin) {
                // Get the country id and agency administrator id
                _this.countryId = countryAdmin.countryId;
                _this.agencyAdminId = countryAdmin.agencyAdmin ? Object.keys(countryAdmin.agencyAdmin)[0] : '';
                _this.initData();
            });
        });
        this.subscriptions.add(subscription);
    };
    CountryStaffComponent.prototype.initData = function () {
        var _this = this;
        this.getStaffData();
        this.getPartnerData();
        var subscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments')
            .map(function (departmentList) {
            var departments = [_this.All_Department];
            departmentList.forEach(function (x) {
                departments.push(x.$key);
            });
            return departments;
        })
            .subscribe(function (x) {
            _this.departments = x;
        });
        this.subscriptions.add(subscription);
    };
    CountryStaffComponent.prototype.getStaffData = function () {
        var _this = this;
        var staffSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/staff/' + this.countryId)
            .do(function (list) {
            list.forEach(function (item) {
                _this.staffList.push(_this.addStaff(item));
                _this.getStaffPublicUser(item.$key);
            });
        })
            .subscribe();
        this.subscriptions.add(staffSubscription);
    };
    CountryStaffComponent.prototype.getPartnerData = function () {
        var _this = this;
        this._userService.getPartnerUsers().subscribe(function (partners) {
            _this.partnersList = partners;
            _this.partnersList.forEach(function (partner) {
                _this._userService.getUser(partner.id)
                    .subscribe(function (partnerPublicUser) { _this.partnerPublicUser[partner.id] = partnerPublicUser; });
                _this._partnerOrganisationService.getPartnerOrganisation(partner.partnerOrganisationId)
                    .subscribe(function (partnerOrganisation) { _this.partnerOrganisations[partner.id] = partnerOrganisation; });
            });
        });
    };
    CountryStaffComponent.prototype.hideFilteredStaff = function (staff) {
        var hide = false;
        if (!staff) {
            return hide;
        }
        if (this.filterDepartment && this.filterDepartment !== this.All_Department && staff.department !== this.filterDepartment) {
            hide = true;
        }
        if (this.filterUserType && this.filterUserType > 0 && staff.userType != this.filterUserType) {
            hide = true;
        }
        if (this.filterOffice && this.filterOffice > 0 && staff.officeType != this.filterOffice) {
            hide = true;
        }
        return hide;
    };
    CountryStaffComponent.prototype.addStaff = function (item) {
        this.staff = new staff_model_1.ModelStaff();
        this.staff.id = item.$key;
        this.staff.position = item.position;
        this.staff.department = item.department;
        this.staff.officeType = item.officeType;
        this.staff.userType = item.userType;
        this.staff.training = item.training;
        this.staff.skill = item.skill;
        this.staff.notification = item.notification;
        return this.staff;
    };
    CountryStaffComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CountryStaffComponent.prototype.addNewStaff = function () {
        this.router.navigateByUrl('/country-admin/country-staff/country-add-edit-staff');
    };
    CountryStaffComponent.prototype.addNewPartner = function () {
        this.router.navigateByUrl('/country-admin/country-staff/country-add-edit-partner');
    };
    CountryStaffComponent.prototype.getStaffUserType = function (userType) {
        for (var i = 0; i < this.userTypesList.length; i++) {
            if (this.userTypesList[i] === userType) {
                return this.UserType[i];
            }
        }
        return '';
    };
    CountryStaffComponent.prototype.editStaff = function (officeId, staffId) {
        this.router.navigate(['/country-admin/country-staff/country-add-edit-staff', {
                id: staffId,
                officeId: officeId
            }], { skipLocationChange: true });
    };
    CountryStaffComponent.prototype.editPartner = function (partnerId) {
        this.router.navigate(['/country-admin/country-staff/country-add-edit-partner', {
                id: partnerId
            }], { skipLocationChange: true });
    };
    CountryStaffComponent.prototype.getStaffPublicUser = function (userId) {
        var _this = this;
        var staffPublicUserSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + userId)
            .subscribe(function (userPublic) {
            _this.staffPublicUser[userId] =
                new user_public_model_1.ModelUserPublic(userPublic.firstName, userPublic.lastName, userPublic.title, userPublic.email);
            _this.staffPublicUser[userId].phone = userPublic.phone;
        });
    };
    CountryStaffComponent.prototype.closeAdditionalInfo = function (staffId) {
        jQuery('#' + staffId).collapse('hide');
    };
    CountryStaffComponent.prototype.getSupportSkills = function (officeId, staffId) {
        var _this = this;
        this.supportSkills = [];
        if (staffId) {
            var path = Constants_1.Constants.APP_STATUS + '/staff/' + officeId + '/' + staffId;
            var subscription = this.af.database.object(path)
                .first()
                .map(function (user) {
                var userSkill = [];
                if (user.skill) {
                    for (var _i = 0, _a = user.skill; _i < _a.length; _i++) {
                        var skill = _a[_i];
                        userSkill.push(skill);
                    }
                }
                return userSkill;
            })
                .flatMap(function (skills) {
                return rxjs_1.Observable.from(skills);
            })
                .flatMap(function (skill) {
                return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/skill/" + skill);
            })
                .subscribe(function (skill) {
                if (skill.type == Enums_1.SkillType.Support) {
                    _this.supportSkills.push(skill.name);
                }
            });
            this.subscriptions.add(subscription);
        }
        return this.supportSkills;
    };
    CountryStaffComponent.prototype.getTechSkills = function (officeId, staffId) {
        var _this = this;
        this.techSkills = [];
        if (staffId) {
            var path = Constants_1.Constants.APP_STATUS + '/staff/' + officeId + '/' + staffId;
            var subscription = this.af.database.object(path)
                .first()
                .map(function (user) {
                var userSkill = [];
                if (user.skill) {
                    for (var _i = 0, _a = user.skill; _i < _a.length; _i++) {
                        var skill = _a[_i];
                        userSkill.push(skill);
                    }
                }
                return userSkill;
            })
                .flatMap(function (skills) {
                return rxjs_1.Observable.from(skills);
            })
                .flatMap(function (skill) {
                return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/skill/" + skill);
            })
                .subscribe(function (skill) {
                if (skill.type == Enums_1.SkillType.Tech) {
                    _this.techSkills.push(skill.name);
                }
            });
            this.subscriptions.add(subscription);
        }
        return this.techSkills;
    };
    return CountryStaffComponent;
}());
CountryStaffComponent = __decorate([
    core_1.Component({
        selector: 'app-country-staff',
        templateUrl: './country-staff.component.html',
        styleUrls: ['./country-staff.component.css'],
        providers: [user_service_1.UserService, partner_organisation_service_1.PartnerOrganisationService]
    })
], CountryStaffComponent);
exports.CountryStaffComponent = CountryStaffComponent;
