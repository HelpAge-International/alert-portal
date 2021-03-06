import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";
import { AngularFire } from "angularfire2";
import * as moment from "moment";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ModelAgency } from "../../../model/agency.model";
import { AlertMessageModel } from "../../../model/alert-message.model";
import { ModelBudgetItem } from "../../../model/budget-item.model";
import { ModelPlanActivity } from "../../../model/plan-activity.model";
import { ResponsePlan } from "../../../model/responsePlan";
import { AgencyService } from "../../../services/agency-service.service";
import { NetworkService } from "../../../services/network.service";
import { NetworkModulesEnabledModel, PageControlService } from "../../../services/pagecontrol.service";
import { ResponsePlanService } from "../../../services/response-plan.service";
import { CommonUtils } from "../../../utils/CommonUtils";
import { Constants } from "../../../utils/Constants";
import { AgeRange, AlertMessageType, ApprovalStatus, BudgetCategory, Currency, Gender, MethodOfImplementation, NetworkResponsePlanSectionSettings, PresenceInTheCountry, ResponsePlanSectors, UserType } from "../../../utils/Enums";

declare const jQuery: any;

@Component({
  selector: 'app-create-edit-network-plan',
  templateUrl: './create-edit-network-plan.component.html',
  styleUrls: ['./create-edit-network-plan.component.css'],
  providers: [ResponsePlanService]
})
export class CreateEditNetworkPlanComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private Sector_Enum = ResponsePlanSectors;
  private SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  private ResponsePlanSectionSettings = NetworkResponsePlanSectionSettings;
  private HazardScenario = Constants.HAZARD_SCENARIOS;
  private hazardScenariosList = Constants.HAZARD_SCENARIO_ENUM_LIST;
  private MAX_BULLET_POINTS_VAL_1: number = Constants.MAX_BULLET_POINTS_VAL_1;
  private MAX_BULLET_POINTS_VAL_2: number = Constants.MAX_BULLET_POINTS_VAL_2;
  private newResponsePlan = new ResponsePlan();
  private presenceInTheCountry: PresenceInTheCountry;
  private currency: number = Currency.GBP;
  private CURRENCIES = Constants.CURRENCY_SYMBOL;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private loadResponsePlan: ResponsePlan;

  //logic
  private networkId: string;
  private networkCountryId: string;

  //local network admin
  private isLocalNetworkAdmin: boolean;

  //for network view
  private isViewing: boolean;
  private agencyId: string
  private countryId: string
  private userType: UserType
  private networkViewValues: {};

  //copied
  private uid: string;
  private systemAdminUid: string;
  private idOfResponsePlanToEdit: string;
  private forEditing: boolean = false;
  private didOpenInitialSection: boolean = false;
  private pageTitle: string = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.TITLE_TEXT";
  private responsePlanSettings = {};
  private totalSections: number = 0;
  private currentSectionNum: number = 0;
  private numberOfCompletedSections: number = 0;
  private sectionsCompleted = new Map<string, boolean>();
  private sections: string[] = ["section1", "section2", "section3", "section4",
    "section5", "section6", "section7", "section8", "section9", "section10", "section11"];

  //section 0/10
  private agencyCountryMap: Map<string, string>;
  private participatedAgencies: ModelAgency[] = [];
  private agencySelectionMap = new Map<string, true>();
  private section0Status: string = "GLOBAL.INCOMPLETE";

  // Section 1/10
  private planName: string = '';
  private geographicalLocation: string = '';
  private staffMembers: any[] = [];
  private agencySelected: string;
  private hazardScenarioSelected: number;
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
  private isDirectlyThroughFieldStaff: boolean;
  private isWorkingWithPartners: boolean;
  private isWorkingWithStaffAndPartners: boolean;
  private partnersDropDownsCounter: number = 1;
  private partnersDropDowns: number[] = [this.partnersDropDownsCounter];
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
  private sectionONum: number = 0;
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

  private moduleAccess: NetworkModulesEnabledModel = new NetworkModulesEnabledModel();

  public disaggregateAge = false;
  public disaggregateDisability = false;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private af: AngularFire,
              private route: ActivatedRoute,
              private planService: ResponsePlanService,
              private agencyService: AgencyService,
              private storageService: LocalStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }
      if (params["isViewing"]) {
        this.isViewing = params["isViewing"];
      }
      if (params["systemId"]) {
        this.systemAdminUid = params["systemId"];
      }
      if (params["agencyId"]) {
        this.agencyId = params["agencyId"];
      }
      if (params["countryId"]) {
        this.countryId = params["countryId"];
      }
      if (params["userType"]) {
        this.userType = params["userType"];
      }
      if (params["networkId"]) {
        this.networkId = params["networkId"];
      }
      if (params["networkCountryId"]) {
        this.networkCountryId = params["networkCountryId"];
      }
      if (params["uid"]) {
        this.uid = params["uid"];
      }
      this.isViewing ? this.initNetworkViewAccess() : this.isLocalNetworkAdmin ? this.localNetworkAdminAccess() : this.networkCountryAccess();
    })
  }

  private localNetworkAdminAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;

      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          return this.networkService.getSystemIdForNetwork(this.uid, selection["userType"]);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(systemId => {
          this.systemAdminUid = systemId;
          this.initData();
          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.moduleAccess = matrix);
        })
    });
  }

  private networkCountryAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;

      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          return this.networkService.getSystemIdForNetwork(this.uid, selection["userType"]);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(systemId => {
          this.systemAdminUid = systemId;
          this.initData();
          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.moduleAccess = matrix);
        })
    });
  }

  private initNetworkViewAccess() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => {
        this.moduleAccess = matrix
        this.initData();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    let id = this.isLocalNetworkAdmin || !this.networkCountryId || this.networkCountryId == "undefined" ? this.networkId : this.networkCountryId;
    if (this.forEditing) {
      this.networkService.setNetworkField("/responsePlan/" + id + "/" + this.idOfResponsePlanToEdit + "/isEditing", false);
      this.networkService.setNetworkField("/responsePlan/" + id + "/" + this.idOfResponsePlanToEdit + "/editingUserId", null);
    }
  }

  private initData() {
    this.getParticipatingAgencies();
    this.setupForEdit();
    this.getSettings();
    this.getGroups();
  }

  private setupForEdit() {
    this.isLocalNetworkAdmin || !this.networkCountryId || this.networkCountryId == "undefined" ? this.setupEditForLocalNetwork() : this.setupEditForNetworkCountry();
  }

  private setupEditForLocalNetwork() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.EDIT_RESPONSE_PLAN";
          this.idOfResponsePlanToEdit = params["id"];
          this.networkService.setNetworkField("/responsePlan/" + this.networkId + "/" + this.idOfResponsePlanToEdit + "/isEditing", true);
          this.networkService.setNetworkField("/responsePlan/" + this.networkId + "/" + this.idOfResponsePlanToEdit + "/editingUserId", this.uid);

          this.loadResponsePlanInfo(this.networkId, this.idOfResponsePlanToEdit);
        }
      });
  }

  private setupEditForNetworkCountry() {
    this.route.params
      .take(1)
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.EDIT_RESPONSE_PLAN";
          this.idOfResponsePlanToEdit = params["id"];
          this.networkService.setNetworkField("/responsePlan/" + this.networkCountryId + "/" + this.idOfResponsePlanToEdit + "/isEditing", true);
          this.networkService.setNetworkField("/responsePlan/" + this.networkCountryId + "/" + this.idOfResponsePlanToEdit + "/editingUserId", this.uid);

          this.loadResponsePlanInfo(this.networkCountryId, this.idOfResponsePlanToEdit);
        }
      });
  }

  private loadResponsePlanInfo(countryId: string, responsePlanId: string) {
    this.planService.getPlanById(countryId, responsePlanId)
      .take(1)
      .subscribe((responsePlan: ResponsePlan) => {
        this.loadResponsePlan = responsePlan;
        this.loadSection0(responsePlan);
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

  private getSettings() {
    this.responsePlanSettings = {};
    this.planService.getNetworkPlanSetting(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(settingObj => {
        this.totalSections = settingObj["totalSections"];
        this.responsePlanSettings = settingObj["responsePlanSettings"];
        this.storeAvailableSettingSections();
      })
  }

  private storeAvailableSettingSections() {
    let counter = 0;
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.ParticipatingAgencies]) {
      counter++;
      this.sectionONum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.PlanDetails]) {
      counter = counter + 1;
      this.sectionOneNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.PlanContext]) {
      counter = counter + 1;
      this.sectionTwoNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.BasicInformation]) {
      counter = counter + 1;
      this.sectionThreeNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.ResponseObjectives]) {
      counter = counter + 1;
      this.sectionFourNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.TargetPopulation]) {
      counter = counter + 1;
      this.sectionFiveNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.ExpectedResults]) {
      counter = counter + 1;
      this.sectionSixNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.Activities]) {
      counter = counter + 1;
      this.sectionSevenNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.MonitoringAccLearning]) {
      counter = counter + 1;
      this.sectionEightNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.DoubleCounting]) {
      counter = counter + 1;
      this.sectionNineNum = counter;
    }
    if (this.responsePlanSettings[NetworkResponsePlanSectionSettings.Budget]) {
      counter = counter + 1;
      this.sectionTenNum = counter;
    }
  }

  private getPartners() {
    CommonUtils.trueValueFromMapAsKeys(this.agencySelectionMap).forEach(agencyId => {
      this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + this.agencyCountryMap.get(agencyId) + '/partnerOrganisations', {preserveSnapshot: true})
        .flatMap(snapshot => {
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
          if (x.isApproved) {
            this.partnerOrganisations.push(x);
          }
        });
    });
  }

  private getGroups() {
    this.planService.getSystemGroups(this.systemAdminUid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(groups => {
        this.groups = groups;
      });
  }

  private getParticipatingAgencies() {
    this.isLocalNetworkAdmin || !this.networkCountryId || this.networkCountryId == "undefined" ? this.getAgenciesForLocalNetwork() : this.getAgenciesForNetworkCountry();
  }

  private getAgenciesForLocalNetwork() {
    this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyCountryMap => {
        this.agencyCountryMap = agencyCountryMap;
        this.participatedAgencies = [];
        this.agencyCountryMap.forEach((v, k) => {
          this.agencyService.getAgencyModel(k)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agency => this.participatedAgencies.push(agency));
        })
      })
  }

  private getAgenciesForNetworkCountry() {
    this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyCountryMap => {
        this.agencyCountryMap = agencyCountryMap;
        this.participatedAgencies = [];
        this.agencyCountryMap.forEach((v, k) => {
          this.agencyService.getAgencyModel(k)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agency => this.participatedAgencies.push(agency));
        })
      })
  }

  selectParticipatingAgency(agencyId, isSelected) {
    this.agencySelectionMap.set(agencyId, isSelected);
    this.partnerOrganisations = [];
    this.getPartners();
  }

  openInitialSection(id) {
    if (!this.didOpenInitialSection) {
      jQuery(id).trigger('click');
      this.didOpenInitialSection = true;
    }
  }

  goBack() {
    this.isViewing ?
      this.router.navigate(this.networkCountryId && this.networkCountryId != "undefined" ? ['/network-country/network-plans', this.storageService.get(Constants.NETWORK_VIEW_VALUES)] : ['/network/local-network-plans', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
      :
      this.router.navigateByUrl(this.isLocalNetworkAdmin ? 'network/local-network-plans' : 'network-country/network-plans');
  }

  closeModalAndNavigate() {
    jQuery("#navigate-back").modal("hide");
    this.router.navigateByUrl('network-country/network-plans');
  }

  checkAllSections() {
    this.checkSection0();
    this.checkSection1();
    this.checkSection2();
    this.checkSection3();
    this.checkSection4();
    this.checkSection5();
    this.checkSection6();
    this.checkSection7();
    this.checkSection8();
    this.checkSection9();
    this.checkSection10();
  }

  private handleContinueSave() {
    if (this.forEditing && this.idOfResponsePlanToEdit) {
      console.log("editing mode");
    } else {
      console.log("create new mode");
    }
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
    } else {
      this.sectionsCompleted.forEach((v,) => {
        if (v) {
          counter++;
        }
      });
    }
    //because agency selection section is a must, so here we always return +1
    return counter + 1;
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

  private checkSectorInfo() {
    let checkValue = true;

    this.activityMap.forEach((value, key) => {
      value.forEach(obj => {
        if ((!obj.hasFurtherBeneficiary && (!obj.indicator || !obj.name || !obj.output ||
          !obj.beneficiary[0].value || !obj.beneficiary[1].value || !obj.beneficiary[2].value ||
          !obj.beneficiary[3].value || !obj.beneficiary[4].value || !obj.beneficiary[5].value)) ||
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

        if (obj.hasDisability && obj.hasFurtherBeneficiary && (!obj.disability[0].value || !obj.disability[1].value || !obj.disability[2].value ||
          !obj.disability[3].value || !obj.disability[4].value || !obj.disability[5].value) && (!obj.furtherDisability[0].value || !obj.furtherDisability[1].value || !obj.furtherDisability[2].value || !obj.furtherDisability[3].value ||
          !obj.furtherDisability[4].value || !obj.furtherDisability[5].value || !obj.furtherDisability[6].value || !obj.furtherDisability[7].value ||
          !obj.furtherDisability[8].value || !obj.furtherDisability[9].value || !obj.furtherDisability[10].value || !obj.furtherDisability[11].value ||
          !obj.furtherDisability[12].value || !obj.furtherDisability[13].value || !obj.furtherDisability[14].value || !obj.furtherDisability[15].value)) {
          checkValue = false;
        }
      });
    });
    return checkValue;
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

  /**
   * submit
   */
  onSubmit(section) {
    if (section == 0) {
      this.section0();
    } else if (section == 1) {
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
    if (!this.forEditing && this.isViewing && this.agencyId && this.countryId) {
      this.newResponsePlan.createdByAgencyId = this.agencyId;
      this.newResponsePlan.createdByCountryId = this.countryId;
    }

    this.saveToFirebase(this.newResponsePlan);
  }

  private saveToFirebase(newResponsePlan: ResponsePlan) {
    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};
    let id = (this.isLocalNetworkAdmin || !this.networkCountryId || this.networkCountryId == "undefined") ? this.networkId : this.networkCountryId;

    if (newResponsePlan.status == 0 && !this.idOfResponsePlanToEdit) {
      newResponsePlan['timeTracking'] = {}
      newResponsePlan['timeTracking']['timeSpentInAmber'] = [newTimeObject]
    }

    this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + id + "/" + this.idOfResponsePlanToEdit)
      .take(1)
      .subscribe(plan => {
        if (plan.timeTracking) {
          if ((newResponsePlan.status == ApprovalStatus.InProgress || newResponsePlan.status == ApprovalStatus.WaitingApproval) && this.idOfResponsePlanToEdit) {
            // Change from Green to Amber
            if (plan['timeTracking']['timeSpentInGreen'] && plan['timeTracking']['timeSpentInGreen'].findIndex(x => x.finish == -1) != -1) {
              let index = plan['timeTracking']['timeSpentInGreen'].findIndex(x => x.finish == -1);
              plan['timeTracking']['timeSpentInGreen'][index].finish = currentTime
              plan['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              newResponsePlan['timeTracking'] = plan['timeTracking']
            }
            // Change from Red to Amber
            if (plan['timeTracking']['timeSpentInRed'] && plan['timeTracking']['timeSpentInRed'].findIndex(x => x.finish == -1) != -1) {
              let index = plan['timeTracking']['timeSpentInRed'].findIndex(x => x.finish == -1);
              plan['timeTracking']['timeSpentInRed'][index].finish = currentTime
              plan['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              newResponsePlan['timeTracking'] = plan['timeTracking']
            }
          }
        }
      })

    let numOfSectionsCompleted: number = 0;

    this.sectionsCompleted.forEach((v,) => {
      if (v) {
        numOfSectionsCompleted++;
      }
    });

    if (numOfSectionsCompleted > 0) {
      if (this.forEditing) {
        newResponsePlan.isEditing = false;
        newResponsePlan.editingUserId = null;

        this.networkService.updateNetworkFieldByObject('/responsePlan/' + id + '/' + this.idOfResponsePlanToEdit, newResponsePlan).then(() => {
          console.log("Response plan successfully updated");
          //if edit, delete approval data and any validation token
          let resetData = {};
          resetData["/responsePlan/" + id + "/" + this.idOfResponsePlanToEdit + "/approval"] = null;
          resetData["/responsePlanValidation/" + this.idOfResponsePlanToEdit] = null;
          this.networkService.updateNetworkField(resetData).then(() => {
          }, error => {
            console.log(error.message);
          });
        }).catch(error => {
          console.log("Response plan creation unsuccessful with error --> " + error.message);
        });
      } else {
        //Make sure we aren't creating new node on autosave
        if (this.idOfResponsePlanToEdit) {
          let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + "/" + this.idOfResponsePlanToEdit;
          this.af.database.object(responsePlansPath)
            .update(newResponsePlan)
            .then(() => {
              console.log('update');
            }).catch(error => {
            console.log("Response plan creation unsuccessful with error --> " + error.message);
          });
        } else {
          let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id;
          this.af.database.list(responsePlansPath)
            .push(newResponsePlan)
            .then(plan => {
              // set variable in here
              this.idOfResponsePlanToEdit = plan.path.pieces_[3];
              console.log('push');
            }).catch(error => {
            console.log("Response plan creation unsuccessful with error --> " + error.message);
          });
        }
      }
    } else {
      this.alertMessage = new AlertMessageModel("RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.NO_COMPLETED_SECTIONS");
    }
  }

  /**
   * Section 0/10
   */
  continueButtonPressedOnSection0() {
    if (!this.checkSection0()) {
      this.alertMessage = new AlertMessageModel("Non participating agency was selected!");
    } else {
      this.handleContinueSave();
      this.onSubmit(0);
    }
  }

  section0() {
    let agencyIdObj = CommonUtils.convertMapToObjectOnlyWithTrueValue(this.agencySelectionMap);
    this.newResponsePlan.participatingAgencies = CommonUtils.updateObjectByMap(agencyIdObj, this.agencyCountryMap);
  }

  /**
   * Section 1/10
   */
  section1() {
    this.newResponsePlan.name = this.planName;
    this.newResponsePlan.location = this.geographicalLocation;
    if (this.agencySelected) {
      this.newResponsePlan.planLead = this.agencySelected;
    }
    if (this.hazardScenarioSelected) {
      this.newResponsePlan.hazardScenario = this.hazardScenarioSelected;
    }
  }

  continueButtonPressedOnSection1() {
    this.checkSection1();
    this.handleContinueSave();
    this.onSubmit(1);
  }

  private checkSection1() {
    if (this.planName != '' && this.geographicalLocation != '' && this.hazardScenarioSelected != null && this.agencySelected && this.agencySelected != '') {
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
    this.newResponsePlan.scenarioCrisisList = CommonUtils.convertObjectToList(this.scenarioCrisisObject);
    this.newResponsePlan.impactOfCrisisList = CommonUtils.convertObjectToList(this.impactOfCrisisObject);
    this.newResponsePlan.availabilityOfFundsList = CommonUtils.convertObjectToList(this.availabilityOfFundsObject);
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
    this.checkSection2();
    this.handleContinueSave();
    this.onSubmit(2);
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
    this.newResponsePlan.sectorsRelatedTo = this.sectorsRelatedTo;
    this.newResponsePlan.otherRelatedSector = this.otherRelatedSector;
    this.newResponsePlan.presenceInTheCountry = this.presenceInTheCountry ? this.presenceInTheCountry : -1;

    if (this.isDirectlyThroughFieldStaff) {
      this.newResponsePlan.methodOfImplementation = MethodOfImplementation.fieldStaff;
      this.newResponsePlan.partnerOrganisations = null;
    } else {
      if (Object.keys(this.partnerOrganisationsSelected).length != 0) {
        this.isWorkingWithPartners ? this.newResponsePlan.methodOfImplementation = MethodOfImplementation.withPartner : this.newResponsePlan.methodOfImplementation = MethodOfImplementation.both;
        this.newResponsePlan.partnerOrganisations = CommonUtils.convertObjectToList(this.partnerOrganisationsSelected);
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
    this.isWorkingWithPartners = false;
    this.isWorkingWithStaffAndPartners = false;
  }

  methodOfImplementationSelectedWithPartners() {
    this.isWorkingWithPartners = true;
    this.isDirectlyThroughFieldStaff = false;
    this.isWorkingWithStaffAndPartners = false;
  }

  methodOfImplementationSelectedBoth() {
      this.isWorkingWithStaffAndPartners = true;
      this.isDirectlyThroughFieldStaff = false;
      this.isWorkingWithPartners = false;
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
      this.router.navigate(['/response-plans/add-partner-organisation', {fromResponsePlans: true}]).then();
    } else {
      this.partnerOrganisationsSelected[dropDown] = partnerOrganisationSelected;
    }
  }

  continueButtonPressedOnSection3() {
    this.checkSection3();
    this.handleContinueSave();
    this.onSubmit(3);
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
    this.newResponsePlan.activitySummary["q1"] = this.proposedResponseText;
    this.newResponsePlan.activitySummary["q2"] = this.progressOfActivitiesPlanText;
    this.newResponsePlan.activitySummary["q3"] = this.coordinationPlanText;
  }

  continueButtonPressedOnSection4() {
    this.checkSection4();
    this.handleContinueSave();
    this.onSubmit(4);
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
    if (this.numOfPeoplePerHouseHold) {
      this.newResponsePlan.peoplePerHousehold = this.numOfPeoplePerHouseHold;
    }
    if (this.numOfHouseholds) {
      this.newResponsePlan.numOfHouseholds = this.numOfHouseholds;
    }
    this.newResponsePlan.beneficiariesNote = this.howBeneficiariesCalculatedText ? this.howBeneficiariesCalculatedText : '';
    this.newResponsePlan.vulnerableGroups = this.selectedVulnerableGroups;
    this.newResponsePlan.otherVulnerableGroup = this.otherGroup ? this.otherGroup : '';
    this.newResponsePlan.targetPopulationInvolvementList = CommonUtils.convertObjectToList(this.targetPopulationInvolvementObject);
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
    this.onSubmit(5);
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
    this.newResponsePlan.riskManagementPlan = this.riskManagementPlanText;
  }

  continueButtonPressedOnSection6() {
    this.checkSection6();
    this.handleContinueSave();
    this.onSubmit(6);
  }

  private checkSection6() {
    if (this.riskManagementPlanText != '') {
      this.section6Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[5], true);
    } else {
      this.section6Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[5], false);
    }
  }

  section7() {
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
    } else {
      this.activityError[sector] = [];
      this.activityError[sector][index] = error.message;
    }
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
    this.onSubmit(7)
  }

  private checkSection7() {
    let numOfActivities: number = this.activityMap.size;
    if (numOfActivities != 0 && this.checkSectorInfo()) {
      this.section7Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[6], true);
      this.doublerCounting();
      this.section9();
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
    this.onSubmit(8);
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
    this.newResponsePlan.doubleCounting = doubleCounting;
  }

  continueButtonPressedOnSection9() {
    this.doublerCounting();
    this.checkSection9();
    this.handleContinueSave();
    this.onSubmit(9);
  }

  private checkSection9() {
    this.doublerCounting()
    if (this.isDoubleCountingDone) {
      this.section9Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[8], true);
    } else {
      this.section9Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[8], false);
    }
  }

  doublerCounting() {
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

    modelPlanList.forEach(modelPlan => {
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

      } else {
        modelPlan.furtherBeneficiary.forEach(item => {
          if (item["age"] < 3 && item["gender"] == Gender.feMale) {
            this.numberFemaleLessThan18 += Number(item["value"]);
          } else if (item["age"] == 3 && item["gender"] == Gender.feMale) {
            this.numberFemale18To50 += Number(item["value"]);
          } else if (item["age"] > 3 && item["gender"] == Gender.feMale) {
            this.numberFemalegreaterThan50 += Number(item["value"]);
          } else if (item["age"] < 3 && item["gender"] == Gender.male) {
            this.numberMaleLessThan18 += Number(item["value"]);
          } else if (item["age"] == 3 && item["gender"] == Gender.male) {
            this.numberMale18To50 += Number(item["value"]);
          } else if (item["age"] > 3 && item["gender"] == Gender.male) {
            this.numberMalegreaterThan50 += Number(item["value"]);
          }
        })
      }
    });

    if (!(this.forEditing && this.isDoubleCountingDone)) {
      this.adjustedFemaleLessThan18 = Number(this.numberFemaleLessThan18);
      this.adjustedFemale18To50 = Number(this.numberFemale18To50);
      this.adjustedFemalegreaterThan50 = Number(this.numberFemalegreaterThan50);
      this.adjustedMaleLessThan18 = Number(this.numberMaleLessThan18);
      this.adjustedMale18To50 = Number(this.numberMale18To50);
      this.adjustedMalegreaterThan50 = Number(this.numberMalegreaterThan50);
    }
    this.isDoubleCountingDone = true;
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
      this.newResponsePlan.budget["itemsOver1000Exists"] = false;
    }

    this.newResponsePlan.budget["totalInputs"] = this.totalInputs;
    this.newResponsePlan.budget["totalOfAllCosts"] = this.totalOfAllCosts;
    this.newResponsePlan.budget["total"] = this.totalBudget;
  }

  calculateBudget(sector, budget, isSector) {
    if (isSector) {
      if (budget < 0) {
        console.log("Budget can not be under 0!!");
        return;
      }
      this.sectorBudget.set(Number(sector), budget);
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
    this.onSubmit(10);
  }

  private checkSection10() {
    if (this.transportBudget != null && this.securityBudget != null && this.logisticsAndOverheadsBudget != null &&
      this.staffingAndSupportBudget != null && this.monitoringAndEvolutionBudget != null &&
      this.capitalItemsBudget != null && this.managementSupportPercentage != null) {
      this.section10Status = "GLOBAL.COMPLETE";
      this.sectionsCompleted.set(this.sections[9], true);
    } else {
      this.section10Status = "GLOBAL.INCOMPLETE";
      this.sectionsCompleted.set(this.sections[9], false);
    }
  }

  private checkSection0(): boolean {
    let temp = false;
    this.agencySelectionMap.forEach((v,) => {
      if (v) {
        temp = v;
        this.section0Status = "GLOBAL.COMPLETE";
      } else {
        this.section0Status = "GLOBAL.INCOMPLETE";
      }
    });
    return temp;
  }

  /**
   * load response plan back
   */
  private loadSection0(responsePlan: ResponsePlan) {
    let agencyIds = Object.keys(responsePlan.participatingAgencies);
    agencyIds.forEach(id => this.agencySelectionMap.set(id, true));
    this.getPartners();
  }

  private loadSection1(responsePlan: ResponsePlan) {
    this.planName = responsePlan.name;
    this.geographicalLocation = responsePlan.location;
    this.hazardScenarioSelected = responsePlan.hazardScenario;
    this.agencySelected = responsePlan.planLead;
  }

  private loadSection2(responsePlan: ResponsePlan) {
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
    this.proposedResponseText = responsePlan.activitySummary['q1'];
    this.progressOfActivitiesPlanText = responsePlan.activitySummary['q2'];
    this.coordinationPlanText = responsePlan.activitySummary['q3'];
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
    this.mALSystemsDescriptionText = responsePlan.monAccLearning['mALSystemsDescription'];
    this.intentToVisuallyDocument = responsePlan.monAccLearning['isMedia'];
    this.mediaFormat = responsePlan.monAccLearning['mediaFormat'];
  }

  private loadSection9(responsePlan: ResponsePlan) {
    if (typeof responsePlan.doubleCounting !== "undefined") {
      if (Object.keys(responsePlan.doubleCounting).length > 0) {
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
      this.staffingAndSupportBudget + this.monitoringAndEvolutionBudget + this.capitalItemsBudget;

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

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
}
