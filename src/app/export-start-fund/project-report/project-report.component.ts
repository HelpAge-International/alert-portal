import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {
  MediaFormat,
  MethodOfImplementation, NetworkUserAccountType,
  PresenceInTheCountry,
  ResponsePlanSectors, SourcePlan,
  UserType
} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";

@Component({
  selector: 'app-export-start-fund-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})

export class ProjectReportComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  private ResponsePlanSectors = ResponsePlanSectors;
  private PresenceInTheCountry = PresenceInTheCountry;
  private MethodOfImplementation = MethodOfImplementation;

  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlan: ResponsePlan = new ResponsePlan;
  private planLeadName: string = '';
  private planLeadPosition: string = '';
  private planLeadEmail: string = '';
  private planLeadPhone: string = '';
  private partnersList: string[] = [];
  private sourcePlanId: number;
  private SourcePlan = SourcePlan;
  private MediaFormat = MediaFormat;
  private groups: any[] = [];
  private vulnerableGroupsToShow = [];
  private userPath: string;
  private systemAdminUid: string;
  private memberAgencyName: string = '';
  private agencyId: string;

  private sectorsRelatedToMap = new Map<number, boolean>();

  private networkCountryId: string;
  private isLocalNetworkAdmin: boolean;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private networkService: NetworkService,
              private userService: UserService,
              private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if(params['isLocalAgency']){
        this.initLocalAgency()
      }else{
        this.initCountryOffice()
      }
    });
  }

  initLocalAgency(){
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.userPath = Constants.USER_PATHS[userType];
      this.agencyId = agencyId
      this.downloadDataLocalAgency();
    });
  }

  initCountryOffice(){
    this.route.params.subscribe((params: Params) => {
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }
      if (params["id"] && params["networkCountryId"]) {
        this.responsePlanId = params["id"];
        this.networkCountryId = params["networkCountryId"];
        if (params["isViewing"]) {
          this.uid = params["uid"]
          this.systemAdminUid = params["systemId"]
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
    })
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

  /**
   * Utility Functions
   */

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
