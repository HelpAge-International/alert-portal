"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Constants_1 = require("../../utils/Constants");
var season_model_1 = require("../../model/season.model");
var ColourSelector_1 = require("../../utils/ColourSelector");
var DashboardSeasonalCalendarComponent = DashboardSeasonalCalendarComponent_1 = (function () {
    function DashboardSeasonalCalendarComponent(af, router) {
        this.af = af;
        this.router = router;
        // TODO - Check when other users are implemented
        this.USER_TYPE = 'administratorCountry';
        this.currentSpanMultiplierIsMonth = true;
        this.init = false;
        this.colours = ColourSelector_1.ColourSelector.list();
        this.seasonEvents = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    DashboardSeasonalCalendarComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log(this.colours);
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.getCountryId().then(function () {
                    _this.getAllSeasonsForCountryId(_this.countryId);
                });
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    DashboardSeasonalCalendarComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    /**
     * Ran when "View as months" is clicked. Changes filter and re-initialised the Chronoline map
     */
    DashboardSeasonalCalendarComponent.prototype.setMonthView = function () {
        this.currentSpanMultiplierIsMonth = true;
        this.reinitCalendar();
    };
    /**
     * Ran when "View as weeks" is clicked. Changes filter and re-initialised the Chronoline map
     */
    DashboardSeasonalCalendarComponent.prototype.setWeekView = function () {
        this.currentSpanMultiplierIsMonth = false;
        this.reinitCalendar();
    };
    /**
     * Reinitialises the calendar
     */
    DashboardSeasonalCalendarComponent.prototype.reinitCalendar = function () {
        // Stop synchronisation issue (ie. Someone click Weekly before calendar is loaded)
        if (this.init) {
            this.initCalendar();
        }
    };
    /**
     * Pulls all the data from /seasons/ node in firebase and initialises the calendar
     * Note: Object is used here because the map needs to be re-initialised. Object allows
     * me to not have to track which item has changed opposed to list
     */
    DashboardSeasonalCalendarComponent.prototype.getAllSeasonsForCountryId = function (countryId) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/season/" + countryId, { preserveSnapshot: true })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (snapshot) {
            _this.seasonEvents = [
                ChronolineEvent.create(1, DashboardSeasonalCalendarComponent_1.spanModelCalendar())
            ];
            var i = 2;
            snapshot.forEach(function (seasonInfo) {
                var x = ChronolineEvent.create(i, seasonInfo.val());
                _this.seasonEvents.push(x);
                i++;
            });
            _this.initCalendar();
            // Init map here after replacing the entire array
        });
    };
    /**
     * Get the country Id
     */
    DashboardSeasonalCalendarComponent.prototype.getCountryId = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + "/countryId", { preserveSnapshot: true })
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (countryId) {
                _this.countryId = countryId.val();
                res(true);
            });
        });
        return promise;
    };
    /**
     * Model Chronoline item. Chronoline only shows span of max and min items, so blank item is shown which spans +/- RANGE_SPAN_DAYS
     */
    DashboardSeasonalCalendarComponent.spanModelCalendar = function () {
        // Blank calendar object which will allow the full span to load properly of the calendar
        var daysPlusMinus = DashboardSeasonalCalendarComponent_1.RANGE_SPAN_DAYS;
        var d = new Date();
        return new season_model_1.ModelSeason("#00131D50", "Name", d.getTime() - (daysPlusMinus * (1000 * 60 * 60 * 24)), d.getTime() + (daysPlusMinus * (1000 * 60 * 60 * 24)));
    };
    /**
     * Initialise the calendar
     */
    DashboardSeasonalCalendarComponent.prototype.initCalendar = function () {
        // To show weekly calendar ----> Change visibleSpan to 'DAY_IN_MILLISECONDS * 30'
        document.getElementById("target2").innerHTML = "";
        this.currentChronolineInstance = new Chronoline(document.getElementById("target2"), this.seasonEvents, {
            visibleSpan: DAY_IN_MILLISECONDS * (this.currentSpanMultiplierIsMonth ?
                DashboardSeasonalCalendarComponent_1.MONTH_SPAN_DAY_MULTIPLIER :
                DashboardSeasonalCalendarComponent_1.WEEK_SPAN_DAY_MULTIPLIER),
            animated: true,
            tooltips: true,
            sectionLabelAttrs: { 'fill': '#997e3d', 'font-weight': 'bold' },
            labelInterval: isFifthDay,
            hashInterval: isFifthDay,
            scrollLeft: prevMonth,
            scrollRight: nextMonth,
            // markToday: 'labelBox',
            draggable: true
        });
        this.currentChronolineInstance.goToDate(new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 7)), 1);
        this.init = true;
    };
    DashboardSeasonalCalendarComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    DashboardSeasonalCalendarComponent.prototype.saveCalendarInfo = function () {
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
        var season = new season_model_1.ModelSeason(this.addSeasonColour, this.addSeasonName, DashboardSeasonalCalendarComponent_1.convertYYYYMMDDToUTC(this.addSeasonStart), DashboardSeasonalCalendarComponent_1.convertYYYYMMDDToUTC(this.addSeasonEnd));
        this.af.database.list(Constants_1.Constants.APP_STATUS + "/season/" + this.countryId + "/").push(season);
        // Below line wasn't working when I was trying to hide it!
        // jQuery("#add_calendar").modal("hide");
    };
    DashboardSeasonalCalendarComponent.prototype.setCurrentColour = function (colourCode) {
        this.addSeasonColour = colourCode;
    };
    DashboardSeasonalCalendarComponent.convertYYYYMMDDToUTC = function (date) {
        return new Date(date).getTime();
    };
    return DashboardSeasonalCalendarComponent;
}());
DashboardSeasonalCalendarComponent.WEEK_SPAN_DAY_MULTIPLIER = 30;
DashboardSeasonalCalendarComponent.MONTH_SPAN_DAY_MULTIPLIER = 91;
DashboardSeasonalCalendarComponent.RANGE_SPAN_DAYS = 365;
DashboardSeasonalCalendarComponent = DashboardSeasonalCalendarComponent_1 = __decorate([
    core_1.Component({
        selector: 'app-dashboard-seasonal-calendar',
        templateUrl: './dashboard-seasonal-calendar.component.html',
        styleUrls: ['./dashboard-seasonal-calendar.component.css']
    })
], DashboardSeasonalCalendarComponent);
exports.DashboardSeasonalCalendarComponent = DashboardSeasonalCalendarComponent;
/**
 * Model chonoline Event item - The objects need to match the info below
 */
var ChronolineEvent = (function () {
    function ChronolineEvent() {
        this.attrs = {
            fill: "#131D50",
            stroke: "#131D50"
        };
    }
    ChronolineEvent.create = function (index, season) {
        var event = new ChronolineEvent();
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
    };
    return ChronolineEvent;
}());
exports.ChronolineEvent = ChronolineEvent;
var DashboardSeasonalCalendarComponent_1;
