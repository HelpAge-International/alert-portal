import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType, Countries, NetworkUserAccountType} from "../../utils/Enums";
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
  private alertLevel: number = 0;
  private USER_TYPE: string;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private af: AngularFire,
              private translate: TranslateService,
              private http: Http)
  {
    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";
      this.USER_TYPE = Constants.NETWORK_USER_PATHS[NetworkUserAccountType.NetworkCountryAdmin];

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

  // Dan's Modal functions

  loadJSON(){

    return this.http.get(this.languageSelectPath)
      .map((res:Response) => res.json().GLOBAL.LANGUAGES);

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
    this.userService.logout();
  }

}
