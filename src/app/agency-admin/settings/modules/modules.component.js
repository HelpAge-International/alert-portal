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
var Enums_1 = require("../../../utils/Enums");
var rxjs_1 = require("rxjs");
var ModulesComponent = (function () {
    function ModulesComponent(af, router) {
        this.af = af;
        this.router = router;
        this.MODULE_NAME = Constants_1.Constants.MODULE_NAME;
        this.Public = Enums_1.Privacy.Public;
        this.Private = Enums_1.Privacy.Private;
        this.Network = Enums_1.Privacy.Network;
        this.uid = "";
        this.modules = [];
        this.saved = false;
        this.alertMessage = "Message";
        this.alertSuccess = true;
        this.alertShow = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    ModulesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/module/' + _this.uid)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    _this.modules = _;
                    _.map(function (module) {
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
    ModulesComponent.prototype.ngOnDestroy = function () {
        try {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    ModulesComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    ModulesComponent.prototype.changePrivacy = function (moduleId, privacy) {
        this.modules[moduleId].privacy = privacy;
    };
    ModulesComponent.prototype.changeStatus = function (moduleId, status) {
        this.modules[moduleId].status = status;
    };
    ModulesComponent.prototype.cancelChanges = function () {
        this.ngOnInit();
    };
    ModulesComponent.prototype.saveChanges = function () {
        var _this = this;
        var moduleItems = {};
        var modules = this.modules.map(function (module, index) {
            moduleItems[index] = _this.modules[index];
            return _this.modules[index];
        });
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/module/')
            .update(this.uid, moduleItems)
            .then(function (_) {
            if (!_this.alertShow) {
                _this.saved = true;
                _this.alertSuccess = true;
                _this.alertShow = true;
                _this.alertMessage = "Module Settings succesfully saved!";
            }
        })
            .catch(function (err) { return console.log(err, 'You do not have access!'); });
    };
    ModulesComponent.prototype.onAlertHidden = function (hidden) {
        this.alertShow = !hidden;
        this.alertSuccess = true;
        this.alertMessage = "";
    };
    return ModulesComponent;
}());
ModulesComponent = __decorate([
    core_1.Component({
        selector: 'app-modules',
        templateUrl: './modules.component.html',
        styleUrls: ['./modules.component.css']
    })
], ModulesComponent);
exports.ModulesComponent = ModulesComponent;
