import {Component, OnDestroy, OnInit} from "@angular/core";
import {Indicator} from "../../../model/indicator";
import {Location} from '@angular/common';
import {
  AlertLevels,
  AlertMessageType,
  DetailedDurationType,
  GeoLocation,
  HazardScenario,
  UserType,
  NetworkUserAccountType
} from "../../../utils/Enums";
import {Constants} from "../../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AgencyService} from "../../../services/agency-service.service";
import {CommonService} from "../../../services/common.service";
import {OperationAreaModel} from "../../../model/operation-area.model";
import {IndicatorSourceModel} from "../../../model/indicator-source.model";
import {IndicatorTriggerModel} from "../../../model/indicator-trigger.model";
import {AlertMessageModel} from '../../../model/alert-message.model';
import {ModelUserPublic} from "../../../model/user-public.model";
import {LocalStorageService} from 'angular-2-local-storage';
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {NetworkService} from "../../../services/network.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NotificationService} from "../../../services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageModel} from "../../../model/message.model";

declare var jQuery: any;

@Component({
  selector: 'app-add-indicator-network-country',
  templateUrl: './add-indicator-network-country.component.html',
  styleUrls: ['./add-indicator-network-country.component.scss'],
  providers: [CommonService]
})
export class AddIndicatorNetworkCountryComponent implements OnInit, OnDestroy {
  networkId: any;
  copyCountryOfficeCode: any;
  networkCountryId: any;

  private UserType: number;

  alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  public uid: string;
  public countryID: string;

  public indicatorData: any;
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
  private originHazardId: string;
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
  private networkViewValues: {};
  private isViewing: boolean;
  private systemId: string;
  private userAgencyCountryMap = new Map<string, {agencyId:string, countryOfficeId:string}>()

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private storage: LocalStorageService,
              private userService: UserService,
              private networkService: NetworkService,
              private _location: Location,
              private _translate: TranslateService,
              private _notificationService: NotificationService,
              private _agencyService: AgencyService) {
    this.initIndicatorData();
  }

  ngOnInit() {

    this.networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {

        console.log(params)

        if (params["indicatorID"]) {
          this.copyIndicatorId = params["indicatorId"];
        }
        if (params["countryOfficeCode"]) {
          this.copyCountryOfficeCode = params["countryOfficeCode"];
        }
        if (params["hazardID"]) {
          this.copyHazardId = params["hazardId"];
        }
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
        if (params["userType"]) {
          this.UserType = params["userType"];
        }

        if (this.copyCountryId && this.copyIndicatorId) {
          console.log("triggered")
          this.loadCopyContextIndicatorInfo(this.copyCountryId, this.copyIndicatorId, this.copyHazardId);
        }

        if (this.isViewing) {

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

          this.initPreSelection()

        } else {
          this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
            this.uid = user.uid;

            //get network id
            this.networkService.getSelectedIdObj(user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {
                console.log(selection)
                this.networkCountryId = selection["networkCountryId"];
                this.networkId = selection["id"]
                this.UserType = selection["userType"];


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
                this.initPreSelection();

              })

          });
        }

      });
  }

  private initPreSelection() {
    this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
      .first()
      .subscribe(networkCountry => {
        this.countryLocation = networkCountry.location
      })
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
          this.router.navigate(this.networkViewValues ? ["/risk-monitoring", this.networkViewValues] : ["/risk-monitoring"]);
          return false;
        }
        if (params["countryOfficeCode"]) {
          this.copyCountryOfficeCode = params["countryOfficeCode"];
        }
        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }

        this.hazardID = params['hazardID'];
        this.originHazardId = params['hazardID'];
        console.log(this.hazardID);
        console.log(params['indicatorID'])
        if (params['indicatorID']) {
          this.isEdit = true;
          this.hazardID = params['hazardID'];
          this.indicatorID = params['indicatorID'];

          if (params['isViewing']) {
            console.log('just getting indicator')
            this._getIndicator(this.hazardID, this.indicatorID);
          } else {
            this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
              this.networkService.getSelectedIdObj(user.uid)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(selection => {
                  console.log(selection)
                  this.networkCountryId = selection["networkCountryId"];
                  this.UserType = selection["userType"];
                  if (user) {
                    this.uid = user.uid;
                    this._getIndicator(this.hazardID, this.indicatorID);
                  } else {
                    this.navigateToLogin();
                  }
                })
            });
          }

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
    if (this.countryLocation >= 0) {
      modelArea.country = this.countryLocation;
    }
    this.indicatorData.affectedLocation.push(modelArea);
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
    console.log(this.UserType)
    if (this.UserType == NetworkUserAccountType.NetworkCountryAdmin) {
      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: ModelUserPublic) => {
          console.log(user)
          let userToPush = {userID: this.uid, name: user.firstName + " " + user.lastName};
          this.usersForAssign.push(userToPush);
        })

      this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(network => {
          Object.keys(network.agencyCountries).forEach(agencyKey => {
            this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyKey)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryOffices => {
                countryOffices.forEach(countryOffice => {
                  if (network.agencyCountries[agencyKey][countryOffice.$key] && network.agencyCountries[agencyKey][countryOffice.$key].isApproved === true) {
                    // Obtaining the country admin data
                    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyKey + "/" + countryOffice.$key).takeUntil(this.ngUnsubscribe).subscribe((data: any) => {
                      if (data.adminId) {
                        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).takeUntil(this.ngUnsubscribe).subscribe((user: ModelUserPublic) => {
                          var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
                          this.usersForAssign.push(userToPush);
                          this.userAgencyCountryMap.set(userToPush.userID, {agencyId:agencyKey, countryOfficeId:countryOffice.$key})
                        });
                      }
                    });
                    //Obtaining other staff data
                    this.af.database.object(Constants.APP_STATUS + "/staff/" + countryOffice.$key).takeUntil(this.ngUnsubscribe).subscribe((data: {}) => {
                      for (let userID in data) {
                        if (!userID.startsWith('$')) {
                          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).takeUntil(this.ngUnsubscribe).subscribe((user: ModelUserPublic) => {
                            var userToPush = {userID: userID, name: user.firstName + " " + user.lastName};
                            this.usersForAssign.push(userToPush);
                            this.userAgencyCountryMap.set(userToPush.userID, {agencyId:agencyKey, countryOfficeId:countryOffice.$key})
                          });
                        }
                      }
                    });
                  }
                })
              })
          })
        })

    } else if (this.UserType == UserType.GlobalDirector) {
      console.log('globalDirector')
      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: ModelUserPublic) => {
          let userToPush = {userID: this.uid, name: user.firstName + " " + user.lastName};
          this.usersForAssign.push(userToPush);
        })
    } else if (this.UserType == UserType.Ert || this.UserType == UserType.PartnerUser) {
      console.log('ert/ partner')
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.copyCountryOfficeCode + "/" + this.uid)
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

      this._agencyService.getAllCountryOffices()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencies => {
          console.log(this.uid)
          agencies.forEach(agency => {
            this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agency.$key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryOffices => {


                if (this.isViewing) {
                  countryOffices.filter(countryOffice => {
                    console.log(countryOffice.$key)
                    if (this.countryID == countryOffice.$key) {
                      this.agencyId = agency.$key

                      // Obtaining the country admin data
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
                  })
                } else {
                  countryOffices.filter(countryOffice => {
                    console.log(countryOffice.$key)
                    if (this.copyCountryOfficeCode == countryOffice.$key) {
                      this.agencyId = agency.$key

                      // Obtaining the country admin data
                      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.copyCountryOfficeCode).subscribe((data: any) => {
                        if (data.adminId) {
                          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).subscribe((user: ModelUserPublic) => {
                            var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
                            this.usersForAssign.push(userToPush);
                          });
                        }
                      });
                      //Obtaining other staff data
                      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.copyCountryOfficeCode).subscribe((data: {}) => {
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
                  })
                }

              })
          });
        })

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

    if (typeof (this.indicatorData.hazardScenario) == 'undefined' || typeof (this.indicatorData.hazardScenario) == 'number') {
      this.indicatorData.hazardScenario = this.hazardsObject[this.hazardID];
    }
    this._validateData().then((isValid: boolean) => {
      if (isValid) {


        let trackingNode = this.indicatorData["timeTracking"] ? this.indicatorData["timeTracking"] : null;
        let currentTime = new Date().getTime()
        let newTimeObject = {start: currentTime, finish: -1,level: this.indicatorData.triggerSelected};
        let id = this.hazardID == 'countryContext' ? this.networkCountryId : this.hazardID;

        if (!this.isEdit) {
          this.indicatorData.triggerSelected = 0;
          newTimeObject.level = 0
        }
        this.indicatorData.category = parseInt(this.indicatorData.category);
        console.log(this.indicatorData.trigger)
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

        //if isViewing add the country office and agency ID to retrieve in country office view
        if (this.isViewing) {
          this.indicatorData['agencyId'] = this.agencyId
          this.indicatorData['countryOfficeId'] = this.countryID
        }
        //if assign to country staff, need agencyid and countryofficeid info as well
        if (this.indicatorData.assignee && this.userAgencyCountryMap.get(this.indicatorData.assignee)) {
          this.indicatorData['agencyId'] = this.userAgencyCountryMap.get(this.indicatorData.assignee).agencyId
          this.indicatorData['countryOfficeId'] = this.userAgencyCountryMap.get(this.indicatorData.assignee).countryOfficeId
        }

        var dataToSave = this.indicatorData;

        var urlToPush;
        var urlToEdit;


        if (this.copyCountryOfficeCode && this.hazardID == 'countryContext') {
          urlToPush = Constants.APP_STATUS + "/indicator/" + this.networkCountryId;
          urlToEdit = Constants.APP_STATUS + '/indicator/' + this.copyCountryOfficeCode + '/' + this.indicatorID;
        } else if (this.hazardID == 'countryContext') {
          urlToPush = Constants.APP_STATUS + '/indicator/' + this.networkCountryId;
          urlToEdit = Constants.APP_STATUS + '/indicator/' + this.networkCountryId + '/' + this.indicatorID;
        } else {
          urlToPush = Constants.APP_STATUS + '/indicator/' + this.hazardID;
          urlToEdit = Constants.APP_STATUS + '/indicator/' + this.hazardID + '/' + this.indicatorID;
        }

        // Delete the indicator from under the old hazard
        // console.log("COMPARING [" + this.hazardID + "] [" + this.originHazardID + "]");
        if (this.hazardID != this.originHazardId) {
          if (this.originHazardId == "countryContext") {
            this.af.database.object(Constants.APP_STATUS + "/indicator/" + this.networkCountryId + "/" + this.indicatorID).set(null);
          }
          else {
            this.af.database.object(Constants.APP_STATUS + "/indicator/" + this.originHazardId + "/" + this.indicatorID).set(null);
          }
        }

        if (!this.isEdit) {
          this.af.database.list(urlToPush)
            .push(dataToSave)
            .then(indicator => {


              this.af.database.object(Constants.APP_STATUS + '/indicator/' + id  + '/' + indicator.key + '/timeTracking')
                    .update({timeSpentInGreen: [newTimeObject]})

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
                this.networkViewValues["countryId"] = this.copyCountryId
                this.networkViewValues["isViewing"] = true
                this.networkViewValues["agencyId"] = this.copyAgencyId
                this.networkViewValues["systemId"] = this.copySystemId
                this.networkViewValues["from"] = "risk"
                this.networkViewValues["canCopy"] = true

                this.router.navigate(["/dashboard/dashboard-overview", this.networkViewValues]);
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

      }
    });

  }

  cancel() {
    if (this.copyCountryId && this.copySystemId && this.copyAgencyId) {
      if (this.agencyOverview) {

        this.networkViewValues["countryId"] = this.copyCountryId
        this.networkViewValues["isViewing"] = true
        this.networkViewValues["agencyId"] = this.copyAgencyId
        this.networkViewValues["systemId"] = this.copySystemId
        this.networkViewValues["from"] = "risk"
        this.networkViewValues["canCopy"] = true
        this.networkViewValues["agencyOverview"] = this.agencyOverview

        this.router.navigate(["/dashboard/dashboard-overview", this.networkViewValues]);

      } else {

        this.networkViewValues["countryId"] = this.copyCountryId
        this.networkViewValues["isViewing"] = true
        this.networkViewValues["agencyId"] = this.copyAgencyId
        this.networkViewValues["systemId"] = this.copySystemId
        this.networkViewValues["from"] = "risk"
        this.networkViewValues["canCopy"] = true

        this.router.navigate(["/dashboard/dashboard-overview", this.networkViewValues]);
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
    if (this.copyCountryOfficeCode) {

      this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.copyCountryOfficeCode)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((hazards: any) => {
          this.hazards = [];
          this.hazardsObject = {};

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

    } else {
      this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.networkCountryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((hazards: any) => {
          this.hazards = [];
          this.hazardsObject = {};

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
  }

  _deleteIndicator() {
    jQuery("#delete-indicator").modal("hide");
    let path = "";

    if (this.copyCountryOfficeCode && this.hazardID == 'countryContext') {
      path = Constants.APP_STATUS + "/indicator/" + this.copyCountryOfficeCode + '/' + this.indicatorID;
    } else if (this.hazardID == 'countryContext') {
      path = Constants.APP_STATUS + "/indicator/" + this.networkCountryId + '/' + this.indicatorID;
    } else {
      path = Constants.APP_STATUS + "/indicator/" + this.hazardID + "/" + this.indicatorID;
    }

    this.af.database.object(path).set(null)
      .then(() => {

        this.router.navigate(this.networkViewValues ? ["/network-country/network-risk-monitoring", this.networkViewValues] : ["/network-country/network-risk-monitoring"]);
      })
      .catch((error) => {
        this.alertMessage = new AlertMessageModel('DELETE_INDICATOR_DIALOG.UNABLE_TO_DELETE', AlertMessageType.Error);
      });
  }

  print(location) {

    console.log(location)
  }

  _getIndicator(hazardID: string, indicatorID: string) {

    //this.indicatorData = new Indicator();
    if (this.copyCountryOfficeCode && this.hazardID == 'countryContext') {
      this.url = Constants.APP_STATUS + "/indicator/" + this.copyCountryOfficeCode + '/' + indicatorID;
    } else if (this.hazardID == 'countryContext') {
      this.url = Constants.APP_STATUS + "/indicator/" + this.networkCountryId + '/' + indicatorID;
    } else {
      this.url = Constants.APP_STATUS + "/indicator/" + hazardID + "/" + indicatorID;
    }

    console.log(this.url);

    this.af.database.object(this.url).takeUntil(this.ngUnsubscribe).subscribe((indicator: any) => {
      if (indicator.$value === null) {
        console.log(indicator)
        this.router.navigate(this.networkViewValues ? ["/network-country/network-risk-monitoring", this.networkViewValues] : ["/network-country/network-risk-monitoring"]);
        return false;
      }
      indicator.id = indicatorID;
      console.log(indicator)
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
          this._validateIndicatorSource(modelSource);
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
    console.log(indicatorSource.name)
    this.alertMessage = indicatorSource.validate();
    console.log(this.alertMessage)
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
    this.router.navigate(this.networkViewValues ? ["/network-country/network-risk-monitoring", this.networkViewValues] : ["/network-country/network-risk-monitoring"]);
  }

  back() {
    if (this.copyCountryId && this.copySystemId && this.copyAgencyId) {
      this.networkViewValues["countryId"] = this.copyCountryId
      this.networkViewValues["isViewing"] = true
      this.networkViewValues["agencyId"] = this.copyAgencyId
      this.networkViewValues["systemId"] = this.copySystemId
      this.networkViewValues["from"] = "risk"
      this.networkViewValues["canCopy"] = true

      if (this.agencyOverview) {
        this.networkViewValues["agencyOverview"] = this.agencyOverview
      }
      this.router.navigate(this.networkViewValues ? ["/dashboard/dashboard-overview", this.networkViewValues] : ["/dashboard/dashboard-overview"]);
    } else {
      this.backToRiskHome();
    }
  }

}
