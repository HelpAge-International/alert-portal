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
var RxHelper_1 = require("../../utils/RxHelper");
var AgencySubmenuComponent = (function () {
    function AgencySubmenuComponent(af, _sanitizer) {
        this.af = af;
        this._sanitizer = _sanitizer;
        this.COUNTRIES = Constants_1.Constants.COUNTRIES;
        this.CountriesEnum = Object.keys(Enums_1.Countries).map(function (k) { return Enums_1.Countries[k]; }).filter(function (v) { return typeof v === "string"; });
        this.subscriptions = new RxHelper_1.RxHelper;
    }
    AgencySubmenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/').subscribe(function (offices) {
            offices.map(function (office) {
                Object.keys(office).map(function (countryId) {
                    if (_this.countryId == countryId)
                        _this.location = office[countryId].location;
                });
            });
        });
    };
    AgencySubmenuComponent.prototype.getBackground = function () {
        if (this.location)
            return this._sanitizer.bypassSecurityTrustStyle('url(/assets/images/countries/' + this.CountriesEnum[this.location] + '.svg)');
    };
    return AgencySubmenuComponent;
}());
__decorate([
    core_1.Input()
], AgencySubmenuComponent.prototype, "countryId", void 0);
AgencySubmenuComponent = __decorate([
    core_1.Component({
        selector: 'app-agency-submenu',
        templateUrl: './agency-submenu.component.html',
        styleUrls: ['./agency-submenu.component.css']
    })
], AgencySubmenuComponent);
exports.AgencySubmenuComponent = AgencySubmenuComponent;
