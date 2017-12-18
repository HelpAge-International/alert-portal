import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {NetworkUserAccountType} from "../../utils/Enums";

@Component({
  selector: 'app-network-country-notifications',
  templateUrl: './network-country-notifications.component.html',
  styleUrls: ['./network-country-notifications.component.scss']
})
export class NetworkCountryNotificationsComponent implements OnInit, OnDestroy {

  private uid: string;
  private networkId: string;
  private USER_TYPE;
  private showLoader: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private networkCountryId: string;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      this.USER_TYPE = Constants.NETWORK_USER_PATHS[NetworkUserAccountType.NetworkCountryAdmin];

      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          this.showLoader = false;
        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
