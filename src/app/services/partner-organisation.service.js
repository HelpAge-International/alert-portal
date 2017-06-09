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
var partner_organisation_model_1 = require("../model/partner-organisation.model");
var PartnerOrganisationService = (function () {
    function PartnerOrganisationService(af, subscriptions) {
        this.af = af;
        this.subscriptions = subscriptions;
    }
    PartnerOrganisationService.prototype.getPartnerOrganisations = function () {
        var partnerOrganisationsSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/partnerOrganisation')
            .map(function (items) {
            var partnerOrganisations = [];
            items.forEach(function (item) {
                // Add the organisation ID
                var partnerOrganisation = item;
                partnerOrganisation.id = item.$key;
                partnerOrganisations.push(partnerOrganisation);
            });
            return partnerOrganisations;
        });
        return partnerOrganisationsSubscription;
    };
    PartnerOrganisationService.prototype.getPartnerOrganisation = function (id) {
        if (!id) {
            return null;
        }
        var partnerOrganisationSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/partnerOrganisation/' + id)
            .map(function (item) {
            if (item.$key) {
                var partnerOrganisation = new partner_organisation_model_1.PartnerOrganisationModel();
                partnerOrganisation.id = id;
                partnerOrganisation.mapFromObject(item);
                return partnerOrganisation;
            }
            return null;
        });
        return partnerOrganisationSubscription;
    };
    PartnerOrganisationService.prototype.savePartnerOrganisation = function (partnerOrganisation) {
        if (partnerOrganisation.id) {
            return this.af.database.object(Constants_1.Constants.APP_STATUS + '/partnerOrganisation' + partnerOrganisation.id).update(partnerOrganisation);
        }
        else {
            return this.af.database.list(Constants_1.Constants.APP_STATUS + '/partnerOrganisation').push(partnerOrganisation);
        }
    };
    return PartnerOrganisationService;
}());
PartnerOrganisationService = __decorate([
    core_1.Injectable()
], PartnerOrganisationService);
exports.PartnerOrganisationService = PartnerOrganisationService;
