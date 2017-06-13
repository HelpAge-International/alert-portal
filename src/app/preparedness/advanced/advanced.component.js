"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var rxjs_1 = require("rxjs");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var RxHelper_1 = require("../../utils/RxHelper");
var minimum_component_1 = require("../minimum/minimum.component");
var AdvancedPreparednessComponent = (function (_super) {
    __extends(AdvancedPreparednessComponent, _super);
    function AdvancedPreparednessComponent(firebaseApp, af, router, route, storage) {
        var _this = _super.call(this, firebaseApp, af, router, route, storage) || this;
        _this.af = af;
        _this.router = router;
        _this.route = route;
        _this.storage = storage;
        _this.actionLevel = Enums_1.ActionLevel.APA;
        _this.hazards = new rxjs_1.Subject();
        _this.alerts = new rxjs_1.Subject();
        _this.alertFilter = {};
        _this.subscriptions = new RxHelper_1.RxHelper;
        _this.firebase = firebaseApp;
        _this.docFilterSubject = new BehaviorSubject_1.BehaviorSubject(undefined);
        _this.docFilter = {
            query: {
                orderByChild: "module",
                equalTo: _this.docFilterSubject
            }
        };
        _this.alertFilterSubject = new BehaviorSubject_1.BehaviorSubject(undefined);
        _this.alertFilter = {
            query: {
                orderByChild: "hazardScenario",
                equalTo: _this.alertFilterSubject
            }
        };
        return _this;
    }
    AdvancedPreparednessComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.subscriptions.add(_this.obsCountryId.subscribe(function (value) {
                    _this.subscriptions.add(_this.af.database.list(Constants_1.Constants.APP_STATUS + '/hazard/' + _this.countryId).subscribe(function (hazards) {
                        _this.hazards.next(hazards);
                    }));
                }, function (error) { return console.log(error); }, function () { return console.log("finished"); }));
                _this.subscriptions.add(_this.af.database.list(Constants_1.Constants.APP_STATUS + '/action/').subscribe(function (_) {
                    _this.actions = [];
                    _.map(function (actions) {
                        var agencyId = actions.$key;
                        Object.keys(actions).map(function (action) {
                            if (typeof actions[action] !== 'object')
                                return;
                            actions[action].agencyId = agencyId;
                            actions[action].key = action;
                            actions[action].docsCount = 0;
                            var userKey = actions[action].assignee;
                            try {
                                actions[action].docsCount = Object.keys(actions[action].documents).length;
                                Object.keys(actions[action].documents).map(function (docId) {
                                    _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/document/' + agencyId + '/' + docId).subscribe(function (_) {
                                        actions[action].documents[docId] = _;
                                    }));
                                });
                            }
                            catch (e) {
                            }
                            _this.subscriptions.add(_this.hazards.subscribe(function (hazards) {
                                actions[action].hazards = hazards.filter(function (hazard) {
                                    if (actions[action].hazardsAssigned) {
                                        return (Object.keys(actions[action].hazardsAssigned).indexOf(hazard.$key) > -1);
                                    }
                                    return false;
                                });
                                actions[action].hazards.map(function (hazard) {
                                    _this.alertFilterSubject.next(hazard.hazardScenario);
                                    _this.subscriptions.add(_this.af.database.list(Constants_1.Constants.APP_STATUS + '/alert/' + _this.countryId, _this.alertFilter).subscribe(function (alerts) {
                                        hazard.alerts = alerts;
                                        alerts.map(function (alert) {
                                            console.log(alert.alertLevel);
                                            console.log(Enums_1.ThresholdName.Red);
                                            if (alert.alertLevel == Enums_1.ThresholdName.Red)
                                                _this.changeActionStatus(actions[action]);
                                        });
                                    }));
                                    return hazard;
                                });
                            }));
                            _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + userKey).subscribe(function (_) {
                                if (_.$exists()) {
                                    _this.users[userKey] = _.firstName + " " + _.lastName;
                                    actions[action].assigned = true;
                                }
                                else {
                                    _this.users[userKey] = "Unassigned"; //TODO translate somehow
                                    actions[action].assigned = false;
                                }
                            }));
                            _this.subscriptions.add(_this.af.database.list(Constants_1.Constants.APP_STATUS + '/note/' + action, {
                                query: {
                                    orderByChild: "time"
                                }
                            }).subscribe(function (_) {
                                actions[action].notesCount = _.length;
                                actions[action].notes = _;
                                actions[action].notes.map(function (note) {
                                    var uploadByUser = note.uploadBy;
                                    _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + uploadByUser).subscribe(function (_) {
                                        if (_.$exists()) {
                                            note.uploadByUser = _.firstName + " " + _.lastName;
                                        }
                                        else {
                                            note.uploadByUser = "N/A";
                                        }
                                    }));
                                    return note;
                                });
                            }));
                            if (actions[action].level == _this.actionLevel) {
                                _this.actions.push(actions[action]);
                            }
                        });
                    });
                }));
                _this.subscriptions.add(subscription);
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    AdvancedPreparednessComponent.prototype.changeActionStatus = function (action) {
        var status = Enums_1.ActionStatus.InProgress;
        if (!action.assigned)
            status = Enums_1.ActionStatus.Expired;
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key)
            .update({
            actionStatus: status
        });
    };
    return AdvancedPreparednessComponent;
}(minimum_component_1.MinimumPreparednessComponent));
AdvancedPreparednessComponent = __decorate([
    core_1.Component({
        selector: 'app-advanced',
        templateUrl: './advanced.component.html',
        styleUrls: ['./advanced.component.css']
    }),
    __param(0, core_1.Inject(angularfire2_1.FirebaseApp))
], AdvancedPreparednessComponent);
exports.AdvancedPreparednessComponent = AdvancedPreparednessComponent;
