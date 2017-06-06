import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActionsService} from "../services/actions.service";
import * as moment from "moment";
import {AgencyService} from "../services/agency-service.service";
import {UserService} from "../services/user.service";
import {UserType} from "../utils/Enums";

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css'],
  providers: [ActionsService, AgencyService]
})

export class DirectorComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;

  private actionsToday = [];
  private actionsThisWeek = [];
  private indicatorsToday = [];
  private indicatorsThisWeek = [];
  private approvalPlans = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryIds: string[] = [];


  constructor(private af: AngularFire, private router: Router, private actionService: ActionsService, private userService: UserService) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.userService.getUserType(this.uid)
          .flatMap(userType => {
            return this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid);
          })
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencyId => {
            this.agencyId = agencyId;
            this.loadData();
          });
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  planReview(planId, countryId) {
    this.router.navigate(["/dashboard/review-response-plan", {
      "id": planId,
      "countryId": countryId,
      "isDirector": true
    }]);
  }

  /**
   * Private functions
   */

  private loadData() {
    // TODO -
    this.userService.getAllCountryIdsForAgency(this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryIds => {
        this.countryIds = countryIds;
        this.initData();
      });
  }

  private initData() {
    let startOfToday = moment().startOf("day").valueOf();
    let endOfToday = moment().endOf("day").valueOf();

    this.countryIds.forEach(countryId => {

      //for each couyntry do following
      this.actionService.getActionsDueInWeek(countryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(actions => {
          this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday).concat(this.actionsToday);
          this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday).concat(this.actionsThisWeek);
        });

      this.actionService.getIndicatorsDueInWeek(countryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(indicators => {
          let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
          let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
          if (dayIndicators.length > 0) {
            dayIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsToday)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsToday);
                if (index != -1) {
                  this.indicatorsToday[index] = indicator;
                }
              } else {
                this.indicatorsToday.push(indicator);
              }
            });
          }
          if (weekIndicators.length > 0) {
            weekIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsThisWeek)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsThisWeek);
                if (index != -1) {
                  this.indicatorsThisWeek[index] = indicator;
                }
              } else {
                this.indicatorsThisWeek.push(indicator);
              }
            });
          }
        });

      this.actionService.getResponsePlanFoGlobalDirectorToApproval(countryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(plans => {
          this.approvalPlans = this.approvalPlans.concat(plans);
          console.log(this.approvalPlans);
        });

    });

  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
