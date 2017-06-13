"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Constants_1 = require("../../utils/Constants");
var response_plan_service_1 = require("../../services/response-plan.service");
var Enums_1 = require("../../utils/Enums");
var ReviewResponsePlanComponent = (function () {
    function ReviewResponsePlanComponent(af, router, route, userService, responsePlanService) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.userService = userService;
        this.responsePlanService = responsePlanService;
        this.ApprovalStatus = Enums_1.ApprovalStatus;
        this.ngUnsubscribe = new rxjs_1.Subject();
        this.partnerApproveList = [];
        this.countryDirectorApproval = [];
        this.regionalDirectorApproval = [];
        this.globalDirectorApproval = [];
        this.rejectToggleMap = new Map();
        this.rejectComment = "";
    }
    ReviewResponsePlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.route.params
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (params) {
                    if (params["id"]) {
                        _this.responsePlanId = params["id"];
                        _this.loadResponsePlan(_this.responsePlanId);
                    }
                });
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    ReviewResponsePlanComponent.prototype.loadResponsePlan = function (responsePlanId) {
        var _this = this;
        this.userService.getUserType(this.uid)
            .flatMap(function (userType) {
            _this.userType = userType;
            return _this.userService.getCountryId(Constants_1.Constants.USER_TYPE_PATH[userType], _this.uid);
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (countryId) {
            _this.countryId = countryId;
            _this.responsePlanService.getResponsePlan(countryId, responsePlanId)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (responsePlan) {
                _this.loadedResponseplan = responsePlan;
                _this.handlePlanApproval(_this.loadedResponseplan);
            });
        });
    };
    ReviewResponsePlanComponent.prototype.handlePlanApproval = function (responsePlan) {
        var _this = this;
        if (responsePlan.approval) {
            //partner approval
            if (responsePlan.approval.partner) {
                var partners_1 = responsePlan.approval.partner;
                this.partnerApproveList = Object.keys(partners_1).map(function (key) {
                    var item = {};
                    item["id"] = key;
                    item["name"] = "";
                    item["status"] = partners_1[key];
                    return item;
                });
                this.partnerApproveList.forEach(function (partner) {
                    _this.userService.getOrganisationName(partner.id)
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function (organisation) {
                        partner.name = organisation.organisationName;
                    });
                });
            }
            //country director approval
            if (responsePlan.approval.countryDirector) {
                var countryDirector_1 = responsePlan.approval.countryDirector;
                this.countryDirectorApproval = Object.keys(countryDirector_1).map(function (key) {
                    var item = {};
                    item["id"] = key;
                    item["status"] = countryDirector_1[key];
                    return item;
                });
            }
            //regional director approval
            if (responsePlan.approval.regionDirector) {
                var regionDirector_1 = responsePlan.approval.regionDirector;
                this.regionalDirectorApproval = Object.keys(regionDirector_1).map(function (key) {
                    var item = {};
                    item["id"] = key;
                    item["status"] = regionDirector_1[key];
                    return item;
                });
            }
            //global director approval
            if (responsePlan.approval.globalDirector) {
                var globalDirector_1 = responsePlan.approval.globalDirector;
                this.globalDirectorApproval = Object.keys(globalDirector_1).map(function (key) {
                    var item = {};
                    item["id"] = key;
                    item["status"] = globalDirector_1[key];
                    return item;
                });
            }
        }
    };
    ReviewResponsePlanComponent.prototype.approvePlan = function () {
        console.log("approve plan");
        //TODO testing data, need to be updated!!!!
        this.responsePlanService.updateResponsePlanApproval(Enums_1.UserType.CountryDirector, "1b5mFmWq2fcdVncMwVDbNh3yY9u2", this.countryId, this.responsePlanId, true, "");
    };
    ReviewResponsePlanComponent.prototype.rejectPlan = function () {
        console.log("reject plan");
        var toggleValue = this.rejectToggleMap.get(this.responsePlanId);
        if (toggleValue) {
            this.rejectToggleMap.set(this.responsePlanId, !toggleValue);
        }
        else {
            this.rejectToggleMap.set(this.responsePlanId, true);
        }
    };
    ReviewResponsePlanComponent.prototype.triggerRejctDialog = function () {
        jQuery("#rejectPlan").modal("show");
    };
    ReviewResponsePlanComponent.prototype.confirmReject = function () {
        console.log("do reject update");
        jQuery("#rejectPlan").modal("hide");
        //TODO testing data, need to be updated!!!!
        this.responsePlanService.updateResponsePlanApproval(Enums_1.UserType.CountryDirector, "1b5mFmWq2fcdVncMwVDbNh3yY9u2", this.countryId, this.responsePlanId, false, this.rejectComment);
    };
    ReviewResponsePlanComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    /**
     * Private functions
     */
    ReviewResponsePlanComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return ReviewResponsePlanComponent;
}());
ReviewResponsePlanComponent = __decorate([
    core_1.Component({
        selector: 'app-review-response-plan',
        templateUrl: 'review-response-plan.component.html',
        styleUrls: ['review-response-plan.component.css'],
        providers: [response_plan_service_1.ResponsePlanService]
    })
], ReviewResponsePlanComponent);
exports.ReviewResponsePlanComponent = ReviewResponsePlanComponent;
