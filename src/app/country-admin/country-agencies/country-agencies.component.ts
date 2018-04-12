import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {AgencyService} from "../../services/agency-service.service";
import {ActionsService} from "../../services/actions.service";
import {UserService} from "../../services/user.service";
import {NetworkService} from "../../services/network.service";

@Component({
  selector: 'app-country-account-settings',
  templateUrl: './country-agencies.component.html',
  styleUrls: ['./country-agencies.component.css'],
  providers: [ActionsService]
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

  // //add network and network country offices
  private globalNetworks = [];
  private networkCountryData = [];
  private localNetworkData = [];

  private isLocalAgency = false;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute,
              private af: AngularFire, private router: Router, private userService: UserService,
              private networkService: NetworkService,
              private agencyService: AgencyService) {

  }

  ngOnInit() {
    this.route.url.takeUntil(this.ngUnsubscribe).subscribe(url => {
      if(url[0].path == 'local-agency'){
        this.isLocalAgency = true;

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.UserType = userType;
          this.countryId = countryId;
          this.agencyID = agencyId;
          this.systemAdminID = systemId;
          this._loadDataLocalAgency();
        });
      }else{
        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.UserType = userType;
          this.countryId = countryId;
          this.agencyID = agencyId;
          this.systemAdminID = systemId;
          this._loadData();
        });
      }

    })


  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  _loadData() {
    this.userService.getCountryDetail(this.countryId, this.agencyID)
      .first()
      .subscribe(country => {
        this.countryToShow = country;
        this.countryKey = country.location;
        this.getCountryOfficesWithSameLocationsInOtherAgencies();
        this.getNetworkAndNetworkCountries()
        this.getLocalNetworks()
      });
  }

  _loadDataLocalAgency() {
    this.userService.getAgencyDetail(this.agencyID)
      .first()
      .subscribe(agency => {
        console.log(agency)
        this.countryToShow = agency;
        this.countryKey = agency.countryCode;
        this.getCountryOfficesWithSameLocationsInOtherAgencies();
        this.getNetworkAndNetworkCountries()
        this.getLocalNetworks()
      });
  }

  private getNetworkAndNetworkCountries() {
    let country = this.isLocalAgency ? this.countryToShow.countryCode : this.countryToShow.location
    this.networkService.mapNetworkOfficesWithSameLocationsInOtherNetworks(country)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkMap => {
        this.networkCountryData = []
        networkMap.forEach((networkCountryId, networkId) => {
          this.networkService.getNetworkCountry(networkId, networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networkCountry => {
              this.networkCountryData.push(networkCountry)
            })
          this.networkService.getNetworkDetail(networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(network => {
              this.globalNetworks[networkCountryId] = network
            })
        })
      })
  }

  private getLocalNetworks() {
    let country = this.isLocalAgency ? this.countryToShow.countryCode : this.countryToShow.location
    this.networkService.getLocalNetworksWithSameLocationsInOtherNetworks(country)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(localNetworks => {
        console.log(localNetworks)
        this.localNetworkData = localNetworks
        localNetworks.forEach(localNetwork =>{
          this.globalNetworks[localNetwork.networkId] = localNetwork
        })
      })
  }

  // Getting all country offices with the same location in other agencies
  private getCountryOfficesWithSameLocationsInOtherAgencies() {
    this.countryOffices = [];

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
          if(this.isLocalAgency){
            countries = countries.filter(countryItem => countryItem.location == this.countryToShow.countryCode && countryItem.isActive);
          }else{
            countries = countries.filter(countryItem => countryItem.location == this.countryToShow.location && countryItem.isActive);
          }


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
        });
      });
  }

}
