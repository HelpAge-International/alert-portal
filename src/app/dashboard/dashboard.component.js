"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../utils/Constants");
var rxjs_1 = require("rxjs");
var Enums_1 = require("../utils/Enums");
var actions_service_1 = require("../services/actions.service");
var moment = require("moment");
var Subject_1 = require("rxjs/Subject");
var HazardImages_1 = require("../utils/HazardImages");
var dashboard_seasonal_calendar_component_1 = require("./dashboard-seasonal-calendar/dashboard-seasonal-calendar.component");
var DashboardComponent = (function () {
    function DashboardComponent(af, router, userService, actionService) {
        this.af = af;
        this.router = router;
        this.userService = userService;
        this.actionService = actionService;
        // TODO - Check when other users are implemented
        this.USER_TYPE = 'administratorCountry';
        //TODO - get the real director uid
        this.tempDirectorUid = "1b5mFmWq2fcdVncMwVDbNh3yY9u2";
        this.DashboardType = Enums_1.DashboardType;
        this.DashboardTypeUsed = Enums_1.DashboardType.director;
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.indicatorsToday = [];
        this.indicatorsThisWeek = [];
        this.Countries = Enums_1.Countries;
        this.CountriesList = Constants_1.Constants.COUNTRIES;
        this.AlertLevels = Enums_1.AlertLevels;
        this.AlertStatus = Enums_1.AlertStatus;
        this.hazards = [];
        this.numberOfIndicatorsObject = {};
        this.HazardScenariosList = Constants_1.Constants.HAZARD_SCENARIOS;
        this.countryContextIndicators = [];
        this.ngUnsubscribe = new Subject_1.Subject();
        this.seasonEvents = [];
        this.approveMap = new Map();
        this.approvalPlans = [];
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.loadData();
            }
            else {
                _this.navigateToLogin();
            }
        });
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    DashboardComponent.prototype.getCSSHazard = function (hazard) {
        return HazardImages_1.HazardImages.init().getCSS(hazard);
    };
    DashboardComponent.prototype.isNumber = function (n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    };
    /**
     * Private functions
     */
    DashboardComponent.prototype.loadData = function () {
        var _this = this;
        this.getCountryId().then(function () {
            if (_this.DashboardTypeUsed == Enums_1.DashboardType.default) {
                _this.getAllSeasonsForCountryId(_this.countryId);
            }
            _this.getAlerts();
            _this.getCountryContextIndicators();
            _this.getHazards();
            _this.initData();
        });
        this.getAgencyID().then(function () {
            _this.getCountryData();
        });
    };
    DashboardComponent.prototype.getAllSeasonsForCountryId = function (countryId) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/season/" + countryId, { preserveSnapshot: true })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (snapshot) {
            _this.seasonEvents = [
                dashboard_seasonal_calendar_component_1.ChronolineEvent.create(1, dashboard_seasonal_calendar_component_1.DashboardSeasonalCalendarComponent.spanModelCalendar())
            ];
            var i = 2;
            snapshot.forEach(function (seasonInfo) {
                var x = dashboard_seasonal_calendar_component_1.ChronolineEvent.create(i, seasonInfo.val());
                _this.seasonEvents.push(x);
                i++;
            });
            _this.initCalendar();
            // Init map here after replacing the entire array
        });
    };
    DashboardComponent.prototype.initCalendar = function () {
        // Element is removed and re-added upon a data change
        document.getElementById("target2").innerHTML = "";
        this.chronoline = new Chronoline(document.getElementById("target2"), this.seasonEvents, {
            visibleSpan: DAY_IN_MILLISECONDS * 91,
            animated: true,
            tooltips: true,
            sectionLabelAttrs: { 'fill': '#997e3d', 'font-weight': 'bold' },
            labelInterval: isFifthDay,
            hashInterval: isFifthDay,
            scrollLeft: prevMonth,
            scrollRight: nextMonth,
            // markToday: 'labelBox',
            draggable: true
        });
    };
    DashboardComponent.prototype.getCountryId = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + "/countryId")
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (countryId) {
                _this.countryId = countryId.$value;
                res(true);
            });
        });
        return promise;
    };
    DashboardComponent.prototype.getAgencyID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/" + _this.USER_TYPE + "/" + _this.uid + '/agencyAdmin')
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (agencyIds) {
                _this.agencyAdminUid = agencyIds[0].$key ? agencyIds[0].$key : "";
                res(true);
            });
        });
        return promise;
    };
    DashboardComponent.prototype.initData = function () {
        var _this = this;
        var startOfToday = moment().startOf("day").valueOf();
        var endOfToday = moment().endOf("day").valueOf();
        this.actionService.getActionsDueInWeek(this.countryId, this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (actions) {
            _this.actionsToday = [];
            _this.actionsThisWeek = [];
            _this.actionsToday = actions.filter(function (action) { return action.dueDate >= startOfToday && action.dueDate <= endOfToday; });
            _this.actionsThisWeek = actions.filter(function (action) { return action.dueDate > endOfToday; });
        });
        this.actionService.getIndicatorsDueInWeek(this.countryId, this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (indicators) {
            var dayIndicators = indicators.filter(function (indicator) { return indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday; });
            var weekIndicators = indicators.filter(function (indicator) { return indicator.dueDate > endOfToday; });
            if (dayIndicators.length > 0) {
                dayIndicators.forEach(function (indicator) {
                    if (_this.actionService.isExist(indicator.$key, _this.indicatorsToday)) {
                        var index = _this.actionService.indexOfItem(indicator.$key, _this.indicatorsToday);
                        if (index != -1) {
                            _this.indicatorsToday[index] = indicator;
                        }
                    }
                    else {
                        _this.indicatorsToday.push(indicator);
                    }
                });
            }
            if (weekIndicators.length > 0) {
                weekIndicators.forEach(function (indicator) {
                    if (_this.actionService.isExist(indicator.$key, _this.indicatorsThisWeek)) {
                        var index = _this.actionService.indexOfItem(indicator.$key, _this.indicatorsThisWeek);
                        if (index != -1) {
                            _this.indicatorsThisWeek[index] = indicator;
                        }
                    }
                    else {
                        _this.indicatorsThisWeek.push(indicator);
                    }
                });
            }
        });
        //TODO change temp id to actual uid
        this.responsePlansForApproval = this.actionService.getResponsePlanForDirectorToApproval(this.countryId, this.tempDirectorUid);
        this.responsePlansForApproval.takeUntil(this.ngUnsubscribe).subscribe(function (plans) {
            _this.approvalPlans = plans;
        });
    };
    DashboardComponent.prototype.getCountryData = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.agencyAdminUid + '/' + _this.countryId + "/location")
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (location) {
                _this.countryLocation = location.$value;
                res(true);
            });
        });
        return promise;
    };
    DashboardComponent.prototype.getAlerts = function () {
        if (this.DashboardTypeUsed == Enums_1.DashboardType.default) {
            this.alerts = this.actionService.getAlerts(this.countryId);
        }
        else if (this.DashboardTypeUsed == Enums_1.DashboardType.director) {
            this.alerts = this.actionService.getAlertsForDirectorToApprove(this.tempDirectorUid, this.countryId);
            this.amberAlerts = this.actionService.getAlerts(this.countryId)
                .map(function (alerts) {
                return alerts.filter(function (alert) { return alert.alertLevel == Enums_1.AlertLevels.Amber; });
            });
        }
    };
    DashboardComponent.prototype.getHazards = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/hazard/' + this.countryId)
            .flatMap(function (list) {
            _this.hazards = [];
            var tempList = [];
            list.forEach(function (hazard) {
                _this.hazards.push(hazard);
                tempList.push(hazard);
            });
            return rxjs_1.Observable.from(tempList);
        })
            .flatMap(function (hazard) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + '/indicator/' + hazard.$key);
        })
            .distinctUntilChanged()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (object) {
            _this.numberOfIndicatorsObject[object.$key] = Object.keys(object).length;
        });
    };
    DashboardComponent.prototype.getCountryContextIndicators = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/indicator/' + this.countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (list) {
            list.forEach(function (indicator) {
                _this.countryContextIndicators.push(indicator);
            });
        });
    };
    DashboardComponent.prototype.getCountryCodeFromLocation = function (location) {
        return Enums_1.Countries[location];
    };
    DashboardComponent.prototype.getActionTitle = function (action) {
        return this.actionService.getActionTitle(action);
    };
    DashboardComponent.prototype.getIndicatorName = function (indicator) {
        return this.actionService.getIndicatorTitle(indicator);
    };
    DashboardComponent.prototype.updateAlert = function (alertId, isDirectorAmber) {
        if (this.DashboardTypeUsed == Enums_1.DashboardType.default) {
            this.router.navigate(['/dashboard/dashboard-update-alert-level/', { id: alertId, countryId: this.countryId }]);
        }
        else if (isDirectorAmber) {
            this.router.navigate(['/dashboard/dashboard-update-alert-level/', {
                    id: alertId,
                    countryId: this.countryId,
                    isDirector: true
                }]);
        }
        else {
            var selection = this.approveMap.get(alertId);
            this.approveMap.set(alertId, !selection);
        }
    };
    DashboardComponent.prototype.approveRedAlert = function (alertId) {
        //TODO need to change back to uid!!
        this.actionService.approveRedAlert(this.countryId, alertId, this.tempDirectorUid);
    };
    DashboardComponent.prototype.rejectRedRequest = function (alertId) {
        this.actionService.rejectRedAlert(this.countryId, alertId, this.tempDirectorUid);
    };
    DashboardComponent.prototype.planReview = function (planId) {
        this.router.navigate(["/dashboard/review-response-plan", { "id": planId }]);
    };
    DashboardComponent.prototype.goToAgenciesInMyCountry = function () {
        this.router.navigateByUrl("/country-admin/country-agencies");
    };
    DashboardComponent.prototype.goToFaceToFaceMeeting = function () {
        // this.router.navigateByUrl("/dashboard/facetoface-meeting-request");
        this.router.navigate(["/dashboard/facetoface-meeting-request", { countryId: this.countryId, agencyId: this.agencyAdminUid }]);
    };
    DashboardComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css'],
        providers: [actions_service_1.ActionsService]
    })
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
