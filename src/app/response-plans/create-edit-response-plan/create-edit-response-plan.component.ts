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
import {ModelPlanActivity} from "../../model/plan-activity.model";

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
  private scenarioCrisisList: {};
  private impactOfCrisisList: string[] = [];
  private availabilityOfFundsList: string[] = [];

  private summarizeScenarioBulletPointsCounter: number = 0;
  private summarizeScenarioBulletPoints: number[] = [this.summarizeScenarioBulletPointsCounter];

  private impactOfCrisisBulletPointsCounter: number = 1;
  private impactOfCrisisBulletPoints: number[] = [this.impactOfCrisisBulletPointsCounter];
  // private impactOfCrisisRemoveOptionInvisible: boolean = true;

  private availabilityOfFundsBulletPointsCounter: number = 1;
  private availabilityOfFundsBulletPoints: number[] = [this.availabilityOfFundsBulletPointsCounter];
  // private availabilityOfFundsRemoveOptionInvisible: boolean = true;

  private section2Status: string = "GLOBAL.INCOMPLETE";

  // Section 3/10
  private sectorsRelatedTo: ResponsePlanSectors[] = [0, 1];
  private otherRelatedSector: string = '';
  private presenceInTheCountry: PresenceInTheCountry = PresenceInTheCountry.currentProgrammes;
  private methodOfImplementation: MethodOfImplementation = MethodOfImplementation.fieldStaff;
  private isDirectlyThroughFieldStaff: boolean = true;
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
  private numOfPeoplePerHouseHold: number = 0;
  private numOfHouseHolds: number = 0;
  private numOfBeneficiaries: number = 0;
  private vulnerableGroupsDropDownsCounter: number = 1;
  private vulnerableGroupsDropDowns: number[] = [this.vulnerableGroupsDropDownsCounter];
  private vulnerableGroups: string[] = [];
  private targetPopulationBulletPointsCounter: number = 1;
  private targetPopulationBulletPoints: number[] = [this.targetPopulationBulletPointsCounter];
  private targetPopulationInvolvementList: string[] = [];

  private section5Status: string = "GLOBAL.INCOMPLETE";

  // Section 6/10
  private riskManagementPlanText: string = '';

  private section6Status: string = "GLOBAL.INCOMPLETE";

  // Section 7/10

  private section7Status: string = "GLOBAL.INCOMPLETE";
  private activityMap = new Map();

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
    //test only
    let benificiaryList = [{"age": 1, "gender": 0, "value": 10}]
    let activity = new ModelPlanActivity("plan", "training", "KPI", benificiaryList);
    let activityList = [activity];
    this.activityMap.set(0, activityList);

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("Admin uid: " + this.uid);

        let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId').subscribe((countryId) => {
          this.countryId = countryId.$value;
          console.log("Country uid: " + this.countryId);

          this.getStaff();

          let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/agencyAdmin').subscribe((agencyAdminIds) => {
            this.agencyAdminUid = agencyAdminIds[0].$key;
            this.getSettings();

            let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorAgency/" + this.agencyAdminUid + '/systemAdmin').subscribe((systemAdminIds) => {
              this.systemAdminUid = systemAdminIds[0].$key;

              console.log(this.agencyAdminUid);
              console.log(this.systemAdminUid);

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
    // newResponsePlan.scenarioCrisisList = this.scenarioCrisisList;
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
    newResponsePlan.targetPopulationInvolvementList = this.targetPopulationInvolvementList;

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

  addToSummarizeScenarioList(bulletPoint, textEntered) {

    this.scenarioCrisisList[bulletPoint] = textEntered;
    console.log("scenarioCrisisList ---- " + this.scenarioCrisisList);
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

    // Removing bullet point from list
    if (this.scenarioCrisisList[bulletPoint]) {

      delete this.scenarioCrisisList[bulletPoint];
      console.log(this.scenarioCrisisList)
    }
  }

  addImpactOfCrisisBulletPoint() {
    this.impactOfCrisisBulletPointsCounter++;
    this.impactOfCrisisBulletPoints.push(this.impactOfCrisisBulletPointsCounter);
  }

  removeImpactOfCrisisBulletPoint(bulletPoint) {
    this.impactOfCrisisBulletPointsCounter--;
    this.impactOfCrisisBulletPoints = this.impactOfCrisisBulletPoints.filter(item => item !== bulletPoint);
  }

  addAvailabilityOfFundsBulletPoint() {
    this.availabilityOfFundsBulletPointsCounter++;
    this.availabilityOfFundsBulletPoints.push(this.availabilityOfFundsBulletPointsCounter);
  }

  removeAvailabilityOfFundsBulletPoint(bulletPoint) {
    this.availabilityOfFundsBulletPointsCounter--;
    this.availabilityOfFundsBulletPoints = this.availabilityOfFundsBulletPoints.filter(item => item !== bulletPoint);
  }

  continueButtonPressedOnSection2() {

    // TODO - Check the status of completion here
  }

  /**
   * Section 3/10
   */

  directMethodOfImplementationSelected() {
    this.isDirectlyThroughFieldStaff = true;
  }

  partnersMethodOfImplementationSelected() {
    this.isDirectlyThroughFieldStaff = false;
  }


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
    this.numOfBeneficiaries = this.numOfPeoplePerHouseHold * this.numOfHouseHolds;
    console.log("Beneficiaries ----" + this.numOfBeneficiaries);
  }

  addTargetPopulationBulletPoint() {
    this.targetPopulationBulletPointsCounter++;
    this.targetPopulationBulletPoints.push(this.targetPopulationBulletPointsCounter);
  }

  removeTargetPopulationBulletPoint(bulletPoint) {
    this.targetPopulationBulletPointsCounter--;
    this.targetPopulationBulletPoints = this.targetPopulationBulletPoints.filter(item => item !== bulletPoint);
  }

  addVulnerableGroupDropDown() {
    this.vulnerableGroupsDropDownsCounter++;
    this.vulnerableGroupsDropDowns.push(this.vulnerableGroupsDropDownsCounter);
  }

  removeVulnerableGroupDropDown(vulnerableGroupDropDown) {
    this.vulnerableGroupsDropDownsCounter--;
    this.vulnerableGroupsDropDowns = this.vulnerableGroupsDropDowns.filter(item => item !== vulnerableGroupDropDown);
  }

  // TODO
  continueButtonPressedOnSection5() {
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
