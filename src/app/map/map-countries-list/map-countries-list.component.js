"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MapHelper_1 = require("../../utils/MapHelper");
var Enums_1 = require("../../utils/Enums");
var HazardImages_1 = require("../../utils/HazardImages");
var MapCountriesListComponent = (function () {
    function MapCountriesListComponent(af, router, subscriptions) {
        this.af = af;
        this.router = router;
        this.subscriptions = subscriptions;
        this.minThreshGreen = -1;
        this.minThreshYellow = -1;
        this.minThreshRed = -1;
        this.mapHelper = MapHelper_1.SuperMapComponents.init(af, subscriptions);
        this.regions = [];
        this.countries = [];
        this.hazards = [];
    }
    MapCountriesListComponent.prototype.ngOnInit = function () {
        var _this = this;
        var sub = this.af.auth.subscribe(function (user) {
            if (user) {
                _this.uid = user.uid;
                /** Setup the minimum threshold **/
                _this.mapHelper.getSystemInfo(_this.uid, "administratorCountry", function (red, yellow, green) {
                    _this.minThreshGreen = green;
                    _this.minThreshYellow = yellow;
                    _this.minThreshRed = red;
                });
                /** Setup the region count **/
                _this.mapHelper.getRegionsForAgency(_this.uid, "administratorCountry", function (key, obj) {
                    console.log("Updating Region");
                    _this.showRegionHeaders = key != "";
                    if (!_this.showRegionHeaders)
                        return;
                    var hRegion = new RegionHolder();
                    hRegion.regionName = obj.name;
                    hRegion.regionId = key;
                    for (var x in obj.countries) {
                        hRegion.countries.add(x);
                    }
                    _this.addOrUpdateRegion(hRegion);
                });
                /** Country list **/
                _this.mapHelper.initCountries(_this.uid, "administratorCountry", (function (departments) {
                    console.log("Updating country");
                    for (var _i = 0, departments_1 = departments; _i < departments_1.length; _i++) {
                        var x = departments_1[_i];
                        _this.addOrUpdateCountry(x);
                    }
                }));
                /** Markers */
                _this.mapHelper.actionInfoForAgencyAdmin(_this.uid, "administratorCountry", function (location, marker) {
                    var hazard = new RegionHazard(location, marker);
                    _this.addOrUpdateHazard(hazard);
                    console.log(_this.hazards);
                });
            }
        });
        this.subscriptions.add(sub);
    };
    MapCountriesListComponent.prototype.goToMapView = function () {
        this.router.navigateByUrl('map');
    };
    MapCountriesListComponent.prototype.addOrUpdateCountry = function (holder) {
        for (var _i = 0, _a = this.countries; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.countryId == holder.countryId) {
                x.location = holder.location;
                x.departments = holder.departments;
                return;
            }
        }
        this.countries.push(holder);
        return;
    };
    MapCountriesListComponent.prototype.addOrUpdateRegion = function (holder) {
        for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.regionId == holder.regionId) {
                x.regionName = holder.regionName;
                x.countries = holder.countries;
                return;
            }
        }
        this.regions.push(holder);
        return;
    };
    MapCountriesListComponent.prototype.addOrUpdateHazard = function (holder) {
        for (var _i = 0, _a = this.hazards; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.hazardScenario == holder.hazardScenario) {
                x.location = holder.location;
                return;
            }
        }
        this.hazards.push(holder);
        return;
    };
    MapCountriesListComponent.prototype.getCountryCodeFromLocation = function (location) {
        return Enums_1.Countries[location];
    };
    MapCountriesListComponent.prototype.getCSSHazard = function (hazard) {
        return HazardImages_1.HazardImages.init().getCSS(hazard);
    };
    MapCountriesListComponent.prototype.isNumber = function (n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    };
    return MapCountriesListComponent;
}());
MapCountriesListComponent = __decorate([
    core_1.Component({
        selector: 'app-map-countries-list',
        templateUrl: './map-countries-list.component.html',
        styleUrls: ['./map-countries-list.component.css']
    })
], MapCountriesListComponent);
exports.MapCountriesListComponent = MapCountriesListComponent;
var RegionHazard = (function () {
    function RegionHazard(location, hazard) {
        this.hazardScenario = hazard.hazardScenario;
        this.location = location;
    }
    RegionHazard.prototype.locationS = function () {
        return Enums_1.Countries[this.location];
    };
    return RegionHazard;
}());
exports.RegionHazard = RegionHazard;
var RegionHolder = (function () {
    function RegionHolder() {
        this.countries = new Set();
    }
    RegionHolder.prototype.getRegionId = function () {
        return "mapParent-" + this.regionId;
    };
    RegionHolder.prototype.getRegionIdHash = function () {
        return "#" + this.getRegionId();
    };
    RegionHolder.prototype.getCountryId = function (id) {
        return "mapCountry-" + this.regionId + "-" + id;
    };
    RegionHolder.prototype.getCountryIdHash = function (id) {
        return "#" + this.getCountryId(id);
    };
    RegionHolder.prototype.getDepartmentId = function (id) {
        return "mapDepartment-" + this.regionId + "-" + id;
    };
    RegionHolder.prototype.getDepartmentIdHash = function (id) {
        return "#" + this.getDepartmentId(id);
    };
    RegionHolder.prototype.listOfCountries = function () {
        var _this = this;
        var r = "";
        r += this.getRegionIdHash() + ", ";
        this.countries.forEach(function (value) {
            r += _this.getCountryIdHash(value) + ", ";
        });
        r = r.substr(0, r.length - 2);
        return r;
    };
    RegionHolder.prototype.listOfDepartments = function () {
        var _this = this;
        var r = "";
        r += this.getRegionIdHash() + ", ";
        this.countries.forEach(function (value) {
            r += _this.getDepartmentIdHash(value) + ", ";
        });
        r = r.substr(0, r.length - 2);
        return r;
    };
    return RegionHolder;
}());
exports.RegionHolder = RegionHolder;
