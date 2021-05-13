
import {takeUntil} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {
  AgeRange,
  BudgetCategory,
  Currency,
  Gender,
  MethodOfImplementation,
  PresenceInTheCountry,
  SourcePlan,
  UserType
} from "../../utils/Enums";
import {ModelPlanActivity} from "../../model/plan-activity.model";
import {PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
import * as firebase from "firebase";
import {NetworkService} from "../../services/network.service";
import {AgencyService} from "../../services/agency-service.service";
import { SettingsService } from "../../services/settings.service";


declare var jQuery: any;

@Component({
  selector: 'app-view-response-plan',
  templateUrl: 'view-response-plan.component.html',
  styleUrls: ['view-response-plan.component.css']
})

export class ViewResponsePlanComponent implements OnInit, OnDestroy {


  private SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  private PresenceInTheCountry = PresenceInTheCountry;
  private MethodOfImplementation = MethodOfImplementation;
  private PresenceInCountry = Constants.RESPONSE_PLAN_COUNTRY_PRESENCE;
  private PlanMethod = Constants.RESPONSE_PLAN_METHOD;
  private Gender = Gender;
  private AgeRange = AgeRange;
  private SourcePlan = SourcePlan;

  private imgNames: string[] = ["water", "health", "shelter", "nutrition", "food", "protection", "education", "camp", "misc"];

  // private USER_TYPE: string;

  private uid: string;
  private countryId: string;
  private networkCountryId: string;
  private agencyId: string;
  private isViewing: boolean;

  @Input() responsePlanId: string;
  @Input() isLocalAgency: boolean;
  // @Input() set _countryId(_countryId: string){
  //   this.countryId = _countryId;
  // }
  // @Input() set _agencyId(_agencyId: string){
  //   this.agencyId = _agencyId;
  // }
  // @Input() set _isViewing(_isViewing: boolean){
  //   this.isViewing = _isViewing;
  // }

  private responsePlanToShow: ResponsePlan = new ResponsePlan;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Section 01
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private planLeadName: string = '';

  // Section 03
  private sectors: any[];
  private partnerList: string[] = [];
  // Section 07

  // Section 08
  private intendToVisuallyDoc: string = '';
  private mediaType: any;

  // Section 10
  private BudgetCategory = BudgetCategory;
  private SectorsList = Constants.RESPONSE_PLANS_SECTORS;
  private totalInputs: number;
  private totalOfAllCosts: number;
  private total: number;
  private transportBudget: number;
  private securityBudget: number;
  private logisticsAndOverheadsBudget: number;
  private staffingAndSupportBudget: number;
  private monitoringAndEvolutionBudget: number;
  private capitalItemsBudget: number;
  private managementSupportPercentage: any;
  private transportNarrative: string;
  private securityNarrative: string;
  private logisticsAndOverheadsNarrative: string;
  private staffingAndSupportNarrative: string;
  private monitoringAndEvolutionNarrative: string;
  private capitalItemsNarrative: string;
  private managementSupportNarrative: string;
  private activityInfoMap = new Map();
  private activityMap = new Map();
  private vulnerableGroupsToShow = [];
  private groups: any[] = [];
  private systemAdminUid: string;
  private userPath: string;

  private accessToken: string;
  private partnerOrganisationId: string;

  private showingSections: number[] = [];

  private isLocalNetworkAdmin: boolean;
  private planLocalNetworkId: string;
  private planNetworkCountryId: string;
  private networkId: string;
  private userType : UserType
  private expiryDate : number;
  private isViewingFromExternal: boolean;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private userService: UserService,
              private networkService: NetworkService,
              private agencyService : AgencyService,
              private countryService : SettingsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    jQuery('#header_section_1').trigger('click');

    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()

  }

  initCountryOffice(){
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.responsePlanId = params["id"];
        }
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["token"]) {
          this.accessToken = params["token"];
        }
        if (params["partnerOrganisationId"]) {
          this.partnerOrganisationId = params["partnerOrganisationId"];
        }
        if (params["networkId"]) {
          this.networkId = params["networkId"];
        }
        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }
        if (params["isLocalNetworkAdmin"]) {
          this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
        }
        if (params["systemId"]) {
          this.systemAdminUid = params["systemId"];
        }

        if (this.accessToken) {
          let invalid = true;

          firebase.auth().signInAnonymously().catch(error => {
            console.log(error.message);
          });

          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              if (user.isAnonymous) {
                //Page accessed by the partner who doesn't have firebase account. Check the access token and grant the access
                this.af.database.object(Constants.APP_STATUS + "/responsePlanValidation/" + this.responsePlanId + "/validationToken")
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((validationToken) => {
                    if (validationToken) {
                      if (this.accessToken === validationToken.token) {
                        let expiry = validationToken.expiry;
                        let currentTime = moment.utc();
                        let tokenExpiryTime = moment.utc(expiry);

                        if (currentTime.isBefore(tokenExpiryTime))
                          invalid = false;
                      }

                      if (invalid) {
                        this.navigateToLogin();
                      }
                      this.showingSections = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                      this.handleLoadResponsePlan();
                    } else {
                      this.navigateToLogin();
                    }
                  });
              }
            }
          });

          if (this.agencyId != null) {
            this.calculateCurrency(this.agencyId);
          }

        } else {

          const normalUser = () => {
            this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
              this.agencyId = agencyId
              this.countryId = countryId
            this.userType = userType
              //get response plan settings from agency
              this.userService.getAgencyDetail(agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(agency => {
                  let sections = agency.responsePlanSettings.sections;
                  this.showingSections = Object.keys(sections).filter(key => sections[key]).map(key => Number(key));
                  console.log(this.showingSections)
                });

              this.uid = user.auth.uid;
              this.userPath = Constants.USER_PATHS[userType];
              if (userType == UserType.PartnerUser) {
                this.agencyId = agencyId;
                this.countryId = countryId;
                this.systemAdminUid = systemId;
                this.handleLoadResponsePlan();
              } else {
                this.loadData(userType);
              }
              this.calculateCurrency(agencyId);
            });
          };

          const networkUser = () => {
            console.log("networkUser")
            this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
              this.uid = user.uid;

              this.showingSections = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
              this.handleLoadResponsePlan();
            });
          };

          this.networkCountryId ? networkUser() : normalUser();
        }

      });
  }

  initLocalAgency(){
    console.log("initLocalAgency")
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.responsePlanId = params["id"];
        }
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["token"]) {
          this.accessToken = params["token"];
        }
        if (params["partnerOrganisationId"]) {
          this.partnerOrganisationId = params["partnerOrganisationId"];
        }
        if (params["systemId"]) {
          this.systemAdminUid = params["systemId"];
        }
        if (params["isViewingFromExternal"]) {
          this.isViewingFromExternal = params["isViewingFromExternal"];
        }
        if (params["networkId"]) {
          this.networkId = params["networkId"];
        }
        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }

        if (this.accessToken) {
          let invalid = true;

          firebase.auth().signInAnonymously().catch(error => {
            console.log(error.message);
          });

          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              if (user.isAnonymous) {
                //Page accessed by the partner who doesn't have firebase account. Check the access token and grant the access
                this.af.database.object(Constants.APP_STATUS + "/responsePlanValidation/" + this.responsePlanId + "/validationToken")
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((validationToken) => {
                    if (validationToken) {
                      if (this.accessToken === validationToken.token) {
                        let expiry = validationToken.expiry;
                        let currentTime = moment.utc();
                        let tokenExpiryTime = moment.utc(expiry);

                        if (currentTime.isBefore(tokenExpiryTime))
                          invalid = false;
                      }

                      if (invalid) {
                        this.navigateToLogin();
                      }
                      this.showingSections = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                      this.handleLoadResponsePlan();
                    } else {
                      this.navigateToLogin();
                    }
                  });
              }
            }
          });

          if (this.agencyId != null) {
            this.calculateCurrency(this.agencyId);
          }

        }
        else if (this.isViewing) {
          console.log("view from local agency")
          this.showingSections = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
          this.loadResponsePlanData()
        }
        else {

            this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

              this.agencyId = agencyId
              //get response plan settings from agency
              this.userService.getAgencyDetail(agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(agency => {
                  let sections = agency.responsePlanSettings.sections;
                  this.showingSections = Object.keys(sections).filter(key => sections[key]).map(key => Number(key));
                  console.log(this.showingSections)
                });

              this.uid = user.auth.uid;
              this.userPath = Constants.USER_PATHS[userType];
                this.loadDataLocalAgency();
              this.calculateCurrency(agencyId);
            });
          };

      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  /**
   * Calculate the currency
   */
  private currency: number = Currency.GBP;
  private CURRENCIES = Constants.CURRENCY_SYMBOL;

  public calculateCurrency(agencyId: string) {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + "/currency", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.currency = snap.val();
      });
  }

  /**
   * Private functions
   */

  // private loadData() {
  //
  //     this.route.params.subscribe((params: Params) => {
  //         var countryID = params['countryID'] ? params['countryID'] : false;
  //         var responsePlanID = params['id'] ? params['id'] : false;
  //         var token = params['token'] ? params['token'] : false;
  //
  //         if (countryID && responsePlanID && token) {
  //             this.countryId = countryID;
  //             this.responsePlanId = responsePlanID;
  //             this.loadResponsePlanData();
  //         } else {
  //             this.getCountryId().then(() => {
  //                 if (this.responsePlanId) {
  //                     this.loadResponsePlanData();
  //                 } else {
  //                     this.route.params
  //                         .takeUntil(this.ngUnsubscribe)
  //                         .subscribe((params: Params) => {
  //                             if (params["id"]) {
  //                                 this.responsePlanId = params["id"];
  //                                 this.loadResponsePlanData();
  //                             }
  //                         });
  //                 }
  //
  //             });
  //         }
  //
  //     });
  //
  // }

  private loadData(userType) {
    console.log("loadData");

    if (this.isViewing) {
      console.log("is viewing");
      this.handleLoadResponsePlan();
    } else {
      if (userType == UserType.GlobalDirector || userType == UserType.RegionalDirector) {
        this.route.params.pipe(
          takeUntil(this.ngUnsubscribe))
          .subscribe((params: Params) => {
            if (params["countryId"]) {
              this.countryId = params["countryId"];
              this.handleLoadResponsePlan();
            }
          })
      } else {
        this.getCountryId().then(() => {
          this.handleLoadResponsePlan();
        });
      }
      // });
    }
  }

  private loadDataLocalAgency() {

    this.handleLoadResponsePlanLocalAgency();

  }

  private handleLoadResponsePlan() {
    if (this.responsePlanId) {
      this.loadResponsePlanData();
    } else {
      this.route.params.pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.responsePlanId = params["id"];
            this.loadResponsePlanData();
          }
        });
    }
  }

  private handleLoadResponsePlanLocalAgency() {
    if (this.responsePlanId) {
      this.loadResponsePlanDataLocalAgency();
    } else {
      this.route.params.pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.responsePlanId = params["id"];
            this.loadResponsePlanDataLocalAgency();
          }
        });
    }
  }

  private configGroups(responsePlan: ResponsePlan) {

    const normalUser = () => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.userPath + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((systemAdminIds) => {
          this.systemAdminUid = systemAdminIds[0].$key;
          console.log(this.systemAdminUid);
          this.getGroups(responsePlan);
        });
    };
    const networkUser = () => {
      if (this.isLocalNetworkAdmin) {
        this.networkService.getSystemIdForNetworkAdmin(this.uid).pipe(
          takeUntil(this.ngUnsubscribe))
          .subscribe(systemId => {
            console.log(systemId)
            this.systemAdminUid = systemId;
            this.getGroups(responsePlan);
          });
      } else {
        this.networkService.getSystemIdForNetworkCountryAdmin(this.uid).pipe(
          takeUntil(this.ngUnsubscribe))
          .subscribe(systemId => {
            this.systemAdminUid = systemId;
            this.getGroups(responsePlan);
          });
      }
    };
    this.systemAdminUid ? this.getGroups(responsePlan) : this.networkCountryId ? networkUser() : normalUser();
  }

  private getGroups(responsePlan: ResponsePlan) {
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
          this.loadSection5(responsePlan);
        });
    }
  }

  private getCountryId() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + this.userPath + "/" + this.uid + "/countryId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryId: any) => {
          console.log(countryId)
          this.countryId = countryId.$value;
          res(true);
        });
    });
    return promise;
  }

  private loadResponsePlanData() {
    console.log("response plan id: " + this.responsePlanId);
    console.log(this.networkCountryId)
    console.log(this.networkId)
    console.log(this.countryId)
    console.log(this.agencyId)
    let id = this.networkCountryId ? this.networkCountryId : this.networkId ? this.networkId : this.countryId ? this.countryId : this.agencyId;
    console.log(id)
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + '/' + this.responsePlanId;
    console.log(responsePlansPath)



    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlanToShow = responsePlan;
        if (!this.accessToken) {
          this.configGroups(responsePlan);
        }

        if(id === this.countryId) {
          this.userService.getAgencyId(this.userPath, this.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(id => {
            this.countryService.getCountryResponsePlanClockSettingsDuration(id, this.countryId).takeUntil(this.ngUnsubscribe)
              .subscribe(duration => {
                this.expiryDate = (duration - 604800000) + responsePlan.timeCreated
              })
          })
        }
        else if(id === this.networkCountryId) {
          this.networkService.getNetworkCountryResponsePlanClockSettingsDuration(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe).subscribe(duration => {
              this.expiryDate = (duration - 604800000) + responsePlan.timeCreated
            })
        }
        else if(id === this.networkId) {
          this.networkService.getNetworkResponsePlanClockSettingsDuration(this.networkId)
            .takeUntil(this.ngUnsubscribe).subscribe(duration => {
              this.expiryDate = (duration - 604800000) + responsePlan.timeCreated
            })
        }

        this.loadSection1PlanLead(responsePlan);
        this.loadSection3(responsePlan);
        this.loadSection7(responsePlan);
        this.loadSection8(responsePlan);
        this.loadSection10(responsePlan);
      });
  }

  private loadResponsePlanDataLocalAgency() {
    console.log("response plan id: " + this.responsePlanId);
    let id = this.isViewing ? this.networkCountryId ? this.networkCountryId : this.networkId : this.agencyId;
    console.log(Constants.APP_STATUS + '/responsePlan/' + id + '/' + this.responsePlanId)

    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + '/' + this.responsePlanId;

    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlanToShow = responsePlan;
        if (!this.accessToken) {
          this.configGroups(responsePlan);
        }

        this.agencyService.getAgencyResponsePlanClockSettingsDuration(this.agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(duration => {
          this.expiryDate = (duration - 604800000) + responsePlan.timeCreated
        });

        this.loadSection1PlanLead(responsePlan);
        this.loadSection3(responsePlan);
        this.loadSection7(responsePlan);
        this.loadSection8(responsePlan);
        this.loadSection10(responsePlan);
      });
  }

  private loadSection1PlanLead(responsePlan: ResponsePlan) {

    if (responsePlan.planLead) {
      const normalUser = () => {
        this.userService.getUser(responsePlan.planLead).pipe(
          takeUntil(this.ngUnsubscribe))
          .subscribe(user => {
            this.planLeadName = user.firstName + " " + user.lastName;
          });
      };

      const networkUser = () => {
        this.userService.getAgencyModel(responsePlan.planLead)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agency => this.planLeadName = agency.name);
      };
      this.networkCountryId ? networkUser() : normalUser();
    } else {
      this.planLeadName = 'Unassigned';
    }
  }

  private loadSection3(responsePlan: ResponsePlan) {
    if (responsePlan.sectors) {
      this.sectors = Object.keys(responsePlan.sectors).map(key => {
        let sector = responsePlan.sectors[key];
        sector["id"] = Number(key);
        return sector;
      });
    }
    if (responsePlan.partnerOrganisations) {
      this.partnerList = [];
      let partnerIds = Object.keys(responsePlan.partnerOrganisations).map(key => responsePlan.partnerOrganisations[key]);
      partnerIds.forEach(id => {
        this.userService.getOrganisationName(id)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(organisation => {
            this.partnerList.push(organisation.organisationName);
          })
      });
    }
  }

  private loadSection5(responsePlan: ResponsePlan) {
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
  }

  private loadSection7(responsePlan: ResponsePlan) {
    if (this.sectors) {
      // let sectors: {} = responsePlan.sectors;
      Object.keys(responsePlan.sectors).forEach(sectorKey => {

        //activity info load back
        // let sectorInfo = this.activityInfoMap.get(sectorKey);
        // if (!sectorInfo) {
        let infoData = {};
        infoData["sourcePlan"] = responsePlan.sectors[sectorKey]["sourcePlan"];
        infoData["bullet1"] = responsePlan.sectors[sectorKey]["bullet1"];
        infoData["bullet2"] = responsePlan.sectors[sectorKey]["bullet2"];
        this.activityInfoMap.set(Number(sectorKey), infoData);
        // }

        //activities list load back
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
              activitiesData[key]["hasFurtherBeneficiary"] && activitiesData[key]["hasDisability"] ? activitiesData[key]["furtherDisability"] : null);
            moreData.push(model);
            this.activityMap.set(Number(sectorKey), moreData);
          });
        }
      });
    }

  }

  private loadSection8(responsePlan: ResponsePlan) {

    if (responsePlan.monAccLearning) {
      if (responsePlan.monAccLearning['isMedia']) {
        if (responsePlan.monAccLearning['mediaFormat'] || responsePlan.monAccLearning['mediaFormat'] == 0) {
          this.intendToVisuallyDoc = "YES";
          this.mediaType = Constants.MEDIA_TYPES[responsePlan.monAccLearning['mediaFormat']];
        } else {
          this.intendToVisuallyDoc = "YES";
          this.mediaType = '';
        }
      } else {
        this.intendToVisuallyDoc = "GLOBAL.NO";
        this.mediaType = '';
      }
    } else {
      this.intendToVisuallyDoc = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    }
  }

  // TODO -
  private loadSection10(responsePlan: ResponsePlan) {

    if (responsePlan.budget) {

      this.totalInputs = responsePlan.budget['totalInputs'] ? responsePlan.budget['totalInputs'] : 0;
      this.totalOfAllCosts = responsePlan.budget['totalOfAllCosts'] ? responsePlan.budget['totalOfAllCosts'] : 0;
      this.total = responsePlan.budget['total'] ? responsePlan.budget['total'] : 0;

      if (responsePlan.budget['item']) {

        this.transportBudget = responsePlan.budget['item'][BudgetCategory.Transport] ? responsePlan.budget['item'][BudgetCategory.Transport]['budget'] : 0;
        this.transportNarrative = responsePlan.budget['item'][BudgetCategory.Transport] ? responsePlan.budget['item'][BudgetCategory.Transport]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";

        this.securityBudget = responsePlan.budget['item'][BudgetCategory.Security] ? responsePlan.budget['item'][BudgetCategory.Security]['budget'] : 0;
        this.securityNarrative = responsePlan.budget['item'][BudgetCategory.Security] ? responsePlan.budget['item'][BudgetCategory.Security]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";

        this.logisticsAndOverheadsBudget = responsePlan.budget['item'][BudgetCategory.Logistics] ? responsePlan.budget['item'][BudgetCategory.Logistics]['budget'] : 0;
        this.logisticsAndOverheadsNarrative = responsePlan.budget['item'][BudgetCategory.Logistics] ? responsePlan.budget['item'][BudgetCategory.Logistics]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";

        this.staffingAndSupportBudget = responsePlan.budget['item'][BudgetCategory.Staffing] ? responsePlan.budget['item'][BudgetCategory.Staffing]['budget'] : 0;
        this.staffingAndSupportNarrative = responsePlan.budget['item'][BudgetCategory.Staffing] ? responsePlan.budget['item'][BudgetCategory.Staffing]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";

        this.monitoringAndEvolutionBudget = responsePlan.budget['item'][BudgetCategory.Monitoring] ? responsePlan.budget['item'][BudgetCategory.Monitoring]['budget'] : 0;
        this.monitoringAndEvolutionNarrative = responsePlan.budget['item'][BudgetCategory.Monitoring] ? responsePlan.budget['item'][BudgetCategory.Monitoring]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";

        this.capitalItemsBudget = responsePlan.budget['item'][BudgetCategory.CapitalItems] ? responsePlan.budget['item'][BudgetCategory.CapitalItems]['budget'] : 0;
        this.capitalItemsNarrative = responsePlan.budget['item'][BudgetCategory.CapitalItems] ? responsePlan.budget['item'][BudgetCategory.CapitalItems]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";

        this.managementSupportPercentage = responsePlan.budget['item'][BudgetCategory.ManagementSupport] ? responsePlan.budget['item'][BudgetCategory.ManagementSupport]['budget'] + '%' : '0%';
        this.managementSupportNarrative = responsePlan.budget['item'][BudgetCategory.ManagementSupport] ? responsePlan.budget['item'][BudgetCategory.ManagementSupport]['narrative'] : "RESPONSE_PLANS.NO_INFO_TO_SHOW";

      } else {
        this.assignDefaultValues();
      }
    } else {
      this.assignDefaultValues();
    }
  }

  private assignDefaultValues() {

    this.transportBudget = 0;
    this.securityBudget = 0;
    this.logisticsAndOverheadsBudget = 0;
    this.staffingAndSupportBudget = 0;
    this.monitoringAndEvolutionBudget = 0;
    this.capitalItemsBudget = 0;
    this.managementSupportPercentage = 0;

    this.totalInputs = 0;
    this.totalOfAllCosts = 0;
    this.total = 0;

    this.transportNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    this.securityNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    this.logisticsAndOverheadsNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    this.staffingAndSupportNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    this.monitoringAndEvolutionNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    this.capitalItemsNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
    this.managementSupportNarrative = "RESPONSE_PLANS.NO_INFO_TO_SHOW";
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  handleSectors(responsePlan) {
    let list = []
    if (responsePlan.sectors) {
      list = Object.keys(responsePlan.sectors)
    }
    return list
  }
}
