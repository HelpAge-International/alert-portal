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
var partner_organisation_service_1 = require("../../services/partner-organisation.service");
var user_service_1 = require("../../services/user.service");
var alert_message_model_1 = require("../../model/alert-message.model");
var partner_organisation_model_1 = require("../../model/partner-organisation.model");
var user_public_model_1 = require("../../model/user-public.model");
var operation_area_model_1 = require("../../model/operation-area.model");
var display_error_1 = require("../../errors/display.error");
var partner_model_1 = require("../../model/partner.model");
var rxjs_1 = require("rxjs");
var AddPartnerOrganisationComponent = (function () {
    function AddPartnerOrganisationComponent(_userService, _partnerOrganisationService, _commonService, _sessionService, router, route) {
        this._userService = _userService;
        this._partnerOrganisationService = _partnerOrganisationService;
        this._commonService = _commonService;
        this._sessionService = _sessionService;
        this.router = router;
        this.route = route;
        this.isEdit = false;
        // Constants and enums
        this.alertMessageType = Enums_1.AlertMessageType;
        this.responsePlansSectors = Enums_1.ResponsePlanSectors;
        this.responsePlansSectorsSelection = Constants_1.Constants.RESPONSE_PLANS_SECTORS;
        this.countryEnum = Enums_1.Country;
        this.userTitle = Constants_1.Constants.PERSON_TITLE;
        this.userTitleSelection = Constants_1.Constants.PERSON_TITLE_SELECTION;
        // Models
        this.alertMessage = null;
        this.countryLevelsValues = [];
        this.fromResponsePlans = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
        this.partnerOrganisation = new partner_organisation_model_1.PartnerOrganisationModel();
        this.activeProject = this.partnerOrganisation.projects[0];
    }
    AddPartnerOrganisationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._userService.getAuthUser()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (user) {
            if (!user) {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
                return;
            }
            _this.uid = user.uid;
            _this.route.params
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (params) {
                if (params["fromResponsePlans"]) {
                    _this.fromResponsePlans = true;
                }
                if (params['id']) {
                    _this.isEdit = true;
                    _this._partnerOrganisationService.getPartnerOrganisation(params['id']).subscribe(function (partnerOrganisation) {
                        _this.partnerOrganisation = partnerOrganisation;
                        console.log(_this.partnerOrganisation);
                    });
                }
            });
            // get the country levels values
            _this._commonService.getJsonContent(Constants_1.Constants.COUNTRY_LEVELS_VALUES_FILE)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (content) {
                _this.countryLevelsValues = content;
                (function (err) { return console.log(err); });
            });
        });
    };
    AddPartnerOrganisationComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    AddPartnerOrganisationComponent.prototype.validateForm = function () {
        var _this = this;
        this.alertMessage = this.partnerOrganisation.validate();
        if (!this.alertMessage) {
            // Validate organisation projects
            this.partnerOrganisation.projects.forEach(function (project) {
                _this.alertMessage = _this.validateProject(project);
            });
        }
        return !this.alertMessage;
    };
    AddPartnerOrganisationComponent.prototype.submit = function () {
        var _this = this;
        // Transforms projects endDate to timestamp
        this.partnerOrganisation.projects.forEach(function (project) { return project.endDate = new Date(project.endDate).getTime().toString(); });
        this._partnerOrganisationService.savePartnerOrganisation(this.partnerOrganisation)
            .then(function (result) {
            _this.partnerOrganisation.id = _this.partnerOrganisation.id || result.key;
            _this.alertMessage = new alert_message_model_1.AlertMessageModel('ADD_PARTNER.SUCCESS_SAVED', Enums_1.AlertMessageType.Success);
            _this._userService.getUserByEmail(_this.partnerOrganisation.email)
                .takeUntil(_this.ngUnsubscribe)
                .subscribe(function (user) {
                if (!user) {
                    jQuery('#redirect-partners').modal('show');
                }
                else {
                    setTimeout(function () { return _this.goBack(); }, Constants_1.Constants.ALERT_REDIRECT_DURATION);
                }
            });
        })
            .catch(function (err) {
            if (err instanceof display_error_1.DisplayError) {
                _this.alertMessage = new alert_message_model_1.AlertMessageModel(err.message);
            }
            else {
                console.log(err);
                _this.alertMessage = new alert_message_model_1.AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
        });
    };
    AddPartnerOrganisationComponent.prototype.saveSector = function (pin, i) {
        var project = this.partnerOrganisation.projects[pin];
        if (project.sector[i]) {
            project.sector.splice(i, 1);
        }
        else {
            project.sector[i] = true;
        }
    };
    AddPartnerOrganisationComponent.prototype.addProject = function () {
        var newProject = new partner_organisation_model_1.PartnerOrganisationProjectModel();
        this.partnerOrganisation.projects.push(newProject);
        this.setActiveProject(newProject);
    };
    AddPartnerOrganisationComponent.prototype.removeProject = function (pin) {
        this.partnerOrganisation.projects.splice(pin, 1);
        this.setActiveProject(this.partnerOrganisation.projects[0]);
    };
    AddPartnerOrganisationComponent.prototype.setActiveProject = function (project) {
        this.activeProject = project;
    };
    AddPartnerOrganisationComponent.prototype.addProjectLocation = function (pin) {
        this.partnerOrganisation.projects[pin].operationAreas.push(new operation_area_model_1.OperationAreaModel());
    };
    AddPartnerOrganisationComponent.prototype.removeProjectLocation = function (pin, opin) {
        this.partnerOrganisation.projects[pin].operationAreas.splice(opin, 1);
    };
    AddPartnerOrganisationComponent.prototype.goBack = function () {
        if (this.fromResponsePlans) {
            this.router.navigateByUrl('response-plans/create-edit-response-plan');
        }
        else {
            this.router.navigateByUrl('country-admin/country-staff');
        }
    };
    AddPartnerOrganisationComponent.prototype.redirectToPartnersPage = function () {
        this.closeModal();
        var user = new user_public_model_1.ModelUserPublic(this.partnerOrganisation.firstName, this.partnerOrganisation.lastName, this.partnerOrganisation.title, this.partnerOrganisation.email);
        user.phone = this.partnerOrganisation.phone;
        this._sessionService.user = user;
        var partner = new partner_model_1.PartnerModel();
        partner.partnerOrganisationId = this.partnerOrganisation.id;
        partner.position = this.partnerOrganisation.position;
        this._sessionService.partner = partner;
        this.router.navigateByUrl('country-admin/country-staff/country-add-edit-partner');
    };
    AddPartnerOrganisationComponent.prototype.closeModal = function () {
        jQuery('#redirect-partners').modal('hide');
        this.goBack();
    };
    AddPartnerOrganisationComponent.prototype.validateProject = function (project) {
        var _this = this;
        this.alertMessage = project.validate();
        if (!this.alertMessage) {
            project.operationAreas.forEach(function (operationArea) {
                _this.alertMessage = _this.validateOperationArea(operationArea);
            });
        }
        if (this.alertMessage) {
            this.setActiveProject(project);
            return this.alertMessage;
        }
        return null;
    };
    AddPartnerOrganisationComponent.prototype.validateOperationArea = function (operationArea) {
        var excludeFields = [];
        var countryLevel1Exists = operationArea.country
            && this.countryLevelsValues[operationArea.country].levelOneValues
            && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
        if (!countryLevel1Exists) {
            excludeFields.push("level1", "level2");
        }
        else if (countryLevel1Exists && operationArea.level1
            && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues
                || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].length < 1)) {
            excludeFields.push("level2");
        }
        return operationArea.validate(excludeFields);
    };
    return AddPartnerOrganisationComponent;
}());
AddPartnerOrganisationComponent = __decorate([
    core_1.Component({
        selector: 'app-add-partner-organisation',
        templateUrl: './add-partner-organisation.component.html',
        styleUrls: ['./add-partner-organisation.component.css'],
        providers: [partner_organisation_service_1.PartnerOrganisationService, user_service_1.UserService]
    })
], AddPartnerOrganisationComponent);
exports.AddPartnerOrganisationComponent = AddPartnerOrganisationComponent;
