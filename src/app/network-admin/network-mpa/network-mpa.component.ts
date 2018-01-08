import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {ActionLevel, AlertMessageType, GenericActionCategory} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../services/agency-service.service";
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs/Observable";
import {NetworkActionModel} from "./network-create-edit-mpa/network-mpa.model";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {isNumber} from "util";


@Component({
  selector: 'app-network-mpa',
  templateUrl: './network-mpa.component.html',
  styleUrls: ['./network-mpa.component.css']
})
export class NetworkMpaComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private actions: Observable<NetworkActionModel[]>;
  private showLoader: boolean;
  private initFilterSelection = ActionLevel.ALL;
  private actionIdToDelete: string;

  /** Dan variable for bug fix ALT-2185 **/
   private actionLevels: any[] = Constants.ACTION_LEVEL;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private userService: UserService,
              private router: Router,
              private af: AngularFire) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.actions = this.getActions();
          this.showLoader = false;
        })
    });
  }



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getActions() {
    return this.initFilterSelection == ActionLevel.ALL ? this.networkService.getNetworkActions(this.networkId) :
      this.initFilterSelection == ActionLevel.MPA ? this.networkService.getNetworkMpa(this.networkId) :
        this.networkService.getNetworkApa(this.networkId);
  }

  filterActions() {
    this.actions = this.getActions();
  }

  editAction(actionId) {
    console.log(actionId);
    this.router.navigate(["/network/network-mpa/network-create-edit-mpa", {id: actionId}]);
  }

  getActionIdToDelete(actionId) {
    console.log(actionId);
    this.actionIdToDelete = actionId;
  }

  deleteMandatedAction() {
    this.networkService.deleteNetworkAction(this.networkId, this.actionIdToDelete);
  }

}
