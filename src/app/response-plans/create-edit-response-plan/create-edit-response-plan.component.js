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
var Enums_1 = require("../../utils/Enums");
var rxjs_1 = require("rxjs");
var responsePlan_1 = require("../../model/responsePlan");
var plan_activity_model_1 = require("../../model/plan-activity.model");
var budget_item_model_1 = require("../../model/budget-item.model");
var alert_message_model_1 = require("../../model/alert-message.model");
var CreateEditResponsePlanComponent = (function () {
    function CreateEditResponsePlanComponent(af, router, route, userService) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.userService = userService;
        this.USER_TYPE = 'administratorCountry';
        this.SECTORS = Constants_1.Constants.RESPONSE_PLANS_SECTORS;
        this.forEditing = false;
        this.alertMessageType = Enums_1.AlertMessageType;
        this.alertMessage = null;
        this.pageTitle = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.TITLE_TEXT";
        this.responsePlanSettings = {};
        this.ResponsePlanSectionSettings = Enums_1.ResponsePlanSectionSettings;
        this.totalSections = 0;
        this.numberOfCompletedSections = 0;
        this.MAX_BULLET_POINTS_VAL_1 = Constants_1.Constants.MAX_BULLET_POINTS_VAL_1;
        this.MAX_BULLET_POINTS_VAL_2 = Constants_1.Constants.MAX_BULLET_POINTS_VAL_2;
        this.sectionsCompleted = new Map();
        this.sections = ["section1", "section2", "section3", "section4",
            "section5", "section6", "section7", "section8", "section9", "section10"];
        // Section 1/10
        this.planName = '';
        this.geographicalLocation = '';
        // private staffMembers: FirebaseObjectObservable<any>[] = [];
        this.staffMembers = [];
        this.HazardScenario = Constants_1.Constants.HAZARD_SCENARIOS;
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
            Enums_1.HazardScenario.HazardScenario10,
            Enums_1.HazardScenario.HazardScenario11,
            Enums_1.HazardScenario.HazardScenario12,
            Enums_1.HazardScenario.HazardScenario13,
            Enums_1.HazardScenario.HazardScenario14,
            Enums_1.HazardScenario.HazardScenario15,
            Enums_1.HazardScenario.HazardScenario16,
            Enums_1.HazardScenario.HazardScenario17,
            Enums_1.HazardScenario.HazardScenario18,
            Enums_1.HazardScenario.HazardScenario19,
            Enums_1.HazardScenario.HazardScenario20,
            Enums_1.HazardScenario.HazardScenario21,
            Enums_1.HazardScenario.HazardScenario22,
            Enums_1.HazardScenario.HazardScenario23,
            Enums_1.HazardScenario.HazardScenario24,
            Enums_1.HazardScenario.HazardScenario25,
            Enums_1.HazardScenario.HazardScenario26,
        ];
        this.section1Status = "GLOBAL.INCOMPLETE";
        // Section 2/10
        this.scenarioCrisisObject = {};
        this.impactOfCrisisObject = {};
        this.availabilityOfFundsObject = {};
        this.summarizeScenarioBulletPointsCounter = 1;
        this.summarizeScenarioBulletPoints = [this.summarizeScenarioBulletPointsCounter];
        this.impactOfCrisisBulletPointsCounter = 1;
        this.impactOfCrisisBulletPoints = [this.impactOfCrisisBulletPointsCounter];
        this.availabilityOfFundsBulletPointsCounter = 1;
        this.availabilityOfFundsBulletPoints = [this.availabilityOfFundsBulletPointsCounter];
        this.section2Status = "GLOBAL.INCOMPLETE";
        // Section 3/10
        this.sectorsRelatedTo = [];
        this.otherRelatedSector = '';
        this.waSHSectorSelected = false;
        this.healthSectorSelected = false;
        this.shelterSectorSelected = false;
        this.nutritionSectorSelected = false;
        this.foodSecAndLivelihoodsSectorSelected = false;
        this.protectionSectorSelected = false;
        this.educationSectorSelected = false;
        this.campManagementSectorSelected = false;
        this.otherSectorSelected = false;
        this.partnersDropDownsCounter = 1;
        this.partnersDropDowns = [this.partnersDropDownsCounter];
        // private partnerOrganisations: FirebaseObjectObservable<any>[] = [];
        this.partnerOrganisations = [];
        this.partnerOrganisationsSelected = {};
        this.section3Status = "GLOBAL.INCOMPLETE";
        // Section 4/10
        this.proposedResponseText = '';
        this.progressOfActivitiesPlanText = '';
        this.coordinationPlanText = '';
        this.section4Status = "GLOBAL.INCOMPLETE";
        this.numOfBeneficiaries = 0;
        this.showBeneficiariesTextEntry = false;
        this.howBeneficiariesCalculatedText = '';
        this.groups = [];
        this.Other = "Other";
        this.otherGroup = '';
        this.selectedVulnerableGroups = {};
        this.vulnerableGroupsDropDownsCounter = 1;
        this.vulnerableGroupsDropDowns = [this.vulnerableGroupsDropDownsCounter];
        this.targetPopulationBulletPointsCounter = 1;
        this.targetPopulationBulletPoints = [this.targetPopulationBulletPointsCounter];
        this.targetPopulationInvolvementObject = {};
        this.section5Status = "GLOBAL.INCOMPLETE";
        // Section 6/10
        this.riskManagementPlanText = '';
        this.section6Status = "GLOBAL.INCOMPLETE";
        // Section 7/10
        this.section7Status = "GLOBAL.INCOMPLETE";
        this.activityMap = new Map();
        this.addActivityToggleMap = new Map();
        this.activityInfoMap = new Map();
        this.imgNames = ["water", "health", "shelter", "nutrition", "food", "protection", "education", "camp", "misc"];
        // Section 8/10
        this.mALSystemsDescriptionText = '';
        this.intentToVisuallyDocument = false;
        this.section8Status = "GLOBAL.INCOMPLETE";
        // Section 9/10
        this.numberFemaleLessThan18 = 0;
        this.numberFemale18To50 = 0;
        this.numberFemalegreaterThan50 = 0;
        this.numberMaleLessThan18 = 0;
        this.numberMale18To50 = 0;
        this.numberMalegreaterThan50 = 0;
        this.adjustedFemaleLessThan18 = 0;
        this.adjustedFemale18To50 = 0;
        this.adjustedFemalegreaterThan50 = 0;
        this.adjustedMaleLessThan18 = 0;
        this.adjustedMale18To50 = 0;
        this.adjustedMalegreaterThan50 = 0;
        this.isDoubleCountingDone = false;
        this.section9Status = "GLOBAL.INCOMPLETE";
        // Section 10/10
        this.sectorBudget = new Map();
        this.sectorNarrative = new Map();
        this.budgetOver1000 = new Map();
        this.budgetOver1000Desc = new Map();
        this.totalInputs = 0;
        this.totalOfAllCosts = 0;
        this.totalBudget = 0;
        this.transportNarrative = '';
        this.securityNarrative = '';
        this.logisticsAndOverheadsNarrative = '';
        this.staffingAndSupportNarrative = '';
        this.monitoringAndEvolutionNarrative = '';
        this.capitalItemsNarrative = '';
        this.managementSupportNarrative = '';
        this.capitalsExist = false;
        this.capitalItemSectionSectionsCounter = 1;
        this.capitalItemSections = [this.capitalItemSectionSectionsCounter];
        this.section10Status = "GLOBAL.INCOMPLETE";
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateEditResponsePlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                console.log("Admin uid: " + _this.uid);
                _this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + "/countryId")
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (countryId) {
                    _this.countryId = countryId.$value;
                    _this.getStaff();
                    _this.setupForEdit();
                    _this.af.database.list(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + '/agencyAdmin')
                        .takeUntil(_this.ngUnsubscribe)
                        .subscribe(function (agencyAdminIds) {
                        _this.agencyAdminUid = agencyAdminIds[0].$key;
                        _this.getSettings();
                        _this.getPartners();
                        _this.af.database.list(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + '/systemAdmin')
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (systemAdminIds) {
                            _this.systemAdminUid = systemAdminIds[0].$key;
                            _this.getGroups();
                        });
                    });
                });
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    CreateEditResponsePlanComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    /**
     * Finish Button press on section 10
     */
    CreateEditResponsePlanComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log("Finish button pressed");
        this.checkAllSections();
        var newResponsePlan = new responsePlan_1.ResponsePlan;
        //section 1
        newResponsePlan.name = this.planName;
        newResponsePlan.location = this.geographicalLocation;
        if (this.staffMemberSelected) {
            newResponsePlan.planLead = this.staffMemberSelected;
        }
        if (this.hazardScenarioSelected) {
            newResponsePlan.hazardScenario = this.hazardScenarioSelected;
        }
        //section 2
        newResponsePlan.scenarioCrisisList = this.convertTolist(this.scenarioCrisisObject);
        newResponsePlan.impactOfCrisisList = this.convertTolist(this.impactOfCrisisObject);
        newResponsePlan.availabilityOfFundsList = this.convertTolist(this.availabilityOfFundsObject);
        //section 3
        newResponsePlan.sectorsRelatedTo = this.sectorsRelatedTo;
        newResponsePlan.otherRelatedSector = this.otherRelatedSector;
        if (this.presenceInTheCountry) {
            newResponsePlan.presenceInTheCountry = this.presenceInTheCountry;
        }
        // newResponsePlan.methodOfImplementation = this.isDirectlyThroughFieldStaff == true ? MethodOfImplementation.fieldStaff : MethodOfImplementation.withPartner;
        // newResponsePlan.partnerOrganisations = this.convertTolist(this.partnerOrganisationsSelected);
        if (this.isDirectlyThroughFieldStaff) {
            newResponsePlan.methodOfImplementation = Enums_1.MethodOfImplementation.fieldStaff;
        }
        else {
            if (Object.keys(this.partnerOrganisationsSelected).length != 0) {
                newResponsePlan.methodOfImplementation = Enums_1.MethodOfImplementation.withPartner;
                newResponsePlan.partnerOrganisations = this.convertTolist(this.partnerOrganisationsSelected);
            }
            else {
                newResponsePlan.methodOfImplementation = Enums_1.MethodOfImplementation.fieldStaff;
            }
        }
        //section 4
        newResponsePlan.activitySummary["q1"] = this.proposedResponseText;
        newResponsePlan.activitySummary["q2"] = this.progressOfActivitiesPlanText;
        newResponsePlan.activitySummary["q3"] = this.coordinationPlanText;
        //section 5
        if (this.numOfPeoplePerHouseHold) {
            newResponsePlan.peoplePerHousehold = this.numOfPeoplePerHouseHold;
        }
        if (this.numOfHouseHolds) {
            newResponsePlan.numOfHouseholds = this.numOfHouseHolds;
        }
        newResponsePlan.beneficiariesNote = this.howBeneficiariesCalculatedText ? this.howBeneficiariesCalculatedText : '';
        newResponsePlan.vulnerableGroups = this.convertTolist(this.selectedVulnerableGroups);
        newResponsePlan.otherVulnerableGroup = this.otherGroup ? this.otherGroup : '';
        newResponsePlan.targetPopulationInvolvementList = this.convertTolist(this.targetPopulationInvolvementObject);
        //section 6
        newResponsePlan.riskManagementPlan = this.riskManagementPlanText;
        //section 7
        this.activityMap.forEach(function (v, k) {
            var sectorInfo = {};
            sectorInfo["sourcePlan"] = _this.activityInfoMap.get(k)["sourcePlan"];
            sectorInfo["bullet1"] = _this.activityInfoMap.get(k)["bullet1"];
            sectorInfo["bullet2"] = _this.activityInfoMap.get(k)["bullet2"];
            sectorInfo["activities"] = v;
            newResponsePlan.sectors[k] = sectorInfo;
        });
        //section 8
        newResponsePlan.monAccLearning['mALSystemsDescription'] = this.mALSystemsDescriptionText;
        if (this.mediaFormat != null) {
            if (this.intentToVisuallyDocument) {
                newResponsePlan.monAccLearning['mediaFormat'] = this.mediaFormat;
                newResponsePlan.monAccLearning['isMedia'] = true;
            }
            else {
                newResponsePlan.monAccLearning['mediaFormat'] = null;
                newResponsePlan.monAccLearning['isMedia'] = true;
            }
        }
        else {
            this.intentToVisuallyDocument = false;
            newResponsePlan.monAccLearning['isMedia'] = false;
        }
        //section 9
        var doubleCounting = {};
        for (var i = 0; i < 6; i++) {
            var data = {};
            if (i < 3) {
                data["gender"] = Enums_1.Gender.feMale;
                if (i == 0) {
                    data["value"] = this.adjustedFemaleLessThan18;
                }
                else if (i == 1) {
                    data["value"] = this.adjustedFemale18To50;
                }
                else {
                    data["value"] = this.adjustedFemalegreaterThan50;
                }
            }
            else {
                data["gender"] = Enums_1.Gender.male;
                if (i == 3) {
                    data["value"] = this.adjustedMaleLessThan18;
                }
                else if (i == 4) {
                    data["value"] = this.adjustedMale18To50;
                }
                else {
                    data["value"] = this.adjustedMalegreaterThan50;
                }
            }
            if (i == 0 || i == 3) {
                data["age"] = Enums_1.AgeRange.Less18;
            }
            else if (i == 1 || i == 4) {
                data["age"] = Enums_1.AgeRange.Between18To50;
            }
            else {
                data["age"] = Enums_1.AgeRange.More50;
            }
            doubleCounting[i] = data;
        }
        newResponsePlan.doubleCounting = doubleCounting;
        //section 10
        var budgetData = {};
        var inputs = {};
        var diff = [];
        this.sectorsRelatedTo.forEach(function (item) {
            console.log("*****************");
            console.log(_this.sectorBudget);
            console.log("*****************");
            console.log(item);
            if (!_this.sectorBudget.get(item)) {
                diff.push(item);
                console.log("*****************");
                console.log(item);
            }
        });
        diff.forEach(function (item) {
            _this.sectorBudget.set(Number(item), 0);
            _this.sectorNarrative.set(Number(item), "");
        });
        this.sectorBudget.forEach(function (v, k) {
            var item = new budget_item_model_1.ModelBudgetItem();
            item.budget = _this.sectorBudget && _this.sectorBudget.get(k) ? _this.sectorBudget.get(k) : 0;
            item.narrative = _this.sectorNarrative && _this.sectorNarrative.get(k) ? _this.sectorNarrative.get(k) : "";
            // inputs.push(item);
            inputs[k] = item;
        });
        var allBudgetValues = {};
        allBudgetValues[1] = this.transportBudget ? this.transportBudget : 0;
        allBudgetValues[2] = this.securityBudget ? this.securityBudget : 0;
        allBudgetValues[3] = this.logisticsAndOverheadsBudget ? this.logisticsAndOverheadsBudget : 0;
        allBudgetValues[4] = this.staffingAndSupportBudget ? this.staffingAndSupportBudget : 0;
        allBudgetValues[5] = this.monitoringAndEvolutionBudget ? this.monitoringAndEvolutionBudget : 0;
        allBudgetValues[6] = this.capitalItemsBudget ? this.capitalItemsBudget : 0;
        allBudgetValues[7] = this.managementSupportPercentage ? this.managementSupportPercentage : 0;
        var allBudgetNarratives = {};
        allBudgetNarratives[1] = this.transportNarrative;
        allBudgetNarratives[2] = this.securityNarrative;
        allBudgetNarratives[3] = this.logisticsAndOverheadsNarrative;
        allBudgetNarratives[4] = this.staffingAndSupportNarrative;
        allBudgetNarratives[5] = this.monitoringAndEvolutionNarrative;
        allBudgetNarratives[6] = this.capitalItemsNarrative;
        allBudgetNarratives[7] = this.managementSupportNarrative;
        for (var i = 0; i < 8; i++) {
            if (i == 0) {
                budgetData[0] = inputs;
            }
            else {
                var tempItem = new budget_item_model_1.ModelBudgetItem();
                tempItem.budget = allBudgetValues[i];
                tempItem.narrative = allBudgetNarratives[i];
                budgetData[i] = tempItem;
            }
        }
        newResponsePlan.budget["item"] = budgetData;
        if (this.capitalsExist) {
            newResponsePlan.budget["itemsOver1000Exists"] = this.capitalsExist;
            var itemsOver1000_1 = [];
            this.budgetOver1000.forEach(function (v, k) {
                var tempItem = new budget_item_model_1.ModelBudgetItem();
                tempItem.budget = v;
                tempItem.narrative = _this.budgetOver1000Desc && _this.budgetOver1000Desc.get(k) ? _this.budgetOver1000Desc.get(k) : "";
                itemsOver1000_1.push(tempItem);
            });
            newResponsePlan.budget["itemsOver1000"] = itemsOver1000_1;
        }
        else {
            newResponsePlan.budget["itemsOver1000Exists"] = this.capitalsExist;
        }
        newResponsePlan.budget["totalInputs"] = this.totalInputs;
        newResponsePlan.budget["totalOfAllCosts"] = this.totalOfAllCosts;
        newResponsePlan.budget["total"] = this.totalBudget;
        newResponsePlan.totalSections = this.totalSections;
        newResponsePlan.isActive = true;
        newResponsePlan.status = Enums_1.ApprovalStatus.InProgress;
        newResponsePlan.sectionsCompleted = this.getCompleteSectionNumber();
        if (!this.forEditing) {
            newResponsePlan.startDate = Date.now();
            newResponsePlan.timeCreated = Date.now();
            newResponsePlan.createdBy = this.uid;
        }
        if (this.forEditing) {
            newResponsePlan.timeUpdated = Date.now();
            newResponsePlan.updatedBy = this.uid;
        }
        this.saveToFirebase(newResponsePlan);
    };
    /**
     * Section 1/10
     */
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection1 = function () {
        if (this.planName != '' && this.geographicalLocation != '' && this.hazardScenarioSelected != null && this.staffMemberSelected != '') {
            this.section1Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[0], true);
        }
        else {
            this.section1Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[0], false);
        }
    };
    /**
     * Section 2/10
     */
    CreateEditResponsePlanComponent.prototype.addToSummarizeScenarioObject = function (bulletPoint, textEntered) {
        if (textEntered) {
            this.scenarioCrisisObject[bulletPoint] = textEntered;
        }
        else {
            if (this.scenarioCrisisObject[bulletPoint]) {
                delete this.scenarioCrisisObject[bulletPoint];
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.addSummarizeScenarioBulletPoint = function () {
        this.summarizeScenarioBulletPointsCounter++;
        this.summarizeScenarioBulletPoints.push(this.summarizeScenarioBulletPointsCounter);
    };
    CreateEditResponsePlanComponent.prototype.removeSummarizeScenarioBulletPoint = function (bulletPoint) {
        this.summarizeScenarioBulletPointsCounter--;
        this.summarizeScenarioBulletPoints = this.summarizeScenarioBulletPoints.filter(function (item) { return item !== bulletPoint; });
        // Removing bullet point from list if exists
        if (this.scenarioCrisisObject[bulletPoint]) {
            delete this.scenarioCrisisObject[bulletPoint];
        }
        else {
            console.log("Bullet point not in list");
        }
    };
    CreateEditResponsePlanComponent.prototype.addToImpactOfCrisisObject = function (bulletPoint, textEntered) {
        if (textEntered) {
            this.impactOfCrisisObject[bulletPoint] = textEntered;
        }
        else {
            if (this.impactOfCrisisObject[bulletPoint]) {
                delete this.impactOfCrisisObject[bulletPoint];
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.addImpactOfCrisisBulletPoint = function () {
        this.impactOfCrisisBulletPointsCounter++;
        this.impactOfCrisisBulletPoints.push(this.impactOfCrisisBulletPointsCounter);
    };
    CreateEditResponsePlanComponent.prototype.removeImpactOfCrisisBulletPoint = function (bulletPoint) {
        this.impactOfCrisisBulletPointsCounter--;
        this.impactOfCrisisBulletPoints = this.impactOfCrisisBulletPoints.filter(function (item) { return item !== bulletPoint; });
        // Removing bullet point from list if exists
        if (this.impactOfCrisisObject[bulletPoint]) {
            delete this.impactOfCrisisObject[bulletPoint];
        }
        else {
            console.log("Bullet point not in list");
        }
    };
    CreateEditResponsePlanComponent.prototype.addToAvailabilityOfFundsObject = function (bulletPoint, textEntered) {
        if (textEntered) {
            this.availabilityOfFundsObject[bulletPoint] = textEntered;
        }
        else {
            if (this.availabilityOfFundsObject[bulletPoint]) {
                delete this.availabilityOfFundsObject[bulletPoint];
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.addAvailabilityOfFundsBulletPoint = function () {
        this.availabilityOfFundsBulletPointsCounter++;
        this.availabilityOfFundsBulletPoints.push(this.availabilityOfFundsBulletPointsCounter);
    };
    CreateEditResponsePlanComponent.prototype.removeAvailabilityOfFundsBulletPoint = function (bulletPoint) {
        this.availabilityOfFundsBulletPointsCounter--;
        this.availabilityOfFundsBulletPoints = this.availabilityOfFundsBulletPoints.filter(function (item) { return item !== bulletPoint; });
        // Removing bullet point from list if exists
        if (this.availabilityOfFundsObject[bulletPoint]) {
            delete this.availabilityOfFundsObject[bulletPoint];
        }
        else {
            console.log("Bullet point not in list");
        }
    };
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection2 = function () {
        var numOfScenarioCrisisPoints = Object.keys(this.scenarioCrisisObject).length;
        var numOfImpactOfCrisisPoints = Object.keys(this.impactOfCrisisObject).length;
        var numOfAvailabilityOfFundsBulletPoints = Object.keys(this.availabilityOfFundsObject).length;
        if ((numOfScenarioCrisisPoints == 0) || (numOfImpactOfCrisisPoints == 0) || (numOfAvailabilityOfFundsBulletPoints == 0)) {
            this.section2Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[1], false);
        }
        else if ((numOfScenarioCrisisPoints != 0) && (numOfImpactOfCrisisPoints != 0) && (numOfAvailabilityOfFundsBulletPoints != 0)) {
            this.section2Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[1], true);
        }
    };
    /**
     * Section 3/10
     */
    CreateEditResponsePlanComponent.prototype.isWaSHSectorSelected = function () {
        this.waSHSectorSelected = !this.waSHSectorSelected;
        this.updateSectorsList(this.waSHSectorSelected, Enums_1.ResponsePlanSectors.wash);
    };
    CreateEditResponsePlanComponent.prototype.isHealthSectorSelected = function () {
        this.healthSectorSelected = !this.healthSectorSelected;
        this.updateSectorsList(this.healthSectorSelected, Enums_1.ResponsePlanSectors.health);
    };
    CreateEditResponsePlanComponent.prototype.isShelterSectorSelected = function () {
        this.shelterSectorSelected = !this.shelterSectorSelected;
        this.updateSectorsList(this.shelterSectorSelected, Enums_1.ResponsePlanSectors.shelter);
    };
    CreateEditResponsePlanComponent.prototype.isNutritionSectorSelected = function () {
        this.nutritionSectorSelected = !this.nutritionSectorSelected;
        this.updateSectorsList(this.nutritionSectorSelected, Enums_1.ResponsePlanSectors.nutrition);
    };
    CreateEditResponsePlanComponent.prototype.isFoodSecAndLivelihoodsSectorSelected = function () {
        this.foodSecAndLivelihoodsSectorSelected = !this.foodSecAndLivelihoodsSectorSelected;
        this.updateSectorsList(this.foodSecAndLivelihoodsSectorSelected, Enums_1.ResponsePlanSectors.foodSecurityAndLivelihoods);
    };
    CreateEditResponsePlanComponent.prototype.isProtectionSectorSelected = function () {
        this.protectionSectorSelected = !this.protectionSectorSelected;
        this.updateSectorsList(this.protectionSectorSelected, Enums_1.ResponsePlanSectors.protection);
    };
    CreateEditResponsePlanComponent.prototype.isEducationSectorSelected = function () {
        this.educationSectorSelected = !this.educationSectorSelected;
        this.updateSectorsList(this.educationSectorSelected, Enums_1.ResponsePlanSectors.education);
    };
    CreateEditResponsePlanComponent.prototype.isCampManagementSectorSelected = function () {
        this.campManagementSectorSelected = !this.campManagementSectorSelected;
        this.updateSectorsList(this.campManagementSectorSelected, Enums_1.ResponsePlanSectors.campManagement);
    };
    CreateEditResponsePlanComponent.prototype.isOtherSectorSelected = function () {
        this.otherSectorSelected = !this.otherSectorSelected;
        this.updateSectorsList(this.otherSectorSelected, Enums_1.ResponsePlanSectors.other);
        if (!this.otherSectorSelected) {
            this.otherRelatedSector = '';
        }
    };
    CreateEditResponsePlanComponent.prototype.currentProgrammesSelected = function () {
        this.presenceInTheCountry = Enums_1.PresenceInTheCountry.currentProgrammes;
    };
    CreateEditResponsePlanComponent.prototype.preExistingPartnerSelected = function () {
        this.presenceInTheCountry = Enums_1.PresenceInTheCountry.preExistingPartner;
    };
    CreateEditResponsePlanComponent.prototype.noPreExistingPartnerSelected = function () {
        this.presenceInTheCountry = Enums_1.PresenceInTheCountry.noPreExistingPresence;
    };
    CreateEditResponsePlanComponent.prototype.methodOfImplementationSelectedDirect = function () {
        this.isDirectlyThroughFieldStaff = true;
    };
    CreateEditResponsePlanComponent.prototype.methodOfImplementationSelectedWithPartners = function () {
        this.isDirectlyThroughFieldStaff = false;
    };
    CreateEditResponsePlanComponent.prototype.addPartnersDropDown = function () {
        this.partnersDropDownsCounter++;
        this.partnersDropDowns.push(this.partnersDropDownsCounter);
    };
    CreateEditResponsePlanComponent.prototype.removePartnersDropDown = function (dropDown) {
        this.partnersDropDownsCounter--;
        this.partnersDropDowns = this.partnersDropDowns.filter(function (item) { return item !== dropDown; });
        delete this.partnerOrganisationsSelected[dropDown];
    };
    CreateEditResponsePlanComponent.prototype.setPartnerOrganisation = function (partnerOrganisationSelected, dropDown) {
        if (partnerOrganisationSelected == 'addNewPartnerOrganisation') {
            this.router.navigate(['/response-plans/add-partner-organisation', { fromResponsePlans: true }]);
        }
        else {
            this.partnerOrganisationsSelected[dropDown] = partnerOrganisationSelected;
        }
    };
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection3 = function () {
        var sectionsSelected = (this.sectorsRelatedTo.length != 0) || (this.otherRelatedSector != '');
        var presenceSelected = this.presenceInTheCountry != null;
        var methodOfImplementationSelected = this.isDirectlyThroughFieldStaff != null;
        if (sectionsSelected && presenceSelected && methodOfImplementationSelected && !this.otherSectorSelected ||
            sectionsSelected && presenceSelected && methodOfImplementationSelected && this.otherSectorSelected && this.otherRelatedSector != "") {
            this.section3Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[2], true);
        }
        else {
            this.section3Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[2], false);
        }
    };
    /**
     * Section 4/10
     */
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection4 = function () {
        if (this.proposedResponseText != '' && this.progressOfActivitiesPlanText != '' && this.coordinationPlanText != '') {
            this.section4Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[3], true);
        }
        else {
            this.section4Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[3], false);
        }
    };
    /**
     * Section 5/10
     */
    CreateEditResponsePlanComponent.prototype.calculateBeneficiaries = function () {
        if (this.numOfPeoplePerHouseHold && this.numOfHouseHolds) {
            this.numOfBeneficiaries = this.numOfPeoplePerHouseHold * this.numOfHouseHolds;
        }
        else {
            this.numOfBeneficiaries = 0;
        }
    };
    CreateEditResponsePlanComponent.prototype.addShowBeneficiariesTextEntry = function () {
        this.showBeneficiariesTextEntry = true;
    };
    CreateEditResponsePlanComponent.prototype.addVulnerableGroupDropDown = function () {
        this.vulnerableGroupsDropDownsCounter++;
        this.vulnerableGroupsDropDowns.push(this.vulnerableGroupsDropDownsCounter);
    };
    CreateEditResponsePlanComponent.prototype.removeVulnerableGroupDropDown = function (vulnerableGroupDropDown) {
        this.vulnerableGroupsDropDownsCounter--;
        this.vulnerableGroupsDropDowns = this.vulnerableGroupsDropDowns.filter(function (item) { return item !== vulnerableGroupDropDown; });
        delete this.selectedVulnerableGroups[vulnerableGroupDropDown];
    };
    CreateEditResponsePlanComponent.prototype.setGroup = function (groupSelected, vulnerableGroupsDropDown) {
        this.selectedVulnerableGroups[vulnerableGroupsDropDown] = groupSelected;
    };
    // updateOtherGroupToGroups() {
    //   if (this.otherGroup != '') {
    //     this.selectedVulnerableGroups['other'] = this.otherGroup;
    //   } else {
    //     delete this.selectedVulnerableGroups['other'];
    //   }
    // }
    CreateEditResponsePlanComponent.prototype.addToTargetPopulationObject = function (bulletPoint, textEntered) {
        if (textEntered) {
            this.targetPopulationInvolvementObject[bulletPoint] = textEntered;
        }
        else {
            if (this.targetPopulationInvolvementObject[bulletPoint]) {
                delete this.targetPopulationInvolvementObject[bulletPoint];
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.addTargetPopulationBulletPoint = function () {
        this.targetPopulationBulletPointsCounter++;
        this.targetPopulationBulletPoints.push(this.targetPopulationBulletPointsCounter);
    };
    CreateEditResponsePlanComponent.prototype.removeTargetPopulationBulletPoint = function (bulletPoint) {
        this.targetPopulationBulletPointsCounter--;
        this.targetPopulationBulletPoints = this.targetPopulationBulletPoints.filter(function (item) { return item !== bulletPoint; });
        // Removing bullet point from list if exists
        if (this.targetPopulationInvolvementObject[bulletPoint]) {
            delete this.targetPopulationInvolvementObject[bulletPoint];
        }
        else {
            console.log("Bullet point not in list");
        }
    };
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection5 = function () {
        var numOfTargetPopulationInvolvementPoints = Object.keys(this.targetPopulationInvolvementObject).length;
        var numOfSelectedVulnerableGroups = Object.keys(this.selectedVulnerableGroups).length;
        if ((this.numOfBeneficiaries == 0) || (numOfTargetPopulationInvolvementPoints == 0) || (numOfSelectedVulnerableGroups == 0 && this.otherGroup == '')) {
            this.section5Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[4], false);
        }
        else if ((this.numOfBeneficiaries != 0) && (numOfTargetPopulationInvolvementPoints != 0) && (numOfSelectedVulnerableGroups != 0 || this.otherGroup != '')) {
            this.section5Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[4], true);
        }
    };
    /**
     * Section 6/10
     */
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection6 = function () {
        if (this.riskManagementPlanText != '') {
            this.section6Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[5], true);
        }
        else {
            this.section6Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[5], false);
        }
    };
    /**
     * Section 7/10
     */
    CreateEditResponsePlanComponent.prototype.saveActivity = function (sector, name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3) {
        if (this.validateInput(name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3)) {
            console.log("valid");
            var beneficiaryList = [];
            for (var i = 0; i < 6; i++) {
                var beneData = {};
                if (i < 3) {
                    beneData["age"] = i;
                    beneData["gender"] = Enums_1.Gender.feMale;
                }
                else {
                    beneData["age"] = i - 3;
                    beneData["gender"] = Enums_1.Gender.male;
                }
                if (i == 0) {
                    beneData["value"] = femaleRange1.value;
                }
                else if (i == 1) {
                    beneData["value"] = femaleRange2.value;
                }
                else if (i == 2) {
                    beneData["value"] = femaleRange3.value;
                }
                else if (i == 3) {
                    beneData["value"] = maleRange1.value;
                }
                else if (i == 4) {
                    beneData["value"] = maleRange2.value;
                }
                else if (i == 5) {
                    beneData["value"] = maleRange3.value;
                }
                beneficiaryList.push(beneData);
            }
            var activity = new plan_activity_model_1.ModelPlanActivity(name.value, output.value, indicator.value, beneficiaryList);
            if (this.activityMap.get(sector)) {
                this.activityMap.get(sector).push(activity);
            }
            else {
                var activityList = [activity];
                this.activityMap.set(sector, activityList);
            }
            this.addActivityToggleMap.set(sector, true);
            name.value = "";
            output.value = "";
            indicator.value = "";
            femaleRange1.value = 0;
            femaleRange2.value = 0;
            femaleRange3.value = 0;
            maleRange1.value = 0;
            maleRange2.value = 0;
            maleRange3.value = 0;
        }
        else {
            console.log("not valid");
        }
    };
    CreateEditResponsePlanComponent.prototype.validateInput = function (name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3) {
        if (name.value == "" || output.value == "" || indicator.value == "" || femaleRange1.value < 0 || femaleRange2.value < 0 || femaleRange3 < 0 || maleRange1.value < 0 || maleRange2.value < 0 || maleRange3 < 0) {
            return false;
        }
        else {
            return true;
        }
    };
    CreateEditResponsePlanComponent.prototype.addActivity = function (sector) {
        var isHidden = this.addActivityToggleMap.get(sector);
        this.addActivityToggleMap.set(sector, !isHidden);
    };
    CreateEditResponsePlanComponent.prototype.selectInternationa = function (sector, value) {
        this.checkActivityInfo(sector, value, 0, -1);
    };
    CreateEditResponsePlanComponent.prototype.selectNeighbour = function (sector, value) {
        this.checkActivityInfo(sector, value, 0, -1);
    };
    CreateEditResponsePlanComponent.prototype.selectLocal = function (sector, value) {
        this.checkActivityInfo(sector, value, 0, -1);
    };
    CreateEditResponsePlanComponent.prototype.getBulletOne = function (sector, value) {
        this.checkActivityInfo(sector, value, 1, 0);
    };
    CreateEditResponsePlanComponent.prototype.getBulletTwo = function (sector, value) {
        this.checkActivityInfo(sector, value, 1, 1);
    };
    //type 0 = sourcePlan, 1 = bulletPoint
    //bulletNo 0 = bullet1, 1 = bullet2
    CreateEditResponsePlanComponent.prototype.checkActivityInfo = function (sector, value, type, bulletNo) {
        var info = this.activityInfoMap.get(sector);
        if (info) {
            if (type == 0) {
                info["sourcePlan"] = value;
            }
            else {
                if (bulletNo == 0) {
                    info["bullet1"] = value;
                }
                else {
                    info["bullet2"] = value;
                }
            }
            this.activityInfoMap.set(sector, info);
        }
        else {
            var data = {};
            if (type == 0) {
                data["sourcePlan"] = value;
            }
            else {
                if (bulletNo == 0) {
                    data["bullet1"] = value;
                }
                else {
                    data["bullet2"] = value;
                }
            }
            this.activityInfoMap.set(sector, data);
        }
    };
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection7 = function () {
        var numOfActivities = this.activityMap.size;
        if (numOfActivities != 0 && this.checkSectorInfo()) {
            this.section7Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[6], true);
        }
        else {
            this.section7Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[6], false);
        }
    };
    /**
     * Section 8/10
     */
    CreateEditResponsePlanComponent.prototype.yesSelectedForVisualDocument = function () {
        this.intentToVisuallyDocument = true;
    };
    CreateEditResponsePlanComponent.prototype.noSelectedForVisualDocument = function () {
        this.intentToVisuallyDocument = false;
    };
    CreateEditResponsePlanComponent.prototype.updateMediaFormat = function (value) {
        this.mediaFormat = value;
    };
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection8 = function () {
        if (this.mALSystemsDescriptionText != '' && this.intentToVisuallyDocument && this.mediaFormat != null ||
            this.mALSystemsDescriptionText != '' && !this.intentToVisuallyDocument) {
            this.section8Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[7], true);
        }
        else {
            this.section8Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[7], false);
        }
    };
    /**
     * Section 9/10
     */
    CreateEditResponsePlanComponent.prototype.continueButtonPressedOnSection9 = function () {
        if (!this.isDoubleCountingDone) {
            this.section9Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[8], true);
        }
        this.isDoubleCountingDone = true;
    };
    CreateEditResponsePlanComponent.prototype.doublerCounting = function () {
        var _this = this;
        //reset count
        if (!(this.forEditing)) {
            this.numberFemaleLessThan18 = 0;
            this.numberFemale18To50 = 0;
            this.numberFemalegreaterThan50 = 0;
            this.numberMaleLessThan18 = 0;
            this.numberMale18To50 = 0;
            this.numberMalegreaterThan50 = 0;
            var modelPlanList_1 = [];
            this.activityMap.forEach(function (v) {
                modelPlanList_1 = modelPlanList_1.concat(v);
            });
            var beneficiaryList_1 = [];
            modelPlanList_1.forEach(function (modelPlan) {
                beneficiaryList_1 = beneficiaryList_1.concat(modelPlan.beneficiary);
            });
            beneficiaryList_1.forEach(function (item) {
                if (item["age"] == Enums_1.AgeRange.Less18 && item["gender"] == Enums_1.Gender.feMale) {
                    _this.numberFemaleLessThan18 += Number(item["value"]);
                }
                else if (item["age"] == Enums_1.AgeRange.Between18To50 && item["gender"] == Enums_1.Gender.feMale) {
                    _this.numberFemale18To50 += Number(item["value"]);
                }
                else if (item["age"] == Enums_1.AgeRange.More50 && item["gender"] == Enums_1.Gender.feMale) {
                    _this.numberFemalegreaterThan50 += Number(item["value"]);
                }
                else if (item["age"] == Enums_1.AgeRange.Less18 && item["gender"] == Enums_1.Gender.male) {
                    _this.numberMaleLessThan18 += Number(item["value"]);
                }
                else if (item["age"] == Enums_1.AgeRange.Between18To50 && item["gender"] == Enums_1.Gender.male) {
                    _this.numberMale18To50 += Number(item["value"]);
                }
                else if (item["age"] == Enums_1.AgeRange.More50 && item["gender"] == Enums_1.Gender.male) {
                    _this.numberMalegreaterThan50 += Number(item["value"]);
                }
            });
        }
        if (!this.isDoubleCountingDone) {
            this.adjustedFemaleLessThan18 = this.numberFemaleLessThan18;
            this.adjustedFemale18To50 = this.numberFemale18To50;
            this.adjustedFemalegreaterThan50 = this.numberFemalegreaterThan50;
            this.adjustedMaleLessThan18 = this.numberMaleLessThan18;
            this.adjustedMale18To50 = this.numberMale18To50;
            this.adjustedMalegreaterThan50 = this.numberMalegreaterThan50;
        }
    };
    /**
     * Section 10/10
     */
    CreateEditResponsePlanComponent.prototype.calculateBudget = function (sector, budget, isSector) {
        var _this = this;
        console.log(sector);
        console.log(budget);
        console.log(isSector);
        if (isSector) {
            if (budget < 0) {
                console.log("Budget can not be under 0!!");
                return;
            }
            console.log(budget);
            this.sectorBudget.set(Number(sector), budget);
            console.log(this.sectorBudget);
            this.totalInputs = 0;
            this.sectorBudget.forEach(function (v) {
                _this.totalInputs += Number(v);
            });
        }
        else {
            if (this.managementSupportPercentage == null) {
                this.totalOfAllCosts = 0;
                this.totalBudget = 0;
            }
            else {
                var totalOfSectionsBToG = this.transportBudget +
                    this.securityBudget +
                    this.logisticsAndOverheadsBudget +
                    this.staffingAndSupportBudget +
                    this.monitoringAndEvolutionBudget +
                    this.capitalItemsBudget;
                this.totalOfAllCosts = ((this.totalInputs + totalOfSectionsBToG) * this.managementSupportPercentage) / 100;
                this.totalBudget = this.totalInputs + totalOfSectionsBToG + this.totalOfAllCosts;
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.recordNarrative = function (sector, narrative) {
        this.sectorNarrative.set(Number(sector), narrative);
    };
    CreateEditResponsePlanComponent.prototype.yesSelectedForCapitalsExist = function () {
        this.capitalsExist = true;
    };
    CreateEditResponsePlanComponent.prototype.noSelectedForCapitalsExist = function () {
        this.capitalsExist = false;
    };
    CreateEditResponsePlanComponent.prototype.addCapitalItemSection = function () {
        this.capitalItemSectionSectionsCounter++;
        this.capitalItemSections.push(this.capitalItemSectionSectionsCounter);
    };
    CreateEditResponsePlanComponent.prototype.removeCapitalItemSection = function (capitalItemSection) {
        this.capitalItemSectionSectionsCounter--;
        this.capitalItemSections = this.capitalItemSections.filter(function (item) { return item !== capitalItemSection; });
        this.budgetOver1000.delete(capitalItemSection);
        this.budgetOver1000Desc.delete(capitalItemSection);
    };
    CreateEditResponsePlanComponent.prototype.budgetOverThousand = function (selection, value) {
        this.budgetOver1000.set(selection, value);
    };
    CreateEditResponsePlanComponent.prototype.budgetOverThousandDesc = function (selection, value) {
        this.budgetOver1000Desc.set(selection, value);
    };
    CreateEditResponsePlanComponent.prototype.checkSection10Status = function () {
        if (this.transportBudget && this.securityBudget && this.logisticsAndOverheadsBudget &&
            this.staffingAndSupportBudget && this.monitoringAndEvolutionBudget &&
            this.capitalItemsBudget && this.managementSupportPercentage && this.checkInputsBudget()) {
            this.section10Status = "GLOBAL.COMPLETE";
            this.sectionsCompleted.set(this.sections[9], true);
        }
        else {
            this.section10Status = "GLOBAL.INCOMPLETE";
            this.sectionsCompleted.set(this.sections[9], false);
        }
    };
    /**
     * Functions
     */
    CreateEditResponsePlanComponent.prototype.checkAllSections = function () {
        this.continueButtonPressedOnSection1();
        this.continueButtonPressedOnSection2();
        this.continueButtonPressedOnSection3();
        this.continueButtonPressedOnSection4();
        this.continueButtonPressedOnSection5();
        this.continueButtonPressedOnSection6();
        this.continueButtonPressedOnSection7();
        this.continueButtonPressedOnSection8();
        // if (this.forEditing) {
        //   this.continueButtonPressedOnSection9();
        // }
        this.checkSection10Status();
    };
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
            this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + this.agencyAdminUid + '/responsePlanSettings/sections')
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (list) {
                _this.totalSections = 0;
                list.forEach(function (item) {
                    _this.responsePlanSettings[item.$key] = item.$value;
                    if (item.$value) {
                        _this.totalSections++;
                    }
                });
            });
        }
    };
    CreateEditResponsePlanComponent.prototype.setupForEdit = function () {
        var _this = this;
        this.route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (params) {
            if (params["id"]) {
                _this.forEditing = true;
                _this.pageTitle = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.EDIT_RESPONSE_PLAN";
                _this.idOfResponsePlanToEdit = params["id"];
                _this.loadResponsePlanInfo(_this.idOfResponsePlanToEdit);
            }
        });
    };
    CreateEditResponsePlanComponent.prototype.loadResponsePlanInfo = function (responsePlanId) {
        var _this = this;
        var responsePlansPath = Constants_1.Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + responsePlanId;
        this.af.database.object(responsePlansPath)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (responsePlan) {
            _this.loadResponsePlan = responsePlan;
            _this.loadSection1(responsePlan);
            _this.loadSection2(responsePlan);
            _this.loadSection3(responsePlan);
            _this.loadSection4(responsePlan);
            _this.loadSection5(responsePlan);
            _this.loadSection6(responsePlan);
            _this.loadSection7(responsePlan);
            _this.loadSection8(responsePlan);
            _this.loadSection9(responsePlan);
            _this.loadSection10(responsePlan);
            _this.checkAllSections();
        });
    };
    CreateEditResponsePlanComponent.prototype.loadSection1 = function (responsePlan) {
        this.planName = responsePlan.name;
        this.geographicalLocation = responsePlan.location;
        this.hazardScenarioSelected = responsePlan.hazardScenario;
        this.staffMemberSelected = responsePlan.planLead;
    };
    CreateEditResponsePlanComponent.prototype.loadSection2 = function (responsePlan) {
        //scenario crisis list
        var scenarioCrisisList = responsePlan.scenarioCrisisList;
        this.loadSection2Back(0, scenarioCrisisList, this.summarizeScenarioBulletPointsCounter, this.summarizeScenarioBulletPoints);
        var impactOfCrisisList = responsePlan.impactOfCrisisList;
        this.loadSection2Back(1, impactOfCrisisList, this.impactOfCrisisBulletPointsCounter, this.impactOfCrisisBulletPoints);
        var availabilityOfFundsList = responsePlan.availabilityOfFundsList;
        this.loadSection2Back(2, availabilityOfFundsList, this.availabilityOfFundsBulletPointsCounter, this.availabilityOfFundsBulletPoints);
    };
    CreateEditResponsePlanComponent.prototype.loadSection2Back = function (type, list, counter, counterList) {
        var _this = this;
        if (list) {
            for (var i = 0; i < list.length; i++) {
                if (i != 0) {
                    counter++;
                    counterList.push(counter);
                }
            }
            counterList.forEach(function (item) {
                if (type == 0) {
                    _this.addToSummarizeScenarioObject(item, list[item - 1]);
                }
                else if (type == 1) {
                    _this.addToImpactOfCrisisObject(item, list[item - 1]);
                }
                else if (type == 2) {
                    _this.addToAvailabilityOfFundsObject(item, list[item - 1]);
                }
            });
        }
    };
    CreateEditResponsePlanComponent.prototype.loadSection3 = function (responsePlan) {
        if (responsePlan.sectors) {
            var sectors = responsePlan.sectors;
            var sectorKeys = Object.keys(sectors);
            this.updateSectorSelections(sectorKeys, responsePlan);
            this.presenceInTheCountry = responsePlan.presenceInTheCountry;
            this.isDirectlyThroughFieldStaff = responsePlan.methodOfImplementation === Enums_1.MethodOfImplementation.fieldStaff ? true : false;
        }
        if (!responsePlan.sectors && responsePlan.sectorsRelatedTo) {
            this.sectorsRelatedTo = responsePlan.sectorsRelatedTo;
            // let sectorKeys = Object.keys(this.sectorsRelatedTo);
            this.updateSectorSelections(this.sectorsRelatedTo, responsePlan);
            this.presenceInTheCountry = responsePlan.presenceInTheCountry;
            this.isDirectlyThroughFieldStaff = responsePlan.methodOfImplementation === Enums_1.MethodOfImplementation.fieldStaff ? true : false;
        }
    };
    CreateEditResponsePlanComponent.prototype.updateSectorSelections = function (sectorKeys, responsePlan) {
        var _this = this;
        sectorKeys.forEach(function (key) {
            if (Number(key) == Enums_1.ResponsePlanSectors.wash) {
                _this.waSHSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.health) {
                _this.healthSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.shelter) {
                _this.shelterSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.nutrition) {
                _this.nutritionSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.foodSecurityAndLivelihoods) {
                _this.foodSecAndLivelihoodsSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.protection) {
                _this.protectionSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.education) {
                _this.educationSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.campManagement) {
                _this.campManagementSectorSelected = true;
            }
            else if (Number(key) == Enums_1.ResponsePlanSectors.other) {
                _this.otherSectorSelected = true;
            }
        });
        if (this.otherSectorSelected) {
            this.otherRelatedSector = responsePlan.otherRelatedSector;
        }
        if (responsePlan.partnerOrganisations) {
            var partnerOrganisations = responsePlan.partnerOrganisations;
            for (var i = 0; i < partnerOrganisations.length; i++) {
                if (i != 0) {
                    this.partnersDropDownsCounter++;
                    this.partnersDropDowns.push(this.partnersDropDownsCounter);
                }
                this.partnerOrganisationsSelected[this.partnersDropDownsCounter] = partnerOrganisations[this.partnersDropDownsCounter - 1];
            }
        }
        else {
            console.log("Response Plan's partner organisations list is null");
        }
    };
    CreateEditResponsePlanComponent.prototype.loadSection4 = function (responsePlan) {
        this.proposedResponseText = responsePlan.activitySummary['q1'];
        this.progressOfActivitiesPlanText = responsePlan.activitySummary['q2'];
        this.coordinationPlanText = responsePlan.activitySummary['q3'];
    };
    CreateEditResponsePlanComponent.prototype.loadSection5 = function (responsePlan) {
        this.numOfPeoplePerHouseHold = responsePlan.peoplePerHousehold;
        this.numOfHouseHolds = responsePlan.numOfHouseholds;
        this.calculateBeneficiaries();
        this.howBeneficiariesCalculatedText = responsePlan.beneficiariesNote;
        this.showBeneficiariesTextEntry = this.howBeneficiariesCalculatedText ? true : false;
        //vulnerable groups
        if (responsePlan.vulnerableGroups) {
            var vulnerableGroups = responsePlan.vulnerableGroups;
            for (var i = 0; i < vulnerableGroups.length; i++) {
                if (i != 0) {
                    this.vulnerableGroupsDropDownsCounter++;
                    this.vulnerableGroupsDropDowns.push(this.vulnerableGroupsDropDownsCounter);
                }
                this.setGroup(this.vulnerableGroupsDropDownsCounter, vulnerableGroups[this.vulnerableGroupsDropDownsCounter - 1]);
            }
        }
        this.otherGroup = responsePlan.otherVulnerableGroup;
        //target population bullets
        if (responsePlan.targetPopulationInvolvementList) {
            var targetPopulationInvolvementList = responsePlan.targetPopulationInvolvementList;
            for (var i = 0; i < targetPopulationInvolvementList.length; i++) {
                if (i != 0) {
                    this.targetPopulationBulletPointsCounter++;
                    this.targetPopulationBulletPoints.push(this.targetPopulationBulletPointsCounter);
                }
                this.addToTargetPopulationObject(this.targetPopulationBulletPointsCounter, targetPopulationInvolvementList[this.targetPopulationBulletPointsCounter - 1]);
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.loadSection6 = function (responsePlan) {
        this.riskManagementPlanText = responsePlan.riskManagementPlan;
    };
    CreateEditResponsePlanComponent.prototype.loadSection7 = function (responsePlan) {
        var _this = this;
        if (responsePlan.sectors) {
            var sectors = responsePlan.sectors;
            Object.keys(sectors).forEach(function (sectorKey) {
                //initial load back
                _this.sectorsRelatedTo.push(Number(sectorKey));
                //activity info load back
                var sectorInfo = _this.activityInfoMap.get(sectorKey);
                if (!sectorInfo) {
                    var infoData = {};
                    infoData["sourcePlan"] = responsePlan.sectors[sectorKey]["sourcePlan"];
                    infoData["bullet1"] = responsePlan.sectors[sectorKey]["bullet1"];
                    infoData["bullet2"] = responsePlan.sectors[sectorKey]["bullet2"];
                    _this.activityInfoMap.set(Number(sectorKey), infoData);
                }
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
                    if (!_this.activityMap.get(Number(sectorKey))) {
                        _this.activityMap.set(Number(sectorKey), moreData);
                        _this.addActivityToggleMap.set(Number(sectorKey), true);
                    }
                });
            });
        }
    };
    CreateEditResponsePlanComponent.prototype.loadSection8 = function (responsePlan) {
        this.mALSystemsDescriptionText = responsePlan.monAccLearning['mALSystemsDescription'];
        this.intentToVisuallyDocument = responsePlan.monAccLearning['isMedia'];
        this.mediaFormat = responsePlan.monAccLearning['mediaFormat'];
    };
    CreateEditResponsePlanComponent.prototype.loadSection9 = function (responsePlan) {
        this.numberFemaleLessThan18 = responsePlan.doubleCounting[0].value;
        this.numberFemale18To50 = responsePlan.doubleCounting[1].value;
        this.numberFemalegreaterThan50 = responsePlan.doubleCounting[2].value;
        this.numberMaleLessThan18 = responsePlan.doubleCounting[3].value;
        this.numberMale18To50 = responsePlan.doubleCounting[4].value;
        this.numberMalegreaterThan50 = responsePlan.doubleCounting[5].value;
        this.section9Status = "GLOBAL.COMPLETE";
        this.sectionsCompleted.set(this.sections[8], true);
    };
    CreateEditResponsePlanComponent.prototype.loadSection10 = function (responsePlan) {
        var _this = this;
        if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][Enums_1.BudgetCategory.Inputs]) {
            console.log("have inputs budget");
            var inputs_1 = responsePlan.budget["item"][Enums_1.BudgetCategory.Inputs];
            console.log(inputs_1);
            Object.keys(inputs_1).map(function (key) { return inputs_1[key]; }).forEach(function (item) {
                _this.totalInputs += item.budget;
            });
            Object.keys(inputs_1).forEach(function (key) {
                _this.sectorBudget.set(Number(key), inputs_1[key]["budget"]);
                _this.sectorNarrative.set(Number(key), inputs_1[key]["narrative"]);
            });
            console.log("$$$$$$$$");
            console.log(this.sectorBudget);
            console.log(this.sectorNarrative);
        }
        this.transportBudget = responsePlan.budget["item"][Enums_1.BudgetCategory.Transport]["budget"];
        this.transportNarrative = responsePlan.budget["item"][Enums_1.BudgetCategory.Transport]["narrative"];
        this.securityBudget = responsePlan.budget["item"][Enums_1.BudgetCategory.Security]["budget"];
        this.securityNarrative = responsePlan.budget["item"][Enums_1.BudgetCategory.Security]["narrative"];
        this.logisticsAndOverheadsBudget = responsePlan.budget["item"][Enums_1.BudgetCategory.Logistics]["budget"];
        this.logisticsAndOverheadsNarrative = responsePlan.budget["item"][Enums_1.BudgetCategory.Logistics]["narrative"];
        this.staffingAndSupportBudget = responsePlan.budget["item"][Enums_1.BudgetCategory.Staffing]["budget"];
        this.staffingAndSupportNarrative = responsePlan.budget["item"][Enums_1.BudgetCategory.Staffing]["narrative"];
        this.monitoringAndEvolutionBudget = responsePlan.budget["item"][Enums_1.BudgetCategory.Monitoring]["budget"];
        this.monitoringAndEvolutionNarrative = responsePlan.budget["item"][Enums_1.BudgetCategory.Monitoring]["narrative"];
        this.capitalItemsBudget = responsePlan.budget["item"][Enums_1.BudgetCategory.CapitalItems]["budget"];
        this.capitalItemsNarrative = responsePlan.budget["item"][Enums_1.BudgetCategory.CapitalItems]["narrative"];
        this.managementSupportPercentage = responsePlan.budget["item"][Enums_1.BudgetCategory.ManagementSupport]["budget"];
        this.managementSupportNarrative = responsePlan.budget["item"][Enums_1.BudgetCategory.ManagementSupport]["narrative"];
        var totalOfSectionsBToG = this.transportBudget + this.securityBudget + this.logisticsAndOverheadsBudget +
            this.staffingAndSupportBudget + this.monitoringAndEvolutionBudget + this.capitalItemsBudget;
        this.totalOfAllCosts = ((this.totalInputs + totalOfSectionsBToG) * this.managementSupportPercentage) / 100;
        this.totalBudget = this.totalInputs + totalOfSectionsBToG + this.totalOfAllCosts;
        this.capitalsExist = responsePlan.budget["itemsOver1000Exists"];
        if (this.capitalsExist) {
            var over1000List = responsePlan.budget["itemsOver1000"];
            if (over1000List.length > 0) {
                for (var i = 0; i < over1000List.length; i++) {
                    var item = new budget_item_model_1.ModelBudgetItem();
                    item.budget = over1000List[i]["budget"];
                    item.narrative = over1000List[i]["narrative"];
                    if (i != 0) {
                        this.capitalItemSectionSectionsCounter++;
                        this.capitalItemSections.push(this.capitalItemSectionSectionsCounter);
                    }
                    this.budgetOver1000.set(this.capitalItemSectionSectionsCounter, item.budget);
                    this.budgetOver1000Desc.set(this.capitalItemSectionSectionsCounter, item.narrative);
                }
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.getStaff = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/staff/' + this.countryId)
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
            .takeUntil(this.ngUnsubscribe)
            .distinctUntilChanged()
            .subscribe(function (x) {
            _this.staffMembers.push(x);
        });
    };
    CreateEditResponsePlanComponent.prototype.getPartners = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminUid + '/' + this.countryId + '/partners')
            .flatMap(function (list) {
            _this.partnerOrganisations = [];
            var tempList = [];
            list.forEach(function (x) {
                tempList.push(x);
            });
            return rxjs_1.Observable.from(tempList);
        })
            .flatMap(function (item) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + '/partner/' + item.$key + '/partnerOrganisationId');
        })
            .flatMap(function (item) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + '/partnerOrganisation/' + item.$value);
        })
            .takeUntil(this.ngUnsubscribe)
            .distinctUntilChanged()
            .subscribe(function (x) {
            _this.partnerOrganisations.push(x);
        });
    };
    CreateEditResponsePlanComponent.prototype.getGroups = function () {
        var _this = this;
        if (this.systemAdminUid) {
            this.af.database.list(Constants_1.Constants.APP_STATUS + "/system/" + this.systemAdminUid + '/groups')
                .map(function (groupList) {
                var groups = [];
                groupList.forEach(function (x) {
                    groups.push(x.$key);
                });
                return groups;
            })
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (x) {
                _this.groups = x;
            });
        }
    };
    CreateEditResponsePlanComponent.prototype.convertTolist = function (object) {
        var keys = Object.keys(object);
        var tempList = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            tempList.push(object[key]);
        }
        return tempList;
    };
    CreateEditResponsePlanComponent.prototype.updateSectorsList = function (sectorSelected, sectorEnum) {
        if (sectorSelected) {
            if (!(this.sectorsRelatedTo.includes(sectorEnum))) {
                this.sectorsRelatedTo.push(sectorEnum);
            }
        }
        else {
            if (this.sectorsRelatedTo.includes(sectorEnum)) {
                var index = this.sectorsRelatedTo.indexOf(sectorEnum, 0);
                if (index > -1) {
                    this.sectorsRelatedTo.splice(index, 1);
                }
            }
        }
    };
    CreateEditResponsePlanComponent.prototype.saveToFirebase = function (newResponsePlan) {
        var _this = this;
        var numOfSectionsCompleted = 0;
        this.sectionsCompleted.forEach(function (v, k) {
            if (v) {
                numOfSectionsCompleted++;
            }
        });
        if (numOfSectionsCompleted > 0) {
            if (this.forEditing) {
                var responsePlansPath = Constants_1.Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.idOfResponsePlanToEdit;
                this.af.database.object(responsePlansPath).update(newResponsePlan).then(function () {
                    console.log("Response plan successfully updated");
                    _this.router.navigateByUrl('response-plans');
                }).catch(function (error) {
                    console.log("Response plan creation unsuccessful with error --> " + error.message);
                });
            }
            else {
                var responsePlansPath = Constants_1.Constants.APP_STATUS + '/responsePlan/' + this.countryId;
                this.af.database.list(responsePlansPath).push(newResponsePlan).then(function () {
                    console.log("Response plan creation successful");
                    _this.router.navigateByUrl('response-plans');
                }).catch(function (error) {
                    console.log("Response plan creation unsuccessful with error --> " + error.message);
                });
            }
        }
        else {
            this.alertMessage = new alert_message_model_1.AlertMessageModel('RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ERROR_NO_COMPLETED_SECTIONS');
        }
    };
    CreateEditResponsePlanComponent.prototype.checkSectorInfo = function () {
        var _this = this;
        if (!this.activityInfoMap) {
            return false;
        }
        Object.keys(this.activityMap).forEach(function (key) {
            if (!_this.activityInfoMap.get(key)) {
                return false;
            }
        });
        return true;
    };
    CreateEditResponsePlanComponent.prototype.checkInputsBudget = function () {
        var _this = this;
        if (!this.sectorBudget) {
            return false;
        }
        Object.keys(this.sectorBudget).forEach(function (key) {
            if (!_this.sectorBudget.get(key)) {
                return false;
            }
        });
        return true;
    };
    CreateEditResponsePlanComponent.prototype.getCompleteSectionNumber = function () {
        var counter = 0;
        this.sectionsCompleted.forEach(function (v) {
            if (v) {
                counter++;
            }
        });
        return counter;
    };
    CreateEditResponsePlanComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return CreateEditResponsePlanComponent;
}());
CreateEditResponsePlanComponent = __decorate([
    core_1.Component({
        selector: 'app-create-edit-response-plan',
        templateUrl: './create-edit-response-plan.component.html',
        styleUrls: ['./create-edit-response-plan.component.css']
    })
], CreateEditResponsePlanComponent);
exports.CreateEditResponsePlanComponent = CreateEditResponsePlanComponent;
