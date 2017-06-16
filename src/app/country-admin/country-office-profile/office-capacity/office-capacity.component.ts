import {Component, OnInit, OnDestroy} from '@angular/core';
import {RxHelper} from '../../../utils/RxHelper';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../../services/user.service";
import {Constants} from '../../../utils/Constants';
import {ResponsePlanSectors, AlertMessageType} from '../../../utils/Enums';
import {AlertMessageModel} from '../../../model/alert-message.model';
import {AngularFire} from "angularfire2";
declare var jQuery: any;

@Component({
    selector: 'app-country-office-capacity',
    templateUrl: './office-capacity.component.html',
    styleUrls: ['./office-capacity.component.css']
})

export class CountryOfficeCapacityComponent implements OnInit, OnDestroy {

    private alertMessageType = AlertMessageType;
    private alertMessage: AlertMessageModel = null;
    private uid: string;
    private countryID: string;
    private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
    private ResponsePlanSectorsList: number[] = [
        ResponsePlanSectors.wash,
        ResponsePlanSectors.health,
        ResponsePlanSectors.shelter,
        ResponsePlanSectors.nutrition,
        ResponsePlanSectors.foodSecurityAndLivelihoods,
        ResponsePlanSectors.protection,
        ResponsePlanSectors.education,
        ResponsePlanSectors.campManagement,
        ResponsePlanSectors.other
    ];


    constructor(
        private subscriptions: RxHelper,
        private router: Router,
        private _userService: UserService,
        private af: AngularFire
    ) {

    }

    ngOnDestroy() {

    }

    ngOnInit() {
        const authSubscription = this._userService.getAuthUser().subscribe(user => {
            if (!user) {
                this.router.navigateByUrl(Constants.LOGIN_PATH);
                return;
            }
            this.uid = user.uid;
        });
        this.subscriptions.add(authSubscription);
    }



}




