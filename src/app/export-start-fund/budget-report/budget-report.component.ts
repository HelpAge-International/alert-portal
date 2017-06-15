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

@Component({
  selector: 'app-export-start-fund-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.css']
})

export class BudgetReportComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlan: ResponsePlan = new ResponsePlan;

  private totalInputs: number;
  private totalOfAllCosts: number;
  private total: number;
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

        this.bindBudgetReportData(responsePlan);
      });
  }

  private bindBudgetReportData(responsePlan: ResponsePlan) {
    if (responsePlan.budget) {
      this.totalInputs = responsePlan.budget['totalInputs'] ? responsePlan.budget['totalInputs'] : 0;
      this.totalOfAllCosts = responsePlan.budget['totalOfAllCosts'] ? responsePlan.budget['totalOfAllCosts'] : 0;
      this.total = responsePlan.budget['total'] ? responsePlan.budget['total'] : 0;

      if (responsePlan.budget['item']) {
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
