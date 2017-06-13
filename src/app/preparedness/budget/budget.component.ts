import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Department, ActionType, ActionLevel, HazardCategory, DurationType} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";

declare var jQuery: any;

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})

export class BudgetPreparednessComponent implements OnInit, OnDestroy {
  private UserType: number;

  private uid: string;
  private countryID: string;
  private agencyID: string;

  private preparednessBudget: any = [];
  private budgetVal: number;

  private minimumPreparednessBudget: any = [];
  private advancedPreparednessBudget: any = [];

  private minimumBudgetTotal: number;
  private advancedBudgetTotal: number;
  private grandTotal: number;

  private department = Constants.DEPARTMENT;
  private departmentList: number[] = [Department.CHS, Department.Finance, Department.HR, Department.Logistics, Department.Programme];

  private actionLevel = Constants.ACTION_LEVEL;
  private actionLevelList: number[] = [ActionLevel.MPA, ActionLevel.APA];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private userService: UserService) {
    this.generateArray();
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.userService.getUserType(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(userType => {
            this.UserType = userType;
            this._loadData();
          });
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  savePreparednessBudget() {
    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/minPreparednessBudget')
      .set(this.minimumPreparednessBudget)
      .then(() => {
        console.log('success save MPA budget settings');
      }).catch((error: any) => {
      console.log(error, 'You do not have access!')
    });

    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/advPreparednessBudget')
      .set(this.advancedPreparednessBudget)
      .then(() => {
        console.log('success save APA budget settings');
      }).catch((error: any) => {
      console.log(error, 'You do not have access!')
    });
  }


  generateArray() {
    for (let dKey in this.departmentList) {
      this.minimumPreparednessBudget[dKey] = []
      this.minimumPreparednessBudget[dKey]['value'] = '';
      this.minimumPreparednessBudget[dKey]['narrative'] = '';

      this.advancedPreparednessBudget[dKey] = [];
      this.advancedPreparednessBudget[dKey]['value'] = '';
      this.advancedPreparednessBudget[dKey]['narrative'] = '';
    }
  }

  setTotal(level: string) {

    if (level == 'MPA') {
      this.minimumBudgetTotal = 0;
      this.minimumPreparednessBudget.forEach((val, key) => {
        var value = !val['value'] ? 0 : parseFloat(val['value']);
        if (value && value > 0) {
          this.minimumBudgetTotal = this.minimumBudgetTotal + value;
        }
      });
    }

    if (level == 'APA') {
      this.advancedBudgetTotal = 0;
      this.advancedPreparednessBudget.forEach((val, key) => {
        var value = !val['value'] ? 0 : parseFloat(val['value']);
        if (value && value > 0) {
          this.advancedBudgetTotal = this.advancedBudgetTotal + value;
        }
      });
    }

    this.setTotalAll();

  }

  setTotalAll() {
    var minimumTotal = this.minimumBudgetTotal && this.minimumBudgetTotal > 0 ? this.minimumBudgetTotal : 0;
    var advancedTotal = this.advancedBudgetTotal && this.advancedBudgetTotal > 0 ? this.advancedBudgetTotal : 0;
    var grandTotal = minimumTotal + advancedTotal;

    this.grandTotal = grandTotal;
  }

  _getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  _getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/countryId')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryID: any) => {
          this.countryID = countryID.$value ? countryID.$value : "";
          res(true);
        });
    });
    return promise;
  }


  _getBudgetSettings() {
    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((budgetSettings: any) => {
        if (budgetSettings && budgetSettings.minPreparednessBudget) {
          this.minimumPreparednessBudget = budgetSettings.minPreparednessBudget;
          this.setTotal('MPA');
        }
        if (budgetSettings && budgetSettings.advPreparednessBudget) {
          this.advancedPreparednessBudget = budgetSettings.advPreparednessBudget;
          this.setTotal('APA');
        }

      });
  }

  _loadData() {
    this._getAgencyID().then(() => {
      this._getCountryID().then(() => {
        this._getBudgetSettings();
      });
    });
  }

  _keyPress(event: any) {
    const pattern = /[0-9\.\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar) && event.charCode) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
