import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageControlService} from "../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NetworkService} from "../../services/network.service";
import {Constants} from "../../utils/Constants";
import {NetworkUserAccountType, UserType} from "../../utils/Enums";
import {TranslateService} from "@ngx-translate/core";
import {Http, Response} from '@angular/http';
import {AngularFire} from "angularfire2";
import {ExportPersonalService} from "../../services/export-personal";

declare var jQuery: any;


@Component({
  selector: 'app-network-header',
  templateUrl: './network-header.component.html',
  styleUrls: ['./network-header.component.css'],
  providers: [NetworkService]
})
export class NetworkHeaderComponent implements OnInit, OnDestroy {

  // Dan's switch language
  private languageSelectPath: string = '';
  private languageMap = new Map();
  private userLang = [];
  private language: string;
  private browserLang: string = "";
  // End

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private uid: string;
  private user: any;
  private network: any;
  private USER_TYPE: string;
  private networkId: string;
  private showLoader: boolean;

  constructor(private pageControl: PageControlService,
              private userService: UserService,
              private networkService: NetworkService,
              private router: Router,
              private route: ActivatedRoute,
              private af: AngularFire,
              private translate: TranslateService,
              private http: Http,
              private exportPersonalService: ExportPersonalService) {

    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();

  }

  ngOnInit() {
    jQuery('.float').hide();
    this.showLoader = true;
    this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (auth, oldUserType) => {
      this.uid = auth.uid;
      this.USER_TYPE = Constants.NETWORK_USER_PATHS[NetworkUserAccountType.NetworkAdmin];

      //get user info
      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.user = user;
          this.showLoader = false;
        });

      //get network info
      this.networkService.getSelectedIdObj(this.uid)
        .flatMap(data => {
          this.networkId = data["id"];
          return this.networkService.getNetworkDetail(data["id"])
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(network => {
          this.network = network;
        })

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

    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Dan's Modal functions

  loadJSON() {

    return this.http.get(this.languageSelectPath)
      .map((res: Response) => res.json().GLOBAL.LANGUAGES);

  }

  reportProblem(){
    jQuery('.float').show();
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
    console.log("logout");
    this.userService.logout();
  }

  goToHome() {
    this.router.navigateByUrl("/network/network-offices");
  }

  private exportPersonalData() {
    this.exportPersonalService.exportPersonalData(this.uid, null);
  }


}
