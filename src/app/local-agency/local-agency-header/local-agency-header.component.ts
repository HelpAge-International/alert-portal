
import {map} from 'rxjs/operators';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
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
import {Http, Response} from '@angular/http';
import {TranslateService} from "@ngx-translate/core";
import {NetworkService} from "../../services/network.service";
import {ModelNetwork} from "../../model/network.model";
import {CommonUtils} from "../../utils/CommonUtils";
import {NetworkViewModel} from "./network-view.model";
import {LocalNetworkViewModel} from "./local-network-view.model";
import {LocalStorageService} from "angular-2-local-storage";
import {Location} from "@angular/common";
import {ExportPersonalService} from "../../services/export-personal";

declare const jQuery: any;

@Component({
  selector: 'app-local-agency-header',
  templateUrl: './local-agency-header.component.html',
  styleUrls: ['./local-agency-header.component.scss'],
  providers: [ActionsService]
})
export class LocalAgencyHeaderComponent implements OnInit {

  @Output() partnerAgencyRequest = new EventEmitter();
  // @Output() networkRequest = new EventEmitter();

  private partnerAgencies = [];
  private agenciesMap = new Map();

  // Dan's switch language
  private languageSelectPath: string = '';
  private languageMap = new Map();
  private userLang = [];
  private language: string;
  private browserLang: string = "";
  // End

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

  private systemId: string;
  private networks: ModelNetwork[] = [];
  private selectedNetwork: ModelNetwork;
  private isViewingNetwork: boolean;
  private networkCountryMap: Map<string, string> = new Map<string, string>()
  private showLoader: boolean;
  private localNetworkList: string[];
  private localNetworks: ModelNetwork[] = [];
  private networkViewValues: any;

  constructor(private pageControl: PageControlService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private alertService: ActionsService,
              private networkService: NetworkService,
              private storageService: LocalStorageService,
              private userService: UserService,
              private locationService: Location,
              private http: Http,
              private translate: TranslateService,
              private exportPersonalService: ExportPersonalService) {

    //this.translate.addLangs(["en", "fr", "es", "pt"]);
    translate.setDefaultLang("en");

    this.browserLang = translate.getBrowserLang();
    //translate.use(this.browserLang.match(/en|fr|es|pt/) ? this.browserLang : "en");


  }

  ngOnInit() {

    jQuery('.float').hide();
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.showLoader = true;
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.systemId = systemId;
      this.agencyId = agencyId;
      this.userType = userType;
      console.log(UserType[userType])
      this.isAnonym = !(user && !user.anonymous);
      this.languageSelectPath = "../../../assets/i18n/" + this.browserLang + ".json";

      this.loadJSON().first().subscribe(data => {

        for (var key in data) {

          this.userLang.push(key);
          this.languageMap.set(key, data[key]);
        }

      });


      if (user) {

        if (this.isAnonym && this.userService.anonymousUserPath != 'ExternalPartnerResponsePlan') {
          this.af.auth.logout().then(() => {
            this.router.navigate(['/login']);
          });
        }
        if (!user.anonymous) {
          this.uid = user.auth.uid;

          let networkId = this.storageService.get(Constants.NETWORK_VIEW_SELECTED_ID);
          if (networkId) {
            this.isViewingNetwork = true;
            this.networkService.getNetworkDetail(networkId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(network => {
                this.selectedNetwork = network

              })
          }

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

          if (userType == UserType.CountryAdmin) {
            this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + "/countryId")
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryId => {
                if (countryId.$value == null) {
                  this.router.navigateByUrl(Constants.LOGIN_PATH);
                }
              });
          }

          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              console.log(user)
              this.firstName = user.firstName;
              this.lastName = user.lastName;
              this.showLoader = false;
            });

          this.USER_TYPE = Constants.USER_PATHS[userType];

          if (this.userType == UserType.PartnerUser) {
            this.initDataForPartnerUser(agencyId, countryId);
          } else {
            this.getCountryData();
            this.checkAlerts();
            this.userService.getAgencyDetail(this.agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agencyDetail => {
                this.agencyDetail = agencyDetail;
              });
          }

          //get networks
          this.getNetworks(agencyId);

          this.getLocalNetworks(agencyId)
        }
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });


    this.locationService.subscribe(state => {
      if (!state.url.includes("isViewing=true")) {
        this.selectAgency()
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
    agencies.forEach((v) => {
      data.push(v);
    });
    return data;
  }

  private checkAlerts() {
    let id = this.isViewingNetwork && this.storageService.get(Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID) ? this.storageService.get(Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID).toString() : this.agencyId;
    console.log(id)
    this.alertService.getAlerts(id, true)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alerts: ModelAlert[]) => {
        this.isRed = false;
        this.isAmber = false;
        console.log(alerts)
        alerts.forEach(alert => {
          if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
            this.isRed = true;
          }
          if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))) {
            // || (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse)) {
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

  selectNetwork(network: ModelNetwork) {
    console.log("selected network")
    this.selectedNetwork = network;
    this.isViewingNetwork = true;
    // this.userService.saveUserNetworkSelection(this.uid, this.userType, network.id);
    this.storageService.set(Constants.NETWORK_VIEW_SELECTED_ID, network.id);
    //build emit value
    let model = new NetworkViewModel(this.systemId, this.agencyId, this.countryId, this.userType, this.uid, this.selectedNetwork.id, this.networkCountryMap.get(this.selectedNetwork.id), true)
    if (!model.countryId) {
      delete model["countryId"]
    }
    // this.networkRequest.emit(model)
    this.storageService.set(Constants.NETWORK_VIEW_VALUES, model);
    if (this.networkCountryMap.get(network.id)) {
      this.storageService.set(Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID, this.networkCountryMap.get(network.id))
    }
    let values = this.buildNetworkViewValues();
    this.router.navigate(["/network-country/network-dashboard", values])
  }


  selectLocalNetwork(network: ModelNetwork) {
    console.log("selected local network")
    this.selectedNetwork = network;
    this.isViewingNetwork = true;
    // this.userService.saveUserNetworkSelection(this.uid, this.userType, network.id);
    this.storageService.set(Constants.NETWORK_VIEW_SELECTED_ID, network.id);
    //build emit value
    let model = new LocalNetworkViewModel(this.systemId, this.agencyId, this.countryId, this.userType, this.uid, this.selectedNetwork.id, true)
    if (!model.countryId) {
      delete model["countryId"]
    }
    // this.networkRequest.emit(model)
    this.storageService.set(Constants.NETWORK_VIEW_VALUES, model);
    if (this.networkCountryMap.get(network.id)) {
      this.storageService.set(Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID, this.networkCountryMap.get(network.id))
    }
    let values = this.buildNetworkViewValues();
    this.router.navigate(["/network/local-network-dashboard", values])
  }

  private buildNetworkViewValues() {
    let values = {};

    values["systemId"] = this.systemId;
    values["agencyId"] = this.agencyId;
    if (this.countryId) {
      values["countryId"] = this.countryId;
    }
    values["userType"] = this.userType;
    values["uid"] = this.uid;
    values["networkId"] = this.selectedNetwork.id;
    if (this.networkCountryMap.get(this.selectedNetwork.id)) {
      values["networkCountryId"] = this.networkCountryMap.get(this.selectedNetwork.id);
    }
    values["isViewing"] = true;
    return values;
  }

  selectAgency() {
    this.switchOffNetworkView()
    this.router.navigateByUrl("/local-agency/dashboard")
    // this.userService.deleteUserNetworkSelection(this.uid, this.userType);
  }

  switchOffNetworkView() {
    this.isViewingNetwork = false;
    this.selectedNetwork = null;
    this.storageService.remove(Constants.NETWORK_VIEW_SELECTED_ID, Constants.NETWORK_VIEW_VALUES, Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID)
  }

  // Dan's Modal functions

  loadJSON() {

    return this.http.get(this.languageSelectPath).pipe(
      map((res: Response) => res.json().GLOBAL.LANGUAGES));

  }

  openLanguageModal() {

    jQuery("#language-selection").modal("show");

  };

  reportProblem() {
    jQuery('.float').show();
  }

  changeLanguage(language: string) {
    this.language = language;

    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/language").set(language.toLowerCase());

    if (language.toLowerCase()) {
      this.translate.use(language.toLowerCase());
      jQuery("#language-selection").modal("hide");


    }
  }


  logout() {
    this.af.auth.logout().then(() => {
      this.storageService.remove(Constants.NETWORK_VIEW_SELECTED_ID, Constants.NETWORK_VIEW_VALUES, Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID)
      this.router.navigateByUrl(Constants.LOGIN_PATH)
    }, error => {
      console.log(error.message)
    });

  }

  goToHome() {
    this.router.navigateByUrl("/local-agency/dashboard");
  }

  clearNetworkLocalStorage() {
    this.isViewingNetwork = false;
    this.selectedNetwork = null;
    this.storageService.remove(Constants.NETWORK_VIEW_VALUES, Constants.NETWORK_VIEW_SELECTED_ID, Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID)
  }

  /**
   * Private functions
   */

  private getCountryData() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/country")
      .takeUntil(this.ngUnsubscribe)
      .subscribe((location: any) => {
        this.countryLocation = location.$value;
      });
  }

  private getNetworks(agencyId: string) {
    this.networkService.mapNetworkCountryForLocalAgency(agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(map => this.networkCountryMap = map);

    this.networkService.getNetworkWithCountryModelsForLocalAgency(agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkModels => {
        this.networks = [];
        networkModels.map(model => {
          return this.networkService.getNetworkDetail(model.networkId)

        })
          .forEach(item => {
            item.takeUntil(this.ngUnsubscribe).subscribe(network => {
              if (!CommonUtils.itemExistInList(network.id, this.networks)) {
                if (!(this.selectedNetwork && network.id == this.selectedNetwork.id)) {
                  this.networks.push(network);

                }
              }
            })
          })

      })

  }

  private getLocalNetworks(agencyId: string) {
    this.networkService.getLocalNetworkModelsForLocalAgency(agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkModels => {
        this.localNetworks = [];
        networkModels.map(model => {
          return this.networkService.getNetworkDetail(model.id)
        })
          .forEach(item => {
            item.takeUntil(this.ngUnsubscribe).subscribe(network => {
              if (!CommonUtils.itemExistInList(network.id, this.localNetworks)) {
                if (!(this.selectedNetwork && network.id == this.selectedNetwork.id)) {
                  this.localNetworks.push(network);
                }
              }
            })
          })
      })
  }

  private exportPersonalData() {
    this.exportPersonalService.exportPersonalData(this.uid, this.countryId);
  }
}
