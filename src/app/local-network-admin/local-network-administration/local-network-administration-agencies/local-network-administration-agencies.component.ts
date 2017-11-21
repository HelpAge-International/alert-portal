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

          this.networkService.getNetworkDetail(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(network => {
              this.networkCountryCode = network.countryCode
            })

          //fetch network agencies
          this.networkService.getAgenciesForNetwork(this.networkId)
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
          this.networkService.getLeadAgencyId(this.networkId)
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
    update["/network/" + this.networkId + "/leadAgencyId"] = this.leadAgencyId;
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
      let path = "/network/" + this.networkId + "/agencies/" + agencyId;
      let validationPath = "/networkAgencyValidation/" + agencyId;
      this.networkService.deleteNetworkField(path);
      this.networkService.deleteNetworkField(validationPath);
    }
  }

  resendEmail(agencyId) {

    this.networkService.getCountryCodeForAgency(agencyId, this.networkCountryCode)
      .takeUntil(this.ngUnsubscribe)
      .subscribe( countryCode => {
        this.networkService.resendEmail(this.networkId, agencyId, countryCode);

      })


  }

  navigateToAddAgency(){
    this.router.navigateByUrl("/network/local-network-administration/agencies/invite");
  }

}
