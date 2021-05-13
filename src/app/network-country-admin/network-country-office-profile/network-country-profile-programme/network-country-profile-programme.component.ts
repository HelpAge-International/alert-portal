import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-network-country-profile-programme',
  templateUrl: './network-country-profile-programme.component.html',
  styleUrls: ['./network-country-profile-programme.component.scss']
})
export class NetworkCountryProfileProgrammeComponent implements OnInit,OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models



  //logic
  private networkId: string;
  private networkCountryId: string;
  private showLoader: boolean;
  private uid: string;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.initNetworkAccess();
  }

  private initNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

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

}
