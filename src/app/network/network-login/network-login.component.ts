/**
 * Created by dongishan on 27/06/2017.
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-network-login',
  templateUrl: './network-login.component.html',
  styleUrls: ['./network-login.component.css']
})

export class NetworkLoginComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router,
      (user, prevUserType, networkIds, networkCountryIds) => {
        console.log("Authenticated: " + user.uid);
        console.log(networkIds);
        console.log(networkCountryIds);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
