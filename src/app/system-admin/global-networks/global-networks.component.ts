import {Component, OnInit, OnDestroy} from '@angular/core';
import {RxHelper} from "../../utils/RxHelper";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
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

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.loadNetworks();
    });
    this.subscriptions.add(subscription);
  }

  private loadNetworks() {
    this.networks = this.af.database.list(Constants.APP_STATUS + "/network");
    console.log(this.networks)
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  addNetwork() {
    this.router.navigateByUrl(Constants.SYSTEM_ADMIN_ADD_NETWORK);
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
