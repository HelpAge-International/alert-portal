import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {FirebaseObjectObservable} from "angularfire2";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../../services/agency-service.service";
import {UserService} from "../../../services/user.service";
import {NetworkAgencyModel} from "../../../network-admin/network-agencies/network-agency.model";

@Component({
  selector: 'app-network-country-agencies',
  templateUrl: './network-country-agencies.component.html',
  styleUrls: ['./network-country-agencies.component.css']
})
export class NetworkCountryAgenciesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private leadAgencyId: string;
  private leadAgency: FirebaseObjectObservable<any>;
  private showLoader: boolean;
  private networkCountryId: string;
  private networkAgencies: NetworkAgencyModel[] = [];
  private removeAgencyObj: FirebaseObjectObservable<any>;
  private agencyCountryMap = new Map<string, string>();


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      // this.showLoader = true;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];

          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyMap => {
              this.agencyCountryMap = agencyMap;
              console.log(this.agencyCountryMap);
            });

          //fetch network agencies
          this.networkService.getAgenciesForNetworkCountry(this.networkId, this.networkCountryId)
          //extra fetching works
            .do((agencies: NetworkAgencyModel[]) => {
              if (agencies) {
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
          this.networkService.getLeadAgencyIdForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(id => {
              this.leadAgencyId = id;
              this.leadAgency = this.agencyService.getAgency(this.leadAgencyId);
            });

        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  confirmLeadAgencyChange() {
    let update = {};
    update["/networkCountry/" + this.networkId + "/" + this.networkCountryId + "/leadAgencyId"] = this.leadAgencyId;
    this.networkService.updateNetworkField(update);
  }

  removeAgency(agencyId) {
    this.removeAgencyObj = this.agencyService.getAgency(agencyId);
  }

  confirmRemove(agencyId) {
    console.log(agencyId);
    if (this.leadAgencyId == agencyId) {
      this.alertMessage = new AlertMessageModel("DELETE_LEAD_AGENCY_ERROR");
    } else {
      let path = "/networkCountry/" + this.networkId + "/" + this.networkCountryId + "/agencyCountries/" + agencyId;
      let validationPath = "/networkCountryAgencyValidation/" + agencyId;
      this.networkService.deleteNetworkField(path);
      this.networkService.deleteNetworkField(validationPath);
    }
  }

  resendEmail(agencyId) {
    console.log(agencyId);
    this.networkService.resendEmailNetworkCountry(this.networkId, this.networkCountryId, agencyId, this.agencyCountryMap.get(agencyId));
  }

}
