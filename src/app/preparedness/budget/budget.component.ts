import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Department, ActionType, ActionLevel, HazardCategory, DurationType} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {AlertMessageType} from "../../utils/Enums";

import {AlertMessageModel} from '../../model/alert-message.model';


declare var jQuery: any;

@Component({
    selector: 'app-budget',
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.css']
})

export class BudgetPreparednessComponent implements OnInit, OnDestroy {
  private UserType: number;

    private alertMessage:AlertMessageModel = null;
    private alertMessageType = AlertMessageType;

    private uid:string;
    private countryID:string;
    private agencyID:string;
    private minimumPreparednessBudget:any;
    private minBudget:any = [];
    private advBudget:any = [];
    private advancedPreparednessBudget:any = [];
    private minimumBudgetTotal:number;
    private advancedBudgetTotal:number;
    private grandTotal:number;
    private departments:Array<string> = [];
    private ngUnsubscribe:Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
    this.generateArray();
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;
      this._loadData();
    });
  }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    savePreparednessBudget() {
        this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/minPreparednessBudget')
            .set(this.minBudget)
            .then(() => {
                console.log('success save MPA budget settings');
            }).catch((error:any) => {
            console.log(error, 'You do not have access!')
        });
        this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/advPreparednessBudget')
            .set(this.advBudget)
            .then(() => {
                console.log('success save APA budget settings');
            }).catch((error:any) => {
            console.log(error, 'You do not have access!')
        });
        this.alertMessage = new AlertMessageModel('SYSTEM_ADMIN.ACTIONS.EDIT_BUTTON_TEXT', AlertMessageType.Success);
    }

    generateArray() {
        this.departments.forEach((val, key) => {
            this.minBudget[val] = [];
            this.minBudget[val]['value'] = '';
            this.minBudget[val]['narrative'] = '';
            this.advBudget[val] = [];
            this.advBudget[val]['value'] = '';
            this.advBudget[val]['narrative'] = '';
        });
    }

    setTotal(level:string) {
        if (level == 'MPA') {
            this.minimumBudgetTotal = 0;
            for (let x in this.minBudget) {
                var value = !this.minBudget[x].value ? 0 : parseFloat(this.minBudget[x].value);
                if (value && value > 0) {
                    this.minimumBudgetTotal = this.minimumBudgetTotal + value;
                }
            }
        }
        if (level == 'APA') {
            this.advancedBudgetTotal = 0;
            for (let x in this.advBudget) {
                var value = !this.advBudget[x].value ? 0 : parseFloat(this.advBudget[x].value);
                if (value && value > 0) {
                    this.advancedBudgetTotal = this.advancedBudgetTotal + value;
                }
            }
        }
        this.setTotalAll();
    }

    setTotalAll() {
        var minimumTotal = this.minimumBudgetTotal && this.minimumBudgetTotal > 0 ? this.minimumBudgetTotal : 0;
        var advancedTotal = this.advancedBudgetTotal && this.advancedBudgetTotal > 0 ? this.advancedBudgetTotal : 0;
        var grandTotal = minimumTotal + advancedTotal;
        this.grandTotal = grandTotal;
    }

    _getAgencyID() {
        let promise = new Promise((res, rej) => {
            this.af.database.list(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/agencyAdmin')
                .takeUntil(this.ngUnsubscribe)
                .subscribe((agencyIDs:any) => {
                    this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
                    res(true);
                });
        });
        return promise;
    }

    _getCountryID() {
        let promise = new Promise((res, rej) => {
            this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId')
                .takeUntil(this.ngUnsubscribe)
                .subscribe((countryID:any) => {
                    this.countryID = countryID.$value ? countryID.$value : "";
                    res(true);
                });
        });
        return promise;
    }


    _getBudgetSettings() {
        this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((budgetSettings:any) => {
                if (budgetSettings && budgetSettings.minPreparednessBudget) {
                    this.minimumPreparednessBudget = budgetSettings.minPreparednessBudget;
                    this.setTotal('MPA');
                }
                if (budgetSettings && budgetSettings.advPreparednessBudget) {
                    this.advancedPreparednessBudget = budgetSettings.advPreparednessBudget;
                    this.setTotal('APA');
                }
            });
    }

    _loadData() {
        this._getAgencyID().then(() => {
            this._getCountryID().then(() => {
                this._getDepartments().then(() => {
                    this._getMinBudget();
                    this._getAdvBudget();
                    this._getBudgetSettings();
                })
            });
        });
    }

    _getDepartments() {
        let promise = new Promise((res, rej) => {
            this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyID + '/departments/')
                .takeUntil(this.ngUnsubscribe)
                .subscribe((departments:any) => {
                    for (let department in departments) {
                        if (department != '$key' && department != '$exists') {
                            this.departments.push(department);
                        }
                    }
                    this.generateArray();
                    res(true);
                });
        });
        return promise;
    }

    _getMinBudget() {
        this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/minPreparednessBudget')
            .takeUntil(this.ngUnsubscribe)
            .subscribe((minBudget:any) => {
                for (let val in this.minBudget) {
                    for (let obj in minBudget) {
                        if (val == obj) {
                            this.minBudget[val].value = minBudget[obj].value
                            this.minBudget[val].narrative = minBudget[obj].narrative
                        }
                    }
                }
            });
    }

    _getAdvBudget() {
        this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID + '/advPreparednessBudget')
            .takeUntil(this.ngUnsubscribe)
            .subscribe((advBudget:any) => {
                for (let val in this.advBudget) {
                    for (let obj in advBudget) {
                        if (val == obj) {
                            this.advBudget[val].value = advBudget[obj].value
                            this.advBudget[val].narrative = advBudget[obj].narrative
                        }
                    }
                }
            });
    }

    _keyPress(event:any) {
        const pattern = /[0-9\.\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar) && event.charCode) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }
}
