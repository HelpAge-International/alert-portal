import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";
import {
  HazardScenario, ResponsePlanSectionSettings, ResponsePlanSectors,
  PresenceInTheCountry, MethodOfImplementation, MediaFormat
} from "../../utils/Enums";
import {Observable} from "rxjs";
import {ResponsePlan} from "../../model/responsePlan";

@Component({
  selector: 'app-create-edit-response-plan',
  templateUrl: './create-edit-response-plan.component.html',
  styleUrls: ['./create-edit-response-plan.component.css']
})

export class CreateEditResponsePlanComponent implements OnInit, OnDestroy {

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

  // Section 1/10
  private planName: string = '';
  private geographicalLocation: string = '';
  private staffMembers: FirebaseObjectObservable<any>[] = [];
  private staffMemberSelected: string;
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
  private methodOfImplementation: MethodOfImplementation = MethodOfImplementation.fieldStaff;
  private isDirectlyThroughFieldStaff: boolean;
  private partnersDropDownsCounter: number = 1;
  private partnersDropDowns: number[] = [this.partnersDropDownsCounter];
  private partners: string[] = []; // TODO - Update to list of Partner Organisations

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
  private howBeneficiariesCalculatedText: string;

  private groups: any[] = [];
  private Other: string = "Other";
  private otherGroup: string = '';
  private selectedVulnerableGroups = {};

  private vulnerableGroupsDropDownsCounter: number = 1;
  private vulnerableGroupsDropDowns: number[] = [this.vulnerableGroupsDropDownsCounter];
  private vulnerableGroups: string[] = [];

  private targetPopulationBulletPointsCounter: number = 1;
  private targetPopulationBulletPoints: number[] = [this.targetPopulationBulletPointsCounter];
  private targetPopulationInvolvementObject: {} = {};

  private section5Status: string = "GLOBAL.INCOMPLETE";

  // Section 6/10
  private riskManagementPlanText: string = '';

  private section6Status: string = "GLOBAL.INCOMPLETE";

  // Section 7/10

  private section7Status: string = "GLOBAL.INCOMPLETE";

  // Section 8/10
  private mALSystemsDescriptionText: string = '';
  private intentToVisuallyDocument: boolean = true;
  private mediaFormat: MediaFormat = MediaFormat.photographic;

  private section8Status: string = "GLOBAL.INCOMPLETE";

  // Section 9/10
  private adjustedFemaleLessThan18: number = 0;
  private adjustedFemale18To50: number = 0;
  private adjustedFemalegreaterThan50: number = 0;
  private adjustedMaleLessThan18: number = 0;
  private adjustedMale18To50: number = 0;
  private adjustedMalegreaterThan50: number = 0;

  private section9Status: string = "GLOBAL.INCOMPLETE";

  // Section 10/10
  private totalInputs: number = 0;
  private totalOfAllCosts: number = 0;
  private totalBudget: number = 0;

  private waSHBudget: number = 0;
  private healthBudget: number = 0;
  private shelterBudget: number = 0;
  private campManagementBudget: number = 0;
  private educationBudget: number = 0;
  private protectionBudget: number = 0;
  private foodSecAndLivelihoodsBudget: number = 0;
  private otherBudget: number = 0;

  private waSHNarrative: string = '';
  private healthNarrative: string = '';
  private shelterNarrative: string = '';
  private campManagementNarrative: string = '';
  private educationNarrative: string = '';
  private protectionNarrative: string = '';
  private foodSecAndLivelihoodsNarrative: string = '';
  private otherNarrative: string = '';

  private transportBudget: number = 0;
  private securityBudget: number = 0;
  private logisticsAndOverheadsBudget: number = 0;
  private staffingAndSupportBudget: number = 0;
  private monitoringAndEvolutionBudget: number = 0;
  private capitalItemsBudget: number = 0;
  private managementSupportPercentage: number;

  private transportNarrative: string = '';
  private securityNarrative: string = '';
  private logisticsAndOverheadsNarrative: string = '';
  private staffingAndSupportNarrative: string = '';
  private monitoringAndEvolutionNarrative: string = '';
  private capitalItemsNarrative: string = '';
  private managementSupportNarrative: string = '';

  private capitalsExist: boolean = true;

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

        let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + "/countryId").subscribe((countryId) => {
          this.countryId = countryId.$value;
          this.getStaff();

          let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/agencyAdmin').subscribe((agencyAdminIds) => {
            this.agencyAdminUid = agencyAdminIds[0].$key;
            this.getSettings();

            let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/systemAdmin').subscribe((systemAdminIds) => {
              this.systemAdminUid = systemAdminIds[0].$key;
              this.getGroups();

              console.log(this.systemAdminUid);
              console.log(this.agencyAdminUid);
              console.log(this.countryId);

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

    // TODO - Check if section 10 is completed

    console.log("Finish button pressed");

    let newResponsePlan: ResponsePlan = new ResponsePlan;

    newResponsePlan.planName = this.planName;
    newResponsePlan.geographicalLocation = this.geographicalLocation;
    newResponsePlan.planLead = this.staffMemberSelected;
    newResponsePlan.hazardScenario = this.hazardScenarioSelected;

    // TODO ----
    // newResponsePlan.scenarioCrisisList = this.scenarioCrisisObject;
    // newResponsePlan.impactOfCrisisList = this.impactOfCrisisObject;
    // newResponsePlan.availabilityOfFundsList = this.availabilityOfFundsObject;

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
    // newResponsePlan.targetPopulationInvolvementList = this.targetPopulationInvolvementList;

    newResponsePlan.riskManagementPlan = this.riskManagementPlanText;

    newResponsePlan.mALSystemsDescription = this.mALSystemsDescriptionText;
    newResponsePlan.isMedia = this.intentToVisuallyDocument;
    newResponsePlan.mediaFormat = this.mediaFormat;

    // newResponsePlan.sectionsCompleted = this.
    newResponsePlan.totalSections = this.totalSections;

    newResponsePlan.isActive = true;

    console.log("New Response Plan ----> " + newResponsePlan);

    // TODO - For other users such as ERT and ERT Lead, get the country admin's id which the user is under. This has to be done when other users are implemeneted

    // If logged in as a Country admin
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId;

    this.af.database.list(responsePlansPath).push(newResponsePlan).then(() => {
      console.log("Response plan creation successful");
    }).catch(error => {
      console.log("Response plan creation unsuccessful with error --> " + error.message);
    })

  }

  /**
   * Section 1/10
   */

  filterData() {
    console.log("Hazard Scenario Selected");
  }

  staffSelected() {
    console.log("Staff Member Selected");
    console.log(this.planName);
    console.log(this.geographicalLocation);
    console.log(this.hazardScenarioSelected);
    console.log(this.staffMemberSelected);
  }

  continueButtonPressedOnSection1() {

    if (this.planName != '' && this.geographicalLocation != '' && this.hazardScenarioSelected != null && this.staffMemberSelected != '') {
      this.section1Status = "GLOBAL.COMPLETE";
      this.numberOfCompletedSections++
    } else {
      this.section1Status = "GLOBAL.INCOMPLETE";
      this.numberOfCompletedSections--;
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
    console.log('summarizeScenarioBulletPointsCounter ----' + this.summarizeScenarioBulletPointsCounter);
  }

  removeSummarizeScenarioBulletPoint(bulletPoint) {
    console.log('summarizeScenarioBulletPointsCounter ----' + this.summarizeScenarioBulletPointsCounter + 'bulletPoint ----' + bulletPoint);
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
    console.log(this.impactOfCrisisObject);
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
    console.log(this.availabilityOfFundsObject);
  }

  continueButtonPressedOnSection2() {

    let numOfScenarioCrisisPoints: number = Object.keys(this.scenarioCrisisObject).length;
    let numOfImpactOfCrisisPoints: number = Object.keys(this.impactOfCrisisObject).length;
    let numOfAvailabilityOfFundsBulletPoints: number = Object.keys(this.availabilityOfFundsObject).length;

    if ((numOfScenarioCrisisPoints == 0) || (numOfImpactOfCrisisPoints == 0) || (numOfAvailabilityOfFundsBulletPoints == 0)) {
      this.section2Status = "GLOBAL.INCOMPLETE";
      this.numberOfCompletedSections--;
    } else if ((numOfScenarioCrisisPoints != 0) && (numOfImpactOfCrisisPoints != 0) && (numOfAvailabilityOfFundsBulletPoints!= 0)) {
      this.section2Status = "GLOBAL.COMPLETE";
      this.numberOfCompletedSections++;
    }
    console.log(numOfScenarioCrisisPoints + numOfImpactOfCrisisPoints + numOfAvailabilityOfFundsBulletPoints);
  }

  /**
   * Section 3/10
   */

  // COMPLETED EXCEPT PARTNERS

  isWaSHSectorSelected() {
    this.waSHSectorSelected = !this.waSHSectorSelected;
    console.log('this.waSHSectorSelected = ' + this.waSHSectorSelected);
  }

  isHealthSectorSelected() {
    this.healthSectorSelected = !this.healthSectorSelected;
    console.log('this.healthSectorSelected = ' + this.healthSectorSelected);
  }

  isShelterSectorSelected() {
    this.shelterSectorSelected = !this.shelterSectorSelected;
    console.log('this.shelterSectorSelected = ' + this.shelterSectorSelected);
  }

  isNutritionSectorSelected() {
    this.nutritionSectorSelected = !this.nutritionSectorSelected;
    console.log('this.nutritionSectorSelected = ' + this.nutritionSectorSelected);
  }

  isFoodSecAndLivelihoodsSectorSelected() {
    this.foodSecAndLivelihoodsSectorSelected = !this.foodSecAndLivelihoodsSectorSelected;
    console.log('this.foodSecAndLivelihoodsSectorSelected = ' + this.foodSecAndLivelihoodsSectorSelected);
  }

  isProtectionSectorSelected() {
    this.protectionSectorSelected = !this.protectionSectorSelected;
    console.log('this.protectionSectorSelected = ' + this.protectionSectorSelected);
  }

  isEducationSectorSelected() {
    this.educationSectorSelected = !this.educationSectorSelected;
    console.log('this.educationSectorSelected = ' + this.educationSectorSelected);
  }

  isCampManagementSectorSelected() {
    this.campManagementSectorSelected = !this.campManagementSectorSelected;
    console.log('this.campManagementSectorSelected = ' + this.campManagementSectorSelected);
  }

  isOtherSectorSelected() {
    this.otherSectorSelected = !this.otherSectorSelected;
    console.log('this.otherSectorSelected = ' + this.otherSectorSelected);
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

  methodOfImplementationSelected() {
    this.isDirectlyThroughFieldStaff = !this.isDirectlyThroughFieldStaff;
    console.log('this.isDirectlyThroughFieldStaff = ' + this.isDirectlyThroughFieldStaff);
  }

  // TODO - Partners final functionality
  addPartnersDropDown() {
    this.partnersDropDownsCounter++;
    this.partnersDropDowns.push(this.partnersDropDownsCounter);
  }

  removePartnersDropDown(dropDown) {
    this.partnersDropDownsCounter--;
    this.partnersDropDowns = this.partnersDropDowns.filter(item => item !== dropDown);
  }

  // TODO
  continueButtonPressedOnSection3() {
    // console.log('this.waSHSectorSelected = ' + this.waSHSectorSelected);
    // console.log('this.healthSectorSelected = ' + this.healthSectorSelected);
    // console.log('this.shelterSectorSelected = ' + this.shelterSectorSelected);
    // console.log('this.nutritionSectorSelected = ' + this.nutritionSectorSelected);
    // console.log('this.foodSecAndLivelihoodsSectorSelected = ' + this.foodSecAndLivelihoodsSectorSelected);
    // console.log('this.protectionSectorSelected = ' + this.protectionSectorSelected);
    // console.log('this.educationSectorSelected = ' + this.educationSectorSelected);
    // console.log('this.campManagementSectorSelected = ' + this.campManagementSectorSelected);
    // console.log('this.otherSectorSelected = ' + this.otherSectorSelected);

    console.log('this.presenceInTheCountry = ' + this.presenceInTheCountry);
  }

  /**
   * Section 4/10
   */

  continueButtonPressedOnSection4() {

    if (this.proposedResponseText != '' && this.progressOfActivitiesPlanText != '' && this.coordinationPlanText != '') {
      this.section4Status = "GLOBAL.COMPLETE";
      this.numberOfCompletedSections++;
    } else {
      this.section4Status = "GLOBAL.INCOMPLETE";
      this.numberOfCompletedSections--;
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
    console.log("Beneficiaries ----" + this.numOfBeneficiaries);
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
    console.log(this.targetPopulationInvolvementObject);
  }

  continueButtonPressedOnSection5() {

    let numOfTargetPopulationInvolvementPoints: number = Object.keys(this.targetPopulationInvolvementObject).length;
    let numOfSelectedVulnerableGroups: number = Object.keys(this.selectedVulnerableGroups).length;

    if ((this.numOfBeneficiaries == 0) || (numOfTargetPopulationInvolvementPoints == 0) || (numOfSelectedVulnerableGroups == 0 && this.otherGroup == '')) {
      this.section5Status = "GLOBAL.INCOMPLETE";
      this.numberOfCompletedSections--;
    } else if ((this.numOfBeneficiaries != 0) && (numOfTargetPopulationInvolvementPoints != 0) && (numOfSelectedVulnerableGroups != 0 || this.otherGroup != '')) {
      this.section5Status = "GLOBAL.COMPLETE";
      this.numberOfCompletedSections++;
    }
    console.log(this.otherGroup);
  }

  /**
   * Section 6/10
   */

  continueButtonPressedOnSection6() {

    if (this.riskManagementPlanText != '') {
      this.section6Status = "GLOBAL.COMPLETE";
      this.numberOfCompletedSections++;
    } else {
      this.section6Status = "GLOBAL.INCOMPLETE";
      this.numberOfCompletedSections--;
    }
  }

  /**
   * Section 7/10
   */
  // TODO
  continueButtonPressedOnSection7() {
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

    if (this.mALSystemsDescriptionText != '' && this.mediaFormat != null) {
      this.section8Status = "GLOBAL.COMPLETE";
      this.numberOfCompletedSections++;
    } else {
      this.section8Status = "GLOBAL.INCOMPLETE";
      this.numberOfCompletedSections--;
    }
  }

  /**
   * Section 9/10
   */
  // TODO
  continueButtonPressedOnSection9() {
  }

  /**
   * Section 10/10
   */

  calculateBudget() {

    this.totalInputs =
      this.waSHBudget +
      this.healthBudget +
      this.shelterBudget +
      this.campManagementBudget +
      this.educationBudget +
      this.protectionBudget
      + this.foodSecAndLivelihoodsBudget +
      this.otherBudget;

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
    this.capitalItemSectionSectionsCounter--;
    this.capitalItemSections = this.capitalItemSections.filter(item => item !== capitalItemSection);
  }

  /**
   * Functions
   */

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
          console.log(this.totalSections);
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

  private getGroups() {

    if (this.systemAdminUid) {

      let subscription = this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminUid + '/groups')
        .map(groupList => {
          let groups = [];
          groupList.forEach(x => {
            groups.push(x.$key);
          });
          // groups.push(this.Other);
          return groups;
        })
        .subscribe(x => {
          this.groups = x;
        });
      this.subscriptions.add(subscription);
    }
    console.log(this.groups);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
