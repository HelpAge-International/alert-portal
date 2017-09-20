import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageControlService} from "../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NetworkService} from "../../services/network.service";
import {Constants} from "../../utils/Constants";
import {NetworkUserAccountType, UserType} from "../../utils/Enums";

@Component({
  selector: 'app-network-header',
  templateUrl: './network-header.component.html',
  styleUrls: ['./network-header.component.css'],
  providers: [NetworkService]
})
export class NetworkHeaderComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private uid: string;
  private user: any;
  private network: any;
  private USER_TYPE: string;
  private networkId : string;

  constructor(private pageControl: PageControlService,
              private userService: UserService,
              private networkService: NetworkService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (auth, oldUserType) => {
      this.uid = auth.uid;
      this.USER_TYPE = Constants.NETWORK_USER_PATHS[NetworkUserAccountType.NetworkAdmin];

      //get user info
      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.user = user;
        });

      //get network info
      this.networkService.checkNetworkUserSelection(this.uid)
        .flatMap(data =>{
          this.networkId = data.networkId;
          return this.networkService.getNetworkDetail(data.networkId)
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(network =>{
          this.network = network;
        })

    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout() {
    console.log("logout");
    this.userService.logout();
  }

  goToHome() {
    this.router.navigateByUrl("/network/network-offices");
  }

}
