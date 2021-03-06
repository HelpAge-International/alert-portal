import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {Http, Response} from '@angular/http';
import {EXPORT_FROM, ExportDataService} from "../../services/export-data.service";
import {ExportPersonalService} from "../../services/export-personal";

declare var jQuery: any;

@Component({
  selector: 'app-system-admin-header',
  templateUrl: 'system-admin-header.component.html',
  styleUrls: ['system-admin-header.component.css']
})

export class SystemAdminHeaderComponent implements OnInit, OnDestroy {

  uid: string;
  private countryId: string;
  firstName: string = "";
  lastName: string = "";
  counter: number = 0;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  // Dan's switch language
  private languageSelectPath: string = '';
  private languageMap = new Map();
  private userLang = [];
  private language: string;
  private browserLang: string = "";
  private showLoader: boolean;

  // End

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private translate: TranslateService,
              private exportService:ExportDataService,
              private http: Http,
              private exportPersonalService: ExportPersonalService) {

    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();

  }

  ngOnInit() {
    jQuery('.float').hide();
    // this.showLoader = true;
    this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId;
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.showLoader = false;
        });
      this.loadJSON().subscribe(data => {

        for (var key in data) {

          this.userLang.push(key);
          this.languageMap.set(key, data[key]);
        }

      });

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

  reportProblem(){
    jQuery('.float').show();
  }


  goToHome() {
    this.router.navigateByUrl("/system-admin/agency");
  }

  // Dan's Modal functions

  loadJSON() {

    return this.http.get(this.languageSelectPath)
      .map((res: Response) => res.json().GLOBAL.LANGUAGES);

  }

  openLanguageModal() {

    console.log('Open language modal');
    jQuery("#language-selection").modal("show");

  };

  changeLanguage(language: string) {
    this.language = language;
    console.log(this.uid);

    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/language").set(language.toLowerCase());


    this.translate.use(language.toLowerCase());
    jQuery("#language-selection").modal("hide");


  }

  exportData() {
    console.log("start exporting agency data")
    this.showLoader = true
    this.exportService.exportSystemData(EXPORT_FROM.FromSystem)
      .first()
      .subscribe(value => this.showLoader = !value)
  }

  private exportPersonalData() {
    this.exportPersonalService.exportPersonalData(this.uid, this.countryId);
  }

}
