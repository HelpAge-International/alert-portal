import {Component, OnDestroy, OnInit} from "@angular/core";
import {NotificationSettingEvents, UserType} from "../../../utils/Enums";
import {Constants} from "../../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ModelAgency} from "../../../model/agency.model";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";

declare var jQuery: any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyNotificationSettings = [];
  private notificationSettings = Constants.NOTIFICATION_SETTINGS;
  private notificationSettingsList: number[] = [
    NotificationSettingEvents.AlertLevelChanged,
    NotificationSettingEvents.RedAlertRequest,
    NotificationSettingEvents.UpdateHazard,
    NotificationSettingEvents.ActionExpired,
    NotificationSettingEvents.PlanExpired,
    NotificationSettingEvents.PlanRejected
  ];

  private userTypes = Constants.USER_TYPE;
  private userTypesList: number[] = [
    UserType.All,
    UserType.GlobalDirector,
    UserType.RegionalDirector,
    UserType.CountryDirector,
    UserType.ErtLeader,
    UserType.Ert,
    UserType.Donor,
    UserType.GlobalUser,
    UserType.CountryAdmin
  ];
  private userNotified = [];
  private notificationID: number;
  private agencyId: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
      this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + this.uid + "/agencyId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe(id => {
          this.agencyId = id.$value;
          this.loadAgencyData(this.agencyId);
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectUserType(settingID: number) {
    this.notificationID = settingID;
    this.loadAgencyData(this.agencyId);
    jQuery("#select-user-type").modal("show");
  }

  checkType(typeKey: number, event: any) {
    if (!typeKey) {
      var elements = this.agencyNotificationSettings[this.notificationID].usersNotified;
      for (let element in elements) {
        this.agencyNotificationSettings[this.notificationID].usersNotified[element] = event;
      }
    } else {
      this.agencyNotificationSettings[this.notificationID].usersNotified[0] = false;
      this.agencyNotificationSettings[this.notificationID].usersNotified[typeKey] = event;
    }
    return true;
  }

  saveNotificationSettings() {
    var checkedTypes = this.agencyNotificationSettings[this.notificationID].usersNotified;

    var dataToSend = [];
    checkedTypes.forEach((val, key) => {
      if (key) {
        dataToSend.push(val);
      }
    });

    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + '/notificationSetting/' + this.notificationID + '/usersNotified')
      .set(dataToSend)
      .then(() => {
        this.closeModal();
      }).catch((error: any) => {
      console.log(error, 'You do not have access!')
    });
  }

  closeModal() {
    jQuery("#select-user-type").modal("hide");
  }

  private loadAgencyData(uid: string) {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((agency: ModelAgency) => {
        this.agencyNotificationSettings = agency.notificationSetting;
        this.notificationSettingsList.forEach((item, iItem) => {
          var userNotified = this.agencyNotificationSettings[item].usersNotified;
          var userNotifiedText = [];
          var allEnable = true;
          userNotified.forEach((val, iVal) => {
            if (val) {
              userNotifiedText.push(this.translate.instant(this.userTypes[iVal + 1]));
            } else {
              allEnable = false;
            }
          });
          this.agencyNotificationSettings[item].usersNotified.unshift(allEnable);
          this.userNotified[iItem] = userNotifiedText;
        });
      });
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
