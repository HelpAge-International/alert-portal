import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router, Params, ActivatedRoute} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {
  AgeRange,
  ApprovalStatus,
  Gender,
  HazardScenario,
  MethodOfImplementation,
  PresenceInTheCountry,
  ResponsePlanSectionSettings,
  ResponsePlanSectors, BudgetCategory, AlertMessageType, UserType
} from "../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {ResponsePlan} from "../../model/responsePlan";
import {ModelPlanActivity} from "../../model/plan-activity.model";
import {ModelBudgetItem} from "../../model/budget-item.model";
import {UserService} from "../../services/user.service";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AgencyModulesEnabled, PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
declare var jQuery: any;

@Component({
  selector: 'app-create-edit-response-plan',
  templateUrl: './create-edit-response-plan.component.html',
  styleUrls: ['./create-edit-response-plan.component.css']
})

export class CreateEditResponsePlanComponent implements OnInit, OnDestroy {

  SECTORS = Constants.RESPONSE_PLANS_SECTORS;

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;
  private systemAdminUid: string;
  private idOfResponsePlanToEdit: string;
  private forEditing: boolean = false;
  private isCountryAdmin: boolean = false;
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  private pageTitle: string = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.TITLE_TEXT";

  private responsePlanSettings = {};
  private ResponsePlanSectionSettings = ResponsePlanSectionSettings;
  private totalSections: number = 0;
  private currentSectionNum: number = 0;
  private numberOfCompletedSections: number = 0;

  private MAX_BULLET_POINTS_VAL_1: number = Constants.MAX_BULLET_POINTS_VAL_1;
  private MAX_BULLET_POINTS_VAL_2: number = Constants.MAX_BULLET_POINTS_VAL_2;

  private sectionsCompleted = new Map<string, boolean>();
  private sections: string[] = ["section1", "section2", "section3", "section4",
    "section5", "section6", "section7", "section8", "section9", "section10"];

  // Section 1/10
  private planName: string = '';
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
  private numOfHouseHolds: number;
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

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.isCountryAdmin = userType == UserType.CountryAdmin ? true : false;
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
    // this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
    //   this.uid = user.uid;
    //   this.isCountryAdmin = userType == UserType.CountryAdmin ? true : false;
    //   let userpath = Constants.USER_PATHS[userType];
    //   this.getSystemAgencyCountryIds(userpath);
    //   PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, userpath, (isEnabled) => {
    //     this.moduleAccess = isEnabled;
    //     if (!this.moduleAccess.countryOffice) {
    //       this.methodOfImplementationSelectedDirect();
    //     }
    //   });
    // });
  }

  private prepareData() {
    this.getStaff();
    this.setupForEdit();
    this.getSettings();
    this.getPartners();
    this.getGroups();
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
  onSubmit() {

    // Closing confirmation pop up
    if (jQuery("#navigate-back").modal) {
      jQuery("#navigate-back").modal("hide");
    }

    console.log("Finish button pressed");
    this.checkAllSections();

    let newResponsePlan: ResponsePlan = new ResponsePlan;

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
    newResponsePlan.presenceInTheCountry = this.presenceInTheCountry ? this.presenceInTheCountry : -1;

    // newResponsePlan.methodOfImplementation = this.isDirectlyThroughFieldStaff == true ? MethodOfImplementation.fieldStaff : MethodOfImplementation.withPartner;
    // newResponsePlan.partnerOrganisations = this.convertTolist(this.partnerOrganisationsSelected);

    if (this.isDirectlyThroughFieldStaff) {
      newResponsePlan.methodOfImplementation = MethodOfImplementation.fieldStaff;
      newResponsePlan.partnerOrganisations = null;
    } else {
      if (Object.keys(this.partnerOrganisationsSelected).length != 0) {

        this.isWorkingWithPartners ? newResponsePlan.methodOfImplementation = MethodOfImplementation.withPartner : newResponsePlan.methodOfImplementation = MethodOfImplementation.both;

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
    newResponsePlan.beneficiariesNote = this.howBeneficiariesCalculatedText ? this.howBeneficiariesCalculatedText : '';
    newResponsePlan.vulnerableGroups = this.selectedVulnerableGroups;
    newResponsePlan.otherVulnerableGroup = this.otherGroup ? this.otherGroup : '';
    newResponsePlan.targetPopulationInvolvementList = this.convertTolist(this.targetPopulationInvolvementObject);

    //section 6
    newResponsePlan.riskManagementPlan = this.riskManagementPlanText;

    //section 7
    this.activityMap.forEach((v, k) => {
      let sectorInfo = {};
      if (this.activityInfoMap.get(k)) {
        if (this.activityInfoMap.get(k)["sourcePlan"]) {
          sectorInfo["sourcePlan"] = this.activityInfoMap.get(k)["sourcePlan"];
        }
        if (this.activityInfoMap.get(k)["bullet1"]) {
          sectorInfo["bullet1"] = this.activityInfoMap.get(k)["bullet1"];
        }
        if (this.activityInfoMap.get(k)["bullet2"]) {
          sectorInfo["bullet2"] = this.activityInfoMap.get(k)["bullet2"];
        }
        sectorInfo["activities"] = v;
        newResponsePlan.sectors[k] = sectorInfo;
      }
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


    let diff = [];
    this.sectorsRelatedTo.forEach(item => {

      console.log("*****************");
      console.log(this.sectorBudget);
      console.log("*****************");
      console.log(item);
      if (!this.sectorBudget.get(item)) {
        diff.push(item);
        console.log("*****************");
        console.log(item);
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

    newResponsePlan.budget["totalInputs"] = this.totalInputs;
    newResponsePlan.budget["totalOfAllCosts"] = this.totalOfAllCosts;
    newResponsePlan.budget["total"] = this.totalBudget;

    newResponsePlan.totalSections = this.totalSections;

    newResponsePlan.isActive = true;
    newResponsePlan.isEditing = false;
    newResponsePlan.editingUserId = null;
    newResponsePlan.status = ApprovalStatus.InProgress;
    newResponsePlan.sectionsCompleted = this.getCompleteSectionNumber();
    if (!this.forEditing) {
      newResponsePlan.startDate = moment.utc().valueOf();
      newResponsePlan.timeCreated = moment.utc().valueOf();
      newResponsePlan.createdBy = this.uid;
    }
    if (this.forEditing) {
      newResponsePlan.timeUpdated = moment.utc().valueOf();
      newResponsePlan.updatedBy = this.uid;
    }

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
      this.router.navigate(['/response-plans/add-partner-organisation', {fromResponsePlans: true}]);
    } else {
      this.partnerOrganisationsSelected[dropDown] = partnerOrganisationSelected;
    }
  }

  continueButtonPressedOnSection3() {

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
    let numOfActivities: number = this.activityMap.size;
    if (numOfActivities != 0 && this.checkSectorInfo()) {
      this.section7Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[6], true);
      this.doublerCounting();
      this.continueButtonPressedOnSection9();
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

  updateMediaFormat(value) {
    this.mediaFormat = value;
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
    //reset count
    if (!(this.forEditing)) {
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
    }

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
    if (this.transportBudget && this.securityBudget && this.logisticsAndOverheadsBudget &&
      this.staffingAndSupportBudget && this.monitoringAndEvolutionBudget &&
      this.capitalItemsBudget && this.managementSupportPercentage && this.checkInputsBudget()) {
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

  checkAllSections() {
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
  }

  goBack() {

    let numberOfCompletedSections = this.getCompleteSectionNumber();

    if (numberOfCompletedSections > 0) {
      console.log("numberOfCompletedSections -- " + numberOfCompletedSections);
      jQuery("#navigate-back").modal("show");
    } else {
      this.router.navigateByUrl('response-plans');
    }
  }

  closeModalAndNavigate() {
    jQuery("#navigate-back").modal("hide");
    this.router.navigateByUrl('response-plans');
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

  private setupForEdit() {

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.EDIT_RESPONSE_PLAN";
          this.idOfResponsePlanToEdit = params["id"];
          this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/isEditing").set(true);
          this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + this.idOfResponsePlanToEdit + "/editingUserId").set(this.uid);

          this.loadResponsePlanInfo(this.idOfResponsePlanToEdit);
        }
      });
  }

  private loadResponsePlanInfo(responsePlanId: string) {

    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + responsePlanId;
    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.loadResponsePlan = responsePlan;
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
      });
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
      } else if (Number(key) == ResponsePlanSectors.campManagement) {
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
    this.proposedResponseText = responsePlan.activitySummary['q1'];
    this.progressOfActivitiesPlanText = responsePlan.activitySummary['q2'];
    this.coordinationPlanText = responsePlan.activitySummary['q3'];
  }

  private loadSection5(responsePlan: ResponsePlan) {
    this.numOfPeoplePerHouseHold = responsePlan.peoplePerHousehold;
    this.numOfHouseHolds = responsePlan.numOfHouseholds;
    this.calculateBeneficiaries();
    this.howBeneficiariesCalculatedText = responsePlan.beneficiariesNote;
    this.showBeneficiariesTextEntry = this.howBeneficiariesCalculatedText ? true : false;

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
        Object.keys(activitiesData).forEach(key => {
          let beneficiary = [];
          activitiesData[key]["beneficiary"].forEach(item => {
            beneficiary.push(item);
          });
          let model = new ModelPlanActivity(activitiesData[key]["name"], activitiesData[key]["output"], activitiesData[key]["indicator"], beneficiary);
          moreData.push(model);
          if (!this.activityMap.get(Number(sectorKey))) {
            this.activityMap.set(Number(sectorKey), moreData);
            this.addActivityToggleMap.set(Number(sectorKey), true);
          }
        });
      });
    }
  }

  private loadSection8(responsePlan: ResponsePlan) {

    this.mALSystemsDescriptionText = responsePlan.monAccLearning['mALSystemsDescription'];
    this.intentToVisuallyDocument = responsePlan.monAccLearning['isMedia'];
    this.mediaFormat = responsePlan.monAccLearning['mediaFormat'];
  }

  private loadSection9(responsePlan: ResponsePlan) {

    this.numberFemaleLessThan18 = responsePlan.doubleCounting[0].value;
    this.numberFemale18To50 = responsePlan.doubleCounting[1].value;
    this.numberFemalegreaterThan50 = responsePlan.doubleCounting[2].value;
    this.numberMaleLessThan18 = responsePlan.doubleCounting[3].value;
    this.numberMale18To50 = responsePlan.doubleCounting[4].value;
    this.numberMalegreaterThan50 = responsePlan.doubleCounting[5].value;

    this.section9Status = "GLOBAL.COMPLETE";
    this.sectionsCompleted.set(this.sections[8], true);
  }

  private loadSection10(responsePlan: ResponsePlan) {
    if (responsePlan.budget && responsePlan.budget["item"] && responsePlan.budget["item"][BudgetCategory.Inputs]) {
      let inputs: {} = responsePlan.budget["item"][BudgetCategory.Inputs];
      Object.keys(inputs).map(key => inputs[key]).forEach((item: ModelBudgetItem) => {
        this.totalInputs += item.budget;
      });
      Object.keys(inputs).forEach(key => {
        this.sectorBudget.set(Number(key), inputs[key]["budget"]);
        this.sectorNarrative.set(Number(key), inputs[key]["narrative"]);
      });
    }

    this.transportBudget = responsePlan.budget["item"][BudgetCategory.Transport]["budget"];
    this.transportNarrative = responsePlan.budget["item"][BudgetCategory.Transport]["narrative"];
    this.securityBudget = responsePlan.budget["item"][BudgetCategory.Security]["budget"];
    this.securityNarrative = responsePlan.budget["item"][BudgetCategory.Security]["narrative"];
    this.logisticsAndOverheadsBudget = responsePlan.budget["item"][BudgetCategory.Logistics]["budget"];
    this.logisticsAndOverheadsNarrative = responsePlan.budget["item"][BudgetCategory.Logistics]["narrative"];
    this.staffingAndSupportBudget = responsePlan.budget["item"][BudgetCategory.Staffing]["budget"];
    this.staffingAndSupportNarrative = responsePlan.budget["item"][BudgetCategory.Staffing]["narrative"];
    this.monitoringAndEvolutionBudget = responsePlan.budget["item"][BudgetCategory.Monitoring]["budget"];
    this.monitoringAndEvolutionNarrative = responsePlan.budget["item"][BudgetCategory.Monitoring]["narrative"];
    this.capitalItemsBudget = responsePlan.budget["item"][BudgetCategory.CapitalItems]["budget"];
    this.capitalItemsNarrative = responsePlan.budget["item"][BudgetCategory.CapitalItems]["narrative"];
    this.managementSupportPercentage = responsePlan.budget["item"][BudgetCategory.ManagementSupport]["budget"];
    this.managementSupportNarrative = responsePlan.budget["item"][BudgetCategory.ManagementSupport]["narrative"];

    let totalOfSectionsBToG = this.transportBudget + this.securityBudget + this.logisticsAndOverheadsBudget +
      this.staffingAndSupportBudget + this.monitoringAndEvolutionBudget + this.capitalItemsBudget

    this.totalOfAllCosts = ((this.totalInputs + totalOfSectionsBToG) * this.managementSupportPercentage) / 100;
    this.totalBudget = this.totalInputs + totalOfSectionsBToG + this.totalOfAllCosts;

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

  private getStaff() {

    this.af.database.list(Constants.APP_STATUS + '/staff/' + this.countryId)
      .flatMap(list => {
        this.staffMembers = [];
        let tempList = [];
        // If country admin add user to the list as country admin is not listed under staff
        if (this.isCountryAdmin) {
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
        this.partnerOrganisations.push(x);
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

    let numOfSectionsCompleted: number = 0;
    this.sectionsCompleted.forEach((v, k) => {
      if (v) {
        numOfSectionsCompleted++;
      }
    });

    if (numOfSectionsCompleted > 0) {
      if (this.forEditing) {
        let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.idOfResponsePlanToEdit;
        newResponsePlan.isEditing = false;
        newResponsePlan.editingUserId = null;
        this.af.database.object(responsePlansPath).update(newResponsePlan).then(() => {
          console.log("Response plan successfully updated");
          this.router.navigateByUrl('response-plans');
        }).catch(error => {
          console.log("Response plan creation unsuccessful with error --> " + error.message);
        });

      } else {
        let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId;
        this.af.database.list(responsePlansPath).push(newResponsePlan).then(() => {
          console.log("Response plan creation successful");
          this.router.navigateByUrl('response-plans');
        }).catch(error => {
          console.log("Response plan creation unsuccessful with error --> " + error.message);
        });
      }
    } else {
      this.alertMessage = new AlertMessageModel("RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.NO_COMPLETED_SECTIONS");
    }
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
}
