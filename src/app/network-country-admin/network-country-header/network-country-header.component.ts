import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType, Countries, NetworkUserAccountType} from "../../utils/Enums";
import {Observable} from "rxjs/Observable";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModelNetwork} from "../../model/network.model";
import {UserService} from "../../services/user.service";
import {ModelUserPublic} from "../../model/user-public.model";
import {NetworkCountryModel} from "../network-country.model";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-network-country-header',
  templateUrl: './network-country-header.component.html',
  styleUrls: ['./network-country-header.component.css']
})
export class NetworkCountryHeaderComponent implements OnInit, OnDestroy {
  private uid: string;

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private Countries = Countries;

  // Models

  //logic
  private networkId: string;
  private networkCountryId: any;
  private network: Observable<ModelNetwork>;
  private user: Observable<ModelUserPublic>;
  private networkCountry: Observable<NetworkCountryModel>;
  private alertLevel: number = 0;
  private USER_TYPE: string;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      this.USER_TYPE = Constants.NETWORK_USER_PATHS[NetworkUserAccountType.NetworkCountryAdmin];

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          //must be network country admin, otherwise need check first
          this.networkCountryId = selection["networkCountryId"];

          //get network info
          this.network = this.networkService.getNetworkDetail(this.networkId);

          //get user info
          this.user = this.userService.getUser(user.uid);

          //get network country info
          this.networkCountry = this.networkService.getNetworkCountry(this.networkId, this.networkCountryId);

        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout() {
    this.userService.logout();
  }

}
