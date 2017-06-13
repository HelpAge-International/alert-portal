"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var login_component_1 = require("./login/login.component");
var forgot_password_component_1 = require("./login/forgot-password/forgot-password.component");
var system_admin_component_1 = require("./system-admin/agency/system-admin.component");
var add_agency_component_1 = require("./system-admin/add-agency/add-agency.component");
var messages_component_1 = require("./system-admin/messages/messages.component");
var messages_create_component_1 = require("./system-admin/messages/messages-create/messages-create.component");
var min_prep_component_1 = require("./system-admin/min-prep/min-prep.component");
var mpa_component_1 = require("./system-admin/mpa/mpa.component");
var create_action_component_1 = require("./system-admin/min-prep/create-action/create-action.component");
var create_mpa_action_component_1 = require("./system-admin/mpa/create-mpa-action/create-mpa-action.component");
var country_office_component_1 = require("./agency-admin/country-office/country-office.component");
var create_edit_country_component_1 = require("./agency-admin/country-office/create-edit-country/create-edit-country.component");
var agency_mpa_component_1 = require("./agency-admin/agency-mpa/agency-mpa.component");
var create_edit_mpa_component_1 = require("./agency-admin/agency-mpa/create-edit-mpa/create-edit-mpa.component");
var staff_component_1 = require("./agency-admin/staff/staff.component");
var create_edit_staff_component_1 = require("./agency-admin/staff/create-edit-staff/create-edit-staff.component");
var create_edit_message_component_1 = require("./agency-admin/agency-messages/create-edit-message/create-edit-message.component");
var agency_messages_component_1 = require("./agency-admin/agency-messages/agency-messages.component");
var department_component_1 = require("./agency-admin/settings/department/department.component");
var skills_component_1 = require("./agency-admin/settings/skills/skills.component");
var modules_component_1 = require("./agency-admin/settings/modules/modules.component");
var clock_settings_component_1 = require("./agency-admin/settings/clock-settings/clock-settings.component");
var agency_admin_settings_response_plan_component_1 = require("./agency-admin/settings/agency-admin-settings-response-plan/agency-admin-settings-response-plan.component");
var documents_component_1 = require("./agency-admin/settings/documents/documents.component");
var notification_component_1 = require("./agency-admin/settings/notification/notification.component");
var account_settings_component_1 = require("./system-admin/account-settings/account-settings.component");
var change_password_component_1 = require("./system-admin/account-settings/change-password/change-password.component");
var global_networks_component_1 = require("./system-admin/global-networks/global-networks.component");
var create_edit_global_network_component_1 = require("./system-admin/global-networks/create-edit-global-network/create-edit-global-network.component");
var add_generic_action_component_1 = require("./agency-admin/agency-mpa/add-generic-action/add-generic-action.component");
var agency_account_details_component_1 = require("./agency-admin/agency-account-details/agency-account-details.component");
var agency_account_settings_component_1 = require("./agency-admin/agency-account-settings/agency-account-settings.component");
var agency_change_password_component_1 = require("./agency-admin/agency-account-settings/agency-change-password/agency-change-password.component");
var create_edit_region_component_1 = require("./agency-admin/country-office/create-edit-region/create-edit-region.component");
var system_settings_documents_component_1 = require("./system-admin/system-settings/system-settings-documents/system-settings-documents.component");
var system_settings_response_plans_component_1 = require("./system-admin/system-settings/system-settings-response-plans/system-settings-response-plans.component");
var system_settings_component_1 = require("./system-admin/system-settings/system-settings.component");
var new_agency_password_component_1 = require("./agency-admin/new-agency/new-agency-password/new-agency-password.component");
var new_agency_details_component_1 = require("./agency-admin/new-agency/new-agency-details/new-agency-details.component");
var new_country_password_component_1 = require("./country-admin/new-country/new-country-password/new-country-password.component");
var new_country_details_component_1 = require("./country-admin/new-country/new-country-details/new-country-details.component");
var country_account_settings_component_1 = require("./country-admin/country-account-settings/country-account-settings.component");
var country_change_password_component_1 = require("./country-admin/country-account-settings/country-change-password/country-change-password.component");
var country_messages_component_1 = require("./country-admin/country-messages/country-messages.component");
var country_create_edit_message_component_1 = require("./country-admin/country-messages/country-create-edit-message/country-create-edit-message.component");
var country_notification_settings_component_1 = require("./country-admin/settings/country-notification-settings/country-notification-settings.component");
var country_permission_settings_component_1 = require("./country-admin/settings/country-permission-settings/country-permission-settings.component");
var country_modules_settings_component_1 = require("./country-admin/settings/country-modules-settings/country-modules-settings.component");
var country_clock_settings_component_1 = require("./country-admin/settings/country-clock-settings/country-clock-settings.component");
var country_add_external_recipient_component_1 = require("./country-admin/settings/country-notification-settings/country-add-external-recipient/country-add-external-recipient.component");
var country_staff_component_1 = require("./country-admin/country-staff/country-staff.component");
var country_add_edit_partner_component_1 = require("./country-admin/country-staff/country-add-edit-partner/country-add-edit-partner.component");
var country_add_edit_staff_component_1 = require("./country-admin/country-staff/country-add-edit-staff/country-add-edit-staff.component");
var response_plans_component_1 = require("./response-plans/response-plans.component");
var create_edit_response_plan_component_1 = require("./response-plans/create-edit-response-plan/create-edit-response-plan.component");
var add_partner_organisation_component_1 = require("./response-plans/add-partner-organisation/add-partner-organisation.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var risk_monitoring_component_1 = require("./risk-monitoring/risk-monitoring.component");
var map_component_1 = require("./map/map.component");
var preparedness_component_1 = require("./preparedness/preparedness.component");
var minimum_component_1 = require("./preparedness/minimum/minimum.component");
var advanced_component_1 = require("./preparedness/advanced/advanced.component");
var budget_component_1 = require("./preparedness/budget/budget.component");
var select_component_1 = require("./preparedness/select/select.component");
var create_edit_component_1 = require("./preparedness/create-edit/create-edit.component");
var country_office_profile_component_1 = require("./country-admin/country-office-profile/country-office-profile.component");
var agency_notifications_component_1 = require("./agency-admin/agency-notifications/agency-notifications.component");
var export_test_component_1 = require("./export-test/export-test.component");
var create_alert_component_1 = require("./risk-monitoring/create-alert/create-alert.component");
var add_indicator_component_1 = require("./risk-monitoring/add-indicator/add-indicator.component");
var add_hazard_component_1 = require("./risk-monitoring/add-hazard/add-hazard.component");
var map_countries_list_component_1 = require("./map/map-countries-list/map-countries-list.component");
var country_my_agency_component_1 = require("./country-admin/country-my-agency/country-my-agency.component");
var country_agencies_component_1 = require("./country-admin/country-agencies/country-agencies.component");
var dashboard_seasonal_calendar_component_1 = require("./dashboard/dashboard-seasonal-calendar/dashboard-seasonal-calendar.component");
var dashboard_update_alert_level_component_1 = require("./dashboard/dashboard-update-alert-level/dashboard-update-alert-level.component");
var review_response_plan_component_1 = require("./dashboard/review-response-plan/review-response-plan.component");
var facetoface_meeting_request_component_1 = require("./dashboard/facetoface-meeting-request/facetoface-meeting-request.component");
var view_response_plan_component_1 = require("./commons/view-response-plan/view-response-plan.component");
var partners_component_1 = require("./country-admin/country-office-profile/partners/partners.component");
var view_plan_component_1 = require("./response-plans/view-plan/view-plan.component");
var external_partner_response_plan_component_1 = require("./response-plans/external-partner-response-plan/external-partner-response-plan.component");
var routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    /**
     * Login
     */
    { path: 'forgot-password', component: forgot_password_component_1.ForgotPasswordComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'login/:emailEntered', component: login_component_1.LoginComponent },
    /**
     * System admin
     */
    { path: 'system-admin/min-prep/create', component: create_action_component_1.CreateActionComponent },
    { path: 'system-admin/min-prep/create/:id', component: create_action_component_1.CreateActionComponent },
    { path: 'system-admin/min-prep', component: min_prep_component_1.MinPrepComponent },
    { path: 'system-admin/mpa/create', component: create_mpa_action_component_1.CreateMpaActionComponent },
    { path: 'system-admin/mpa/create/:id', component: create_mpa_action_component_1.CreateMpaActionComponent },
    { path: 'system-admin/mpa', component: mpa_component_1.MpaComponent },
    { path: 'system-admin/add-agency', component: add_agency_component_1.AddAgencyComponent },
    { path: 'system-admin/add-agency/:id', component: add_agency_component_1.AddAgencyComponent },
    { path: 'system-admin/messages/create', component: messages_create_component_1.MessagesCreateComponent },
    { path: 'system-admin/messages', component: messages_component_1.MessagesComponent },
    { path: 'system-admin/agency', component: system_admin_component_1.SystemAdminComponent },
    { path: 'system-admin/account-settings', component: account_settings_component_1.AccountSettingsComponent },
    { path: 'system-admin/account-settings/change-password', component: change_password_component_1.ChangePasswordComponent },
    { path: 'system-admin/network', component: global_networks_component_1.GlobalNetworksComponent },
    { path: 'system-admin/network/create', component: create_edit_global_network_component_1.CreateEditGlobalNetworkComponent },
    { path: 'system-admin/network/create:id', component: create_edit_global_network_component_1.CreateEditGlobalNetworkComponent },
    { path: 'system-admin/system-settings', component: system_settings_component_1.SystemSettingsComponent },
    { path: 'system-admin/system-settings/system-settings-documents', component: system_settings_documents_component_1.SystemSettingsDocumentsComponent },
    {
        path: 'system-admin/system-settings/system-settings-response-plans',
        component: system_settings_response_plans_component_1.SystemSettingsResponsePlansComponent
    },
    /**
     * Agency admin
     */
    { path: 'agency-admin/new-agency/new-agency-password', component: new_agency_password_component_1.NewAgencyPasswordComponent },
    { path: 'agency-admin/new-agency/new-agency-details', component: new_agency_details_component_1.NewAgencyDetailsComponent },
    { path: 'agency-admin/country-office', component: country_office_component_1.CountryOfficeComponent },
    { path: 'agency-admin/country-office/create-edit-country', component: create_edit_country_component_1.CreateEditCountryComponent },
    { path: 'agency-admin/country-office/create-edit-region', component: create_edit_region_component_1.CreateEditRegionComponent },
    { path: 'agency-admin/country-office/create-edit-region:id', component: create_edit_region_component_1.CreateEditRegionComponent },
    { path: 'agency-admin/agency-mpa', component: agency_mpa_component_1.AgencyMpaComponent },
    { path: 'agency-admin/agency-mpa/create-edit-mpa', component: create_edit_mpa_component_1.CreateEditMpaComponent },
    { path: 'agency-admin/agency-mpa/add-generic-action', component: add_generic_action_component_1.AddGenericActionComponent },
    { path: 'agency-admin/country-office/create-edit-country/:id', component: create_edit_country_component_1.CreateEditCountryComponent },
    { path: 'agency-admin/agency-messages/create-edit-message', component: create_edit_message_component_1.CreateEditMessageComponent },
    { path: 'agency-admin/agency-messages/create-edit-message/:id', component: create_edit_message_component_1.CreateEditMessageComponent },
    { path: 'agency-admin/agency-messages', component: agency_messages_component_1.AgencyMessagesComponent },
    { path: 'agency-admin/settings/departments', component: department_component_1.DepartmentComponent },
    { path: 'agency-admin/settings/skills', component: skills_component_1.SkillsComponent },
    { path: 'agency-admin/settings/modules', component: modules_component_1.ModulesComponent },
    { path: 'agency-admin/settings/clock-settings', component: clock_settings_component_1.ClockSettingsComponent },
    { path: 'agency-admin/settings/response-plans', component: agency_admin_settings_response_plan_component_1.AgencyAdminSettingsResponsePlanComponent },
    { path: 'agency-admin/settings/documents', component: documents_component_1.DocumentsComponent },
    { path: 'agency-admin/settings/notifications', component: notification_component_1.NotificationComponent },
    { path: 'agency-admin/settings', redirectTo: 'agency-admin/settings/departments', pathMatch: 'full' },
    { path: 'agency-admin/staff', component: staff_component_1.StaffComponent },
    { path: 'agency-admin/staff/create-edit-staff', component: create_edit_staff_component_1.CreateEditStaffComponent },
    { path: 'agency-admin/staff/create-edit-staff:id', component: create_edit_staff_component_1.CreateEditStaffComponent },
    { path: 'agency-admin/agency-account-settings', component: agency_account_settings_component_1.AgencyAccountSettingsComponent },
    { path: 'agency-admin/agency-account-details', component: agency_account_details_component_1.AgencyAccountDetailsComponent },
    { path: 'agency-admin/agency-account-settings/agency-change-password', component: agency_change_password_component_1.AgencyChangePasswordComponent },
    { path: 'agency-admin/agency-notifications/agency-notifications', component: agency_notifications_component_1.AgencyNotificationsComponent },
    /**
     * Country admin
     */
    { path: 'country-admin/new-country/new-country-password', component: new_country_password_component_1.NewCountryPasswordComponent },
    { path: 'country-admin/new-country/new-country-details', component: new_country_details_component_1.NewCountryDetailsComponent },
    { path: 'country-admin/country-account-settings', component: country_account_settings_component_1.CountryAccountSettingsComponent },
    { path: 'country-admin/country-account-settings/country-change-password', component: country_change_password_component_1.CountryChangePasswordComponent },
    { path: 'country-admin/country-messages', component: country_messages_component_1.CountryMessagesComponent },
    { path: 'country-admin/country-messages/country-create-edit-message', component: country_create_edit_message_component_1.CountryCreateEditMessageComponent },
    {
        path: 'country-admin/country-messages/country-create-edit-message/:id',
        component: country_create_edit_message_component_1.CountryCreateEditMessageComponent
    },
    { path: 'country-admin/settings/country-clock-settings', component: country_clock_settings_component_1.CountryClockSettingsComponent },
    { path: 'country-admin/settings/country-modules-settings', component: country_modules_settings_component_1.CountryModulesSettingsComponent },
    { path: 'country-admin/settings/country-permission-settings', component: country_permission_settings_component_1.CountryPermissionSettingsComponent },
    { path: 'country-admin/settings/country-notification-settings', component: country_notification_settings_component_1.CountryNotificationSettingsComponent },
    {
        path: 'country-admin/settings/country-notification-settings/country-add-external-recipient',
        component: country_add_external_recipient_component_1.CountryAddExternalRecipientComponent
    },
    { path: 'country-admin/country-staff', component: country_staff_component_1.CountryStaffComponent },
    { path: 'country-admin/country-staff/country-add-edit-partner', component: country_add_edit_partner_component_1.CountryAddEditPartnerComponent },
    { path: 'country-admin/country-staff/country-add-edit-staff', component: country_add_edit_staff_component_1.CountryAddEditStaffComponent },
    //{path: 'country-admin/country-office-profile/:countryId', component: CountryOfficeProfileComponent},
    { path: 'country-admin/country-office-profile', component: country_office_profile_component_1.CountryOfficeProfileComponent },
    { path: 'country-admin/country-office-profile/partners', component: partners_component_1.CountryOfficePartnersComponent },
    { path: 'country-admin/country-my-agency', component: country_my_agency_component_1.CountryMyAgencyComponent },
    { path: 'country-admin/country-agencies', component: country_agencies_component_1.CountryAgenciesComponent },
    /**
     * Dashboard
     */
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent },
    { path: 'dashboard/dashboard-seasonal-calendar', component: dashboard_seasonal_calendar_component_1.DashboardSeasonalCalendarComponent },
    { path: 'dashboard/dashboard-update-alert-level', component: dashboard_update_alert_level_component_1.DashboardUpdateAlertLevelComponent },
    { path: 'dashboard/dashboard-update-alert-level/:id/:countryId', component: dashboard_update_alert_level_component_1.DashboardUpdateAlertLevelComponent },
    { path: 'dashboard/facetoface-meeting-request', component: facetoface_meeting_request_component_1.FacetofaceMeetingRequestComponent },
    { path: 'dashboard/review-response-plan', component: review_response_plan_component_1.ReviewResponsePlanComponent },
    { path: 'dashboard/review-response-plan/:id', component: review_response_plan_component_1.ReviewResponsePlanComponent },
    /**
     * Risk Monitoring
     */
    { path: 'risk-monitoring', component: risk_monitoring_component_1.RiskMonitoringComponent },
    { path: 'risk-monitoring/create-alert', component: create_alert_component_1.CreateAlertRiskMonitoringComponent },
    { path: 'risk-monitoring/add-indicator/:hazardID/:indicatorID', component: add_indicator_component_1.AddIndicatorRiskMonitoringComponent },
    { path: 'risk-monitoring/add-indicator/:hazardID', component: add_indicator_component_1.AddIndicatorRiskMonitoringComponent },
    { path: 'risk-monitoring/add-hazard', component: add_hazard_component_1.AddHazardRiskMonitoringComponent },
    /**
     * Preparedness
     */
    { path: 'preparedness/minimum/:countryId/:agencyId', component: minimum_component_1.MinimumPreparednessComponent },
    { path: 'preparedness/minimum/:countryId', component: minimum_component_1.MinimumPreparednessComponent },
    { path: 'preparedness/minimum', component: minimum_component_1.MinimumPreparednessComponent },
    { path: 'preparedness/advanced/:countryId/:agencyId', component: advanced_component_1.AdvancedPreparednessComponent },
    { path: 'preparedness/advanced/:countryId', component: advanced_component_1.AdvancedPreparednessComponent },
    { path: 'preparedness/advanced', component: advanced_component_1.AdvancedPreparednessComponent },
    { path: 'preparedness/budget', component: budget_component_1.BudgetPreparednessComponent },
    { path: 'preparedness/select', component: select_component_1.SelectPreparednessComponent },
    { path: 'preparedness/create-edit-preparedness', component: create_edit_component_1.CreateEditPreparednessComponent },
    { path: 'preparedness/create-edit-preparedness/:id', component: create_edit_component_1.CreateEditPreparednessComponent },
    { path: 'preparedness', component: preparedness_component_1.PreparednessComponent },
    /**
     * Response Plans
     */
    { path: 'response-plans', component: response_plans_component_1.ResponsePlansComponent },
    { path: 'response-plans/create-edit-response-plan', component: create_edit_response_plan_component_1.CreateEditResponsePlanComponent },
    { path: 'response-plans/create-edit-response-plan/:id', component: create_edit_response_plan_component_1.CreateEditResponsePlanComponent },
    { path: 'response-plans/add-partner-organisation', component: add_partner_organisation_component_1.AddPartnerOrganisationComponent },
    { path: 'response-plans/add-partner-organisation/:fromResponsePlans', component: add_partner_organisation_component_1.AddPartnerOrganisationComponent },
    { path: 'response-plans/view-response-plan', component: view_response_plan_component_1.ViewResponsePlanComponent },
    { path: 'response-plans/view-response-plan/:id', component: view_response_plan_component_1.ViewResponsePlanComponent },
    { path: 'response-plans/view-response-plan/:id/:countryID', component: view_response_plan_component_1.ViewResponsePlanComponent },
    { path: 'response-plans/view-plan', component: view_plan_component_1.ViewPlanComponent },
    { path: 'response-plans/view-plan/:id', component: view_plan_component_1.ViewPlanComponent },
    { path: 'response-plans/external-partner-response-plan/:countryID/:id/:token', component: external_partner_response_plan_component_1.ExternalPartnerResponsePlan },
    /**
     * Maps
     */
    { path: 'map', component: map_component_1.MapComponent },
    { path: 'map/map-countries-list', component: map_countries_list_component_1.MapCountriesListComponent },
    /*
     * test
     * */
    { path: 'export', component: export_test_component_1.ExportTestComponent }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            router_1.RouterModule.forRoot(routes)
        ],
        exports: [
            router_1.RouterModule
        ],
        declarations: []
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
