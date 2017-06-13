import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
// import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";
import {AlertMessageType} from "../../utils/Enums";
import {AlertMessageModel} from '../../model/alert-message.model';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from "rxjs/Subject";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-external-partner-response-plan',
    templateUrl: './external-partner-response-plan.component.html',
    styleUrls: ['./external-partner-response-plan.component.css']
})
export class ExternalPartnerResponsePlan implements OnInit, OnDestroy {

    private uid:string;
    private token:any;
    private countryID:string;
    private responsePlanID:string;
    private currentUnixTime = new Date().getTime();
    private idAnonimous:any;

    private alertMessageType = AlertMessageType;
    private alertMessage:AlertMessageModel = null;

    private ngUnsubscribe:Subject<void> = new Subject<void>();
    private rejectMsg:any = false;
    private tmpToken:boolean = false;
    private anonymousId:boolean;
    private approvalPartners:any = [];
    private approvalDirectors:any = [];
    private partnerEmail:any;
    private whoApprove:any;
    private whoApproveId:any;

    constructor(// private subscriptions: RxHelper,
        private af:AngularFire,
        private router:Router,
        private route:ActivatedRoute,
        private afAuth:AngularFireAuth,
        private userService:UserService) {
        this.userService.anonymousUserPath = this.route.routeConfig.component.name;
    }

    ngOnInit() {
        this.initData();
        this._planApproval();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    initData() {
        let subscription = this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params:Params) => {
            this.token = params['token'] ? params['token'] : false;
            this.countryID = params['countryID'] ? params['countryID'] : false;
            this.responsePlanID = params['responsePlanID'] ? params['responsePlanID'] : false;
            this.idAnonimous = params['id'] ? params['id'] : false;
            if (!this.token) {
                /* if token no in the get params */
                console.log('error, token cannot be empty!');
                return false;
            }

            this._checkToken().then((tokenState:boolean) => {
                if (!tokenState) {
                    this.alertMessage = new AlertMessageModel('EXTERNAL_PARTNER.RESPONSE_PLAN.BAD_TOKEN', AlertMessageType.Error);
                    return false;
                } else {
                    this._authAnonymousUser();
                }
            });
            // this._checkResponsePlanData();
        });
        // this.subscriptions.add(subscription);
    }

    _checkToken() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/usersTmp/" + this.token).takeUntil(this.ngUnsubscribe).subscribe((tokenData:any) => {
                this.partnerEmail = tokenData.email;
                this._checkResponsePlanData(tokenData);
                if (tokenData.$value === null) {
                    /* If token doesn't exist */
                    res(false);
                }

                if (this.currentUnixTime < tokenData.expireTime && tokenData.isActive) {
                    this.tmpToken = true;
                    /* If token is okay */
                    res(true);
                } else if (this.currentUnixTime > tokenData.expireTime) {
                    /* If the expiration date has expired */
                    this.tmpToken = true;
                    var dataToUpdate = {isActive: false};
                    this._updateTokenInfo(dataToUpdate);
                    res(false);
                } else if (!tokenData.isActive) {
                    res(false);
                }
            });
        });
        return promise;
    }

    _updateTokenInfo(dataToUpdate:any) {
        this.af.database.object(Constants.APP_STATUS + '/usersTmp/' + this.token).update(dataToUpdate).then(() => {
            console.log('success update');
        }, error => {
            console.log(error.message);
        });
    }

    _planApproval() {
        this.af.database.object(Constants.APP_STATUS + '/responsePlan/' + this.countryID + '/' + this.idAnonimous + '/').takeUntil(this.ngUnsubscribe).subscribe((tokenData:any) => {
            for (let approvalUser in tokenData.approval) {
                if (approvalUser == 'partner') {
                    this.approvalPartners.push(approvalUser);
                }
                else {
                    this.approvalDirectors.push(approvalUser);
                }
                for (let idOrganisation in tokenData.approval[approvalUser]) {
                    this._findWhoApprove(idOrganisation, approvalUser);
                }
            }
        }, error => {
            console.log(error.message);
        });
    }

    _findWhoApprove(idOrganisation:any, approvalUser:any) {
        this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation/').takeUntil(this.ngUnsubscribe).subscribe((partnerOrganisation:any) => {
            for (let organisation in partnerOrganisation) {
                if (organisation == idOrganisation && partnerOrganisation[organisation].externalPartner && partnerOrganisation[organisation].email == this.partnerEmail) {
                    this.whoApprove = approvalUser
                    this.whoApproveId = idOrganisation;
                }
            }
        }, error => {
            console.log(error.message);
        });
    }

    _checkResponsePlanData(data:any) {
        this.anonymousId = this.countryID == data.countryID && this.idAnonimous == data.responsePlanID ? true : false;
    }

    _authAnonymousUser() {
        this.af.auth.login({
            method: AuthMethods.Anonymous,
            provider: AuthProviders.Anonymous
        });
    }

    approvePlan(approval, note) {
        var dataToUpdate = {[this.whoApproveId]: approval};
        this.af.database.object(Constants.APP_STATUS + '/responsePlan/' + this.countryID + '/' + this.idAnonimous + '/approval/' + this.whoApprove).update(dataToUpdate).then(() => {
            var updateToken = {isActive: false};
            this.tmpToken = false;
            var isApproved = {isApproved : true};
            this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation/' + this.whoApproveId).update(isApproved);
            var successMessage = approval == 2 ? 'EXTERNAL_PARTNER.RESPONSE_PLAN.SUCCESS_MESSAGE_APPROVE' : 'EXTERNAL_PARTNER.RESPONSE_PLAN.SUCCESS_MESSAGE_REJECT';
            this.alertMessage = new AlertMessageModel(successMessage, AlertMessageType.Success);
            this.af.database.object(Constants.APP_STATUS + '/usersTmp/' + this.token).update(updateToken).then(() => {
            });

        }, error => {
            console.log(error.message);
        });
        if (approval == 3) {
            let saveNote = {content: note, time: new Date().getTime(), uploadBy: this.whoApproveId};
            this.af.database.list(Constants.APP_STATUS + "/note/" + this.countryID)
                .push(saveNote)
                .then(() => {
                    console.log('success save note');
                }).catch((error:any) => {
                console.log(error, 'You do not have access!')
            });
        }
    }

    rejectPlan(count:boolean) {
        this.rejectMsg = count;
    }

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }
}
