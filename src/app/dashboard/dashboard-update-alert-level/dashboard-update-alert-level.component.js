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
var Subject_1 = require("rxjs/Subject");
var actions_service_1 = require("../../services/actions.service");
var affectedArea_model_1 = require("../../model/affectedArea.model");
var Enums_1 = require("../../utils/Enums");
var DashboardUpdateAlertLevelComponent = (function () {
    function DashboardUpdateAlertLevelComponent(af, router, route, alertService) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.alertService = alertService;
        this.HAZARDS = Constants_1.Constants.HAZARD_SCENARIOS;
        this.COUNTRIES = Constants_1.Constants.COUNTRIES;
        this.ngUnsubscribe = new Subject_1.Subject();
        this.geoMap = new Map();
        this.temp = [];
    }
    DashboardUpdateAlertLevelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.route.params
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (param) {
                    if (param['id']) {
                        _this.alertId = param['id'];
                        _this.countryId = param['countryId'];
                        _this.isDirector = param['isDirector'];
                        _this.loadAlert(_this.alertId, _this.countryId);
                    }
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    DashboardUpdateAlertLevelComponent.prototype.loadAlert = function (alertId, countryId) {
        var _this = this;
        this.alertService.getAlert(alertId, countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (alert) {
            _this.loadedAlert = alert;
            _this.estimatedPopulation = _this.loadedAlert.estimatedPopulation;
            _this.infoNotes = _this.loadedAlert.infoNotes;
            _this.reasonForRedAlert = _this.loadedAlert.reasonForRedAlert;
            _this.preAlertLevel = _this.loadedAlert.alertLevel;
            _this.loadedAlert.affectedAreas.forEach(function (area) {
                _this.alertService.getAllLevelInfo(area.affectedCountry)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (geoInfo) {
                    _this.geoMap.set(area.affectedCountry, geoInfo);
                });
            });
        });
    };
    DashboardUpdateAlertLevelComponent.prototype.addNewArea = function () {
        var area = new affectedArea_model_1.ModelAffectedArea();
        this.loadedAlert.affectedAreas.push(area);
    };
    DashboardUpdateAlertLevelComponent.prototype.removeArea = function (index) {
        console.log(index);
        var temp = [];
        for (var i = 0; i < this.loadedAlert.affectedAreas.length; i++) {
            if (i != index) {
                temp.push(this.loadedAlert.affectedAreas[i]);
            }
        }
        this.loadedAlert.affectedAreas = temp;
    };
    DashboardUpdateAlertLevelComponent.prototype.selectedAlertLevel = function (selection) {
        this.loadedAlert.alertLevel = selection;
    };
    DashboardUpdateAlertLevelComponent.prototype.changeCountry = function (index, value) {
        this.loadedAlert.affectedAreas[index].affectedCountry = this.COUNTRIES.indexOf(value);
    };
    DashboardUpdateAlertLevelComponent.prototype.changeLevel1 = function (index, value) {
        this.loadedAlert.affectedAreas[index].affectedLevel1 = Number(value);
    };
    DashboardUpdateAlertLevelComponent.prototype.changeLevel2 = function (index, value) {
        this.loadedAlert.affectedAreas[index].affectedLevel2 = Number(value);
    };
    DashboardUpdateAlertLevelComponent.prototype.submit = function () {
        this.loadedAlert.estimatedPopulation = this.estimatedPopulation;
        this.loadedAlert.reasonForRedAlert = this.reasonForRedAlert;
        this.loadedAlert.infoNotes = this.infoNotes;
        this.loadedAlert.timeUpdated = Date.now();
        this.loadedAlert.updatedBy = this.uid;
        if (this.loadedAlert.alertLevel != this.preAlertLevel && this.loadedAlert.alertLevel == Enums_1.AlertLevels.Red) {
            if (this.isDirector) {
                this.loadedAlert.approvalStatus = Enums_1.AlertStatus.Approved;
            }
            else {
                this.loadedAlert.approvalStatus = Enums_1.AlertStatus.WaitingResponse;
            }
        }
        this.alertService.updateAlert(this.loadedAlert, this.countryId, this.loadedAlert.id);
    };
    DashboardUpdateAlertLevelComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.alertService.unSubscribeNow();
    };
    return DashboardUpdateAlertLevelComponent;
}());
DashboardUpdateAlertLevelComponent = __decorate([
    core_1.Component({
        selector: 'app-dashboard-update-alert-level',
        templateUrl: './dashboard-update-alert-level.component.html',
        styleUrls: ['./dashboard-update-alert-level.component.css'],
        providers: [actions_service_1.ActionsService]
    })
], DashboardUpdateAlertLevelComponent);
exports.DashboardUpdateAlertLevelComponent = DashboardUpdateAlertLevelComponent;
