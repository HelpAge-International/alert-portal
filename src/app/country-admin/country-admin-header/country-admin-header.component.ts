import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {AlertLevels, AlertStatus, Countries, UserType} from "../../utils/Enums";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {MessageModel} from "../../model/message.model";

@Component({
  selector: 'app-country-admin-header',
  templateUrl: './country-admin-header.component.html',
  styleUrls: ['./country-admin-header.component.css'],
  providers: [ActionsService]
})

export class CountryAdminHeaderComponent implements OnInit, OnDestroy {

  @Output() partnerAgencyRequest = new EventEmitter();

  private partnerAgencies = [];
  private agenciesMap = new Map();

  private UserType = UserType;
  private userType: UserType;

  private alertLevel: AlertLevels;
  private alertTitle: string;

  private USER_TYPE: string;

  private uid: string;
  private countryId: string;
  private agencyId: string;
  private agencyDetail: any;

  private firstName: string = "";
  private lastName: string = "";

  private countryLocation: any;
  private Countries = Countries;
  private unreadMessages: MessageModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isAmber: boolean;
  private isRed: boolean;
  private isAnonym: boolean = false;

  constructor(private pageControl: PageControlService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private alertService: ActionsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.agencyId = agencyId;
      this.countryId = countryId;
      this.isAnonym = user && !user.anonymous ? false : true;
      if (user) {
        if (this.isAnonym && this.userService.anonymousUserPath != 'ExternalPartnerResponsePlan') {
          this.af.auth.logout().then(() => {
            this.router.navigate(['/login']);
          });
        }
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
              this.userType = userType;
              this.USER_TYPE = Constants.USER_PATHS[userType];
              //after user type check, start to do the job
              if (this.USER_TYPE) {
                if (this.userType == UserType.PartnerUser) {
                  this.initDataForPartnerUser(agencyId, countryId);
                } else {
                  this.getCountryId().then(() => {
                    this.getAgencyID().then(() => {
                      this.getCountryData();
                      this.checkAlerts();
                      this.userService.getAgencyDetail(this.agencyId)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(agencyDetail => {
                          this.agencyDetail = agencyDetail;
                        });
                    });
                  });
                }
              }
            });
        }
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  private initDataForPartnerUser(agencyId, countryId) {
    this.af.database.list(Constants.APP_STATUS + "/partnerUser/" + this.uid + "/agencies")
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyCountries => {

        // this.agencyId = agencyCountries[0].$key;
        // this.countryId = agencyCountries[0].$value;
        this.agencyId = agencyId;
        this.countryId = countryId;

        this.userService.getAgencyDetail(this.agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencyDetail => {
            this.agencyDetail = agencyDetail;
          });

        // this.partnerAgencies = [];
        agencyCountries.forEach(ids => {
          this.userService.getAgencyDetail(ids.$key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agency => {
              // console.log(this.partnerAgencies);
              agency["relatedCountryId"] = ids.$value;
              this.agenciesMap.set(ids.$key, agency);
              this.partnerAgencies = this.getPartnerAgencies(this.agenciesMap);
            });
        });

        this.getCountryData();
        this.checkAlerts();
      });
  }

  getPartnerAgencies(agencies: Map<any, any>) {
    let data = [];
    agencies.forEach((v, k) => {
      data.push(v);
    });
    return data;
  }

  private checkAlerts() {
    this.alertService.getAlerts(this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alerts: ModelAlert[]) => {
        this.isRed = false;
        this.isAmber = false;
        alerts.forEach(alert => {
          if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
            this.isRed = true;
          }
          if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))
            || (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse)) {
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

  selectAgencyCountryForPartner(agency) {
    if (agency.$key != this.agencyId) {
      this.partnerAgencyRequest.emit(agency);
      this.agencyId = agency.$key;
      this.countryId = agency.relatedCountryId;
      this.userService.getAgencyDetail(agency.$key)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencyDetail => {
          this.agencyDetail = agencyDetail;
          this.getCountryData();
          this.checkAlerts();
        });

      //update selection in firebase
      let selection = {};
      selection[this.agencyId] = this.countryId;
      this.af.database.object(Constants.APP_STATUS + "/partnerUser/" + this.uid + "/selection").set(selection).then(() => {

        // Navigate to the same page again - force reload
        let url = PageControlService.buildEndUrl(this.route);
        if (url.includes("preparedness")) {
          this.router.navigateByUrl(PageControlService.buildEndUrl(this.route)).then(() => {
            window.location.reload();
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });


    }
  }

  logout() {
    console.log("logout");
    this.af.auth.logout();
  }

  goToHome() {
    this.router.navigateByUrl("/dashboard");
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
          this.agencyId = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + '/' + this.countryId + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          res(true);
        });
    });
    return promise;
  }
}
