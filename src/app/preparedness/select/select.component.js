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
var SelectPreparednessComponent = (function () {
    function SelectPreparednessComponent(af, subscriptions, router, storage) {
        this.af = af;
        this.subscriptions = subscriptions;
        this.router = router;
        this.storage = storage;
        this.isFiltered = false;
        this.actionSelected = {};
        this.actionLevelSelected = 0;
        this.categorySelected = 0;
        this.actionLevel = Constants_1.Constants.ACTION_LEVEL;
        this.actionLevelList = [Enums_1.ActionLevel.ALL, Enums_1.ActionLevel.MPA, Enums_1.ActionLevel.APA];
        this.category = Constants_1.Constants.CATEGORY;
        this.categoriesList = [
            Enums_1.GenericActionCategory.ALL,
            Enums_1.GenericActionCategory.Category1,
            Enums_1.GenericActionCategory.Category2,
            Enums_1.GenericActionCategory.Category3,
            Enums_1.GenericActionCategory.Category4,
            Enums_1.GenericActionCategory.Category5,
            Enums_1.GenericActionCategory.Category6,
            Enums_1.GenericActionCategory.Category7,
            Enums_1.GenericActionCategory.Category8,
            Enums_1.GenericActionCategory.Category9,
            Enums_1.GenericActionCategory.Category10
        ];
    }
    SelectPreparednessComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                var subscription_1 = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + _this.uid + '/systemAdmin').subscribe(function (systemAdminIds) {
                    _this.systemAdminUid = systemAdminIds[0].$key;
                    _this.genericActions = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.systemAdminUid, {
                        query: {
                            orderByChild: "type",
                            equalTo: Enums_1.ActionType.mandated
                        }
                    });
                });
                _this.subscriptions.add(subscription_1);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
        this.subscriptions.add(subscription);
    };
    SelectPreparednessComponent.prototype.changeFilter = function (event, typeFilter) {
        if (typeFilter == 'category') {
            this.categorySelected = event.target.value;
        }
        if (typeFilter == 'level') {
            this.actionLevelSelected = event.target.value;
        }
        this.filter();
    };
    SelectPreparednessComponent.prototype.continueEvent = function () {
        this.storage.set('selectedAction', this.actionSelected);
        this.router.navigate(["/preparedness/create-edit-preparedness"]);
    };
    SelectPreparednessComponent.prototype.selectAction = function (action) {
        this.actionSelected = action;
    };
    SelectPreparednessComponent.prototype.filter = function () {
        var _this = this;
        if (this.actionLevelSelected == Enums_1.GenericActionCategory.ALL && this.categorySelected == Enums_1.GenericActionCategory.ALL) {
            //no filter. show all
            this.isFiltered = false;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            });
        }
        else if (this.actionLevelSelected != Enums_1.GenericActionCategory.ALL && this.categorySelected == Enums_1.GenericActionCategory.ALL) {
            //filter only with mpa
            this.isFiltered = true;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var item = list_1[_i];
                    if (item.level == _this.actionLevelSelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
        else if (this.actionLevelSelected == Enums_1.GenericActionCategory.ALL && this.categorySelected != Enums_1.GenericActionCategory.ALL) {
            //filter only with apa
            this.isFiltered = true;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                    var item = list_2[_i];
                    if (item.category == _this.categorySelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
        else {
            // filter both action level and category
            this.isFiltered = true;
            this.genericActions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                    var item = list_3[_i];
                    if (item.level == _this.actionLevelSelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                    var item = list_4[_i];
                    if (item.category == _this.categorySelected) {
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
    };
    SelectPreparednessComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    return SelectPreparednessComponent;
}());
SelectPreparednessComponent = __decorate([
    core_1.Component({
        selector: 'app-preparedness',
        templateUrl: './select.component.html',
        styleUrls: ['./select.component.css']
    })
], SelectPreparednessComponent);
exports.SelectPreparednessComponent = SelectPreparednessComponent;
