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
export class GlobalNetworksComponent implements OnInit,OnDestroy {
  subscriptions: RxHelper;
  networks: FirebaseListObservable<any[]>;

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
    this.subscriptions = new RxHelper();
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

  toggleActive(network) {
    let title = "";
    let content = "";
    if (network.isActive) {
      title = "Deactivate " + network.name;
      content = "Are you sure you want to deactivate this network? The associated users will be unable to access the network page and all associated indicators, actions and response plans will be removed.";
    } else {
      title = "Activate " + network.name;
      content = "Are you sure you want to activate this network? The associated users will be able to access the network page.";
    }
    let subscription = this.dialogService.createDialog(title, content)
      .subscribe(result => {
        if (!result) {
          return
        }
        let newState = !network.isActive;
        this.af.database.object(Constants.APP_STATUS + "/network/" + network.$key + "/isActive").set(newState);
      });
    this.subscriptions.add(subscription);
  }

  edit(network) {
    console.log(network.$key)
    this.router.navigate([Constants.SYSTEM_ADMIN_ADD_NETWORK, {id: network.$key}])
  }

}
