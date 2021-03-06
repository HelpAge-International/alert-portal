import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {UserType} from "../../utils/Enums";
import {ModelPlanActivity} from "../../model/plan-activity.model";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-export-start-fund-project-activities',
  templateUrl: './project-activities.component.html',
  styleUrls: ['./project-activities.component.css']
})

export class ProjectActivitiesComponent implements OnInit, OnDestroy {

  private SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlan: ResponsePlan = new ResponsePlan;
  private activityMap = new Map();
  private sectors: any[];
  private memberAgencyName: string = '';
  private totalFemaleUnder18: number;
  private totalFemale18To50: number;
  private totalFemaleOver50: number;
  private totalMaleUnder18: number;
  private totalMale18To50: number;
  private totalMaleOver50: number;
  private totalOverallMale: number;
  private totalOverallFemale: number;
  private totalOverallPopulation: number;
  private dcTotalFemale: number;
  private dcTotalMale: number;
  private dcTotal: number;
  private agencyId: string;

  private networkCountryId: string;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private userService: UserService, private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['isLocalAgency']) {
        this.initLocalAgency()
      } else {
        this.initCountryOffice()
      }

    });

  }

  private initCountryOffice() {
    this.route.params.subscribe((params: Params) => {
      if (params["id"] && params["networkCountryId"]) {
        this.responsePlanId = params["id"];
        this.networkCountryId = params["networkCountryId"];
        if (params["isViewing"]) {
          this.uid = params["uid"]
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
          this.downloadData();
        });
      }
    })
  }

  private initLocalAgency() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.downloadDataLocalAgency();
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
        if(responsePlan.doubleCounting){
          this.dcTotalFemale = Number(responsePlan.doubleCounting[0].value) + Number(responsePlan.doubleCounting[1].value) + Number(responsePlan.doubleCounting[2].value);
          this.dcTotalMale = Number(responsePlan.doubleCounting[3].value) + Number(responsePlan.doubleCounting[4].value) + Number(responsePlan.doubleCounting[5].value);
          this.dcTotal = this.dcTotalFemale + this.dcTotalMale;
        }

        this.bindProjectActivitiesData(responsePlan);
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
        this.dcTotalFemale = Number(responsePlan.doubleCounting[0].value) + Number(responsePlan.doubleCounting[1].value) + Number(responsePlan.doubleCounting[2].value);
        this.dcTotalMale = Number(responsePlan.doubleCounting[3].value) + Number(responsePlan.doubleCounting[4].value) + Number(responsePlan.doubleCounting[5].value);
        this.dcTotal = this.dcTotalFemale + this.dcTotalMale;

        this.bindProjectActivitiesData(responsePlan);
      });
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
              activitiesData[key]["hasFurtherBeneficiary"] && activitiesData[key]["hasDisability"] ? activitiesData[key]["furtherDisability"] : null);
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

        this.totalOverallFemale = this.getOverallFemaleTotal(this.activityMap);
        this.totalOverallMale = this.getOverallMaleTotal(this.activityMap);
        this.totalOverallPopulation = this.getOverallPopulationTotal(this.activityMap);
      }
    }
  }

  /**
   * Utility Functions
   */

  getTotalFemalePopulation(activity) {
    if (activity.hasFurtherBeneficiary) {
      return (activity.furtherBeneficiary && activity.furtherBeneficiary[0] ? Number(activity.furtherBeneficiary[0]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[1] ? Number(activity.furtherBeneficiary[1]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[2] ? Number(activity.furtherBeneficiary[2]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[3] ? Number(activity.furtherBeneficiary[3]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[4] ? Number(activity.furtherBeneficiary[4]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[5] ? Number(activity.furtherBeneficiary[5]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[6] ? Number(activity.furtherBeneficiary[6]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[7] ? Number(activity.furtherBeneficiary[7]["value"]) : 0)
    } else {
      return (activity.beneficiary && activity.beneficiary[0] ? Number(activity.beneficiary[0]["value"]) : 0)
        + (activity.beneficiary && activity.beneficiary[1] ? Number(activity.beneficiary[1]["value"]) : 0)
        + (activity.beneficiary && activity.beneficiary[2] ? Number(activity.beneficiary[2]["value"]) : 0);
    }
  }

  getTotalMalePopulation(activity) {
    if (activity.hasFurtherBeneficiary) {
      return (activity.furtherBeneficiary && activity.furtherBeneficiary[8] ? Number(activity.furtherBeneficiary[8]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[9] ? Number(activity.furtherBeneficiary[9]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[10] ? Number(activity.furtherBeneficiary[10]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[11] ? Number(activity.furtherBeneficiary[11]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[12] ? Number(activity.furtherBeneficiary[12]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[13] ? Number(activity.furtherBeneficiary[13]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[14] ? Number(activity.furtherBeneficiary[14]["value"]) : 0)
        + (activity.furtherBeneficiary && activity.furtherBeneficiary[15] ? Number(activity.furtherBeneficiary[15]["value"]) : 0)
    } else {
      return (activity.beneficiary && activity.beneficiary[3] ? Number(activity.beneficiary[3]["value"]) : 0)
        + (activity.beneficiary && activity.beneficiary[4] ? Number(activity.beneficiary[4]["value"]) : 0)
        + (activity.beneficiary && activity.beneficiary[5] ? Number(activity.beneficiary[5]["value"]) : 0);
    }
  }

  getOverallTotalPopulation(activity) {
    return this.getTotalFemalePopulation(activity) + this.getTotalMalePopulation(activity);
  }

  private getTotalFemaleUnder18(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          if (activity.hasFurtherBeneficiary) {
            total += ((activity.furtherBeneficiary && activity.furtherBeneficiary[0] ? Number(activity.furtherBeneficiary[0]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[1] ? Number(activity.furtherBeneficiary[1]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[2] ? Number(activity.furtherBeneficiary[2]["value"]) : 0))
          } else {
            total += (activity.beneficiary && activity.beneficiary[0] ? Number(activity.beneficiary[0]["value"]) : 0);
          }
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
          if (activity.hasFurtherBeneficiary) {
            total += (activity.furtherBeneficiary && activity.furtherBeneficiary[3] ? Number(activity.furtherBeneficiary[3]["value"]) : 0);
          } else {
            total += (activity.beneficiary && activity.beneficiary[1] ? Number(activity.beneficiary[1]["value"]) : 0);
          }
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
          if (activity.hasFurtherBeneficiary) {
            total += ((activity.furtherBeneficiary && activity.furtherBeneficiary[4] ? Number(activity.furtherBeneficiary[4]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[5] ? Number(activity.furtherBeneficiary[5]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[6] ? Number(activity.furtherBeneficiary[6]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[7] ? Number(activity.furtherBeneficiary[7]["value"]) : 0))
          } else {
            total += (activity.beneficiary && activity.beneficiary[2] ? Number(activity.beneficiary[2]["value"]) : 0);
          }
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
          if (activity.hasFurtherBeneficiary) {
            total += ((activity.furtherBeneficiary && activity.furtherBeneficiary[8] ? Number(activity.furtherBeneficiary[8]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[9] ? Number(activity.furtherBeneficiary[9]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[10] ? Number(activity.furtherBeneficiary[10]["value"]) : 0))
          } else {
            total += (activity.beneficiary && activity.beneficiary[3] ? Number(activity.beneficiary[3]["value"]) : 0);
          }
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
          if (activity.hasFurtherBeneficiary) {
            total += (activity.furtherBeneficiary && activity.furtherBeneficiary[11] ? Number(activity.furtherBeneficiary[11]["value"]) : 0);
          } else {
            total += (activity.beneficiary && activity.beneficiary[4] ? Number(activity.beneficiary[4]["value"]) : 0);
          }
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
          if (activity.hasFurtherBeneficiary) {
            total += ((activity.furtherBeneficiary && activity.furtherBeneficiary[12] ? Number(activity.furtherBeneficiary[12]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[13] ? Number(activity.furtherBeneficiary[13]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[14] ? Number(activity.furtherBeneficiary[14]["value"]) : 0) +
              (activity.furtherBeneficiary && activity.furtherBeneficiary[15] ? Number(activity.furtherBeneficiary[15]["value"]) : 0))
          } else {
            total += (activity.beneficiary && activity.beneficiary[5] ? Number(activity.beneficiary[5]["value"]) : 0);
          }
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
          if (activity.hasFurtherBeneficiary) {
            total += (activity.furtherBeneficiary && activity.furtherBeneficiary[0] ? Number(activity.furtherBeneficiary[0]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[1] ? Number(activity.furtherBeneficiary[1]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[2] ? Number(activity.furtherBeneficiary[2]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[3] ? Number(activity.furtherBeneficiary[3]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[4] ? Number(activity.furtherBeneficiary[4]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[5] ? Number(activity.furtherBeneficiary[5]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[6] ? Number(activity.furtherBeneficiary[6]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[7] ? Number(activity.furtherBeneficiary[7]["value"]) : 0)
          } else {
            total += (activity.beneficiary && activity.beneficiary[0] ? Number(activity.beneficiary[0]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[1] ? Number(activity.beneficiary[1]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[2] ? Number(activity.beneficiary[2]["value"]) : 0);
          }
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
          if (activity.hasFurtherBeneficiary) {
            total += (activity.furtherBeneficiary && activity.furtherBeneficiary[8] ? Number(activity.furtherBeneficiary[8]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[9] ? Number(activity.furtherBeneficiary[9]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[10] ? Number(activity.furtherBeneficiary[10]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[11] ? Number(activity.furtherBeneficiary[11]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[12] ? Number(activity.furtherBeneficiary[12]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[13] ? Number(activity.furtherBeneficiary[13]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[14] ? Number(activity.furtherBeneficiary[14]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[15] ? Number(activity.furtherBeneficiary[15]["value"]) : 0)
          } else {
            total += (activity.beneficiary && activity.beneficiary[3] ? Number(activity.beneficiary[3]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[4] ? Number(activity.beneficiary[4]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[5] ? Number(activity.beneficiary[5]["value"]) : 0);
          }
        });
      }
    });

    return total;
  }

  private getOverallPopulationTotal(activityMap) {
    var total = 0;
    this.sectors.forEach(function (sector) {
      if (activityMap.get(sector.id)) {
        activityMap.get(sector.id).forEach(function (activity) {
          if (activity.hasFurtherBeneficiary) {
            total += (activity.furtherBeneficiary && activity.furtherBeneficiary[0] ? Number(activity.furtherBeneficiary[0]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[1] ? Number(activity.furtherBeneficiary[1]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[2] ? Number(activity.furtherBeneficiary[2]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[3] ? Number(activity.furtherBeneficiary[3]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[4] ? Number(activity.furtherBeneficiary[4]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[5] ? Number(activity.furtherBeneficiary[5]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[6] ? Number(activity.furtherBeneficiary[6]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[7] ? Number(activity.furtherBeneficiary[7]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[8] ? Number(activity.furtherBeneficiary[8]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[9] ? Number(activity.furtherBeneficiary[9]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[10] ? Number(activity.furtherBeneficiary[10]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[11] ? Number(activity.furtherBeneficiary[11]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[12] ? Number(activity.furtherBeneficiary[12]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[13] ? Number(activity.furtherBeneficiary[13]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[14] ? Number(activity.furtherBeneficiary[14]["value"]) : 0)
              + (activity.furtherBeneficiary && activity.furtherBeneficiary[15] ? Number(activity.furtherBeneficiary[15]["value"]) : 0)
          } else {
            total += (activity.beneficiary && activity.beneficiary[0] ? Number(activity.beneficiary[0]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[1] ? Number(activity.beneficiary[1]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[2] ? Number(activity.beneficiary[2]["value"]) : 0)

              + (activity.beneficiary && activity.beneficiary[3] ? Number(activity.beneficiary[3]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[4] ? Number(activity.beneficiary[4]["value"]) : 0)
              + (activity.beneficiary && activity.beneficiary[5] ? Number(activity.beneficiary[5]["value"]) : 0);
          }
        });
      }
    });

    return total;
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
