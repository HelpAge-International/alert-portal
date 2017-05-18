import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {UserService} from "../services/user.service";
import {ActionsService} from "../services/actions.service";
import * as moment from "moment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ActionsService]
})

export class DashboardComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;
  private actionsToday = [];
  private actionsThisWeek = [];
  private indicatorsToday = [];
  private indicatorsThisWeek = [];
  // private systemAdminUid: string;

  constructor(private af: AngularFire, private router: Router,
              private subscriptions: RxHelper, private userService: UserService, private actionService: ActionsService) {
  }

  ngOnInit() {
    let subscriptionAuth = this.userService.getAuthUser()
      .subscribe(auth => {
        if (auth) {
          this.uid = auth.uid;

          let subscriptionCountryId = this.userService.getCountryId(this.USER_TYPE, this.uid)
            .subscribe(countryId => {
              this.countryId = countryId;

              let subscriptionAgencyId = this.userService.getAgencyId(this.USER_TYPE, this.uid)
                .subscribe(agencyId => {
                  this.agencyAdminUid = agencyId;
                  this.initData();
                });
              this.subscriptions.add(subscriptionAgencyId);
            });
          this.subscriptions.add(subscriptionCountryId);

        } else {
          this.router.navigateByUrl(Constants.LOGIN_PATH);
        }
      });
    this.subscriptions.add(subscriptionAuth);
  }

  private initData() {
    let startOfToday = moment().startOf("day").valueOf();
    let endOfToday = moment().endOf("day").valueOf();
    let subscriptionActions = this.actionService.getActionsDueInWeek(this.countryId, this.uid)
      .subscribe(actions => {
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday);
        this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday);
      });
    this.subscriptions.add(subscriptionActions);

    let subscriptionIndicators = this.actionService.getIndicatorsDueInWeek(this.countryId, this.uid)
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
    this.subscriptions.add(subscriptionIndicators);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  getActionTitle(action): string {
    return this.actionService.getActionTitle(action);
  }

  getIndicatorName(indicator): string {
    return this.actionService.getIndicatorTitle(indicator);
  }

}
