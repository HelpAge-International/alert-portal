import {Component, OnDestroy, OnInit} from "@angular/core";
import { AlertLevels, Countries, AlertStatus, ActionLevel, ActionType, HazardScenario } from "../../utils/Enums";
import {DomSanitizer} from "@angular/platform-browser";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {AgencyService} from "../../services/agency-service.service";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {PrepActionService, PreparednessAction} from "../../services/prepactions.service";

@Component({
  selector: 'app-country-account-settings',
  templateUrl: './country-my-agency.component.html',
  styleUrls: ['./country-my-agency.component.css'],
  providers: [ActionsService]
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
  private filteredCountryOfficeData: any = [];
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

  private prepActionService: PrepActionService[] = [];
  private hazardRedAlert: Map<HazardScenario, boolean>[] = [];

  constructor(private pageControl: PageControlService,
              private agencyService: AgencyService,
              private route: ActivatedRoute, private af: AngularFire,
              private router: Router,
              protected _sanitizer: DomSanitizer,
              private userService: UserService,
              private actionsService: ActionsService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;
      this.userService.getCountryId(Constants.USER_PATHS[this.UserType], this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryId => {
          this.countryId = countryId;
          this._loadData();
        });

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  filterAlertLevel(event: any) {
    this.filter = event.target.value;
    this.filteredCountryOfficeData = (!this.filter || this.filter == 'all') ? this.countryOfficeData : this.countryOfficeData.filter(x => x.alertLevel === +this.filter);
  }

  _loadData() {
    this._getAgencyID().then(() => {
      this._getCountryList().then(() => {
        
        this._getSystemAdminID().then(() => {
          this._getSystemThreshold('minThreshold').then((minTreshold: any) => {
            this.minTreshold = minTreshold;
          });
          this._getSystemThreshold('advThreshold').then((advTreshold: any) => {
            this.advTreshold = advTreshold;
          });
        }).then(() => {
            this.countryOfficeData.forEach(countryOffice => {
              this.prepActionService[countryOffice.$key]= new PrepActionService();
              this.hazardRedAlert[countryOffice.$key] = new Map<HazardScenario, boolean>();

              this._getResponsePlans(countryOffice);
              this._getAlertLevel(countryOffice);
              this.prepActionService[countryOffice.$key].addUpdater(() => {
                this.recalculateAll(countryOffice);
              });
              this.prepActionService[countryOffice.$key].initActionsWithInfo(this.af, this.ngUnsubscribe, this.uid, this.UserType, null, countryOffice.$key, this.agencyID, this.systemAdminID)
           })

           this.filteredCountryOfficeData = this.countryOfficeData;
        });
      });
    });
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
          this.countryOfficeData = [];
          this.countryOfficeData = countries.filter(country => country.$key != this.countryId);
          
          res(true);
        });
    });
    return promise;
  }

  _getResponsePlans(countryOffice) {
    let promise = new Promise((res, rej) => {
        this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryOffice.$key)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((responsePlans: any) => {
            this._getCountApprovalStatus(responsePlans, countryOffice.$key);
            res(true);
          });
    });
    return promise;
  }

  _getAlertLevel(countryOffice) {
    countryOffice.alertLevel = AlertLevels.Green;
    this.actionsService.getAlerts(countryOffice.$key)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alerts: ModelAlert[]) => {
        alerts.forEach(alert => {
          this.hazardRedAlert[countryOffice.$key].set(alert.hazardScenario, false);
          if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
            countryOffice.alertLevel = AlertLevels.Red;
            this.hazardRedAlert[countryOffice.$key].set(alert.hazardScenario, true);
          }
          if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))
            || (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse)) {
            countryOffice.alertLevel = AlertLevels.Amber;
          }
        });
      });
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

  private recalculateAll(countryOffice) {
    let countryID = countryOffice.$key;
    let minTotal: number = 0;
    let minGreen: number = 0;
    let advTotal: number = 0;
    let advGreen: number = 0;
    let chsTotal: number = 0;
    let chsGreen: number = 0;

    let minPrepPercentage: number;
    let advPrepPercentage: number;
  
    for (let x of this.prepActionService[countryOffice.$key].actions) {
      if (x.level == ActionLevel.MPA) {
        minTotal++;
        if (this.isActionCompleted(x, countryID)) {
          minGreen++;
        }
      }
      else if (x.level == ActionLevel.APA) {
        advTotal++;
        if (this.isActionCompleted(x, countryID)) {
          advGreen++;
        }
      }
      if (x.type == ActionType.chs) {
        chsTotal++;
        if (this.isActionCompleted(x, countryID)) {
          chsGreen++;
        }
      }
    }
    minPrepPercentage = minTotal == 0 ? 0 : (minGreen * 100) / minTotal;
    advPrepPercentage = advTotal == 0 ? 0 : (advGreen * 100) / advTotal;
    this.percentageCHS[countryID] = chsTotal == 0 ? 0 : (chsGreen * 100) / chsTotal;
    
    if (minTotal == 0) {
      this.mpaStatusColors[countryID] = 'grey';
      this.mpaStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (minPrepPercentage >= this.advTreshold[0].$value) {
        this.mpaStatusColors[countryID] = 'green';
        this.mpaStatusIcons[countryID] = 'fa-check';
      }
      else if (minPrepPercentage >= this.advTreshold[1].$value) {
        this.mpaStatusColors[countryID] = 'orange';
        this.mpaStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.mpaStatusColors[countryID] = 'red';
        this.mpaStatusIcons[countryID] = 'fa-times';
      }
    }
    if (advTotal == 0) {
      this.advStatusColors[countryID] = 'grey';
      this.advStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (advPrepPercentage >= this.advTreshold[0].$value) {
        this.advStatusColors[countryID] = 'green';
        this.advStatusIcons[countryID] = 'fa-check';
      }
      else if (advPrepPercentage >= this.advTreshold[1].$value) {
        this.advStatusColors[countryID] = 'orange';
        this.advStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.advStatusColors[countryID] = 'red';
        this.advStatusIcons[countryID] = 'fa-times';
      }
    }
  }

  private isActionCompleted(action: PreparednessAction, countryID) {
    let date = new Date().getTime();
    if (action.isArchived == true) {
      return false;
    }
    if (action.level == ActionLevel.APA) {
      if (action.isRedAlertActive(this.hazardRedAlert[countryID]) && action.isComplete != null) {
        return action.isCompleteAt + action.computedClockSetting > date;
      }
    }
    else if (action.level == ActionLevel.MPA) {
      if (action.isComplete != null) {
        return action.isCompleteAt + action.computedClockSetting > date;
      }
    }
    return false;
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
    this.router.navigate(["/dashboard/dashboard-overview", {
      "countryId": countryId,
      "isViewing": true,
      "agencyId": this.agencyID,
      "systemId": this.systemAdminID,
      "canCopy": true
    }]);
  }


}
