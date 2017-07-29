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
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid).subscribe(agencyId => {
        this.agencyId = agencyId
      });
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((param: Params) => {
          if (param['id']) {
            this.alertId = param['id'];
            this.countryId = param['countryId'];
            this.isDirector = param['isDirector'];
            this.loadAlert(this.alertId, this.countryId);
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

    this.alertService.updateAlert(this.loadedAlert, this.preAlertLevel, this.countryId, this.agencyId);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.alertService.unSubscribeNow();
  }

}
