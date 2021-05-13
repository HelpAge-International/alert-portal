
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ActionLevel, ActionType, AlertMessageType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AgencyService} from "../../../services/agency-service.service";
import {UserService} from "../../../services/user.service";
import {NetworkActionModel} from "./network-mpa.model";
import * as moment from "moment";
import {isNumber} from "util";

@Component({
  selector: 'app-network-create-edit-mpa',
  templateUrl: './network-create-edit-mpa.component.html',
  styleUrls: ['./network-create-edit-mpa.component.css']
})
export class NetworkCreateEditMpaComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private ActionType = ActionLevel;


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private networkActionModel = new NetworkActionModel();


  //logic
  private networkId: string;
  private isEditing: boolean;
  private actionId: string;
  private showLoader: boolean;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {

    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          //get params
          this.route.params.pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe((params: Params) => {
              if (params["id"]) {
                this.actionId = params["id"];
                this.isEditing = true;
                this.showLoader = true;
                this.loadAction(this.actionId);
              }
            });
        })
    });
  }

  private loadAction(actionId: string) {
    this.networkService.getNetworkActionDetail(this.networkId, actionId).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(action => {
        this.networkActionModel = action;
        //fix the problem level snot showing on html
        if (isNumber(this.networkActionModel.level)) {
          this.networkActionModel.level = String(this.networkActionModel.level);
        }
        this.showLoader = false;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveNetworkMpa() {
    this.alertMessage = this.networkActionModel.validate([]);
    if (!this.alertMessage) {
      this.isEditing ? this.editAction() : this.createAction();
    }
  }

  private createAction() {
    //fill model info for mpa
    // this.networkActionModel.isActive = true;
    this.networkActionModel.createdAt = moment.utc().valueOf();
    this.networkActionModel.type = ActionType.mandated;

    this.networkService.saveNetworkAction(this.networkId, this.networkActionModel).then(() => {
      this.router.navigateByUrl("/network/network-mpa");
    }).catch(error => {
      console.log(error.message);
    })

  }

  private editAction() {
    console.log(this.networkActionModel);
    this.networkActionModel.id = null;
    this.networkService.updateNetworkAction(this.networkId, this.actionId, this.networkActionModel).then(() => {
      this.router.navigateByUrl("/network/network-mpa");
    }).catch(error => {
      console.log(error.message);
    });
  }

}
