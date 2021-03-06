import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
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

  //Dan Variables
  private forDeletion: Array<any> = [];
  private finalData: Array<any> = [];
  private Loading: boolean = true;
  // private agencyCountryMapWithNotApproved = new Map<string, string>()


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private af: AngularFire,
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

          // //extra step to get agencyCountryMap with un-approved members
          // this.networkService.mapAgencyCountryForNetworkCountryWithNotApproved(this.networkId, this.networkCountryId)
          //   .takeUntil(this.ngUnsubscribe)
          //   .subscribe(map => this.agencyCountryMapWithNotApproved = map)

          this.networkService.mapAgencyCountryForNetworkCountryWithNotApproved(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyMap => {
              this.agencyCountryMap = agencyMap;
              console.log(this.agencyCountryMap)

              //fetch network agencies
              this.networkService.getAgenciesForNetworkCountry(this.networkId, this.networkCountryId, this.agencyCountryMap)
              //extra fetching works
                .do((agencies: NetworkAgencyModel[]) => {
                  if (agencies.length) {
                    agencies.forEach(model => {
                      //get agency detail
                      this.agencyService.getAgency(model.id)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(agency => {
                          console.log(agency)
                          model.name = agency.name;
                          model.logoPath = agency.logoPath;
                          model.adminId = agency.adminId;

                          if (agency.isGlobalAgency) {
                            this.getCountryAdmin(model);
                          } else {
                            this.getLocalAgencyAdmin(model);
                          }

                        });


                    });
                  }
                })
                .takeUntil(this.ngUnsubscribe)
                .subscribe((agencies: NetworkAgencyModel[]) => {
                  this.networkAgencies = agencies;
                  this.showLoader = false;
                });

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
    console.log("/agency/" + agencyId + "/networks/" + this.networkId);
    this.removeAgencyObj = this.agencyService.getAgency(agencyId);


  }

  confirmRemove(agencyId) {
    console.log(this.agencyCountryMap)
    let countryId = this.agencyCountryMap.get(agencyId)
    if (!countryId) {
      this.alertMessage = new AlertMessageModel("Agency id not available!");
      return
    }
    if (this.leadAgencyId == agencyId) {
      this.alertMessage = new AlertMessageModel("DELETE_LEAD_AGENCY_ERROR");
    } else {
      let path = "/networkCountry/" + this.networkId + "/" + this.networkCountryId + "/agencyCountries/" + agencyId;
      let validationPath = "/networkCountryAgencyValidation/" + agencyId;
      this.networkService.deleteNetworkField(path);
      this.networkService.deleteNetworkField(validationPath);
      //delete reference in countryOffice node
      let node = "/countryOffice/" + agencyId + "/" + countryId + "/networks/" + this.networkId
      this.networkService.deleteNetworkField(node)
    }
  }

  resendEmail(agencyId) {
    console.log(agencyId);
    this.networkService.resendEmailNetworkCountry(this.networkId, this.networkCountryId, agencyId, this.agencyCountryMap.get(agencyId));
  }

  private getCountryAdmin(model) {
    this.agencyService.getCountryOffice(this.agencyCountryMap.get(model.id), model.id)
      .flatMap(country => {
        return this.userService.getUser(country.adminId);
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        model.adminEmail = user.email;
        model.adminName = user.firstName + " " + user.lastName;
        model.adminPhone = user.phone;
      });
  }

  private getLocalAgencyAdmin(model: NetworkAgencyModel) {
    console.log(model)
    this.userService.getUser(model.adminId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        model.adminEmail = user.email;
        model.adminName = user.firstName + " " + user.lastName;
        model.adminPhone = user.phone;
      })
  }
}
