import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HazardScenario, AlertMessageType, Countries} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {ModelHazard} from "../../model/hazard.model";
import {AlertMessageModel} from '../../model/alert-message.model';
import {LocalStorageService} from 'angular-2-local-storage';
import {InformHolder, InformService} from "../../services/inform.service";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../services/user.service";
import {Http} from "@angular/http";
import {PageControlService} from "../../services/pagecontrol.service";
import {HazardImages} from "../../utils/HazardImages";

declare var jQuery: any;

@Component({
  selector: 'app-add-hazard',
  templateUrl: './add-hazard.component.html',
  styleUrls: ['./add-hazard.component.css']
})
export class AddHazardRiskMonitoringComponent implements OnInit, OnDestroy {

  private UserType: number;

  alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private alertMsgSeasonAddToCalendar: boolean = false;
  private hazardName: string;
  private classAlertInvalid: any;
  private classAlertValid: any;
  private countryID: string;
  private uid: string;
  private locationID: number;
  private agencyID: string;
  private count: number = 1;
  private customHazards = [];
  private AllSeasons = [];
  private checkedSeasons = [];
  private modalID: string;
  private otherHazard: boolean = false;
  private saveSelectSeasonsBtn: boolean = true;
  private selectHazard: boolean = false;
  private season: boolean = false;
  private addHazardSeason: string;
  private isCustomDisabled: boolean = true;
  private HazardScenario = Constants.HAZARD_SCENARIOS;
  private scenarioColors = Constants.SCENARIO_COLORS;
  private hazardImages: HazardImages = new HazardImages();
  private hazardScenariosListTop: InformHolder[] = [];

  private hazardScenariosList: number[] = [
    HazardScenario.HazardScenario0,
    HazardScenario.HazardScenario1,
    HazardScenario.HazardScenario2,
    HazardScenario.HazardScenario3,
    HazardScenario.HazardScenario4,
    HazardScenario.HazardScenario5,
    HazardScenario.HazardScenario6,
    HazardScenario.HazardScenario7,
    HazardScenario.HazardScenario8,
    HazardScenario.HazardScenario9,
    HazardScenario.HazardScenario10,
    HazardScenario.HazardScenario11,
    HazardScenario.HazardScenario12,
    HazardScenario.HazardScenario13,
    HazardScenario.HazardScenario14,
    HazardScenario.HazardScenario15,
    HazardScenario.HazardScenario16,
    HazardScenario.HazardScenario17,
    HazardScenario.HazardScenario18,
    HazardScenario.HazardScenario19,
    HazardScenario.HazardScenario20,
    HazardScenario.HazardScenario21,
    HazardScenario.HazardScenario22,
    HazardScenario.HazardScenario23,
    HazardScenario.HazardScenario24,
    HazardScenario.HazardScenario25,
    HazardScenario.HazardScenario26
  ];
  private hazardData: any = {};

  // INFORM information
  private informHandler: InformService;
  private loaderInactive: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private route: ActivatedRoute, private http: Http, private router: Router, private storage: LocalStorageService, private userService: UserService) {
    this.hazardData.seasons = [];
    this.initHazardData();

    // Inform Handler for the top 3 items
    this.informHandler = new InformService(http);
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;
      this._loadData();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initHazardData() {
    this.hazardData = new ModelHazard();
  }

  _getTopResults() {
    this.informHandler.getTopResultsCC(this.locationID, 3, (list) => {
      this.hazardScenariosListTop = list;
      this.loaderInactive = true;
    });
  }

  _getHazardImage(key) {
    let map = new Map<string, string>();
    map.set("0", "cold_wave");
    map.set("1", "conflict");
    map.set("2", "cyclone");
    map.set("3", "drought");
    map.set("4", "earthquake");
    map.set("5", "epidemic");
    map.set("6", "fire");
    map.set("7", "flash_flood");
    map.set("8", "flood");
    map.set("9", "heatwave");
    map.set("10", "heavy_rain");
    map.set("11", "humanitarian_access");
    map.set("12", "insect_infestation");
    map.set("13", "landslide_mudslide");
    map.set("14", "locust_infestation");
    map.set("15", "landslide_mudslide");
    map.set("16", "population_displacement");
    map.set("17", "population_return");
    map.set("18", "snow_avalanche");
    map.set("19", "snowfall");
    map.set("20", "storm");
    map.set("21", "storm_surge");
    map.set("22", "technological_disaster");
    map.set("23", "tornado");
    map.set("24", "tsunami");
    map.set("25", "violent_wind");
    map.set("26", "volcano");
    return "/assets/images/hazards/" + map.get(key) + ".svg";
  }

  _getCountryLocation() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyID + "/" + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((country) => {
          this.locationID = country.location;
          this._getTopResults();
          res(true);
        });
    });
    return promise;
  }

  _getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((country: any) => {
          let s: string;
          for (let key in country.agencyAdmin) {
            s = key;
          }
          this.agencyID = s;
          this.countryID = country.countryId ? country.countryId : "";
          res(true);
        });
    });
    return promise;
  }

  _loadData() {
    this._getCountryID().then(() => {
      this._getCustomHazards();
      this._getCountryLocation();
    });
  }

  _getCustomHazards() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/otherHazardScenario/" + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((customHazards: any) => {
          this.customHazards = customHazards;
          res(true);
        });
    });
    return promise;
  }

  _getAllSeasons() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/season/" + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((AllSeasons: any) => {
          this.AllSeasons = AllSeasons;
          res(true);
        });
    });
    return promise;
  }

  _validateData() {
    let promise = new Promise((res, rej) => {
      this.alertMessage = this.hazardData.validate(this.count);
      if (this.alertMessage) {
        res(false);
      }
      if (!this.alertMessage) {
        if (!this.alertMessage) {
        }
        if (!this.alertMessage) {
          res(true);
        }
      }
    });
    return promise;
  }

  submit() {
    this._validateData().then((isValid: boolean) => {
      if (isValid) {
        this.count = 2;
      }
    });
  }

  cancel() {
    this.count = 1;
  }

  _checkHazard(hazard) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((hazardFb: any) => {
          for (let index = 0; index < hazardFb.length; index++) {

            if (hazardFb[index].hazardScenario == hazard) {
              this.hazardData.isActive = false;
              return promise;
            }
            else {
              this.hazardData.isActive = true;
            }
          }
          res(true);
        });
    });
    return promise;
  }

  stateIsCustom(isCustom: boolean, event: any, hazard) {
    this.hazardName = event.target.value;
    this.hazardData.hazardScenario = '';
    this._checkHazard(hazard);
    this.isCustomDisabled = isCustom;
    if (event.target.value != 'on') {
      this.hazardData.hazardScenario = hazard;
      this.otherHazard = false;
    } else {
    }
  }

  setHazardValue(event: any) {
    this._checkHazard(event.target.value);
    this.hazardData.hazardScenario = event.target.value;

    this.otherHazard = false;
    if (this.hazardData.hazardScenario == 'Other') {
      this.otherHazard = true;
    }
  }

  addHazardBtn() {
    this._validateData().then((isValid: boolean) => {
      if (isValid) {
        this.hazardData.timeCreated = this._getCurrentTimestamp();
        this.hazardData.hazardScenario = parseInt(this.hazardData.hazardScenario);
        /* TODO RISK PARAM */
        this.hazardData.risk = 10;
        this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryID)
          .push(this.hazardData)
          .then(() => {
            this.storage.set('successAddHazard', this.hazardData.hazardScenario);
            this.router.navigate(['/risk-monitoring/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    });
    if (this.addHazardSeason == 'true') {
      return false;
    }
    else {
      return true;
    }
  }

  _getCurrentTimestamp() {
    var currentTimeStamp = new Date().getTime();
    return currentTimeStamp;
  }

  seasonHazard(event: any) {
    this.hazardData.seasons = [];
    this.addHazardSeason = event.target.value;
    if (this.addHazardSeason == 'true') {
      this.hazardData.isSeasonal = false;
      this.selectHazard = false;
      this.season = false;
    }
    else {
      this.hazardData.isSeasonal = true;
      this.selectHazard = true;
      this.season = false;
    }
  }

  saveSelectSeasons(modalID: string) {
    this.checkedSeasons = [];
    for (let i in this.hazardData.seasons) {
      this.checkedSeasons.push(this.AllSeasons[i])
    }
    this.modalID = modalID;
    this.addHazardSeason = 'true';
    this.selectHazard = false;
    this.season = true;
    if (this.checkedSeasons.length == 0) {
      this.season = false;
      this.selectHazard = true;
    }
    else {
      this.season = true;
    }
    this.closeModal();
  }

  selectSeason(event: any, seasonKey: string) {
    if (event.target.checked) {
      this.hazardData.seasons[seasonKey] = true;
    } else {
      delete this.hazardData.seasons[seasonKey];
    }
    if (Object.keys(this.hazardData.seasons).length == 0) {
      this.saveSelectSeasonsBtn = true;
    }
    else {
      this.saveSelectSeasonsBtn = false;
    }
  }

  detected(i) {
    for (let key in this.hazardData.seasons) {
      if (i == key) {
        return true;
      }
    }
  }

  newCustomHazard(event: any) {
    if (event.target.value.length > 3) {
      this.hazardData.hazardScenario = event.target.value;
      this.hazardName = event.target.value;
    }
  }

  showActionConfirm(modalID: string) {
    // this.hazardData.seasons = [];
    this._getAllSeasons();
    this.modalID = modalID;
    jQuery("#" + this.modalID).modal("show");
  }

  createSeasonToCalendar(form: NgForm) {
    this.saveSelectSeasonsBtn = true;
    let dataToSave = form.value;
    dataToSave.startTime = new Date(dataToSave.startTime).getTime();
    dataToSave.endTime = new Date(dataToSave.endTime).getTime();
    this.closeModal();
    this.af.database.list(Constants.APP_STATUS + "/season/" + this.countryID)
      .push(dataToSave)
      .then(() => {
        console.log('success save data');
      }).catch((error: any) => {
      console.log(error, 'You do not have access!')
    });
  }

  closeModal() {
    jQuery("#" + this.modalID).modal("hide");
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
