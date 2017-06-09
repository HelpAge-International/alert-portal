"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var alert_message_model_1 = require("../../model/alert-message.model");
var ExternalPartnerResponsePlan = (function () {
    function ExternalPartnerResponsePlan(subscriptions, af, router, route, afAuth) {
        this.subscriptions = subscriptions;
        this.af = af;
        this.router = router;
        this.route = route;
        this.afAuth = afAuth;
        this.currentUnixTime = new Date().getTime();
        this.alertMessageType = Enums_1.AlertMessageType;
        this.alertMessage = null;
    }
    ExternalPartnerResponsePlan.prototype.ngOnInit = function () {
        this.initData();
    };
    ExternalPartnerResponsePlan.prototype.initData = function () {
        var _this = this;
        var subscription = this.route.params.subscribe(function (params) {
            _this.token = params['token'] ? params['token'] : false;
            _this.countryID = params['countryID'] ? params['countryID'] : false;
            _this.responsePlanID = params['responsePlanID'] ? params['responsePlanID'] : false;
            if (!_this.token) {
                /* if token no in the get params */
                console.log('error, token cannot be empty!');
                return false;
            }
            _this._checkToken().then(function (tokenState) {
                if (!tokenState) {
                    _this.alertMessage = new alert_message_model_1.AlertMessageModel('EXTERNAL_PARTNER.RESPONSE_PLAN.BAD_TOKEN', Enums_1.AlertMessageType.Error);
                    return false;
                }
                else {
                    _this._authAnonymousUser();
                }
            });
            _this._checkResponsePlanData();
        });
        this.subscriptions.add(subscription);
    };
    ExternalPartnerResponsePlan.prototype._checkToken = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/usersTmp/" + _this.token).subscribe(function (tokenData) {
                if (tokenData.$value === null) {
                    /* If token doesn't exist */
                    res(false);
                }
                if (_this.currentUnixTime < tokenData.expireTime && tokenData.isActive) {
                    /* If token is okay */
                    res(true);
                }
                else if (_this.currentUnixTime > tokenData.expireTime) {
                    /* If the expiration date has expired */
                    var dataToUpdate = { isActive: false };
                    _this._updateTokenInfo(dataToUpdate);
                    res(false);
                }
                else if (!tokenData.isActive) {
                    res(false);
                }
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    ExternalPartnerResponsePlan.prototype._updateTokenInfo = function (dataToUpdate) {
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/usersTmp/' + this.token).update(dataToUpdate).then(function () {
            console.log('success update');
        }, function (error) {
            console.log(error.message);
        });
    };
    ExternalPartnerResponsePlan.prototype._checkResponsePlanData = function () {
        /* check response plan data, if response plan data no correct, hide approve\reject block */
        console.log('!!!!!!!!!');
        //this.countryID
        //this.responsePlanID
        // query  - responsePlan/countryID/responsePlanID
    };
    ExternalPartnerResponsePlan.prototype._authAnonymousUser = function () {
        this.af.auth.login({
            method: angularfire2_1.AuthMethods.Anonymous,
            provider: angularfire2_1.AuthProviders.Anonymous
        });
    };
    ExternalPartnerResponsePlan.prototype._leavePage = function () {
        var _this = this;
        /* event leave from this page, logout user and redirect to login page  */
        console.log('!!!!');
        this.af.auth.logout().then(function () {
            _this.router.navigate(['/login']);
        });
    };
    ExternalPartnerResponsePlan.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return ExternalPartnerResponsePlan;
}());
ExternalPartnerResponsePlan = __decorate([
    core_1.Component({
        selector: 'app-external-partner-response-plan',
        templateUrl: './external-partner-response-plan.component.html',
        styleUrls: ['./external-partner-response-plan.component.css']
    })
], ExternalPartnerResponsePlan);
exports.ExternalPartnerResponsePlan = ExternalPartnerResponsePlan;
