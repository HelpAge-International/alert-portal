import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {AlertLevels, Countries} from "../utils/Enums";
import {UserService} from "../services/user.service";
import {ActionsService} from "../services/actions.service";
import * as moment from "moment";
import {Subject} from "rxjs/Subject";
import {HazardImages} from "../utils/HazardImages";
import {ModelAlert} from "../model/alert.model";
import {
  ChronolineEvent,
  DashboardSeasonalCalendarComponent
} from "./dashboard-seasonal-calendar/dashboard-seasonal-calendar.component";
declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ActionsService]
})

export class DashboardComponent implements OnInit, OnDestroy {

  private HAZARDS: string[] = Constants.HAZARD_SCENARIOS;

  private alertList: ModelAlert[];

  // TODO - Check when other users are implemented
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;
  private actionsToday = [];
  private actionsThisWeek = [];
  private indicatorsToday = [];
  private indicatorsThisWeek = [];

  private countryLocation: any;

  private AlertLevels = AlertLevels;

  private alerts: Observable<any>;

  private hazards: any[] = [];
  private numberOfIndicatorsObject = {};
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private countryContextIndicators: any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private seasonEvents = [];
  private chronoline;

  constructor(private af: AngularFire, private router: Router, private userService: UserService, private actionService: ActionsService) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.loadData();
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  /**
   * Private functions
   */

  private loadData() {
    this.getCountryId().then(() => {
      this.getAllSeasonsForCountryId(this.countryId);
      this.getAlerts();
      this.getCountryContextIndicators();
      this.getHazards();
      this.initData();
    });
    this.getAgencyID().then(() => {
      this.getCountryData();
    });
  }

  public getAllSeasonsForCountryId(countryId: string) {
    this.af.database.object(Constants.APP_STATUS + "/season/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snapshot => {
        this.seasonEvents = [
          ChronolineEvent.create(1, DashboardSeasonalCalendarComponent.spanModelCalendar())
        ];
        let i = 2;
        snapshot.forEach((seasonInfo) => {
          let x: ChronolineEvent = ChronolineEvent.create(i, seasonInfo.val());
          this.seasonEvents.push(x);
          i++;
        });
        this.initCalendar();
        // Init map here after replacing the entire array
      });
  }

  private initCalendar() {
    // Element is removed and re-added upon a data change
    document.getElementById("target2").innerHTML = "";
    this.chronoline = new Chronoline(document.getElementById("target2"), this.seasonEvents,
      {
        visibleSpan: DAY_IN_MILLISECONDS * 91,
        animated: true,
        tooltips: true,
        sectionLabelAttrs: {'fill': '#997e3d', 'font-weight': 'bold'},
        labelInterval: isFifthDay,
        hashInterval: isFifthDay,
        scrollLeft: prevMonth,
        scrollRight: nextMonth,
        // markToday: 'labelBox',
        draggable: true
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

  private getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyAdminUid = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }


  private initData() {
    let startOfToday = moment().startOf("day").valueOf();
    let endOfToday = moment().endOf("day").valueOf();
    this.actionService.getActionsDueInWeek(this.countryId, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(actions => {
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday);
        this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday);
      });

    this.actionService.getIndicatorsDueInWeek(this.countryId, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(indicators => {
        let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
        let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
        if (dayIndicators.length > 0) {
          dayIndicators.forEach(indicator => {
            if (this.actionService.isExist(indicator.$key, this.indicatorsToday)) {
              let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsToday);
              if (index != -1) {
                this.indicatorsToday[index] = indicator;
              }
            } else {
              this.indicatorsToday.push(indicator);
            }
          });
        }
        if (weekIndicators.length > 0) {
          weekIndicators.forEach(indicator => {
            if (this.actionService.isExist(indicator.$key, this.indicatorsThisWeek)) {
              let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsThisWeek);
              if (index != -1) {
                this.indicatorsThisWeek[index] = indicator;
              }
            } else {
              this.indicatorsThisWeek.push(indicator);
            }
          });
        }
      });
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyAdminUid + '/' + this.countryId + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          res(true);
        });
    });
    return promise;
  }

  private getAlerts() {
    this.alerts = this.actionService.getAlerts(this.countryId);
    this.alerts
      .subscribe(x => {
        console.log(x)
      })
    // this.actionService.getAlerts(this.countryId)
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(alertList => {
    //     console.log(alertList);
    //   })

  }

  private getHazards() {

    this.af.database.list(Constants.APP_STATUS + '/hazard/' + this.countryId)
      .flatMap(list => {
        this.hazards = [];
        let tempList = [];
        list.forEach(hazard => {
          this.hazards.push(hazard);
          tempList.push(hazard);
        });
        return Observable.from(tempList)
      })
      .flatMap(hazard => {
        return this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key);
      })
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(object => {
        this.numberOfIndicatorsObject[object.$key] = Object.keys(object).length;
      });
  }

  private getCountryContextIndicators() {

    this.af.database.list(Constants.APP_STATUS + '/indicator/' + this.countryId)
      .subscribe(list => {
        list.forEach(indicator => {
          this.countryContextIndicators.push(indicator);
        });
      });
  }

  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  getActionTitle(action): string {
    return this.actionService.getActionTitle(action);
  }

  getIndicatorName(indicator): string {
    return this.actionService.getIndicatorTitle(indicator);
  }

  updateAlert(alertId) {
    this.router.navigate(['/dashboard/dashboard-update-alert-level/', {id: alertId, countryId: this.countryId}]);
  }


}
