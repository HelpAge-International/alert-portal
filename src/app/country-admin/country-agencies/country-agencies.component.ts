import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {AgencyService} from "../../services/agency-service.service";

@Component({
  selector: 'app-country-account-settings',
  templateUrl: './country-agencies.component.html',
  styleUrls: ['./country-agencies.component.css'],
})

export class CountryAgenciesComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyID: string;
  private systemAdminID: string;
  private countryId: string;

  private countryToShow: any;
  private countryKey: string;
  private countryOffices: any[] = [];
  private countries = Constants.COUNTRIES;

  private agencies = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private UserType: number;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute,
              private af: AngularFire, private router: Router, private userService: UserService,
              private agencyService: AgencyService) {

  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;
      this._loadData();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  _loadData() {
    this.userService.getCountryId(Constants.USER_PATHS[this.UserType], this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryId => {
        this.countryId = countryId;
        this._getSystemAdminID().then(() => {
          this._getAgencyID().then(() => {
            this.getCountry().then(() => {
              this._getUserInfo().then(() => {
                this.getCountryOfficesWithSameLocationsInOtherAgencies(true, true).then(() => {

                });
              });
            });
          });
        })
      });


  }

  _getUserInfo() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: any) => {
          if (typeof (user.country) == 'undefined') {
            console.log('country undefined');
            return false;
          }
          this.countryKey = user.country;
          res(true);
        });
    });
    return promise;
  }

  _getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  _getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.systemAdminID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private getCountry() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyID + "/" + this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((country) => {
          if (country) {
            this.countryToShow = country;
            res(true);
          }
        });
    });
    return promise;
  }

  // Getting all country offices with the same location in other agencies
  private getCountryOfficesWithSameLocationsInOtherAgencies(getAllAlertLevels: boolean, fromOnInit: boolean) {
    this.countryOffices = [];

    let promise = new Promise((res, rej) => {

      this.agencyService.getAllCountryOffices()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencies => {
          agencies = agencies.filter(agency => agency.$key != this.agencyID);
          agencies.forEach(agency => {

            let countries = Object.keys(agency).filter(key => !(key.indexOf("$") > -1)).map(key => {
              let temp = agency[key];
              temp["$key"] = key;
              temp["countryId"] = key;
              temp["agencyId"] = agency.$key;
              return temp;
            });
            countries = countries.filter(countryItem => countryItem.location == this.countryToShow.location);

            if (countries.length > 0) {
              // An agency should only have one country office per country
              if (!this.countryOffices.find(x => x == countries[0])) {
                this.countryOffices.push(countries[0]);
              }

              this.agencyService.getAgency(agency.$key)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(agency => {
                  this.agencies[countries[0].countryId] = agency;
                });

            }
            res(true);
          });
        });
    });
    return promise;
  }
}
