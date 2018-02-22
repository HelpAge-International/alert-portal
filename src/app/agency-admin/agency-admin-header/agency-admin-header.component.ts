import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {UserType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Message} from "../../model/message";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {Http, Response} from '@angular/http';
declare var jQuery: any;

@Component({
  selector: 'app-agency-admin-header',
  templateUrl: './agency-admin-header.component.html',
  styleUrls: ['./agency-admin-header.component.css']
})

export class AgencyAdminHeaderComponent implements OnInit, OnDestroy {

  private uid: string;
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

  constructor(private pageControl: PageControlService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private http: Http,
              private translate: TranslateService) {


    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.USER_TYPE = Constants.USER_PATHS[UserType.AgencyAdmin];
      this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";


      this.loadJSON().subscribe(data => {

        for (var key in data){

          this.userLang.push(key);
          this.languageMap.set(key, data[key]);
        }

      });

      // Check chosen user language

      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          if(user.language) {
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

  // Dan's Modal functions

  loadJSON(){
    return this.http.get(this.languageSelectPath)
      .map((res:Response) => res.json().GLOBAL.LANGUAGES);
  }

  openLanguageModal() {
    console.log('Open language modal');
    jQuery("#language-selection").modal("show");
  };

  changeLanguage(language: string){
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

  // test() {
  //   switch (this.counter) {
  //     case 0:
  //       this.translate.use("en");
  //       break;
  //     case 1:
  //       this.translate.use("fr");
  //       break;
  //     case 2:
  //       this.translate.use("es");
  //       break;
  //     case 3:
  //       this.translate.use("pt");
  //       break;
  //     default:
  //       this.translate.use("en");
  //       break;
  //   }
  //   this.counter++;
  //   if (this.counter == 4) {
  //     this.counter = 0;
  //   }
  //   // if (this.counter % 2 == 0) {
  //   //   this.translate.use("en");
  //   // } else {
  //   //   this.translate.use("fr");
  //   // }
  // }
}
