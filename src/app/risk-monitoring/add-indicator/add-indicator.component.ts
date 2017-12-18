import {Component, OnDestroy, OnInit} from "@angular/core";
import {Indicator} from "../../model/indicator";
import {Location} from '@angular/common';
import {
  AlertLevels,
  AlertMessageType,
  DetailedDurationType,
  GeoLocation,
  HazardScenario,
  UserType
} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CommonService} from "../../services/common.service";
import {OperationAreaModel} from "../../model/operation-area.model";
import {IndicatorSourceModel} from "../../model/indicator-source.model";
import {IndicatorTriggerModel} from "../../model/indicator-trigger.model";
import {AlertMessageModel} from '../../model/alert-message.model';
import {ModelUserPublic} from "../../model/user-public.model";
import {LocalStorageService} from 'angular-2-local-storage';
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageModel} from "../../model/message.model";

declare var jQuery: any;

@Component({
  selector: 'app-add-indicator',
  templateUrl: './add-indicator.component.html',
  styleUrls: ['./add-indicator.component.css'],
  providers: [CommonService]
})

export class AddIndicatorRiskMonitoringComponent implements OnInit, OnDestroy {

  private UserType: number;

  alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  public uid: string;
  public countryID: string;

  public indicatorData: Indicator;
  public oldIndicatorData;

  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertImages = Constants.ALERT_IMAGES;
  private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

  private durationType = Constants.DETAILED_DURATION_TYPE;
  private durationTypeList: number[] = [DetailedDurationType.Hour, DetailedDurationType.Day, DetailedDurationType.Week, DetailedDurationType.Month, DetailedDurationType.Year];

  private geoLocation = Constants.GEO_LOCATION;
  private geoLocationList: number[] = [GeoLocation.national, GeoLocation.subnational];


  private countries = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private frequency = new Array(100);

  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  private hazardScenario = Constants.HAZARD_SCENARIOS;
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
    HazardScenario.HazardScenario26,
  ];

  private usersForAssign: any = [];
  private isEdit: boolean = false;
  private hazardID: any;
  private indicatorID: any;
  private url: string;
  private hazards: Array<any> = [];
  private hazardsObject: any = {};
  private agencyId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private copyCountryId: string;
  private copyIndicatorId: string;
  private isContext: boolean;
  private copyHazardId: string;
  private copyAgencyId: string;
  private copySystemId: string;
  private agencyOverview: boolean;

  private countryLocation: number;

  private networkId: string;
  private networkCountryId: string;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private storage: LocalStorageService,
              private userService: UserService,
              private _location: Location,
              private _translate: TranslateService,
              private _notificationService: NotificationService) {
    this.initIndicatorData();
  }

  ngOnInit() {

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {

        if (params["countryId"]) {
          this.copyCountryId = params["countryId"];
        }

        if (params["agencyId"]) {
          this.copyAgencyId = params["agencyId"];
        }

        if (params["systemId"]) {
          this.copySystemId = params["systemId"];
        }

        if (params["indicatorId"]) {
          this.copyIndicatorId = params["indicatorId"];
        }

        if (params["isContext"]) {
          this.isContext = params["isContext"];
        }

        if (params["hazardId"]) {
          this.copyHazardId = params["hazardId"];
        }

        if (params["agencyOverview"]) {
          this.agencyOverview = params["agencyOverview"];
        }

        if (params["networkId"]) {
          this.networkId = params["networkId"];
        }

        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }

        if (this.copyCountryId && this.copyIndicatorId) {
          this.loadCopyContextIndicatorInfo(this.copyCountryId, this.copyIndicatorId, this.copyHazardId);
        }

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.UserType = userType;
          this.countryID = countryId;
          this.agencyId = agencyId;

          this._getHazards();
          this.getUsersForAssign();
          this.oldIndicatorData = Object.assign({}, this.indicatorData); // clones the object to see if the assignee changes in order to send notification

          // get the country levels values
          this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(content => {
              this.countryLevelsValues = content;
              err => console.log(err);
            });

          //get country location enum
          this.userService.getCountryDetail(this.countryID, this.agencyId)
            .first()
            .subscribe(country => {
              this.countryLocation = country.location;
            });
        });
      });
  }

  private loadCopyContextIndicatorInfo(copyCountryId: string, copyIndicatorId: string, copyHazardId: string) {
    if (this.isContext && !copyHazardId) {
      this.af.database.object(Constants.APP_STATUS + "/indicator/" + copyCountryId + "/" + copyIndicatorId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(copyContextIndicator => {
          let contextIndicator = new Indicator();
          contextIndicator.mapFromObject(copyContextIndicator);
          this.indicatorData = contextIndicator;
          this.indicatorData.assignee = undefined;
        });
    } else {
      this.af.database.object(Constants.APP_STATUS + "/indicator/" + copyHazardId + "/" + copyIndicatorId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(indicator => {
          let hazardIndicator = new Indicator();
          hazardIndicator.mapFromObject(indicator);
          this.indicatorData = hazardIndicator;
          this.indicatorData.assignee = undefined;
        });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initIndicatorData() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        this.indicatorData = new Indicator();
        if (!params['hazardID']) {
          console.log('hazardID cannot be empty');
          this.router.navigate(["/risk-monitoring"]);
          return false;
        }

        this.hazardID = params['hazardID'];
        console.log(this.hazardID);

        if (params['indicatorID']) {
          this.isEdit = true;
          this.hazardID = params['hazardID'];
          this.indicatorID = params['indicatorID'];
          if (params["networkId"]) {
            this.networkId = params["networkId"];
          }
          if (params["networkCountryId"]) {
            this.networkCountryId = params["networkCountryId"];
          }

          this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
            if (user) {
              this.uid = user.uid;
              this.UserType = userType;
              this.countryID = countryId;
              this._getIndicator(this.hazardID, this.indicatorID);
            } else {
              this.navigateToLogin();
            }
          });
        } else {
          this.addAnotherSource();
          // this.addAnotherLocation();
          this.addIndicatorTrigger();
        }
      });
  }

  stateGeoLocation(event: any) {
    var geoLocation = parseInt(event.target.value);
    this.indicatorData.geoLocation = geoLocation;
    if (geoLocation == GeoLocation.subnational && this.indicatorData.affectedLocation.length == 0) {
      this.addAnotherLocation();
    }
  }


  addAnotherSource() {
    this.indicatorData.source.push(new IndicatorSourceModel());
  }

  removeAnotherSource(key: number) {
    this.indicatorData.source.splice(key, 1);
  }

  addAnotherLocation() {
    let modelArea = new OperationAreaModel();
    modelArea.country = this.countryLocation;
    this.indicatorData.affectedLocation.push(modelArea);
    console.log(this.indicatorData)
  }

  removeAnotherLocation(key: number,) {
    this.indicatorData.affectedLocation.splice(key, 1);
  }

  addIndicatorTrigger() {
    for (let alertLevelKey in this.alertLevelsList) {
      this.indicatorData.trigger.push(new IndicatorTriggerModel());
    }
  }

  getUsersForAssign() {
    if (this.UserType == UserType.Ert || this.UserType == UserType.PartnerUser) {
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID + "/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(staff => {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staff.$key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((user: ModelUserPublic) => {
              let userToPush = {userID: staff.$key, name: user.firstName + " " + user.lastName};
              this.usersForAssign.push(userToPush);
            });
        });
    } else {
      //Obtaining the country admin data
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryID).subscribe((data: any) => {
        if (data.adminId) {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).subscribe((user: ModelUserPublic) => {
            var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
            this.usersForAssign.push(userToPush);
          });
        }
      });

      //Obtaining other staff data
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID).subscribe((data: {}) => {
        for (let userID in data) {
          if (!userID.startsWith('$')) {
            this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).subscribe((user: ModelUserPublic) => {
              var userToPush = {userID: userID, name: user.firstName + " " + user.lastName};
              this.usersForAssign.push(userToPush);
            });
          }
        }
      });
    }
  }

  showDeleteDialog(modalId) {
    console.log("SHOWING!");
    jQuery('#' + modalId).modal("show");
  }

  getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/countryId').subscribe((countryID: any) => {
        this.countryID = countryID.$value ? countryID.$value : "";
        res(true);
      });
    });
    return promise;
  }

  saveIndicator() {

    if (typeof (this.indicatorData.hazardScenario) == 'undefined') {
      this.indicatorData.hazardScenario = this.hazardsObject[this.hazardID];
    }
    this._validateData().then((isValid: boolean) => {
      if (isValid) {
        if (!this.isEdit) {
          this.indicatorData.triggerSelected = 0;
        }
        // this.indicatorData.category = parseInt(this.indicatorData.category);
        this.indicatorData.dueDate = this._calculationDueDate(Number(this.indicatorData.trigger[this.indicatorData.triggerSelected].durationType), Number(this.indicatorData.trigger[this.indicatorData.triggerSelected].frequencyValue));
        this.indicatorData.updatedAt = new Date().getTime();
        if (!this.indicatorData.assignee) {
          this.indicatorData.assignee = null;
        }

        //clean up locations
        this.indicatorData.affectedLocation.forEach(location => {
          if (!location.level1) {
            location.level1 = null;
          }
          if (!location.level2) {
            location.level2 = null;
          }
        });
        if (this.indicatorData.geoLocation == GeoLocation.national && this.indicatorData.affectedLocation) {
          this.indicatorData.affectedLocation = null;
        }

        var dataToSave = this.indicatorData;

        var urlToPush;
        var urlToEdit;

        if (this.hazardID == 'countryContext') {
          urlToPush = Constants.APP_STATUS + '/indicator/' + this.countryID;
          urlToEdit = Constants.APP_STATUS + '/indicator/' + this.countryID + '/' + this.indicatorID;
        } else {
          urlToPush = Constants.APP_STATUS + '/indicator/' + this.hazardID;
          urlToEdit = Constants.APP_STATUS + '/indicator/' + this.hazardID + '/' + this.indicatorID;
        }

        if (!this.isEdit) {
          this.af.database.list(urlToPush)
            .push(dataToSave)
            .then(() => {
              if (dataToSave.assignee) {
                // Send notification to the assignee
                let notification = new MessageModel();
                notification.title = this._translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_INDICATOR_TITLE");
                notification.content = this._translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_INDICATOR_CONTENT", {indicatorName: dataToSave.name});
                notification.time = new Date().getTime();
                this._notificationService.saveUserNotificationWithoutDetails(dataToSave.assignee, notification).subscribe(() => {
                });
              }

              if (this.copyCountryId && this.copySystemId && this.copyAgencyId) {
                this.router.navigate(["/dashboard/dashboard-overview", {
                  "countryId": this.copyCountryId,
                  "isViewing": true,
                  "agencyId": this.copyAgencyId,
                  "systemId": this.copySystemId,
                  "from": "risk",
                  "canCopy": true
                }]);
              } else {
                this._location.back();
              }
            }).catch((error: any) => {
            console.log(error, 'You do not have access!')
          });
        } else {
          delete dataToSave.id;
          console.log(dataToSave);
          this.af.database.object(urlToEdit)
            .update(dataToSave)
            .then(() => {
              if (dataToSave.assignee && dataToSave.assignee != this.oldIndicatorData.assignee) {
                // Send notification to the assignee
                let notification = new MessageModel();
                notification.title = this._translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_INDICATOR_TITLE");
                notification.content = this._translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_INDICATOR_CONTENT", {indicatorName: dataToSave.name});
                notification.time = new Date().getTime();
                this._notificationService.saveUserNotificationWithoutDetails(dataToSave.assignee, notification).subscribe(() => {
                });
              }
              this.backToRiskHome();
              // this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.SUCCESS_MESSAGE_UPDATE_INDICATOR', AlertMessageType.Success);
              // return true;
            }).catch((error: any) => {
            console.log(error, 'You do not have access!')
          });
        }

      } else {
        // console.log(this.indicatorData)
        // if (!this.indicatorData.sources || this.indicatorData.sources.filter(source=>{return source.name}).length ==0) {
        //   this.alertMessage = new AlertMessageModel("RISK_MONITORING.ADD_INDICATOR.NO_SOURCE_NAME")
        // }
      }
    });

  }

  cancel() {
    if (this.copyCountryId && this.copySystemId && this.copyAgencyId) {
      if (this.agencyOverview) {
        this.router.navigate(["/dashboard/dashboard-overview", {
          "countryId": this.copyCountryId,
          "isViewing": true,
          "agencyId": this.copyAgencyId,
          "systemId": this.copySystemId,
          "from": "risk",
          "canCopy": true,
          "agencyOverview": this.agencyOverview
        }]);
      } else {
        this.router.navigate(["/dashboard/dashboard-overview", {
          "countryId": this.copyCountryId,
          "isViewing": true,
          "agencyId": this.copyAgencyId,
          "systemId": this.copySystemId,
          "from": "risk",
          "canCopy": true
        }]);
      }
    } else {
      this._location.back();
    }

  }

  setNewHazardID(event: any) {
    var hazardID = event.target.value ? event.target.value : false;
    if (!hazardID) {
      console.log('hazardID cannot be empty');
      return false;
    }
    this.hazardID = hazardID;
    this.indicatorData.hazardScenario = this.hazardsObject[hazardID].hazardScenario;
  }

  _getHazards() {
    this.hazards = [];
    this.hazardsObject = {};
    if (this.networkId) {

      if (this.networkCountryId) {
        this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.networkCountryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((hazards: any) => {


            for (let hazard in hazards) {
              if (hazard == this.hazardID) {
                if (!hazard.includes("$") && hazard != "countryContext") {
                  hazards[hazard].key = hazard;

                  if (hazards[hazard].hazardScenario != -1) {
                    this.hazards.push(hazards[hazard]);
                    this.hazardsObject[hazard] = hazards[hazard];
                  } else {
                    this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazards[hazard].otherName)
                      .first()
                      .subscribe(nameObj => {
                        hazards[hazard].displayName = nameObj.name;
                        this.hazards.push(hazards[hazard]);
                        this.hazardsObject[hazard] = hazards[hazard];
                      });
                  }
                }
              }
            }

          });
      } else {
        this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.networkId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((hazards: any) => {
            for (let hazard in hazards) {
              if (hazard == this.hazardID) {
                if (!hazard.includes("$") && hazard != "countryContext") {
                  hazards[hazard].key = hazard;

                  if (hazards[hazard].hazardScenario != -1) {
                    this.hazards.push(hazards[hazard]);
                    this.hazardsObject[hazard] = hazards[hazard];
                  } else {
                    this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazards[hazard].otherName)
                      .first()
                      .subscribe(nameObj => {
                        hazards[hazard].displayName = nameObj.name;
                        this.hazards.push(hazards[hazard]);
                        this.hazardsObject[hazard] = hazards[hazard];
                      });
                  }
                }
              }
            }

          });
      }


    }
    this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.countryID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((hazards: any) => {


        hazards["countryContext"] = {key: "countryContext"};
        this.hazards.push(hazards["countryContext"]);
        this.hazardsObject["countryContext"] = hazards["countryContext"];
        for (let hazard in hazards) {
          if (!hazard.includes("$") && hazard != "countryContext") {
            hazards[hazard].key = hazard;

            if (hazards[hazard].hazardScenario != -1) {
              this.hazards.push(hazards[hazard]);
              this.hazardsObject[hazard] = hazards[hazard];
            } else {
              this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazards[hazard].otherName)
                .first()
                .subscribe(nameObj => {
                  hazards[hazard].displayName = nameObj.name;
                  this.hazards.push(hazards[hazard]);
                  this.hazardsObject[hazard] = hazards[hazard];
                });
            }
          }
        }
      });
  }

  _deleteIndicator() {
    jQuery("#delete-indicator").modal("hide");
    let path = "";
    if (this.hazardID == "countryContext") {
      path = Constants.APP_STATUS + "/indicator/" + this.countryID + "/" + this.indicatorID;
    } else {
      path = Constants.APP_STATUS + "/indicator/" + this.hazardID + "/" + this.indicatorID;
    }
    this.af.database.object(path).set(null)
      .then(() => {
        this.router.navigateByUrl("/risk-monitoring");
      })
      .catch((error) => {
        this.alertMessage = new AlertMessageModel('DELETE_INDICATOR_DIALOG.UNABLE_TO_DELETE', AlertMessageType.Error);
      });
  }


  _getIndicator(hazardID: string, indicatorID: string) {

    //this.indicatorData = new Indicator();

    if (this.hazardID == 'countryContext') {
      this.url = Constants.APP_STATUS + "/indicator/" + this.countryID + '/' + indicatorID;
    } else {
      this.url = Constants.APP_STATUS + "/indicator/" + hazardID + "/" + indicatorID;
    }

    console.log(this.url);

    this.af.database.object(this.url).takeUntil(this.ngUnsubscribe).subscribe((indicator: any) => {
      if (indicator.$value === null) {
        console.log(indicator)
        this.router.navigate(['/risk-monitoring']);
        return false;
      }
      indicator.id = indicatorID;
      this.indicatorData.setData(indicator);
    });
  }

  _closeModal(modalId) {
    jQuery(modalId).modal("hide");
  }

  _validateData() {

    let promise = new Promise((res, rej) => {
      this.alertMessage = this.indicatorData.validate();
      if (this.alertMessage) {
        res(false);
      }

      if (!this.alertMessage) {
        this.indicatorData.source.forEach((val, key) => {
          let modelSource = new IndicatorSourceModel();
          modelSource.mapFromObject(val);
          console.log(modelSource.name)
          this.alertMessage = this._validateIndicatorSource(modelSource);
          if (this.alertMessage) {
            res(false);
          }
        });

        if (!this.alertMessage) {
          this.indicatorData.trigger.forEach((val, key) => {
            let modelTrigger = new IndicatorTriggerModel();
            modelTrigger.mapFromObject(val);
            this._validateIndicatorTrigger(modelTrigger);
            if (this.alertMessage) {
              res(false);
            }
          });

          if (!this.alertMessage) {
            if (this.indicatorData.geoLocation == 1) {
              this.indicatorData.affectedLocation.forEach((val, key) => {
                let modelArea = new OperationAreaModel();
                modelArea.mapFromObject(val);
                this._validateOperationArea(modelArea);
                if (this.alertMessage) {
                  res(false);
                }
              });
            }
          }

          if (!this.alertMessage) {
            res(true);
          }
        }
      }
    });
    return promise;
  }

  _validateIndicatorSource(indicatorSource: IndicatorSourceModel): AlertMessageModel {
    this.alertMessage = indicatorSource.validate();
    return this.alertMessage;
  }

  _validateIndicatorTrigger(indicatorTrigger: IndicatorTriggerModel): AlertMessageModel {
    this.alertMessage = indicatorTrigger.validate();
    return this.alertMessage;
  }

  _validateOperationArea(operationArea: OperationAreaModel): AlertMessageModel {
    let excludeFields = [];
    let countryLevel1Exists = operationArea.country
      && this.countryLevelsValues[operationArea.country].levelOneValues
      && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
    if (!countryLevel1Exists) {
      excludeFields.push("level1", "level2");
    } else if (countryLevel1Exists && operationArea.level1
      && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues
        || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].length < 1)) {
      excludeFields.push("level2");
    }
    this.alertMessage = operationArea.validate(excludeFields);
    return this.alertMessage;
  }


  _calculationDueDate(durationType: number, frequencyValue: number) {

    var currentUnixTime = new Date().getTime();
    var CurrentDate = new Date();
    var currentYear = new Date().getFullYear();

    let miliBase = 1000;
    var hour = 3600 * miliBase;
    var day = 86400 * miliBase;
    var week = 604800 * miliBase;

    if (durationType == DetailedDurationType.Hour) {
      var differenceTime = frequencyValue * hour;
    } else if (durationType == DetailedDurationType.Day) {
      var differenceTime = frequencyValue * day;
    } else if (durationType == DetailedDurationType.Week) {
      var differenceTime = frequencyValue * week;
    } else if (durationType == DetailedDurationType.Month) {
      var resultDate = CurrentDate.setMonth(CurrentDate.getMonth() + frequencyValue);
      var differenceTime = resultDate - currentUnixTime;
    } else if (durationType == DetailedDurationType.Year) {
      var differenceTime = this._getDifferenceTimeByYear(frequencyValue);
    }

    var dueDate = currentUnixTime + differenceTime;
    return dueDate;

  }

  _getDifferenceTimeByYear(years: number) {

    let miliBase = 1000;
    var currentYear = new Date().getFullYear();
    var year = 315036000 * miliBase;
    var leapYear = 31622400 * miliBase;

    var i;
    var differenceTime = 0;
    for (i = 0; i < years; i++) {
      currentYear = currentYear + 1;
      var seconds = this._isLeapYear(currentYear) ? leapYear : year;
      differenceTime = differenceTime + seconds;
    }
    return differenceTime;
  }

  _isLeapYear(year: number) {
    var isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    if (!isLeapYear) {
      return false;
    }
    return true;
  }

  checkTypeof(param: any) {
    if (typeof (param) == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  onAlertHidden(hidden: boolean) {
    if (this.alertMessage.type == AlertMessageType.Success)
      this._location.back();
  }

  backToRiskHome() {
    this.router.navigateByUrl("/risk-monitoring");
  }

  back() {
    if (this.copyCountryId && this.copySystemId && this.copyAgencyId) {
      let headers = {
        "countryId": this.copyCountryId,
        "isViewing": true,
        "agencyId": this.copyAgencyId,
        "systemId": this.copySystemId,
        "from": "risk",
        "canCopy": true
      };
      if (this.agencyOverview) {
        headers["agencyOverview"] = this.agencyOverview;
      }
      this.router.navigate(["/dashboard/dashboard-overview", headers]);
    } else {
      this.backToRiskHome();
    }
  }

}
