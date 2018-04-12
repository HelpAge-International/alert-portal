import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../../services/agency-service.service";
import {FirebaseObjectObservable} from "angularfire2";
import {NetworkAgencyModel} from "../../../network-admin/network-agencies/network-agency.model";
import {UserService} from "../../../services/user.service";
import {ModelNetwork} from "../../../model/network.model";
import {ModelUserPublic} from "../../../model/user-public.model";


@Component({
  selector: 'app-local-network-administration-agencies',
  templateUrl: './local-network-administration-agencies.component.html',
  styleUrls: ['./local-network-administration-agencies.component.scss']
})
export class LocalNetworkAdministrationAgenciesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private leadAgencyId: string;
  private leadAgency: FirebaseObjectObservable<any>;
  private networkAgencies: NetworkAgencyModel[] = [];
  private removeAgencyObj: FirebaseObjectObservable<any>;
  private showLoader: boolean;
  private networkCountryCode: number | any;
  private agencyCountryAdminMap = new Map<String, ModelUserPublic>()
  private agencyCountryMap: Map<string, string>;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;


      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          console.log(this.networkId)

          this.networkService.getNetworkDetail(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(network => {
              this.networkCountryCode = network.countryCode
              if (!network.isGlobal) {
                this.getCountries(network)
              }
            })

          this.networkService.mapAgencyCountryForLocalNetworkCountry(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyCountryMap => this.agencyCountryMap = agencyCountryMap)

          //fetch network agencies
          this.networkService.getAgenciesForNetwork(this.networkId)
          //extra fetching works
            .do((agencies: NetworkAgencyModel[]) => {
              if (agencies.length > 0) {
                agencies.forEach(model => {

                  //get agency detail
                  this.agencyService.getAgency(model.id)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      model.name = agency.name;
                      model.logoPath = agency.logoPath;
                      model.adminId = agency.adminId;

                      //get agency admin detail
                      this.userService.getUser(model.adminId)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(user => {
                          console.log(user)
                          model.adminEmail = user.email;
                          model.adminName = user.firstName + " " + user.lastName;
                          model.adminPhone = user.phone;
                        })
                    })
                });
              }
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe((agencies: NetworkAgencyModel[]) => {
              this.networkAgencies = agencies;
              this.showLoader = false;
            });

          //fetch lead agency id
          this.networkService.getLeadAgencyId(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(id => {
              this.leadAgencyId = id;
              this.leadAgency = this.agencyService.getAgency(this.leadAgencyId);
            });

        })
    });
  }

  private getCountries(network: ModelNetwork) {
    console.log("is local, need to get country")
    console.log(network)
    if (network.agencies) {
      this.getNormalCountries(network);
      this.getLocalAgencies(network);
    }
  }

  private getNormalCountries(network: ModelNetwork) {
    Object.keys(network.agencies).map(key => {
      let temp = {}
      temp['agencyId'] = key
      temp['countryId'] = network.agencies[key]['countryCode']
      return temp
    })
      .filter(obj => obj["countryId"] !== obj["agencyId"])
      .forEach(obj => {
        this.userService.getCountryDetail(obj['countryId'], obj['agencyId'])
          .flatMap(country => {
            return this.userService.getUser(country.adminId)
          })
          .takeUntil(this.ngUnsubscribe)
          .subscribe(countryAdmin => {
            this.agencyCountryAdminMap.set(obj['agencyId'], countryAdmin)
            console.log(this.agencyCountryAdminMap)
          })
      })
  }

  private getLocalAgencies(network: ModelNetwork) {
    Object.keys(network.agencies).map(key => {
      let temp = {}
      temp['agencyId'] = key
      temp['countryId'] = network.agencies[key]['countryCode']
      return temp
    })
      .filter(obj => obj["countryId"] === obj["agencyId"])
      .forEach(obj => {
        this.userService.getAgencyDetail(obj['agencyId'])
          .flatMap(agency => {
            return this.userService.getUser(agency.adminId)
          })
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencyAdmin => {
            this.agencyCountryAdminMap.set(obj['agencyId'], agencyAdmin)
            console.log(this.agencyCountryAdminMap)
          })
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  confirmLeadAgencyChange() {
    let update = {};
    update["/network/" + this.networkId + "/leadAgencyId"] = this.leadAgencyId;
    this.networkService.updateNetworkField(update);
  }

  removeAgency(agencyId) {
    this.removeAgencyObj = this.agencyService.getAgency(agencyId);
  }

  confirmRemove(agencyId) {
    let countryId = this.agencyCountryMap.get(agencyId)
    // if (!countryId) {
    //   this.alertMessage = new AlertMessageModel("Agency id not available!");
    //   return
    // }
    if (this.leadAgencyId == agencyId) {
      this.alertMessage = new AlertMessageModel("DELETE_LEAD_AGENCY_ERROR");
    } else {
      let path = "/network/" + this.networkId + "/agencies/" + agencyId;
      let validationPath = "/networkAgencyValidation/" + agencyId;
      this.networkService.deleteNetworkField(path);
      this.networkService.deleteNetworkField(validationPath);
      //delete reference in countryOffice node
      let node = countryId ?
        "/countryOffice/" + agencyId + "/" + countryId + "/localNetworks/" + this.networkId
        :
        "/agency/" + agencyId + "/localNetworks/" + this.networkId
      this.networkService.deleteNetworkField(node)
    }
  }

  resendEmail(agencyId) {

    this.networkService.getCountryCodeForAgency(agencyId, this.networkCountryCode)
      .first()
      .subscribe(countryCode => {
        this.networkService.resendEmail(this.networkId, agencyId, countryCode);

      })


  }

  navigateToAddAgency() {
    this.router.navigateByUrl("/network/local-network-administration/agencies/invite");
  }

}
