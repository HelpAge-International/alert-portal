import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.loadNetworks();
    });
  }

  private loadNetworks() {
    this.networks = this.af.database.list(Constants.APP_STATUS + "/network");
    console.log(this.networks)
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
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
    this.af.database.object(Constants.APP_STATUS + "/network/" + this.networkToUpdate.$key + "/isArchived").set(newState)
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
