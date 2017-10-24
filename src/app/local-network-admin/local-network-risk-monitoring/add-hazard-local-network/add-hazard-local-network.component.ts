import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AlertMessageType, HazardScenario} from "../../../utils/Enums";
import {Constants} from "../../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {ModelHazard} from "../../../model/hazard.model";
import {AlertMessageModel} from '../../../model/alert-message.model';
import {LocalStorageService} from 'angular-2-local-storage';
import {InformHolder, InformService} from "../../../services/inform.service";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../../services/user.service";
import {NetworkService} from "../../../services/network.service";
import {Http} from "@angular/http";
import {PageControlService} from "../../../services/pagecontrol.service";
import {HazardImages} from "../../../utils/HazardImages";
import {ColourSelector} from "../../../utils/ColourSelector";

declare var jQuery: any;
@Component({
  selector: 'app-add-hazard-local-network',
  templateUrl: './add-hazard-local-network.component.html',
  styleUrls: ['./add-hazard-local-network.component.scss']
})
export class AddHazardLocalNetworkComponent implements OnInit, OnDestroy {

  networkId: any;
  networkCountryId: any;

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
  private selectHazard: boolean = false;
  private season: boolean = false;
  private addHazardSeason: string;
  public addSeasonStart: number;
  public addSeasonEnd: number;
  public addSeasonColour: string;
  private isCustomDisabled: boolean = true;
  private HazardScenario = Constants.HAZARD_SCENARIOS;
  private scenarioColors = Constants.SCENARIO_COLORS;
  private hazardImages: HazardImages = new HazardImages();
  private hazardScenariosListTop: InformHolder[] = [];
  private colours: ColourSelector[] = ColourSelector.list();
  private submitNewCalendar: boolean = true;

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
  private showInformUnavailable: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private route: ActivatedRoute, private http: Http, private router: Router, private storage: LocalStorageService, private userService: UserService, private networkService: NetworkService) {
    this.hazardData.seasons = [];
    this.initHazardData();

    // Inform Handler for the top 3 items
    this.informHandler = new InformService(http);
  }

  ngOnInit() {

    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkCountryId = selection["networkCountryId"];
          this.networkId = selection["id"];
          this.UserType = selection["userType"];

          this._loadData();

        })
    })

    // this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
    //   this.uid = user.uid;
    //   this.UserType = userType;
    //   this._loadData();
    // });
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
      console.log('p[[p[p[pp[p[')
      console.log(list)
      this.showInformUnavailable = (list.length == 0);
      this.hazardScenariosListTop = list;
      this.loaderInactive = true;
    });
  }

  _getHazardImage(key) {
    return HazardImages.init().getCSS((+key));
  }

  _getHazardImageImg(key) {
    console.log(key);
    return HazardImages.init().get((+key));
  }

  _getCountryLocation() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/network/" + this.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((network) => {

          this.locationID = network.countryId;
          console.log(this.locationID)
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
    // this._getCountryID().then(() => {
    this._getCustomHazards();
    this._getCountryLocation();
    // });
  }

  _getCustomHazards() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/otherHazardScenario/" + this.networkId)
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
      this.af.database.list(Constants.APP_STATUS + "/season/" + this.networkId)
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
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkId)
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
    if (this.hazardData.hazardScenario == 'otherSelected') {
      this.otherHazard = true;
    }
  }

  addHazardBtn() {
    this._validateData().then((isValid: boolean) => {
      if (isValid) {
        this.hazardData.timeCreated = this._getCurrentTimestamp();
        this.hazardData.isActive = true;
        this.hazardData.hazardScenario = parseInt(this.hazardData.hazardScenario);
        /* TODO RISK PARAM */
        this.hazardData.risk = 10;
        this.hazardData.isActive = true;
        if (this.otherHazard) {
          this.hazardData.hazardScenario = -1;
        }
        //fill out info for other type
        this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkId)
          .push(this.hazardData)
          .then((hazardKey) => {
            // PUSHED ALL DATA TO /hazard/
            this.storage.set('successAddHazard', this.hazardData.hazardScenario);
            if (this.otherHazard) {
              let objName = {name: this.hazardName};
              this.af.database.list(Constants.APP_STATUS + "/hazardOther/").push(objName).then(key => {
                let updateHazardObj = {
                  hazardScenario: -1,
                  otherName: key.key
                };
                this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.networkId + "/" + hazardKey.key).update(updateHazardObj).then(_ => {
                  this.router.navigate(['/network/local-network-risk-monitoring/']);
                }).catch(err => {
                  this.alertMessage = new AlertMessageModel("ERROR_UPDATING_OTHER_HAZARD_REF");
                });
              }).catch(err => {
                console.log(err);
                this.alertMessage = new AlertMessageModel("ERROR_UPDATING_OTHER_HAZARD_DATA");
              });
            } else {
              this.router.navigate(['/network/local-network-risk-monitoring/']);
            }
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

  public selectStartDate(date) {
    this.addSeasonStart = +date;
  }

  public selectEndDate(date) {
    this.addSeasonEnd = +date;
  }

  public setCurrentColour(colourCode: string) {
    this.addSeasonColour = colourCode;
  }

  createSeasonToCalendar(form: NgForm) {
    this.submitNewCalendar = false;
    let dataToSave = form.value;
    if (this.addSeasonStart == null || this.addSeasonEnd == null || this.addSeasonColour == null) {
      this.alertMessage = new AlertMessageModel("RISK_MONITORING.ADD_HAZARD.ADD_SEASONAL_TO_CALENDAR_NO_DATE");
      return;
    }
    dataToSave.startTime = this.addSeasonStart;
    dataToSave.endTime = this.addSeasonEnd;
    dataToSave.colorCode = this.addSeasonColour;
    console.log(dataToSave);
    this.closeModal();
    this.af.database.list(Constants.APP_STATUS + "/season/" + this.networkId)
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
