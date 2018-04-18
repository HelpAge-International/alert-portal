import {Component, OnDestroy, OnInit} from '@angular/core';
import {Countries, UserType} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject} from "rxjs";
import {AgencyService} from "../../services/agency-service.service";
import {NetworkService} from "../../services/network.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {Location} from "@angular/common";

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
  private numOfNetworkCountries: number = 0;

  private countryOffices: any = [];
  private agencies = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private networkCountryIdReceived: any;
  private globalNetworkIdReceived: any;
  private networkCountries = [];
  private networkToShow: any;
  private globalNetworks = [];
  private localNetworkData = [];


  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private agencyService: AgencyService,
              private networkService: NetworkService,
              private location: Location,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
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

          if (params["networkCountryId"]) {
            this.networkCountryIdReceived = params["networkCountryId"];
            this.globalNetworkIdReceived = params["globalNetworkId"];
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
    if (this.countryIdReceived) {
      this.getCountry().then(() => {
        this.getCountryOfficesWithSameLocationsInOtherAgencies(true, true).then(_ => {
          this.loaderInactive = true;
        })
        this.getNetworksWithSameLocationsInOtherGlobalNetworks(true, true).then(_ => {
          this.loaderInactive = true;
        });
        this.getLocalNetworks(this.countryIdReceived, this.agencyIdReceived)
      });
    } else {
      this.getNetwork().then(() => {
        this.getNetworksWithSameLocationsInOtherGlobalNetworks(true, true).then(_ => {
          this.loaderInactive = true;
        })
        this.getCountryOfficesWithSameLocationsInOtherAgencies(true, true).then(_ => {
          this.loaderInactive = true;
        })
      });
    }

  }

  private getNetwork() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + this.globalNetworkIdReceived + "/" + this.networkCountryIdReceived)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((network) => {
          if (network) {
            this.networkToShow = network;
            this.countryToShow = network;
            res(true);
          }
        });
    });
    return promise;
  }

  private getCountry() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyIdReceived + "/" + this.countryIdReceived)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((country) => {
          if (country) {
            this.countryToShow = country;
            this.networkToShow = country;
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

  // Getting all networks with the same location in other global networks
  private getNetworksWithSameLocationsInOtherGlobalNetworks(getAllAlertLevels: boolean, fromOnInit: boolean) {
    this.networkCountries = [];

    let promise = new Promise((res, rej) => {

      this.networkService.getListOfAllNetworkCountries()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(globalNetworks => {
          globalNetworks.forEach(globalNetwork => {
            let networkCountries = Object.keys(globalNetwork).filter(key => !(key.indexOf("$") > -1)).map(key => {
              let temp = globalNetwork[key];
              temp["$key"] = key;
              temp["networkCountryId"] = key;
              temp["globalNetworkId"] = globalNetwork.$key;
              return temp;
            });
            networkCountries = networkCountries.filter(countryItem => countryItem.location == this.networkToShow.location);

            if (networkCountries.length > 0) {

              // An agency should only have one country office per country
              this.networkCountries.push(networkCountries[0]);

              // To make sure the number of country offices don't change with filters
              if (fromOnInit) {
                this.numOfNetworkCountries++;
              }

              this.networkService.getGlobalNetwork(globalNetwork.$key)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(globalNetwork => {
                  this.globalNetworks[networkCountries[0].networkCountryId] = globalNetwork;
                });
            }
            res(true);
          });
        });
    });
    return promise;
  }

  goBack() {
    this.location.back();
  }

  private getLocalNetworks(countryId: string, agencyId: string) {
    this.agencyService.getCountryOffice(countryId, agencyId)
      .flatMap(office => this.networkService.getLocalNetworksWithSameLocationsInOtherNetworks(office.location))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(localNetworks => {
        console.log(localNetworks)
        this.localNetworkData = localNetworks
        localNetworks.forEach(localNetwork => {
          this.globalNetworks[localNetwork.networkId] = localNetwork
        })
      })
  }
}
