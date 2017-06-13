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
var Enums_1 = require("../utils/Enums");
var MapHelper_1 = require("../utils/MapHelper");
var MapComponent = (function () {
    function MapComponent(af, router, subscriptions) {
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.agencyMap = new Map();
        this.mapHelper = MapHelper_1.SuperMapComponents.init(af, subscriptions);
    }
    MapComponent.prototype.goToListView = function () {
        this.router.navigateByUrl('map/map-countries-list');
    };
    MapComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.department = new MapHelper_1.SDepHolder("Something");
        this.department.location = -1;
        this.department.departments.push(new MapHelper_1.DepHolder("Loading", 100, 1));
        var subscription = this.af.auth.subscribe(function (user) {
            if (user) {
                _this.uid = user.auth.uid;
                /** Initialise map and colour the relevant countries */
                _this.mapHelper.initMapFrom("global-map", _this.uid, "administratorCountry", function (departments) {
                    _this.mDepartmentMap = departments;
                    _this.departments = [];
                    _this.minThreshRed = _this.mapHelper.minThreshRed;
                    _this.minThreshYellow = _this.mapHelper.minThreshYellow;
                    _this.minThreshGreen = _this.mapHelper.minThreshGreen;
                    _this.mDepartmentMap.forEach(function (value, key) {
                        _this.departments.push(value);
                    });
                }, function (mapCountryClicked) {
                    if (_this.mDepartmentMap != null) {
                        _this.openMinimumPreparednessModal(mapCountryClicked);
                    }
                    else {
                        console.log("TODO: Map is yet to initialise properly / it failed to do so");
                    }
                });
                /** Load in the markers on the map! */
                _this.mapHelper.markersForAgencyAdmin(_this.uid, "administratorCountry", function (marker) {
                    marker.setMap(_this.mapHelper.map);
                });
                /** Get the Agency logo */
                _this.mapHelper.logoForAgencyAdmin(_this.uid, "administratorCountry", function (logo) {
                    _this.agencyLogo = logo;
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
        this.subscriptions.add(subscription);
    };
    MapComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.releaseAll();
    };
    MapComponent.prototype.getCountryCode = function (location) {
        return Enums_1.Countries[location];
    };
    MapComponent.prototype.openMinimumPreparednessModal = function (countryCode) {
        jQuery("#minimum-prep-modal-" + countryCode).modal("show");
    };
    return MapComponent;
}());
MapComponent = __decorate([
    core_1.Component({
        selector: 'app-map',
        templateUrl: './map.component.html',
        styleUrls: ['./map.component.css']
    })
], MapComponent);
exports.MapComponent = MapComponent;
