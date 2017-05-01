"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var rxjs_1 = require("rxjs");
var responsePlan_1 = require("../../model/responsePlan");
var CreateEditResponsePlanComponent = (function () {
    function CreateEditResponsePlanComponent(af, router, subscriptions) {
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.responsePlanSettings = {};
        this.ResponsePlanSectionSettings = Enums_1.ResponsePlanSectionSettings;
        this.totalSections = 0;
        // Section 1/10
        this.planName = '';
        this.geographicalLocation = '';
        this.staffMembers = [];
        this.staffMemberSelected = '';
        this.hazardScenarioSelected = 0;
        this.HazardScenario = Enums_1.HazardScenario;
        this.hazardScenariosList = [
            Enums_1.HazardScenario.HazardScenario0,
            Enums_1.HazardScenario.HazardScenario1,
            Enums_1.HazardScenario.HazardScenario2,
            Enums_1.HazardScenario.HazardScenario3,
            Enums_1.HazardScenario.HazardScenario4,
            Enums_1.HazardScenario.HazardScenario5,
            Enums_1.HazardScenario.HazardScenario6,
            Enums_1.HazardScenario.HazardScenario7,
            Enums_1.HazardScenario.HazardScenario8,
            Enums_1.HazardScenario.HazardScenario9,
            Enums_1.HazardScenario.HazardScenario10
        ];
        // Section 2/10
        this.scenarioCrisisList = [];
        this.impactOfCrisisList = [];
        this.availabilityOfFundsList = [];
        this.MAX_BULLET_POINTS_VAL_1 = 3;
        this.MAX_BULLET_POINTS_VAL_2 = 5;
        this.summarizeScenarioBulletPointsCounter = 1;
        this.summarizeScenarioBulletPoints = [this.summarizeScenarioBulletPointsCounter];
        this.summarizeScenarioRemoveOptionInvisible = true;
        this.impactOfCrisisBulletPointsCounter = 1;
        this.impactOfCrisisBulletPoints = [this.impactOfCrisisBulletPointsCounter];
        this.impactOfCrisisRemoveOptionInvisible = true;
        this.availabilityOfFundsBulletPointsCounter = 1;
        this.availabilityOfFundsBulletPoints = [this.availabilityOfFundsBulletPointsCounter];
        this.availabilityOfFundsRemoveOptionInvisible = true;
        // Section 3/10
        this.sectorsRelatedTo = [];
        this.otherRelatedSector = '';
        this.presenceInTheCountry = Enums_1.PresenceInTheCountry.currentProgrammes;
        this.methodOfImplementation = Enums_1.MethodOfImplementation.fieldStaff;
        this.isDirectlyThroughFieldStaff = true;
        this.partners = []; // TODO - Update to list of Partner Organisations
        // Section 4/10
        this.proposedResponseText = '';
        this.progressOfActivitiesPlanText = '';
        this.coordinationPlanText = '';
        // Section 5/10
        this.numOfPeoplePerHouseHold = 0;
        this.numOfHouseHolds = 0;
        this.numOfBeneficiaries = 0;
        this.vulnerableGroups = [];
        this.targetPopulationInvolmentList = [];
        // Section 6/10
        this.riskManagementPlanText = '';
        // Section 7/10
        // Section 8/10
        this.mALSystemsDescriptionText = '';
        this.intentToVisuallyDocument = true;
        this.mediaFormat = Enums_1.MediaFormat.photographic;
        // Section 9/10
        this.adjustedFemaleLessThan18 = 0;
        this.adjustedFemale18To50 = 0;
        this.adjustedFemalegreaterThan50 = 0;
        this.adjustedMaleLessThan18 = 0;
        this.adjustedMale18To50 = 0;
        this.adjustedMalegreaterThan50 = 0;
        // Section 10/10
        this.totalInputs = 0;
        this.totalBToH = 0;
        this.totalBudget = 0;
        this.waSHBudget = 0;
        this.healthBudget = 0;
        this.shelterBudget = 0;
        this.campManagementBudget = 0;
        this.educationBudget = 0;
        this.protectionBudget = 0;
        this.foodSecAndLivelihoodsBudget = 0;
        this.otherBudget = 0;
        this.waSHNarrative = '';
        this.healthNarrative = '';
        this.shelterNarrative = '';
        this.campManagementNarrative = '';
        this.educationNarrative = '';
        this.protectionNarrative = '';
        this.foodSecAndLivelihoodsNarrative = '';
        this.otherNarrative = '';
        this.transportBudget = 0;
        this.securityBudget = 0;
        this.logisticsAndOverheadsBudget = 0;
        this.staffingAndSupportBudget = 0;
        this.monitoringAndEvolutionBudget = 0;
        this.capitalItemsBudget = 0;
        this.managementSupportBudget = 0;
        this.transportNarrative = '';
        this.securityNarrative = '';
        this.logisticsAndOverheadsNarrative = '';
        this.staffingAndSupportNarrative = '';
        this.monitoringAndEvolutionNarrative = '';
        this.capitalItemsNarrative = '';
        this.managementSupportNarrative = '';
        this.capitalsExist = true;
    }
    CreateEditResponsePlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                console.log("Admin uid: " + _this.uid);
                _this.getStaff();
                var subscription_1 = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + _this.uid + '/agencyAdmin').subscribe(function (agencyAdminIds) {
                    _this.agencyAdminUid = agencyAdminIds[0].$key;
                    _this.getSettings();
                    var subscription = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/administratorAgency/" + _this.agencyAdminUid + '/systemAdmin').subscribe(function (systemAdminIds) {
                        _this.systemAdminUid = systemAdminIds[0].$key;
                        console.log(_this.agencyAdminUid);
                        console.log(_this.systemAdminUid);
                    });
                    _this.subscriptions.add(subscription);
                });
                _this.subscriptions.add(subscription_1);
            }
            else {
                _this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    };
    CreateEditResponsePlanComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    CreateEditResponsePlanComponent.prototype.onSubmit = function () {
        console.log("Finish button pressed");
        var newResponsePlan = new responsePlan_1.ResponsePlan;
        newResponsePlan.planName = this.planName;
        newResponsePlan.geographicalLocation = this.geographicalLocation;
        newResponsePlan.planLead = this.staffMemberSelected;
        newResponsePlan.hazardScenario = this.hazardScenarioSelected;
        newResponsePlan.scenarioCrisisList = this.scenarioCrisisList;
        newResponsePlan.impactOfCrisisList = this.impactOfCrisisList;
        newResponsePlan.availabilityOfFundsList = this.availabilityOfFundsList;
        newResponsePlan.sectorsRelatedTo = this.sectorsRelatedTo;
        newResponsePlan.otherRelatedSector = this.otherRelatedSector;
        newResponsePlan.presenceInTheCountry = this.presenceInTheCountry;
        newResponsePlan.methodOfImplementation = this.methodOfImplementation;
        newResponsePlan.partners = this.partners;
        newResponsePlan.proposedResponse = this.proposedResponseText;
        newResponsePlan.progressOfActivitiesPlan = this.progressOfActivitiesPlanText;
        newResponsePlan.coordinationPlan = this.coordinationPlanText;
        newResponsePlan.numOfBeneficiaries = this.numOfBeneficiaries;
        newResponsePlan.vulnerableGroups = this.vulnerableGroups;
        newResponsePlan.targetPopulationInvolmentList = this.targetPopulationInvolmentList;
        newResponsePlan.riskManagementPlan = this.riskManagementPlanText;
        newResponsePlan.mALSystemsDescription = this.mALSystemsDescriptionText;
        newResponsePlan.isMedia = this.intentToVisuallyDocument;
        newResponsePlan.mediaFormat = this.mediaFormat;
        newResponsePlan.totalSections = this.totalSections;
        console.log("New Response Plan ----> " + newResponsePlan);
        // If logged in as a Country admin
        var responsePlansPath = Constants_1.Constants.APP_STATUS + '/responsePlan/' + this.uid;
        this.af.database.list(responsePlansPath).push(newResponsePlan).then(function () {
            console.log("Response plan creation successful");
        }).catch(function (error) {
            console.log("Response plan creation unsuccessful with error --> " + error.message);
        });
    };
    /**
     * Section 1/10
     */
    CreateEditResponsePlanComponent.prototype.filterData = function () {
        console.log("Hazard Scenario Selected");
    };
    CreateEditResponsePlanComponent.prototype.staffSelected = function () {
        console.log("Staff Member Selected");
        console.log(this.planName);
        console.log(this.geographicalLocation);
        console.log(this.hazardScenarioSelected);
        console.log(this.staffMemberSelected);
    };
    /**
     * Section 2/10
     */
    /**
     * Section 3/10
     */
    CreateEditResponsePlanComponent.prototype.addSummarizeScenarioBulletPoint = function () {
        this.summarizeScenarioBulletPointsCounter++;
        this.summarizeScenarioBulletPoints.push(this.summarizeScenarioBulletPointsCounter);
        if (this.summarizeScenarioBulletPoints.length > 1) {
            this.summarizeScenarioRemoveOptionInvisible = false;
        }
    };
    CreateEditResponsePlanComponent.prototype.removeSummarizeScenarioBulletPoint = function (bulletPoint) {
        this.summarizeScenarioBulletPointsCounter--;
        if (this.summarizeScenarioBulletPoints.length > 1) {
            this.summarizeScenarioBulletPoints = this.summarizeScenarioBulletPoints.filter(function (item) { return item !== bulletPoint; });
        }
        if (this.summarizeScenarioBulletPoints.length == 1) {
            this.summarizeScenarioRemoveOptionInvisible = true;
        }
    };
    CreateEditResponsePlanComponent.prototype.addImpactOfCrisisBulletPoint = function () {
        this.impactOfCrisisBulletPointsCounter++;
        this.impactOfCrisisBulletPoints.push(this.impactOfCrisisBulletPointsCounter);
        if (this.impactOfCrisisBulletPoints.length > 1) {
            this.impactOfCrisisRemoveOptionInvisible = false;
        }
    };
    CreateEditResponsePlanComponent.prototype.removeImpactOfCrisisBulletPoint = function (bulletPoint) {
        this.impactOfCrisisBulletPointsCounter--;
        if (this.impactOfCrisisBulletPoints.length > 1) {
            this.impactOfCrisisBulletPoints = this.impactOfCrisisBulletPoints.filter(function (item) { return item !== bulletPoint; });
        }
        if (this.impactOfCrisisBulletPoints.length == 1) {
            this.impactOfCrisisRemoveOptionInvisible = true;
        }
    };
    CreateEditResponsePlanComponent.prototype.addAvailabilityOfFundsBulletPoint = function () {
        this.availabilityOfFundsBulletPointsCounter++;
        this.availabilityOfFundsBulletPoints.push(this.availabilityOfFundsBulletPointsCounter);
        if (this.availabilityOfFundsBulletPoints.length > 1) {
            this.availabilityOfFundsRemoveOptionInvisible = false;
        }
    };
    CreateEditResponsePlanComponent.prototype.removeAvailabilityOfFundsBulletPoint = function (bulletPoint) {
        this.availabilityOfFundsBulletPointsCounter--;
        if (this.availabilityOfFundsBulletPoints.length > 1) {
            this.availabilityOfFundsBulletPoints = this.availabilityOfFundsBulletPoints.filter(function (item) { return item !== bulletPoint; });
        }
        if (this.availabilityOfFundsBulletPoints.length == 1) {
            this.availabilityOfFundsRemoveOptionInvisible = true;
        }
    };
    CreateEditResponsePlanComponent.prototype.directMethodOfImplementationSelected = function () {
        this.isDirectlyThroughFieldStaff = true;
    };
    CreateEditResponsePlanComponent.prototype.partnersMethodOfImplementationSelected = function () {
        this.isDirectlyThroughFieldStaff = false;
    };
    /**
     * Section 4/10
     */
    /**
     * Section 5/10
     */
    CreateEditResponsePlanComponent.prototype.calculateBeneficiaries = function () {
        this.numOfBeneficiaries = this.numOfPeoplePerHouseHold * this.numOfHouseHolds;
        console.log("Beneficiaries ----" + this.numOfBeneficiaries);
    };
    /**
     * Section 6/10
     */
    /**
     * Section 7/10
     */
    /**
     * Section 8/10
     */
    CreateEditResponsePlanComponent.prototype.yesSelectedForVisualDocument = function () {
        this.intentToVisuallyDocument = true;
    };
    CreateEditResponsePlanComponent.prototype.noSelectedForVisualDocument = function () {
        this.intentToVisuallyDocument = false;
    };
    /**
     * Section 9/10
     */
    /**
     * Section 10/10
     */
    CreateEditResponsePlanComponent.prototype.calculateBudget = function () {
        this.totalInputs = this.waSHBudget + this.healthBudget + this.shelterBudget + this.campManagementBudget + this.educationBudget + this.protectionBudget + this.foodSecAndLivelihoodsBudget + this.otherBudget;
        this.totalBToH = this.transportBudget + this.securityBudget + this.logisticsAndOverheadsBudget + this.staffingAndSupportBudget + this.monitoringAndEvolutionBudget + this.capitalItemsBudget + this.managementSupportBudget;
        this.totalBudget = this.totalInputs + this.totalBToH;
    };
    CreateEditResponsePlanComponent.prototype.yesSelectedForCapitalsExist = function () {
        this.capitalsExist = true;
    };
    CreateEditResponsePlanComponent.prototype.noSelectedForCapitalsExist = function () {
        this.capitalsExist = false;
    };
    /**
     * Functions
     */
    CreateEditResponsePlanComponent.prototype.goBack = function () {
        this.router.navigateByUrl('response-plans');
    };
    /**
     * Private functions
     */
    CreateEditResponsePlanComponent.prototype.getSettings = function () {
        var _this = this;
        if (this.agencyAdminUid) {
            this.responsePlanSettings = {};
            var subscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + this.agencyAdminUid + '/responsePlanSettings/sections')
                .subscribe(function (list) {
                list.forEach(function (item) {
                    _this.responsePlanSettings[item.$key] = item.$value;
                });
            });
            this.subscriptions.add(subscription);
        }
        console.log(this.responsePlanSettings);
    };
    CreateEditResponsePlanComponent.prototype.getStaff = function () {
        var _this = this;
        var subscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/staff/' + this.uid)
            .flatMap(function (list) {
            _this.staffMembers = [];
            var tempList = [];
            list.forEach(function (x) {
                tempList.push(x);
            });
            return rxjs_1.Observable.from(tempList);
        })
            .flatMap(function (item) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + item.$key);
        })
            .distinctUntilChanged()
            .subscribe(function (x) {
            _this.staffMembers.push(x);
        });
        this.subscriptions.add(subscription);
    };
    CreateEditResponsePlanComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    CreateEditResponsePlanComponent = __decorate([
        core_1.Component({
            selector: 'app-create-edit-response-plan',
            templateUrl: './create-edit-response-plan.component.html',
            styleUrls: ['./create-edit-response-plan.component.css']
        })
    ], CreateEditResponsePlanComponent);
    return CreateEditResponsePlanComponent;
}());
exports.CreateEditResponsePlanComponent = CreateEditResponsePlanComponent;
