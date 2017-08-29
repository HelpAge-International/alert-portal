import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../services/agency-service.service";
import {FirebaseObjectObservable} from "angularfire2";
import {NetworkAgencyModel} from "./network-agency.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-network-agencies',
  templateUrl: './network-agencies.component.html',
  styleUrls: ['./network-agencies.component.css']
})
export class NetworkAgenciesComponent implements OnInit, OnDestroy {

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
  private showLoader:boolean;


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
              if (agencies) {
                this.networkAgencies = agencies;
              }
              this.showLoader = false;
            });

          //fetch lead agency id
          this.networkService.getLeadAgencyId(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(id => {
              if (id) {
                this.leadAgencyId = id;
                this.leadAgency = this.agencyService.getAgency(this.leadAgencyId);
              }
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
    let path = "/network/" + this.networkId + "/agencies/" + agencyId;
    let validationPath = "/networkAgencyValidation/" + agencyId;
    this.networkService.deleteNetworkField(path);
    this.networkService.deleteNetworkField(validationPath);
  }

  resendEmail(agencyId) {
    console.log(agencyId);
    this.networkService.resendEmail(this.networkId, agencyId);
  }

}
