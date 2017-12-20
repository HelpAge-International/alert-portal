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
import {Network} from "../../network-admin/network-account-selection/models/network";
import {NetworkService} from "../../services/network.service";

@Component({
  selector: 'app-export-start-fund-project-budget',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.css']
})

export class ProjectBudgetComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlan: ResponsePlan = new ResponsePlan;

  private memberAgencyName: string = '';
  private totalInputs: number;
  private totalOfAllCosts: number;
  private total: number;

  private inputWaSHBudget: number;
  private inputWaSHNarrative: string;
  private inputHealthBudget: number;
  private inputHealthNarrative: string;
  private inputShelterBudget: number;
  private inputShelterNarrative: string;
  private inputNutritionBudget: number;
  private inputNutritionNarrative: string;
  private inputCampBudget: number;
  private inputCampNarrative: string;
  private inputProtectionBudget: number;
  private inputProtectionNarrative: string;
  private inputEduBudget: number;
  private inputEduNarrative: string;
  private inputFoodSecBudget: number;
  private inputFoodSecNarrative: string;
  private inputOtherBudget: number;
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

  private networkCountryId: string;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private userService: UserService,
              private networkService: NetworkService,
              private route: ActivatedRoute) {
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

        this.bindProjectBudgetData(responsePlan);
      });
  }

  private bindProjectBudgetData(responsePlan: ResponsePlan) {
    if (responsePlan.budget) {
      this.totalInputs = responsePlan.budget['totalInputs'] ? responsePlan.budget['totalInputs'] : 0;
      this.totalOfAllCosts = responsePlan.budget['totalOfAllCosts'] ? responsePlan.budget['totalOfAllCosts'] : 0;
      this.total = responsePlan.budget['total'] ? responsePlan.budget['total'] : 0;

      if (responsePlan.budget['item']) {
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
