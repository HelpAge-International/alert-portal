import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {ModelSeason} from "../../model/season.model";
declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;

@Component({
  selector: 'app-dashboard-seasonal-calendar',
  templateUrl: './dashboard-seasonal-calendar.component.html',
  styleUrls: ['./dashboard-seasonal-calendar.component.css']
})
export class DashboardSeasonalCalendarComponent implements OnInit, OnDestroy {

  // TODO - Check when other users are implemented
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private currentSpanMultiplierIsMonth: boolean = true;
  private init: boolean = false;

  private currentChronolineInstance;

  private static WEEK_SPAN_DAY_MULTIPLIER = 30;
  private static MONTH_SPAN_DAY_MULTIPLIER = 91;
  private static RANGE_SPAN_DAYS = 365;

  public setMonthView() {
    this.currentSpanMultiplierIsMonth = true;
    this.reinitCalendar();
  }

  public setWeekView() {
    this.currentSpanMultiplierIsMonth = false;
    this.reinitCalendar();
  }

  private reinitCalendar() {
    // Stop synchronisation issue (ie. Someone click Weekly before calendar is loaded)
    if (this.init) {
      this.initCalendar();
    }
  }

  private seasonEvents = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.getCountryId().then(() => {
          this.getAllSeasonsForCountryId(this.countryId);
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

  public static spanModelCalendar() {
    // Blank calendar object which will allow the full span to load properly of the calendar
    let daysPlusMinus = DashboardSeasonalCalendarComponent.RANGE_SPAN_DAYS;
    let d = new Date();
    return new ModelSeason("#00131D50", d.getTime() - (daysPlusMinus * (1000 * 60 * 60 * 24)),  d.getTime() + (daysPlusMinus * (1000 * 60 * 60 * 24)), "Name")
  }

  private initCalendar() {
    // To show weekly calendar ----> Change visibleSpan to 'DAY_IN_MILLISECONDS * 30'
    document.getElementById("target2").innerHTML = "";
    this.currentChronolineInstance = new Chronoline(document.getElementById("target2"), this.seasonEvents,
      {
        visibleSpan: DAY_IN_MILLISECONDS * (this.currentSpanMultiplierIsMonth ?
          DashboardSeasonalCalendarComponent.MONTH_SPAN_DAY_MULTIPLIER :
          DashboardSeasonalCalendarComponent.WEEK_SPAN_DAY_MULTIPLIER),
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
    this.currentChronolineInstance.goToDate(new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 7)), 1);
    this.init = true;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}

export class ChronolineEvent {
  private dates: Date[];
  private title: string;
  private eventHeight: number;
  private section: 1;
  private attrs: {fill: string, stroke: string};

  constructor() {
    this.attrs = {
      fill: "#131D50",
      stroke: "#131D50"
    }
  }

  public static create(index: number, season: ModelSeason): ChronolineEvent {
    let event: ChronolineEvent = new ChronolineEvent();
    event.dates = [new Date(season.startTime), new Date(season.endTime)];
    if (season.endTime < season.startTime) {
      console.log("Database error with season " + season.name + ". Start time is before end time. " +
        "This will cause the item to still be rendered correctly)");
      event.dates = [new Date(season.endTime), new Date(season.startTime)];
    }
    event.title = season.name;
    event.eventHeight = index * 10;
    event.section = 1;
    event.attrs.fill = season.colorCode;
    event.attrs.stroke = season.colorCode;
    return event;
  }
}

