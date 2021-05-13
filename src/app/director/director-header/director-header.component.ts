
import {map} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {MessageModel} from "../../model/message.model";
import {Http, Response} from '@angular/http';
import {TranslateService} from "@ngx-translate/core";
import {ExportPersonalService} from "../../services/export-personal";
declare var jQuery: any;



@Component({
  selector: 'app-director-header',
  templateUrl: './director-header.component.html',
  styleUrls: ['./director-header.component.css']
})

export class DirectorHeaderComponent implements OnInit, OnDestroy {

  // Dan's switch language
  private languageSelectPath: string = '';
  private languageMap = new Map();
  private userLang = [];
  private language: string;
  private browserLang: string = "";
  // End
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

  constructor(private pageControl: PageControlService,
              private userService: UserService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private translate: TranslateService,
              private http: Http,
              private exportPersonalService: ExportPersonalService) {

    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();
  }

  ngOnInit() {

    jQuery('.float').hide();
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.countryId = countryId;
      this.uid = user.uid;
      this.USER_TYPE = this.userPaths[userType];
      if (this.USER_TYPE) {
        this.getAgencyName();
      }

      this.userService.getAgencyId(this.USER_TYPE, this.uid).takeUntil(this.ngUnsubscribe).subscribe(agencyId => {
        this.agencyId = agencyId;
      });

      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;

          // this.loadJSON().subscribe(data => {
          //
          //   for (var key in data){
          //
          //     this.userLang.push(key);
          //     this.languageMap.set(key, data[key]);
          //   }
          //
          // });

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



    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Dan's Modal functions

  loadJSON(){

    return this.http.get(this.languageSelectPath).pipe(
      map((res:Response) => res.json().GLOBAL.LANGUAGES));

  }

  openLanguageModal()
  {

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
    console.log("logout");
    this.af.auth.logout().then(()=>{this.router.navigateByUrl(Constants.LOGIN_PATH).then()});
  }

  reportProblem(){
    jQuery('.float').show();
  }

  goToHome() {
    this.router.navigateByUrl("/director").then();
  }

  /**
   * Private functions
   */

  private getAgencyName() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyId = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
          if (this.agencyId) {
            this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + '/name')
              .takeUntil(this.ngUnsubscribe)
              .subscribe((agencyName) => {
                this.agencyName = agencyName ? agencyName.$value : "Agency";
                res(true);
              });
          }
        });
    });
    return promise;
  }

  private exportPersonalData() {
    this.exportPersonalService.exportPersonalData(this.uid, this.countryId);
  }
}
