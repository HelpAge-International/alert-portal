"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Enums_1 = require("../utils/Enums");
var Constants_1 = require("../utils/Constants");
var Subject_1 = require("rxjs/Subject");
var ResponsePlanService = (function () {
    function ResponsePlanService(af, userService, router) {
        this.af = af;
        this.userService = userService;
        this.router = router;
        this.ngUnsubscribe = new Subject_1.Subject();
    }
    ResponsePlanService.prototype.submitForPartnerValidation = function (plan, uid) {
        var _this = this;
        this.userService.getUserType(uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            _this.updatePartnerValidation(uid, user, plan);
        });
    };
    ResponsePlanService.prototype.needShowWaringBypassValidation = function (plan) {
        console.log(plan);
        if (!plan.partnerOrganisations) {
            return false;
        }
        if (plan.partnerOrganisations && plan.approval && plan.approval["partner"]) {
            return false;
        }
        return true;
    };
    ResponsePlanService.prototype.updatePartnerValidation = function (uid, user, plan) {
        var _this = this;
        var paths = [, , Constants_1.Constants.APP_STATUS + "/directorRegion/",
            Constants_1.Constants.APP_STATUS + "/directorCountry/", , , , , Constants_1.Constants.APP_STATUS + "/administratorCountry/",];
        if (user == Enums_1.UserType.CountryAdmin) {
            var countryId_1 = "";
            this.af.database.object(paths[user] + uid)
                .flatMap(function (countryAdmin) {
                countryId_1 = countryAdmin.countryId;
                return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/responsePlan/" + countryAdmin.countryId + "/" + plan.$key);
            })
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (responsePlan) {
                var approvalData = {};
                if (responsePlan.approval) {
                    approvalData = responsePlan.approval;
                }
                var partnerData = {};
                responsePlan.partnerOrganisations.forEach(function (partnerId) {
                    partnerData[partnerId] = Enums_1.ApprovalStatus.WaitingApproval;
                });
                approvalData["partner"] = partnerData;
                var updateData = {};
                updateData["/responsePlan/" + countryId_1 + "/" + plan.$key + "/approval/"] = approvalData;
                // updateData["/responsePlan/" + countryId + "/" + plan.$key + "/status/"] = ApprovalStatus.WaitingApproval;
                _this.af.database.object(Constants_1.Constants.APP_STATUS).update(updateData).then(function (_) {
                }, function (error) {
                    console.log(error.message);
                });
            });
        }
    };
    ResponsePlanService.prototype.getResponsePlan = function (countryId, responsePlanId) {
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId);
    };
    ResponsePlanService.prototype.updateResponsePlanApproval = function (userType, uid, countryId, responsePlanId, isApproved, rejectNoteContent) {
        var _this = this;
        var approvalName = this.getUserTypeName(userType);
        if (approvalName) {
            var updateData = {};
            updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/approval/" + approvalName + "/" + uid] = isApproved ? Enums_1.ApprovalStatus.Approved : Enums_1.ApprovalStatus.NeedsReviewing;
            updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = isApproved ? Enums_1.ApprovalStatus.Approved : Enums_1.ApprovalStatus.NeedsReviewing;
            this.af.database.object(Constants_1.Constants.APP_STATUS).update(updateData).then(function () {
                if (rejectNoteContent) {
                    _this.addResponsePlanRejectNote(uid, responsePlanId, rejectNoteContent);
                }
                else {
                    _this.router.navigateByUrl("/dashboard");
                }
            }, function (error) {
                console.log(error.message);
            });
        }
        else {
            console.log("user type is empty!!!");
        }
    };
    ResponsePlanService.prototype.addResponsePlanRejectNote = function (uid, responsePlanId, content) {
        var _this = this;
        var note = {};
        note["content"] = content;
        note["time"] = Date.now();
        note["uploadBy"] = uid;
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/note/" + responsePlanId).push(note).then(function () {
            _this.router.navigateByUrl("/dashboard");
        }, function (error) {
            console.log(error.message);
        });
    };
    ResponsePlanService.prototype.getUserTypeName = function (userType) {
        if (userType == Enums_1.UserType.CountryDirector) {
            return "countryDirector";
        }
        else if (userType == Enums_1.UserType.RegionalDirector) {
            return "regionDirector";
        }
        else if (userType == Enums_1.UserType.GlobalDirector) {
            return "globalDirector";
        }
        else {
            return "";
        }
    };
    ResponsePlanService.prototype.serviceDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    return ResponsePlanService;
}());
ResponsePlanService = __decorate([
    core_1.Injectable()
], ResponsePlanService);
exports.ResponsePlanService = ResponsePlanService;
