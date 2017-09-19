import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ActionLevel, AlertMessageType, Currency} from "../../utils/Enums";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";

import {AlertMessageModel} from "../../model/alert-message.model";
import {ModelDepartment} from "../../model/department.model";


declare var jQuery: any;

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})

export class BudgetPreparednessComponent implements OnInit, OnDestroy {
  private UserType: number;

  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  private uid: string;
  private countryId: string;
  private agencyId: string;
  private departments: ModelDepartment[] = [];
  private advPrepNarrative: any = {};
  private minPrepNarrative: any = {};
  private minBudget: Map<string, number> = new Map<string, number>();
  private advBudget: Map<string, number> = new Map<string, number>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isViewing: boolean;

  public minTotal: number;
  public advTotal: number;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
  }

  ngOnInit() {

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
      });

    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.UserType = userType;
      if (!(this.countryId != null && this.agencyId != null && this.isViewing)) {
        this.agencyId = agencyId;
        this.countryId = countryId;
      }
      this.populateDepartments();
      this.populateNarratives();
      this.populateBudgets();
      this.calculateCurrency();
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
  public calculateCurrency() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/currency", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.currency = snap.val();
      });
  }

  /**
   * Generate an array of departments
   */
  public populateDepartments() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.departments = [];
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
        });
      });
  }

  /**
   * Generate a map of string -> string for departmentId -> narrative
   */
  public populateNarratives() {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.advPrepNarrative = {};
        for (let x in snap.val().advPreparednessBudget) {
          this.advPrepNarrative[x] = snap.val().advPreparednessBudget[x].narrative;
        }
        this.minPrepNarrative = {};
        for (let x in snap.val().minPreparednessBudget) {
          this.minPrepNarrative[x] = snap.val().minPreparednessBudget[x].narrative;
        }
      });
  }

  /**
   * Process the actions under my countryid and sum the budgets
   */
  public populateBudgets() {
    this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.minBudget.clear();
        this.advBudget.clear();
        this.minTotal = 0;
        this.advTotal = 0;
        snap.forEach((snapshot) => {
          if (snapshot.val() != null && snapshot.val().hasOwnProperty('budget') && snapshot.val().hasOwnProperty('department') && snapshot.val().hasOwnProperty('type')) {
            if (snapshot.val().level == ActionLevel.APA) {
              let x: number = this.advBudget.get(snapshot.val().department) ? this.advBudget.get(snapshot.val().department) : 0;
              x += snapshot.val().budget;
              this.advTotal += snapshot.val().budget;
              this.advBudget.set(snapshot.val().department, x);
            }
            else {
              let x: number = this.minBudget.get(snapshot.val().department) ? this.minBudget.get(snapshot.val().department) : 0;
              x += snapshot.val().budget;
              this.minTotal += snapshot.val().budget;
              this.minBudget.set(snapshot.val().department, x);
            }
          }
        });
      });
  }

  /**
   * Method to save the narratives of the budgets
   */
  public saveNarratives() {
    console.log(this.advPrepNarrative);
    console.log(this.minPrepNarrative);
    let minPrepUpdate = {};
    for (let x in this.minPrepNarrative) {
      minPrepUpdate[x] = {};
      minPrepUpdate[x].narrative = this.minPrepNarrative[x];
    }
    let advPrepUpdate = {};
    for (let x in this.advPrepNarrative) {
      advPrepUpdate[x] = {};
      advPrepUpdate[x].narrative = this.advPrepNarrative[x];
    }
    let totalUpdateObj = {
      minPreparednessBudget: minPrepUpdate,
      advPreparednessBudget: advPrepUpdate
    };
    console.log(totalUpdateObj);
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId).update(totalUpdateObj)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('SYSTEM_ADMIN.ACTIONS.EDIT_CONFIRM_SAVE_CHANGES', AlertMessageType.Success);
      })
      .catch(() => {
        this.alertMessage = new AlertMessageModel('PREPAREDNESS.BUDGET_NARRATIVE_ERROR', AlertMessageType.Error);
      });
  }
}
