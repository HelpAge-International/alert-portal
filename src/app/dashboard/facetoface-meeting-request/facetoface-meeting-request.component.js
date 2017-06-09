"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var agency_service_service_1 = require("../../services/agency-service.service");
var facetoface_model_1 = require("./facetoface.model");
var FacetofaceMeetingRequestComponent = (function () {
    function FacetofaceMeetingRequestComponent(af, router, route, agencyService, userService) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.agencyService = agencyService;
        this.userService = userService;
        this.ngUnsubscribe = new Subject_1.Subject();
        this.COUNTRIES = Enums_1.Countries;
        this.displayList = [];
        this.agencySelectionMap = new Map();
        this.CountriesList = Constants_1.Constants.COUNTRIES;
    }
    FacetofaceMeetingRequestComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.route.params
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (params) {
                    if (params["countryId"] && params["agencyId"]) {
                        _this.countryId = params["countryId"];
                        _this.agencyId = params["agencyId"];
                        _this.initData(_this.countryId, _this.agencyId);
                    }
                });
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    FacetofaceMeetingRequestComponent.prototype.initData = function (countryId, agencyId) {
        // let allAgencySameCountry = this.agencyService.getAllAgencySameCountry(countryId, agencyId);
        // console.log(allAgencySameCountry[0]);
        this.getAllAgencySameCountry(countryId, agencyId);
    };
    FacetofaceMeetingRequestComponent.prototype.checkAgency = function (item, value) {
        this.agencySelectionMap.set(item.countryDirectorEmail, value);
    };
    FacetofaceMeetingRequestComponent.prototype.sendEmail = function () {
        var _this = this;
        console.log(this.agencySelectionMap);
        this.agencySelectionMap.forEach(function (v, k) {
            if (v) {
                if (_this.emails) {
                    _this.emails.concat(";" + k);
                }
                else {
                    _this.emails = k;
                }
            }
        });
    };
    FacetofaceMeetingRequestComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.agencyService.unSubscribeNow();
    };
    FacetofaceMeetingRequestComponent.prototype.getAllAgencySameCountry = function (countryId, agencyId) {
        var _this = this;
        this.displayList = [];
        this.agencyService.getCountryOffice(countryId, agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (country) {
            _this.countryLocation = country.location;
            _this.agencyService.getAllCountryOffices()
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (agencies) {
                agencies = agencies.filter(function (agency) { return agency.$key != agencyId; });
                agencies.forEach(function (agency) {
                    var countries = Object.keys(agency).map(function (key) {
                        var temp = agency[key];
                        temp["countryId"] = key;
                        return temp;
                    });
                    countries = countries.filter(function (countryItem) { return countryItem.location == country.location; });
                    if (countries.length > 0) {
                        var faceToface_1 = new facetoface_model_1.ModelFaceToFce();
                        faceToface_1.agencyId = agency.$key;
                        faceToface_1.countryId = countries[0].countryId;
                        _this.displayList.push(faceToface_1);
                        _this.agencyService.getAgency(faceToface_1.agencyId)
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (agency) {
                            faceToface_1.agencyName = agency.name;
                            faceToface_1.agencyLogoPath = agency.logoPath;
                        });
                        _this.agencyService.getCountryDirector(countryId)
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (director) {
                            faceToface_1.countryDirectorId = director.$key;
                            faceToface_1.countryDirectorName = director.firstName + " " + director.lastName;
                            faceToface_1.countryDirectorEmail = director.email;
                        });
                    }
                });
            });
        });
    };
    return FacetofaceMeetingRequestComponent;
}());
FacetofaceMeetingRequestComponent = __decorate([
    core_1.Component({
        selector: 'app-facetoface-meeting-request',
        templateUrl: 'facetoface-meeting-request.component.html',
        styleUrls: ['facetoface-meeting-request.component.css'],
        providers: [agency_service_service_1.AgencyService]
    })
], FacetofaceMeetingRequestComponent);
exports.FacetofaceMeetingRequestComponent = FacetofaceMeetingRequestComponent;
