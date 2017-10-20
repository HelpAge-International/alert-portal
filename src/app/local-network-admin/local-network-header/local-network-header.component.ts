import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageControlService} from "../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NetworkService} from "../../services/network.service";
import {AlertLevels, AlertStatus, Countries} from "../../utils/Enums";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";

@Component({
  selector: 'app-local-network-header',
  templateUrl: './local-network-header.component.html',
  styleUrls: ['./local-network-header.component.css'],
  providers: [NetworkService]
})
export class LocalNetworkHeaderComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private Countries = Countries;

  private uid: string;
  private user: any;
  private network: any;
  private networkId: string;
  private USER_TYPE: string;

  private alertLevel: number;
  private isAmber: boolean;
  private isRed: boolean;
  private alertTitle: string;

  constructor(private pageControl: PageControlService,
              private userService: UserService,
              private networkService: NetworkService,
              private alertService: ActionsService,
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
        .flatMap(data => {
          this.networkId = data["id"];
          return this.networkService.getNetworkDetail(data["id"])
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(network => {
          this.network = network;
          this.checkAlerts();
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

  private checkAlerts() {
    this.alertService.getAlerts(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alerts: ModelAlert[]) => {
        this.isRed = false;
        this.isAmber = false;
        alerts.forEach(alert => {
          if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
            this.isRed = true;
          }
          if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))) {
            this.isAmber = true;
          }
        });

        if (this.isRed) {
          this.alertLevel = AlertLevels.Red;
          this.alertTitle = "ALERT.RED_ALERT_LEVEL";
        } else if (this.isAmber) {
          this.alertLevel = AlertLevels.Amber;
          this.alertTitle = "ALERT.AMBER_ALERT_LEVEL";
        } else {
          this.alertLevel = AlertLevels.Green;
          this.alertTitle = "ALERT.GREEN_ALERT_LEVEL";
        }
      });
  }

}
