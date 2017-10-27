import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import {LocalStorageService} from "angular-2-local-storage";

declare var jQuery: any;

@Component({
  selector: 'app-country-notifications',
  templateUrl: './country-notifications.component.html',
  styleUrls: ['./country-notifications.component.css']
})
export class CountryNotificationsComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;
  private countryId: string;
  private USER_TYPE;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private networkViewValues: {};

  constructor(private pageControl: PageControlService,
              private _userService: UserService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private storageService: LocalStorageService,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.USER_TYPE = Constants.USER_PATHS[userType];
      this.agencyId = agencyId;
      this.countryId = countryId;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
