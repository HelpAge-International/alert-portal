import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {UserService} from "../../services/user.service";
import {UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import { NotificationService } from "../../services/notification.service";
import { MessageModel } from "../../model/message.model";

@Component({
  selector: 'app-director-header',
  templateUrl: './director-header.component.html',
  styleUrls: ['./director-header.component.css']
})

export class DirectorHeaderComponent implements OnInit, OnDestroy {

  private USER_TYPE: string;

  private uid: string;
  private agencyId: string;
  private agencyName: string = "";

  private firstName: string = "";
  private lastName: string = "";

  private userPaths = Constants.USER_PATHS;
  
  private unreadMessages: MessageModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private userService: UserService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.USER_TYPE = this.userPaths[userType];
      if (this.USER_TYPE) {
        this.getAgencyName();
      }

      this.userService.getAgencyId(this.USER_TYPE, this.uid).subscribe(agencyId => {
            this.agencyId = agencyId;
      });

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
    console.log("logout");
    this.af.auth.logout();
  }

  /**
   * Private functions
   */

  private getAgencyName() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyId = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
          if (this.agencyId) {
            this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + '/name')
              .takeUntil(this.ngUnsubscribe)
              .subscribe((agencyName) => {
                this.agencyName = agencyName ? agencyName.$value : "Agency";
                res(true);
              });
          }
        });
    });
    return promise;
  }

}
