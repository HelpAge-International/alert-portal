import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";
import {
  AgeRange,
  ApprovalStatus,
  Gender,
  HazardScenario,
  MethodOfImplementation,
  PresenceInTheCountry,
  ResponsePlanSectionSettings,
  ResponsePlanSectors
} from "../../utils/Enums";
import {Observable} from "rxjs";
import {ResponsePlan} from "../../model/responsePlan";
import {ModelPlanActivity} from "../../model/plan-activity.model";
import {ModelBudgetItem} from "../../model/budget-item.model";

@Component({
  selector: 'app-create-edit-response-plan',
  templateUrl: './create-edit-response-plan.component.html',
  styleUrls: ['./create-edit-response-plan.component.css']
})

export class CreateEditResponsePlanComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';
  SECTORS = Constants.RESPONSE_PLANS_SECTORS;

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;
  private systemAdminUid: string;

  private responsePlanSettings = {};
  private ResponsePlanSectionSettings = ResponsePlanSectionSettings;
  private totalSections: number = 0;
  private numberOfCompletedSections: number = 0;

  private MAX_BULLET_POINTS_VAL_1: number = Constants.MAX_BULLET_POINTS_VAL_1;
  private MAX_BULLET_POINTS_VAL_2: number = Constants.MAX_BULLET_POINTS_VAL_2;

  private sectionsCompleted = new Map<string, boolean>();
  private sections: string[] = ["section1", "section2", "section3", "section4",
    "section5", "section6", "section7", "section8", "section9", "section10"];

  // Section 1/10
  private planName: string = '';
  private geographicalLocation: string = '';
  private staffMembers: FirebaseObjectObservable<any>[] = [];
  private staffMemberSelected: any;
  private hazardScenarioSelected: number;
  private HazardScenario = HazardScenario;
  private hazardScenariosList = [
    HazardScenario.HazardScenario0,
    HazardScenario.HazardScenario1,
    HazardScenario.HazardScenario2,
    HazardScenario.HazardScenario3,
    HazardScenario.HazardScenario4,
    HazardScenario.HazardScenario5,
    HazardScenario.HazardScenario6,
    HazardScenario.HazardScenario7,
    HazardScenario.HazardScenario8,
    HazardScenario.HazardScenario9,
    HazardScenario.HazardScenario10
  ];
  private section1Status: string = "GLOBAL.INCOMPLETE";

  // Section 2/10
  private scenarioCrisisObject: {} = {};
  private impactOfCrisisObject: {} = {};
  private availabilityOfFundsObject: {} = {};

  private summarizeScenarioBulletPointsCounter: number = 1;
  private summarizeScenarioBulletPoints: number[] = [this.summarizeScenarioBulletPointsCounter];

  private impactOfCrisisBulletPointsCounter: number = 1;
  private impactOfCrisisBulletPoints: number[] = [this.impactOfCrisisBulletPointsCounter];
  // private impactOfCrisisRemoveOptionInvisible: boolean = true;

  private availabilityOfFundsBulletPointsCounter: number = 1;
  private availabilityOfFundsBulletPoints: number[] = [this.availabilityOfFundsBulletPointsCounter];
  // private availabilityOfFundsRemoveOptionInvisible: boolean = true;

  private section2Status: string = "GLOBAL.INCOMPLETE";

  // Section 3/10
  private sectorsRelatedTo: ResponsePlanSectors[] = [];
  private otherRelatedSector: string = '';

  private waSHSectorSelected: boolean = false;
  private healthSectorSelected: boolean = false;
  private shelterSectorSelected: boolean = false;
  private nutritionSectorSelected: boolean = false;
  private foodSecAndLivelihoodsSectorSelected: boolean = false;
  private protectionSectorSelected: boolean = false;
  private educationSectorSelected: boolean = false;
  private campManagementSectorSelected: boolean = false;
  private otherSectorSelected: boolean = false;

  private presenceInTheCountry: PresenceInTheCountry;
  private isDirectlyThroughFieldStaff: boolean;

  private partnersDropDownsCounter: number = 1;
  private partnersDropDowns: number[] = [this.partnersDropDownsCounter];
  private partnerOrganisations: FirebaseObjectObservable<any>[] = [];
  private partnerOrganisationsSelected = {};

  private section3Status: string = "GLOBAL.INCOMPLETE";

  // Section 4/10
  private proposedResponseText: string = '';
  private progressOfActivitiesPlanText: string = '';
  private coordinationPlanText: string = '';

  private section4Status: string = "GLOBAL.INCOMPLETE";

  // Section 5/10
  private numOfPeoplePerHouseHold: number;
  private numOfHouseHolds: number;
  private numOfBeneficiaries: number = 0;

  private showBeneficiariesTextEntry: boolean = false;
  private howBeneficiariesCalculatedText: string = '';

  private groups: any[] = [];
  private Other: string = "Other";
  private otherGroup: string = '';
  private selectedVulnerableGroups = {};

  private vulnerableGroupsDropDownsCounter: number = 1;
  private vulnerableGroupsDropDowns: number[] = [this.vulnerableGroupsDropDownsCounter];

  private targetPopulationBulletPointsCounter: number = 1;
  private targetPopulationBulletPoints: number[] = [this.targetPopulationBulletPointsCounter];
  private targetPopulationInvolvementObject: {} = {};

  private section5Status: string = "GLOBAL.INCOMPLETE";

  // Section 6/10
  private riskManagementPlanText: string = '';

  private section6Status: string = "GLOBAL.INCOMPLETE";

  // Section 7/10

  private section7Status: string = "GLOBAL.INCOMPLETE";
  private activityMap = new Map();
  private addActivityToggleMap = new Map();
  private activityInfoMap = new Map();
  private imgNames: string[] = ["water", "health", "shelter", "nutrition", "food", "protection", "education", "camp", "misc"];

  // Section 8/10
  private mALSystemsDescriptionText: string = '';
  private intentToVisuallyDocument: boolean = false;
  private mediaFormat: number;

  private section8Status: string = "GLOBAL.INCOMPLETE";

  // Section 9/10
  private numberFemaleLessThan18: number = 0;
  private numberFemale18To50: number = 0;
  private numberFemalegreaterThan50: number = 0;
  private numberMaleLessThan18: number = 0;
  private numberMale18To50: number = 0;
  private numberMalegreaterThan50: number = 0;

  private adjustedFemaleLessThan18: number = 0;
  private adjustedFemale18To50: number = 0;
  private adjustedFemalegreaterThan50: number = 0;
  private adjustedMaleLessThan18: number = 0;
  private adjustedMale18To50: number = 0;
  private adjustedMalegreaterThan50: number = 0;

  private isDoubleCountingDone: boolean = false;
  private section9Status: string = "GLOBAL.INCOMPLETE";

  // Section 10/10
  private sectorBudget = new Map();
  private sectorNarrative = new Map();
  private budgetOver1000 = new Map();
  private budgetOver1000Desc = new Map();


  private totalInputs: number = 0;
  private totalOfAllCosts: number = 0;
  private totalBudget: number = 0;

  private transportBudget: number;
  private securityBudget: number;
  private logisticsAndOverheadsBudget: number;
  private staffingAndSupportBudget: number;
  private monitoringAndEvolutionBudget: number;
  private capitalItemsBudget: number;
  private managementSupportPercentage: number;

  private transportNarrative: string = '';
  private securityNarrative: string = '';
  private logisticsAndOverheadsNarrative: string = '';
  private staffingAndSupportNarrative: string = '';
  private monitoringAndEvolutionNarrative: string = '';
  private capitalItemsNarrative: string = '';
  private managementSupportNarrative: string = '';

  private capitalsExist: boolean = false;

  private capitalItemSectionSectionsCounter: number = 1;
  private capitalItemSections: number[] = [this.capitalItemSectionSectionsCounter];

  private section10Status: string = "GLOBAL.INCOMPLETE";


  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("Admin uid: " + this.uid);

        let subscription = this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId").subscribe((countryId) => {
          this.countryId = countryId.$value;
          this.getStaff();

          let subscription = this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin').subscribe((agencyAdminIds) => {
            this.agencyAdminUid = agencyAdminIds[0].$key;
            this.getSettings();
            this.getPartners();

            let subscription = this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/systemAdmin').subscribe((systemAdminIds) => {
              this.systemAdminUid = systemAdminIds[0].$key;
              this.getGroups();
            });

            this.subscriptions.add(subscription);
          });
          this.subscriptions.add(subscription);
        });
        this.subscriptions.add(subscription);

      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  /**
   * Finish Button press on section 10
   */
  onSubmit() {
    console.log("Finish button pressed");
    this.checkAllSections();

    let newResponsePlan: ResponsePlan = new ResponsePlan;

    //section 1
    newResponsePlan.name = this.planName;
    newResponsePlan.location = this.geographicalLocation;
    if (this.staffMemberSelected) {
      newResponsePlan.planLead = this.staffMemberSelected.$key;
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
      newResponsePlan.methodOfImplementation = MethodOfImplementation.fieldStaff;
    } else {
      if (Object.keys(this.partnerOrganisationsSelected).length != 0) {
        newResponsePlan.methodOfImplementation = MethodOfImplementation.withPartner;
        newResponsePlan.partnerOrganisations = this.convertTolist(this.partnerOrganisationsSelected);
      } else {
        newResponsePlan.methodOfImplementation = MethodOfImplementation.fieldStaff;
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
    newResponsePlan.beneficiariesNote = this.howBeneficiariesCalculatedText;
    newResponsePlan.vulnerableGroups = this.convertTolist(this.selectedVulnerableGroups);
    newResponsePlan.targetPopulationInvolvementList = this.convertTolist(this.targetPopulationInvolvementObject);

    //section 6
    newResponsePlan.riskManagementPlan = this.riskManagementPlanText;

    //section 7
    this.activityMap.forEach((v, k) => {
      let sectorInfo = {};
      sectorInfo["sourcePlan"] = this.activityInfoMap.get(k)["sourcePlan"];
      sectorInfo["bullet1"] = this.activityInfoMap.get(k)["bullet1"];
      sectorInfo["bullet2"] = this.activityInfoMap.get(k)["bullet2"];
      sectorInfo["activities"] = v;
      newResponsePlan.sectors[k] = sectorInfo;
    });


    //section 8
    newResponsePlan.monAccLearning['mALSystemsDescription'] = this.mALSystemsDescriptionText;
    if (this.mediaFormat != null) {
      if (this.intentToVisuallyDocument) {
        newResponsePlan.monAccLearning['mediaFormat'] = this.mediaFormat;
        newResponsePlan.monAccLearning['isMedia'] = true;
      } else {
        newResponsePlan.monAccLearning['mediaFormat'] = null;
        newResponsePlan.monAccLearning['isMedia'] = true;
      }
    } else {
      this.intentToVisuallyDocument = false;
      newResponsePlan.monAccLearning['isMedia'] = false;
    }

    //section 9
    let doubleCounting = {};

    for (let i = 0; i < 6; i++) {
      let data = {};
      if (i < 3) {
        data["gender"] = Gender.feMale;
        if (i == 0) {
          data["value"] = this.adjustedFemaleLessThan18;
        } else if (i == 1) {
          data["value"] = this.adjustedFemale18To50;
        } else {
          data["value"] = this.adjustedFemalegreaterThan50;
        }
      } else {
        data["gender"] = Gender.male;
        if (i == 3) {
          data["value"] = this.adjustedMaleLessThan18;
        } else if (i == 4) {
          data["value"] = this.adjustedMale18To50;
        } else {
          data["value"] = this.adjustedMalegreaterThan50;
        }
      }
      if (i == 0 || i == 3) {
        data["age"] = AgeRange.Less18;
      } else if (i == 1 || i == 4) {
        data["age"] = AgeRange.Between18To50;
      } else {
        data["age"] = AgeRange.More50;
      }
      doubleCounting[i] = data;
    }
    newResponsePlan.doubleCounting = doubleCounting;

    //section 10
    let budgetData = {};
    let inputs = {};
    this.sectorBudget.forEach((v, k) => {
      let item = new ModelBudgetItem();
      item.budget = this.sectorBudget && this.sectorBudget.get(v) ? this.sectorBudget.get(v) : 0;
      item.narrative = this.sectorNarrative && this.sectorNarrative.get(k) ? this.sectorNarrative.get(k) : "";
      // inputs.push(item);
      inputs[k] = item;
    });
    let allBudgetValues = {};
    allBudgetValues[1] = this.transportBudget;
    allBudgetValues[2] = this.securityBudget;
    allBudgetValues[3] = this.logisticsAndOverheadsBudget;
    allBudgetValues[4] = this.staffingAndSupportBudget;
    allBudgetValues[5] = this.monitoringAndEvolutionBudget;
    allBudgetValues[6] = this.capitalItemsBudget;
    allBudgetValues[7] = this.managementSupportPercentage;

    let allBudgetNarratives = {};
    allBudgetNarratives[1] = this.transportNarrative;
    allBudgetNarratives[2] = this.securityNarrative;
    allBudgetNarratives[3] = this.logisticsAndOverheadsNarrative;
    allBudgetNarratives[4] = this.staffingAndSupportNarrative;
    allBudgetNarratives[5] = this.monitoringAndEvolutionNarrative;
    allBudgetNarratives[6] = this.capitalItemsNarrative;
    allBudgetNarratives[7] = this.managementSupportNarrative;

    for (let i = 0; i < 8; i++) {
      if (i == 0) {
        budgetData[0] = inputs;
      } else {
        let tempItem = new ModelBudgetItem();
        tempItem.budget = allBudgetValues[i];
        tempItem.narrative = allBudgetNarratives[i];
        budgetData[i] = tempItem;
      }
    }
    newResponsePlan.budget["item"] = budgetData;

    if (this.capitalsExist) {
      newResponsePlan.budget["itemsOver1000Exists"] = this.capitalsExist;
      let itemsOver1000 = [];
      this.budgetOver1000.forEach((v, k) => {
        let tempItem = new ModelBudgetItem();
        tempItem.budget = v;
        tempItem.narrative = this.budgetOver1000Desc && this.budgetOver1000Desc.get(k) ? this.budgetOver1000Desc.get(k) : "";
        itemsOver1000.push(tempItem);
      });
      newResponsePlan.budget["itemsOver1000"] = itemsOver1000;
    } else {
      newResponsePlan.budget["itemsOver1000Exists"] = this.capitalsExist;
    }

    newResponsePlan.totalSections = this.totalSections;
    newResponsePlan.isActive = true;
    newResponsePlan.status = ApprovalStatus.InProgress;
    newResponsePlan.sectionsCompleted = this.getCompleteSectionNumber();
    newResponsePlan.startDate = Date.now();

    this.saveToFirebase(newResponsePlan);
  }

  /**
   * Section 1/10
   */

  continueButtonPressedOnSection1() {

    if (this.planName != '' && this.geographicalLocation != '' && this.hazardScenarioSelected != null && this.staffMemberSelected != '') {
      this.section1Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[0], true);
    } else {
      this.section1Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[0], false);
    }
  }

  /**
   * Section 2/10
   */

  addToSummarizeScenarioObject(bulletPoint, textEntered) {
    if (textEntered) {
      this.scenarioCrisisObject[bulletPoint] = textEntered;
    } else {
      if (this.scenarioCrisisObject[bulletPoint]) {
        delete this.scenarioCrisisObject[bulletPoint];
      }
    }
  }

  addSummarizeScenarioBulletPoint() {
    this.summarizeScenarioBulletPointsCounter++;
    this.summarizeScenarioBulletPoints.push(this.summarizeScenarioBulletPointsCounter);
  }

  removeSummarizeScenarioBulletPoint(bulletPoint) {
    this.summarizeScenarioBulletPointsCounter--;
    this.summarizeScenarioBulletPoints = this.summarizeScenarioBulletPoints.filter(item => item !== bulletPoint);

    // Removing bullet point from list if exists
    if (this.scenarioCrisisObject[bulletPoint]) {
      delete this.scenarioCrisisObject[bulletPoint];
    } else {
      console.log("Bullet point not in list");
    }
    console.log(this.scenarioCrisisObject);
  }

  addToImpactOfCrisisObject(bulletPoint, textEntered) {
    if (textEntered) {
      this.impactOfCrisisObject[bulletPoint] = textEntered;
    } else {
      if (this.impactOfCrisisObject[bulletPoint]) {
        delete this.impactOfCrisisObject[bulletPoint];
      }
    }
  }

  addImpactOfCrisisBulletPoint() {
    this.impactOfCrisisBulletPointsCounter++;
    this.impactOfCrisisBulletPoints.push(this.impactOfCrisisBulletPointsCounter);
  }

  removeImpactOfCrisisBulletPoint(bulletPoint) {
    this.impactOfCrisisBulletPointsCounter--;
    this.impactOfCrisisBulletPoints = this.impactOfCrisisBulletPoints.filter(item => item !== bulletPoint);

    // Removing bullet point from list if exists
    if (this.impactOfCrisisObject[bulletPoint]) {
      delete this.impactOfCrisisObject[bulletPoint];
    } else {
      console.log("Bullet point not in list");
    }
  }

  addToAvailabilityOfFundsObject(bulletPoint, textEntered) {
    if (textEntered) {
      this.availabilityOfFundsObject[bulletPoint] = textEntered;
    } else {
      if (this.availabilityOfFundsObject[bulletPoint]) {
        delete this.availabilityOfFundsObject[bulletPoint];
      }
    }
  }

  addAvailabilityOfFundsBulletPoint() {
    this.availabilityOfFundsBulletPointsCounter++;
    this.availabilityOfFundsBulletPoints.push(this.availabilityOfFundsBulletPointsCounter);
  }

  removeAvailabilityOfFundsBulletPoint(bulletPoint) {
    this.availabilityOfFundsBulletPointsCounter--;
    this.availabilityOfFundsBulletPoints = this.availabilityOfFundsBulletPoints.filter(item => item !== bulletPoint);

    // Removing bullet point from list if exists
    if (this.availabilityOfFundsObject[bulletPoint]) {
      delete this.availabilityOfFundsObject[bulletPoint];
    } else {
      console.log("Bullet point not in list");
    }
  }

  continueButtonPressedOnSection2() {

    let numOfScenarioCrisisPoints: number = Object.keys(this.scenarioCrisisObject).length;
    let numOfImpactOfCrisisPoints: number = Object.keys(this.impactOfCrisisObject).length;
    let numOfAvailabilityOfFundsBulletPoints: number = Object.keys(this.availabilityOfFundsObject).length;

    if ((numOfScenarioCrisisPoints == 0) || (numOfImpactOfCrisisPoints == 0) || (numOfAvailabilityOfFundsBulletPoints == 0)) {
      this.section2Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[1], false);
    } else if ((numOfScenarioCrisisPoints != 0) && (numOfImpactOfCrisisPoints != 0) && (numOfAvailabilityOfFundsBulletPoints != 0)) {
      this.section2Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[1], true);
    }
  }

  /**
   * Section 3/10
   */

  // TODO - Wait for Lucian to complete Add Partener Organisations in Country Admin

  isWaSHSectorSelected() {
    this.waSHSectorSelected = !this.waSHSectorSelected;
    this.updateSectorsList(this.waSHSectorSelected, ResponsePlanSectors.wash);
  }

  isHealthSectorSelected() {
    this.healthSectorSelected = !this.healthSectorSelected;
    this.updateSectorsList(this.healthSectorSelected, ResponsePlanSectors.health);
  }

  isShelterSectorSelected() {
    this.shelterSectorSelected = !this.shelterSectorSelected;
    this.updateSectorsList(this.shelterSectorSelected, ResponsePlanSectors.shelter);
  }

  isNutritionSectorSelected() {
    this.nutritionSectorSelected = !this.nutritionSectorSelected;
    this.updateSectorsList(this.nutritionSectorSelected, ResponsePlanSectors.nurtrition);
  }

  isFoodSecAndLivelihoodsSectorSelected() {
    this.foodSecAndLivelihoodsSectorSelected = !this.foodSecAndLivelihoodsSectorSelected;
    this.updateSectorsList(this.foodSecAndLivelihoodsSectorSelected, ResponsePlanSectors.foodSecurityAndLivelihoods);
  }

  isProtectionSectorSelected() {
    this.protectionSectorSelected = !this.protectionSectorSelected;
    this.updateSectorsList(this.protectionSectorSelected, ResponsePlanSectors.protection);
  }

  isEducationSectorSelected() {
    this.educationSectorSelected = !this.educationSectorSelected;
    this.updateSectorsList(this.educationSectorSelected, ResponsePlanSectors.education);
  }

  isCampManagementSectorSelected() {
    this.campManagementSectorSelected = !this.campManagementSectorSelected;
    this.updateSectorsList(this.campManagementSectorSelected, ResponsePlanSectors.campManagement);
  }

  isOtherSectorSelected() {
    this.otherSectorSelected = !this.otherSectorSelected;
    this.updateSectorsList(this.otherSectorSelected, ResponsePlanSectors.other);
    if (!this.otherSectorSelected) {
      this.otherRelatedSector = '';
    }
  }

  currentProgrammesSelected() {
    this.presenceInTheCountry = PresenceInTheCountry.currentProgrammes;
  }

  preExistingPartnerSelected() {
    this.presenceInTheCountry = PresenceInTheCountry.preExistingPartner;
  }

  noPreExistingPartnerSelected() {
    this.presenceInTheCountry = PresenceInTheCountry.noPreExistingPresence;
  }

  methodOfImplementationSelectedDirect() {
    this.isDirectlyThroughFieldStaff = true;
  }

  methodOfImplementationSelectedWithPartners() {
    this.isDirectlyThroughFieldStaff = false;
  }

  addPartnersDropDown() {
    this.partnersDropDownsCounter++;
    this.partnersDropDowns.push(this.partnersDropDownsCounter);
  }

  removePartnersDropDown(dropDown) {
    this.partnersDropDownsCounter--;
    this.partnersDropDowns = this.partnersDropDowns.filter(item => item !== dropDown);
    delete this.partnerOrganisationsSelected[dropDown];
    console.log(this.partnerOrganisationsSelected);
  }

  setPartnerOrganisation(partnerOrganisationSelected, dropDown) {
    console.log(partnerOrganisationSelected);
    if (partnerOrganisationSelected == 'addNewPartnerOrganisation') {
      this.router.navigateByUrl('response-plans/add-partner-organisation');
    } else {
      this.partnerOrganisationsSelected[dropDown] = partnerOrganisationSelected;
    }
  }

  continueButtonPressedOnSection3() {
    let sectionsSelected: boolean = (this.sectorsRelatedTo.length != 0) || (this.otherRelatedSector != '');
    let presenceSelected: boolean = this.presenceInTheCountry != null;
    let methodOfImplementationSelected: boolean = this.isDirectlyThroughFieldStaff != null;

    if (sectionsSelected && presenceSelected && methodOfImplementationSelected && !this.otherSectorSelected ||
      sectionsSelected && presenceSelected && methodOfImplementationSelected && this.otherSectorSelected && this.otherRelatedSector != "") {
      this.section3Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[2], true);
    } else {
      this.section3Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[2], false);
    }
  }

  /**
   * Section 4/10
   */

  continueButtonPressedOnSection4() {

    if (this.proposedResponseText != '' && this.progressOfActivitiesPlanText != '' && this.coordinationPlanText != '') {
      this.section4Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[3], true);
    } else {
      this.section4Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[3], false);
    }
  }

  /**
   * Section 5/10
   */

  calculateBeneficiaries() {
    if (this.numOfPeoplePerHouseHold && this.numOfHouseHolds) {
      this.numOfBeneficiaries = this.numOfPeoplePerHouseHold * this.numOfHouseHolds;
    } else {
      this.numOfBeneficiaries = 0;
    }
  }

  addShowBeneficiariesTextEntry() {
    this.showBeneficiariesTextEntry = true;
  }

  addVulnerableGroupDropDown() {
    this.vulnerableGroupsDropDownsCounter++;
    this.vulnerableGroupsDropDowns.push(this.vulnerableGroupsDropDownsCounter);
  }

  removeVulnerableGroupDropDown(vulnerableGroupDropDown) {
    this.vulnerableGroupsDropDownsCounter--;
    this.vulnerableGroupsDropDowns = this.vulnerableGroupsDropDowns.filter(item => item !== vulnerableGroupDropDown);
    delete this.selectedVulnerableGroups[vulnerableGroupDropDown];
  }

  setGroup(groupSelected, vulnerableGroupsDropDown) {
    this.selectedVulnerableGroups[vulnerableGroupsDropDown] = groupSelected;
  }

  updateOtherGroupToGroups() {
    if (this.otherGroup != '') {
      this.selectedVulnerableGroups['other'] = this.otherGroup;
    } else {
      delete this.selectedVulnerableGroups['other'];
    }
  }

  addToTargetPopulationObject(bulletPoint, textEntered) {
    if (textEntered) {
      this.targetPopulationInvolvementObject[bulletPoint] = textEntered;
    } else {
      if (this.targetPopulationInvolvementObject[bulletPoint]) {
        delete this.targetPopulationInvolvementObject[bulletPoint];
      }
    }
  }

  addTargetPopulationBulletPoint() {
    this.targetPopulationBulletPointsCounter++;
    this.targetPopulationBulletPoints.push(this.targetPopulationBulletPointsCounter);
  }

  removeTargetPopulationBulletPoint(bulletPoint) {
    this.targetPopulationBulletPointsCounter--;
    this.targetPopulationBulletPoints = this.targetPopulationBulletPoints.filter(item => item !== bulletPoint);

    // Removing bullet point from list if exists
    if (this.targetPopulationInvolvementObject[bulletPoint]) {
      delete this.targetPopulationInvolvementObject[bulletPoint];
    } else {
      console.log("Bullet point not in list");
    }
  }

  continueButtonPressedOnSection5() {

    let numOfTargetPopulationInvolvementPoints: number = Object.keys(this.targetPopulationInvolvementObject).length;
    let numOfSelectedVulnerableGroups: number = Object.keys(this.selectedVulnerableGroups).length;

    if ((this.numOfBeneficiaries == 0) || (numOfTargetPopulationInvolvementPoints == 0) || (numOfSelectedVulnerableGroups == 0 && this.otherGroup == '')) {
      this.section5Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[4], false);
    } else if ((this.numOfBeneficiaries != 0) && (numOfTargetPopulationInvolvementPoints != 0) && (numOfSelectedVulnerableGroups != 0 || this.otherGroup != '')) {
      this.section5Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[4], true);
    }
  }

  /**
   * Section 6/10
   */

  continueButtonPressedOnSection6() {

    if (this.riskManagementPlanText != '') {
      this.section6Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[5], true);
    } else {
      this.section6Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[5], false);
    }
  }

  /**
   * Section 7/10
   */
  saveActivity(sector, name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3) {
    console.log(sector);
    console.log(name.value + "/" + output.value + "/" + indicator.value + "/" +
      femaleRange1.value + "/" + femaleRange2.value + "/" + femaleRange3.value + "/" +
      maleRange1.value + "/" + maleRange2.value + "/" + maleRange3.value);
    if (this.validateInput(name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3)) {
      console.log("valid");
      let beneficiaryList = [];
      for (let i = 0; i < 6; i++) {
        let beneData = {};
        if (i < 3) {
          beneData["age"] = i;
          beneData["gender"] = Gender.feMale;
        } else {
          beneData["age"] = i - 3;
          beneData["gender"] = Gender.male;
        }
        if (i == 0) {
          beneData["value"] = femaleRange1.value;
        } else if (i == 1) {
          beneData["value"] = femaleRange2.value;
        } else if (i == 2) {
          beneData["value"] = femaleRange3.value;
        } else if (i == 3) {
          beneData["value"] = maleRange1.value;
        } else if (i == 4) {
          beneData["value"] = maleRange2.value;
        } else if (i == 5) {
          beneData["value"] = maleRange3.value;
        }
        beneficiaryList.push(beneData);
      }
      let activity = new ModelPlanActivity(name.value, output.value, indicator.value, beneficiaryList);
      if (this.activityMap.get(sector)) {
        this.activityMap.get(sector).push(activity);
      } else {
        let activityList = [activity];
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
    } else {
      console.log("not valid");
    }
  }

  private validateInput(name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3) {
    if (name.value == "" || output.value == "" || indicator.value == "" || femaleRange1.value < 0 || femaleRange2.value < 0 || femaleRange3 < 0 || maleRange1.value < 0 || maleRange2.value < 0 || maleRange3 < 0) {
      return false;
    } else {
      return true;
    }
  }

  addActivity(sector) {
    let isHidden = this.addActivityToggleMap.get(sector);
    this.addActivityToggleMap.set(sector, !isHidden);
  }

  selectInternationa(sector, value) {
    console.log(sector + "/" + value);
    this.checkActivityInfo(sector, value, 0, -1);
  }

  selectNeighbour(sector, value) {
    console.log(sector + "/" + value);
    this.checkActivityInfo(sector, value, 0, -1);
  }

  selectLocal(sector, value) {
    console.log(sector + "/" + value);
    this.checkActivityInfo(sector, value, 0, -1);
  }

  getBulletOne(sector, value) {
    console.log("1: " + sector + "/" + value);
    this.checkActivityInfo(sector, value, 1, 0);
    console.log(this.activityInfoMap);
  }

  getBulletTwo(sector, value) {
    console.log("2: " + sector + "/" + value);
    this.checkActivityInfo(sector, value, 1, 1);
    console.log(this.activityInfoMap);
  }

  //type 0 = sourcePlan, 1 = bulletPoint
  //bulletNo 0 = bullet1, 1 = bullet2
  private checkActivityInfo(sector, value, type, bulletNo) {
    let info = this.activityInfoMap.get(sector);
    if (info) {
      if (type == 0) {
        info["sourcePlan"] = value;
      } else {
        if (bulletNo == 0) {
          info["bullet1"] = value;
        } else {
          info["bullet2"] = value;
        }
      }
      this.activityInfoMap.set(sector, info);
    } else {
      let data = {};
      if (type == 0) {
        data["sourcePlan"] = value;
      } else {
        if (bulletNo == 0) {
          data["bullet1"] = value;
        } else {
          data["bullet2"] = value;
        }
      }
      this.activityInfoMap.set(sector, data);
    }
    console.log(this.activityInfoMap);
  }

  continueButtonPressedOnSection7() {
    let numOfActivities: number = this.activityMap.size;
    if (numOfActivities != 0 && this.checkSectorInfo()) {
      this.section7Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[6], true);
    } else {
      this.section7Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[6], false);
    }
  }

  /**
   * Section 8/10
   */

  yesSelectedForVisualDocument() {
    this.intentToVisuallyDocument = true;
  }

  noSelectedForVisualDocument() {
    this.intentToVisuallyDocument = false;
  }

  continueButtonPressedOnSection8() {

    if (this.mALSystemsDescriptionText != '' && this.intentToVisuallyDocument && this.mediaFormat != null ||
      this.mALSystemsDescriptionText != '' && !this.intentToVisuallyDocument) {
      this.section8Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[7], true);
    } else {
      this.section8Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[7], false);
    }
  }

  /**
   * Section 9/10
   */
  continueButtonPressedOnSection9() {
    if (!this.isDoubleCountingDone) {
      this.section9Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[8], true);
    }
    this.isDoubleCountingDone = true;
  }

  doublerCounting() {
    console.log("double counting");
    //reset count
    this.numberFemaleLessThan18 = 0;
    this.numberFemale18To50 = 0;
    this.numberFemalegreaterThan50 = 0;
    this.numberMaleLessThan18 = 0;
    this.numberMale18To50 = 0;
    this.numberMalegreaterThan50 = 0;

    let modelPlanList: ModelPlanActivity [] = [];
    this.activityMap.forEach((v,) => {
      modelPlanList = modelPlanList.concat(v);
    });
    let beneficiaryList = [];
    modelPlanList.forEach(modelPlan => {
      beneficiaryList = beneficiaryList.concat(modelPlan.beneficiary);
    });
    beneficiaryList.forEach(item => {
      if (item["age"] == AgeRange.Less18 && item["gender"] == Gender.feMale) {
        this.numberFemaleLessThan18 += Number(item["value"]);
      } else if (item["age"] == AgeRange.Between18To50 && item["gender"] == Gender.feMale) {
        this.numberFemale18To50 += Number(item["value"]);
      } else if (item["age"] == AgeRange.More50 && item["gender"] == Gender.feMale) {
        this.numberFemalegreaterThan50 += Number(item["value"]);
      } else if (item["age"] == AgeRange.Less18 && item["gender"] == Gender.male) {
        this.numberMaleLessThan18 += Number(item["value"]);
      } else if (item["age"] == AgeRange.Between18To50 && item["gender"] == Gender.male) {
        this.numberMale18To50 += Number(item["value"]);
      } else if (item["age"] == AgeRange.More50 && item["gender"] == Gender.male) {
        this.numberMalegreaterThan50 += Number(item["value"]);
      }
    });

    if (!this.isDoubleCountingDone) {
      this.adjustedFemaleLessThan18 = this.numberFemaleLessThan18;
      this.adjustedFemale18To50 = this.numberFemale18To50;
      this.adjustedFemalegreaterThan50 = this.numberFemalegreaterThan50;
      this.adjustedMaleLessThan18 = this.numberMaleLessThan18;
      this.adjustedMale18To50 = this.numberMale18To50;
      this.adjustedMalegreaterThan50 = this.numberMalegreaterThan50;
    }
  }

  /**
   * Section 10/10
   */

  calculateBudget(sector, budget, isSector) {
    if (isSector) {
      if (budget < 0) {
        console.log("Budget can not be under 0!!");
        return;
      }
      console.log(budget);
      this.sectorBudget.set(sector, budget);
      this.totalInputs = 0;
      this.sectorBudget.forEach((v,) => {
        this.totalInputs += Number(v);
      });
    } else {
      if (this.managementSupportPercentage == null) {
        this.totalOfAllCosts = 0;
        this.totalBudget = 0;
      } else {

        let totalOfSectionsBToG: number =
          this.transportBudget +
          this.securityBudget +
          this.logisticsAndOverheadsBudget +
          this.staffingAndSupportBudget +
          this.monitoringAndEvolutionBudget +
          this.capitalItemsBudget;

        this.totalOfAllCosts = ((this.totalInputs + totalOfSectionsBToG) * this.managementSupportPercentage) / 100;
        this.totalBudget = this.totalInputs + totalOfSectionsBToG + this.totalOfAllCosts;
      }
    }
  }

  recordNarrative(sector, narrative) {
    console.log(narrative);
    this.sectorNarrative.set(sector, narrative);
  }

  yesSelectedForCapitalsExist() {
    this.capitalsExist = true;
  }

  noSelectedForCapitalsExist() {
    this.capitalsExist = false;
  }

  addCapitalItemSection() {
    this.capitalItemSectionSectionsCounter++;
    this.capitalItemSections.push(this.capitalItemSectionSectionsCounter);
  }

  removeCapitalItemSection(capitalItemSection) {
    console.log(capitalItemSection);
    this.capitalItemSectionSectionsCounter--;
    this.capitalItemSections = this.capitalItemSections.filter(item => item !== capitalItemSection);
    this.budgetOver1000.delete(capitalItemSection);
    this.budgetOver1000Desc.delete(capitalItemSection);
  }

  budgetOverThousand(selection, value) {
    console.log(selection);
    console.log(value);
    this.budgetOver1000.set(selection, value);
  }

  budgetOverThousandDesc(selection, value) {
    console.log(selection);
    console.log(value);
    this.budgetOver1000Desc.set(selection, value);
  }

  checkSection10Status() {
    if (this.transportBudget && this.securityBudget && this.logisticsAndOverheadsBudget &&
      this.staffingAndSupportBudget && this.monitoringAndEvolutionBudget &&
      this.capitalItemsBudget && this.managementSupportPercentage && this.checkInputsBudget()) {
      this.section10Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[9], true);
    } else {
      this.section10Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[9], false);
    }
    console.log(this.getCompleteSectionNumber());
  }

  /**
   * Functions
   */

  checkAllSections() {
    this.continueButtonPressedOnSection1();
    this.continueButtonPressedOnSection2();
    this.continueButtonPressedOnSection3();
    this.continueButtonPressedOnSection4();
    this.continueButtonPressedOnSection5();
    this.continueButtonPressedOnSection6();
    this.continueButtonPressedOnSection7();
    this.continueButtonPressedOnSection8();
    this.checkSection10Status();
  }

  goBack() {
    this.router.navigateByUrl('response-plans');
  }

  /**
   * Private functions
   */

  private getSettings() {

    if (this.agencyAdminUid) {
      this.responsePlanSettings = {};
      let subscription = this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyAdminUid + '/responsePlanSettings/sections')
        .subscribe(list => {
          this.totalSections = 0;
          list.forEach(item => {
            this.responsePlanSettings[item.$key] = item.$value;
            if (item.$value) {
              this.totalSections++;
            }
          });
        });
      this.subscriptions.add(subscription);
    }
    console.log(this.responsePlanSettings);
  }

  private getStaff() {

    let subscription = this.af.database.list(Constants.APP_STATUS + '/staff/' + this.countryId)
      .flatMap(list => {
        this.staffMembers = [];
        let tempList = [];
        list.forEach(x => {
          tempList.push(x)
        });
        return Observable.from(tempList)
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + item.$key)
      })
      .distinctUntilChanged()
      .subscribe(x => {
        this.staffMembers.push(x);
      });
    this.subscriptions.add(subscription);
  }

  private getPartners() {

    let subscription = this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminUid + '/' + this.countryId + '/partners')
      .flatMap(list => {
        this.partnerOrganisations = [];
        let tempList = [];
        list.forEach(x => {
          tempList.push(x);
        });
        return Observable.from(tempList)
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + '/partner/' + item.$key + '/partnerOrganisationId')
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation/' + item.$value)
      })
      .distinctUntilChanged()
      .subscribe(x => {
        this.partnerOrganisations.push(x);
        console.log(x.organisationName);
      });
    this.subscriptions.add(subscription);
  }

  private getGroups() {

    if (this.systemAdminUid) {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminUid + '/groups')
        .map(groupList => {
          let groups = [];
          groupList.forEach(x => {
            groups.push(x.$key);
          });
          return groups;
        })
        .subscribe(x => {
          this.groups = x;
        });
      this.subscriptions.add(subscription);
    }
  }

  private convertTolist(object) {

    let keys = Object.keys(object);
    let tempList = [];
    for (let key of keys) {
      tempList.push(object[key]);
    }
    return tempList;
  }

  private updateSectorsList(sectorSelected, sectorEnum) {

    if (sectorSelected) {
      if (!(this.sectorsRelatedTo.includes(sectorEnum))) {
        this.sectorsRelatedTo.push(sectorEnum);
      }
    } else {
      if (this.sectorsRelatedTo.includes(sectorEnum)) {
        let index: number = this.sectorsRelatedTo.indexOf(sectorEnum, 0);
        if (index > -1) {
          this.sectorsRelatedTo.splice(index, 1)
        }
      }
    }
  }

  private saveToFirebase(newResponsePlan: ResponsePlan) {

    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId;
    this.af.database.list(responsePlansPath).push(newResponsePlan).then(() => {
      console.log("Response plan creation successful");
      console.log(newResponsePlan);
    }).catch(error => {
      console.log("Response plan creation unsuccessful with error --> " + error.message);
    });
  }

  private checkSectorInfo() {
    if (!this.activityInfoMap) {
      return false;
    }
    Object.keys(this.activityMap).forEach(key => {
      if (!this.activityInfoMap.get(key)) {
        return false;
      }
    });
    return true;
  }

  private checkInputsBudget() {
    if (!this.sectorBudget) {
      return false;
    }
    Object.keys(this.sectorBudget).forEach(key => {
      if (!this.sectorBudget.get(key)) {
        return false;
      }
    });
    return true;
  }

  private getCompleteSectionNumber() {
    let counter = 0;
    this.sectionsCompleted.forEach((v,) => {
      if (v) {
        counter++;
      }
    });
    return counter;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}