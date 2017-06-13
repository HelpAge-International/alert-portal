import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../model/responsePlan";
import {UserService} from "../services/user.service";
import {
  BudgetCategory, ResponsePlanSectors, UserType
} from "../utils/Enums";

@Component({
  selector: 'app-export-start-fund',
  templateUrl: './export-start-fund.component.html',
  styleUrls: ['./export-start-fund.component.css']
})

export class ExportStartFundComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private responsePlanSectors = ResponsePlanSectors;
  private responsePlan: ResponsePlan = new ResponsePlan;
  private planLeadName: string = '';
  private planLeadEmail: string = '';
  private planLeadPhone: string = '';
  private sectorsRelatedToMap = new Map<number,boolean>();

  constructor(private af: AngularFire, private router: Router, private userService: UserService, private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.downloadData();
      } else {
        this.navigateToLogin();
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

        responsePlan.sectorsRelatedTo.forEach(sector =>{
          this.sectorsRelatedToMap.set(sector,true);
        });

        this.bindProjectLeadData(responsePlan);
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
