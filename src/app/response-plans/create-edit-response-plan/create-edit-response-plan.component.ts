import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Router, Params, ActivatedRoute} from "@angular/router";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {
  AgeRange,
  AlertMessageType,
  ApprovalStatus,
  BudgetCategory,
  Currency,
  Gender,
  HazardScenario,
  MethodOfImplementation,
  PresenceInTheCountry,
  ResponsePlanSectionSettings,
  ResponsePlanSectors,
  UserType
} from "../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {ResponsePlan} from "../../model/responsePlan";
import {ModelPlanActivity} from "../../model/plan-activity.model";
import {ModelBudgetItem} from "../../model/budget-item.model";
import {UserService} from "../../services/user.service";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AgencyModulesEnabled, PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
import {isEmpty} from "rxjs/operator/isEmpty";
import {ModelUserPublic} from "../../model/user-public.model";
// import {jQuery} from "../../network-country-admin/network-plans/network-plans.component";

declare var jQuery: any;

@Component({
  selector: 'app-create-edit-response-plan',
  templateUrl: './create-edit-response-plan.component.html',
  styleUrls: ['./create-edit-response-plan.component.css']
})

export class CreateEditResponsePlanComponent implements OnInit, OnDestroy {

  SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  Sector_Enum = ResponsePlanSectors;

  private uid: string;
  private countryId: string;
  private agencyId: string;
  private agencyAdminUid: string;
  private systemAdminUid: string;
  private idOfResponsePlanToEdit: string;
  private forEditing: boolean = false;
  // private isCountryAdmin: boolean = false;
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private didOpenInitialSection: boolean = false;
  private isAutoSave: boolean = false;

  private pageTitle: string = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.TITLE_TEXT";

  private responsePlanSettings = {};
  private ResponsePlanSectionSettings = ResponsePlanSectionSettings;
  private totalSections: number = 0;
  private currentSectionNum: number = 0;
  private numberOfCompletedSections: number = 0;

  private MAX_BULLET_POINTS_VAL_1: number = Constants.MAX_BULLET_POINTS_VAL_1;
  private MAX_BULLET_POINTS_VAL_2: number = Constants.MAX_BULLET_POINTS_VAL_2;
  private newResponsePlan = new ResponsePlan();
  private sectionsCompleted = new Map<string, boolean>();
  private sections: string[] = ["section1", "section2", "section3", "section4",
    "section5", "section6", "section7", "section8", "section9", "section10"];

  // Section 1/10
  private planName: string = '';
  private planNameChange: string;
  private geographicalLocation: string = '';
  // private staffMembers: FirebaseObjectObservable<any>[] = [];
  private staffMembers: any[] = [];
  private staffMemberSelected: any;
  private hazardScenarioSelected: number;
  private HazardScenario = Constants.HAZARD_SCENARIOS;

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
    HazardScenario.HazardScenario10,
    HazardScenario.HazardScenario11,
    HazardScenario.HazardScenario12,
    HazardScenario.HazardScenario13,
    HazardScenario.HazardScenario14,
    HazardScenario.HazardScenario15,
    HazardScenario.HazardScenario16,
    HazardScenario.HazardScenario17,
    HazardScenario.HazardScenario18,
    HazardScenario.HazardScenario19,
    HazardScenario.HazardScenario20,
    HazardScenario.HazardScenario21,
    HazardScenario.HazardScenario22,
    HazardScenario.HazardScenario23,
    HazardScenario.HazardScenario24,
    HazardScenario.HazardScenario25,
    HazardScenario.HazardScenario26,
  ];
  private section1Status: string = "GLOBAL.INCOMPLETE";

  // Section 2/10
  private scenarioCrisisObject: {} = {};
  private impactOfCrisisObject: {} = {};
  private availabilityOfFundsObject: {} = {};
  private summarizeScenarioBulletPointsCounter: number = 1;
  private summarizeScenarioBulletPoints: number[] = [this.summarizeScenarioBulletPointsCounter];
  private summarizeBP: any;
  private bpList: number [];
  private impactOfCrisisBulletPointsCounter: number = 1;
  private impactOfCrisisBulletPoints: number[] = [this.impactOfCrisisBulletPointsCounter];

  private availabilityOfFundsBulletPointsCounter: number = 1;
  private availabilityOfFundsBulletPoints: number[] = [this.availabilityOfFundsBulletPointsCounter];

  private section2Status: string = "GLOBAL.INCOMPLETE";

  // Section 3/10
  private sectorsRelatedTo: any[] = [];
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
  private isWorkingWithPartners: boolean;
  private isWorkingWithStaffAndPartners: boolean;

  private partnersDropDownsCounter: number = 1;
  private partnersDropDowns: number[] = [this.partnersDropDownsCounter];
  // private partnerOrganisations: FirebaseObjectObservable<any>[] = [];
  private partnerOrganisations: any[] = [];
  private partnerOrganisationsSelected = {};

  private section3Status: string = "GLOBAL.INCOMPLETE";

  // Section 4/10
  private proposedResponseText: string = '';
  private progressOfActivitiesPlanText: string = '';
  private coordinationPlanText: string = '';

  private section4Status: string = "GLOBAL.INCOMPLETE";

  // Section 5/10
  private numOfPeoplePerHouseHold: number;
  private numOfHouseholds: number;
  private numOfBeneficiaries: number = 0;

  private showBeneficiariesTextEntry: boolean = false;
  private howBeneficiariesCalculatedText: string = '';

  private groups: any[] = [];
  private Other: string = "Other";
  private otherGroup: string = '';
  private selectedVulnerableGroups = [];

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
  private activeActivity = [];
  private activityError = [];
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
  private loadResponsePlan: ResponsePlan;
  private sectionOneNum: number = 0;
  private sectionTwoNum: number = 0;
  private sectionThreeNum: number = 0;
  private sectionFourNum: number = 0;
  private sectionFiveNum: number = 0;
  private sectionSixNum: number = 0;
  private sectionSevenNum: number = 0;
  private sectionEightNum: number = 0;
  private sectionNineNum: number = 0;
  private sectionTenNum: number = 0;
  private isLocalAgencyAdmin: boolean = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();
  private adminModel: Observable<ModelUserPublic>;

  //local agency
  @Input() isLocalAgency: Boolean;

  public disaggregateAge = false;
  public disaggregateDisability = false;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice();
  }

  private initCountryOffice() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.auth.uid;
      // this.isCountryAdmin = userType == UserType.CountryAdmin ? true : false;
      this.adminModel = this.userService.getCountryAdminOrLocalAgencyAdmin(agencyId, countryId)
      let userpath = Constants.USER_PATHS[userType];
      PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, userpath, (isEnabled) => {
        this.moduleAccess = isEnabled;
        if (!this.moduleAccess.countryOffice) {
          this.methodOfImplementationSelectedDirect();
        }
      });
      if (userType == UserType.PartnerUser) {
        this.countryId = countryId;
        this.agencyAdminUid = agencyId;
        this.systemAdminUid = systemId;
        this.prepareData();
      } else {
        this.getSystemAgencyCountryIds(userpath);
      }
    });
  }

  private initLocalAgency() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.auth.uid;
      // this.isCountryAdmin = userType == UserType.CountryAdmin ? true : false;
      this.adminModel = this.userService.getCountryAdminOrLocalAgencyAdmin(agencyId)
      this.isLocalAgencyAdmin = userType == UserType.LocalAgencyAdmin;

      let userpath = Constants.USER_PATHS[userType];
      PageControlService.localAgencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, countryId, userpath, (isEnabled) => {
        this.moduleAccess = isEnabled;
        if (!this.moduleAccess.countryOffice) {
          this.methodOfImplementationSelectedDirect();
        }
      });

      this.agencyId = agencyId;
      this.systemAdminUid = systemId;
      this.prepareDataLocalAgency();

    });
  }

  private prepareData() {
    this.getStaff();
    this.setupForEdit();
    this.getSettings();
    this.getPartners();
    this.getGroups();
    this.calculateCurrency();
  }

  private prepareDataLocalAgency() {
    this.getStaffLocalAgency();
    this.setupForEdit();
    this.getSettingsLocalAgency();
    this.getPartners();
    this.getGroups();
    this.calculateCurrency();
  }

  private getSystemAgencyCountryIds(userPath: string) {
    this.af.database.object(Constants.APP_STATUS + "/" + userPath + "/" + this.uid + "/countryId")
      .takeUntil(this.ngUnsubscribe)
      .subscribe((countryId) => {
        this.countryId = countryId.$value;
        this.getStaff();
        this.setupForEdit();

        this.af.database.list(Constants.APP_STATUS + "/" + userPath + "/" + this.uid + '/agencyAdmin')
          .takeUntil(this.ngUnsubscribe)
          .subscribe((agencyAdminIds) => {
            this.agencyAdminUid = agencyAdminIds[0].$key;
            this.getSettings();
            this.calculateCurrency();
            this.getPartners();

            this.af.database.list(Constants.APP_STATUS + "/" + userPath + "/" + this.uid + '/systemAdmin')
              .takeUntil(this.ngUnsubscribe)
              .subscribe((systemAdminIds) => {
                this.systemAdminUid = systemAdminIds[0].$key;
                this.getGroups();
              });

          });
      });
  }

  ngOnDestroy() {
    if (this.forEditing) {
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/isEditing").set(false);
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/editingUserId").set(null);
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Finish Button press on section 10
   */


  onSave(section) {
    let numberOfCompletedSections = this.getCompleteSectionNumber();

    if (numberOfCompletedSections > 0) {
      console.log("numberOfCompletedSections -- " + numberOfCompletedSections);
      //jQuery("#navigate-back").modal("show");
    } else {
      console.log('in false of if ');
      this.alertMessage = new AlertMessageModel("RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.NO_COMPLETED_SECTIONS");
    }
    console.log("Save button pressed");

    //this.checkAllSections();

    if (section == 1) {
      this.section1();
    } else if (section == 2) {
      this.section2();
    } else if (section == 3) {
      this.section3();
    } else if (section == 4) {
      this.section4();
    } else if (section == 5) {
      this.section5();
    } else if (section == 6) {
      this.section6();
    } else if (section == 7) {
      this.section7();
    } else if (section == 8) {
      this.section8();
    } else if (section == 9) {
      this.section9();
    } else if (section == 10) {
      this.section10();
    }

    this.otherDataToSave();

  }

  onSubmit() {


    // Closing confirmation pop up
    // jQuery("#navigate-back").modal("show");
    // Here we need to ensure the save Y/N is shown when > 0 sections are complete


    //jQuery("#navigate-back").modal("hide");
    //this.router.navigateByUrl('response-plans');
    this.autoSaveToFirebase(this.newResponsePlan);
  }

  /**
   * Calculate the currency
   */
  private currency: number = Currency.GBP;
  private CURRENCIES = Constants.CURRENCY_SYMBOL;

  public calculateCurrency() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyAdminUid + "/currency", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.currency = snap.val();
      });
  }

  /**
   * Section 1/10
   */

  section1() {
    console.log("in section 1");
    this.newResponsePlan.name = this.planName;
    this.newResponsePlan.location = this.geographicalLocation;
    if (this.staffMemberSelected) {
      this.newResponsePlan.planLead = this.staffMemberSelected;
    }
    if (this.hazardScenarioSelected) {
      this.newResponsePlan.hazardScenario = this.hazardScenarioSelected;
    }
  }

  continueButtonPressedOnSection1() {

    this.checkSection1();

    this.handleContinueSave();

    this.onSave(1);

  }


  private checkSection1() {
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
  section2() {
    console.log("in section 2");
    this.newResponsePlan.scenarioCrisisList = this.convertTolist(this.scenarioCrisisObject);
    this.newResponsePlan.impactOfCrisisList = this.convertTolist(this.impactOfCrisisObject);
    this.newResponsePlan.availabilityOfFundsList = this.convertTolist(this.availabilityOfFundsObject);
  }

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


    this.summarizeBP = this.summarizeScenarioBulletPoints;
    this.summarizeScenarioBulletPointsCounter = this.summarizeBP.length;

    if (this.summarizeScenarioBulletPoints.length > 4) {
      console.log('stop adding bullet points');
    } else {

      if (this.summarizeBP.length) {
        this.summarizeBP.length = this.summarizeScenarioBulletPointsCounter;

        this.summarizeBP.push(this.summarizeScenarioBulletPointsCounter + 1);
        this.summarizeScenarioBulletPointsCounter++;


      }
    }


  }

  removeSummarizeScenarioBulletPoint(bulletPoint) {


    this.summarizeScenarioBulletPoints = this.summarizeScenarioBulletPoints.filter(item => item !== bulletPoint);
    this.summarizeScenarioBulletPointsCounter--;


    /*if(this.summarizeScenarioBulletPoints.length < 4 ) {
      jQuery('.Add__row__cta').show();
    }*/


    // Removing bullet point from list if exists
    if (this.scenarioCrisisObject[bulletPoint]) {

      // Removes object from bullet point list
      console.log('bullet point in list');


    } else {
      // this will remove if input field is empty
      console.log("Bullet point not in list");

    }

    // loop the bullet points to get correct number in span tag
    for (let i = 0; i < this.summarizeScenarioBulletPoints.length; i++) {

      this.summarizeScenarioBulletPoints[i] = i + 1;
      console.log(i + 1);

    }
    //delete this.scenarioCrisisObject[bulletPoint];
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

    this.checkSection2();

    this.handleContinueSave();

    this.onSave(2);
  }

  private checkSection2() {
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
  section3() {
    console.log("in section 3");
    this.newResponsePlan.sectorsRelatedTo = this.sectorsRelatedTo;
    this.newResponsePlan.otherRelatedSector = this.otherRelatedSector;
    this.newResponsePlan.presenceInTheCountry = this.presenceInTheCountry ? this.presenceInTheCountry : -1;

    if (this.isDirectlyThroughFieldStaff) {
      this.newResponsePlan.methodOfImplementation = MethodOfImplementation.fieldStaff;
      this.newResponsePlan.partnerOrganisations = null;
    } else {
      if (Object.keys(this.partnerOrganisationsSelected).length != 0) {

        this.isWorkingWithPartners ? this.newResponsePlan.methodOfImplementation = MethodOfImplementation.withPartner : this.newResponsePlan.methodOfImplementation = MethodOfImplementation.both;

        this.newResponsePlan.partnerOrganisations = this.convertTolist(this.partnerOrganisationsSelected);
      } else {
        this.newResponsePlan.methodOfImplementation = MethodOfImplementation.fieldStaff;
      }
    }
  }


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
    this.updateSectorsList(this.nutritionSectorSelected, ResponsePlanSectors.nutrition);
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
    this.updateSectorsList(this.campManagementSectorSelected, ResponsePlanSectors.campmanagement);
  }

  isOtherSectorSelected() {
    this.otherSectorSelected = !this.otherSectorSelected;
    this.updateSectorsList(this.otherSectorSelected, ResponsePlanSectors.other);
    if (!this.otherSectorSelected) {
      this.otherRelatedSector = '';
    }
  }

  currentProgrammesSelected() {
    console.log("Pressed on currentProgrammes");
    this.presenceInTheCountry = PresenceInTheCountry.currentProgrammes;
  }

  preExistingPartnerSelected() {
    console.log("Pressed on preExistingPartner");
    this.presenceInTheCountry = PresenceInTheCountry.preExistingPartner;
  }

  noPreExistingPartnerSelected() {
    console.log("Pressed on noPreExistingPresence");
    this.presenceInTheCountry = PresenceInTheCountry.noPreExistingPresence;
  }

  methodOfImplementationSelectedDirect() {
    this.isDirectlyThroughFieldStaff = true;
    this.isWorkingWithPartners = false;
    this.isWorkingWithStaffAndPartners = false;
  }

  methodOfImplementationSelectedWithPartners() {
    console.log(this.moduleAccess.countryOffice)

    if (this.moduleAccess.countryOffice) {
      this.isWorkingWithPartners = true;
      this.isDirectlyThroughFieldStaff = false;
      this.isWorkingWithStaffAndPartners = false;
    }
    else {
      this.methodOfImplementationSelectedDirect();
    }
  }

  methodOfImplementationSelectedBoth() {
    if (this.moduleAccess.countryOffice) {
      this.isWorkingWithStaffAndPartners = true;
      this.isDirectlyThroughFieldStaff = false;
      this.isWorkingWithPartners = false;
    }
    else {
      this.methodOfImplementationSelectedDirect();
    }
  }

  addPartnersDropDown() {
    this.partnersDropDownsCounter++;
    this.partnersDropDowns.push(this.partnersDropDownsCounter);
  }

  removePartnersDropDown(dropDown) {
    this.partnersDropDownsCounter--;
    this.partnersDropDowns = this.partnersDropDowns.filter(item => item !== dropDown);
    delete this.partnerOrganisationsSelected[dropDown];
  }

  setPartnerOrganisation(partnerOrganisationSelected, dropDown) {
    if (partnerOrganisationSelected == 'addNewPartnerOrganisation') {
      this.router.navigate(this.isLocalAgency ? ['/local-agency/response-plans/add-partner-organisation', {fromResponsePlans: true}] : ['/response-plans/add-partner-organisation', {fromResponsePlans: true}]);
    } else {
      this.partnerOrganisationsSelected[dropDown] = partnerOrganisationSelected;
    }
  }

  continueButtonPressedOnSection3() {

    this.checkSection3();

    this.handleContinueSave();

    console.log(this.newResponsePlan, 'new response plan');
    console.log(this.loadResponsePlan, 'load response plan');

    this.onSave(3);

  }

  private checkSection3() {
    let sectionsSelected: boolean = (this.sectorsRelatedTo.length != 0) || (this.otherRelatedSector != '');
    let presenceSelected: boolean = this.presenceInTheCountry != null;
    let methodOfImplementationSelected: boolean = this.isDirectlyThroughFieldStaff || this.isWorkingWithPartners || this.isWorkingWithStaffAndPartners;

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
  section4() {
    console.log("in section 4");
    this.newResponsePlan.activitySummary["q1"] = this.proposedResponseText;
    this.newResponsePlan.activitySummary["q2"] = this.progressOfActivitiesPlanText;
    this.newResponsePlan.activitySummary["q3"] = this.coordinationPlanText;
  }

  continueButtonPressedOnSection4() {

    this.checkSection4();

    this.handleContinueSave();

    console.log(this.newResponsePlan, 'new response plan');
    console.log(this.loadResponsePlan, 'load response plan');

    this.onSave(4);

  }

  private checkSection4() {
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
  section5() {
    console.log("in section 5");
    if (this.numOfPeoplePerHouseHold) {
      this.newResponsePlan.peoplePerHousehold = this.numOfPeoplePerHouseHold;
    }
    if (this.numOfHouseholds) {
      this.newResponsePlan.numOfHouseholds = this.numOfHouseholds;
    }
    this.newResponsePlan.beneficiariesNote = this.howBeneficiariesCalculatedText ? this.howBeneficiariesCalculatedText : '';
    this.newResponsePlan.vulnerableGroups = this.selectedVulnerableGroups;
    console.log(this.newResponsePlan.vulnerableGroups)
    this.newResponsePlan.otherVulnerableGroup = this.otherGroup ? this.otherGroup : '';
    this.newResponsePlan.targetPopulationInvolvementList = this.convertTolist(this.targetPopulationInvolvementObject);
  }

  calculateBeneficiaries() {
    if (this.numOfPeoplePerHouseHold && this.numOfHouseholds) {
      this.numOfBeneficiaries = this.numOfPeoplePerHouseHold * this.numOfHouseholds;
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

  setGroup(groupKey, vulnerableGroupsDropDown) {
    if (groupKey) {
      this.selectedVulnerableGroups[vulnerableGroupsDropDown - 1] = groupKey;
    }
  }

  // updateOtherGroupToGroups() {
  //   if (this.otherGroup != '') {
  //     this.selectedVulnerableGroups['other'] = this.otherGroup;
  //   } else {
  //     delete this.selectedVulnerableGroups['other'];
  //   }
  // }

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

    this.checkSection5();

    this.handleContinueSave();

    this.onSave(5);
  }

  private checkSection5() {
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
  section6() {
    console.log("in section 6");
    this.newResponsePlan.riskManagementPlan = this.riskManagementPlanText;
  }

  continueButtonPressedOnSection6() {

    this.checkSection6();

    this.handleContinueSave();

    this.onSave(6);
  }

  private checkSection6() {
    console.log(this.riskManagementPlanText)
    if (this.riskManagementPlanText != '') {
      console.log("complete")
      this.section6Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[5], true);
    } else {
      console.log("in-complete")
      this.section6Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[5], false);
    }
  }

  /**
   * Section 7/10
   */
  // saveActivity(sector, name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3) {

  //   if (this.validateInput(name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3)) {
  //     console.log("valid");
  //     let beneficiaryList = [];
  //     for (let i = 0; i < 6; i++) {
  //       let beneData = {};
  //       if (i < 3) {
  //         beneData["age"] = i;
  //         beneData["gender"] = Gender.feMale;
  //       } else {
  //         beneData["age"] = i - 3;
  //         beneData["gender"] = Gender.male;
  //       }
  //       if (i == 0) {
  //         beneData["value"] = femaleRange1.value;
  //       } else if (i == 1) {
  //         beneData["value"] = femaleRange2.value;
  //       } else if (i == 2) {
  //         beneData["value"] = femaleRange3.value;
  //       } else if (i == 3) {
  //         beneData["value"] = maleRange1.value;
  //       } else if (i == 4) {
  //         beneData["value"] = maleRange2.value;
  //       } else if (i == 5) {
  //         beneData["value"] = maleRange3.value;
  //       }
  //       beneficiaryList.push(beneData);
  //     }
  //     let activity = new ModelPlanActivity(name.value, output.value, indicator.value, beneficiaryList);
  //     if (this.activityMap.get(sector)) {
  //       this.activityMap.get(sector).push(activity);
  //     } else {
  //       let activityList = [activity];
  //       this.activityMap.set(sector, activityList);
  //     }
  //     this.addActivityToggleMap.set(sector, true);
  //     name.value = "";
  //     output.value = "";
  //     indicator.value = "";
  //     femaleRange1.value = 0;
  //     femaleRange2.value = 0;
  //     femaleRange3.value = 0;
  //     maleRange1.value = 0;
  //     maleRange2.value = 0;
  //     maleRange3.value = 0;
  //   } else {
  //     console.log("not valid");
  //   }
  // }

  // private validateInput(name, output, indicator, femaleRange1, femaleRange2, femaleRange3, maleRange1, maleRange2, maleRange3) {
  //   if (name.value == "" || output.value == "" || indicator.value == "" || femaleRange1.value < 0 || femaleRange2.value < 0 || femaleRange3 < 0 || maleRange1.value < 0 || maleRange2.value < 0 || maleRange3 < 0) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  section7() {
    console.log("in section 7");
    this.sectorsRelatedTo.forEach(sector => {
      let sectorInfo = {};
      sectorInfo["sourcePlan"] = -1;
      sectorInfo["bullet1"] = " ";
      sectorInfo["bullet2"] = " ";
      sectorInfo["activities"] = false;

      let activities = this.activityMap.get(sector);
      if (activities) {
        activities.forEach(activity => {
          if (activity.isEmpty()) {
            activities = activities.filter(x => x != activity);
          }
        });

        sectorInfo["activities"] = activities;
      }

      let activityInfo = this.activityInfoMap.get(sector);
      if (activityInfo) {
        if (activityInfo["sourcePlan"]) {
          sectorInfo["sourcePlan"] = activityInfo["sourcePlan"];
        }
        if (activityInfo["bullet1"]) {
          sectorInfo["bullet1"] = activityInfo["bullet1"];
        }
        if (activityInfo["bullet2"]) {
          sectorInfo["bullet2"] = activityInfo["bullet2"];
        }
      }

      this.newResponsePlan.sectors[sector] = sectorInfo;
    });
  }


  saveActivity(sector, activity: ModelPlanActivity, index) {
    let error = activity.validate();

    if (!error) {
      this.activeActivity[sector] = null;
      this.activityError[sector] = []
    } else {
      this.activityError[sector] = [];
      this.activityError[sector][index] = error.message;
    }

    // if(activity.beneficiary[0].value){
    //   console.log("ben true")
    //   this.activeActivity[sector] = null;
    //   this.activityError[sector] = []
    // }else {
    //   error = new AlertMessageModel('RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITIES.BENEFICIARIES');
    //   console.log("ben error")
    //   this.activityError[sector] = [];
    //   this.activityError[sector][index] = error.message;
    //   console.log(this.activityError[sector][index])
    // }
  }

  viewActivity(sector, activity) {
    this.activeActivity[sector] = activity;
  }

  removeActivity(sector, activity) {
    this.activityMap.set(sector, this.activityMap.get(sector).filter(x => x != activity));
    this.activeActivity[sector] = null;
  }

  addActivity(sector) {
    let activity = new ModelPlanActivity(null, null, null, null);
    if (this.activityMap.get(sector)) {
      this.activityMap.get(sector).push(activity);
    } else {
      this.activityMap.set(sector, [activity]);
    }
    this.activeActivity[sector] = activity;
  }

  getNumberOfActivities(sector) {
    let activitiesNumber = 0;
    if (this.activityMap.get(sector)) {
      let activities = this.activityMap.get(sector);
      activities.forEach(activity => {
        if (!activity.isEmpty()) {
          activitiesNumber++;
        }
      })
    }
    return activitiesNumber;
  }

  selectInternationa(sector, value) {
    this.checkActivityInfo(sector, value, 0, -1);
  }

  selectNeighbour(sector, value) {
    this.checkActivityInfo(sector, value, 0, -1);
  }

  selectLocal(sector, value) {
    this.checkActivityInfo(sector, value, 0, -1);
  }

  getBulletOne(sector, value) {
    this.checkActivityInfo(sector, value, 1, 0);
  }

  getBulletTwo(sector, value) {
    this.checkActivityInfo(sector, value, 1, 1);
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
  }

  continueButtonPressedOnSection7() {

    this.checkSection7();

    this.handleContinueSave();

    this.onSave(7);
  }

  private checkSection7() {
    let numOfActivities: number = this.activityMap.size;
    if (numOfActivities != 0 && this.checkSectorInfo()) {
      this.section7Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[6], true);
      this.section9();
      this.doublerCounting();

      //this.continueButtonPressedOnSection9();
    } else {
      this.section7Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[6], false);
    }
  }

  /**
   * Section 8/10
   */
  section8() {
    console.log("in section 8");
    this.newResponsePlan.monAccLearning['mALSystemsDescription'] = this.mALSystemsDescriptionText;
    if (this.mediaFormat != null) {
      if (this.intentToVisuallyDocument) {
        this.newResponsePlan.monAccLearning['mediaFormat'] = this.mediaFormat;
        this.newResponsePlan.monAccLearning['isMedia'] = true;
      } else {
        this.newResponsePlan.monAccLearning['mediaFormat'] = null;
        this.newResponsePlan.monAccLearning['isMedia'] = true;
      }
    } else {
      this.intentToVisuallyDocument = false;
      this.newResponsePlan.monAccLearning['isMedia'] = false;
    }
  }

  yesSelectedForVisualDocument() {
    this.intentToVisuallyDocument = true;
  }

  noSelectedForVisualDocument() {
    this.intentToVisuallyDocument = false;
  }

  updateMediaFormat(value) {
    this.mediaFormat = value;
  }

  continueButtonPressedOnSection8() {

    this.checkSection8();

    this.handleContinueSave();

    this.onSave(8);
  }

  private checkSection8() {
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
  section9() {
    console.log("in section 9");
    const doubleCounting = {};
    const data = {};
    for (let i = 0; i < 6; i++) {

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
    console.log(doubleCounting)
    this.newResponsePlan.doubleCounting = doubleCounting;
  }

  continueButtonPressedOnSection9() {

    this.doublerCounting();

    this.checkSection9();

    // this.handleContinueSave();

    this.onSave(9);
  }

  private checkSection9() {
    if (!this.isDoubleCountingDone) {
      this.section9Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[8], true);
    } else {
      this.section9Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[8], false);
    }
    this.isDoubleCountingDone = true;
  }

  doublerCounting() {
    console.log("doubler counting");

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
    // let beneficiaryList = [];
    // let furtherBeneficiaryList = [];
    modelPlanList.forEach(modelPlan => {
      // beneficiaryList = beneficiaryList.concat(modelPlan.beneficiary);
      // furtherBeneficiaryList = furtherBeneficiaryList.concat(modelPlan.furtherBeneficiary);
      if (!modelPlan.hasFurtherBeneficiary) {
        modelPlan.beneficiary.forEach(item => {
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
        })

      }
      // else {
      //   modelPlan.furtherBeneficiary.forEach(item => {
      //     if (item["age"] < 3 && item["gender"] == Gender.feMale) {
      //       this.numberFemaleLessThan18 += Number(item["value"]);
      //     } else if (item["age"] == 3 && item["gender"] == Gender.feMale) {
      //       this.numberFemale18To50 += Number(item["value"]);
      //     } else if (item["age"] > 3 && item["gender"] == Gender.feMale) {
      //       this.numberFemalegreaterThan50 += Number(item["value"]);
      //     } else if (item["age"] < 3 && item["gender"] == Gender.male) {
      //       this.numberMaleLessThan18 += Number(item["value"]);
      //     } else if (item["age"] == 3 && item["gender"] == Gender.male) {
      //       this.numberMale18To50 += Number(item["value"]);
      //     } else if (item["age"] > 3 && item["gender"] == Gender.male) {
      //       this.numberMalegreaterThan50 += Number(item["value"]);
      //     }
      //   })
      //
      // }
    });
    // beneficiaryList.forEach(item => {
    //   if (item["age"] == AgeRange.Less18 && item["gender"] == Gender.feMale) {
    //     this.numberFemaleLessThan18 += Number(item["value"]);
    //   } else if (item["age"] == AgeRange.Between18To50 && item["gender"] == Gender.feMale) {
    //     this.numberFemale18To50 += Number(item["value"]);
    //   } else if (item["age"] == AgeRange.More50 && item["gender"] == Gender.feMale) {
    //     this.numberFemalegreaterThan50 += Number(item["value"]);
    //   } else if (item["age"] == AgeRange.Less18 && item["gender"] == Gender.male) {
    //     this.numberMaleLessThan18 += Number(item["value"]);
    //   } else if (item["age"] == AgeRange.Between18To50 && item["gender"] == Gender.male) {
    //     this.numberMale18To50 += Number(item["value"]);
    //   } else if (item["age"] == AgeRange.More50 && item["gender"] == Gender.male) {
    //     this.numberMalegreaterThan50 += Number(item["value"]);
    //   }
    // });

    console.log("numberFemaleLessThan18:");
    console.log(this.numberFemaleLessThan18);

    if (this.forEditing && this.isDoubleCountingDone) {
      this.adjustedFemaleLessThan18 = this.loadResponsePlan.doubleCounting[0].value;
      this.adjustedFemale18To50 = this.loadResponsePlan.doubleCounting[1].value;
      this.adjustedFemalegreaterThan50 = this.loadResponsePlan.doubleCounting[2].value;
      this.adjustedMaleLessThan18 = this.loadResponsePlan.doubleCounting[3].value;
      this.adjustedMale18To50 = this.loadResponsePlan.doubleCounting[4].value;
      this.adjustedMalegreaterThan50 = this.loadResponsePlan.doubleCounting[5].value;
    } else {
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
  section10() {
    console.log("in section 10");
    let budgetData = {};
    let inputs = {};

    let diff = [];
    this.sectorsRelatedTo.forEach(item => {

      if (!this.sectorBudget.get(item)) {
        diff.push(item);
      }
    });

    diff.forEach(item => {
      this.sectorBudget.set(Number(item), 0);
      this.sectorNarrative.set(Number(item), "");
    });

    this.sectorBudget.forEach((v, k) => {
      let item = new ModelBudgetItem();
      item.budget = this.sectorBudget && this.sectorBudget.get(k) ? this.sectorBudget.get(k) : 0;
      item.narrative = this.sectorNarrative && this.sectorNarrative.get(k) ? this.sectorNarrative.get(k) : "";
      // inputs.push(item);
      inputs[k] = item;
    });

    let allBudgetValues = {};
    allBudgetValues[1] = this.transportBudget ? this.transportBudget : 0;
    allBudgetValues[2] = this.securityBudget ? this.securityBudget : 0;
    allBudgetValues[3] = this.logisticsAndOverheadsBudget ? this.logisticsAndOverheadsBudget : 0;
    allBudgetValues[4] = this.staffingAndSupportBudget ? this.staffingAndSupportBudget : 0;
    allBudgetValues[5] = this.monitoringAndEvolutionBudget ? this.monitoringAndEvolutionBudget : 0;
    allBudgetValues[6] = this.capitalItemsBudget ? this.capitalItemsBudget : 0;
    allBudgetValues[7] = this.managementSupportPercentage ? this.managementSupportPercentage : 0;

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

    this.newResponsePlan.budget["item"] = budgetData;

    if (this.capitalsExist) {
      this.newResponsePlan.budget["itemsOver1000Exists"] = this.capitalsExist;
      let itemsOver1000 = [];
      this.budgetOver1000.forEach((v, k) => {
        let tempItem = new ModelBudgetItem();
        tempItem.budget = v;
        tempItem.narrative = this.budgetOver1000Desc && this.budgetOver1000Desc.get(k) ? this.budgetOver1000Desc.get(k) : "";
        itemsOver1000.push(tempItem);
      });
      this.newResponsePlan.budget["itemsOver1000"] = itemsOver1000;
    } else {
      this.newResponsePlan.budget["itemsOver1000Exists"] = this.capitalsExist;
    }

    this.newResponsePlan.budget["totalInputs"] = this.totalInputs;
    this.newResponsePlan.budget["totalOfAllCosts"] = this.totalOfAllCosts;
    this.newResponsePlan.budget["total"] = this.totalBudget;
  }


  calculateBudget(sector, budget, isSector) {
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
      this.sectorBudget.forEach((v,) => {
        this.totalInputs += Number(v);
      });
    }

    let totalOfSectionsBToG: number = 0;
    if (this.transportBudget) {
      totalOfSectionsBToG += Number(this.transportBudget);
    }
    if (this.securityBudget) {
      totalOfSectionsBToG += Number(this.securityBudget);
    }
    if (this.logisticsAndOverheadsBudget) {
      totalOfSectionsBToG += Number(this.logisticsAndOverheadsBudget);
    }
    if (this.staffingAndSupportBudget) {
      totalOfSectionsBToG += Number(this.staffingAndSupportBudget);
    }
    if (this.monitoringAndEvolutionBudget) {
      totalOfSectionsBToG += Number(this.monitoringAndEvolutionBudget);
    }
    if (this.capitalItemsBudget) {
      totalOfSectionsBToG += Number(this.capitalItemsBudget);
    }

    if (this.managementSupportPercentage == null) {
      this.totalOfAllCosts = 0;
    } else {
      this.totalOfAllCosts = ((this.totalInputs + totalOfSectionsBToG) * this.managementSupportPercentage) / 100;
    }
    this.totalBudget = this.totalInputs + totalOfSectionsBToG + this.totalOfAllCosts;
  }

  recordNarrative(sector, narrative) {
    this.sectorNarrative.set(Number(sector), narrative);
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
    this.budgetOver1000.delete(capitalItemSection);
    this.budgetOver1000Desc.delete(capitalItemSection);
  }

  budgetOverThousand(selection, value) {
    this.budgetOver1000.set(selection, value);
  }

  budgetOverThousandDesc(selection, value) {
    this.budgetOver1000Desc.set(selection, value);
  }

  checkSection10Status() {

    this.checkSection10();

    this.handleContinueSave();

    this.onSave(10);
  }

  private checkSection10() {
    if (this.transportBudget != null && this.securityBudget != null && this.logisticsAndOverheadsBudget != null &&
      this.staffingAndSupportBudget != null && this.monitoringAndEvolutionBudget != null &&
      this.capitalItemsBudget != null && this.managementSupportPercentage != null && this.transportNarrative != "" &&
      this.securityNarrative != "" && this.logisticsAndOverheadsNarrative != "" && this.staffingAndSupportNarrative != "" &&
      this.monitoringAndEvolutionNarrative != "" && this.capitalItemsNarrative != "" && this.managementSupportNarrative != "") {
      this.section10Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[9], true);
    } else {
      this.section10Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[9], false);
    }
  }


  /**
   * Functions
   */
  otherDataToSave() {
    this.newResponsePlan.totalSections = this.totalSections;
    this.newResponsePlan.isActive = true;
    this.newResponsePlan.isEditing = false;
    this.newResponsePlan.editingUserId = null;
    this.newResponsePlan.status = ApprovalStatus.InProgress;
    this.newResponsePlan.sectionsCompleted = this.getCompleteSectionNumber();

    if (!this.forEditing) {
      this.newResponsePlan.startDate = moment.utc().valueOf();
      this.newResponsePlan.timeCreated = moment.utc().valueOf();
      this.newResponsePlan.createdBy = this.uid;
    } else {
      this.newResponsePlan.timeUpdated = moment.utc().valueOf();
      this.newResponsePlan.updatedBy = this.uid;
    }

    this.autoSaveToFirebase(this.newResponsePlan);
  }

  checkAllSections() {
    this.checkSection1();
    this.checkSection2();
    this.checkSection3();
    this.checkSection4();
    this.checkSection5();
    this.checkSection6();
    this.checkSection7();
    this.checkSection8();
    // if (this.forEditing) {
    //   this.continueButtonPressedOnSection9();
    // }
    this.checkSection10();
  }

  goBack() {

    if (this.isLocalAgency) {
      this.router.navigateByUrl('local-agency/response-plans');
    } else {
      this.router.navigateByUrl('response-plans');
    }

    /*
    if (numberOfCompletedSections > 0) {
      console.log("numberOfCompletedSections -- " + numberOfCompletedSections);
      jQuery("#navigate-back").modal("show");
    } else {
      this.router.navigateByUrl('response-plans');
    }*/
  }

  closeModalAndNavigate() {
    jQuery("#navigate-back").modal("hide");
    this.router.navigateByUrl(this.isLocalAgency ? 'local-agency/response-plans' : 'response-plans');
  }

  /**
   * Private functions
   */

  private getSettings() {

    if (this.agencyAdminUid) {
      this.responsePlanSettings = {};

      this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyAdminUid + '/responsePlanSettings/sections')
        .takeUntil(this.ngUnsubscribe)
        .subscribe(list => {
          this.totalSections = 0;
          list.forEach(item => {
            this.responsePlanSettings[item.$key] = item.$value;
            if (item.$value) {
              this.totalSections++;
            }
          });

          this.storeAvailableSettingSections();
        });
    }
  }

  private getSettingsLocalAgency() {

    this.responsePlanSettings = {};
    this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/responsePlanSettings/sections')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {
        this.totalSections = 0;
        list.forEach(item => {
          this.responsePlanSettings[item.$key] = item.$value;

          if (item.$value) {
            this.totalSections++;
          }
        });
        this.storeAvailableSettingSections();
      });
  }


  private setupForEdit() {
    this.route.params
      .take(1)
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.EDIT_RESPONSE_PLAN";
          this.idOfResponsePlanToEdit = params["id"];
          if (this.isLocalAgency) {
            this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + this.idOfResponsePlanToEdit + "/isEditing").set(true);
            this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + this.idOfResponsePlanToEdit + "/editingUserId").set(this.uid);

          } else {
            this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/isEditing").set(true);
            this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/editingUserId").set(this.uid);

          }

          this.loadResponsePlanInfo(this.idOfResponsePlanToEdit);
        }
      });
  }

  private loadResponsePlanInfo(responsePlanId: string) {
    let responsePlansPath: string;
    if (this.isLocalAgency) {
      responsePlansPath = Constants.APP_STATUS + '/responsePlan/' + this.agencyId + '/' + responsePlanId;
    } else {
      responsePlansPath = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + responsePlanId;
    }

    this.af.database.object(responsePlansPath)
      .take(1)
      .subscribe((responsePlan: ResponsePlan) => {
        this.loadResponsePlan = responsePlan;
        console.log(this.loadResponsePlan)

        this.loadSection1(responsePlan);
        this.loadSection2(responsePlan);
        this.loadSection3(responsePlan);
        this.loadSection4(responsePlan);
        this.loadSection5(responsePlan);
        this.loadSection6(responsePlan);
        this.loadSection7(responsePlan);
        this.loadSection8(responsePlan);
        this.loadSection9(responsePlan);
        this.loadSection10(responsePlan);
        this.checkAllSections();
        this.reloadData(responsePlan);
      });
  }

  reloadData(res) {
    if (res.name) {
      this.newResponsePlan.name = res.name;
    }

    if (res.location) {
      this.newResponsePlan.location = res.location;
    }

    if (res.planLead) {
      this.newResponsePlan.planLead = res.planLead;
    }

    if (res.hazardScenario) {
      this.newResponsePlan.hazardScenario = res.hazardScenario;
    }

    if (res.scenarioCrisisList) {
      this.newResponsePlan.scenarioCrisisList = res.scenarioCrisisList;
    }

    if (res.impactOfCrisisList) {
      this.newResponsePlan.impactOfCrisisList = res.impactOfCrisisList;
    }

    if (res.availabilityOfFundsList) {
      this.newResponsePlan.availabilityOfFundsList = res.availabilityOfFundsList;
    }

    if (res.sectorsRelatedTo) {
      this.newResponsePlan.sectorsRelatedTo = res.sectorsRelatedTo;
    }

    if (res.otherRelatedSector) {
      this.newResponsePlan.otherRelatedSector = res.otherRelatedSector;
    }

    if (res.presenceInTheCountry) {
      this.newResponsePlan.presenceInTheCountry = res.presenceInTheCountry;
    }

    if (res.methodOfImplementation) {
      this.newResponsePlan.methodOfImplementation = res.methodOfImplementation;
    }

    if (res.partnerOrganisations) {
      this.newResponsePlan.partnerOrganisations = res.partnerOrganisations;
    }

    if (res.activitySummary) {
      this.newResponsePlan.activitySummary = res.activitySummary;
    }

    if (res.peoplePerHousehold) {
      this.newResponsePlan.peoplePerHousehold = res.peoplePerHousehold;
    }

    if (res.numOfHouseholds) {
      this.newResponsePlan.numOfHouseholds = res.numOfHouseholds;
    }

    if (res.beneficiariesNote) {
      this.newResponsePlan.beneficiariesNote = res.beneficiariesNote;
    }

    if (res.vulnerableGroups) {
      this.newResponsePlan.vulnerableGroups = res.vulnerableGroups;
    }

    if (res.otherVulnerableGroup) {
      this.newResponsePlan.otherVulnerableGroup = res.otherVulnerableGroup;
    }

    if (res.targetPopulationInvolvementList) {
      this.newResponsePlan.targetPopulationInvolvementList = res.targetPopulationInvolvementList;
    }

    if (res.riskManagementPlan) {
      this.newResponsePlan.riskManagementPlan = res.riskManagementPlan;
    }

    if (res.sectors) {
      this.newResponsePlan.sectors = res.sectors;
    }

    if (res.monAccLearning) {
      this.newResponsePlan.monAccLearning = res.monAccLearning;
    }

    if (res.doubleCounting) {
      this.newResponsePlan.doubleCounting = res.doubleCounting;
    }

    if (res.budget) {
      this.newResponsePlan.budget = res.budget;
    }

    if (res.sectionsCompleted) {
      this.newResponsePlan.sectionsCompleted = res.sectionsCompleted;
    }

    if (res.totalSections) {
      this.newResponsePlan.totalSections = res.totalSections;
    }

    if (res.isActive) {
      this.newResponsePlan.isActive = res.isActive;
    }

    if (res.status) {
      this.newResponsePlan.status = res.status;
    }

    if (res.startDate) {
      this.newResponsePlan.startDate = res.startDate;
    }

    if (res.timeCreated) {
      this.newResponsePlan.timeCreated = res.timeCreated;
    }

    if (res.id) {
      this.newResponsePlan.id = res.id;
    }

    if (res.createdBy) {
      this.newResponsePlan.createdBy = res.createdBy;
    }

    if (res.timeUpdated) {
      this.newResponsePlan.timeUpdated = res.timeUpdated;
    }

    if (res.updatedBy) {
      this.newResponsePlan.updatedBy = res.updatedBy;
    }

    if (res.isEditing) {
      this.newResponsePlan.isEditing = res.isEditing;
    }

    if (res.editingUserId) {
      this.newResponsePlan.editingUserId = res.editingUserId;
    }

    if (res.createdByAgencyId) {
      this.newResponsePlan.createdByAgencyId = res.createdByAgencyId;
    }

    if (res.createdByCountryId) {
      this.newResponsePlan.createdByCountryId = res.createdByCountryId;
    }

    if (res.approval) {
      this.newResponsePlan.approval = res.approval;
    }

  }

  private loadSection1(responsePlan: ResponsePlan) {
    this.planName = responsePlan.name;
    this.geographicalLocation = responsePlan.location;
    this.hazardScenarioSelected = responsePlan.hazardScenario;
    this.staffMemberSelected = responsePlan.planLead;
  }

  private loadSection2(responsePlan: ResponsePlan) {

    //scenario crisis list
    let scenarioCrisisList = responsePlan.scenarioCrisisList;
    this.loadSection2Back(0, scenarioCrisisList, this.summarizeScenarioBulletPointsCounter, this.summarizeScenarioBulletPoints);

    let impactOfCrisisList = responsePlan.impactOfCrisisList;
    this.loadSection2Back(1, impactOfCrisisList, this.impactOfCrisisBulletPointsCounter, this.impactOfCrisisBulletPoints);

    let availabilityOfFundsList = responsePlan.availabilityOfFundsList;
    this.loadSection2Back(2, availabilityOfFundsList, this.availabilityOfFundsBulletPointsCounter, this.availabilityOfFundsBulletPoints);
  }

  private loadSection2Back(type: number, list: string[], counter: number, counterList: number[]) {

    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (i != 0) {
          counter++;
          counterList.push(counter);
        }
      }
      counterList.forEach(item => {
        if (type == 0) {
          this.addToSummarizeScenarioObject(item, list[item - 1]);
          console.log(this.addToSummarizeScenarioObject(item, list[item - 1]), 'here');
          console.log(this.summarizeScenarioBulletPoints.length, ': in the list');
        } else if (type == 1) {
          this.addToImpactOfCrisisObject(item, list[item - 1]);
        } else if (type == 2) {
          this.addToAvailabilityOfFundsObject(item, list[item - 1]);
        }
      });
    }
  }

  private loadSection3(responsePlan: ResponsePlan) {
    if (responsePlan.sectors) {
      let sectors = responsePlan.sectors;
      let sectorKeys = Object.keys(sectors);
      this.updateSectorSelections(sectorKeys, responsePlan);
      this.presenceInTheCountry = responsePlan.presenceInTheCountry;
      this.isDirectlyThroughFieldStaff = responsePlan.methodOfImplementation === MethodOfImplementation.fieldStaff;
      this.isWorkingWithPartners = responsePlan.methodOfImplementation === MethodOfImplementation.withPartner;
      this.isWorkingWithStaffAndPartners = responsePlan.methodOfImplementation === MethodOfImplementation.both;

    }
    if (!responsePlan.sectors && responsePlan.sectorsRelatedTo) {
      this.sectorsRelatedTo = responsePlan.sectorsRelatedTo;

      // let sectorKeys = Object.keys(this.sectorsRelatedTo);
      this.updateSectorSelections(this.sectorsRelatedTo, responsePlan);
      this.presenceInTheCountry = responsePlan.presenceInTheCountry;
      this.isDirectlyThroughFieldStaff = responsePlan.methodOfImplementation === MethodOfImplementation.fieldStaff;
      this.isWorkingWithPartners = responsePlan.methodOfImplementation === MethodOfImplementation.withPartner;
      this.isWorkingWithStaffAndPartners = responsePlan.methodOfImplementation === MethodOfImplementation.both;

    }
  }

  private updateSectorSelections(sectorKeys: any[], responsePlan: ResponsePlan) {
    sectorKeys.forEach(key => {
      if (Number(key) == ResponsePlanSectors.wash) {
        this.waSHSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.health) {
        this.healthSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.shelter) {
        this.shelterSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.nutrition) {
        this.nutritionSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.foodSecurityAndLivelihoods) {
        this.foodSecAndLivelihoodsSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.protection) {
        this.protectionSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.education) {
        this.educationSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.campmanagement) {
        this.campManagementSectorSelected = true;
      } else if (Number(key) == ResponsePlanSectors.other) {
        this.otherSectorSelected = true;
      }
    });
    if (this.otherSectorSelected) {
      this.otherRelatedSector = responsePlan.otherRelatedSector;
    }

    if (responsePlan.partnerOrganisations) {
      let partnerOrganisations = responsePlan.partnerOrganisations;
      for (let i = 0; i < partnerOrganisations.length; i++) {
        if (i != 0) {
          this.partnersDropDownsCounter++;
          this.partnersDropDowns.push(this.partnersDropDownsCounter);
        }
        this.partnerOrganisationsSelected[i] = partnerOrganisations[i];
      }
    } else {
      console.log("Response Plan's partner organisations list is null");
    }

  }

  private loadSection4(responsePlan: ResponsePlan) {
    console.log(responsePlan)
    if (responsePlan.activitySummary) {
      this.proposedResponseText = responsePlan.activitySummary['q1'];
      this.progressOfActivitiesPlanText = responsePlan.activitySummary['q2'];
      this.coordinationPlanText = responsePlan.activitySummary['q3'];
    }
  }

  private loadSection5(responsePlan: ResponsePlan) {
    this.numOfPeoplePerHouseHold = responsePlan.peoplePerHousehold;
    this.numOfHouseholds = responsePlan.numOfHouseholds;
    this.calculateBeneficiaries();
    this.howBeneficiariesCalculatedText = responsePlan.beneficiariesNote;
    this.showBeneficiariesTextEntry = !!this.howBeneficiariesCalculatedText;

    //vulnerable groups
    if (responsePlan.vulnerableGroups) {
      let vulnerableGroups = responsePlan.vulnerableGroups;
      for (let i = 0; i < vulnerableGroups.length; i++) {
        if (i != 0) {
          this.vulnerableGroupsDropDownsCounter++;
          this.vulnerableGroupsDropDowns.push(this.vulnerableGroupsDropDownsCounter);
        }
        this.setGroup(vulnerableGroups[i], this.vulnerableGroupsDropDownsCounter);
      }
    }

    this.otherGroup = responsePlan.otherVulnerableGroup;

    //target population bullets
    if (responsePlan.targetPopulationInvolvementList) {
      let targetPopulationInvolvementList = responsePlan.targetPopulationInvolvementList;
      for (let i = 0; i < targetPopulationInvolvementList.length; i++) {
        if (i != 0) {
          this.targetPopulationBulletPointsCounter++;
          this.targetPopulationBulletPoints.push(this.targetPopulationBulletPointsCounter);
        }
        this.addToTargetPopulationObject(this.targetPopulationBulletPointsCounter, targetPopulationInvolvementList[this.targetPopulationBulletPointsCounter - 1])
      }
    }
  }

  private loadSection6(responsePlan: ResponsePlan) {
    this.riskManagementPlanText = responsePlan.riskManagementPlan;
  }

  private loadSection7(responsePlan: ResponsePlan) {
    if (responsePlan.sectors) {
      let sectors: {} = responsePlan.sectors;
      Object.keys(sectors).forEach(sectorKey => {
        //initial load back
        this.sectorsRelatedTo.push(Number(sectorKey));

        //activity info load back
        let sectorInfo = this.activityInfoMap.get(sectorKey);
        if (!sectorInfo) {
          let infoData = {};
          infoData["sourcePlan"] = responsePlan.sectors[sectorKey]["sourcePlan"];
          infoData["bullet1"] = responsePlan.sectors[sectorKey]["bullet1"];
          infoData["bullet2"] = responsePlan.sectors[sectorKey]["bullet2"];
          this.activityInfoMap.set(Number(sectorKey), infoData);
        }

        //activities list load back
        let activitiesData: {} = responsePlan.sectors[sectorKey]["activities"];
        let moreData: {}[] = [];
        if (activitiesData) {
          Object.keys(activitiesData).forEach(key => {
            let beneficiary = [];
            activitiesData[key]["beneficiary"].forEach(item => {
              beneficiary.push(item);
            });
            let model = new ModelPlanActivity(activitiesData[key]["name"], activitiesData[key]["output"],
              activitiesData[key]["indicator"],
              !activitiesData[key]["hasFurtherBeneficiary"] ? beneficiary : null,
              activitiesData[key]["hasFurtherBeneficiary"],
              activitiesData[key]["hasDisability"],
              activitiesData[key]["hasFurtherBeneficiary"] ? activitiesData[key]["furtherBeneficiary"] : null,
              !activitiesData[key]["hasFurtherBeneficiary"] && activitiesData[key]["hasDisability"] ? activitiesData[key]["disability"] : null,
              activitiesData[key]["hasFurtherBeneficiary"] && activitiesData[key]["hasDisability"] ? activitiesData[key]["furtherDisability"] : null);

            moreData.push(model);
            if (!this.activityMap.get(Number(sectorKey))) {
              this.activityMap.set(Number(sectorKey), moreData);
              this.addActivityToggleMap.set(Number(sectorKey), true);
            }
          });
        } else {
          this.addActivity(Number(sectorKey)); // adds a new activity if the sector has none
        }
      });
    }
  }

  private loadSection8(responsePlan: ResponsePlan) {
    if (responsePlan.monAccLearning) {
      this.mALSystemsDescriptionText = responsePlan.monAccLearning['mALSystemsDescription'];
      this.intentToVisuallyDocument = responsePlan.monAccLearning['isMedia'];
      this.mediaFormat = responsePlan.monAccLearning['mediaFormat'];
    }
  }

  private loadSection9(responsePlan: ResponsePlan) {
    if (typeof responsePlan.doubleCounting !== "undefined") {
      if (Object.keys(responsePlan.doubleCounting).length > 0) {
        console.log(responsePlan.doubleCounting)
        this.numberFemaleLessThan18 = responsePlan.doubleCounting[0].value;
        this.numberFemale18To50 = responsePlan.doubleCounting[1].value;
        this.numberFemalegreaterThan50 = responsePlan.doubleCounting[2].value;
        this.numberMaleLessThan18 = responsePlan.doubleCounting[3].value;
        this.numberMale18To50 = responsePlan.doubleCounting[4].value;
        this.numberMalegreaterThan50 = responsePlan.doubleCounting[5].value;

        this.section9Status = "GLOBAL.COMPLETE";
        this.sectionsCompleted.set(this.sections[8], true);
      }
    }
  }

  private loadSection10(responsePlan: ResponsePlan) {

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.Inputs]) {
      let inputs: {} = responsePlan.budget["item"][BudgetCategory.Inputs];
      Object.keys(inputs).map(key => inputs[key]).forEach((item: ModelBudgetItem) => {
        this.totalInputs += Number(item.budget);
      });
      Object.keys(inputs).forEach(key => {
        this.sectorBudget.set(Number(key), inputs[key]["budget"]);
        this.sectorNarrative.set(Number(key), inputs[key]["narrative"]);
      });
    }

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.Transport] && responsePlan.budget["item"][BudgetCategory.Transport]["budget"]) {
      this.transportBudget = responsePlan.budget["item"][BudgetCategory.Transport]["budget"];
      this.transportNarrative = responsePlan.budget["item"][BudgetCategory.Transport]["narrative"];
    }

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.Security] && responsePlan.budget["item"][BudgetCategory.Security]["budget"]) {
      this.securityBudget = responsePlan.budget["item"][BudgetCategory.Security]["budget"];
      this.securityNarrative = responsePlan.budget["item"][BudgetCategory.Security]["narrative"];
    }

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.Logistics] && responsePlan.budget["item"][BudgetCategory.Logistics]["budget"]) {
      this.logisticsAndOverheadsBudget = responsePlan.budget["item"][BudgetCategory.Logistics]["budget"];
      this.logisticsAndOverheadsNarrative = responsePlan.budget["item"][BudgetCategory.Logistics]["narrative"];
    }

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.Staffing] && responsePlan.budget["item"][BudgetCategory.Staffing]["budget"]) {
      this.staffingAndSupportBudget = responsePlan.budget["item"][BudgetCategory.Staffing]["budget"];
      this.staffingAndSupportNarrative = responsePlan.budget["item"][BudgetCategory.Staffing]["narrative"];
    }

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.Monitoring] && responsePlan.budget["item"][BudgetCategory.Monitoring]["budget"]) {
      this.monitoringAndEvolutionBudget = responsePlan.budget["item"][BudgetCategory.Monitoring]["budget"];
      this.monitoringAndEvolutionNarrative = responsePlan.budget["item"][BudgetCategory.Monitoring]["narrative"];
    }

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.CapitalItems] && responsePlan.budget["item"][BudgetCategory.CapitalItems]["budget"]) {
      this.capitalItemsBudget = responsePlan.budget["item"][BudgetCategory.CapitalItems]["budget"];
      this.capitalItemsNarrative = responsePlan.budget["item"][BudgetCategory.CapitalItems]["narrative"];
    }

    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.CapitalItems] && responsePlan.budget["item"][BudgetCategory.CapitalItems]["budget"]) {
      this.managementSupportPercentage = responsePlan.budget["item"][BudgetCategory.ManagementSupport]["budget"];
      this.managementSupportNarrative = responsePlan.budget["item"][BudgetCategory.ManagementSupport]["narrative"];
    }


    let totalOfSectionsBToG = this.transportBudget + this.securityBudget + this.logisticsAndOverheadsBudget +
      this.staffingAndSupportBudget + this.monitoringAndEvolutionBudget + this.capitalItemsBudget

    this.totalOfAllCosts = ((this.totalInputs + totalOfSectionsBToG) * this.managementSupportPercentage) / 100;
    this.totalBudget = this.totalInputs + totalOfSectionsBToG + this.totalOfAllCosts;

    if (responsePlan.budget) {
      this.capitalsExist = responsePlan.budget["itemsOver1000Exists"];
      if (this.capitalsExist) {
        let over1000List = responsePlan.budget["itemsOver1000"];
        if (over1000List.length > 0) {
          for (let i = 0; i < over1000List.length; i++) {
            let item = new ModelBudgetItem();
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
    }
  }

  private getStaff() {

    this.af.database.list(Constants.APP_STATUS + '/staff/' + this.countryId)
      .flatMap(list => {
        this.staffMembers = [];
        let tempList = [];
        // If country admin add user to the list as country admin is not listed under staff
        // if (this.isCountryAdmin) {
        //   tempList.push(this.uid);
        // }
        list.forEach(x => {
          tempList.push(x.$key)
        });
        return Observable.from(tempList)
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + item)
      })
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged()
      .subscribe(x => {
        this.staffMembers.push(x);
      });
  }

  private getStaffLocalAgency() {
    let staffPathRef = Constants.APP_STATUS + '/staff/' + this.agencyId;
    console.log("Staff Path: " + staffPathRef);

    this.af.database.list(staffPathRef)
      .flatMap(list => {
        console.log(list)
        this.staffMembers = [];
        let tempList = [];
        // If country admin add user to the list as country admin is not listed under staff
        // if (this.isCountryAdmin) {
        //   tempList.push(this.uid);
        // }
        if (this.isLocalAgencyAdmin) {
          tempList.push(this.uid);
        }
        list.forEach(x => {
          tempList.push(x.$key)
        });
        return Observable.from(tempList)
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + item)
      })
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged()
      .subscribe(x => {
        this.staffMembers.push(x);
      });
  }

  // private getPartners() {
  //
  //   this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminUid + '/' + this.countryId + '/partners')
  //     .flatMap(list => {
  //       this.partnerOrganisations = [];
  //       let tempList = [];
  //       list.forEach(x => {
  //         tempList.push(x);
  //       });
  //       return Observable.from(tempList)
  //     })
  //     .flatMap(item => {
  //       return this.af.database.object(Constants.APP_STATUS + '/partner/' + item.$key + '/partnerOrganisationId')
  //     })
  //     .flatMap(item => {
  //       return this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation/' + item.$value)
  //     })
  //     .takeUntil(this.ngUnsubscribe)
  //     .distinctUntilChanged()
  //     .subscribe(x => {
  //       this.partnerOrganisations.push(x);
  //     });
  // }

  private getPartners() {

    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminUid + '/' + this.countryId + '/partnerOrganisations', {preserveSnapshot: true})
      .flatMap(snapshot => {
        this.partnerOrganisations = [];
        let tempList = [];
        if (snapshot && snapshot.val()) {
          tempList = Object.keys(snapshot.val());
        }
        return Observable.from(tempList)
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation/' + item)
      })
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged()
      .subscribe(x => {
        console.log(x.isActive)
        if (x.isApproved && x.isActive) {
          console.log(x.isActive);
          this.partnerOrganisations.push(x);
        } else {

        }
      });
  }

  private getGroups() {

    if (this.systemAdminUid) {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminUid + '/groups')
        .map(groupList => {
          let groups = [];
          groupList.forEach(group => {
            groups.push(group);
          });
          return groups;
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(groups => {
          this.groups = groups;
        });
    }
  }

  private convertTolist(object) {

    let keys = Object.keys(object);
    let tempList = [];
    for (let key of keys) {
      if (tempList.indexOf(object[key]) == -1) {
        tempList.push(object[key]);
      }
    }
    return tempList;
  }

  private updateSectorsList(sectorSelected, sectorEnum) {

    if (sectorSelected) {
      if (!(this.sectorsRelatedTo.includes(sectorEnum))) {
        this.sectorsRelatedTo.push(sectorEnum);
        this.addActivity(sectorEnum);
      }
    } else {
      if (this.sectorsRelatedTo.includes(sectorEnum)) {
        let index: number = this.sectorsRelatedTo.indexOf(sectorEnum, 0);
        if (index > -1) {
          this.sectorsRelatedTo.splice(index, 1)
        }
        this.activityMap.delete(sectorEnum);
      }
    }
  }

  /*
    autoSaveToFirebase(newResponsePlan: ResponsePlan){

      let numOfSectionsCompleted: number = 0;
      this.sectionsCompleted.forEach((v, k) => {
        if (v) {
          numOfSectionsCompleted++;
        }
      });

      if (numOfSectionsCompleted > 0) {

        if (this.forEditing) {
          let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.idOfResponsePlanToEdit;

          newResponsePlan.editingUserId = null;
          this.af.database.object(responsePlansPath).update(newResponsePlan).then(() => {
            console.log("Response plan successfully updated");
            //if edit, delete approval data and any validation token
            let resetData = {};
            resetData["/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/approval"] = null;
            resetData["/responsePlanValidation/" + this.idOfResponsePlanToEdit] = null;
            this.af.database.object(Constants.APP_STATUS).update(resetData).then(() => {

            }, error => {
              console.log(error.message);
            });
          }).catch(error => {
            console.log("Response plan creation unsuccessful with error --> " + error.message);
          });

        } else {
          let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId;
          this.af.database.list(responsePlansPath).push(newResponsePlan).then(() => {
            console.log("Response plan creation successful");
            }).catch(error => {
            console.log("Response plan creation unsuccessful with error --> " + error.message);
          });
        }
      } else {
        console.log(numOfSectionsCompleted);
        this.alertMessage = new AlertMessageModel("RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.NO_COMPLETED_SECTIONS");
      }
      newResponsePlan.isEditing = false;
      console.log('push data to firebase');
    }
  */

  autoSaveToFirebase(newResponsePlan: ResponsePlan) {

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};
    let id = this.isLocalAgency ? this.agencyId : this.countryId
    /* Set tracking info here */

    if (this.newResponsePlan.status == 0 && !this.idOfResponsePlanToEdit) {
      this.newResponsePlan['timeTracking'] = {}
      this.newResponsePlan['timeTracking']['timeSpentInAmber'] = [newTimeObject]
    }

    this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + id + "/" + this.idOfResponsePlanToEdit)
      .take(1)
      .subscribe(plan => {
        if (plan.timeTracking) {
          console.log(plan)
          if ((this.newResponsePlan.status == ApprovalStatus.InProgress || this.newResponsePlan.status == ApprovalStatus.WaitingApproval) && this.idOfResponsePlanToEdit) {
            // Change from Green to Amber
            if (plan['timeTracking']['timeSpentInGreen'] && plan['timeTracking']['timeSpentInGreen'].findIndex(x => x.finish == -1) != -1) {
              let index = plan['timeTracking']['timeSpentInGreen'].findIndex(x => x.finish == -1);
              plan['timeTracking']['timeSpentInGreen'][index].finish = currentTime
              plan['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              this.newResponsePlan['timeTracking'] = plan['timeTracking']
            }
            // Change from Red to Amber
            if (plan['timeTracking']['timeSpentInRed'] && plan['timeTracking']['timeSpentInRed'].findIndex(x => x.finish == -1) != -1) {
              let index = plan['timeTracking']['timeSpentInRed'].findIndex(x => x.finish == -1);
              plan['timeTracking']['timeSpentInRed'][index].finish = currentTime
              plan['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              this.newResponsePlan['timeTracking'] = plan['timeTracking']
            }
          }
        }
      })

    console.log(this.planName, 'plan name ');
    let numOfSectionsCompleted: number = 0;
    this.sectionsCompleted.forEach((v, k) => {
      if (v) {
        numOfSectionsCompleted++;
      }
    });

    if (numOfSectionsCompleted > 0) {
      if (this.isLocalAgency) {
        if (this.forEditing) {
          let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.agencyId + '/' + this.idOfResponsePlanToEdit;
          newResponsePlan.isEditing = false;
          newResponsePlan.editingUserId = null;
          this.af.database.object(responsePlansPath).update(newResponsePlan).then(() => {
            console.log("Response plan successfully updated");
            //if edit, delete approval data and any validation token
            let resetData = {};
            resetData["/responsePlan/" + this.agencyId + "/" + this.idOfResponsePlanToEdit + "/approval"] = null;
            resetData["/responsePlanValidation/" + this.idOfResponsePlanToEdit] = null;
            this.af.database.object(Constants.APP_STATUS).update(resetData).then(() => {
              //this.router.navigateByUrl('local-agency/response-plans');
            }, error => {
              console.log(error.message);
            });
          }).catch(error => {
            console.log("Response plan creation unsuccessful with error --> " + error.message);
          });

        } else {
          this.pushToFirebase();
        }
      } else {
        if (this.forEditing) {

          console.log(newResponsePlan)

          let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.idOfResponsePlanToEdit;

          this.af.database.object(responsePlansPath).update(newResponsePlan).then(() => {
            console.log("Response plan successfully updated");
            //if edit, delete approval data and any validation token
            let resetData = {};
            resetData["/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/approval"] = null;
            resetData["/responsePlanValidation/" + this.idOfResponsePlanToEdit] = null;
            this.af.database.object(Constants.APP_STATUS).update(resetData).then(() => {
              //this.router.navigateByUrl( 'response-plans');
            }, error => {
              console.log(error.message);
            });
          }).catch(error => {
            console.log("Response plan creation unsuccessful with error --> " + error.message);
          });

        } else {

          this.pushToFirebase();
        }
      }
    } else {
      console.log(numOfSectionsCompleted);
      this.alertMessage = new AlertMessageModel("RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.NO_COMPLETED_SECTIONS");
    }
    //newResponsePlan.isEditing = false;
  }

  pushToFirebase() {

    console.log(this.newResponsePlan);
    let id = this.isLocalAgency ? this.agencyId : this.countryId;

    if (this.idOfResponsePlanToEdit) {
      let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + "/" + this.idOfResponsePlanToEdit;
      this.af.database.object(responsePlansPath)
        .update(this.newResponsePlan)
        .then(() => {
          console.log('update');
        }).catch(error => {
        console.log("Response plan creation unsuccessful with error --> " + error.message);
      });

    } else {

      let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id;
      this.af.database.list(responsePlansPath)
        .push(this.newResponsePlan)
        .then(plan => {
          // set variable in here
          this.idOfResponsePlanToEdit = plan.path.pieces_[3];
          console.log('push');
        }).catch(error => {
        console.log("Response plan creation unsuccessful with error --> " + error.message);
      });

    }

  }


  private checkSectorInfo() {
    let checkValue = true;

    this.activityMap.forEach((value, key) => {

      value.forEach(obj => {

        if ((!obj.hasFurtherBeneficiary && (!obj.indicator || !obj.name || !obj.output ||
          !obj.beneficiary[0].value || !obj.beneficiary[1].value || !obj.beneficiary[2].value ||
          !obj.beneficiary[3].value || !obj.beneficiary[4].value || !obj.beneficiary[5].value))||
          (obj.hasFurtherBeneficiary && (!obj.furtherBeneficiary[0].value || !obj.furtherBeneficiary[1].value || !obj.furtherBeneficiary[2].value || !obj.furtherBeneficiary[3].value ||
            !obj.furtherBeneficiary[4].value || !obj.furtherBeneficiary[5].value || !obj.furtherBeneficiary[6].value || !obj.furtherBeneficiary[7].value ||
            !obj.furtherBeneficiary[8].value || !obj.furtherBeneficiary[9].value || !obj.furtherBeneficiary[10].value || !obj.furtherBeneficiary[11].value ||
            !obj.furtherBeneficiary[12].value || !obj.furtherBeneficiary[13].value || !obj.furtherBeneficiary[14].value || !obj.furtherBeneficiary[15].value)) ||
          (obj.hasDisability && !obj.hasFurtherBeneficiary && (!obj.disability[0].value || !obj.disability[1].value || !obj.disability[2].value ||
            !obj.disability[3].value || !obj.disability[4].value || !obj.disability[5].value) ||
            (obj.hasDisability && obj.hasFurtherBeneficiary && (!obj.furtherDisability[0].value || !obj.furtherDisability[1].value || !obj.furtherDisability[2].value || !obj.furtherDisability[3].value ||
            !obj.furtherDisability[4].value || !obj.furtherDisability[5].value || !obj.furtherDisability[6].value || !obj.furtherDisability[7].value ||
            !obj.furtherDisability[8].value || !obj.furtherDisability[9].value || !obj.furtherDisability[10].value || !obj.furtherDisability[11].value ||
            !obj.furtherDisability[12].value || !obj.furtherDisability[13].value || !obj.furtherDisability[14].value || !obj.furtherDisability[15].value)))
        ) {
          checkValue = false;
        }

        if(obj.hasDisability && obj.hasFurtherBeneficiary && (!obj.disability[0].value || !obj.disability[1].value || !obj.disability[2].value ||
          !obj.disability[3].value || !obj.disability[4].value || !obj.disability[5].value) && (!obj.furtherDisability[0].value || !obj.furtherDisability[1].value || !obj.furtherDisability[2].value || !obj.furtherDisability[3].value ||
            !obj.furtherDisability[4].value || !obj.furtherDisability[5].value || !obj.furtherDisability[6].value || !obj.furtherDisability[7].value ||
            !obj.furtherDisability[8].value || !obj.furtherDisability[9].value || !obj.furtherDisability[10].value || !obj.furtherDisability[11].value ||
            !obj.furtherDisability[12].value || !obj.furtherDisability[13].value || !obj.furtherDisability[14].value || !obj.furtherDisability[15].value)){
          checkValue = false;
        }

      });

      // // /* Dan - I have commented out just in case needed to be used
      //
      //        if (!this.activityInfoMap) {
      //          console.log('Return False, CheckSectorInfo');
      //
      //          return false;
      //        }
      //
      //      });
      //
      //      Object.keys(this.activityMap).forEach(key => {
      //
      //      if (!this.activityInfoMap.get(key) || this.activityInfoMap.get(key).indicator == null || !this.activityInfoMap.get(key).name == null || !this.activityInfoMap.get(key).output == null) {
      //          console.log('Return False, activityInfoMap');
      //
      //          return false;
      //        }
      //  //*/
    });


    return checkValue;
  }

  private checkInputsBudget() {
    console.log(this.sectorBudget)
    if (!this.sectorBudget || !this.sectorNarrative) {
      return false;
    }
    Object.keys(this.sectorBudget).forEach(key => {
      console.log(key)
      if (!this.sectorBudget.get(key)) {
        return false;
      }
    });

    Object.keys(this.sectorNarrative).forEach(key => {
      console.log(key)
      if (!this.sectorNarrative.get(key)) {
        return false;
      }
    });
    return true;
  }

  private getCompleteSectionNumber() {
    let counter = 0;
    if (this.forEditing) {
      let index = 0;
      this.sections.forEach(section => {
        if (this.sectionsCompleted.get(section) == true && this.responsePlanSettings[index] == true) {
          counter++;
        }
        index++;
      });
      return counter;
    } else {
      this.sectionsCompleted.forEach((v,) => {
        if (v) {
          counter++;
        }
      });
      return counter;
    }
  }

  private storeAvailableSettingSections() {
    var counter = 0;
    if (this.responsePlanSettings[ResponsePlanSectionSettings.PlanDetails]) {
      counter = counter + 1;
      this.sectionOneNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.PlanContext]) {
      counter = counter + 1;
      this.sectionTwoNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.BasicInformation]) {
      counter = counter + 1;
      this.sectionThreeNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.ResponseObjectives]) {
      counter = counter + 1;
      this.sectionFourNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.TargetPopulation]) {
      counter = counter + 1;
      this.sectionFiveNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.ExpectedResults]) {
      counter = counter + 1;
      this.sectionSixNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.Activities]) {
      counter = counter + 1;
      this.sectionSevenNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.MonitoringAccLearning]) {
      counter = counter + 1;
      this.sectionEightNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.DoubleCounting]) {
      counter = counter + 1;
      this.sectionNineNum = counter;
    }
    if (this.responsePlanSettings[ResponsePlanSectionSettings.Budget]) {
      counter = counter + 1;
      this.sectionTenNum = counter;
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  openInitialSection(id) {
    if (!this.didOpenInitialSection) {
      jQuery(id).trigger('click');
      this.didOpenInitialSection = true;
    }
  }

  private handleContinueSave() {
    if (this.forEditing && this.idOfResponsePlanToEdit) {
      console.log("editing mode");
    } else {
      console.log("create new mode");
    }
  }

  isEmpty(obj) {
    console.log(obj)
    if (typeof obj === "undefined") {
      return Object.keys(obj).length === 0;
    } else {
      return true
    }
  }
}
