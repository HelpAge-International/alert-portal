import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertLevels, AlertStatus, Countries, NetworkUserAccountType} from "../../utils/Enums";
import {Observable} from "rxjs/Observable";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModelNetwork} from "../../model/network.model";
import {UserService} from "../../services/user.service";
import {ModelUserPublic} from "../../model/user-public.model";
import {NetworkCountryModel} from "../network-country.model";
import {TranslateService} from "@ngx-translate/core";
import {AngularFire} from "angularfire2";
import {Http, Response} from '@angular/http';

declare var jQuery: any;

import {Constants} from "../../utils/Constants";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {LocalStorageService} from "angular-2-local-storage";

declare var jQuery: any;

@Component({
  selector: 'app-network-country-header',
  templateUrl: './network-country-header.component.html',
  styleUrls: ['./network-country-header.component.css']
})
export class NetworkCountryHeaderComponent implements OnInit, OnDestroy {
  private uid: string;
  // Dan's switch language
  private languageSelectPath: string = '';
  private languageMap = new Map();
  private userLang = [];
  private language: string;
  private browserLang: string = "";
  // End
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private Countries = Countries;

  // Models

  //logic
  private networkId: string;
  private networkCountryId: any;
  private network: Observable<ModelNetwork>;
  private user: Observable<ModelUserPublic>;
  private networkCountry: Observable<NetworkCountryModel>;
  private alertLevel: number;
  private USER_TYPE: string;
  private isAmber: boolean;
  private isRed: boolean;
  private alertTitle: string;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private af: AngularFire,
              private translate: TranslateService,
              private alertService: ActionsService,
              private http: Http) {
    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();

  }

  ngOnInit() {
    jQuery('.float').hide();
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";
      this.USER_TYPE = "administratorNetworkCountry";

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          //must be network country admin, otherwise need check first
          this.networkCountryId = selection["networkCountryId"];

          //get network info
          this.network = this.networkService.getNetworkDetail(this.networkId);

          //get user info
          this.user = this.userService.getUser(user.uid);

          //get network country info
          this.networkCountry = this.networkService.getNetworkCountry(this.networkId, this.networkCountryId);

          //check alerts
          this.checkAlerts();

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

  reportProblem(){
    jQuery('.float').show();
  }

  logout() {
    this.userService.logout();
  }

  private checkAlerts() {
    this.alertService.getAlerts(this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alerts: ModelAlert[]) => {
        this.isRed = false;
        this.isAmber = false;
        alerts.forEach(alert => {
          if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
            this.isRed = true;
          }
          if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected)) ||
            alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse && alert.previousIsAmber) {
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

}
