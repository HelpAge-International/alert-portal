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
var rxjs_1 = require("rxjs");
var MpaComponent = (function () {
    function MpaComponent(af, router) {
        this.af = af;
        this.router = router;
        this.isFiltered = false;
        this.ActionType = Enums_1.ActionType;
        this.GenericActionCategory = Enums_1.GenericActionCategory;
        this.levelSelected = 0;
        this.categorySelected = 0;
        this.Category = Constants_1.Constants.CATEGORY;
        this.categoriesList = [Enums_1.GenericActionCategory.ALL, Enums_1.GenericActionCategory.Category1, Enums_1.GenericActionCategory.Category2, Enums_1.GenericActionCategory.Category3,
            Enums_1.GenericActionCategory.Category4, Enums_1.GenericActionCategory.Category5, Enums_1.GenericActionCategory.Category6, Enums_1.GenericActionCategory.Category7,
            Enums_1.GenericActionCategory.Category8, Enums_1.GenericActionCategory.Category9, Enums_1.GenericActionCategory.Category10];
        this.ActionPrepLevel = Constants_1.Constants.ACTION_LEVEL;
        this.levelsList = [Enums_1.ActionLevel.ALL, Enums_1.ActionLevel.MPA, Enums_1.ActionLevel.APA];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    MpaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                _this.actions = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + _this.uid, {
                    query: {
                        orderByChild: "type",
                        equalTo: Enums_1.ActionType.mandated
                    }
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    MpaComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    MpaComponent.prototype.edit = function (actionKey) {
        console.log("navigate to edit");
        this.router.navigate(["/system-admin/mpa/create", { id: actionKey }]);
    };
    MpaComponent.prototype.deleteGenericAction = function (actionKey) {
        this.actionToDelete = actionKey;
        jQuery("#delete-action").modal("show");
    };
    MpaComponent.prototype.deleteAction = function () {
        console.log("Delete button pressed");
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/action/" + this.uid + "/" + this.actionToDelete).remove()
            .then(function (_) {
            console.log("Generic action deleted");
            jQuery("#delete-action").modal("hide");
        });
    };
    MpaComponent.prototype.filterData = function () {
        var _this = this;
        if (this.levelSelected == Enums_1.GenericActionCategory.ALL && this.categorySelected == Enums_1.GenericActionCategory.ALL) {
            //no filter. show all
            this.isFiltered = false;
            console.log("show all results");
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            });
        }
        else if (this.levelSelected != Enums_1.GenericActionCategory.ALL && this.categorySelected == Enums_1.GenericActionCategory.ALL) {
            //filter only with mpa
            this.isFiltered = true;
            console.log("show filter level");
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var item = list_1[_i];
                    if (item.level == _this.levelSelected) {
                        console.log(JSON.stringify(item));
                        tempList.push(item);
                    }
                }
                return tempList;
            });
        }
        else if (this.levelSelected == Enums_1.GenericActionCategory.ALL && this.categorySelected != Enums_1.GenericActionCategory.ALL) {
            //filter only with apa
            this.isFiltered = true;
            console.log("show filter category");
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
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
            console.log("show both filtered");
            this.actions = this.af.database.list(Constants_1.Constants.APP_STATUS + "/action/" + this.uid, {
                query: {
                    orderByChild: "type",
                    equalTo: Enums_1.ActionType.mandated
                }
            })
                .map(function (list) {
                var tempList = [];
                for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                    var item = list_3[_i];
                    if (item.level == _this.levelSelected) {
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
    MpaComponent.prototype.closeModal = function () {
        jQuery("#delete-action").modal("hide");
    };
    return MpaComponent;
}());
MpaComponent = __decorate([
    core_1.Component({
        selector: 'app-mpa',
        templateUrl: './mpa.component.html',
        styleUrls: ['./mpa.component.css']
    })
], MpaComponent);
exports.MpaComponent = MpaComponent;
