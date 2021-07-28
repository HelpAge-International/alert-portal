import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {MessageModel} from "../../model/message.model";
import {TranslateService} from "@ngx-translate/core";
import {Http, Response} from '@angular/http';
import {EXPORT_FROM, ExportDataService} from "../../services/export-data.service";
import {ExportPersonalService} from "../../services/export-personal";
declare var jQuery: any;

@Component({
  selector: 'app-donor-header',
  templateUrl: './donor-header.component.html',
  styleUrls: ['./donor-header.component.css']
})

export class DonorHeaderComponent implements OnInit {

  private USER_TYPE: string;

  private uid: string;
  private agencyId: string;
  private countryId: string;
  private agencyName: string = "";

  private firstName: string = "";
  private lastName: string = "";

  private userPaths = Constants.USER_PATHS;

  private unreadMessages: MessageModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private showLoader:boolean

  // Dan's switch language
  private languageSelectPath: string = '';
  private languageMap = new Map();
  private userLang = [];
  private language: string;
  private browserLang: string = "";

  // End

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private userService: UserService,
              private translate: TranslateService,
              private exportService:ExportDataService,
              private http: Http,
              private exportPersonalService: ExportPersonalService) {

    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();
  }

  ngOnInit() {

    jQuery('.float').hide();
    this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId;
      this.USER_TYPE = this.userPaths[userType];

      if (this.USER_TYPE) {
        this.getAgencyName();
      }

      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
      this.loadJSON().subscribe(data => {

        for (var key in data){

          this.userLang.push(key);
          this.languageMap.set(key, data[key]);
        }

      });

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
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  reportProblem(){
    jQuery('.float').show();
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

  changeLanguage(language: string) {
    this.language = language;
    console.log(this.uid);
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/language").set(language.toLowerCase());
    this.translate.use(language.toLowerCase());
    jQuery("#language-selection").modal("hide");
  }

  logout() {
    console.log('countryId:' + this.countryId + ' userId:' + this.uid);
    this.af.auth.logout().then(() =>{
      this.router.navigateByUrl('/login')
    });
  }


  goToHome() {
    this.router.navigateByUrl("/donor-module");
  }

  exportData() {
    this.showLoader = true
    this.exportService.exportSystemData(EXPORT_FROM.FromDonor)
      .first()
      .subscribe(value => this.showLoader = !value)
    // this.exportService.exportAgencyData(this.uid)
    //   .first()
    //   .subscribe(value => this.showLoader = !value)
  }

  /**
   * Private functions
   */

  private getAgencyName() {
    if (this.agencyId) {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + '/name')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyName) => {
          this.agencyName = agencyName ? agencyName.$value : this.translate.instant("AGENCY");
        });
    }
  }
  private exportPersonalData() {
    this.exportPersonalService.exportPersonalData(this.uid, this.countryId);
  }

}
