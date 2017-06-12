import {Component, OnInit} from '@angular/core';
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";
import {AlertMessageType} from "../../utils/Enums";
import {AlertMessageModel} from '../../model/alert-message.model';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
    selector: 'app-external-partner-response-plan',
    templateUrl: './external-partner-response-plan.component.html',
    styleUrls: ['./external-partner-response-plan.component.css']
})
export class ExternalPartnerResponsePlan implements OnInit {

    private uid: string;
    private token: any;
    private countryID: string;
    private responsePlanID: string;
    private currentUnixTime = new Date().getTime();

    private alertMessageType = AlertMessageType;
    private alertMessage: AlertMessageModel = null;

    constructor(
        private subscriptions: RxHelper,
        private af: AngularFire,
        private router: Router,
        private route: ActivatedRoute,
        private afAuth: AngularFireAuth
    ) {

    }

    ngOnInit() {
        this.initData();
    }


    initData() {
        let subscription = this.route.params.subscribe((params: Params) => {
            this.token = params['token'] ? params['token'] : false;
            this.countryID = params['countryID'] ? params['countryID'] : false;
            this.responsePlanID = params['responsePlanID'] ? params['responsePlanID'] : false;

            if (!this.token) {
                /* if token no in the get params */
                console.log('error, token cannot be empty!');
                return false;
            }

            this._checkToken().then((tokenState: boolean) => {
                if (!tokenState) {
                    this.alertMessage = new AlertMessageModel('EXTERNAL_PARTNER.RESPONSE_PLAN.BAD_TOKEN', AlertMessageType.Error);
                    return false;
                } else {
                    this._authAnonymousUser();
                }
            });
            this._checkResponsePlanData();
        });
        this.subscriptions.add(subscription);
    }

    _checkToken() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/usersTmp/" + this.token).subscribe((tokenData: any) => {

                if (tokenData.$value === null) {
                    /* If token doesn't exist */
                    res(false);
                }

                if (this.currentUnixTime < tokenData.expireTime && tokenData.isActive) {
                    /* If token is okay */
                    res(true);
                } else if (this.currentUnixTime > tokenData.expireTime) {
                    /* If the expiration date has expired */
                    var dataToUpdate = {isActive: false};
                    this._updateTokenInfo(dataToUpdate);
                    res(false);
                } else if (!tokenData.isActive) {
                    res(false);
                }

            });
            this.subscriptions.add(subscription);
        });
        return promise;
    }

    _updateTokenInfo(dataToUpdate: any) {
        this.af.database.object(Constants.APP_STATUS + '/usersTmp/' + this.token).update(dataToUpdate).then(() => {
            console.log('success update');
        }, error => {
            console.log(error.message);
        });
    }

    _checkResponsePlanData() {
        /* check response plan data, if response plan data no correct, hide approve\reject block */
        console.log('!!!!!!!!!');
        //this.countryID
        //this.responsePlanID
        // query  - responsePlan/countryID/responsePlanID

                }

    _authAnonymousUser() {
        this.af.auth.login({
            method: AuthMethods.Anonymous,
            provider: AuthProviders.Anonymous
        });
    }

    _leavePage() {
        /* event leave from this page, logout user and redirect to login page  */
        console.log('!!!!');
        this.af.auth.logout().then(() => {
            this.router.navigate(['/login']);
        });
        }

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }
}