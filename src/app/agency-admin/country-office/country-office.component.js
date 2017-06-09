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
var rxjs_1 = require("rxjs");
var CountryOfficeComponent = (function () {
    function CountryOfficeComponent(af, router) {
        this.af = af;
        this.router = router;
        this.countryNames = Constants_1.Constants.COUNTRY;
        this.regionCountries = [];
        this.tempCountryIdList = [];
        this.showRegionMap = new Map();
        this.hideOtherTab = true;
        this.otherCountries = [];
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CountryOfficeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            // console.log(user.auth.uid);
            _this.uid = user.auth.uid;
            _this.countries = _this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/' + _this.uid);
            _this.regions = _this.af.database.list(Constants_1.Constants.APP_STATUS + '/region/' + _this.uid);
            _this.regions.takeUntil(_this.ngUnsubscribe).subscribe(function (regions) {
                regions.forEach(function (region) {
                    _this.showRegionMap.set(region.$key, false);
                });
            });
            _this.checkAnyCountryNoRegion();
        });
    };
    CountryOfficeComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    CountryOfficeComponent.prototype.checkAnyCountryNoRegion = function () {
        var _this = this;
        this.countriesWithRegion = [];
        this.allCountries = [];
        this.otherCountries = [];
        this.regions
            .map(function (regions) {
            var countries = new Set();
            regions.forEach(function (region) {
                Object.keys(region.countries).forEach(function (countryId) {
                    countries.add(countryId);
                });
            });
            return Array.from(countries);
        })
            .first()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (result) {
            // console.log(result);
            _this.countriesWithRegion = result;
            var subscription = _this.countries
                .map(function (list) {
                var countryids = [];
                list.forEach(function (country) {
                    countryids.push(country.$key);
                });
                return countryids;
            })
                .first()
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (result) {
                // console.log(result);
                _this.allCountries = result;
                var diff = _this.allCountries.filter(function (x) {
                    return !_this.countriesWithRegion.includes(x);
                });
                if (diff.length > 0) {
                    _this.hideOtherTab = false;
                    _this.retrieveOtherCountries(diff);
                }
            });
        });
    };
    CountryOfficeComponent.prototype.retrieveOtherCountries = function (diff) {
        var _this = this;
        // console.log('do have other countries, fetch data!');
        rxjs_1.Observable.from(diff)
            .flatMap(function (id) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + _this.uid + '/' + id);
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (result) {
            // console.log(result);
            _this.otherCountries.push(result);
        });
    };
    CountryOfficeComponent.prototype.update = function (country) {
        this.countryToUpdate = country;
        if (this.countryToUpdate.isActive) {
            this.alertTitle = "GLOBAL.DEACTIVATE";
            this.alertContent = 'AGENCY_ADMIN.COUNTRY_OFFICES.DEACTIVATE_ALERT';
        }
        else {
            this.alertTitle = "GLOBAL.ACTIVATE";
            this.alertContent = 'AGENCY_ADMIN.COUNTRY_OFFICES.ACTIVATE_ALERT';
        }
        jQuery("#update-country").modal("show");
    };
    CountryOfficeComponent.prototype.toggleActive = function () {
        var state = !this.countryToUpdate.isActive;
        this.otherCountries = [];
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + this.countryToUpdate.$key + '/isActive').set(state)
            .then(function (_) {
            console.log("Country state updated");
            jQuery("#update-country").modal("hide");
        });
    };
    CountryOfficeComponent.prototype.closeModal = function () {
        jQuery("#update-country").modal("hide");
    };
    CountryOfficeComponent.prototype.editCountry = function (country) {
        this.router.navigate(['agency-admin/country-office/create-edit-country/', { id: country.$key }]);
    };
    CountryOfficeComponent.prototype.getCountries = function (region) {
        var _this = this;
        if (!region) {
            return;
        }
        this.regionCountries = [];
        this.tempCountryIdList = [];
        for (var countryId in region.countries) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + countryId)
                .first()
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (country) {
                if (!_this.tempCountryIdList.includes(country.location)) {
                    _this.tempCountryIdList.push(country.location);
                    _this.regionCountries.push(country);
                }
            });
        }
        return this.regionCountries;
    };
    CountryOfficeComponent.prototype.getAdminName = function (key) {
        var _this = this;
        if (!key) {
            return;
        }
        var name = '';
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + key + '/adminId')
            .flatMap(function (adminId) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + adminId.$value);
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            name = user.firstName + ' ' + user.lastName;
        });
        if (name) {
            return name;
        }
    };
    CountryOfficeComponent.prototype.hideCountryList = function (region) {
        if (region) {
            this.showRegionMap.set(region.$key, !this.showRegionMap.get(region.$key));
        }
        else {
            this.hideOtherCountries = !this.hideOtherCountries;
        }
    };
    CountryOfficeComponent.prototype.editRegion = function (region) {
        this.router.navigate(['/agency-admin/country-office/create-edit-region', { id: region.$key }], { skipLocationChange: true });
    };
    CountryOfficeComponent.prototype.getDirectorName = function (director) {
        var _this = this;
        this.directorName = "AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED";
        if (director && director.directorId && director.directorId != "null") {
            this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + director.directorId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (user) {
                _this.directorName = user.firstName + " " + user.lastName;
            });
        }
        return this.directorName;
    };
    return CountryOfficeComponent;
}());
CountryOfficeComponent = __decorate([
    core_1.Component({
        selector: 'app-country-office',
        templateUrl: './country-office.component.html',
        styleUrls: ['./country-office.component.css']
    })
], CountryOfficeComponent);
exports.CountryOfficeComponent = CountryOfficeComponent;
