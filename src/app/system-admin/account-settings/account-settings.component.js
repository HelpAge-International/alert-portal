"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var user_public_model_1 = require("../../model/user-public.model");
var rxjs_1 = require("rxjs");
var CustomValidator_1 = require("../../utils/CustomValidator");
var AccountSettingsComponent = (function () {
    function AccountSettingsComponent(af, router) {
        this.af = af;
        this.router = router;
        this.successInactive = true;
        this.successMessage = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
        this.errorInactive = true;
        this.alerts = {};
        this.systemAdminTitle = 0;
        this.PersonTitle = Constants_1.Constants.PERSON_TITLE;
        this.personTitleList = [Enums_1.PersonTitle.Mr, Enums_1.PersonTitle.Mrs, Enums_1.PersonTitle.Miss, Enums_1.PersonTitle.Dr, Enums_1.PersonTitle.Prof];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    AccountSettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.authState = auth;
                _this.uid = auth.uid;
                console.log("System admin uid: " + _this.uid);
                _this.loadSystemAdminData(_this.uid);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    AccountSettingsComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    AccountSettingsComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.validate()) {
            if (this.userPublic) {
                var editedUser = new user_public_model_1.ModelUserPublic(this.systemAdminFirstName, this.systemAdminLastName, this.systemAdminTitle, this.systemAdminEmail);
                editedUser.phone = this.systemAdminPhone;
                var noChanges = editedUser.title == this.userPublic.title && editedUser.firstName == this.userPublic.firstName && editedUser.lastName == this.userPublic.lastName
                    && editedUser.email == this.userPublic.email && editedUser.phone == this.userPublic.phone;
                if (noChanges) {
                    this.errorMessage = 'GLOBAL.NO_CHANGES_MADE';
                    this.showAlert(true);
                }
                else {
                    this.authState.auth.updateEmail(this.systemAdminEmail).then(function (_) {
                        _this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + _this.uid).update(editedUser).then(function () {
                            _this.showAlert(false);
                        }, function (error) {
                            _this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                            _this.showAlert(true);
                            console.log(error.message);
                        });
                    });
                }
            }
        }
        else {
            this.showAlert(true);
        }
    };
    AccountSettingsComponent.prototype.loadSystemAdminData = function (uid) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (systemAdmin) {
            _this.userPublic = systemAdmin;
            _this.systemAdminTitle = systemAdmin.title;
            _this.systemAdminFirstName = systemAdmin.firstName;
            _this.systemAdminLastName = systemAdmin.lastName;
            _this.systemAdminEmail = systemAdmin.email;
            _this.systemAdminPhone = systemAdmin.phone;
        });
    };
    AccountSettingsComponent.prototype.showAlert = function (error) {
        var _this = this;
        if (error) {
            this.errorInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function () {
                _this.errorInactive = true;
            });
        }
        else {
            this.successInactive = false;
            rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function () {
                _this.successInactive = true;
            });
        }
    };
    /**
     * Returns false and specific error messages-
     * @returns {boolean}
     */
    AccountSettingsComponent.prototype.validate = function () {
        this.alerts = {};
        if (!(this.systemAdminFirstName)) {
            this.alerts[this.systemAdminFirstName] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME';
            return false;
        }
        else if (!(this.systemAdminLastName)) {
            this.alerts[this.systemAdminLastName] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME';
            return false;
        }
        else if (!(this.systemAdminEmail)) {
            this.alerts[this.systemAdminEmail] = true;
            this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_EMAIL';
            return false;
        }
        else if (!CustomValidator_1.CustomerValidator.EmailValidator(this.systemAdminEmail)) {
            this.alerts[this.systemAdminEmail] = true;
            this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
            return false;
        }
        return true;
    };
    return AccountSettingsComponent;
}());
AccountSettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-account-settings',
        templateUrl: './account-settings.component.html',
        styleUrls: ['./account-settings.component.css']
    })
], AccountSettingsComponent);
exports.AccountSettingsComponent = AccountSettingsComponent;
