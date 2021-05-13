
import {map} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {AlertMessageType, UserType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {Http, Response} from '@angular/http';
import {ExportDataService} from "../../services/export-data.service";
import {AgencyService} from "../../services/agency-service.service";
import {AlertMessageModel} from "../../model/alert-message.model";
import {ExportPersonalService} from "../../services/export-personal";

declare var jQuery: any;

@Component({
  selector: 'app-agency-admin-header',
  templateUrl: './agency-admin-header.component.html',
  styleUrls: ['./agency-admin-header.component.css']
})

export class AgencyAdminHeaderComponent implements OnInit, OnDestroy {

  private uid: string;
  private countryId: string;
  private firstName: string = "";
  private lastName: string = "";
  private agencyName: string = "";
  private counter: number = 0;

  // Dan's switch language
  private languageSelectPath: string = '';
  private languageMap = new Map();
  private userLang = [];
  private language: string;
  private browserLang: string = "";
  // End
  private USER_TYPE: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyId: string;
  private showLoader: boolean

  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  constructor(private pageControl: PageControlService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private http: Http,
              private agencyService:AgencyService,
              private exportService: ExportDataService,
              private translate: TranslateService,
              private exportPersonalService: ExportPersonalService) {


    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();
  }

  ngOnInit() {
    jQuery('.float').hide();
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemAdminId) => {
      this.uid = user.uid;
      this.countryId = countryId;
      this.USER_TYPE = Constants.USER_PATHS[UserType.AgencyAdmin];
      this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";

      this.loadJSON().subscribe(data => {

        for (var key in data) {

          this.userLang.push(key);
          this.languageMap.set(key, data[key]);
        }

      });

      // Check chosen user language

      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          if (user.language) {
            this.language = user.language;
            this.translate.use(this.language.toLowerCase());
          } else {
            this.language = "en"

          }
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/language").set(this.language.toLowerCase());


          this.translate.use(this.language.toLowerCase());

        });

      this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + this.uid + "/agencyId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe(id => {
          if (id.$value == null) {
            this.router.navigateByUrl("/login");
          } else {
            this.agencyId = id.$value
            this.af.database.object(Constants.APP_STATUS + "/agency/" + id.$value)
              .takeUntil(this.ngUnsubscribe).subscribe(agency => {
              this.agencyName = agency.name;
            });
          }
        });

      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe).subscribe(user => {
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

  reportProblem() {
    jQuery('.float').show();
  }

  // Dan's Modal functions

  loadJSON() {
    return this.http.get(this.languageSelectPath).pipe(
      map((res: Response) => res.json().GLOBAL.LANGUAGES));
  }

  openLanguageModal() {
    console.log('Open language modal');
    jQuery("#language-selection").modal("show");
  };

  changeLanguage(language: string) {
    this.language = language;
    console.log(this.uid);

    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/language").set(language.toLowerCase());

    if (language.toLowerCase()) {
      this.translate.use(language.toLowerCase());
      jQuery("#language-selection").modal("hide");


    }
  }

  goToHome() {
    this.router.navigateByUrl("/agency-admin/country-office");
  }

  exportData() {
    console.log("start exporting agency data")
    this.agencyService.getAllCountryIdsForAgency(this.agencyId)
      .first()
      .subscribe(countryIds => {
        if (countryIds.length > 0) {
          this.showLoader = true
          this.exportService.exportAgencyData(this.agencyId)
            .first()
            .subscribe(value => this.showLoader = !value)
        } else {
          this.alertMessage = new AlertMessageModel("Cannot export data for an empty agency, please create country office first")
        }
      })
  }

  exportPersonalData() {
    this.exportPersonalService.exportPersonalData(this.uid, this.countryId);
  }

}
