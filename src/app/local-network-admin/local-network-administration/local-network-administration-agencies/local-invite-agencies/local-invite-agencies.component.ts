import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {AlertMessageType} from "../../../../utils/Enums";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {NetworkService} from "../../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../../../services/agency-service.service";
import {ModelAgency} from "../../../../model/agency.model";
import {Observable} from "rxjs/Observable";
import {ModelNetwork} from "../../../../model/network.model";
import {takeUntil} from "rxjs/operator/takeUntil";

declare const jQuery: any;

@Component({
  selector: 'app-local-invite-agencies',
  templateUrl: './local-invite-agencies.component.html',
  styleUrls: ['./local-invite-agencies.component.scss']
})
export class LocalInviteAgenciesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private agencies = [];
  private countryCodes = {};
  private agencySelectionMap = new Map<string, boolean>();
  private agencyNameMap = new Map<string, string>();
  private selectedAgencies: string[];
  private leadAgencyId: string;
  private existingAgencyIds: string[];
  private showLoader:boolean;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
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
          this.showLoader = false;

          //fetch all agencies
          this.networkService.getNetworkDetail(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(network =>{

              this.agencyService.getAllAgencyFromPlatform()
                .takeUntil(this.ngUnsubscribe)
                .subscribe(agencies =>{
                  console.log(agencies)
                  agencies.forEach(agency =>{

                    this.agencyService.getAllAgencyByNetworkCountry(network.countryCode, agency.id)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(x => {
                        if (x.length > 0) {
                          this.agencyService.getAgency(agency.id)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe( agency => {
                              this.agencies.push(agency)

                            })
                        }
                      })
                  })

                })

            })



          // this.agencies = this.agencyService.getAllAgencyByNetworkCountry();

          //fetch already added agency ids
          this.networkService.getAgencyIdsForNetwork(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(ids => {
              if (ids) {
                this.existingAgencyIds = ids;
              }
            });

          //fetch lead agency id
          this.networkService.getLeadAgencyId(this.networkId)
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
    this.agencyService.unSubscribeNow();
  }

  toggleAgencySelection(agency, value) {
    this.agencySelectionMap.set(agency.$key, value);
    this.agencyNameMap.set(agency.$key, agency.name);
    console.log(this.agencySelectionMap)
    console.log(this.agencyNameMap)
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
    } else {
      this.saveAgenciesAndLead();
    }
  }

  saveAgenciesAndLead() {
    this.selectedAgencies.forEach( agency =>{
      this.networkService.getNetworkDetail(this.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe( network => {
          this.networkService.getCountryCodeForAgency(agency, network.countryCode)
            .takeUntil(this.ngUnsubscribe)
            .subscribe( countryCodes => {
              this.countryCodes = countryCodes
              this.networkService.updateAgenciesForLocalNetwork(this.networkId, this.leadAgencyId, this.selectedAgencies, this.countryCodes).then(() => {
                this.router.navigateByUrl("/network/local-network-administration/agencies");
              }).catch(rej => {
                this.alertMessage = new AlertMessageModel(rej.message);
              });

            })

        })
    })


  }


}