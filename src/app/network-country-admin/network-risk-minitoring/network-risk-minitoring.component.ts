import {Component, OnDestroy, OnInit} from "@angular/core";
import {
  AlertMessageType, Countries, DetailedDurationType, HazardScenario, ModuleNameNetwork, Privacy,
  UserType
} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../model/alert-message.model";
import {LogModel} from "../../model/log.model";
import {LocalStorageService} from "angular-2-local-storage";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../services/user.service";
import {CommonService} from "../../services/common.service";
import {NetworkService} from "../../services/network.service";
import {AgencyService} from "../../services/agency-service.service";
import {Subject} from "rxjs/Subject";
import {CountryPermissionsMatrix, PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
import {HazardImages} from "../../utils/HazardImages";
import {WindowRefService} from "../../services/window-ref.service";
import * as jsPDF from 'jspdf'
import {ModelUserPublic} from "../../model/user-public.model";
import {NetworkCountryModel} from "../network-country.model";
import {SettingsService} from "../../services/settings.service";
import {ModuleSettingsModel} from "../../model/module-settings.model";

declare var jQuery: any;

@Component({
  selector: 'app-network-risk-minitoring',
  templateUrl: './network-risk-minitoring.component.html',
  styleUrls: ['./network-risk-minitoring.component.css']
})
export class NetworkRiskMinitoringComponent implements OnInit, OnDestroy {
  public agencies = []
  public eventFilter = -1;
  public locationFilter = -1;
  public agencyFilter = -1;
  public indicatorLevelFilter = -1;

  networkCountryId: any;
  private networkViewValues: {};

  private USER_TYPE = UserType;
  private UserType: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  public uid: string;
  public countryID: string;
  private isViewing: boolean;
  private agencyId: string;
  private systemId: string;
  public hazards: any[] = [];
  public hazard: string;
  private canCopy: boolean;
  private agencyOverview: boolean;

  // Variable for Country Context being active or not. Defaults to true as
  //   /<env>/hazardCountryContext/<country_id> may not exist. If it doesn't, then default to true
  private countryContextIsActive: boolean = true;

  private countryLocation: any;
  private Countries = Countries;

  public activeHazards: any[] = [];
  public archivedHazards: any[] = [];

  public indicators: any = {};
  public indicatorsCC: any[] = [];

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

  private isIndicatorUpdate: any[] = [];

  private durationType = Constants.DETAILED_DURATION_TYPE;
  private durationTypeList: number[] = [DetailedDurationType.Hour, DetailedDurationType.Day, DetailedDurationType.Week, DetailedDurationType.Month, DetailedDurationType.Year];
  private indicatorTrigger: any[] = [];
  private alertImages = Constants.ALERT_IMAGES;
  private logContent: any[] = [];
  private isIndicatorCountryUpdate: any[] = [];

  private tmpHazardData: any[] = [];
  private tmpLogData: any[] = [];
  private AllSeasons = [];

  private successAddHazardMsg: any;
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  private logsToExport: any;
  private fromDate: string;
  private fromDateTimeStamp: number;
  private toDate: string;
  private toDateTimeStamp: number;

  private usersForAssign: any;
  private assignedIndicator: any;
  private assignedHazard: any;
  private assignedUser: string;
  private networkId: any;
  private countryLevelsValues: any;
  private isViewingFromExternal: boolean;

  private subnationalName: string;
  private countryName: string;
  private level1: string;
  private level2: string;

  private staffMap = new Map()

  private Hazard_Conflict = 1
  private previousIndicatorTrigger:number = -1
  private modules: ModuleSettingsModel[];
  private ModuleNameNetwork = ModuleNameNetwork

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private storage: LocalStorageService,
              private translate: TranslateService,
              private userService: UserService,
              private commonService: CommonService,
              private agencyService: AgencyService,
              private networkService: NetworkService,
              private settingService: SettingsService,
              private windowService: WindowRefService,
              private _commonService: CommonService) {
    this.tmpLogData['content'] = '';
    this.successAddNewHazardMessage();
  }

  successAddNewHazardMessage() {
    this.successAddHazardMsg = this.storage.get('successAddHazard');
    this.storage.remove('successAddHazard');
    if (typeof (this.successAddHazardMsg) != 'undefined') {
      setTimeout(() => {
        this.successAddHazardMsg = 'waiting';
        return;
      }, 4000);
    }
  }

  ngOnInit() {

    this.usersForAssign = [];
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
        if (params["canCopy"]) {
          this.canCopy = params["canCopy"];
        }
        if (params["uid"]) {
          this.uid = params["uid"];
        }
        if (params["userType"]) {
          this.UserType = params["userType"];
        }
        if (params["agencyOverview"]) {
          this.agencyOverview = params["agencyOverview"];
        }
        if (params["isViewingFromExternal"]) {
          this.isViewingFromExternal = params["isViewingFromExternal"];
        }

        if (this.isViewing) {
          console.log(this.networkId)
          console.log(this.networkCountryId)

          this.networkService.getNetworkCountryAgencies(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencies => {
              agencies.forEach(agency => {
                this.agencyService.getAgency(agency.$key)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(agency => {
                    this.agencies.push(agency)
                  })
                //get all staffs
                this.initStaffs(agency);
              })
            })


          this._getHazards()
          this.getCountryLocation()
            .then(_ => {
              // get the country levels values
              this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(content => {

                  this.countryLevelsValues = content[this.countryLocation];
                  console.log(this.countryLevelsValues)
                  err => console.log(err);
                });
            })
          this._getCountryContextIndicators();
          this.getUsersForAssign();


        } else {
          this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
            this.uid = user.uid;

            //get network id
            this.networkService.getSelectedIdObj(user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {
                console.log(selection)
                this.networkId = selection["id"];
                this.networkCountryId = selection["networkCountryId"];
                this.UserType = selection["userType"];


                this.networkService.getNetworkCountryAgencies(this.networkId, this.networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(agencies => {
                    agencies.forEach(agency => {
                      this.agencyService.getAgency(agency.$key)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(agency => {
                          this.agencies.push(agency)
                        })
                      //get all staffs
                      this.initStaffs(agency);
                    })
                  })


                this._getHazards()
                this.getNetworkCountryLocation()
                  .then(_ => {
                    // get the country levels values
                    this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(content => {

                        this.countryLevelsValues = content[this.countryLocation];
                        console.log(this.countryLevelsValues)
                        err => console.log(err);
                      });
                  })
                this._getCountryContextIndicators();
                this.getUsersForAssign();

                this.settingService.getCountryModulesSettings(this.networkId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(modules => {
                    console.log(modules)
                    this.modules = modules
                  })

              });
          })
        }
      })

  }

  private initStaffs(agency) {
    this.agencyService.getAllCountryIdsForAgency(agency.$key)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(ids => {
        ids.forEach(id => {
          //get normal staffs
          this.userService.getStaffList(id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(staffs => {
              staffs.forEach(staff => {
                this.userService.getUser(staff.id)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(user => {
                    this.staffMap.set(user.id, user)
                  })
              })
            })
          //get country admin
          this.agencyService.getCountryOffice(id, agency.$key)
            .flatMap(office => {
              return this.userService.getUser(office.adminId)
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(countryAdmin => {
              this.staffMap.set(countryAdmin.id, countryAdmin)
            })
        })
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  changeLocationFilter(location) {
    console.log(location)
    if (location) {
      if (location == 'location') {
        this.locationFilter = -1;
      } else {
        this.locationFilter = location;
      }
    } else {
      return
    }
  }

  changeEventFilter(event) {
    console.log(event)
    if (event) {
      if (event == 'event') {
        this.eventFilter = -1;
      } else {
        this.eventFilter = event;
      }
    } else {
      return
    }
  }

  changeAgencyFilter(agency) {
    console.log(agency)
    if (agency == 'agency') {
      this.agencyFilter = -1;
    } else {
      this.agencyFilter = agency;
    }
  }

  changeIndicatorLevelFilter(indicatorLevel) {
    console.log(indicatorLevel)
    if (indicatorLevel == 'indicator') {
      this.indicatorLevelFilter = -1;
    } else {
      this.indicatorLevelFilter = indicatorLevel;
    }
  }

  private getCountryLocation() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + '/' + this.countryID + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value ? location.$value : 0;
          res(true);
        });
    });
    return promise;
  }

  openSeasonalModal(key) {
    this._getAllSeasons();
    jQuery("#" + key).modal("show");
  }

  _getAllSeasons() {
    let hazardIndex = this.activeHazards.findIndex((hazard) => hazard.hazardScenario == this.hazard);
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

  showSubNationalAreas(areas) {
    for (let area in areas) {
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .subscribe(content => {
          this.countryLevelsValues = content;
          // console.log(this.getLocationName(areas[area]));
          this.setLocationName(areas[area]);
          err => console.log(err);
        });
    }
    jQuery("#show-subnational").modal("show");
  }

  setLocationName(location) {
    if ((location.level2 && location.level2 != -1) && (location.level1 && location.level1 != -1) && location.country) {
      this.level2 = this.countryLevelsValues[location.country]['levelOneValues'][location.level1]['levelTwoValues'][location.level2].value;
      this.level1 = this.countryLevelsValues[location.country]['levelOneValues'][location.level1].value;
      this.countryName = this.translate.instant(Constants.COUNTRIES[location.country]);
      this.subnationalName = this.countryName + ", " + this.level1 + ", " + this.level2;
    } else if ((location.level1 && location.level1 != -1) && location.country) {
      this.level1 = this.countryLevelsValues[location.country]['levelOneValues'][location.level1].value;
      this.countryName = this.translate.instant(Constants.COUNTRIES[location.country]);
      this.subnationalName = this.countryName + ", " + this.level1;
    } else {
      this.countryName = this.translate.instant(Constants.COUNTRIES[location.country]);
      this.subnationalName = this.countryName;
    }
    console.log(this.countryName + ", " + this.level2 + ", " + this.level1)
  }

  private getNetworkCountryLocation() {
    return new Promise((res, rej) => {
      this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((networkCountry: NetworkCountryModel) => {
          this.countryLocation = networkCountry.location
          res(true)
        })
    });
  }

  _getIndicatorFutureTimestamp(indicator) {
    let triggers: any[] = indicator.trigger;
    let trigger = triggers[indicator.triggerSelected];
    if (indicator.updatedAt != null) {
      let updatedAt = new Date(indicator.updatedAt);
      if (trigger.durationType == DetailedDurationType.Hour) {
        return updatedAt.setTime(updatedAt.getTime() + (trigger.frequencyValue * Constants.UTC_ONE_HOUR * 1000));
      } else if (trigger.durationType == DetailedDurationType.Day) {
        return updatedAt.setTime(updatedAt.getTime() + (trigger.frequencyValue * Constants.UTC_ONE_DAY * 1000));
      } else if (trigger.durationType == DetailedDurationType.Week) {
        return updatedAt.setTime(updatedAt.getTime() + (trigger.frequencyValue * 7 * Constants.UTC_ONE_DAY * 1000));
      }
      else if (trigger.durationType == DetailedDurationType.Month) {
        return updatedAt.setMonth(updatedAt.getUTCMonth() + (+trigger.frequencyValue));
      }
      else if (trigger.durationType == DetailedDurationType.Year) {
        return updatedAt.setFullYear(updatedAt.getFullYear() + (+trigger.frequencyValue));
      }
      else {
        // Error
        return updatedAt;
      }
    }
    else {
      return new Date();
    }
  }

  _getCountryContextIndicators() {
    this.af.database.list(Constants.APP_STATUS + "/indicator/" + this.networkCountryId).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {
      indicators.forEach((indicator, key) => {
        console.log(indicator)
        indicator.fromAgency = false;
        this.getLogs(indicator.$key).takeUntil(this.ngUnsubscribe).subscribe((logs: any) => {
          logs.forEach((log, key) => {
            this.getUsers(log.addedBy).takeUntil(this.ngUnsubscribe).subscribe((user: any) => {
              log.addedByFullName = user.firstName + ' ' + user.lastName;
            })
          });
          indicator.logs = this._sortLogsByDate(logs);
        });
      });

      this.indicatorsCC = indicators;

      //gets all relevant country office indicator data from country context
      this.networkService.getAgencyCountryOfficesByNetworkCountry(this.networkCountryId, this.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(officeAgencyMap => {
          console.log(officeAgencyMap)
          officeAgencyMap.forEach((value: string, agencyKey: string) => {

            //get privacy for country
            this.settingService.getPrivacySettingForCountry(value)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(privacy => {
                if (agencyKey == this.agencyId || privacy.riskMonitoring != Privacy.Private) {
                  this.af.database.list(Constants.APP_STATUS + "/indicator/" + value).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {
                    indicators.forEach(indicator => {
                      indicator.fromAgency = true;
                      indicator.countryOfficeCode = value
                      this.agencyService.getAgency(agencyKey)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(agency => {
                          indicator.agency = agency;

                        })
                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                        logs.forEach((log, key) => {
                          this.getUsers(log.addedBy).subscribe((user: any) => {
                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                          })
                        });
                        indicator.logs = this._sortLogsByDate(logs);
                        this.indicatorsCC.push(indicator)
                      });
                    });
                  });
                }
              })
          })
        })
    });
  }






  /**
   * Country Context specific methods. These methods reference the new node
   *  /<environment>/hazardCountryContext/<country_id> will store an 'archived' field.
   *
   * This is separate from the /hazards/ node because it'll mess up the ordering when the
   * node is queried - Unsure why this isn't just accounted for and handled.
   *
   * - Checking if they are archived
   * - Marking is as archived
   *
   * Note: In the dialog when `archived` is confirmed, that method (updateHazardActiveStatus()) will
   * call markCountryContextArchived(_, true) which should trigger the isCountryContextArchived listener to update
   * the global variable countryContextArchived, therefore moving it backwards and forwards
   *
   * CountryContext element is copied into the archived section and enabled / disabled based on this
   * global this.countryContextArchived variable, because I don't know enough about the system to move it into
   * the list of other hazards where it should be (rather than the exception it is at the moment). This should
   * probably be moved into the list
   */
  /// <reference path="updateHazardActiveStatus()" />
  private loadCountryContextIsArchived() {
    console.log(">> Listening for Country Context IsActive");
    this.isCountryContextArchived(this.countryID, (isActive => {
      console.log(">> Listening for Country Context IsActive :: " + isActive);
      this.countryContextIsActive = isActive;
    }));
  }
  private isCountryContextArchived(countryId: string, done: (isActive: boolean) => void) {
    this.af.database.object(Constants.APP_STATUS + "/hazardCountryContext/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null && snap.val().hasOwnProperty("isActive")) {
          done(snap.val().isActive);
        }
        else {
          done(true)
        }
      });
  }
  private markCountryContextArchived(countryId: string, isActive: boolean, done: (error) => void) {
    // isActive = false is the same as archived = true (inverse states)
    this.af.database.object(Constants.APP_STATUS + "/hazardCountryContext/" + countryId + "/isActive")
      .set(isActive)
      .then(_ => {
        done(null);
      })
      .catch(error => {
        done(error);
      });
  }







  _getHazards() {
    this.loadCountryContextIsArchived();
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkCountryId).takeUntil(this.ngUnsubscribe).subscribe((hazards: any) => {
        this.activeHazards = [];
        this.archivedHazards = [];
        console.log(hazards)
        hazards.forEach((hazard: any, key) => {
          hazard.id = hazard.$key;
          if (hazard.hazardScenario != -1) {
            hazard.imgName = this.translate.instant(this.hazardScenario[hazard.hazardScenario]).replace(" ", "_");
          }

          this.getIndicators(hazard.id).subscribe((indicators: any) => {
            indicators.forEach((indicator, key) => {
              console.log(indicator)
              indicator.fromAgency = false;
              this.getLogs(indicator.$key).subscribe((logs: any) => {
                logs.forEach((log, key) => {
                  this.getUsers(log.addedBy).subscribe((user: any) => {
                    log.addedByFullName = user.firstName + ' ' + user.lastName;
                  })
                });
                indicator.logs = this._sortLogsByDate(logs);
              });
            });
            hazard.indicators = indicators;
            hazard.existsOnNetwork = true;
          });

          if (hazard.isActive) {
            this.activeHazards.push(hazard);
            if (hazard.hazardScenario == -1) {
              this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName, {preserveSnapshot: true})
                .takeUntil(this.ngUnsubscribe)
                .subscribe((snap) => {
                  hazard.hazardName = snap.val().name;
                });
            }
          } else {
            this.archivedHazards.push(hazard);
          }


        });
        //gets all relevant country office hazard and indicator data from non-country context hazards
        this.networkService.getAgencyCountryOfficesByNetworkCountry(this.networkCountryId, this.networkId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(officeAgencyMap => {

            officeAgencyMap.forEach((value: string, agencyKey: string) => {

              //get privacy for country
              this.settingService.getPrivacySettingForCountry(value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(privacy => {
                  if (agencyKey == this.agencyId || privacy.riskMonitoring != Privacy.Private) {
                    this.af.database.list(Constants.APP_STATUS + "/hazard/" + value).takeUntil(this.ngUnsubscribe).subscribe((hazards: any) => {
                      hazards.forEach((hazard: any, key) => {
                        hazard.id = hazard.$key;
                        if (hazard.hazardScenario != -1) {
                          hazard.imgName = this.translate.instant(this.hazardScenario[hazard.hazardScenario]).replace(" ", "_");
                        }
                        //check conflict indicator privacy settings
                        if (agencyKey == this.agencyId || !(privacy.conflictIndicators && privacy.conflictIndicators == Privacy.Private && hazard.hazardScenario == this.Hazard_Conflict)) {
                          this.getIndicators(hazard.id).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {
                            indicators.forEach((indicator, key) => {


                              indicator.fromAgency = true;
                              indicator.countryOfficeCode = value
                              this.agencyService.getAgency(agencyKey)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(agency => {
                                  indicator.agency = agency;
                                })
                              this.getLogs(indicator.$key).subscribe((logs: any) => {
                                logs.forEach((log, key) => {
                                  this.getUsers(log.addedBy).subscribe((user: any) => {
                                    log.addedByFullName = user.firstName + ' ' + user.lastName;
                                  })
                                });
                                indicator.logs = this._sortLogsByDate(logs);
                              });
                            });
                            hazard.indicators = indicators;
                            hazard.existsOnNetwork = false;


                            if (hazard.isActive) {

                              var containsHazard = false;
                              var hasIndicators = false;
                              var activeHazardIndex = null;
                              this.activeHazards.forEach((activeHazard, index) => {
                                if (activeHazard.hazardScenario == hazard.hazardScenario) {
                                  if (hazard.hasOwnProperty('indicators') && activeHazard.hasOwnProperty('indicators')) {
                                    containsHazard = true;
                                    hasIndicators = true;
                                    activeHazardIndex = index
                                  } else if (hazard.hasOwnProperty('indicators') && !activeHazard.hasOwnProperty('indicators')) {
                                    containsHazard = true;
                                    activeHazardIndex = index
                                  }
                                }

                              })
                              if (containsHazard) {
                                if (hazard.hasOwnProperty('indicators') && hasIndicators) {


                                  hazard.indicators.forEach(indicator => {

                                    if (this.activeHazards[activeHazardIndex].indicators.map(item => item.$key).indexOf(indicator.$key) == -1) {
                                      this.activeHazards[activeHazardIndex].indicators.push(indicator)
                                    } else {
                                      this.activeHazards[activeHazardIndex].indicators.splice(this.activeHazards[activeHazardIndex].indicators.map(item => item.$key).indexOf(indicator.$key), 1)
                                      this.activeHazards[activeHazardIndex].indicators.push(indicator)
                                    }


                                  })
                                } else if (hazard.hasOwnProperty('indicators') && !hasIndicators) {
                                  hazard.indicators = []
                                  hazard.indicators.forEach(indicator => {

                                    this.activeHazards[activeHazardIndex].indicators.push(indicator)
                                  })
                                }
                                containsHazard = false;
                                hasIndicators = false;
                                activeHazardIndex = null;

                              } else {
                                this.activeHazards.push(hazard);
                                if (hazard.hazardScenario == -1) {
                                  this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName, {preserveSnapshot: true})
                                    .takeUntil(this.ngUnsubscribe)
                                    .subscribe((snap) => {
                                      hazard.hazardName = snap.val().name;
                                    });
                                }
                                containsHazard = false;
                                hasIndicators = false;
                                activeHazardIndex = null;
                              }
                            } else {

                              var containsHazard = false;
                              var hasIndicators = false;
                              var archivedHazardIndex = null;
                              this.archivedHazards.forEach((archivedHazard, index) => {
                                if (archivedHazard.hazardScenario == hazard.hazardScenario) {
                                  if (hazard.hasOwnProperty('indicators') && archivedHazard.hasOwnProperty('indicators')) {
                                    containsHazard = true;
                                    hasIndicators = true;
                                    archivedHazardIndex = index
                                  } else if (hazard.hasOwnProperty('indicators') && !archivedHazard.hasOwnProperty('indicators')) {
                                    containsHazard = true;
                                    archivedHazardIndex = index
                                  }
                                }

                              })
                              if (containsHazard) {
                                if (hazard.hasOwnProperty('indicators') && hasIndicators) {


                                  hazard.indicators.forEach(indicator => {

                                    this.archivedHazards[archivedHazardIndex].indicators.push(indicator)
                                  })
                                } else if (hazard.hasOwnProperty('indicators') && !hasIndicators) {
                                  hazard.indicators = []
                                  hazard.indicators.forEach(indicator => {

                                    this.archivedHazards[archivedHazardIndex].indicators.push(indicator)
                                  })
                                }
                                containsHazard = false;
                                hasIndicators = false;
                                archivedHazardIndex = null;

                              } else {
                                if (hazard.isActive) {
                                  this.archivedHazards.push(hazard);
                                  if (hazard.hazardScenario == -1) {
                                    this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName, {preserveSnapshot: true})
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe((snap) => {
                                        hazard.hazardName = snap.val().name;
                                      });
                                  }
                                } else {
                                  this.archivedHazards.push(hazard);
                                }
                                containsHazard = false;
                                hasIndicators = false;
                                activeHazardIndex = null;
                              }
                            }
                          });
                        }
                      });
                    });
                  }
                })
            })
          })
        res(true);
      });
    });
    return promise;
  }

  changeHazard(hazardId){
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkCountryId + '/' + this.tmpHazardData['ID'])
      .update({editingHazard: true});
    console.log(hazardId, 'in risk monitoring');
    this.router.navigateByUrl("network-country/network-risk-monitoring/add-hazard/" + this.tmpHazardData['ID']);

  }

  getIndicators(hazardID: string) {
    return this.af.database.list(Constants.APP_STATUS + "/indicator/" + hazardID);
  }

  getLogs(indicatorID: string) {
    return this.af.database.list(Constants.APP_STATUS + "/log/" + indicatorID, {
      query: {
        orderByChild: 'timeStamp'
      }
    });
  }

  getUsers(userID: string) {
    return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID);
  }

  deleteHazard(modalID: string) {
    if (!this.tmpHazardData['ID']) {
      console.log('hazardID cannot be empty');
      return false;
    }
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkCountryId + '/' + this.tmpHazardData['ID']).remove().then(() => {
      this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_DELETE_HAZARD', AlertMessageType.Success);
      this.removeTmpHazardID();
    });
    jQuery("#" + modalID).modal("hide");
  }

  collapseAll(mode: string) {
    if (mode == 'expand') {
      jQuery('.Accordion__Content').collapse('show');
    } else {
      jQuery('.Accordion__Content').collapse('hide');
    }
  }

  changeIndicatorState(state: boolean, hazardID: string, indicatorKey: number) {

    var key = hazardID + '_' + indicatorKey;
    if (state) {
      this.isIndicatorUpdate[key] = true;
      return true;
    }
    this.isIndicatorUpdate[key] = false;
  }

  setCheckedTrigger(indicatorID: string, triggerSelected: number) {
    this.indicatorTrigger[indicatorID] = triggerSelected;
    this.previousIndicatorTrigger = triggerSelected
  }

  setClassForIndicator(trigger: number, triggerSelected: number) {
    var indicatorClass = 'btn btn-ghost';
    if (trigger == 0 && trigger == triggerSelected) {
      indicatorClass = 'btn btn-primary';
    }
    if (trigger == 1 && trigger == triggerSelected) {
      indicatorClass = 'btn btn-amber';
    }
    if (trigger == 2 && trigger == triggerSelected) {
      indicatorClass = 'btn btn-red';
    }

    return indicatorClass;
  }

  updateIndicatorStatus(hazardID: string, indicator, indicatorKey: number) {
    const indicatorID = indicator.$key;


    if (!hazardID || !indicatorID) {
      console.log('hazardID or indicatorID cannot be empty');
      return false;
    }

    var triggerSelected = this.indicatorTrigger[indicatorID];
    console.log(triggerSelected)
    var dataToSave = {triggerSelected: triggerSelected, updatedAt: new Date().getTime()};
    dataToSave['dueDate'] = this._getIndicatorFutureTimestamp(indicator); // update the due date

    var urlToUpdate;




    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1,level: triggerSelected};
    let id = hazardID == 'countryContext' ? this.networkCountryId : hazardID;

    if(indicator["timeTracking"]){
      dataToSave["timeTracking"] = indicator["timeTracking"];

      if(indicator.triggerSelected == 0){
        if(!dataToSave["timeTracking"]["timeSpentInGreen"]){
          dataToSave["timeTracking"]["timeSpentInGreen"] = [];
        }
          dataToSave["timeTracking"]["timeSpentInGreen"][dataToSave["timeTracking"]["timeSpentInGreen"].findIndex(x => x.finish == -1)].finish = currentTime

      }
      if(indicator.triggerSelected == 1){
        if(!dataToSave["timeTracking"]["timeSpentInAmber"]){
          dataToSave["timeTracking"]["timeSpentInAmber"] = [];
        }
          dataToSave["timeTracking"]["timeSpentInAmber"][dataToSave["timeTracking"]["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime

      }
      if(indicator.triggerSelected == 2){
        if(!dataToSave["timeTracking"]["timeSpentInRed"]){
          dataToSave["timeTracking"]["timeSpentInRed"] = [];
        }
          dataToSave["timeTracking"]["timeSpentInRed"][dataToSave["timeTracking"]["timeSpentInRed"].findIndex(x => x.finish == -1)].finish = currentTime
      }


      if(triggerSelected == 0){
        if(!dataToSave["timeTracking"]["timeSpentInGreen"]){
          dataToSave["timeTracking"]["timeSpentInGreen"] = [];
        }
        dataToSave["timeTracking"]["timeSpentInGreen"].push(newTimeObject)
      }
      if(triggerSelected == 1){
        if(!dataToSave["timeTracking"]["timeSpentInAmber"]){
          dataToSave["timeTracking"]["timeSpentInAmber"] = [];
        }
        dataToSave["timeTracking"]["timeSpentInAmber"].push(newTimeObject)
      }
      if(triggerSelected == 2){
        if(!dataToSave["timeTracking"]["timeSpentInRed"]){
          dataToSave["timeTracking"]["timeSpentInRed"] = [];
        }
        dataToSave["timeTracking"]["timeSpentInRed"].push(newTimeObject)
      }


    }
    else{

      dataToSave["timeTracking"] = {}
      if(triggerSelected == 0){
        dataToSave["timeTracking"]["timeSpentInGreen"] = []
        dataToSave["timeTracking"]["timeSpentInGreen"].push(newTimeObject)
      }

      if(triggerSelected == 1){
        dataToSave["timeTracking"]["timeSpentInAmber"] = []
        dataToSave["timeTracking"]["timeSpentInAmber"].push(newTimeObject)
      }

      if(triggerSelected == 2){
        dataToSave["timeTracking"]["timeSpentInRed"] = []
        dataToSave["timeTracking"]["timeSpentInRed"].push(newTimeObject)
      }

    }





    if (indicator.countryOfficeCode && hazardID == 'countryContext') {
      urlToUpdate = Constants.APP_STATUS + "/indicator/" + indicator.countryOfficeCode + '/' + indicatorID;
    } else if (hazardID == 'countryContext') {
      urlToUpdate = Constants.APP_STATUS + '/indicator/' + this.networkCountryId + '/' + indicatorID;
    } else {
      urlToUpdate = Constants.APP_STATUS + '/indicator/' + indicator.hazardScenario.key + '/' + indicatorID;
    }


    this.af.database.object(urlToUpdate)
      .update(dataToSave)
      .then(_ => {
        this.changeIndicatorState(false, hazardID, indicatorKey);
        //create log model for pushing - phase 2
        this.networkService.saveIndicatorLogMoreParams(this.previousIndicatorTrigger, triggerSelected, this.uid, indicator.$key).then(()=>this.previousIndicatorTrigger = -1)
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });

  }

  saveLog(indicatorID: string, triggerSelected: number) {
    var log = new LogModel();
    log.content = this.logContent[indicatorID] ? this.logContent[indicatorID] : '';
    log.addedBy = this.uid;
    log.timeStamp = this._getCurrentTimestamp();
    log.triggerAtCreation = triggerSelected;

    this.alertMessage = log.validate();
    if (!this.alertMessage) {
      var dataToSave = log;

      this.af.database.list(Constants.APP_STATUS + '/log/' + indicatorID)
        .push(dataToSave)
        .then(() => {
          this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_ADDED_LOG', AlertMessageType.Success);
          this.logContent[indicatorID] = '';
        }).catch((error: any) => {
        console.log(error, 'You do not have access!')
      });
    }
    return true;
  }

  setTmpHazard(hazardID: string, activeStatus: boolean, hazardScenario: number) {
    console.log('enter set')
    if (!hazardID) {
      console.log('enter false if')
      return false;
    }

    this.tmpHazardData['ID'] = hazardID;
    this.tmpHazardData['activeStatus'] = activeStatus;
    this.tmpHazardData['scenario'] = hazardScenario;
  }

  setTmpLog(logID: string, logData: string, indicatorID: string) {
    if (!logID) {
      return false;
    }

    this.tmpLogData['ID'] = logID;
    this.tmpLogData['content'] = logData;
    this.tmpLogData['indicatorID'] = indicatorID;
  }

  removeTmpHazardID() {
    this.tmpHazardData = [];
  }

  removeTmpLog() {
    this.tmpLogData = [];
  }

  editLog(modalID: string) {

    var dataToUpdate = {content: this.tmpLogData['content']};
    this.af.database.object(Constants.APP_STATUS + '/log/' + this.tmpLogData['indicatorID'] + '/' + this.tmpLogData['ID'])
      .update(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_UPDATE_LOG', AlertMessageType.Success);
        this.removeTmpLog();
        return true;
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });

    jQuery("#" + modalID).modal("hide");
  }

  deleteLog(modalID: string) {
    if (!this.tmpLogData || !this.tmpLogData['ID'] || !this.tmpLogData['indicatorID']) {
      console.log('logID cannot be empty');
      return false;
    }
    this.af.database.object(Constants.APP_STATUS + '/log/' + this.tmpLogData['indicatorID'] + '/' + this.tmpLogData['ID']).remove().then(() => {
      this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_DELETE_LOG', AlertMessageType.Success);
      this.tmpLogData = [];
    });
    jQuery("#" + modalID).modal("hide");
  }

  updateHazardActiveStatus(modalID: string) {

    if (!this.tmpHazardData['ID']) {
      console.log('hazardID cannot be empty!');
      return false;
    }

    if (this.tmpHazardData['ID'] == "countryContext") {
      // this.tmpHazardData['ID'] = this.countryID;
      // Country Context
      this.markCountryContextArchived(this.networkCountryId, this.tmpHazardData['activeStatus'], (error) => {
        if (error == null) {
          this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCESS_UPDATE_HAZARD', AlertMessageType.Success);
          return true;
        }
        else {
          // Errored.
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR', AlertMessageType.Error);
          //TODO: This should have a specific error message relating to hazards - At the moment generic is used because lack of translations
          return true;
        }
      });
      jQuery("#" + modalID).modal("hide");
    }
    else {
      // Normal hazard
      var dataToUpdate = {isActive: this.tmpHazardData['activeStatus']};
      this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkCountryId + '/' + this.tmpHazardData['ID'])
        .update(dataToUpdate)
        .then(_ => {
          this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCESS_UPDATE_HAZARD', AlertMessageType.Success);
          return true;
        }).catch(error => {
        console.log("Message creation unsuccessful" + error);
      });
      jQuery("#" + modalID).modal("hide");
    }

  }

  getTimeStamp(utc: number) {
    let myDate: Date = new Date(utc);
    return myDate;
  }

  _getCurrentTimestamp() {
    var currentTimeStamp = new Date().getTime();
    return currentTimeStamp;
  }

  _sortLogsByDate(array: any) {
    var byDate = array.slice(0);
    var result = byDate.sort(function (a, b) {
      return b.timeStamp - a.timeStamp;
    });

    return result;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  copyIndicator(indicator: any, isContext: boolean, hazard: any) {
    console.log(indicator.$key);
    console.log(this.countryID)
    console.log("isContext: " + isContext);
    console.log(hazard);
    if (isContext) {
      let data = {
        "countryId": this.countryID,
        "agencyId": this.agencyId,
        "systemId": this.systemId,
        "indicatorId": indicator.$key,
        "isContext": isContext,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }
      if (this.isViewingFromExternal) {
        data["isViewingFromExternal"] = true
      }
      if (this.agencyOverview) {
        data["agencyOverview"] = true
        this.router.navigate(["/risk-monitoring/add-indicator/countryContext", data]);
      } else {
        this.router.navigate(["/risk-monitoring/add-indicator/countryContext", data]);
      }

    } else {
      let hazardScenario = hazard.hazardScenario;
      console.log(this.uid)
      console.log(this.UserType)
      this.userService.getCountryId(Constants.USER_PATHS[this.UserType], this.uid)
        .take(1)
        .subscribe(ownCountryId => {
          console.log(ownCountryId);
          this.af.database.list(Constants.APP_STATUS + "/hazard/" + ownCountryId, {
            query: {
              orderByChild: "hazardScenario",
              equalTo: hazardScenario,
              limitToFirst: 1
            }
          })
            .take(1)
            .subscribe(hazards => {
              let activeHazards = hazards.filter(hazard => hazard.isActive == true);
              if (activeHazards.length == 0) {
                console.log("no hazard exist!!");
                this.alertMessage = new AlertMessageModel("No same active hazard exist in your country !");
              } else {
                console.log("do the hazard copy action");
                let passData = {
                  "countryId": this.countryID,
                  "agencyId": this.agencyId,
                  "systemId": this.systemId,
                  "indicatorId": indicator.$key,
                  "hazardId": hazard.$key,
                  "isContext": isContext,
                  "networkId": this.networkId,
                  "networkCountryId": this.networkCountryId
                }
                if (this.isViewingFromExternal) {
                  passData["isViewingFromExternal"] = true
                }
                if (this.agencyOverview) {
                  passData["agencyOverview"] = true
                  this.router.navigate(["/risk-monitoring/add-indicator/" + hazards[0].$key, passData]);
                } else {
                  this.router.navigate(["/risk-monitoring/add-indicator/" + hazards[0].$key, passData]);
                }
              }
            });
        });
    }
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  setExportLog(logs: any[]) {
    this.logsToExport = logs;
    console.log(this.logsToExport);
  }

  selectDate(value, dateType) {
    if (dateType === 'fromDate') {
      this.fromDateTimeStamp = moment(value).startOf("day").valueOf();
    } else {
      this.toDateTimeStamp = moment(value).endOf("day").valueOf();
    }
  }

  exportLog(logs: any[]) {
    var doc = new jsPDF();
    doc.setFontType("normal");
    doc.setFontSize("12");

    var totalPageHeight = doc.internal.pageSize.height;
    var pageHeight = totalPageHeight - 20;

    let x = 10;
    let y = 10;

    logs.forEach(log => {
      if ((!this.fromDate || log['timeStamp'] >= this.fromDateTimeStamp) && (!this.toDate || log['timeStamp'] <= this.toDateTimeStamp)) {
        if (y > pageHeight) {
          y = 10;
          doc.addPage();
        }
        doc.text(x, y += 10, this.translate.instant('RISK_MONITORING.EXPORT_LOG.DATE') + ' ' + moment(log['timeStamp']).format("DD/MM/YYYY"));

        if (y > pageHeight) {
          y = 10;
          doc.addPage();
        }
        doc.text(x, y += 10, this.translate.instant('RISK_MONITORING.EXPORT_LOG.INDICATOR_STATUS') + ' ' + this.translate.instant(Constants.INDICATOR_STATUS[log.triggerAtCreation]));

        if (y > pageHeight) {
          y = 10;
          doc.addPage();
        }
        doc.text(x, y += 10, this.translate.instant('RISK_MONITORING.EXPORT_LOG.AUTHOR') + ' ' + log.addedByFullName);

        let message = doc.splitTextToSize(log['content'], 180);
        message.forEach((m, index) => {
          if (y > pageHeight) {
            y = 10;
            doc.addPage();
          }
          doc.text(x, y += 10, index === 0 ? this.translate.instant('RISK_MONITORING.EXPORT_LOG.MESSAGE') + ' ' + m : m);
        })

        doc.text(x, y += 10, ' ');
      }
    });

    // Save the PDF
    doc.save('logs.pdf');
  }

  sourceClick(source) {
    console.log(source.link);
    let url = source.link;
    let pattern = /^(http|https)/;
    if (!pattern.test(url)) {
      url = "http://" + url;
    }
    this.windowService.getNativeWindow().open(url);
  }

  greenSelected(key) {
    this.indicatorTrigger[key] = 0;
  }

  amberSelected(key) {
    this.indicatorTrigger[key] = 1;
  }

  redSelected(key) {
    this.indicatorTrigger[key] = 2;
  }

  assignIndicatorTo(hazard, indicator) {
    console.log(indicator);
    this.assignedHazard = hazard;
    this.assignedIndicator = indicator;
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
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((data: any) => {
        if (data.adminId) {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).takeUntil(this.ngUnsubscribe).subscribe((user: ModelUserPublic) => {
            var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
            this.usersForAssign.push(userToPush);
          });
        }
      });

      //Obtaining other staff data
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((data: {}) => {
        for (let userID in data) {
          if (!userID.startsWith('$')) {
            this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).takeUntil(this.ngUnsubscribe).subscribe((user: ModelUserPublic) => {
              var userToPush = {userID: userID, name: user.firstName + " " + user.lastName};
              this.usersForAssign.push(userToPush);
            });
          }
        }
      });
    }
  }

  saveAssignedUser() {
    jQuery("#assignIndicator").modal("hide");
    if (this.assignedHazard === "countryContext") {
      this.assignedHazard = this.countryID;
    }
    let data = {};
    data["/indicator/" + this.assignedHazard + "/" + this.assignedIndicator.$key + "/assignee"] = this.assignedUser;
    this.af.database.object(Constants.APP_STATUS).update(data).then(() => {
      this.assignedHazard = null;
      this.assignedIndicator = null;
      this.assignedUser = "undefined";
    });
  }

  createNewHazardFromCountry(hazard) {
    var newHazard = {}
    newHazard['timeCreated'] = this._getCurrentTimestamp()
    newHazard['existsOnNetwork'] = hazard.existsOnNetwork
    newHazard['hazardScenario'] = hazard.hazardScenario
    newHazard['isActive'] = hazard.isActive
    newHazard['isSeasonal'] = hazard.isSeasonal
    newHazard['risk'] = hazard.risk
    console.log(newHazard)

    console.log(hazard)
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkCountryId)
      .push(newHazard)
      .then((hazard) => {

        this.router.navigate(this.networkViewValues ? ['/network-country/network-risk-monitoring/add-indicator/' + hazard.key, this.networkViewValues] : ['/network-country/network-risk-monitoring/add-indicator/' + hazard.key])
      })
  }

}
