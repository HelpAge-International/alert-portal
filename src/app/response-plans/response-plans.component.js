"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../utils/Constants");
var Enums_1 = require("../utils/Enums");
var Observable_1 = require("rxjs/Observable");
var response_plan_service_1 = require("../services/response-plan.service");
var Subject_1 = require("rxjs/Subject");
var ResponsePlansComponent = (function () {
    function ResponsePlansComponent(af, router, service) {
        this.af = af;
        this.router = router;
        this.service = service;
        this.activePlans = [];
        this.userType = -1;
        this.hideWarning = true;
        this.notesMap = new Map();
        this.HazardScenariosList = Constants_1.Constants.HAZARD_SCENARIOS;
        this.ngUnsubscribe = new Subject_1.Subject();
    }
    ResponsePlansComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("NGHSUBVSCRIBOIEWJSFOIEWJGF");
        console.log(this.ngUnsubscribe);
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                console.log("Admin uid: " + _this.uid);
                _this.checkUserType(_this.uid);
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    ResponsePlansComponent.prototype.checkUserType = function (uid) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + uid)
            .takeUntil(this.ngUnsubscribe).subscribe(function (admin) {
            if (admin.countryId) {
                _this.userType = Enums_1.UserType.CountryAdmin;
                _this.countryId = admin.countryId;
                console.log("user type: " + _this.userType);
                _this.getResponsePlans(admin.countryId);
            }
            else {
                console.log("check other user types!");
            }
        });
    };
    ResponsePlansComponent.prototype.getResponsePlans = function (id) {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/responsePlan/" + id, {
            query: {
                orderByChild: "isActive",
                equalTo: true
            }
        })
            .takeUntil(this.ngUnsubscribe).subscribe(function (plans) {
            _this.activePlans = plans;
            for (var _i = 0, _a = _this.activePlans; _i < _a.length; _i++) {
                var x = _a[_i];
                _this.getNotes(x);
            }
            console.log(plans);
        });
        this.archivedPlans = this.af.database.list(Constants_1.Constants.APP_STATUS + "/responsePlan/" + id, {
            query: {
                orderByChild: "isActive",
                equalTo: false
            }
        });
        console.log("get response plan...");
    };
    ResponsePlansComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.service.serviceDestroy();
    };
    ResponsePlansComponent.prototype.getName = function (id) {
        var name = "";
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            name = user.firstName + " " + user.lastName;
        });
        return name;
    };
    ResponsePlansComponent.prototype.goToCreateNewResponsePlan = function () {
        this.router.navigateByUrl('response-plans/create-edit-response-plan');
    };
    ResponsePlansComponent.prototype.viewResponsePlan = function (plan) {
        this.router.navigate(["/response-plans/view-plan", { "id": plan.$key }]);
    };
    ResponsePlansComponent.prototype.editResponsePlan = function (responsePlan) {
        this.router.navigate(['response-plans/create-edit-response-plan', { id: responsePlan.$key }]);
    };
    ResponsePlansComponent.prototype.submitForApproval = function (plan) {
        this.needShowDialog = this.service.needShowWaringBypassValidation(plan);
        this.planToApproval = plan;
        if (this.needShowDialog) {
            jQuery("#dialog-action").modal("show");
            this.dialogTitle = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_TITLE";
            this.dialogContent = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_CONTENT";
        }
        else {
            this.confirmDialog();
        }
    };
    ResponsePlansComponent.prototype.submitForPartnerValidation = function (plan) {
        this.service.submitForPartnerValidation(plan, this.uid);
    };
    ResponsePlansComponent.prototype.confirmDialog = function () {
        var _this = this;
        if (this.needShowDialog) {
            jQuery("#dialog-action").modal("hide");
        }
        if (this.userType == Enums_1.UserType.CountryAdmin) {
            var approvalData_1 = {};
            var countryId_1 = "";
            var agencyId_1 = "";
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + this.uid)
                .flatMap(function (countryAdmin) {
                countryId_1 = countryAdmin.countryId;
                agencyId_1 = Object.keys(countryAdmin.agencyAdmin)[0];
                return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/directorCountry/" + countryId_1);
            })
                .do(function (director) {
                if (director && director.$value) {
                    console.log("country director");
                    console.log(director);
                    approvalData_1["/responsePlan/" + countryId_1 + "/" + _this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = Enums_1.ApprovalStatus.WaitingApproval;
                    approvalData_1["/responsePlan/" + countryId_1 + "/" + _this.planToApproval.$key + "/status"] = Enums_1.ApprovalStatus.WaitingApproval;
                }
                else {
                    _this.waringMessage = "ERROR_NO_COUNTRY_DIRECTOR";
                    _this.showAlert();
                    return;
                }
            })
                .flatMap(function () {
                return _this.af.database.list(Constants_1.Constants.APP_STATUS + "/agency/" + agencyId_1 + "/responsePlanSettings/approvalHierachy");
            })
                .map(function (approvalSettings) {
                var setting = [];
                approvalSettings.forEach(function (item) {
                    setting.push(item.$value);
                });
                return setting;
            })
                .first()
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (approvalSettings) {
                // console.log("***");
                // console.log(approvalSettings);
                // console.log(approvalData);
                if (approvalSettings[0] == false && approvalSettings[1] == false) {
                    approvalData_1["/responsePlan/" + countryId_1 + "/" + _this.planToApproval.$key + "/approval/regionDirector/"] = null;
                    approvalData_1["/responsePlan/" + countryId_1 + "/" + _this.planToApproval.$key + "/approval/globalDirector/"] = null;
                    _this.updatePartnerValidation(countryId_1, approvalData_1);
                }
                else if (approvalSettings[0] != false && approvalSettings[1] == false) {
                    console.log("regional enabled");
                    _this.updateWithRegionalApproval(countryId_1, approvalData_1);
                }
                else if (approvalSettings[0] == false && approvalSettings[1] != false) {
                    console.log("global enabled");
                }
                else {
                    console.log("both directors enabled");
                }
            });
        }
    };
    ResponsePlansComponent.prototype.updatePartnerValidation = function (countryId, approvalData) {
        if (this.planToApproval.partnerOrganisations) {
            var partnerData_1 = {};
            this.planToApproval.partnerOrganisations.forEach(function (item) {
                partnerData_1[item] = Enums_1.ApprovalStatus.InProgress;
            });
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/partner/"] = partnerData_1;
        }
        this.af.database.object(Constants_1.Constants.APP_STATUS).update(approvalData).then(function () {
            console.log("success");
        }, function (error) {
            console.log(error.message);
        });
    };
    ResponsePlansComponent.prototype.updateWithRegionalApproval = function (countryId, approvalData) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/directorRegion/" + countryId)
            .takeUntil(this.ngUnsubscribe).subscribe(function (id) {
            // console.log(id);
            if (id && id.$value) {
                approvalData["/responsePlan/" + countryId + "/" + _this.planToApproval.$key + "/approval/regionDirector/" + id.$value] = Enums_1.ApprovalStatus.WaitingApproval;
                _this.updatePartnerValidation(countryId, approvalData);
            }
        });
    };
    ResponsePlansComponent.prototype.closeModal = function () {
        jQuery("#dialog-action").modal("hide");
    };
    ResponsePlansComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    ResponsePlansComponent.prototype.showAlert = function () {
        var _this = this;
        this.hideWarning = false;
        Observable_1.Observable.timer(Constants_1.Constants.ALERT_DURATION).takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.hideWarning = true;
        });
    };
    ResponsePlansComponent.prototype.getApproves = function (plan) {
        if (!plan.approval) {
            return [];
        }
        return Object.keys(plan.approval).filter(function (key) { return key != "partner"; }).map(function (key) { return plan.approval[key]; });
    };
    ResponsePlansComponent.prototype.getApproveStatus = function (approve) {
        if (!approve) {
            return -1;
        }
        var list = Object.keys(approve).map(function (key) { return approve[key]; });
        return list[0] == Enums_1.ApprovalStatus.Approved;
    };
    ResponsePlansComponent.prototype.activatePlan = function (plan) {
        var _this = this;
        if (this.userType == Enums_1.UserType.CountryAdmin) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive").set(true);
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/status").set(Enums_1.ApprovalStatus.NeedsReviewing);
            this.af.database.list(Constants_1.Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval")
                .map(function (list) {
                var newList = [];
                list.forEach(function (item) {
                    var data = {};
                    data[item.$key] = Object.keys(item)[0];
                    newList.push(data);
                });
                return newList;
            })
                .first()
                .takeUntil(this.ngUnsubscribe).subscribe(function (approvalList) {
                for (var _i = 0, approvalList_1 = approvalList; _i < approvalList_1.length; _i++) {
                    var approval = approvalList_1[_i];
                    console.log(approval);
                    if (approval["countryDirector"]) {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS + "/responsePlan/" + _this.countryId + "/" + plan.$key + "/approval/countryDirector/" + approval["countryDirector"])
                            .set(Enums_1.ApprovalStatus.NeedsReviewing);
                    }
                    if (approval["regionDirector"]) {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS + "/responsePlan/" + _this.countryId + "/" + plan.$key + "/approval/regionDirector/" + approval["regionDirector"])
                            .set(Enums_1.ApprovalStatus.NeedsReviewing);
                    }
                    if (approval["globalDirector"]) {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS + "/responsePlan/" + _this.countryId + "/" + plan.$key + "/approval/globalDirector/" + approval["globalDirector"])
                            .set(Enums_1.ApprovalStatus.NeedsReviewing);
                    }
                }
            });
        }
    };
    ResponsePlansComponent.prototype.getNotes = function (plan) {
        var _this = this;
        if (plan.status == Enums_1.ApprovalStatus.NeedsReviewing) {
            this.af.database.list(Constants_1.Constants.APP_STATUS + "/note/" + plan.$key)
                .first()
                .takeUntil(this.ngUnsubscribe).subscribe(function (list) {
                _this.notesMap.set(plan.$key, list);
            });
        }
    };
    ResponsePlansComponent.prototype.testExport = function () {
        this.router.navigateByUrl("/export");
    };
    return ResponsePlansComponent;
}());
ResponsePlansComponent = __decorate([
    core_1.Component({
        selector: 'app-response-plans',
        templateUrl: './response-plans.component.html',
        styleUrls: ['./response-plans.component.css'],
        providers: [response_plan_service_1.ResponsePlanService]
    })
], ResponsePlansComponent);
exports.ResponsePlansComponent = ResponsePlansComponent;
