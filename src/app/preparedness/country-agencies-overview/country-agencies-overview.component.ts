import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Department, ActionType, ActionLevel, HazardCategory, DurationType} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";

declare var jQuery: any;
@Component({
    selector: 'app-budget',
    templateUrl: './country-agencies-overview.component.html',
    styleUrls: ['./country-agencies-overview.component.css']
})
export class CountryAgenciesOverviewPreparednessComponent implements OnInit {

    private uid: string;
    private countryID: string;
    private agencyID: string;

    private preparednessBudget: any = [];
    private budgetVal: number;

    private minimumPreparednessBudget: any = [];
    private advancedPreparednessBudget: any = [];

    private minimumBudgetTotal: number;
    private advancedBudgetTotal: number;
    private grandTotal: number;

    private department = Constants.DEPARTMENT;
    private departmentList: number[] = [Department.CHS, Department.Finance, Department.HR, Department.Logistics, Department.Programme];

    private actionLevel = Constants.ACTION_LEVEL;
    private actionLevelList: number[] = [ActionLevel.MPA, ActionLevel.APA];

    constructor(private af: AngularFire, private subscriptions: RxHelper, private router: Router) {

    }

    ngOnInit() {
        let subscription = this.af.auth.subscribe(auth => {
            if (auth) {
                this.uid = auth.uid;

            } else {
                this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    }

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }

}
