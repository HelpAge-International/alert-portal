import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../utils/Constants";
import {Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Countries} from "../utils/Enums";

@Component({
  selector: 'app-director-dashboard',
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.css']
})

export class DirectorDashboardComponent implements OnInit, OnDestroy {

  // TODO - Update this
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;

  private Countries = Countries;
  private CountriesList = Constants.COUNTRIES;
  private countryLocation: any;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
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

  goToAgenciesInMyCountry() {
    this.router.navigateByUrl("/country-admin/country-agencies");
  }

  goToFaceToFaceMeeting() {
    this.router.navigateByUrl("/director-dashboard/facetoface-meeting-request");
  }

  /**
   * Private functions
   */

  private loadData() {
    this.getCountryId().then(() => {
      // Add functions needing only country Id here
      // this.getAlerts();
      // this.initData();
    });
    this.getAgencyID().then(() => {
      // Add functions needing country Id and/or agency id here
      this.getCountryData();
    });
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
