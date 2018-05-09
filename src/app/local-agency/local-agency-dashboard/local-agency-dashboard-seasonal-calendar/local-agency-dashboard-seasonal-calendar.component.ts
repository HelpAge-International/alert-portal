import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject} from "rxjs";
import {Constants} from "../../../utils/Constants";
import {ModelSeason} from "../../../model/season.model";
import {ColourSelector} from "../../../utils/ColourSelector";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {LocalStorageService} from "angular-2-local-storage";

declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;
declare var jQuery: any;

@Component({
  selector: 'app-local-agency-dashboard-seasonal-calendar',
  templateUrl: './local-agency-dashboard-seasonal-calendar.component.html',
  styleUrls: ['./local-agency-dashboard-seasonal-calendar.component.scss']
})
export class LocalAgencyDashboardSeasonalCalendarComponent implements OnInit, OnDestroy {

  private static WEEK_SPAN_DAY_MULTIPLIER = 30;
  private static MONTH_SPAN_DAY_MULTIPLIER = 91;
  private static HALFYEAR_SPAN_DAY_MULTIPLIER = 182;
  private static RANGE_SPAN_DAYS = 365;

  // TODO - Check when other users are implemented
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyId: string;
  private currentSpanMultiplierIsMonth: boolean = true;
  private init: boolean = false;
  private currentChronolineInstance;

  public addSeasonName: string;
  public addSeasonStart: number;
  public addSeasonEnd: number;
  private seasons: string;
  public addSeasonColour: string;
  private colours: ColourSelector[] = ColourSelector.list();
  private seasonEvents = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public edit: boolean = false;
  public editSeasonKey: string;

  public addSeasonEndDate: number;
  public addSeasonStartDate: number;

  //for network
  @Input() isNetworkCountry: boolean;
  @Input() isLocalNetworkAdmin: boolean;
  private networkCountryId: string;
  private isViewing: boolean = false;
  private networkViewValues: {};

  private CalendarSpans = Object.freeze({"Days":0, "Months":1, "Year":2});
  private currentSpan: number;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private storageService: LocalStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.currentSpan = this.CalendarSpans.Months;
    this.route.params.subscribe((params: Params) => {
      if (params["isViewing"] && params["systemId"] && params["agencyId"] && params["countryId"] && params["userType"] && params["networkId"] && params["networkCountryId"]) {
        this.isViewing = params["isViewing"];
        this.countryId = params["countryId"];
        this.agencyId = params["agencyId"];
        this.networkCountryId = params["networkCountryId"];
        this.uid = params["uid"]
        this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
      } else {
        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.agencyId = agencyId;
          this.getAllSeasonsForCountryId(this.agencyId);
        });
      }
      this.normalAccess();
    })

  }

  private normalAccess() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.getAllSeasonsForCountryId(this.agencyId);
    });
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.clearStorage()
  }

  /**
   * Ran when "View as 6 months" is clicked. Changes filter and re-initialised the Chronoline map
   */
  public setHalfYearView() {
    this.currentSpan = this.CalendarSpans.Year;
    this.reinitCalendar();
  }

  /**
   * Ran when "View as 3 months" is clicked. Changes filter and re-initialised the Chronoline map
   */
  public setMonthView() {
    this.currentSpan = this.CalendarSpans.Months;
    this.reinitCalendar();
  }

  /**
   * Ran when "View as weeks" is clicked. Changes filter and re-initialised the Chronoline map
   */
  public setWeekView() {
    this.currentSpan = this.CalendarSpans.Days;
    this.reinitCalendar();
  }

  /**
   * Reinitialises the calendar
   */
  private reinitCalendar() {
    // Stop synchronisation issue (ie. Someone click Weekly before calendar is loaded)
    if (this.init) {
      this.initCalendar();
    }
  }


  /**
   * Pulls all the data from /seasons/ node in firebase and initialises the calendar
   * Note: Object is used here because the map needs to be re-initialised. Object allows
   * me to not have to track which item has changed opposed to list
   */
  public getAllSeasonsForCountryId(countryId: string) {
    let agencyCountry = this.storageService.get(Constants.NETWORK_CALENDAR);
    this.af.database.object(Constants.APP_STATUS + "/season/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snapshot => {
        this.seasonEvents = [
          ChronolineEvent.create(1, LocalAgencyDashboardSeasonalCalendarComponent.spanModelCalendar(), <LocalAgencyDashboardSeasonalCalendarComponent> this),
          ChronolineEvent.create(1, LocalAgencyDashboardSeasonalCalendarComponent.spanModelCalendar(), <LocalAgencyDashboardSeasonalCalendarComponent> this)
        ];
        let i = 2;
        snapshot.forEach((seasonInfo) => {
          let x: ChronolineEvent = ChronolineEvent.create(i, seasonInfo.val(), <LocalAgencyDashboardSeasonalCalendarComponent> this, seasonInfo.key);
          this.seasonEvents.push(x);
          i++;
        });
        !agencyCountry ? this.initCalendar()
          :
          Object.keys(agencyCountry).forEach(agencyId => {
            console.log(agencyId)
            console.log(agencyCountry[agencyId])
            console.log(agencyCountry[agencyId][1])
            //data pulled from storage is strange, need to check
            this.af.database.object(Constants.APP_STATUS + "/season/" + agencyCountry[agencyId][1], {preserveSnapshot: true})
              .takeUntil(this.ngUnsubscribe)
              .subscribe(snapshot => {
                let i = 100;
                snapshot.forEach((seasonInfo) => {
                  let x: ChronolineEvent = ChronolineEvent.create(i, seasonInfo.val());
                  this.seasonEvents.push(x);
                  i++;
                });
                this.initCalendar();
              })
          })
        console.log(this.seasonEvents, this.agencyId);
      });
  }

  /**
   * Model Chronoline item. Chronoline only shows span of max and min items, so blank item is shown which spans +/- RANGE_SPAN_DAYS
   */
  public static spanModelCalendar() {
    // Blank calendar object which will allow the full span to load properly of the calendar
    let daysPlusMinus = LocalAgencyDashboardSeasonalCalendarComponent.RANGE_SPAN_DAYS;
    let d = new Date();
    return new ModelSeason("#00131D50", "Name", d.getTime() - (daysPlusMinus * (1000 * 60 * 60 * 24)), d.getTime() + (daysPlusMinus * (1000 * 60 * 60 * 24)))
  }

  /**
   * Initialise the calendar
   */
  private initCalendar() {
    // To show weekly calendar ----> Change visibleSpan to 'DAY_IN_MILLISECONDS * 30'
    document.getElementById("target2").innerHTML = "";
    this.currentChronolineInstance = new Chronoline(document.getElementById("target2"), this.seasonEvents,
      {
        visibleSpan: this.setCalendarSpan(this.currentSpan),
        animated: true,
        tooltips: true,
        sectionLabelAttrs: {'fill': '#997e3d', 'font-weight': 'bold'},
        labelInterval: isFifthDay,
        hashInterval: isFifthDay,
        scrollLeft: prevMonth,
        scrollRight: nextMonth,
        eventHeight: 15,
        // markToday: 'labelBox',
        draggable: true
      });
    this.currentChronolineInstance.goToDate(new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 7)), -1);
    this.init = true;
  }

  private setCalendarSpan(spanName) {
    switch(spanName){
      case this.CalendarSpans.Days :
        return DAY_IN_MILLISECONDS * LocalAgencyDashboardSeasonalCalendarComponent.WEEK_SPAN_DAY_MULTIPLIER;
      case this.CalendarSpans.Months :
        return DAY_IN_MILLISECONDS * LocalAgencyDashboardSeasonalCalendarComponent.MONTH_SPAN_DAY_MULTIPLIER;
      case this.CalendarSpans.Year :
        return DAY_IN_MILLISECONDS * LocalAgencyDashboardSeasonalCalendarComponent.HALFYEAR_SPAN_DAY_MULTIPLIER;
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  public saveCalendarInfo() {
    console.log("Saving!");
    console.log(this.addSeasonColour);
    if (this.addSeasonName == null) {
      //TODO: Error handling!
      console.error("Season Name Error Handling!");
      return;
    }
    if (this.addSeasonColour == null) {
      //TODO: Error handling!
      console.error("Season Colour Error Handling!");
      return;
    }
    if (this.addSeasonStart == null) {
      //TODO: Error handling
      console.error("Start Season Error Handling!");
      return;
    }
    if (this.addSeasonEnd == null) {
      //TODO: Error handling
      console.error("End Season Error Handling!");
      return;
    }
    console.log(this.addSeasonStart);
    console.log(this.addSeasonEnd);
    console.log(this.addSeasonName);
    console.log(this.addSeasonColour);
    let season: ModelSeason = new ModelSeason(this.addSeasonColour, this.addSeasonName, this.addSeasonStart, this.addSeasonEnd);
    console.log(season);
    let id = this.isNetworkCountry || this.isLocalNetworkAdmin ? this.networkCountryId : this.countryId;
    this.af.database.list(Constants.APP_STATUS + "/season/" + id + "/").push(season);
    // Below line wasn't working when I was trying to hide it!
    // jQuery("#add_calendar").modal("hide");
  }

  public editCalendarInfo() {
    console.log("Saving edited!");
    if (this.addSeasonName == null) {
      //TODO: Error handling!
      console.error("Season Name Error Handling!");
      return;
    }
    if (this.addSeasonColour == null) {
      //TODO: Error handling!
      console.error("Season Colour Error Handling!");
      return;
    }
    if (this.addSeasonStart == null) {
      //TODO: Error handling
      console.error("Start Season Error Handling!");
      return;
    }
    if (this.addSeasonEnd == null) {
      //TODO: Error handling
      console.error("End Season Error Handling!");
      return;
    }
    let season: ModelSeason = new ModelSeason(this.addSeasonColour, this.addSeasonName, this.addSeasonStart, this.addSeasonEnd);

    console.log("edit for key " + this.editSeasonKey);
    console.log(season);
    console.log(Constants.APP_STATUS + "/season/" + this.countryId + "/" + this.editSeasonKey);

    let id = this.isNetworkCountry || this.isLocalNetworkAdmin ? this.networkCountryId : this.countryId;
    this.af.database.object(Constants.APP_STATUS + "/season/" + id + "/" + this.editSeasonKey).update(season);
    // Below line wasn't working when I was trying to hide it!
    // jQuery("#add_calendar").modal("hide");
  }

  public deleteSeason() {
    let id = this.isNetworkCountry || this.isLocalNetworkAdmin ? this.networkCountryId : this.countryId;
    this.af.database.object(Constants.APP_STATUS + "/season/" + id + "/" + this.editSeasonKey).remove();
  }

  public setCurrentColour(colourCode: string) {
    this.addSeasonColour = colourCode;
  }

  public static convertYYYYMMDDToUTC(date: string) {
    return new Date(date).getTime();
  }

  public static convertUTCToYYYYMMDD(date: number) {
    return new Date(date).getFullYear() + "-" + (new Date(date).getMonth() + 1) + "-" + new Date(date).getDate();
  }

  public selectStartDate(date) {
    this.addSeasonStart = +date;
  }

  public selectEndDate(date) {
    this.addSeasonEnd = +date;
  }

  private addCalendar() {
    this.addSeasonColour = undefined;
    this.addSeasonEnd = undefined;
    this.addSeasonStart = undefined;
    this.addSeasonStartDate = undefined;
    this.addSeasonEndDate = undefined;
    this.addSeasonName = undefined;
    this.edit = false;
    this.editSeasonKey = undefined;
    jQuery("#add_calendar").modal("show");
  }

  clearStorage() {
    this.storageService.remove(Constants.NETWORK_CALENDAR)
  }
}

/**
 * Model chonoline Event item - The objects need to match the info below
 */
export class ChronolineEvent {
  private dates: Date[];
  private title: string;
  private eventHeight: number;
  private section: 1;
  private attrs: { fill: string, stroke: string };
  private click;

  constructor() {
    this.attrs = {
      fill: "#131D50",
      stroke: "#131D50"
    }
  }

  public static create(index: number, season: ModelSeason, component?: LocalAgencyDashboardSeasonalCalendarComponent, seasonKey?: string): ChronolineEvent {
    let event: ChronolineEvent = new ChronolineEvent();
    event.dates = [new Date(season.startTime), new Date(season.endTime)];
    if (season.endTime < season.startTime) {
      console.log("Database error with season " + season.name + ". Start time is before end time. " +
        "This will cause the item to still be rendered correctly)");
      event.dates = [new Date(season.endTime), new Date(season.startTime)];
    }
    let self = this;
    event.title = season.name;
    event.eventHeight = index * 10;
    event.section = 1;
    event.attrs.fill = season.colorCode;
    event.attrs.stroke = season.colorCode;
    event.click = function () {
      component.addSeasonName = season.name;
      component.addSeasonStart = season.startTime;
      component.addSeasonEnd = season.endTime;
      component.addSeasonColour = season.colorCode;
      component.edit = true;
      component.editSeasonKey = seasonKey;
      jQuery("#add_calendar").modal("show");
    };
    return event;
  }

}
