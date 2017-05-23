import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
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

  // TODO - Remove
  private events = [
    {
      dates: [new Date(2016, 4, 23), new Date(2018, 6, 25)],
      title: "Earth",
      eventHeight: 30,
      section: 1,
      attrs: {fill: "#d4e3fd", stroke: "#d4e3fd"}
    },
    {
      dates: [new Date(2017, 7, 23), new Date(2017, 9, 26)],
      title: "Wind",
      eventHeight: 20,
      section: 1,
      attrs: {fill: "#6FD08C", stroke: "#6FD08C"}
    },
    {
      dates: [new Date(2017, 4, 26), new Date(2017, 6, 28)],
      title: "Fire",
      eventHeight: 10,
      section: 1,
      attrs: {fill: "#6FD08C", stroke: "#6FD08C"}
    },
  ];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.getCountryId().then(() => {
          this.initCalendar();
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

  /**
   * Private functions
   */

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

  private initCalendar() {

    // To show weekly calendar ----> Change visibleSpan to 'DAY_IN_MILLISECONDS * 30'
    new Chronoline(document.getElementById("target2"), this.events,
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
