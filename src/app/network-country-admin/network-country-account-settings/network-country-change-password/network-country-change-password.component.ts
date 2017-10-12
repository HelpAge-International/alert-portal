import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FirebaseAuthState} from "angularfire2";

@Component({
  selector: 'app-network-country-change-password',
  templateUrl: './network-country-change-password.component.html',
  styleUrls: ['./network-country-change-password.component.scss']
})
export class NetworkCountryChangePasswordComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models


  //logic
  private networkId: string;
  private networkCountryId: string;
  private showLoader: boolean;
  private uid: string;
  private authState: FirebaseAuthState;
  private user: firebase.User;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.initNetworkAccess();
  }

  private initNetworkAccess() {
    this.pageControl.networkAuthState(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;
      this.authState = user;
      this.user = user.auth;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];

        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  cancel() {
    this.router.navigateByUrl("network-country/network-dashboard").then();
  }

}
