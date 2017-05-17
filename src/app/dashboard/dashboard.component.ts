import {Component, OnInit, OnDestroy} from '@angular/core';
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {Observable} from "rxjs";
import {AlertLevels} from "../utils/Enums";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;
  // private systemAdminUid: string;

  private alerts: Observable<any>;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) { }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;

        let subscription = this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId").subscribe((countryId) => {
          this.countryId = countryId.$value;
          this.getAlerts();

          let subscription = this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin').subscribe((agencyAdminIds) => {
            this.agencyAdminUid = agencyAdminIds[0].$key;

            // let subscription = this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/systemAdmin').subscribe((systemAdminIds) => {
            //   this.systemAdminUid = systemAdminIds[0].$key;
            // });
            // this.subscriptions.add(subscription);

          });
          this.subscriptions.add(subscription);
        });
        this.subscriptions.add(subscription);

      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  /**
   * Private functions
   */

  getAlerts() {

    this.alerts = this.af.database.list(Constants.APP_STATUS + "/alert/" + this.countryId, {
      query: {
        orderByChild: "alertLevel",
        equalTo: AlertLevels.Red
      }
    });

    this.alerts.forEach(alert => {
      console.log("alert = " + alert);
    });

  }

}
