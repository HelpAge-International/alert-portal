import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ModelNetwork} from "../../model/network.model";
import {Observable} from "rxjs/Observable";

declare var jQuery: any;

@Component({
  selector: 'app-global-networks',
  templateUrl: 'global-networks.component.html',
  styleUrls: ['global-networks.component.css']
})
export class GlobalNetworksComponent implements OnInit, OnDestroy {

  networks: FirebaseListObservable<any[]>;
  private alertTitle: string;
  private alertContent: string;
  private networkToUpdate;

  private networkId: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private networkService: NetworkService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.loadNetworks();
      this.getLogo();
    });
  }

  private loadNetworks() {
    this.networks = this.af.database.list(Constants.APP_STATUS + "/network");

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addNetwork() {
    this.router.navigateByUrl(Constants.SYSTEM_ADMIN_ADD_NETWORK);
  }

  getLogo() {

     console.log('get logo');

     this.networks.subscribe(value => {
       console.log(value);
     })

}

  update(network) {
    this.networkToUpdate = network;
    if (this.networkToUpdate.isActive) {
      this.alertTitle = "GLOBAL.DEACTIVATE";
      this.alertContent = "SYSTEM_ADMIN.GLOBAL_NETWORKS.DIALOG.DEACTIVATE_CONTENT";
    } else {
      this.alertTitle = "GLOBAL.ACTIVATE";
      this.alertContent = "SYSTEM_ADMIN.GLOBAL_NETWORKS.DIALOG.ACTIVATE_CONTENT";
    }
    jQuery("#update-network").modal("show");
  }

  toggleActive() {
    let newState = !this.networkToUpdate.isActive;
    this.af.database.object(Constants.APP_STATUS + "/network/" + this.networkToUpdate.$key + "/isActive").set(newState)
      .then(_ => {
        console.log("Network state updated");
        jQuery("#update-network").modal("hide");
      });
  }

  closeModal() {
    jQuery("#update-network").modal("hide");
  }

  edit(network) {
    this.router.navigate([Constants.SYSTEM_ADMIN_ADD_NETWORK, {id: network.$key}], {skipLocationChange: true});
  }

}
