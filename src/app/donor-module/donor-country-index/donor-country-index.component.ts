import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlertLevels, Countries} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router, Params, ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import {AgencyService} from "../../services/agency-service.service";

@Component({
  selector: 'app-donor-country-index',
  templateUrl: './donor-country-index.component.html',
  styleUrls: ['./donor-country-index.component.css'],
  providers: [AgencyService]
})

export class DonorCountryIndexComponent implements OnInit, OnDestroy {

  private countryIdReceived: string;
  private agencyIdReceived: string;

  private countryToShow: any;
  private Countries = Countries;

  private uid: string;
  private agencyId: string;
  private systemAdminId: string;

  private countryOffices: any = [];
  private countryIDs: string[] = [];
  private agencyNames: string[] = [];
  private agencyLogoPaths: string[] = [];

  private AlertLevels = AlertLevels;
  private overallAlertLevels: any = [];
  private alertLevelColours: any = [];
  private countResponsePlans: any = [];
  private count: number = 0;
  private minTreshold: any = [];
  private advTreshold: any = [];
  private mpaStatusIcons: any = [];
  private mpaStatusColors: any = [];
  private advStatusIcons: any = [];
  private advStatusColors: any = [];
  private percentageCHS: any = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Filter
  private alertLevelSelected = AlertLevels.All;
  private alertLevels = Constants.ALERT_LEVELS;
  private alertLevelsList: number[] = Constants.ALERT_LEVELS_LIST;

  constructor(private af: AngularFire, private router: Router, private agencyService: AgencyService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;

        this.route.params
          .takeUntil(this.ngUnsubscribe)
          .subscribe((params: Params) => {
            if (params["countryId"]) {
              this.countryIdReceived = params["countryId"];
              this.agencyIdReceived = params["agencyId"];
              this.loadData();
            }
          });
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.agencyService.unSubscribeNow();
  }

  // TODO -
  filter() {

    if (this.alertLevelSelected == AlertLevels.All) {

    } else {

    }
  }

  /*
   Private Functions
   */
  private loadData() {

    this.getCountry();

    this.getAgencyID().then(() => {
      this.getCountryOfficesWithSameLocationsInOtherAgencies().then(_ => {
        this.setupAlertLevelColours();
        this.getResponsePlans();
        this.getSystemAdminID().then(() => {
          this.getSystemThreshold('minThreshold').then((minTreshold: any) => {
            this.minTreshold = minTreshold;
          });
          this.getSystemThreshold('advThreshold').then((advTreshold: any) => {
            this.advTreshold = advTreshold;
          });
        }).then(() => {
          this.getAllActions();
        });
      });
    });
  }

  private getCountry() {

    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyIdReceived + "/" + this.countryIdReceived)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((country) => {
        if (country) {
          this.countryToShow = country;
          console.log(this.countryToShow);
        }
      });
  }

  private getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/donor/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.agencyId = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/donor/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.systemAdminId = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  // Getting all country offices with the same location in other agencies
  private getCountryOfficesWithSameLocationsInOtherAgencies() {
    this.countryOffices = [];
    this.countryIDs = [];
    this.overallAlertLevels = [];
    this.agencyNames = [];
    this.agencyLogoPaths = [];

    let promise = new Promise((res, rej) => {
      this.agencyService.getAllCountryOffices()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencies => {
          agencies = agencies.filter(agency => agency.$key != this.agencyIdReceived);
          agencies.forEach(agency => {
            let countries = Object.keys(agency).filter(key => !(key.indexOf("$") > -1)).map(key => {
              let temp = agency[key];
              temp["countryId"] = key;
              return temp;
            });
            countries = countries.filter(countryItem => countryItem.location == this.countryToShow.location);
            if (countries.length > 0) {

              // Ideally, an agency should only have one country office per country
              this.countryOffices.push(countries[0]);
              console.log('countries[0]');
              console.log(countries[0]);
              console.log(countries[0].alertLevel);
              this.countryIDs.push(countries[0].countryId);
              this.overallAlertLevels[countries[0].countryId] = countries[0].alertLevel;

              this.agencyService.getAgency(agency.$key)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(agency => {
                  this.agencyNames[countries[0].countryId] = agency.name;
                  if (agency.logoPath) {
                    this.agencyLogoPaths[countries[0].countryId] = agency.logoPath;
                  }
                });
              res(true);
            }
          });
        });
    });
    return promise;
  }

  private getSystemThreshold(tresholdType: string) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminId + '/' + tresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((treshold: any) => {
          res(treshold);
        });
    });
    return promise;
  }

  private getResponsePlans() {
    let promise = new Promise((res, rej) => {
      this.countryIDs.forEach((countryID) => {
        this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryID)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((responsePlans: any) => {
            this.getCountApprovalStatus(responsePlans, countryID);
            res(true);
          });
      });
    });
    return promise;
  }

  private getCountApprovalStatus(responsePlans: any, countryID: string) {
    responsePlans.forEach((responsePlan: any) => {
      var approvals = responsePlan.approval;
      this.count = 0;
      this.recursiveParseArray(approvals, countryID);
    });
  }

  private recursiveParseArray(approvals: any, countryID: string) {
    for (let A in approvals) {
      if (typeof (approvals[A]) == 'object') {
        this.recursiveParseArray(approvals[A], countryID);
      } else {
        var approvalStatus = approvals[A];
        if (approvalStatus == 2) {
          this.count = this.count + 1;
          this.countResponsePlans[countryID] = this.count;
        } else {
          this.countResponsePlans[countryID] = 0;
        }
      }
    }
  }

  private getAllActions() {
    let promise = new Promise((res, rej) => {
      this.countryIDs.forEach((countryID) => {
        this.af.database.list(Constants.APP_STATUS + "/action/" + countryID)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((actions: any) => {
            this.getPercenteActions(actions, countryID);
            res(true);
          });
      });
    });
    return promise;
  }

  private getPercenteActions(actions: any, countryId: string) {

    let promise = new Promise((res, rej) => {
      var countAllMinimumActions = 0;
      var countAllAdvancedActions = 0;
      var countCompletedMinimumActions = 0;
      var countCompletedAdvancedActions = 0;
      var countCompletedAllActions = 0;

      actions.forEach((action: any) => {
        if (action.level == 1) {
          countAllMinimumActions = countAllMinimumActions + 1;
          if (action.actionStatus == 2) {
            countCompletedMinimumActions = countCompletedMinimumActions + 1;
          }
        }

        if (action.level == 2) {
          countAllAdvancedActions = countAllAdvancedActions + 1;
          if (action.actionStatus == 2) {
            countCompletedAdvancedActions = countCompletedAdvancedActions + 1;
          }
        }

        if (action.actionStatus == 2) {
          countCompletedAllActions = countCompletedAllActions + 1;
        }
      });

      var percentageMinimumCompletedActions = (countCompletedMinimumActions / countAllMinimumActions) * 100;
      percentageMinimumCompletedActions = percentageMinimumCompletedActions ? percentageMinimumCompletedActions : 0;

      var percentageAdvancedCompletedActions = (countCompletedAdvancedActions / countAllAdvancedActions) * 100;
      percentageAdvancedCompletedActions = percentageAdvancedCompletedActions ? percentageAdvancedCompletedActions : 0;

      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.minTreshold[0].$value) {
        this.mpaStatusColors[countryId] = 'green';
        this.mpaStatusIcons[countryId] = 'fa-check';
      }
      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.minTreshold[1].$value) {
        this.mpaStatusColors[countryId] = 'orange';
        this.mpaStatusIcons[countryId] = 'fa-ellipsis-h';
      }
      if (!percentageMinimumCompletedActions || percentageMinimumCompletedActions < this.minTreshold[1].$value) {
        this.mpaStatusColors[countryId] = 'red';
        this.mpaStatusIcons[countryId] = 'fa-times'
      }

      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.advTreshold[0].$value) {
        this.advStatusColors[countryId] = 'green';
        this.advStatusIcons[countryId] = 'fa-check';
      }
      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.advTreshold[1].$value) {
        this.advStatusColors[countryId] = 'orange';
        this.advStatusIcons[countryId] = 'fa-ellipsis-h';
      }
      if (!percentageAdvancedCompletedActions || percentageAdvancedCompletedActions < this.advTreshold[1].$value) {
        this.advStatusColors[countryId] = 'red';
        this.advStatusIcons[countryId] = 'fa-times';
      }

      this.getActionsBySystemAdmin().then((actions: any) => {
        var countAllActionsSysAdmin = actions.length && actions.length > 0 ? actions.length : 0;
        this.percentageCHS[countryId] = Math.round((countCompletedAllActions / countAllActionsSysAdmin) * 100);
      });

      res(true);
    });

    return promise;
  }

  private setupAlertLevelColours() {

    for (let country in this.overallAlertLevels) {
      if (this.overallAlertLevels[country] == AlertLevels.Green) {
        this.alertLevelColours[country] = 'green';
      } else if (this.overallAlertLevels[country] == AlertLevels.Amber) {
        this.alertLevelColours[country] = 'orange';
      } else if (this.overallAlertLevels[country] == AlertLevels.Red) {
        this.alertLevelColours[country] = 'red';
      } else {
        this.alertLevelColours[country] = 'grey'; // Default
      }
    }
    console.log(this.overallAlertLevels);
  }

  private getActionsBySystemAdmin() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((actions: any) => {
          res(actions);
        });
    });
    return promise;
  }


  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
