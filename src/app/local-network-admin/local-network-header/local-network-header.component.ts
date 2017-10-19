import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageControlService} from "../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NetworkService} from "../../services/network.service";
import {NetworkUserAccountType} from "../../utils/Enums";

@Component({
  selector: 'app-local-network-header',
  templateUrl: './local-network-header.component.html',
  styleUrls: ['./local-network-header.component.css'],
  providers: [NetworkService]
})
export class LocalNetworkHeaderComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private uid: string;
  private user: any;
  private network: any;
  private networkId: string;
  private USER_TYPE: string;

  constructor(private pageControl: PageControlService,
              private userService: UserService,
              private networkService: NetworkService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (auth, oldUserType) => {
      this.uid = auth.uid;
      this.USER_TYPE = "administratorNetworkLocal";
      //get user info
      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.user = user;
        });

      //get network info
      this.networkService.getSelectedIdObj(this.uid)
        .flatMap(data =>{
          this.networkId = data["id"];
          return this.networkService.getNetworkDetail(data["id"])
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
    this.router.navigateByUrl("/network/local-network-dashboard");
  }

}
