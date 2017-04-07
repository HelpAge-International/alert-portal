import {Component, OnInit, OnDestroy} from '@angular/core';
import {RxHelper} from "../../utils/RxHelper";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router, ActivatedRoute} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {DialogService} from "../../dialog/dialog.service";

@Component({
  selector: 'app-global-networks',
  templateUrl: 'global-networks.component.html',
  styleUrls: ['global-networks.component.css']
})
export class GlobalNetworksComponent implements OnInit, OnDestroy {
  networks: FirebaseListObservable<any[]>;

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService, private subscriptions: RxHelper) {
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
    this.networks = this.af.database.list("/network");
    console.log(this.networks)
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  addNetwork() {
    this.router.navigateByUrl(Constants.SYSTEM_ADMIN_ADD_NETWORK);
  }

  toggleActive(network) {
    // let title = "";
    // let content = "";
    // if (network.isActive) {
    //   title = "GLOBAL.DEACTIVATE";
    //   content = "SYSTEM_ADMIN.GLOBAL_NETWORKS.DIALOG.DEACTIVATE_CONTENT";
    // } else {
    //   title = "GLOBAL.ACTIVATE";
    //   content = "SYSTEM_ADMIN.GLOBAL_NETWORKS.DIALOG.ACTIVATE_CONTENT";
    // }
    // let subscription = this.dialogService.createDialog(title, content)
    //   .subscribe(result => {
    //     if (!result) {
    //       return
    //     }
    //     let newState = !network.isActive;
    //     this.af.database.object(Constants.APP_STATUS + "/network/" + network.$key + "/isActive").set(newState);
    //   });
    // this.subscriptions.add(subscription);
  }

  edit(network) {
    this.router.navigate([Constants.SYSTEM_ADMIN_ADD_NETWORK, {id: network.$key}], {skipLocationChange: true});
  }

}
