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
var Enums_1 = require("../../../utils/Enums");
var partner_organisation_service_1 = require("../../../services/partner-organisation.service");
var CountryOfficePartnersComponent = (function () {
    function CountryOfficePartnersComponent(_userService, _partnerOrganisationService, _commonService, _sessionService, router, route, subscriptions) {
        this._userService = _userService;
        this._partnerOrganisationService = _partnerOrganisationService;
        this._commonService = _commonService;
        this._sessionService = _sessionService;
        this.router = router;
        this.route = route;
        this.subscriptions = subscriptions;
        this.isEdit = false;
        this.canEdit = true; // TODO check the user type and see if he has editing permission
        // Constants and enums
        this.alertMessageType = Enums_1.AlertMessageType;
        this.filterOrganisation = null;
        this.filterSector = null;
        this.filterLocation = null;
        this.PARTNER_STATUS = Constants_1.Constants.PARTNER_STATUS;
        this.RESPONSE_PLAN_SECTORS = Enums_1.ResponsePlanSectors;
        this.RESPONSE_PLAN_SECTORS_SELECTION = Constants_1.Constants.RESPONSE_PLANS_SECTORS;
        // Models
        this.alertMessage = null;
        this.partnerOrganisations = [];
        this.areasOfOperation = [];
        this.partnerOrganisations = [];
    }
    CountryOfficePartnersComponent.prototype.ngOnDestroy = function () {
        this._sessionService.partner = null;
        this._sessionService.user = null;
        this.subscriptions.releaseAll();
    };
    CountryOfficePartnersComponent.prototype.ngOnInit = function () {
        var _this = this;
        var authSubscription = this._userService.getAuthUser().subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            _this._userService.getCountryAdminUser(_this.uid).subscribe(function (countryAdminUser) {
                _this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
                _this.countryId = countryAdminUser.countryId;
                _this._userService.getCountryOfficePartnerUsers(_this.agencyId, _this.countryId)
                    .subscribe(function (partners) {
                    _this.partners = partners;
                    _this.partners.forEach(function (partner) {
                        if (!_this.partnerOrganisations.find(function (x) { return x.id == partner.partnerOrganisationId; })) {
                            _this._partnerOrganisationService.getPartnerOrganisation(partner.partnerOrganisationId)
                                .subscribe(function (partnerOrganisation) { _this.partnerOrganisations[partner.partnerOrganisationId] = partnerOrganisation; });
                        }
                    });
                });
                // get the country levels values
                _this._commonService.getJsonContent(Constants_1.Constants.COUNTRY_LEVELS_VALUES_FILE)
                    .subscribe(function (content) {
                    _this.countryLevelsValues = content;
                    (function (err) { return console.log(err); });
                });
            });
        });
        this.subscriptions.add(authSubscription);
    };
    CountryOfficePartnersComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/country-admin/country-staff');
    };
    CountryOfficePartnersComponent.prototype.getAreasOfOperation = function (partnerOrganisation) {
        var _this = this;
        var areasOfOperation = [];
        if (partnerOrganisation && partnerOrganisation.projects && this.countryLevelsValues) {
            partnerOrganisation.projects.forEach(function (project) {
                project.operationAreas.forEach(function (location) {
                    var locationName = _this.countryLevelsValues[location.country]['levelOneValues'][location.level1]['levelTwoValues'][location.level2].value;
                    areasOfOperation.push(locationName);
                    if (!_this.areasOfOperation.find(function (x) { return x == locationName; })) {
                        _this.areasOfOperation.push(locationName);
                        _this.areasOfOperation.sort();
                    }
                });
            });
            return areasOfOperation.join(',');
        }
    };
    CountryOfficePartnersComponent.prototype.editPartners = function () {
        this.isEdit = true;
    };
    CountryOfficePartnersComponent.prototype.showPartners = function () {
        this.isEdit = false;
    };
    CountryOfficePartnersComponent.prototype.addPartnerOrganisation = function () {
        this.router.navigateByUrl('/response-plans/add-partner-organisation');
    };
    CountryOfficePartnersComponent.prototype.editPartnerOrganisation = function (partnerOrganisationId) {
        this.router.navigate(['/response-plans/add-partner-organisation', { id: partnerOrganisationId }]);
    };
    CountryOfficePartnersComponent.prototype.hideFilteredPartners = function (partner) {
        var hide = false;
        if (!partner) {
            return hide;
        }
        if (this.filterOrganisation && this.filterOrganisation != "null" && partner.partnerOrganisationId !== this.filterOrganisation) {
            hide = true;
        }
        if (this.filterSector && this.filterSector != "null"
            && !this.hasOrganisationProjectSector(this.partnerOrganisations[partner.partnerOrganisationId], this.filterSector)) {
            hide = true;
        }
        if (this.filterLocation && this.filterLocation != "null" && !this.hasAreaOfOperation(partner, this.filterLocation)) {
            hide = true;
        }
        return hide;
    };
    CountryOfficePartnersComponent.prototype.hasOrganisationProjectSector = function (partnerOrganisation, sector) {
        var exists = false;
        partnerOrganisation.projects.forEach(function (project) {
            Object.keys(project.sector).forEach(function (key) {
                if (key == sector && project.sector[key]) {
                    exists = true;
                }
            });
        });
        return exists;
    };
    CountryOfficePartnersComponent.prototype.hasAreaOfOperation = function (partner, locationName) {
        var exists = false;
        var areasOfOperation = this.getAreasOfOperation(this.partnerOrganisations[partner.partnerOrganisationId]);
        if (areasOfOperation.search(locationName) !== -1) {
            exists = true;
        }
        return exists;
    };
    return CountryOfficePartnersComponent;
}());
CountryOfficePartnersComponent = __decorate([
    core_1.Component({
        selector: 'app-country-office-partners',
        templateUrl: './partners.component.html',
        styleUrls: ['./partners.component.css'],
        providers: [partner_organisation_service_1.PartnerOrganisationService]
    })
], CountryOfficePartnersComponent);
exports.CountryOfficePartnersComponent = CountryOfficePartnersComponent;
