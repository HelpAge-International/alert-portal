import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {PageControlService} from "../services/pagecontrol.service";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../model/responsePlan";
import {UserService} from "../services/user.service";
import {Constants} from "../utils/Constants";
import {
  BudgetCategory,
  MediaFormat,
  MethodOfImplementation, NetworkUserAccountType,
  PresenceInTheCountry,
  ResponsePlanSectors,
  SourcePlan,
  UserType
} from "../utils/Enums";
import {ModelPlanActivity} from "../model/plan-activity.model";
import {NetworkService} from "../services/network.service";
import {LocalStorageService} from "angular-2-local-storage";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-export-proposal',
  templateUrl: './export-proposal.component.html',
  styleUrls: ['./export-proposal.component.css']
})

export class ExportProposalComponent implements OnInit, OnDestroy {

  private SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private ResponsePlanSectors = ResponsePlanSectors;
  private responsePlan: ResponsePlan = new ResponsePlan;
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private planLeadName: string = '';
  private planLeadEmail: string = '';
  private planLeadPhone: string = '';
  private planLeadPosition: string = '';
  private memberAgencyName: string = '';
  private sectorsRelatedToMap = new Map<number, boolean>();
  private PresenceInTheCountry = PresenceInTheCountry;
  private MethodOfImplementation = MethodOfImplementation;
  private MediaFormat = MediaFormat;
  private partnersList: string[] = [];
  private sourcePlanId: number;
  private sourcePlanInfo1: string;
  private sourcePlanInfo2: string;
  private SourcePlan = SourcePlan;
  private groups: any[] = [];
  private vulnerableGroupsToShow = [];
  private userPath: string;
  private systemAdminUid: string;
  private isExcel: number;
  private docType: string;
  private totalInputs: number;
  private totalOfAllCosts: number;
  private total: number;
  private inputWaSHBudget: number = 0;
  private inputWaSHNarrative: string;
  private inputHealthBudget: number = 0;
  private inputHealthNarrative: string;
  private inputShelterBudget: number = 0;
  private inputShelterNarrative: string;
  private inputNutritionBudget: number = 0;
  private inputNutritionNarrative: string;
  private inputCampBudget: number = 0;
  private inputCampNarrative: string;
  private inputProtectionBudget: number = 0;
  private inputProtectionNarrative: string;
  private inputEduBudget: number = 0;
  private inputEduNarrative: string;
  private inputFoodSecBudget: number = 0;
  private inputFoodSecNarrative: string;
  private inputOtherBudget: number = 0;
  private inputOtherNarrative: string;
  private transportBudget: number;
  private transportNarrative: string;
  private securityBudget: number;
  private securityNarrative: string;
  private logisticsAndOverheadsBudget: number;
  private logisticsAndOverheadsNarrative: string;
  private staffingAndSupportBudget: number;
  private staffingAndSupportNarrative: string;
  private monitoringAndEvolutionBudget: number;
  private monitoringAndEvolutionNarrative: string;
  private capitalItemsBudget: number;
  private capitalItemsNarrative: string;
  private managementSupportNarrative: string;
  private activityMap = new Map();
  private sectors: any[];
  private totalFemaleUnder18: number;
  private totalFemale18To50: number;
  private totalFemaleOver50: number;
  private totalMaleUnder18: number;
  private totalMale18To50: number;
  private totalMaleOver50: number;

  private agencyId: string
  private networkCountryId: string;
  private isLocalNetworkAdmin: boolean;
  private isViewing: boolean;
  public isLocalAgency: boolean;
  private networkViewValues: {};

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private userService: UserService,
              private networkService: NetworkService,
              private storageService: LocalStorageService,
              private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['isLocalAgency']) {
        this.isLocalAgency = true;
        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemAdminId) => {
          this.uid = user.uid;
          this.userPath = Constants.USER_PATHS[userType];
          this.agencyId = agencyId
          this.downloadDataLocalAgency();
        });
      } else {
        this.isLocalAgency = false;
        if (params["isLocalNetworkAdmin"]) {
          this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
        }
        if (params["excel"]) {
          this.isExcel = params["excel"];
          if (this.isExcel == 1) {
            this.docType = "Excel";
          } else {
            this.docType = "Word";
          }
        }
        if (params["id"] && params["networkCountryId"]) {
          this.responsePlanId = params["id"];
          this.networkCountryId = params["networkCountryId"];
          if (params["isViewing"]) {
            this.isViewing = params["isViewing"]
            this.uid = params["uid"]
            this.systemAdminUid = params["systemId"]
            this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
            this.downloadResponsePlanData();
            this.downloadAgencyData(null);
          } else {
            this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
              this.uid = user.uid;
              this.downloadResponsePlanData();
              this.downloadAgencyData(null);
            });
          }
        } else {
          this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
            this.uid = user.uid;
            this.userPath = Constants.USER_PATHS[userType];
            this.downloadData();
          });
        }
      }
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Private Functions
   */

  private downloadData() {
    this.userService.getUserType(this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(usertype => {
        this.USER_TYPE = Constants.USER_PATHS[usertype];
        if (usertype == UserType.GlobalDirector) {
          this.route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe((params: Params) => {
              if (params["countryId"]) {
                this.countryId = params["countryId"];
                this.downloadResponsePlanData();
                this.downloadAgencyData(usertype);
              }
            })
        } else {
          this.getCountryId().then(() => {
            this.downloadResponsePlanData();
            this.downloadAgencyData(usertype);
          });
        }
      });
  }

  private downloadDataLocalAgency() {

    this.downloadResponsePlanDataLocalAgency();
    this.downloadAgencyDataLocalAgency();

  }

  private downloadResponsePlanData() {
    if (!this.responsePlanId) {
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.responsePlanId = params["id"];
          }
        });
    }
    let id = this.networkCountryId ? this.networkCountryId : this.countryId;
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + '/' + this.responsePlanId;
    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlan = responsePlan;
        console.log(responsePlan);
        this.configGroups(responsePlan);

        if (responsePlan.sectorsRelatedTo) {
          responsePlan.sectorsRelatedTo.forEach(sector => {
            this.sectorsRelatedToMap.set(sector, true);
          });
        }

        this.bindProjectLeadData(responsePlan);
        this.bindPartnersData(responsePlan);
        this.bindSourcePlanData(responsePlan);
        this.bindProjectActivitiesData(responsePlan);
        this.bindProjectBudgetData(responsePlan);
      });
  }

  private downloadResponsePlanDataLocalAgency() {
    if (!this.responsePlanId) {
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.responsePlanId = params["id"];
          }
        });
    }
    let id = this.agencyId;
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + '/' + this.responsePlanId;
    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlan = responsePlan;
        console.log(responsePlan);
        this.configGroups(responsePlan);

        if (responsePlan.sectorsRelatedTo) {
          responsePlan.sectorsRelatedTo.forEach(sector => {
            this.sectorsRelatedToMap.set(sector, true);
          });
        }

        this.bindProjectLeadDataLocalAgency(responsePlan);
        this.bindPartnersData(responsePlan);
        this.bindSourcePlanData(responsePlan);
        this.bindProjectActivitiesData(responsePlan);
        this.bindProjectBudgetData(responsePlan);
      });
  }

  private downloadAgencyData(userType) {
    const normalUser = () => {
      this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyId) => {
          this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + "/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
            if (name != null) {
              this.memberAgencyName = name.$value;
            }
          });
        });
    };

    const networkUser = () => {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.responsePlan.planLead + "/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
        if (name != null) {
          this.memberAgencyName = name.$value;
        }
      });
    };
    this.networkCountryId ? networkUser() : normalUser();
  }

  private downloadAgencyDataLocalAgency() {

    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
      if (name != null) {
        this.memberAgencyName = name.$value;
      }
    });

  }

  private bindProjectLeadData(responsePlan: ResponsePlan) {
    if (responsePlan.planLead) {
      this.userService.getUser(responsePlan.planLead)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          console.log(user);
          this.planLeadName = user.firstName + " " + user.lastName;
          this.planLeadEmail = user.email;
          this.planLeadPhone = user.phone;

          this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryId + "/" + user.id + "/position").takeUntil(this.ngUnsubscribe).subscribe(position => {
            if (position != null) {
              this.planLeadPosition = position.$value;
            }
          });
        });
    }
  }

  private bindProjectLeadDataLocalAgency(responsePlan: ResponsePlan) {
    if (responsePlan.planLead) {
      this.userService.getUser(responsePlan.planLead)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          console.log(user);
          this.planLeadName = user.firstName + " " + user.lastName;
          this.planLeadEmail = user.email;
          this.planLeadPhone = user.phone;

          this.af.database.object(Constants.APP_STATUS + "/staff/" + this.agencyId + "/" + user.id + "/position").takeUntil(this.ngUnsubscribe).subscribe(position => {
            if (position != null) {
              this.planLeadPosition = position.$value;
            }
          });
        });
    }
  }

  private bindPartnersData(responsePlan: ResponsePlan) {
    this.partnersList = [];

    if (responsePlan.partnerOrganisations) {
      let partnerIds = Object.keys(responsePlan.partnerOrganisations).map(key => responsePlan.partnerOrganisations[key]);
      partnerIds.forEach(id => {
        this.userService.getOrganisationName(id)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(organisation => {
            if (organisation.organisationName) {
              this.partnersList.push(organisation.organisationName);
            }
          })
      });
    }
  }

  private bindSourcePlanData(responsePlan: ResponsePlan) {
    if (responsePlan.sectors) {
      Object.keys(responsePlan.sectors).forEach(sectorKey => {
        this.sourcePlanId = responsePlan.sectors[sectorKey]["sourcePlan"];
        this.sourcePlanInfo1 = responsePlan.sectors[sectorKey]["bullet1"];
        this.sourcePlanInfo2 = responsePlan.sectors[sectorKey]["bullet2"];
      });
    }
  }

  private configGroups(responsePlan: ResponsePlan) {
    const normalUser = () => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.userPath + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((systemAdminIds) => {
          this.systemAdminUid = systemAdminIds[0].$key;
          this.downloadGroups(responsePlan);
        });
    };
    const networkUser = () => {
      if (this.systemAdminUid) {
        this.downloadGroups(responsePlan);
      } else {
        let networkUserType = this.isLocalNetworkAdmin ? NetworkUserAccountType.NetworkAdmin : NetworkUserAccountType.NetworkCountryAdmin;
        this.networkService.getSystemIdForNetwork(this.uid, networkUserType)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(systemId => {
            this.systemAdminUid = systemId;
            this.downloadGroups(responsePlan);
          });
      }
    };
    this.networkCountryId ? networkUser() : normalUser();
  }

  private bindProjectBudgetData(responsePlan: ResponsePlan) {
    if (responsePlan.budget) {
      this.totalInputs = responsePlan.budget['totalInputs'] ? responsePlan.budget['totalInputs'] : 0;
      this.totalOfAllCosts = responsePlan.budget['totalOfAllCosts'] ? responsePlan.budget['totalOfAllCosts'] : 0;
      this.total = responsePlan.budget['total'] ? responsePlan.budget['total'] : 0;

      if (responsePlan.budget['item']) {
        if (isNullOrUndefined(responsePlan.budget['item'][BudgetCategory.Inputs]) == false) {
          this.inputWaSHBudget = responsePlan.budget['item'][BudgetCategory.Inputs][0] ? responsePlan.budget['item'][BudgetCategory.Inputs][0]['budget'] : 0;
          this.inputWaSHNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][0] ? responsePlan.budget['item'][BudgetCategory.Inputs][0]['narrative'] : '';
          this.inputHealthBudget = responsePlan.budget['item'][BudgetCategory.Inputs][1] ? responsePlan.budget['item'][BudgetCategory.Inputs][1]['budget'] : 0;
          this.inputHealthNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][1] ? responsePlan.budget['item'][BudgetCategory.Inputs][1]['narrative'] : '';
          this.inputShelterBudget = responsePlan.budget['item'][BudgetCategory.Inputs][2] ? responsePlan.budget['item'][BudgetCategory.Inputs][2]['budget'] : 0;
          this.inputShelterNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][2] ? responsePlan.budget['item'][BudgetCategory.Inputs][2]['narrative'] : '';
          this.inputNutritionBudget = responsePlan.budget['item'][BudgetCategory.Inputs][3] ? responsePlan.budget['item'][BudgetCategory.Inputs][3]['budget'] : 0;
          this.inputNutritionNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][3] ? responsePlan.budget['item'][BudgetCategory.Inputs][3]['narrative'] : '';
          this.inputCampBudget = responsePlan.budget['item'][BudgetCategory.Inputs][7] ? responsePlan.budget['item'][BudgetCategory.Inputs][7]['budget'] : 0;
          this.inputCampNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][7] ? responsePlan.budget['item'][BudgetCategory.Inputs][7]['narrative'] : '';
          this.inputProtectionBudget = responsePlan.budget['item'][BudgetCategory.Inputs][5] ? responsePlan.budget['item'][BudgetCategory.Inputs][5]['budget'] : 0;
          this.inputProtectionNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][5] ? responsePlan.budget['item'][BudgetCategory.Inputs][5]['narrative'] : '';
          this.inputEduBudget = responsePlan.budget['item'][BudgetCategory.Inputs][6] ? responsePlan.budget['item'][BudgetCategory.Inputs][6]['budget'] : 0;
          this.inputEduNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][6] ? responsePlan.budget['item'][BudgetCategory.Inputs][6]['narrative'] : '';
          this.inputFoodSecBudget = responsePlan.budget['item'][BudgetCategory.Inputs][4] ? responsePlan.budget['item'][BudgetCategory.Inputs][4]['budget'] : 0;
          this.inputFoodSecNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][4] ? responsePlan.budget['item'][BudgetCategory.Inputs][4]['narrative'] : '';
          this.inputOtherBudget = responsePlan.budget['item'][BudgetCategory.Inputs][8] ? responsePlan.budget['item'][BudgetCategory.Inputs][8]['budget'] : 0;
          this.inputOtherNarrative = responsePlan.budget['item'][BudgetCategory.Inputs][8] ? responsePlan.budget['item'][BudgetCategory.Inputs][8]['narrative'] : '';
        }
        this.transportBudget = responsePlan.budget['item'][BudgetCategory.Transport] ? responsePlan.budget['item'][BudgetCategory.Transport]['budget'] : 0;
        this.transportNarrative = responsePlan.budget['item'][BudgetCategory.Transport] ? responsePlan.budget['item'][BudgetCategory.Transport]['narrative'] : '';

        this.securityBudget = responsePlan.budget['item'][BudgetCategory.Security] ? responsePlan.budget['item'][BudgetCategory.Security]['budget'] : 0;
        this.securityNarrative = responsePlan.budget['item'][BudgetCategory.Security] ? responsePlan.budget['item'][BudgetCategory.Security]['narrative'] : '';

        this.logisticsAndOverheadsBudget = responsePlan.budget['item'][BudgetCategory.Logistics] ? responsePlan.budget['item'][BudgetCategory.Logistics]['budget'] : 0;
        this.logisticsAndOverheadsNarrative = responsePlan.budget['item'][BudgetCategory.Logistics] ? responsePlan.budget['item'][BudgetCategory.Logistics]['narrative'] : '';

        this.staffingAndSupportBudget = responsePlan.budget['item'][BudgetCategory.Staffing] ? responsePlan.budget['item'][BudgetCategory.Staffing]['budget'] : 0;
        this.staffingAndSupportNarrative = responsePlan.budget['item'][BudgetCategory.Staffing] ? responsePlan.budget['item'][BudgetCategory.Staffing]['narrative'] : '';

        this.monitoringAndEvolutionBudget = responsePlan.budget['item'][BudgetCategory.Monitoring] ? responsePlan.budget['item'][BudgetCategory.Monitoring]['budget'] : 0;
        this.monitoringAndEvolutionNarrative = responsePlan.budget['item'][BudgetCategory.Monitoring] ? responsePlan.budget['item'][BudgetCategory.Monitoring]['narrative'] : '';

        this.capitalItemsBudget = responsePlan.budget['item'][BudgetCategory.CapitalItems] ? responsePlan.budget['item'][BudgetCategory.CapitalItems]['budget'] : 0;
        this.capitalItemsNarrative = responsePlan.budget['item'][BudgetCategory.CapitalItems] ? responsePlan.budget['item'][BudgetCategory.CapitalItems]['narrative'] : '';

        this.managementSupportNarrative = responsePlan.budget['item'][BudgetCategory.ManagementSupport] ? responsePlan.budget['item'][BudgetCategory.ManagementSupport]['narrative'] : '';
      }
    }
  }


  private bindProjectActivitiesData(responsePlan: ResponsePlan) {
    if (responsePlan.sectors) {
      this.sectors = Object.keys(responsePlan.sectors).map(key => {
        let sector = responsePlan.sectors[key];
        sector["id"] = Number(key);
        return sector;
      });
    }

    if (this.sectors) {
      Object.keys(responsePlan.sectors).forEach(sectorKey => {

        let activitiesData: {} = responsePlan.sectors[sectorKey]["activities"];
        if (activitiesData) {
          let moreData: {}[] = [];
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
              activitiesData[key]["hasFurtherBeneficiary"] && activitiesData[key]["hasDisability"] ? activitiesData[key]["furtherDisability"] : null)

            moreData.push(model);
            this.activityMap.set(Number(sectorKey), moreData);
          });
        }
      });

      if (this.activityMap) {
        this.totalFemaleUnder18 = this.getTotalFemaleUnder18(this.activityMap);
        this.totalFemale18To50 = this.getTotalFemaleUnder18To50(this.activityMap);
        this.totalFemaleOver50 = this.getTotalFemaleOver50(this.activityMap);

        this.totalMaleUnder18 = this.getTotalMaleUnder18(this.activityMap);
        this.totalMale18To50 = this.getTotalMaleUnder18To50(this.activityMap);
        this.totalMaleOver50 = this.getTotalMaleOver50(this.activityMap);
      }
    }
  }

  /**
   * Utility Functions
   */

  private getTotalFemaleUnder18(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[0] ? Number(activity.beneficiary[0]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private getTotalFemaleUnder18To50(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[1] ? Number(activity.beneficiary[1]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private getTotalFemaleOver50(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[2] ? Number(activity.beneficiary[2]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private getTotalMaleUnder18(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[3] ? Number(activity.beneficiary[3]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private getTotalMaleUnder18To50(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[4] ? Number(activity.beneficiary[4]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private getTotalMaleOver50(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[5] ? Number(activity.beneficiary[5]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private getOverallFemaleTotal(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[0] ? Number(activity.beneficiary[0]["value"]) : 0)
            + (activity.beneficiary && activity.beneficiary[1] ? Number(activity.beneficiary[1]["value"]) : 0)
            + (activity.beneficiary && activity.beneficiary[2] ? Number(activity.beneficiary[2]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private getOverallMaleTotal(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          total += (activity.beneficiary && activity.beneficiary[3] ? Number(activity.beneficiary[3]["value"]) : 0)
            + (activity.beneficiary && activity.beneficiary[4] ? Number(activity.beneficiary[4]["value"]) : 0)
            + (activity.beneficiary && activity.beneficiary[5] ? Number(activity.beneficiary[5]["value"]) : 0);
        });
      }
    });

    return total;
  }

  private downloadGroups(responsePlan: ResponsePlan) {
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
          console.log(this.groups);

          var vulnerableGroups = [];
          if (this.groups && responsePlan.vulnerableGroups) {
            this.groups.forEach(originalGroup => {
              responsePlan.vulnerableGroups.forEach(resGroupKey => {
                if (originalGroup.$key == resGroupKey) {
                  vulnerableGroups.push(originalGroup);
                }
              });
            });
          }
          this.vulnerableGroupsToShow = vulnerableGroups;
        });
    }
  }

  private getCountryId() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryId: any) => {
          this.countryId = countryId.$value;
          res(true);
        });
    });
    return promise;
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
