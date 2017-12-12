import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {AlertMessageType} from "../../../../utils/Enums";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {NetworkService} from "../../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../../../services/agency-service.service";
import {ModelAgency} from "../../../../model/agency.model";
import {ModelNetwork} from "../../../../model/network.model";

declare const jQuery: any;

@Component({
  selector: 'app-network-country-select-agencies',
  templateUrl: './network-country-select-agencies.component.html',
  styleUrls: ['./network-country-select-agencies.component.css']
})
export class NetworkCountrySelectAgenciesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private agencies: ModelAgency[] = [];
  private agencySelectionMap = new Map<string, boolean>();
  private agencyNameMap = new Map<string, string>();
  private selectedAgencies: string[];
  private leadAgencyId: string;
  private existingAgencyIds: string[];
  private showLoader: boolean;
  private agencyCountryMap = new Map<string, string>();
  private agencyObjMap = new Map<string, any>();
  private networkModel: ModelNetwork;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;

      //get network id and network country id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          this.showLoader = false;

          this.networkService.getNetworkDetail(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(network => {
              this.networkModel = network
            })

          //get network country object
          this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networkCountry => {

              //get all approved agencies
              this.agencyService.getApprovedAgenciesByNetwork(this.networkId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(approvedAgencies => {
                  this.agencies = [];
                  approvedAgencies.forEach(agency => {
                    agency.takeUntil(this.ngUnsubscribe).subscribe(agencyObj => {
                      //filter agencies only with same country stay
                      this.agencyService.countryExistInAgency(networkCountry.location, agencyObj.id)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(country => {
                          if (country) {
                            this.agencies.push(agencyObj);
                            this.agencyObjMap.set(agencyObj.id, agencyObj)
                            this.agencyCountryMap.set(agencyObj.id, country.id);
                          }
                        })
                    })
                  })
                })

            });

          //fetch already added agency ids
          this.networkService.getAgencyIdsForNetworkCountryOffice(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(ids => {
              if (ids) {
                this.existingAgencyIds = ids;
              }
            });

          //fetch lead agency id
          this.networkService.getLeadAgencyIdForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(id => {
              if (id) {
                this.leadAgencyId = id;
              }
            });

        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleAgencySelection(agency, value) {
    this.agencySelectionMap.set(agency.id, value);
    this.agencyNameMap.set(agency.id, agency.name);
  }

  showSelectedAgencies() {
    this.selectedAgencies = [];
    this.agencySelectionMap.forEach((v, k) => {
      if (v) {
        this.selectedAgencies.push(k);
      }
    });
  }


  confirmInvitation() {
    console.log("confirm invitation");
    if (!this.selectedAgencies || this.selectedAgencies.length == 0) {
      this.alertMessage = new AlertMessageModel("No agencies was selected!");
      return;
    }
    if (!this.leadAgencyId) {
      jQuery('#leadAgencySelection').modal('show');
      console.log(this.networkModel)
      if (this.agencies.filter(agency => {
          return agency.id === this.networkModel.leadAgencyId
        }).length != 0 && this.agencySelectionMap.get(this.networkModel.leadAgencyId)) {
        this.leadAgencyId = this.networkModel.leadAgencyId
      }
    } else {
      this.saveAgenciesAndLead();
    }
  }

  emptyLead() {
    this.leadAgencyId = null
  }

  saveAgenciesAndLead() {
    if (!this.leadAgencyId || this.leadAgencyId == undefined) {
      this.alertMessage = new AlertMessageModel("Lead agency cannot be empty!")
      return
    }
    console.log("save agencies and lead agency");
    console.log(this.leadAgencyId)
    this.networkService.updateAgenciesForNetworkCountry(this.networkId, this.networkCountryId, this.leadAgencyId, this.agencyCountryMap, this.agencySelectionMap).then(() => {
      this.router.navigateByUrl("/network-country/network-country-agencies");
    }).catch(rej => {
      this.alertMessage = new AlertMessageModel(rej.message);
    });

  }

}
