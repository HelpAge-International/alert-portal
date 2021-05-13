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
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Http} from "@angular/http";
import {Location} from "@angular/common";
import {PageControlService} from "../../../services/pagecontrol.service";
import {HazardImages} from "../../../utils/HazardImages";
import {ColourSelector} from "../../../utils/ColourSelector";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";

declare var jQuery: any;

@Component({
  selector: 'app-local-agency-add-hazard',
  templateUrl: './local-agency-add-hazard.component.html',
  styleUrls: ['./local-agency-add-hazard.component.scss']
})
export class LocalAgencyAddHazardComponent implements OnInit {

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

  // Edit Hazard variables
  public hazardId = [];
  public editHazard: boolean;
  public editGetScenario: any[] = [];
  public getEditSeasons: any[] = [];
  public updateNameOfSeason: string;
  public editSeasonalHazard: boolean;
  public getKey: string;
  public radioValue: boolean;


  // INFORM information
  private informHandler: InformService;
  private loaderInactive: boolean;
  private showInformUnavailable: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private locationService: Location, private pageControl: PageControlService, private af: AngularFire, private route: ActivatedRoute, private http: Http, private router: Router, private storage: LocalStorageService, private userService: UserService) {
    this.hazardData.seasons = [];
    this.initHazardData();

    // Inform Handler for the top 3 items
    this.informHandler = new InformService(http);
  }

  ngOnInit() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.UserType = userType;
      this.agencyID = agencyId;
      this._loadData();
      this._getEditHazard();
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
      this.showInformUnavailable = (list.length == 0);
      this.hazardScenariosListTop = list;
      this.loaderInactive = true;
    });
  }

  _getHazardImage(key) {
    return HazardImages.init().getCSS((+key));
  }

  _getAgencyLocation() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agency) => {
          this.locationID = agency.country;
          this._getTopResults();
          res(true);
        });
    });
    return promise;
  }


  _loadData() {

    this._getCustomHazards();
    this._getAgencyLocation();

  }


  _getEditHazard() {

    this.route.params.subscribe(params => {
      this.hazardId = params['hazardID'];
    });



    this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.agencyID + "/" + this.hazardId + "/editingHazard")
      .takeUntil(this.ngUnsubscribe)
      .subscribe(isEdit => {
        this.editHazard = isEdit.$value;
        console.log(this.editHazard, 'howdy neighbour');
        if (this.editHazard){
          this.count = 2;
        }
      });

    // get the hazard scenario
    this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.agencyID + "/" + this.hazardId + '/hazardScenario')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(getHazard => {
        this.editGetScenario = getHazard.$value;
      });

    // get the season key
    this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.agencyID + "/" + this.hazardId + '/seasons', {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(getSeasons => {
        getSeasons.forEach(getSeasons =>{

          console.log(getSeasons,'get seasons');
          this.getEditSeasons.push(toInteger(getSeasons.key));
        })
      });

    //get all seasons
    this.af.database.list(Constants.APP_STATUS + "/season/" + this.agencyID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(AllSeasons => {
        this.AllSeasons = AllSeasons;

      });



  }


  _getCustomHazards() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/otherHazardScenario/" + this.agencyID)
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
      this.af.database.list(Constants.APP_STATUS + "/season/" + this.agencyID)
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
    if (this.editHazard){
      this.router.navigate(['/local-agency/risk-monitoring/']);
    } else {
      this.count = 1;
    }
  }

  _checkHazard(hazard) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.agencyID)
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

  saveHazardBtn() {
    console.log('save hazard');
    this.getEditSeasons.push(this.getKey);
    console.log(this.getEditSeasons);
    let updateKeys = {};
    updateKeys[this.getKey] = true;

    let dbPath = this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.agencyID + "/" + this.hazardId + '/seasons/');
    let dbPathChangeSeasonal = this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.agencyID + "/" + this.hazardId);
    console.log(this.editSeasonalHazard, 'edit season hazard');
    // Filter before doing something in FireBase
    if (this.radioValue){
      dbPath.remove();

      dbPathChangeSeasonal.update({
        isSeasonal: false
      })
    } else if (this.getEditSeasons.length == 0){
      dbPath.set(this.getEditSeasons)

    } else {
      dbPath.update(updateKeys)
      dbPathChangeSeasonal.update({
        isSeasonal: true})
    }
    // After everything is done route back ..
    this.router.navigate(['/local-agency/risk-monitoring/']);


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
        this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.agencyID)
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
                this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.agencyID + "/" + hazardKey.key).update(updateHazardObj).then(_ => {
                  this.router.navigate(['/local-agency/risk-monitoring/']);
                }).catch(err => {
                  this.alertMessage = new AlertMessageModel("ERROR_UPDATING_OTHER_HAZARD_REF");
                });
              }).catch(err => {
                console.log(err);
                this.alertMessage = new AlertMessageModel("ERROR_UPDATING_OTHER_HAZARD_DATA");
              });
            } else {
              this.router.navigate(['/local-agency/risk-monitoring/']);
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
    /* #start
  * The values are the wrong way round when I came on to this component
  * so i have left them as they are in case of other checks ...
  * YES = false and NO = true
  */
    this.hazardData.seasons = [];
    this.addHazardSeason = event.target.value;


    if (this.addHazardSeason == 'true') {
      this.hazardData.isSeasonal = false;
      this.selectHazard = false;
      this.season = false;
      this.radioValue = true;
    }
    else {


      this.hazardData.isSeasonal = true;
      this.selectHazard = true;
      this.season = false;
      this.radioValue = false;
    }

    // #end
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
    if (this.editHazard) {
      this.getKey = seasonKey;
      console.log(event, seasonKey);
    }
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
    const dataToSave = form.value;
    if (this.addSeasonStart == null || this.addSeasonEnd == null || this.addSeasonColour == null) {
      this.alertMessage = new AlertMessageModel("RISK_MONITORING.ADD_HAZARD.ADD_SEASONAL_TO_CALENDAR_NO_DATE");
      return;
    }
    dataToSave.startTime = this.addSeasonStart;
    dataToSave.endTime = this.addSeasonEnd;
    dataToSave.colorCode = this.addSeasonColour;
    console.log(dataToSave);
    this.closeModal();
    this.af.database.list(Constants.APP_STATUS + "/season/" + this.agencyID)
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

  goBack() {
    this.locationService.back();
  }

}
