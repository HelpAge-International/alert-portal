"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../../utils/Constants");
var rxjs_1 = require("rxjs");
var AgencyAdminSettingsResponsePlanComponent = (function () {
    function AgencyAdminSettingsResponsePlanComponent(af, router) {
        this.af = af;
        this.router = router;
        this.RESPONSE_PLANS_SECTION_SETTINGS = Constants_1.Constants.RESPONSE_PLANS_SECTION_SETTINGS;
        this.uid = "";
        this.sections = [];
        this.approvals = [];
        this.saved = false;
        this.alertMessage = "Message";
        this.alertSuccess = true;
        this.alertShow = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AgencyAdminSettingsResponsePlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + _this.uid + '/responsePlanSettings/sections')
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    _.map(function (section) {
                        _this.sections[section.$key] = section;
                    });
                });
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + _this.uid + '/responsePlanSettings/approvalHierachy')
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    _.map(function (approval) {
                        _this.approvals[approval.$key] = approval;
                    });
                });
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    AgencyAdminSettingsResponsePlanComponent.prototype.ngOnDestroy = function () {
        try {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    AgencyAdminSettingsResponsePlanComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    AgencyAdminSettingsResponsePlanComponent.prototype.changeStatus = function (sectionId, status) {
        this.sections[sectionId].$value = status;
    };
    AgencyAdminSettingsResponsePlanComponent.prototype.changeApproval = function (approvalId, status) {
        this.approvals[approvalId].$value = status;
    };
    AgencyAdminSettingsResponsePlanComponent.prototype.cancelChanges = function () {
        this.alertSuccess = false;
        this.alertShow = true;
        this.ngOnInit();
    };
    AgencyAdminSettingsResponsePlanComponent.prototype.onAlertHidden = function (hidden) {
        this.alertShow = !hidden;
        this.alertSuccess = true;
        this.alertMessage = "";
    };
    AgencyAdminSettingsResponsePlanComponent.prototype.saveChanges = function () {
        var _this = this;
        var sectionItems = {};
        var sections = this.sections.map(function (section, index) {
            sectionItems[index] = _this.sections[index].$value;
            return _this.sections[index];
        });
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/responsePlanSettings/sections')
            .set(sectionItems)
            .then(function (_) {
            if (!_this.alertShow) {
                _this.saved = true;
                _this.alertSuccess = true;
                _this.alertShow = true;
                _this.alertMessage = "Response Plan Settings succesfully saved!";
            }
        })
            .catch(function (err) { return console.log(err, 'You do not have access!'); });
        var approvalItems = {};
        var approvals = this.approvals.map(function (approval, index) {
            approvalItems[index] = _this.approvals[index].$value;
            return _this.approvals[index];
        });
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/responsePlanSettings/approvalHierachy')
            .set(approvalItems)
            .then(function (_) {
            if (!_this.alertShow) {
                _this.saved = true;
                _this.alertSuccess = true;
                _this.alertShow = true;
                _this.alertMessage = "Response Plan Settings succesfully saved!";
            }
        })
            .catch(function (err) { return console.log(err, 'You do not have access!'); });
    };
    return AgencyAdminSettingsResponsePlanComponent;
}());
AgencyAdminSettingsResponsePlanComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-admin-settings-response-plan',
        templateUrl: './agency-admin-settings-response-plan.component.html',
        styleUrls: ['./agency-admin-settings-response-plan.component.css']
    })
], AgencyAdminSettingsResponsePlanComponent);
exports.AgencyAdminSettingsResponsePlanComponent = AgencyAdminSettingsResponsePlanComponent;
