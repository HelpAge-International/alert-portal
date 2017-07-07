import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../../model/message";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import { AlertMessageModel } from '../../model/alert-message.model';
import { AlertMessageType, UserType } from '../../utils/Enums';

declare var jQuery: any;
@Component({
  selector: 'app-agency-notifications',
  templateUrl: './agency-notifications.component.html',
  styleUrls: ['./agency-notifications.component.css']
})
export class AgencyNotificationsComponent implements OnInit, OnDestroy {

  private uid: string;
  private USER_TYPE: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.USER_TYPE = Constants.USER_PATHS[UserType.AgencyAdmin];
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
