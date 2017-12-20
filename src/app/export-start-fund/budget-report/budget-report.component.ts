import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {
  BudgetCategory, Currency,
  UserType
} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";

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
  private securityBudget: number;
  private logisticsAndOverheadsBudget: number;
  private staffingAndSupportBudget: number;
  private monitoringAndEvolutionBudget: number;
  private capitalItemsBudget: number;
  private memberAgencyName: string = '';

  private networkCountryId: string;

  private inputWaSHBudget: number;
  private inputHealthBudget: number;
  private inputShelterBudget: number;
  private inputNutritionBudget: number;
  private inputCampBudget: number;
  private inputProtectionBudget: number;
  private inputEduBudget: number;
  private inputFoodSecBudget: number;
  private inputOtherBudget: number;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private userService: UserService, private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
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
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Private Functions
   */

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

  private downloadAgencyData(userType){

    const normalUser = () => {
      this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyId) => {
          this.af.database.object(Constants.APP_STATUS + "/agency/"+agencyId+"/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
            if(name != null){
              this.memberAgencyName = name.$value;
            }
          });
          this.calculateCurrency(agencyId);
        });
    };

    const networkUser = () => {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.responsePlan.planLead + "/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
        if (name != null) {
          this.memberAgencyName = name.$value;
        }
      });
      this.calculateCurrency(this.responsePlan.planLead);
    };

    this.networkCountryId ? networkUser() : normalUser();


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

        this.bindBudgetReportData(responsePlan);
      });
  }

  private bindBudgetReportData(responsePlan: ResponsePlan) {
    if (responsePlan.budget) {
      this.totalInputs = responsePlan.budget['totalInputs'] ? responsePlan.budget['totalInputs'] : 0;
      this.totalOfAllCosts = responsePlan.budget['totalOfAllCosts'] ? responsePlan.budget['totalOfAllCosts'] : 0;
      this.total = responsePlan.budget['total'] ? responsePlan.budget['total'] : 0;

      if (responsePlan.budget['item']) {
        this.inputWaSHBudget = responsePlan.budget['item'][BudgetCategory.Inputs][0] ? responsePlan.budget['item'][BudgetCategory.Inputs][0]['budget'] : 0;
        this.inputHealthBudget = responsePlan.budget['item'][BudgetCategory.Inputs][1] ? responsePlan.budget['item'][BudgetCategory.Inputs][1]['budget'] : 0;
        this.inputShelterBudget = responsePlan.budget['item'][BudgetCategory.Inputs][2] ? responsePlan.budget['item'][BudgetCategory.Inputs][2]['budget'] : 0;
        this.inputNutritionBudget = responsePlan.budget['item'][BudgetCategory.Inputs][3] ? responsePlan.budget['item'][BudgetCategory.Inputs][3]['budget'] : 0;
        this.inputCampBudget = responsePlan.budget['item'][BudgetCategory.Inputs][7] ? responsePlan.budget['item'][BudgetCategory.Inputs][7]['budget'] : 0;
        this.inputProtectionBudget = responsePlan.budget['item'][BudgetCategory.Inputs][5] ? responsePlan.budget['item'][BudgetCategory.Inputs][5]['budget'] : 0;
        this.inputEduBudget = responsePlan.budget['item'][BudgetCategory.Inputs][6] ? responsePlan.budget['item'][BudgetCategory.Inputs][6]['budget'] : 0;
        this.inputFoodSecBudget = responsePlan.budget['item'][BudgetCategory.Inputs][4] ? responsePlan.budget['item'][BudgetCategory.Inputs][4]['budget'] : 0;
        this.inputOtherBudget = responsePlan.budget['item'][BudgetCategory.Inputs][8] ? responsePlan.budget['item'][BudgetCategory.Inputs][8]['budget'] : 0;

        this.transportBudget = responsePlan.budget['item'][BudgetCategory.Transport] ? responsePlan.budget['item'][BudgetCategory.Transport]['budget'] : 0;
        this.securityBudget = responsePlan.budget['item'][BudgetCategory.Security] ? responsePlan.budget['item'][BudgetCategory.Security]['budget'] : 0;
        this.logisticsAndOverheadsBudget = responsePlan.budget['item'][BudgetCategory.Logistics] ? responsePlan.budget['item'][BudgetCategory.Logistics]['budget'] : 0;
        this.staffingAndSupportBudget = responsePlan.budget['item'][BudgetCategory.Staffing] ? responsePlan.budget['item'][BudgetCategory.Staffing]['budget'] : 0;
        this.monitoringAndEvolutionBudget = responsePlan.budget['item'][BudgetCategory.Monitoring] ? responsePlan.budget['item'][BudgetCategory.Monitoring]['budget'] : 0;
        this.capitalItemsBudget = responsePlan.budget['item'][BudgetCategory.CapitalItems] ? responsePlan.budget['item'][BudgetCategory.CapitalItems]['budget'] : 0;
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
