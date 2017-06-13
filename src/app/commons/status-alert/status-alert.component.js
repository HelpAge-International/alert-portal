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
var TimerObservable_1 = require("rxjs/observable/TimerObservable");
var RxHelper_1 = require("../../utils/RxHelper");
var StatusAlertComponent = (function () {
    function StatusAlertComponent() {
        this._show = false;
        this.onAlertHidden = new core_1.EventEmitter();
        this._subscriptions = new RxHelper_1.RxHelper;
    }
    Object.defineProperty(StatusAlertComponent.prototype, "show", {
        set: function (show) {
            var _this = this;
            this._show = show;
            this._subscriptions.add(TimerObservable_1.TimerObservable.create(Constants_1.Constants.ALERT_DURATION).subscribe(function (t) {
                _this._show = false;
                _this.onAlertHidden.emit(true);
            }));
        },
        enumerable: true,
        configurable: true
    });
    StatusAlertComponent.prototype.ngOnInit = function () {
    };
    StatusAlertComponent.prototype.ngOnDestroy = function () {
        try {
            this._subscriptions.releaseAll();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    return StatusAlertComponent;
}());
__decorate([
    core_1.Input()
], StatusAlertComponent.prototype, "message", void 0);
__decorate([
    core_1.Input()
], StatusAlertComponent.prototype, "success", void 0);
__decorate([
    core_1.Output()
], StatusAlertComponent.prototype, "onAlertHidden", void 0);
__decorate([
    core_1.Input()
], StatusAlertComponent.prototype, "show", null);
StatusAlertComponent = __decorate([
    core_1.Component({
        selector: 'app-status-alert',
        templateUrl: './status-alert.component.html',
        styleUrls: ['./status-alert.component.css']
    })
], StatusAlertComponent);
exports.StatusAlertComponent = StatusAlertComponent;
