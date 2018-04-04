import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {
  ApprovalStatus, AlertLevels, Countries, UserType, ActionType, ActionLevel,
  HazardScenario
} from "../../utils/Enums";
import {UserService} from "../../services/user.service";
import {AgencyModulesEnabled, PageControlService} from "../../services/pagecontrol.service";
import {PrepActionService, PreparednessAction} from "../../services/prepactions.service";
@Component({
  selector: 'app-local-agency-statistics-ribbon',
  templateUrl: './local-agency-statistics-ribbon.component.html',
  styleUrls: ['./local-agency-statistics-ribbon.component.scss']
})
export class LocalAgencyStatisticsRibbonComponent implements OnInit {

  private uid: string;
  private agencyId: string;
  private systemId: string;

  private AlertLevels = AlertLevels;
  private overallAlertLevel: AlertLevels;

  private agencyLocation: number;
  private CountriesList = Constants.COUNTRIES;
  private count: number = 0;
  private numOfApprovedResponsePlans: number = 0;

  private threshMinAmber: number = 60;
  private threshMinGreen: number = 80;
  private threshAdvAmber: number = 60;
  private threshAdvGreen: number = 80;

  private defaultClockValue: number;
  private defaultClockType: number;

  private minPrepPercentage: number;
  private advPrepPercentage: number;
  private chsPrepPercentage: number;

  private mpaStatusColor: string = "grey";
  private mpaStatusIcon: string = "fa-times";
  private apaStatusColor: string = "grey";
  private apaStatusIcon: string = "fa-times";

  private prepActionService: PrepActionService = new PrepActionService();

  private ranThresh: boolean = false;
  private ranClock: boolean = false;

  private date: number = new Date().getTime();

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userPermissions: AgencyModulesEnabled;
  private hazardRedAlert: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private userService: UserService) {
    this.userPermissions = new AgencyModulesEnabled();
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.systemId = systemId;

      this.downloadThreshold(() => {
        this.downloadDefaultClockSettings(() => {
          this.initAlerts(() => {
            this.getCountryNumber();
            this.getApprovedResponsePlansCount();
            this.prepActionService.addUpdater(() => {
              this.recalculateAll();
            });
            this.prepActionService.initActionsWithInfo(this.af, this.ngUnsubscribe, this.uid, userType, null, null, this.agencyId, this.systemId)
          });
        });
      });
      PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], (isEnabled => {
        this.userPermissions = isEnabled;
      }));
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Utility methods to
   * - download min threshold values from system
   */
  private downloadThreshold(fun: () => void) {
    if (this.ranThresh) { fun(); }
    else {
      this.af.database.object(Constants.APP_STATUS + "/system/" + this.systemId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          if (snap.val().minThreshold.length >= 2) {
            this.threshMinGreen = snap.val().minThreshold[0];
            this.threshMinAmber = snap.val().minThreshold[1];
          }
          if (snap.val().advThreshold.length >= 2) {
            this.threshAdvGreen = snap.val().advThreshold[0];
            this.threshAdvAmber = snap.val().advThreshold[1];
          }
          this.ranThresh = true;
          fun();
        });
    }
  }
  private downloadDefaultClockSettings(fun: () => void) {
    if (this.ranClock) { fun(); }
    else {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/clockSettings/preparedness", {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          if (snap.val() != null) {
            this.defaultClockValue = snap.val().value;
            this.defaultClockType = snap.val().durationType;
            this.ranClock = true;
            fun();
          }
        });
    }
  }

  /**
   * Country information
   */
  private getCountryNumber() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId , {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.agencyLocation = snap.val().country;
        }
      });
  }
  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  /**
   * Response plans counting
   */
  private getApprovedResponsePlansCount() {
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlans: any) => {
        this.numOfApprovedResponsePlans = 0;
        responsePlans.forEach(plan => {
          if(plan.status == ApprovalStatus.Approved){
            this.numOfApprovedResponsePlans = this.numOfApprovedResponsePlans + 1;
          }
        });
      });
  }

  /**
   * Initialisation method for the alerts. Builds the map HazardScenario -> boolean if they're active or not
   */
  private initAlerts(fun: () => void) {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + this.agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.val().alertLevel == AlertLevels.Red) {
            let res: boolean = false;
            for (const userTypes in snapshot.val().approval) {
              for (const thisUid in snapshot.val().approval[userTypes]) {
                if (snapshot.val().approval[userTypes][thisUid] != 0) {
                  res = true;
                }
              }
            }
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, res);
            }
          }
          else {
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, false);
            }
          }
        });
        fun();
      });

    // Populate actions
  }


  /**
   * Preparedness Actions
   */
  private isActionCompleted(action: PreparednessAction) {
    if (action.isArchived == true) {
      return false;
    }
    if (action.level == ActionLevel.APA) {
      if (action.isRedAlertActive(this.hazardRedAlert) && action.isComplete != null) {
        return action.isCompleteAt + action.computedClockSetting > this.date;
      }
    }
    else if (action.level == ActionLevel.MPA) {
      if (action.isComplete != null) {
        return action.isCompleteAt + action.computedClockSetting > this.date;
      }
    }
    return false;
  }

  private recalculateAll() {
    let minTotal: number = 0;
    let minGreen: number = 0;
    let advTotal: number = 0;
    let advGreen: number = 0;
    let chsTotal: number = 0;
    let chsGreen: number = 0;
    for (let x of this.prepActionService.actions) {
      if (x.level == ActionLevel.MPA) {
        if (!x.isArchived) {
          minTotal++;
          if (this.isActionCompleted(x)) {
            minGreen++;
          }
        }
      }
      else if (x.level == ActionLevel.APA) {
        if (!x.isArchived && x.isRedAlertActive(this.hazardRedAlert)) {
          advTotal++;
          if (this.isActionCompleted(x)) {
            advGreen++;
          }
        }
      }
      if (x.type == ActionType.chs) {
        if (!x.isArchived) {
          chsTotal++;
          if (this.isActionCompleted(x)) {
            chsGreen++;
          }
        }
      }
    }
    this.minPrepPercentage = minTotal == 0 ? 0 : (minGreen * 100) / minTotal;
    this.advPrepPercentage = advTotal == 0 ? 0 : (advGreen * 100) / advTotal;
    this.chsPrepPercentage = chsTotal == 0 ? 0 : (chsGreen * 100) / chsTotal;
    this.minPrepPercentage = Math.round(this.minPrepPercentage);
    this.advPrepPercentage = Math.round(this.advPrepPercentage);
    this.chsPrepPercentage = Math.round(this.chsPrepPercentage);
    if (minTotal == 0) {
      this.mpaStatusColor = 'grey';
      this.mpaStatusIcon = 'fa-times';
    }
    else {
      if (this.minPrepPercentage >= this.threshMinGreen) {
        this.mpaStatusColor = 'green';
        this.mpaStatusIcon = 'fa-check';
      }
      else if (this.minPrepPercentage >= this.threshMinAmber) {
        this.mpaStatusColor = 'orange';
        this.mpaStatusIcon = 'fa-ellipsis-h';
      }
      else {
        this.mpaStatusColor = 'red';
        this.mpaStatusIcon = 'fa-times';
      }
    }
    if (advTotal == 0) {
      this.apaStatusColor = 'grey';
      this.apaStatusIcon = 'fa-times';
    }
    else {
      if (this.advPrepPercentage >= this.threshAdvGreen) {
        this.apaStatusColor = 'green';
        this.apaStatusIcon = 'fa-check';
      }
      else if (this.advPrepPercentage >= this.threshAdvAmber) {
        this.apaStatusColor = 'orange';
        this.apaStatusIcon = 'fa-ellipsis-h';
      }
      else {
        this.apaStatusColor = 'red';
        this.apaStatusIcon = 'fa-times';
      }
    }
  }

  goToCHS(){
    if(this.userPermissions.minimumPreparedness){
      this.router.navigate(["/local-agency/preparedness/minimum", {"isCHS": true}]);
    }
  }

}
