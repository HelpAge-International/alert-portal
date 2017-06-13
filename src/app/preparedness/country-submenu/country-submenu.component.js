"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../utils/Constants");
var agency_submenu_component_1 = require("../agency-submenu/agency-submenu.component");
var CountrySubmenuComponent = (function (_super) {
    __extends(CountrySubmenuComponent, _super);
    function CountrySubmenuComponent(af, _sanitizer) {
        var _this = _super.call(this, af, _sanitizer) || this;
        _this.af = af;
        _this._sanitizer = _sanitizer;
        _this.agencyLogo = '';
        _this.agencyName = '';
        return _this;
    }
    CountrySubmenuComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.loadAgencyData();
    };
    CountrySubmenuComponent.prototype.getAgencyBackground = function () {
        if (this.agencyLogo) {
            return this._sanitizer.bypassSecurityTrustStyle('url(' + this.agencyLogo + ')');
        }
    };
    CountrySubmenuComponent.prototype.loadAgencyData = function () {
        var _this = this;
        var subscription = this.af.database.object(Constants_1.Constants.APP_STATUS + "/agency/" + this.agencyId).subscribe(function (agency) {
            _this.agencyLogo = agency.logoPath;
            _this.agencyName = agency.name;
        });
        this.subscriptions.add(subscription);
    };
    return CountrySubmenuComponent;
}(agency_submenu_component_1.AgencySubmenuComponent));
__decorate([
    core_1.Input()
], CountrySubmenuComponent.prototype, "countryId", void 0);
__decorate([
    core_1.Input()
], CountrySubmenuComponent.prototype, "agencyId", void 0);
CountrySubmenuComponent = __decorate([
    core_1.Component({
        selector: 'app-country-submenu',
        templateUrl: './country-submenu.component.html',
        styleUrls: ['./country-submenu.component.css']
    })
], CountrySubmenuComponent);
exports.CountrySubmenuComponent = CountrySubmenuComponent;
