import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../../model/message";
import {MessageModel} from "../../model/message.model";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import { AlertMessageModel } from '../../model/alert-message.model';
import { AlertMessageType } from '../../utils/Enums';

declare var jQuery: any;
@Component({
  selector: 'app-director-notifications',
  templateUrl: './director-notifications.component.html',
  styleUrls: ['./director-notifications.component.css']
})
export class DirectorNotificationsComponent implements OnInit, OnDestroy {
  private loaderInactive: boolean;
  
  private uid: string;
  private agencyId: string;
  private countryId: string;
  private USER_TYPE;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private _userService: UserService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
          
        this._userService.getUserType(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(userType => {
          
          this.USER_TYPE = Constants.USER_PATHS[userType];
          
          this._userService.getAgencyId(this.USER_TYPE, this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyId => {
              this.agencyId = agencyId;
              this.loaderInactive = true;
          });
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
