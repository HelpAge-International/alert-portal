import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {AlertLevels, AlertStatus, Countries, UserType} from "../../utils/Enums";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-country-admin-header',
  templateUrl: './country-admin-header.component.html',
  styleUrls: ['./country-admin-header.component.css'],
  providers: [ActionsService]
})

export class CountryAdminHeaderComponent implements OnInit, OnDestroy {

  private alertLevel: AlertLevels;
  private alertTitle: string;

  // TODO - Check when other users are implemented
  // private USER_TYPE: string = 'administratorCountry';
  private USER_TYPE: string;

  private uid: string;
  private countryId: string;
  private agencyAdminId: string;

  private firstName: string = "";
  private lastName: string = "";

  private countryLocation: any;
  private Countries = Countries;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isAmber: boolean;
  private isRed: boolean;
  private isAnonym: boolean = false;

  constructor(private af: AngularFire, private router: Router, private alertService: ActionsService, private userService: UserService) {

  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (user) {
        console.log(user);
        this.isAnonym = user.anonymous ? user.anonymous : false;
        if (!user.anonymous) {
          this.uid = user.auth.uid;
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              this.firstName = user.firstName;
              this.lastName = user.lastName;
            });
          this.userService.getUserType(this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(userType => {
              this.USER_TYPE = Constants.USER_PATHS[userType];
              //after user type check, start to do the job
              if (this.USER_TYPE) {
                this.getCountryId().then(() => {
                  this.getAgencyID().then(() => {
                    this.getCountryData();
                    this.checkAlerts();
                  });
                });
              }
            });
        }
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  private checkAlerts() {
    this.alertService.getAlerts(this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alerts: ModelAlert[]) => {
        alerts.forEach(alert => {
          if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
            this.isRed = true;
          }
          if (alert.alertLevel == AlertLevels.Amber && alert.approvalStatus == AlertStatus.Approved) {
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

  private getCountryId() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryId: any) => {
          this.countryId = countryId.$value;
          res(true);
        });
    });
    return promise;
  }

  private getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyAdminId = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyAdminId + '/' + this.countryId + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          res(true);
        });
    });
    return promise;
  }
}
