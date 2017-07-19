import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlertLevels, Countries} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router, Params, ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import {AgencyService} from "../../services/agency-service.service";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-donor-country-index',
  templateUrl: './donor-country-index.component.html',
  styleUrls: ['./donor-country-index.component.css'],
  providers: [AgencyService]
})

export class DonorCountryIndexComponent implements OnInit, OnDestroy {

  private loaderInactive: boolean;

  private countryIdReceived: string;
  private agencyIdReceived: string;

  private uid: string;
  private UserType: any;
  private agencyId: string;
  private systemAdminId: string;

  private countryToShow: any;
  private Countries = Countries;

  private numOfCountryOffices: number = 0;

  private countryOffices: any = [];
  private agencies = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private agencyService: AgencyService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.systemAdminId = systemId;
      this.UserType = userType;
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["countryId"]) {
            this.countryIdReceived = params["countryId"];
            this.agencyIdReceived = params["agencyId"];
            this.loadData();
          }
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.agencyService.unSubscribeNow();
  }


  /*
   Private Functions
   */
  private loadData() {
    this.getCountry().then(() => {
      this.getAgencyID().then(() => {
        this.getCountryOfficesWithSameLocationsInOtherAgencies(true, true).then(_ => {
            this.loaderInactive = true;
        });
      });
    });
  }

  private getCountry() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyIdReceived + "/" + this.countryIdReceived)
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

  private getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/donor/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.agencyId = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/donor/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.systemAdminId = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
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
          // agencies = agencies.filter(agency => agency.$key != this.agencyIdReceived);
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
                this.countryOffices.push(countries[0]);

                // To make sure the number of country offices don't change with filters
                if (fromOnInit) {
                  this.numOfCountryOffices++;
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
