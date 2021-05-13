import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {NetworkService} from "../../services/network.service";
import {NetworkUserAccountType} from "../../utils/Enums";

@Component({
  selector: 'app-network-notifications',
  templateUrl: './network-notifications.component.html',
  styleUrls: ['./network-notifications.component.css']
})
export class NetworkNotificationsComponent implements OnInit, OnDestroy {

  private uid: string;
  private networkId: string;
  private USER_TYPE;
  private showLoader: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isLocalNetworkAdmin: boolean;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.route.params.subscribe((params: Params) => {
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }

      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;
        this.USER_TYPE = Constants.NETWORK_USER_PATHS[NetworkUserAccountType.NetworkAdmin];

        this.networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];
            this.showLoader = false;
          })
      });

    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
