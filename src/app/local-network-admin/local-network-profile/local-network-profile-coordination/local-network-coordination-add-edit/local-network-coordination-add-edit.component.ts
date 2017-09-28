import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {NetworkService} from "../../../../services/network.service";
import {CoordinationArrangementService} from "../../../../services/coordination-arrangement.service";
import {CoordinationArrangementNetworkModel} from "../../../../model/coordination-arrangement-network.model";
import {ModelStaff} from "../../../../model/staff.model";
import {AgencyService} from "../../../../services/agency-service.service";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {isEmptyObject} from "angularfire2/utils";

declare var jQuery: any;

@Component({
  selector: 'app-local-network-coordination-add-edit',
  templateUrl: './local-network-coordination-add-edit.component.html',
  styleUrls: ['./local-network-coordination-add-edit.component.scss']
})
export class LocalNetworkCoordinationAddEditComponent implements OnInit, OnDestroy {

  private uid: string;
  private networkId: string;
  private agenciesIds = [];
  private agencies = [];
  private networkMembers = {};

  // Constants and enums
  private alertMessageType = AlertMessageType;
  responsePlansSectors = ResponsePlanSectors;
  responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;

  // Models
  private alertMessage: AlertMessageModel = null;
  private coordinationArrangement: CoordinationArrangementNetworkModel;




  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private networkService: NetworkService,
              private _coordinationArrangementService: CoordinationArrangementService,
              private _agencyService: AgencyService,
              private router: Router,
              private route: ActivatedRoute) {
    this.coordinationArrangement = new CoordinationArrangementNetworkModel();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;


      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          this.route.params.subscribe((params: Params) => {
            if (params['id']) {
              console.log(this.networkId, params['id'])
              this._coordinationArrangementService.getCoordinationArrangementNetwork(this.networkId, params['id'])
                .subscribe(coordinationArrangement => {
                  this.coordinationArrangement = coordinationArrangement;
                  this.networkMembers = coordinationArrangement.agencies
                });
            }
          });

          this.networkService.getNetworkDetail(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe( network => {
              Object.keys(network.agencies).forEach( agencyId => {
                this.agenciesIds.push(agencyId)
                this._agencyService.getAgency(agencyId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe( agency => {
                    this.agencies.push(agency)
                    console.log(this.agenciesIds)
                    console.log(this.agencies)
                  })
              })

            })
        })
    })
  }

  validateForm(): boolean {
    this.alertMessage = this.coordinationArrangement.validate();

    return !this.alertMessage;
  }

  submit() {

    if(isEmptyObject(this.coordinationArrangement)){
      this.coordinationArrangement["agencies"] = this.networkMembers
    }
    this._coordinationArrangementService.saveCoordinationArrangementNetwork(this.networkId, this.coordinationArrangement)
      .then(() => {
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_SAVED', AlertMessageType.Success);
          setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
        },
        err => {
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
  }


  goBack() {
    this.router.navigateByUrl('/network/local-network-office-profile/coordination');
  }

  toggleAgencySelection(agency){
    if (this.networkMembers[agency.$key]) {
      delete this.networkMembers[agency.$key]
    } else {
      this.networkMembers[agency.$key] = true
    }
    console.log(this.networkMembers)
    console.log(this.coordinationArrangement)
  }




  deleteCoordinationArrangement() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    this._coordinationArrangementService.deleteCoordinationArrangementNetwork(this.networkId, this.coordinationArrangement)
      .then(() => {
        this.goBack();
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

}
