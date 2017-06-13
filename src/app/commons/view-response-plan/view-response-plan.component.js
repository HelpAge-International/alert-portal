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
var responsePlan_1 = require("../../model/responsePlan");
var Enums_1 = require("../../utils/Enums");
var plan_activity_model_1 = require("../../model/plan-activity.model");
var ViewResponsePlanComponent = (function () {
    function ViewResponsePlanComponent(af, router, userService, route) {
        this.af = af;
        this.router = router;
        this.userService = userService;
        this.route = route;
        this.SECTORS = Constants_1.Constants.RESPONSE_PLANS_SECTORS;
        this.PresenceInTheCountry = Enums_1.PresenceInTheCountry;
        this.MethodOfImplementation = Enums_1.MethodOfImplementation;
        this.Gender = Enums_1.Gender;
        this.AgeRange = Enums_1.AgeRange;
        this.SourcePlan = Enums_1.SourcePlan;
        this.imgNames = ["water", "health", "shelter", "nutrition", "food", "protection", "education", "camp", "misc"];
        // TODO - Update this
        this.USER_TYPE = 'administratorCountry';
        this.responsePlanToShow = new responsePlan_1.ResponsePlan;
        this.ngUnsubscribe = new rxjs_1.Subject();
        // Section 01
        this.HazardScenariosList = Constants_1.Constants.HAZARD_SCENARIOS;
        this.planLeadName = '';
        this.partnerList = [];
        // Section 07
        // Section 08
        this.intendToVisuallyDoc = '';
        // Section 10
        this.BudgetCategory = Enums_1.BudgetCategory;
        this.SectorsList = Constants_1.Constants.RESPONSE_PLANS_SECTORS;
        this.activityInfoMap = new Map();
        this.activityMap = new Map();
    }
    ViewResponsePlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.loadData();
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    ViewResponsePlanComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    ViewResponsePlanComponent.prototype.isNumber = function (n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    };
    /**
     * Private functions
     */
    ViewResponsePlanComponent.prototype.loadData = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            var countryID = params['countryID'] ? params['countryID'] : false;
            var responsePlanID = params['id'] ? params['id'] : false;
            var token = params['token'] ? params['token'] : false;
            if (countryID && responsePlanID && token) {
                _this.countryId = countryID;
                _this.responsePlanId = responsePlanID;
                _this.loadResponsePlanData();
            }
            else {
                _this.getCountryId().then(function () {
                    if (_this.responsePlanId) {
                        _this.loadResponsePlanData();
                    }
                    else {
                        _this.route.params
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (params) {
                            if (params["id"]) {
                                _this.responsePlanId = params["id"];
                                _this.loadResponsePlanData();
                            }
                        });
                    }
                });
            }
        });
    };
    ViewResponsePlanComponent.prototype.getCountryId = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + "/countryId")
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (countryId) {
                _this.countryId = countryId.$value;
                res(true);
            });
        });
        return promise;
    };
    ViewResponsePlanComponent.prototype.loadResponsePlanData = function () {
        var _this = this;
        //        console.log("response plan id: " + this.responsePlanId);
        //        console.log("countryID: " + this.countryId);
        var responsePlansPath = Constants_1.Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.responsePlanId;
        this.af.database.object(responsePlansPath)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (responsePlan) {
            _this.responsePlanToShow = responsePlan;
            _this.loadSection1PlanLead(responsePlan);
            _this.loadSection3(responsePlan);
            _this.loadSection7(responsePlan);
            _this.loadSection8(responsePlan);
            _this.loadSection10(responsePlan);
        });
    };
    ViewResponsePlanComponent.prototype.loadSection1PlanLead = function (responsePlan) {
        var _this = this;
        if (responsePlan.planLead) {
            this.userService.getUser(responsePlan.planLead)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (user) {
                _this.planLeadName = user.firstName + " " + user.lastName;
            });
        }
        else {
            this.planLeadName = 'Unassigned';
        }
    };
    // TODO -
    ViewResponsePlanComponent.prototype.loadSection3 = function (responsePlan) {
        var _this = this;
        console.log(responsePlan);
        if (responsePlan.sectors) {
            this.sectors = Object.keys(responsePlan.sectors).map(function (key) {
                var sector = responsePlan.sectors[key];
                sector["id"] = Number(key);
                return sector;
            });
        }
        if (responsePlan.partnerOrganisations) {
            this.partnerList = [];
            var partnerIds = Object.keys(responsePlan.partnerOrganisations).map(function (key) { return responsePlan.partnerOrganisations[key]; });
            partnerIds.forEach(function (id) {
                _this.userService.getOrganisationName(id)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (organisation) {
                    _this.partnerList.push(organisation.organisationName);
                });
            });
        }
    };
    // TODO -
    ViewResponsePlanComponent.prototype.loadSection7 = function (responsePlan) {
        var _this = this;
        if (this.sectors) {
            // let sectors: {} = responsePlan.sectors;
            Object.keys(responsePlan.sectors).forEach(function (sectorKey) {
                //activity info load back
                // let sectorInfo = this.activityInfoMap.get(sectorKey);
                // if (!sectorInfo) {
                var infoData = {};
                infoData["sourcePlan"] = responsePlan.sectors[sectorKey]["sourcePlan"];
                infoData["bullet1"] = responsePlan.sectors[sectorKey]["bullet1"];
                infoData["bullet2"] = responsePlan.sectors[sectorKey]["bullet2"];
                _this.activityInfoMap.set(Number(sectorKey), infoData);
                // }
                //activities list load back
                var activitiesData = responsePlan.sectors[sectorKey]["activities"];
                var moreData = [];
                Object.keys(activitiesData).forEach(function (key) {
                    var beneficiary = [];
                    activitiesData[key]["beneficiary"].forEach(function (item) {
                        beneficiary.push(item);
                    });
                    var model = new plan_activity_model_1.ModelPlanActivity(activitiesData[key]["name"], activitiesData[key]["output"], activitiesData[key]["indicator"], beneficiary);
                    moreData.push(model);
                    _this.activityMap.set(Number(sectorKey), moreData);
                });
            });
        }
    };
    ViewResponsePlanComponent.prototype.loadSection8 = function (responsePlan) {
        if (responsePlan.monAccLearning) {
            if (responsePlan.monAccLearning['isMedia']) {
                if (responsePlan.monAccLearning['mediaFormat'] || responsePlan.monAccLearning['mediaFormat'] == 0) {
                    this.intendToVisuallyDoc = "GLOBAL.YES";
                    this.mediaType = Constants_1.Constants.MEDIA_TYPES[responsePlan.monAccLearning['mediaFormat']];
                }
                else {
                    this.intendToVisuallyDoc = "GLOBAL.YES";
                    this.mediaType = '';
                }
            }
            else {
                this.intendToVisuallyDoc = "GLOBAL.NO";
                this.mediaType = '';
            }
        }
        else {
            this.intendToVisuallyDoc = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
        }
    };
    // TODO -
    ViewResponsePlanComponent.prototype.loadSection10 = function (responsePlan) {
        if (responsePlan.budget) {
            this.totalInputs = responsePlan.budget['totalInputs'] ? responsePlan.budget['totalInputs'] : 0;
            this.totalOfAllCosts = responsePlan.budget['totalOfAllCosts'] ? responsePlan.budget['totalOfAllCosts'] : 0;
            this.total = responsePlan.budget['total'] ? responsePlan.budget['total'] : 0;
            if (responsePlan.budget['item']) {
                this.transportBudget = responsePlan.budget['item'][Enums_1.BudgetCategory.Transport] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Transport]['budget'] : 0;
                this.transportNarrative = responsePlan.budget['item'][Enums_1.BudgetCategory.Transport] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Transport]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";
                this.securityBudget = responsePlan.budget['item'][Enums_1.BudgetCategory.Security] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Security]['budget'] : 0;
                this.securityNarrative = responsePlan.budget['item'][Enums_1.BudgetCategory.Security] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Security]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";
                this.logisticsAndOverheadsBudget = responsePlan.budget['item'][Enums_1.BudgetCategory.Logistics] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Logistics]['budget'] : 0;
                this.logisticsAndOverheadsNarrative = responsePlan.budget['item'][Enums_1.BudgetCategory.Logistics] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Logistics]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";
                this.staffingAndSupportBudget = responsePlan.budget['item'][Enums_1.BudgetCategory.Staffing] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Staffing]['budget'] : 0;
                this.staffingAndSupportNarrative = responsePlan.budget['item'][Enums_1.BudgetCategory.Staffing] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Staffing]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";
                this.monitoringAndEvolutionBudget = responsePlan.budget['item'][Enums_1.BudgetCategory.Monitoring] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Monitoring]['budget'] : 0;
                this.monitoringAndEvolutionNarrative = responsePlan.budget['item'][Enums_1.BudgetCategory.Monitoring] ? responsePlan.budget['item'][Enums_1.BudgetCategory.Monitoring]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";
                this.capitalItemsBudget = responsePlan.budget['item'][Enums_1.BudgetCategory.CapitalItems] ? responsePlan.budget['item'][Enums_1.BudgetCategory.CapitalItems]['budget'] : 0;
                this.capitalItemsNarrative = responsePlan.budget['item'][Enums_1.BudgetCategory.CapitalItems] ? responsePlan.budget['item'][Enums_1.BudgetCategory.CapitalItems]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";
                this.managementSupportPercentage = responsePlan.budget['item'][Enums_1.BudgetCategory.ManagementSupport] ? responsePlan.budget['item'][Enums_1.BudgetCategory.ManagementSupport]['budget'] + '%' : '0%';
                this.managementSupportNarrative = responsePlan.budget['item'][Enums_1.BudgetCategory.ManagementSupport] ? responsePlan.budget['item'][Enums_1.BudgetCategory.ManagementSupport]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";
            }
            else {
                this.assignDefaultValues();
            }
        }
        else {
            this.assignDefaultValues();
        }
    };
    ViewResponsePlanComponent.prototype.assignDefaultValues = function () {
        this.transportBudget = 0;
        this.securityBudget = 0;
        this.logisticsAndOverheadsBudget = 0;
        this.staffingAndSupportBudget = 0;
        this.monitoringAndEvolutionBudget = 0;
        this.capitalItemsBudget = 0;
        this.managementSupportPercentage = 0;
        this.totalInputs = 0;
        this.totalOfAllCosts = 0;
        this.total = 0;
        this.transportNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
        this.securityNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
        this.logisticsAndOverheadsNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
        this.staffingAndSupportNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
        this.monitoringAndEvolutionNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
        this.capitalItemsNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
        this.managementSupportNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    };
    ViewResponsePlanComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return ViewResponsePlanComponent;
}());
__decorate([
    core_1.Input()
], ViewResponsePlanComponent.prototype, "responsePlanId", void 0);
ViewResponsePlanComponent = __decorate([
    core_1.Component({
        selector: 'app-view-response-plan',
        templateUrl: 'view-response-plan.component.html',
        styleUrls: ['view-response-plan.component.css']
    })
], ViewResponsePlanComponent);
exports.ViewResponsePlanComponent = ViewResponsePlanComponent;
