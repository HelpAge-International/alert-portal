import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {BudgetCategory} from "../../utils/Enums";

@Component({
  selector: 'app-view-response-plan',
  templateUrl: './view-response-plan.component.html',
  styleUrls: ['./view-response-plan.component.css']
})

export class ViewResponsePlanComponent implements OnInit, OnDestroy {

  // TODO - Update this
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;

  // TODO - Remove - This id needs to be forwarded from the required component
  private responsePlanId: string = '-KkQJxlVjMmJS9tXhiiz';

  private responsePlanToShow: ResponsePlan = new ResponsePlan;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Section 01
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private planLeadName: string = '';

  // TODO -
  // Section 03
  // Section 07

  // Section 08
  private intendToVisuallyDoc: string = '';
  private mediaType: any;

  // Section 10
  private BudgetCategory = BudgetCategory;
  private transportBudget: number;
  private securityBudget: number;
  private logisticsAndOverheadsBudget: number;
  private staffingAndSupportBudget: number;
  private monitoringAndEvolutionBudget: number;
  private capitalItemsBudget: number;
  private managementSupportPercentage: number;
  private transportNarrative: string;
  private securityNarrative: string;
  private logisticsAndOverheadsNarrative: string;
  private staffingAndSupportNarrative: string;
  private monitoringAndEvolutionNarrative: string;
  private capitalItemsNarrative: string;
  private managementSupportNarrative: string;

  constructor(private af: AngularFire, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.loadData();
        this.loadResponsePlanData();
      } else {
        this.navigateToLogin();
      }
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
   * Private functions
   */

  private loadData() {
    this.getCountryId().then(() => {
      this.loadResponsePlanData();
    });
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

  private loadResponsePlanData() {

    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.responsePlanId;

    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlanToShow = responsePlan;

        this.loadSection1PlanLead(responsePlan);
        this.loadSection3(responsePlan);
        this.loadSection7(responsePlan);
        this.loadSection8(responsePlan);
        this.loadSection10(responsePlan);
      });
  }

  private loadSection1PlanLead(responsePlan: ResponsePlan) {

    if (responsePlan.planLead) {
      this.userService.getUser(responsePlan.planLead)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.planLeadName = user.firstName + " " + user.lastName;
        });
    } else {
      this.planLeadName = 'Unassigned';
    }
  }

  // TODO -
  private loadSection3(responsePlan: ResponsePlan) {

  }

  // TODO -
  private loadSection7(responsePlan: ResponsePlan) {

  }

  private loadSection8(responsePlan: ResponsePlan) {

    if (responsePlan.monAccLearning) {
      if (responsePlan.monAccLearning['isMedia']) {
        if (responsePlan.monAccLearning['mediaFormat'] || responsePlan.monAccLearning['mediaFormat'] == 0) {
          this.intendToVisuallyDoc = "GLOBAL.YES";
          this.mediaType = Constants.MEDIA_TYPES[responsePlan.monAccLearning['mediaFormat']];
        } else {
          this.intendToVisuallyDoc = "GLOBAL.YES";
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

        this.managementSupportPercentage = responsePlan.budget['item'][BudgetCategory.ManagementSupport] ? responsePlan.budget['item'][BudgetCategory.ManagementSupport]['budget'] : 0;
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
}
