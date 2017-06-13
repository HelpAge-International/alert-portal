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
var Subject_1 = require("rxjs/Subject");
var facetoface_model_1 = require("../dashboard/facetoface-meeting-request/facetoface.model");
var AgencyService = (function () {
    function AgencyService(af) {
        this.af = af;
        this.ngUnsubscribe = new Subject_1.Subject();
    }
    AgencyService.prototype.getAgencyId = function (agencyAdminId) {
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/agencyId")
            .map(function (id) {
            if (id.$value) {
                return id.$value;
            }
        });
    };
    AgencyService.prototype.getAgency = function (agencyId) {
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + agencyId);
    };
    AgencyService.prototype.getCountryOffice = function (countryId, agencyId) {
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId);
    };
    AgencyService.prototype.getAllCountryOffices = function () {
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/");
    };
    AgencyService.prototype.getCountryDirector = function (countryId) {
        var _this = this;
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/directorCountry/" + countryId)
            .flatMap(function (directorId) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + directorId.$value);
        });
    };
    AgencyService.prototype.getAllAgencySameCountry = function (countryId, agencyId) {
        var _this = this;
        var displayList = [];
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (country) {
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/")
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (agencies) {
                agencies = agencies.filter(function (agency) { return agency.$key != agencyId; });
                // console.log(agencies);
                agencies.forEach(function (agency) {
                    // console.log(agency);
                    var countries = Object.keys(agency).map(function (key) {
                        var temp = agency[key];
                        temp["countryId"] = key;
                        return temp;
                    });
                    countries = countries.filter(function (countryItem) { return countryItem.location == country.location; });
                    // console.log(countries);
                    if (countries.length > 0) {
                        var faceToface = new facetoface_model_1.ModelFaceToFce();
                        faceToface.agencyId = agency.$key;
                        faceToface.countryId = countries[0].countryId;
                        displayList.push(faceToface);
                    }
                });
            });
        });
        return displayList;
    };
    AgencyService.prototype.unSubscribeNow = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    return AgencyService;
}());
AgencyService = __decorate([
    core_1.Injectable()
], AgencyService);
exports.AgencyService = AgencyService;
