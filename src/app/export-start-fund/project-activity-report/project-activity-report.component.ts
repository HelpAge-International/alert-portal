import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {
  BudgetCategory,
  UserType
} from "../../utils/Enums";
import {ModelPlanActivity} from "../../model/plan-activity.model";
import {forEach} from "@angular/router/src/utils/collection";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-export-start-fund-project-activity-report',
  templateUrl: './project-activity-report.component.html',
  styleUrls: ['./project-activity-report.component.css']
})

export class ProjectActivityReportComponent implements OnInit, OnDestroy {

  private SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlan: ResponsePlan = new ResponsePlan;
  private activityMap = new Map();
  private sectors: any[];

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private userService: UserService, private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
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

        this.bindProjectActivitiesData(responsePlan);
      });
  }

  private bindProjectActivitiesData(responsePlan: ResponsePlan){
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
        let moreData: {}[] = [];
        Object.keys(activitiesData).forEach(key => {
          let beneficiary = [];
          activitiesData[key]["beneficiary"].forEach(item => {
            beneficiary.push(item);
          });
          let model = new ModelPlanActivity(activitiesData[key]["name"], activitiesData[key]["output"], activitiesData[key]["indicator"], beneficiary);
          moreData.push(model);
          this.activityMap.set(Number(sectorKey), moreData);
        });
      });
    }
  }

  /**
   * Utility Functions
   */

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
