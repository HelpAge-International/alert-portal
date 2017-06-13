"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../../utils/Constants");
var rxjs_1 = require("rxjs");
var Enums_1 = require("../../../utils/Enums");
var region_model_1 = require("../../../model/region.model");
var CreateEditRegionComponent = (function () {
    function CreateEditRegionComponent(af, router, route) {
        this.af = af;
        this.router = router;
        this.route = route;
        this.pageTitle = "AGENCY_ADMIN.COUNTRY_OFFICES.CREATE_NEW_REGION";
        this.submitText = "AGENCY_ADMIN.COUNTRY_OFFICES.SAVE_NEW_REGION";
        this.COUNTRY_NAMES = Constants_1.Constants.COUNTRY;
        this.counter = 0;
        this.countries = [this.counter];
        this.hideWarning = true;
        this.countrySelected = 0;
        this.selectedCountries = [];
        this.officeList = [];
        this.regionalDirectors = [null];
        this.hideRemove = true;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    CreateEditRegionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.auth.uid;
            _this.countrySelections = _this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.uid);
            //regional directors
            _this.af.database.list(Constants_1.Constants.APP_STATUS + "/staff/globalUser/" + _this.uid, {
                query: {
                    orderByChild: "userType",
                    equalTo: Enums_1.UserType.RegionalDirector
                }
            })
                .flatMap(function (staffs) {
                var ids = [];
                staffs.forEach(function (staff) {
                    ids.push(staff.$key);
                });
                return rxjs_1.Observable.from(ids);
            })
                .flatMap(function (id) {
                return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + id);
            })
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (x) {
                _this.regionalDirectors.push(x);
            });
            // //regional directors
            // this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid)
            //   .flatMap(countries => {
            //     let countryIds = ["globalUser"];
            //     countries.forEach(country => {
            //       countryIds.push(country.$key)
            //     });
            //     return Observable.from(countryIds);
            //   })
            //   .flatMap(countryId => {
            //     return this.af.database.list(Constants.APP_STATUS + "/staff/" + countryId, {
            //       query: {
            //         orderByChild: "userType",
            //         equalTo: UserType.RegionalDirector
            //       }
            //     });
            //   })
            //   .flatMap(staffs => {
            //     let ids = [];
            //     staffs.forEach(staff => {
            //       ids.push(staff.$key);
            //     });
            //     return Observable.from(ids);
            //   })
            //   .flatMap(id => {
            //       return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + id)
            //     }
            //   )
            //   .takeUntil(this.ngUnsubscribe)
            //   .subscribe(x => {
            //     this.regionalDirectors.push(x);
            //   });
            //check if edit mode
            _this.route.params
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (params) {
                if (params["id"]) {
                    _this.regionId = params["id"];
                    _this.isEdit = true;
                    _this.pageTitle = "AGENCY_ADMIN.COUNTRY_OFFICES.EDIT_REGION";
                    _this.submitText = "AGENCY_ADMIN.COUNTRY_OFFICES.SAVE_REGION";
                }
                _this.fetchCountries();
            });
        });
    };
    CreateEditRegionComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    CreateEditRegionComponent.prototype.fetchCountries = function () {
        var _this = this;
        if (!this.isEdit) {
            this.countrySelections
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (country) {
                _this.selectedCountries.push(country[0].location);
            });
        }
        else {
            this.loadRegionInfo(this.regionId);
        }
    };
    CreateEditRegionComponent.prototype.addCountrySelection = function () {
        var _this = this;
        console.log("add new country selection");
        this.countrySelections
            .takeUntil(this.ngUnsubscribe)
            .first()
            .subscribe(function (result) {
            console.log("counter: " + _this.counter + "/result: " + result.length);
            // if (this.isEdit) {
            if (_this.counter < result.length - 1) {
                console.log("can add more country");
                _this.counter++;
                _this.countries.push(_this.counter);
                _this.selectedCountries.push(_this.selectedCountries[0]);
            }
            else {
                _this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_MAX_COUNTRIES';
                _this.showAlert();
                return;
            }
            console.log(_this.countries);
            if (_this.countries.length > 1) {
                _this.hideRemove = false;
            }
        });
    };
    CreateEditRegionComponent.prototype.submit = function () {
        console.log("submit");
        console.log(this.regionalDirectorId);
        if (!this.regionName) {
            this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_NO_NAME';
            this.showAlert();
            return;
        }
        if (this.selectedCountries.length == 0) {
            this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_NO_COUNTRY';
            this.showAlert();
            return;
        }
        if (!this.checkCountries()) {
            this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_DUPLICATE_COUNTRY';
            this.showAlert();
            return;
        }
        if (!this.regionalDirectorId || this.regionalDirectorId == 'AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED') {
            this.regionalDirectorId = "null";
        }
        console.log(this.regionName);
        console.log(this.selectedCountries);
        console.log(this.regionalDirectorId);
        this.validateData();
    };
    CreateEditRegionComponent.prototype.validateData = function () {
        var _this = this;
        if (this.isEdit && this.preRegionName == this.regionName) {
            this.retrieveCountryOffices();
        }
        else {
            this.af.database.list(Constants_1.Constants.APP_STATUS + "/region/" + this.uid, {
                query: {
                    orderByChild: "name",
                    equalTo: this.regionName
                }
            })
                .takeUntil(this.ngUnsubscribe)
                .first()
                .subscribe(function (result) {
                if (result.length != 0) {
                    _this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.DUPLICATE_NAME';
                    _this.showAlert();
                    return;
                }
                _this.retrieveCountryOffices();
                // this.updateDatabase();
            });
        }
    };
    CreateEditRegionComponent.prototype.retrieveCountryOffices = function () {
        var _this = this;
        console.log("retrieve country offices");
        this.selectedCountries.forEach(function (country) {
            console.log(Enums_1.Country[country]);
            _this.fetchOffice(Enums_1.Country[country])
                .takeUntil(_this.ngUnsubscribe)
                .first()
                .subscribe(function (x) {
                if (!x) {
                    console.log("error error");
                    return;
                }
                console.log(x[0].$key);
                _this.officeList.push(x[0].$key);
                if (_this.officeList.length == _this.selectedCountries.length) {
                    _this.updateDatabase();
                }
            });
        });
    };
    CreateEditRegionComponent.prototype.fetchOffice = function (country) {
        console.log("here: " + country);
        return this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/" + this.uid, {
            query: {
                orderByChild: "location",
                equalTo: Enums_1.Country[country]
            }
        });
    };
    CreateEditRegionComponent.prototype.updateDatabase = function () {
        var _this = this;
        console.log("update firebase");
        console.log(this.officeList);
        this.isSubmitted = true;
        if (!this.isEdit) {
            console.log("push new data");
            var modelRegion = new region_model_1.ModelRegion();
            modelRegion.name = this.regionName;
            for (var _i = 0, _a = this.officeList; _i < _a.length; _i++) {
                var office = _a[_i];
                modelRegion.countries[office] = true;
            }
            modelRegion.directorId = this.regionalDirectorId;
            // modelRegion.directorId = this.regionalDirectorId.$key;
            this.af.database.list(Constants_1.Constants.APP_STATUS + "/region/" + this.uid).push(modelRegion).then(function () {
                _this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_HOME);
            }, function (error) {
                console.log(error.message);
                _this.isSubmitted = false;
            });
        }
        else {
            console.log("only update data");
            var regionData = {};
            regionData["/region/" + this.uid + "/" + this.regionId + "/name"] = this.regionName;
            // if (this.regionalDirectorId instanceof String) {
            //   regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = this.regionalDirectorId;
            // } else {
            //   if (this.regionalDirectorId) {
            //     regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = this.regionalDirectorId.$key;
            //   } else {
            //     regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = "";
            //   }
            // }
            if (this.regionalDirectorId && this.regionalDirectorId != "null") {
                regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = this.regionalDirectorId;
            }
            else {
                regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = "null";
            }
            var countriesData = {};
            for (var _b = 0, _c = this.officeList; _b < _c.length; _b++) {
                var office = _c[_b];
                countriesData[office] = true;
                //update group
                regionData["/directorRegion/" + office + "/"] = this.regionalDirectorId;
            }
            regionData["/region/" + this.uid + "/" + this.regionId + "/countries"] = countriesData;
            this.af.database.object(Constants_1.Constants.APP_STATUS).update(regionData).then(function () {
                _this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_HOME);
            }, function (error) {
                console.log(error.message);
                _this.isSubmitted = false;
            });
        }
    };
    CreateEditRegionComponent.prototype.cancel = function () {
        this.router.navigateByUrl(Constants_1.Constants.AGENCY_ADMIN_HOME);
    };
    CreateEditRegionComponent.prototype.showAlert = function () {
        var _this = this;
        this.hideWarning = false;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            _this.hideWarning = true;
        });
    };
    CreateEditRegionComponent.prototype.checkCountries = function () {
        var countrySet = new Set();
        for (var _i = 0, _a = this.selectedCountries; _i < _a.length; _i++) {
            var country = _a[_i];
            countrySet.add(country);
        }
        return countrySet.size == this.selectedCountries.length;
    };
    CreateEditRegionComponent.prototype.countryChange = function (country) {
        console.log("selected: " + this.selectedCountries.length + "/ countries: " + this.countries.length);
        if (this.selectedCountries.length == this.countries.length) {
            console.log("update");
            this.selectedCountries[country] = Enums_1.Country[this.countrySelected];
        }
        else {
            console.log("push new country");
            this.selectedCountries.push(Enums_1.Country[this.countrySelected]);
        }
        console.log("country: " + country);
        console.log("country selected: " + this.countrySelected);
        console.log("country list: " + this.selectedCountries);
        this.countrySelected = 0;
    };
    CreateEditRegionComponent.prototype.loadRegionInfo = function (param) {
        var _this = this;
        this.selectedCountries = [];
        this.countries = [];
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/region/" + this.uid + "/" + param)
            .do(function (region) {
            _this.regionName = region.name;
            _this.preRegionName = region.name;
            console.log("***");
            console.log(region.directorId);
            console.log("***");
            if (!_this.isSubmitted) {
                for (var i = 0; i < Object.keys(region.countries).length; i++) {
                    _this.countries.push(i);
                    if (i != 0) {
                        _this.counter++;
                    }
                }
                _this.hideRemove = !(_this.counter > 0);
            }
        })
            .do(function (region) {
            _this.af.database.object(Constants_1.Constants.APP_STATUS + "/userPublic/" + region.directorId)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (user) {
                // console.log(user);
                _this.regionalDirectorId = user.$key;
            });
        })
            .flatMap(function (region) {
            return rxjs_1.Observable.from(Object.keys(region.countries));
        })
            .flatMap(function (countryId) {
            console.log("country id: " + countryId);
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/countryOffice/" + _this.uid + "/" + countryId);
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (country) {
            if (!_this.isSubmitted) {
                _this.selectedCountries.push(country.location);
            }
            // console.log(this.selectedCountries);
        });
    };
    CreateEditRegionComponent.prototype.showName = function (director) {
        var name = "Unassigned";
        if (director) {
            name = director.firstName + " " + director.lastName;
        }
        return name;
    };
    CreateEditRegionComponent.prototype.removeCountry = function (country) {
        if (this.countries.length > 1) {
            this.selectedCountries.splice(country, 1);
            this.countries = this.countries.filter(function (item) { return item !== country; });
            this.counter--;
        }
        if (this.countries.length == 1) {
            this.hideRemove = true;
        }
    };
    return CreateEditRegionComponent;
}());
CreateEditRegionComponent = __decorate([
    core_1.Component({
        selector: 'app-create-edit-region',
        templateUrl: './create-edit-region.component.html',
        styleUrls: ['./create-edit-region.component.css']
    })
], CreateEditRegionComponent);
exports.CreateEditRegionComponent = CreateEditRegionComponent;
