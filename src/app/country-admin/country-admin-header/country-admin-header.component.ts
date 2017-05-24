import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {Countries} from "../../utils/Enums";

@Component({
  selector: 'app-country-admin-header',
  templateUrl: './country-admin-header.component.html',
  styleUrls: ['./country-admin-header.component.css']
})
export class CountryAdminHeaderComponent implements OnInit, OnDestroy {

  // TODO - Check when other users are implemented
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyAdminId: string;

  private firstName: string = "";
  private lastName: string = "";

  private countryLocation: any;
  private Countries = Countries;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            this.firstName = user.firstName;
            this.lastName = user.lastName;
          });
        this.getCountryId().then(() => {
          this.getAgencyID().then(() => {
            this.getCountryData();
          });
        });
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout() {
    console.log("logout");
    this.af.auth.logout();
  }

  /**
   * Private functions
   */

  private getCountryId() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId").takeUntil(this.ngUnsubscribe)
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
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin').takeUntil(this.ngUnsubscribe)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyAdminId = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyAdminId + '/' + this.countryId + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          res(true);
        });
    });
    return promise;
  }
}
