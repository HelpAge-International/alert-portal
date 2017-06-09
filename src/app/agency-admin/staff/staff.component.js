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
var staff_display_model_1 = require("../../model/staff-display.model");
var rxjs_1 = require("rxjs");
var staff_model_1 = require("../../model/staff.model");
var Enums_1 = require("../../utils/Enums");
var StaffComponent = (function () {
    function StaffComponent(af, router) {
        this.af = af;
        this.router = router;
        this.POSITION = Constants_1.Constants.STAFF_POSITION;
        this.POSITION_SELECTION = Constants_1.Constants.STAFF_POSITION_SELECTION;
        this.USER_TYPE = Constants_1.Constants.USER_TYPE;
        this.USER_TYPE_SELECTION = Constants_1.Constants.USER_TYPE_SELECTION;
        this.OFFICE_TYPE = Constants_1.Constants.OFFICE_TYPE;
        this.OFFICE_TYPE_SELECTION = Constants_1.Constants.OFFICE_TYPE_SELECTION;
        this.NOTIFICATION_SETTINGS = Constants_1.Constants.NOTIFICATION_SETTINGS;
        this.All_Department = "allDepartments";
        this.filterPosition = this.All_Department;
        this.filterUser = 0;
        this.filterOffice = 0;
        this.countries = Constants_1.Constants.COUNTRY;
        this.staffs = [];
        this.officeId = [];
        this.skillSet = new Set();
        this.skillNames = [];
        this.Position = Constants_1.Constants.STAFF_POSITION;
        this.positionsList = [Enums_1.StaffPosition.All, Enums_1.StaffPosition.OfficeDirector, Enums_1.StaffPosition.OfficeStarff];
        this.UserType = Constants_1.Constants.USER_TYPE;
        this.userTypesList = [Enums_1.UserType.All, Enums_1.UserType.GlobalDirector, Enums_1.UserType.RegionalDirector, Enums_1.UserType.CountryDirector,
            Enums_1.UserType.ErtLeader, Enums_1.UserType.Ert, Enums_1.UserType.Donor, Enums_1.UserType.GlobalUser, Enums_1.UserType.CountryAdmin, Enums_1.UserType.NonAlert];
        this.OfficeType = Constants_1.Constants.OFFICE_TYPE;
        this.officeTypesList = [Enums_1.OfficeType.All, Enums_1.OfficeType.FieldOffice, Enums_1.OfficeType.LabOffice];
        this.staffMap = new Map();
        this.dealedStaff = [];
        this.showCountryStaff = new Map();
        this.supportSkills = [];
        this.techSkills = [];
        this.globalUsers = [];
        this.departments = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    StaffComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.auth.uid;
            _this.initData();
        });
    };
    StaffComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    StaffComponent.prototype.initData = function () {
        var _this = this;
        this.getStaffData();
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
            .map(function (departmentList) {
            var departments = [];
            departmentList.forEach(function (x) {
                departments.push(x.$key);
            });
            return departments;
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (x) {
            _this.departments = x;
        });
    };
    StaffComponent.prototype.getStaffData = function () {
        var _this = this;
        this.staffs = [];
        this.dealedStaff = [];
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/" + this.uid)
            .do(function (list) {
            list.forEach(function (item) {
                _this.staffDisplay = new staff_display_model_1.ModelStaffDisplay();
                _this.staffDisplay.id = item.$key;
                _this.staffDisplay.country = item.location;
                _this.staffDisplay.staffs = [];
                _this.staffs.push(_this.staffDisplay);
                _this.showCountryStaff.set(_this.staffDisplay.id, false);
            });
        })
            .flatMap(function (list) {
            var ids = [];
            list.forEach(function (x) {
                ids.push(x.$key);
            });
            return rxjs_1.Observable.from(ids);
        })
            .map(function (id) {
            _this.officeId.push(id);
            return _this.staffMap.set(id, _this.af.database.list(Constants_1.Constants.APP_STATUS + "/staff/" + id));
        })
            .do(function () {
            _this.officeId.forEach(function (id) {
                _this.staffMap.get(id)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (x) {
                    x.forEach(function (item) {
                        if (!_this.dealedStaff.includes(item.$key)) {
                            if (_this.filterPosition == _this.All_Department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == Enums_1.OfficeType.All) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == _this.All_Department && _this.filterUser == item.userType && _this.filterOffice == Enums_1.OfficeType.All) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == _this.All_Department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == item.officeType) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == _this.All_Department && _this.filterUser == item.userType && _this.filterOffice == item.officeType) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == item.department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == Enums_1.OfficeType.All) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == _this.All_Department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == item.officeType) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == item.department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == item.officeType) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == item.department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == Enums_1.OfficeType.All) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == _this.All_Department && _this.filterUser == item.userType && _this.filterOffice == Enums_1.OfficeType.All) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == item.department && _this.filterUser == item.userType && _this.filterOffice == Enums_1.OfficeType.All) {
                                _this.addStaff(item, id);
                            }
                            else if (_this.filterPosition == item.department && _this.filterUser == item.userType && _this.filterOffice == item.officeType) {
                                _this.addStaff(item, id);
                            }
                        }
                    });
                });
            });
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
        // this.af.database.list(Constants.APP_STATUS + "/staff/globalUser/" + this.uid).takeUntil(this.ngUnsubscribe)
        //   .subscribe(users => {
        //     this.globalUsers = users;
        //   });
        this.filterGlobalUsers();
    };
    StaffComponent.prototype.addStaff = function (item, id) {
        this.staff = new staff_model_1.ModelStaff();
        this.staff.id = item.$key;
        this.staff.position = item.position;
        this.staff.department = item.department;
        this.staff.officeType = item.officeType;
        this.staff.userType = item.userType;
        this.staff.training = item.training;
        this.staff.skill = item.skill;
        this.staff.notification = item.notification;
        this.staffs[this.officeId.indexOf(id)].staffs.push(this.staff);
        this.dealedStaff.push(item.$key);
    };
    StaffComponent.prototype.addNewStaff = function () {
        this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_ADD_STARFF);
    };
    StaffComponent.prototype.getStaffName = function (key) {
        var _this = this;
        this.staffName = "";
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            _this.staffName = user.firstName + " " + user.lastName;
        });
        return this.staffName;
    };
    StaffComponent.prototype.hideCountryStaff = function (office) {
        var isHidden = this.showCountryStaff.get(office.id);
        this.showCountryStaff.set(office.id, !isHidden);
    };
    StaffComponent.prototype.editStaff = function (officeId, staffId) {
        this.router.navigate([Constants_1.Constants.AGENCY_ADMIN_ADD_STARFF, {
                id: staffId,
                officeId: officeId
            }], { skipLocationChange: true });
    };
    StaffComponent.prototype.editGlobalUser = function (staffId) {
        console.log("edit global user");
    };
    StaffComponent.prototype.closeAdditionalInfo = function (staffId) {
        jQuery("#" + staffId).collapse("hide");
    };
    StaffComponent.prototype.getStaffEmail = function (staffId) {
        var _this = this;
        this.staffEmail = "";
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + staffId)
            .takeUntil(this.ngUnsubscribe)
            .first()
            .subscribe(function (user) {
            _this.staffEmail = user.email;
        });
        return this.staffEmail;
    };
    StaffComponent.prototype.getStaffPhone = function (staffId) {
        var _this = this;
        this.staffPhone = "";
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + staffId)
            .takeUntil(this.ngUnsubscribe)
            .first()
            .subscribe(function (user) {
            _this.staffPhone = user.phone;
        });
        return this.staffPhone;
    };
    StaffComponent.prototype.getSupportSkills = function (officeId, staffId) {
        var _this = this;
        this.supportSkills = [];
        if (staffId) {
            var path = officeId ? Constants_1.Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId :
                Constants_1.Constants.APP_STATUS + "/staff/globalUser/" + this.uid + "/" + staffId;
            this.af.database.object(path)
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
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (skill) {
                if (skill.type == Enums_1.SkillType.Support) {
                    _this.supportSkills.push(skill.name);
                }
            });
        }
        return this.supportSkills;
    };
    StaffComponent.prototype.getTechSkills = function (officeId, staffId) {
        var _this = this;
        this.techSkills = [];
        if (staffId) {
            var path = officeId ? Constants_1.Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId :
                Constants_1.Constants.APP_STATUS + "/staff/globalUser/" + this.uid + "/" + staffId;
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
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (skill) {
                if (skill.type == Enums_1.SkillType.Tech) {
                    _this.techSkills.push(skill.name);
                }
            });
        }
        return this.techSkills;
    };
    StaffComponent.prototype.filterStaff = function () {
        console.log("filter staff");
        this.getStaffData();
        this.filterGlobalUsers();
    };
    StaffComponent.prototype.filterGlobalUsers = function () {
        var _this = this;
        this.globalUsers = [];
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/staff/globalUser/" + this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (users) {
            if (_this.filterPosition == _this.All_Department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == Enums_1.OfficeType.All) {
                _this.globalUsers = users;
            }
            else if (_this.filterPosition == _this.All_Department && _this.filterUser != Enums_1.UserType.All && _this.filterOffice == Enums_1.OfficeType.All) {
                users.forEach(function (user) {
                    if (user.userType == _this.filterUser) {
                        var isDuplicate = false;
                        for (var _i = 0, _a = _this.globalUsers; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.$key == user.$key) {
                                isDuplicate = true;
                            }
                        }
                        if (!isDuplicate) {
                            _this.globalUsers.push(user);
                        }
                    }
                });
            }
            else if (_this.filterPosition == _this.All_Department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice != Enums_1.OfficeType.All) {
                users.forEach(function (user) {
                    if (user.officeType == _this.filterOffice) {
                        var isDuplicate = false;
                        for (var _i = 0, _a = _this.globalUsers; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.$key == user.$key) {
                                isDuplicate = true;
                            }
                        }
                        if (!isDuplicate) {
                            _this.globalUsers.push(user);
                        }
                    }
                });
            }
            else if (_this.filterPosition == _this.All_Department && _this.filterUser != Enums_1.UserType.All && _this.filterOffice != Enums_1.OfficeType.All) {
                users.forEach(function (user) {
                    if (user.officeType == _this.filterOffice && user.userType == _this.filterUser) {
                        var isDuplicate = false;
                        for (var _i = 0, _a = _this.globalUsers; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.$key == user.$key) {
                                isDuplicate = true;
                            }
                        }
                        if (!isDuplicate) {
                            _this.globalUsers.push(user);
                        }
                    }
                });
            }
            else if (_this.filterPosition != _this.All_Department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice == Enums_1.OfficeType.All) {
                users.forEach(function (user) {
                    if (user.department == _this.filterPosition) {
                        var isDuplicate = false;
                        for (var _i = 0, _a = _this.globalUsers; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.$key == user.$key) {
                                isDuplicate = true;
                            }
                        }
                        if (!isDuplicate) {
                            _this.globalUsers.push(user);
                        }
                    }
                });
            }
            else if (_this.filterPosition != _this.All_Department && _this.filterUser == Enums_1.UserType.All && _this.filterOffice != Enums_1.OfficeType.All) {
                users.forEach(function (user) {
                    if (user.department == _this.filterPosition && user.officeType == _this.filterOffice) {
                        var isDuplicate = false;
                        for (var _i = 0, _a = _this.globalUsers; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.$key == user.$key) {
                                isDuplicate = true;
                            }
                        }
                        if (!isDuplicate) {
                            _this.globalUsers.push(user);
                        }
                    }
                });
            }
            else if (_this.filterPosition != _this.All_Department && _this.filterUser != Enums_1.UserType.All && _this.filterOffice == Enums_1.OfficeType.All) {
                users.forEach(function (user) {
                    if (user.department == _this.filterPosition && user.userType == _this.filterUser) {
                        var isDuplicate = false;
                        for (var _i = 0, _a = _this.globalUsers; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.$key == user.$key) {
                                isDuplicate = true;
                            }
                        }
                        if (!isDuplicate) {
                            _this.globalUsers.push(user);
                        }
                    }
                });
            }
            else if (_this.filterPosition != _this.All_Department && _this.filterUser != Enums_1.UserType.All && _this.filterOffice != Enums_1.OfficeType.All) {
                users.forEach(function (user) {
                    if (user.department == _this.filterPosition && user.userType == _this.filterUser && user.officeType == _this.filterOffice) {
                        var isDuplicate = false;
                        for (var _i = 0, _a = _this.globalUsers; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.$key == user.$key) {
                                isDuplicate = true;
                            }
                        }
                        if (!isDuplicate) {
                            _this.globalUsers.push(user);
                        }
                    }
                });
            }
            console.log(_this.globalUsers);
        });
    };
    return StaffComponent;
}());
StaffComponent = __decorate([
    core_1.Component({
        selector: 'app-staff',
        templateUrl: 'staff.component.html',
        styleUrls: ['staff.component.css']
    })
], StaffComponent);
exports.StaffComponent = StaffComponent;
