import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {ModelSeason} from "../../model/season.model";
import {ColourSelector} from "../../utils/ColourSelector";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";

declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard-seasonal-calendar',
  templateUrl: './dashboard-seasonal-calendar.component.html',
  styleUrls: ['./dashboard-seasonal-calendar.component.css']
})


export class DashboardSeasonalCalendarComponent implements OnInit, OnDestroy {

  private static WEEK_SPAN_DAY_MULTIPLIER = 30;
  private static MONTH_SPAN_DAY_MULTIPLIER = 91;
  private static RANGE_SPAN_DAYS = 365;

  // TODO - Check when other users are implemented
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
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

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.isNetworkCountry ? this.networkCountryAccess() : this.isLocalNetworkAdmin ? this.localNetworkAccess() : this.normalAccess();
  }

  private normalAccess() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId;
      this.getAllSeasonsForCountryId(this.countryId);
    });
  }

  private networkCountryAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkCountryId = selection["networkCountryId"];
          this.getAllSeasonsForCountryId(this.networkCountryId);
        });
    });
  }

  private localNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkCountryId = selection["id"];
          this.getAllSeasonsForCountryId(this.networkCountryId);
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  /**
   * Ran when "View as months" is clicked. Changes filter and re-initialised the Chronoline map
   */
  public setMonthView() {
    this.currentSpanMultiplierIsMonth = true;
    this.reinitCalendar();
  }

  /**
   * Ran when "View as weeks" is clicked. Changes filter and re-initialised the Chronoline map
   */
  public setWeekView() {
    this.currentSpanMultiplierIsMonth = false;
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
    this.af.database.object(Constants.APP_STATUS + "/season/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snapshot => {
        this.seasonEvents = [
          ChronolineEvent.create(1, DashboardSeasonalCalendarComponent.spanModelCalendar(), <DashboardSeasonalCalendarComponent> this)
        ];
        let i = 2;
        snapshot.forEach((seasonInfo) => {
          let x: ChronolineEvent = ChronolineEvent.create(i, seasonInfo.val(), <DashboardSeasonalCalendarComponent> this, seasonInfo.key);
          this.seasonEvents.push(x);
          i++;
        });
        this.initCalendar();
        // Init map here after replacing the entire array
      });
  }

  /**
   * Model Chronoline item. Chronoline only shows span of max and min items, so blank item is shown which spans +/- RANGE_SPAN_DAYS
   */
  public static spanModelCalendar() {
    // Blank calendar object which will allow the full span to load properly of the calendar
    let daysPlusMinus = DashboardSeasonalCalendarComponent.RANGE_SPAN_DAYS;
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

  public static create(index: number, season: ModelSeason, component?: DashboardSeasonalCalendarComponent, seasonKey?: string): ChronolineEvent {
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
