import { Component, OnInit } from '@angular/core';
declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;

@Component({
  selector: 'app-dashboard-seasonal-calendar',
  templateUrl: './dashboard-seasonal-calendar.component.html',
  styleUrls: ['./dashboard-seasonal-calendar.component.css']
})
export class DashboardSeasonalCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
     const events = [
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

        const timeline2 = new Chronoline(document.getElementById("target2"), events,
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

}
