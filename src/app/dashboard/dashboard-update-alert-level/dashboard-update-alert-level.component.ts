import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {AlertLevels, AlertStatus} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {UserService} from "../../services/user.service";
import {OperationAreaModel} from "../../model/operation-area.model";
import {CommonService} from "../../services/common.service";
import {HazardImages} from "../../utils/HazardImages";
import {NetworkService} from "../../services/network.service";
import * as moment from "moment";


@Component({
  selector: 'app-dashboard-update-alert-level',
  templateUrl: './dashboard-update-alert-level.component.html',
  styleUrls: ['./dashboard-update-alert-level.component.css'],
  providers: [ActionsService]
})
export class DashboardUpdateAlertLevelComponent implements OnInit, OnDestroy {

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
  private isLocalAgency: boolean = false;

  private countries = Constants.COUNTRIES;
  private countriesList = Constants.COUNTRY_SELECTION;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private alertService: ActionsService,
              private networkService:NetworkService,
              private userService: UserService) {
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
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((param: Params) => {
          if (param['agencyId']) {
            this.agencyId = param['agencyId'];
            this.isLocalAgency = true;
          }
          if (param['id']) {
            this.alertId = param['id'];
            this.countryId = param['countryId'];
            this.isDirector = param['isDirector'];
            this.isLocalAgency ? this.loadAlertLocalAgency(this.alertId, this.agencyId) : this.loadAlert(this.alertId, this.countryId);
          }

        });

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .takeUntil(this.ngUnsubscribe).subscribe(content => {
        this.countryLevelsValues = content;
        err => console.log(err);
      });
    });
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

  private loadAlertLocalAgency(alertId: string, agencyId: string) {

    this.alertService.getAlertLocalAgency(alertId, agencyId)
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

      });
  }


  selectedAlertLevel(selection) {
    this.loadedAlert.alertLevel = selection;
  }


  submit() {

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

    //if alert change state from red to other, reset apa actions with this assigned hazard
    if (this.preAlertLevel == AlertLevels.Red && this.loadedAlert.alertLevel != this.preAlertLevel) {
      console.log("alert changed from red to other")
      this.alertService.getApaActionsNeedResetForThisAlert(this.countryId, this.loadedAlert)
        .first()
        .subscribe(apasToReset => {
          apasToReset.forEach(apa => {
            let obj = {}
            obj["action/"+this.countryId+"/"+apa.$key+"/isComplete"] = null
            obj["action/"+this.countryId+"/"+apa.$key+"/isCompleteAt"] = null
            obj["action/" + this.countryId + "/" + apa.$key + "/actualCost"] = null
            obj["action/"+this.countryId+"/"+apa.$key+"/updatedAt"] = moment.utc().valueOf()
            this.networkService.updateNetworkField(obj)
          })
        })
    }

    if(this.isLocalAgency){
      this.alertService.updateAlertLocalAgency(this.loadedAlert, this.preAlertLevel, this.agencyId);
    }else{
      this.alertService.updateAlert(this.loadedAlert, this.preAlertLevel, this.countryId, this.agencyId);
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
