import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertLevels, Countries} from "../../utils/Enums";
import {DomSanitizer} from "@angular/platform-browser";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {AgencyService} from "../../services/agency-service.service";

@Component({
  selector: 'app-country-account-settings',
  templateUrl: './country-my-agency.component.html',
  styleUrls: ['./country-my-agency.component.css']
})

export class CountryMyAgencyComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyID: string;
  private systemAdminID: string;
  private countryId: string;

  private agencyName: string = '';
  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

  private countries = Constants.COUNTRIES;
  private countryOfficeData: any = [];
  private countryIDs: string[] = [];
  protected CountriesEnum = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];

  private countResponsePlans: any = [];
  private count: number = 0;
  private percentageCHS: any = [];

  private filter: any = 'all';

  private minTreshold: any = [];
  private advTreshold: any = [];

  private mpaStatusIcons: any = [];
  private mpaStatusColors: any = [];
  private advStatusIcons: any = [];
  private advStatusColors: any = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private UserType: number;


  constructor(private pageControl: PageControlService, private agencyService: AgencyService, private route: ActivatedRoute, private af: AngularFire, private router: Router, protected _sanitizer: DomSanitizer, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.UserType = userType;
      this.countryId = countryId;
      this.agencyID = agencyId;
      this.systemAdminID = systemId;
      this.getAgencyName();
      this._loadData();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  filterAlertLevel(event: any) {
    this.filter = event.target.value;
    console.log(this.filter);
    this._getCountryList();
  }

  _loadData() {
    // this._getAgencyID().then(() => {
    this._getCountryList().then(() => {
      this._getResponsePlans();
      this._getSystemAdminID().then(() => {
        this._getSystemThreshold('minThreshold').then((minTreshold: any) => {
          this.minTreshold = minTreshold;
        });
        this._getSystemThreshold('advThreshold').then((advTreshold: any) => {
          this.advTreshold = advTreshold;
        });
      }).then(() => {
        this._getAllActions();
      });
    });
    // });
  }

  _getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          this.getAgencyName();
          res(true);
        });
    });
    return promise;
  }

  private getAgencyName() {

    if (this.agencyID) {
      this.agencyService.getAgency(this.agencyID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agency => {
          this.agencyName = agency.name;
        })
    }
  }

  _getCountryList() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countries: any) => {
          console.log(countries)
          this.countryOfficeData = [];
          this.countryIDs = [];
          if (this.filter == 'all') {
            this.countryOfficeData = countries.filter(country => country.$key != this.countryId);
            countries.forEach((val, key) => {
              if (this.countryId != val.$key) {
                this.countryIDs.push(val.$key);
              }
            });
          } else {
            // TODO filter is not working properly
            countries.forEach((val, key) => {
              if (val.alertLevel == this.filter && this.countryId != val.$key) {
                this.countryOfficeData.push(val);
                this.countryIDs.push(val.$key);
              }
            });
          }
          res(true);
        });
    });
    return promise;
  }

  _getResponsePlans() {
    let promise = new Promise((res, rej) => {
      this.countryIDs.forEach((countryID) => {
        this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryID)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((responsePlans: any) => {
            this._getCountApprovalStatus(responsePlans, countryID);
            res(true);
          });
      });
    });
    return promise;
  }

  _getCountApprovalStatus(responsePlans: any, countryID: string) {
    responsePlans.forEach((responsePlan: any) => {
      var approvals = responsePlan.approval;
      this.count = 0;
      this._recursiveParseArray(approvals, countryID);
    });
  }

  _recursiveParseArray(approvals: any, countryID: string) {
    for (let A in approvals) {
      if (typeof (approvals[A]) == 'object') {
        this._recursiveParseArray(approvals[A], countryID);
      } else {
        var approvalStatus = approvals[A];
        if (approvalStatus == 2) {
          this.count = this.count + 1;
          this.countResponsePlans[countryID] = this.count;
        }
      }
    }
  }

  _getAllActions() {
    let promise = new Promise((res, rej) => {
      this.countryIDs.forEach((countryID) => {
        this.af.database.list(Constants.APP_STATUS + "/action/" + countryID)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((actions: any) => {
            this._getPercenteActions(actions, countryID);
            res(true);
          });
      });
    });
    return promise;
  }


  _getSystemThreshold(tresholdType: string) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminID + '/' + tresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((treshold: any) => {
          res(treshold);
        });
    });
    return promise;
  }

  _getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.systemAdminID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  _getPercenteActions(actions: any, countryID: string) {

    let promise = new Promise((res, rej) => {
      var countAllMinimumActions = 0;
      var countAllAdvancedActions = 0;
      var countCompletedMinimumActions = 0;
      var countCompletedAdvancedActions = 0;
      var countCompletedAllActions = 0;

      actions.forEach((action: any) => {
        if (action.level == 1) {
          countAllMinimumActions = countAllMinimumActions + 1;
          if (action.actionStatus == 2) {
            countCompletedMinimumActions = countCompletedMinimumActions + 1;
          }
        }

        if (action.level == 2) {
          countAllAdvancedActions = countAllAdvancedActions + 1;
          if (action.actionStatus == 2) {
            countCompletedAdvancedActions = countCompletedAdvancedActions + 1;
          }
        }

        if (action.actionStatus == 2) {
          countCompletedAllActions = countCompletedAllActions + 1;
        }
      });

      var percentageMinimumCompletedActions = (countCompletedMinimumActions / countAllMinimumActions) * 100;
      percentageMinimumCompletedActions = percentageMinimumCompletedActions ? percentageMinimumCompletedActions : 0;

      var percentageAdvancedCompletedActions = (countCompletedAdvancedActions / countAllAdvancedActions) * 100;
      percentageAdvancedCompletedActions = percentageAdvancedCompletedActions ? percentageAdvancedCompletedActions : 0;

      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.minTreshold[0].$value) {
        this.mpaStatusColors[countryID] = 'green';
        this.mpaStatusIcons[countryID] = 'fa-check';
      }
      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.minTreshold[1].$value) {
        this.mpaStatusColors[countryID] = 'orange';
        this.mpaStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      if (!percentageMinimumCompletedActions) {
        this.mpaStatusColors[countryID] = 'red';
        this.mpaStatusIcons[countryID] = 'fa-times'
      }


      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.advTreshold[0].$value) {
        this.advStatusColors[countryID] = 'green';
        this.advStatusIcons[countryID] = 'fa-check';
      }
      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.advTreshold[1].$value) {
        this.advStatusColors[countryID] = 'orange';
        this.advStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      if (!percentageAdvancedCompletedActions) {
        this.advStatusColors[countryID] = 'red';
        this.advStatusIcons[countryID] = 'fa-times'
      }

      this._getActionsBySystemAdmin().then((actions: any) => {
        var countAllActionsSysAdmin = actions.length && actions.length > 0 ? actions.length : 0;
        this.percentageCHS[countryID] = Math.round((countCompletedAllActions / countAllActionsSysAdmin) * 100);
      });

      res(true);
    });

    return promise;
  }

  _getActionsBySystemAdmin() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((actions: any) => {
          res(actions);
        });
    });
    return promise;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  protected getBackground(location) {
    if (location)
      return this._sanitizer.bypassSecurityTrustStyle('url(/assets/images/countries/' + this.CountriesEnum[location] + '.svg)');
  }

  overviewCountry(countryId) {
    console.log(countryId);
    this.router.navigate(["/dashboard/dashboard-overview", {
      "countryId": countryId,
      "isViewing": true,
      "agencyId": this.agencyID,
      "systemId": this.systemAdminID,
      "canCopy": true
    }]);
  }


}
