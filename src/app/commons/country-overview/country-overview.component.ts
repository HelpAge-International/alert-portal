import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../../model/message";
import {MessageModel} from "../../model/message.model";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import { AlertLevels, Countries, HazardScenario, ActionLevel, ActionType, AlertStatus, UserType } from "../../utils/Enums";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {PrepActionService, PreparednessAction} from "../../services/prepactions.service";
import { AgencyService } from "../../services/agency-service.service";
import { PageControlService } from "../../services/pagecontrol.service";

declare var jQuery: any;
@Component({
  selector: 'app-country-overview',
  templateUrl: './country-overview.component.html',
  styleUrls: ['./country-overview.component.css']
})
export class CountryOverviewComponent implements OnInit, OnDestroy {
  private _agencyId: string;
  private _systemId: string;
  private _userId: string;
  private _countryOfficeData: any;
  private _userType: number;


  @Input() set agencyId(agencyId: string){
    this._agencyId = agencyId;
    this._loadData();
  }
  
  @Input() set systemId(systemId: string){
    this._systemId = systemId;
    this._loadData();
  }

  @Input() set userId(userId: string){
    this._userId = userId;
    this._loadData();
  }

  @Input() set userType(userType: number){
    this._userType = userType;
    this._loadData();
  }

  @Input() set countryOfficeData(countryOfficeData: any){
    this._countryOfficeData = countryOfficeData;
    this._loadData();
  }

  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

  private countries = Constants.COUNTRIES;
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

  private prepActionService: PrepActionService[] = [];
  private hazardRedAlert: Map<HazardScenario, boolean>[] = [];

  constructor(private pageControl: PageControlService,
              private agencyService: AgencyService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              protected _sanitizer: DomSanitizer,
              private userService: UserService,
              private actionsService: ActionsService) {
  }

  ngOnInit() {
    this._loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  
  filterAlertLevel(event: any) {
    this.filter = event.target.value;
    this.filteredCountryOfficeData = (!this.filter || this.filter == 'all') ? this._countryOfficeData : this._countryOfficeData.filter(x => x.alertLevel === +this.filter);
  }
  _loadData() {
    if(this._userId && this._userType && this._systemId && this._agencyId && this._countryOfficeData) {
        this._getSystemThreshold('minThreshold').then((minTreshold: any) => {
          this.minTreshold = minTreshold;
          
          this._getSystemThreshold('advThreshold').then((advTreshold: any) => {
            this.advTreshold = advTreshold;

            this._countryOfficeData.forEach(countryOffice => {
              this.prepActionService[countryOffice.$key]= new PrepActionService();
              this.hazardRedAlert[countryOffice.$key] = new Map<HazardScenario, boolean>();

              this._getResponsePlans(countryOffice);
              this._getAlertLevel(countryOffice);

              this.prepActionService[countryOffice.$key].initActionsWithInfo(this.af, this.ngUnsubscribe, this._userId, this._userType, null, countryOffice.$key, this._agencyId, this._systemId)
              
              this.prepActionService[countryOffice.$key].addUpdater(() => {
                this.recalculateAll(countryOffice);
              });
            });

            this.filteredCountryOfficeData = this._countryOfficeData;
          });
        });
    }
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
      this.af.database.list(Constants.APP_STATUS + "/system/" + this._systemId + '/' + tresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((treshold: any) => {
          res(treshold);
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  protected getBackground(location) {
    if (location)
      return this._sanitizer.bypassSecurityTrustStyle('url(/assets/images/countries/' + this.CountriesEnum[location] + '.svg)');
  }

  overviewCountry(countryId) {
    if(this._userType == UserType.CountryAdmin)
    {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": countryId,
        "isViewing": true,
        "agencyId": this._agencyId,
        "systemId": this._systemId,
        "canCopy": true
      }]);
    }
  }
}
