import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {ActionsService} from "../../../services/actions.service";
import {ModelAlert} from "../../../model/alert.model";
import {AlertLevels, AlertStatus} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {UserService} from "../../../services/user.service";
import {NetworkService} from "../../../services/network.service";
import {OperationAreaModel} from "../../../model/operation-area.model";
import {CommonService} from "../../../services/common.service";
import {HazardImages} from "../../../utils/HazardImages";
import {LocalStorageService} from "angular-2-local-storage";


@Component({
  selector: 'app-network-dashboard-update-alert-level',
  templateUrl: './network-dashboard-update-alert-level.component.html',
  styleUrls: ['./network-dashboard-update-alert-level.component.scss'],
  providers: [ActionsService]
})
export class NetworkDashboardUpdateAlertLevelComponent implements OnInit, OnDestroy {
  leadAgencyCountryOffice: string;
  leadAgencyId: any;
  networkCountryId: any;
  networkId: any;

  private HAZARDS: string[] = Constants.HAZARD_SCENARIOS;
  private COUNTRIES: string[] = Constants.COUNTRIES;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private uid: string;
  private alertId: string;
  private countryId: string;
  private agencyId: string;
  private loadedAlert: ModelAlert;
  private reasonForRedAlert: string;
  private infoNotes: string;
  private estimatedPopulation: number;
  private geoMap = new Map();
  private temp = [];
  private preAlertLevel: AlertLevels;
  private isDirector: boolean;

  private countries = Constants.COUNTRIES;
  private countriesList = Constants.COUNTRY_SELECTION;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];
  private networkViewValues: {};
  private isViewing: boolean;
  private countryID: string;
  private systemId: string;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private alertService: ActionsService,
              private userService: UserService,
              private storage: LocalStorageService,
              private networkService: NetworkService) {
    this.initAlertData();
  }

  initAlertData() {
    this.loadedAlert = new ModelAlert();
    this.addAnotherAreas();
  }

  addAnotherAreas() {
    console.log(this.loadedAlert.affectedAreas);
    this.loadedAlert.affectedAreas.push(new OperationAreaModel());
  }

  removeAnotherArea(key: number,) {
    this.loadedAlert.affectedAreas.splice(key, 1);
  }

  ngOnInit() {
    this.networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryID = params["countryId"];
        }
        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }
        if (params["networkId"]) {
          this.networkId = params["networkId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        if (params["systemId"]) {
          this.systemId = params["systemId"];
        }
        if (params["uid"]) {
          this.uid = params["uid"];
        }

        if(this.isViewing){

                this.route.params
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((param: Params) => {
                    if (param['id']) {
                      this.alertId = param['id'];

                      this.loadAlert(this.alertId, this.networkCountryId);
                    }
                  });

                this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(network => {
                    this.leadAgencyId = network.leadAgencyId
                    Object.keys(network.agencyCountries[this.leadAgencyId]).forEach(key => {
                      this.leadAgencyCountryOffice = key
                    })
                  })


            // get the country levels values
            this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
              .takeUntil(this.ngUnsubscribe).subscribe(content => {
              this.countryLevelsValues = content;
              err => console.log(err);
            });

        } else {
          this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
            this.uid = user.uid;

            //get network id
            this.networkService.getSelectedIdObj(user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {
                this.networkId = selection["id"];
                this.networkCountryId = selection["networkCountryId"];
                this.route.params
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((param: Params) => {
                    if (param['id']) {
                      this.alertId = param['id'];


                      this.loadAlert(this.alertId, this.networkCountryId);
                    }
                  });

                this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(network => {
                    this.leadAgencyId = network.leadAgencyId
                    Object.keys(network.agencyCountries[this.leadAgencyId]).forEach(key => {
                      this.leadAgencyCountryOffice = key
                    })
                  })
              })

            // get the country levels values
            this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
              .takeUntil(this.ngUnsubscribe).subscribe(content => {
              this.countryLevelsValues = content;
              err => console.log(err);
            });
          });
        }

      })
  }

  private loadAlert(alertId: string, countryId: string) {

    this.alertService.getAlert(alertId, countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alert: ModelAlert) => {
        this.loadedAlert = alert;
        this.estimatedPopulation = this.loadedAlert.estimatedPopulation;
        this.infoNotes = this.loadedAlert.infoNotes;
        this.reasonForRedAlert = this.loadedAlert.reasonForRedAlert;
        this.preAlertLevel = this.loadedAlert.alertLevel;
        let x: any[] = [];
        for (let y of this.loadedAlert.affectedAreas) {
          let operationArea: OperationAreaModel = new OperationAreaModel();
          operationArea.country = y.affectedCountry;
          operationArea.level1 = y.affectedLevel1;
          operationArea.level2 = y.affectedLevel2;
          x.push(operationArea);
        }

        this.loadedAlert.affectedAreas.forEach(area => {
          this.alertService.getAllLevelInfo(area.affectedCountry)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(geoInfo => {
              this.geoMap.set(area.affectedCountry, geoInfo);
            });
        });

        this.loadedAlert.affectedAreas = x;

        console.log(this.loadedAlert);
      });
  }

  // addNewArea() {
  //   let area: ModelAffectedArea = new ModelAffectedArea();
  //   this.loadedAlert.affectedAreas.push(area);
  // }
  //
  // removeArea(index) {
  //   console.log(index);
  //   let temp: ModelAffectedArea[] = [];
  //   for (let i = 0; i < this.loadedAlert.affectedAreas.length; i++) {
  //     if (i != index) {
  //       temp.push(this.loadedAlert.affectedAreas[i]);
  //     }
  //   }
  //   this.loadedAlert.affectedAreas = temp;
  // }

  selectedAlertLevel(selection) {
    this.loadedAlert.alertLevel = selection;
  }

  // changeCountry(index, value) {
  //   if (this.loadedAlert.affectedAreas[index].affectedCountry != this.COUNTRIES.indexOf(value)) {
  //     this.loadedAlert.affectedAreas[index].affectedLevel1 = null;
  //     this.loadedAlert.affectedAreas[index].affectedLevel2 = null;
  //   }
  //   this.loadedAlert.affectedAreas[index].affectedCountry = this.COUNTRIES.indexOf(value);
  //   console.log(this.loadedAlert);
  // }
  //
  // changeLevel1(index, value) {
  //   this.loadedAlert.affectedAreas[index].affectedLevel1 = Number(value);
  //   if (this.loadedAlert.affectedAreas[index].affectedLevel1 != Number(value)) {
  //     this.loadedAlert.affectedAreas[index].affectedLevel2 = null;
  //   }
  //   console.log(this.loadedAlert);
  // }
  //
  // changeLevel2(index, value) {
  //   this.loadedAlert.affectedAreas[index].affectedLevel2 = Number(value);
  //   console.log(this.loadedAlert);
  // }

  submit() {
    console.log(this.loadedAlert);

    this.loadedAlert.estimatedPopulation = this.estimatedPopulation;
    this.loadedAlert.infoNotes = this.infoNotes;
    this.loadedAlert.timeUpdated = Date.now();
    this.loadedAlert.updatedBy = this.uid;
    this.loadedAlert.approvalCountryId = this.countryId;

    if (this.preAlertLevel == AlertLevels.Red && this.loadedAlert.alertLevel == AlertLevels.Amber) {
      this.loadedAlert.reasonForRedAlert = null;
    } else {
      this.loadedAlert.reasonForRedAlert = this.reasonForRedAlert;
    }

    if (this.loadedAlert.alertLevel != this.preAlertLevel && this.loadedAlert.alertLevel == AlertLevels.Red) {
      if (this.isDirector) {
        this.loadedAlert.approvalStatus = AlertStatus.Approved;
      } else {
        this.loadedAlert.approvalStatus = AlertStatus.WaitingResponse;
      }
    }

    console.log(this.loadedAlert);
    if(this.networkViewValues){
      console.log(true)
      this.alertService.updateAlert(this.loadedAlert, this.preAlertLevel, this.leadAgencyCountryOffice, this.leadAgencyId, this.networkCountryId, null, this.networkViewValues);
    } else {
      console.log(true)
      this.alertService.updateAlert(this.loadedAlert, this.preAlertLevel, this.leadAgencyCountryOffice, this.leadAgencyId, this.networkCountryId);
    }

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.alertService.unSubscribeNow();
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

}
