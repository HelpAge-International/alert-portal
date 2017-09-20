import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {MessageModel} from "../../model/message.model";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-donor-header',
  templateUrl: './donor-header.component.html',
  styleUrls: ['./donor-header.component.css']
})

export class DonorHeaderComponent implements OnInit {

  private USER_TYPE: string;

  private uid: string;
  private agencyId: string;
  private countryId: string;
  private agencyName: string = "";

  private firstName: string = "";
  private lastName: string = "";

  private userPaths = Constants.USER_PATHS;

  private unreadMessages: MessageModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId;
      this.USER_TYPE = this.userPaths[userType];

      if (this.USER_TYPE) {
        this.getAgencyName();
      }

      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout() {
    console.log('countryId:' + this.countryId + ' userId:' + this.uid);
    this.af.auth.logout();
  }

  goToHome() {
    this.router.navigateByUrl("/donor-module");
  }

  /**
   * Private functions
   */

  private getAgencyName() {
    if (this.agencyId) {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + '/name')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyName) => {
          this.agencyName = agencyName ? agencyName.$value : this.translate.instant("AGENCY");
        });
    }
  }

}
