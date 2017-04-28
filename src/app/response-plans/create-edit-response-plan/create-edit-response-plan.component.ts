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
  private agencyAdminUid: string;
  private systemAdminUid: string;

  private responsePlanSettings = {};
  private ResponsePlanSectionSettings = ResponsePlanSectionSettings;
  private totalSections: number = 0;

  // Section 1/10
  private planName: string = '';
  private geographicalLocation: string = '';
  private staffMembers: FirebaseObjectObservable<any>[] = [];
  private staffMemberSelected: string = '';
  private hazardScenarioSelected: number = 0;
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

  // Section 2/10
  private scenarioCrisisList: string[] = [];
  private impactOfCrisisList: string[] = [];
  private availabilityOfFundsList: string[] = [];

  private MAX_BULLET_POINTS_VAL_1: number = 3;
  private MAX_BULLET_POINTS_VAL_2: number = 5;

  private summarizeScenarioBulletPointsCounter: number = 1;
  private summarizeScenarioBulletPoints: number[] = [this.summarizeScenarioBulletPointsCounter];
  private summarizeScenarioRemoveOptionInvisible: boolean = true;

  private impactOfCrisisBulletPointsCounter: number = 1;
  private impactOfCrisisBulletPoints: number[] = [this.impactOfCrisisBulletPointsCounter];
  private impactOfCrisisRemoveOptionInvisible: boolean = true;

  private availabilityOfFundsBulletPointsCounter: number = 1;
  private availabilityOfFundsBulletPoints: number[] = [this.availabilityOfFundsBulletPointsCounter];
  private availabilityOfFundsRemoveOptionInvisible: boolean = true;

  // Section 3/10
  private sectorsRelatedTo: ResponsePlanSectors[] = [];
  private otherRelatedSector: string = '';
  private presenceInTheCountry: PresenceInTheCountry = PresenceInTheCountry.currentProgrammes;
  private methodOfImplementation: MethodOfImplementation = MethodOfImplementation.fieldStaff;
  private isDirectlyThroughFieldStaff: boolean = true;
  private partners: string[] = []; // TODO - Update to list of Partner Organisations

  // Section 4/10
  private proposedResponseText: string = '';
  private progressOfActivitiesPlanText: string = '';
  private coordinationPlanText: string = '';

  // Section 5/10
  private numOfPeoplePerHouseHold: number = 0;
  private numOfHouseHolds: number = 0;
  private numOfBeneficiaries: number = 0;
  private vulnerableGroups: string[] = [];
  private targetPopulationInvolmentList: string[] = [];

  // Section 6/10
  private riskManagementPlanText: string = '';

  // Section 7/10

  // Section 8/10
  private mALSystemsDescriptionText: string = '';
  private intentToVisuallyDocument: boolean = true;
  private mediaFormat: MediaFormat = MediaFormat.photographic;

  // Section 9/10
  private adjustedFemaleLessThan18: number = 0;
  private adjustedFemale18To50: number = 0;
  private adjustedFemalegreaterThan50: number = 0;
  private adjustedMaleLessThan18: number = 0;
  private adjustedMale18To50: number = 0;
  private adjustedMalegreaterThan50: number = 0;

  // Section 10/10
  private totalInputs: number = 0;
  private totalBToH: number = 0;
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
  private managementSupportBudget: number = 0;

  private transportNarrative: string = '';
  private securityNarrative: string = '';
  private logisticsAndOverheadsNarrative: string = '';
  private staffingAndSupportNarrative: string = '';
  private monitoringAndEvolutionNarrative: string = '';
  private capitalItemsNarrative: string = '';
  private managementSupportNarrative: string = '';

  private capitalsExist: boolean = true;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("Admin uid: " + this.uid);
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

      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {
    console.log("Finish button pressed");

    let newResponsePlan: ResponsePlan = new ResponsePlan;

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
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.uid;

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

  /**
   * Section 2/10
   */

  /**
   * Section 3/10
   */

  addSummarizeScenarioBulletPoint() {

    this.summarizeScenarioBulletPointsCounter++;
    this.summarizeScenarioBulletPoints.push(this.summarizeScenarioBulletPointsCounter);
    if (this.summarizeScenarioBulletPoints.length > 1) {
      this.summarizeScenarioRemoveOptionInvisible = false;
    }
  }

  removeSummarizeScenarioBulletPoint(bulletPoint) {

    this.summarizeScenarioBulletPointsCounter--;
    if (this.summarizeScenarioBulletPoints.length > 1) {
      this.summarizeScenarioBulletPoints = this.summarizeScenarioBulletPoints.filter(item => item !== bulletPoint);
    }
    if (this.summarizeScenarioBulletPoints.length == 1) {
      this.summarizeScenarioRemoveOptionInvisible = true;
    }
  }

  addImpactOfCrisisBulletPoint() {

    this.impactOfCrisisBulletPointsCounter++;
    this.impactOfCrisisBulletPoints.push(this.impactOfCrisisBulletPointsCounter);
    if (this.impactOfCrisisBulletPoints.length > 1) {
      this.impactOfCrisisRemoveOptionInvisible = false;
    }
  }

  removeImpactOfCrisisBulletPoint(bulletPoint) {

    this.impactOfCrisisBulletPointsCounter--;
    if (this.impactOfCrisisBulletPoints.length > 1) {
      this.impactOfCrisisBulletPoints = this.impactOfCrisisBulletPoints.filter(item => item !== bulletPoint);
    }
    if (this.impactOfCrisisBulletPoints.length == 1) {
      this.impactOfCrisisRemoveOptionInvisible = true;
    }
  }

  addAvailabilityOfFundsBulletPoint() {

    this.availabilityOfFundsBulletPointsCounter++;
    this.availabilityOfFundsBulletPoints.push(this.availabilityOfFundsBulletPointsCounter);
    if (this.availabilityOfFundsBulletPoints.length > 1) {
      this.availabilityOfFundsRemoveOptionInvisible = false;
    }
  }

  removeAvailabilityOfFundsBulletPoint(bulletPoint) {

    this.availabilityOfFundsBulletPointsCounter--;
    if (this.availabilityOfFundsBulletPoints.length > 1) {
      this.availabilityOfFundsBulletPoints = this.availabilityOfFundsBulletPoints.filter(item => item !== bulletPoint);
    }
    if (this.availabilityOfFundsBulletPoints.length == 1) {
      this.availabilityOfFundsRemoveOptionInvisible = true;
    }
  }

  directMethodOfImplementationSelected() {
    this.isDirectlyThroughFieldStaff = true;
  }

  partnersMethodOfImplementationSelected() {
    this.isDirectlyThroughFieldStaff = false;
  }

  /**
   * Section 4/10
   */

  /**
   * Section 5/10
   */

  calculateBeneficiaries() {
    this.numOfBeneficiaries = this.numOfPeoplePerHouseHold * this.numOfHouseHolds;
    console.log("Beneficiaries ----" + this.numOfBeneficiaries);
  }

  /**
   * Section 6/10
   */

  /**
   * Section 7/10
   */

  /**
   * Section 8/10
   */

  yesSelectedForVisualDocument() {
    this.intentToVisuallyDocument = true;
  }

  noSelectedForVisualDocument() {
    this.intentToVisuallyDocument = false;
  }

  /**
   * Section 9/10
   */

  /**
   * Section 10/10
   */

  calculateBudget() {

    this.totalInputs = this.waSHBudget + this.healthBudget + this.shelterBudget + this.campManagementBudget + this.educationBudget + this.protectionBudget + this.foodSecAndLivelihoodsBudget + this.otherBudget;

    this.totalBToH = this.transportBudget + this.securityBudget + this.logisticsAndOverheadsBudget + this.staffingAndSupportBudget + this.monitoringAndEvolutionBudget + this.capitalItemsBudget + this.managementSupportBudget;

    this.totalBudget = this.totalInputs + this.totalBToH;
  }

  yesSelectedForCapitalsExist() {
    this.capitalsExist = true;
  }

  noSelectedForCapitalsExist() {
    this.capitalsExist = false;
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
          list.forEach(item => {
            this.responsePlanSettings[item.$key] = item.$value;
          });
        });
      this.subscriptions.add(subscription);
    }
    console.log(this.responsePlanSettings);
  }

  private getStaff() {

    let subscription = this.af.database.list(Constants.APP_STATUS + '/staff/' + this.uid)
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
