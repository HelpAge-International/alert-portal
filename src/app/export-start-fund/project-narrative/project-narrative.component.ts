import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {
  MediaFormat, MethodOfImplementation, PresenceInTheCountry, ResponsePlanSectors, SourcePlan, UserType
} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-export-start-fund-project-narrative',
  templateUrl: './project-narrative.component.html',
  styleUrls: ['./project-narrative.component.css']
})

export class ProjectNarrativeComponent implements OnInit, OnDestroy {

  private SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private ResponsePlanSectors = ResponsePlanSectors;
  private responsePlan: ResponsePlan = new ResponsePlan;

  private planLeadName: string = '';
  private planLeadEmail: string = '';
  private planLeadPhone: string = '';
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

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private userService: UserService, private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.userPath = Constants.USER_PATHS[userType];
      this.downloadData();
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
              }
            })
        } else {
          this.getCountryId().then(() => {
            this.downloadResponsePlanData();
          });
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
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.responsePlanId;
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

  private bindProjectLeadData(responsePlan: ResponsePlan) {
    if (responsePlan.planLead) {
      this.userService.getUser(responsePlan.planLead)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          console.log(user);
          this.planLeadName = user.title + " " + user.firstName + " " + user.lastName;
          this.planLeadEmail = user.email;
          this.planLeadPhone = user.phone;
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
    this.af.database.list(Constants.APP_STATUS + "/" + this.userPath + "/" + this.uid + '/systemAdmin')
      .takeUntil(this.ngUnsubscribe)
      .subscribe((systemAdminIds) => {
        this.systemAdminUid = systemAdminIds[0].$key;
        this.downloadGroups(responsePlan);
      });
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
