"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var angularfire2_1 = require("angularfire2");
var app_component_1 = require("./app.component");
var login_component_1 = require("./login/login.component");
var system_admin_component_1 = require("./system-admin/agency/system-admin.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var response_plans_component_1 = require("./response-plans/response-plans.component");
var preparedness_component_1 = require("./preparedness/preparedness.component");
var risk_monitoring_component_1 = require("./risk-monitoring/risk-monitoring.component");
var country_office_profile_component_1 = require("./country-admin/country-office-profile/country-office-profile.component");
var map_component_1 = require("./map/map.component");
var donor_module_component_1 = require("./donor-module/donor-module.component");
var app_routing_module_1 = require("./app-routing.module");
var forgot_password_component_1 = require("./login/forgot-password/forgot-password.component");
var add_agency_component_1 = require("./system-admin/add-agency/add-agency.component");
var messages_component_1 = require("./system-admin/messages/messages.component");
var system_admin_menu_component_1 = require("./system-admin/system-admin-menu/system-admin-menu.component");
var messages_create_component_1 = require("./system-admin/messages/messages-create/messages-create.component");
var min_prep_component_1 = require("./system-admin/min-prep/min-prep.component");
var mpa_component_1 = require("./system-admin/mpa/mpa.component");
var create_action_component_1 = require("./system-admin/min-prep/create-action/create-action.component");
var create_mpa_action_component_1 = require("./system-admin/mpa/create-mpa-action/create-mpa-action.component");
var system_settings_component_1 = require("./system-admin/system-settings/system-settings.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
require("hammerjs");
var system_admin_header_component_1 = require("./system-admin/system-admin-header/system-admin-header.component");
var core_2 = require("@ngx-translate/core");
var http_loader_1 = require("@ngx-translate/http-loader");
var country_office_component_1 = require("./agency-admin/country-office/country-office.component");
var create_edit_country_component_1 = require("./agency-admin/country-office/create-edit-country/create-edit-country.component");
var create_edit_mpa_component_1 = require("./agency-admin/agency-mpa/create-edit-mpa/create-edit-mpa.component");
var settings_menu_component_1 = require("./agency-admin/settings/settings-menu/settings-menu.component");
var agency_admin_menu_component_1 = require("./agency-admin/agency-admin-menu/agency-admin-menu.component");
var department_component_1 = require("./agency-admin/settings/department/department.component");
var skills_component_1 = require("./agency-admin/settings/skills/skills.component");
var modules_component_1 = require("./agency-admin/settings/modules/modules.component");
var clock_settings_component_1 = require("./agency-admin/settings/clock-settings/clock-settings.component");
var documents_component_1 = require("./agency-admin/settings/documents/documents.component");
var network_component_1 = require("./agency-admin/settings/network/network.component");
var create_edit_network_component_1 = require("./agency-admin/settings/network/create-edit-network/create-edit-network.component");
var notification_component_1 = require("./agency-admin/settings/notification/notification.component");
var create_edit_notification_component_1 = require("./agency-admin/settings/notification/create-edit-notification/create-edit-notification.component");
var staff_component_1 = require("./agency-admin/staff/staff.component");
var create_edit_staff_component_1 = require("./agency-admin/staff/create-edit-staff/create-edit-staff.component");
var agency_mpa_component_1 = require("./agency-admin/agency-mpa/agency-mpa.component");
var agency_messages_component_1 = require("./agency-admin/agency-messages/agency-messages.component");
var create_edit_message_component_1 = require("./agency-admin/agency-messages/create-edit-message/create-edit-message.component");
var agency_admin_header_component_1 = require("./agency-admin/agency-admin-header/agency-admin-header.component");
var account_settings_component_1 = require("./system-admin/account-settings/account-settings.component");
var change_password_component_1 = require("./system-admin/account-settings/change-password/change-password.component");
var global_networks_component_1 = require("./system-admin/global-networks/global-networks.component");
var create_edit_global_network_component_1 = require("./system-admin/global-networks/create-edit-global-network/create-edit-global-network.component");
var add_generic_action_component_1 = require("./agency-admin/agency-mpa/add-generic-action/add-generic-action.component");
var agency_account_settings_component_1 = require("./agency-admin/agency-account-settings/agency-account-settings.component");
var agency_account_details_component_1 = require("./agency-admin/agency-account-details/agency-account-details.component");
var agency_change_password_component_1 = require("./agency-admin/agency-account-settings/agency-change-password/agency-change-password.component");
var create_edit_region_component_1 = require("./agency-admin/country-office/create-edit-region/create-edit-region.component");
var RxHelper_1 = require("./utils/RxHelper");
var angular2_modal_1 = require("angular2-modal");
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var bootstrap_2 = require("angular2-modal/plugins/bootstrap");
var agency_admin_settings_response_plan_component_1 = require("./agency-admin/settings/agency-admin-settings-response-plan/agency-admin-settings-response-plan.component");
var system_settings_response_plans_component_1 = require("./system-admin/system-settings/system-settings-response-plans/system-settings-response-plans.component");
var system_settings_documents_component_1 = require("./system-admin/system-settings/system-settings-documents/system-settings-documents.component");
var new_agency_password_component_1 = require("./agency-admin/new-agency/new-agency-password/new-agency-password.component");
var new_agency_details_component_1 = require("./agency-admin/new-agency/new-agency-details/new-agency-details.component");
var keys_pipe_1 = require("./utils/pipes/keys.pipe");
var enum_keys_pipe_1 = require("./utils/pipes/enum-keys.pipe");
var key_values_pipe_1 = require("./utils/pipes/key-values.pipe");
var new_country_details_component_1 = require("./country-admin/new-country/new-country-details/new-country-details.component");
var new_country_password_component_1 = require("./country-admin/new-country/new-country-password/new-country-password.component");
var country_account_settings_component_1 = require("./country-admin/country-account-settings/country-account-settings.component");
var country_change_password_component_1 = require("./country-admin/country-account-settings/country-change-password/country-change-password.component");
var country_admin_header_component_1 = require("./country-admin/country-admin-header/country-admin-header.component");
var country_admin_menu_component_1 = require("./country-admin/country-admin-menu/country-admin-menu.component");
var country_messages_component_1 = require("./country-admin/country-messages/country-messages.component");
var country_create_edit_message_component_1 = require("./country-admin/country-messages/country-create-edit-message/country-create-edit-message.component");
var country_permission_settings_component_1 = require("./country-admin/settings/country-permission-settings/country-permission-settings.component");
var country_modules_settings_component_1 = require("./country-admin/settings/country-modules-settings/country-modules-settings.component");
var country_clock_settings_component_1 = require("./country-admin/settings/country-clock-settings/country-clock-settings.component");
var country_notification_settings_component_1 = require("./country-admin/settings/country-notification-settings/country-notification-settings.component");
var country_add_external_recipient_component_1 = require("./country-admin/settings/country-notification-settings/country-add-external-recipient/country-add-external-recipient.component");
var country_staff_component_1 = require("./country-admin/country-staff/country-staff.component");
var country_add_edit_partner_component_1 = require("./country-admin/country-staff/country-add-edit-partner/country-add-edit-partner.component");
var country_add_edit_staff_component_1 = require("./country-admin/country-staff/country-add-edit-staff/country-add-edit-staff.component");
var create_edit_response_plan_component_1 = require("./response-plans/create-edit-response-plan/create-edit-response-plan.component");
var add_partner_organisation_component_1 = require("./response-plans/add-partner-organisation/add-partner-organisation.component");
var ordinal_pipe_1 = require("./utils/pipes/ordinal.pipe");
var status_alert_component_1 = require("./commons/status-alert/status-alert.component");
var agency_notifications_component_1 = require("./agency-admin/agency-notifications/agency-notifications.component");
var angular2_material_datepicker_1 = require("angular2-material-datepicker");
var minimum_component_1 = require("./preparedness/minimum/minimum.component");
var advanced_component_1 = require("./preparedness/advanced/advanced.component");
var budget_component_1 = require("./preparedness/budget/budget.component");
var select_component_1 = require("./preparedness/select/select.component");
var create_edit_component_1 = require("./preparedness/create-edit/create-edit.component");
var create_alert_component_1 = require("./risk-monitoring/create-alert/create-alert.component");
var add_indicator_component_1 = require("./risk-monitoring/add-indicator/add-indicator.component");
var add_hazard_component_1 = require("./risk-monitoring/add-hazard/add-hazard.component");
var country_my_agency_component_1 = require("./country-admin/country-my-agency/country-my-agency.component");
var export_test_component_1 = require("./export-test/export-test.component");
var angular_2_local_storage_1 = require("angular-2-local-storage");
var country_agencies_component_1 = require("./country-admin/country-agencies/country-agencies.component");
var agency_submenu_component_1 = require("./preparedness/agency-submenu/agency-submenu.component");
var country_submenu_component_1 = require("./preparedness/country-submenu/country-submenu.component");
var alert_widget_component_1 = require("./commons/alert-widget/alert-widget.component");
var map_countries_list_component_1 = require("./map/map-countries-list/map-countries-list.component");
var user_service_1 = require("./services/user.service");
var dashboard_seasonal_calendar_component_1 = require("./dashboard/dashboard-seasonal-calendar/dashboard-seasonal-calendar.component");
var dashboard_update_alert_level_component_1 = require("./dashboard/dashboard-update-alert-level/dashboard-update-alert-level.component");
var session_service_1 = require("./services/session.service");
var common_service_1 = require("./services/common.service");
var settings_service_1 = require("./services/settings.service");
var settings_menu_component_2 = require("./country-admin/settings/settings-menu/settings-menu.component");
var office_profile_menu_component_1 = require("./country-admin/country-office-profile/office-profile-menu/office-profile-menu.component");
var enum_keyValues_pipe_1 = require("./utils/pipes/enum-keyValues.pipe");
var replace_pipe_1 = require("./utils/pipes/replace.pipe");
var message_service_1 = require("./services/message.service");
var notification_settings_service_1 = require("./services/notification-settings.service");
var review_response_plan_component_1 = require("./dashboard/review-response-plan/review-response-plan.component");
var facetoface_meeting_request_component_1 = require("./dashboard/facetoface-meeting-request/facetoface-meeting-request.component");
var country_statistics_ribbon_component_1 = require("./country-statistics-ribbon/country-statistics-ribbon.component");
var view_response_plan_component_1 = require("./commons/view-response-plan/view-response-plan.component");
var partners_component_1 = require("./country-admin/country-office-profile/partners/partners.component");
var view_plan_component_1 = require("./response-plans/view-plan/view-plan.component");
var external_partner_response_plan_component_1 = require("./response-plans/external-partner-response-plan/external-partner-response-plan.component");
function HttpLoaderFactory(http) {
    return new http_loader_1.TranslateHttpLoader(http);
}
exports.HttpLoaderFactory = HttpLoaderFactory;

/*SAND/ TEST/ UAT*/
exports.firebaseConfig = {
    apiKey: "AIzaSyDC5QFD23t701ackZXBFhurvsMoIdJ3JZQ",
    authDomain: "alert-190fa.firebaseapp.com",
    databaseURL: "https://alert-190fa.firebaseio.com",
    storageBucket: "alert-190fa.appspot.com",
    messagingSenderId: "305491871378"
};

/*LIVE*/
// exports.firebaseConfig = {
//   apiKey: "AIzaSyC3HmARInyyYi6B8IGRkEZV_gQR0SoGgjU",
//   authDomain: "alert-live.firebaseapp.com",
//   databaseURL: "https://alert-live.firebaseio.com",
//   storageBucket: "alert-live.appspot.com",
//   messagingSenderId: "44847393433"
// };

var firebaseAuthConfig = {
    provider: angularfire2_1.AuthProviders.Google,
    method: angularfire2_1.AuthMethods.Redirect
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            replace_pipe_1.ReplacePipe,
            app_component_1.AppComponent,
            login_component_1.LoginComponent,
            system_admin_component_1.SystemAdminComponent,
            dashboard_component_1.DashboardComponent,
            response_plans_component_1.ResponsePlansComponent,
            preparedness_component_1.PreparednessComponent,
            risk_monitoring_component_1.RiskMonitoringComponent,
            country_office_profile_component_1.CountryOfficeProfileComponent,
            map_component_1.MapComponent,
            donor_module_component_1.DonorModuleComponent,
            forgot_password_component_1.ForgotPasswordComponent,
            add_agency_component_1.AddAgencyComponent,
            messages_component_1.MessagesComponent,
            system_admin_menu_component_1.SystemAdminMenuComponent,
            messages_create_component_1.MessagesCreateComponent,
            min_prep_component_1.MinPrepComponent,
            mpa_component_1.MpaComponent,
            create_action_component_1.CreateActionComponent,
            create_mpa_action_component_1.CreateMpaActionComponent,
            system_settings_component_1.SystemSettingsComponent,
            system_admin_header_component_1.SystemAdminHeaderComponent,
            country_office_component_1.CountryOfficeComponent,
            create_edit_country_component_1.CreateEditCountryComponent,
            create_edit_mpa_component_1.CreateEditMpaComponent,
            settings_menu_component_1.SettingsMenuComponent,
            settings_menu_component_2.CountryAdminSettingsMenuComponent,
            office_profile_menu_component_1.CountryOfficeProfileMenuComponent,
            partners_component_1.CountryOfficePartnersComponent,
            agency_admin_menu_component_1.AgencyAdminMenuComponent,
            department_component_1.DepartmentComponent,
            skills_component_1.SkillsComponent,
            modules_component_1.ModulesComponent,
            clock_settings_component_1.ClockSettingsComponent,
            documents_component_1.DocumentsComponent,
            network_component_1.NetworkComponent,
            create_edit_network_component_1.CreateEditNetworkComponent,
            notification_component_1.NotificationComponent,
            create_edit_notification_component_1.CreateEditNotificationComponent,
            staff_component_1.StaffComponent,
            create_edit_staff_component_1.CreateEditStaffComponent,
            agency_mpa_component_1.AgencyMpaComponent,
            agency_messages_component_1.AgencyMessagesComponent,
            create_edit_message_component_1.CreateEditMessageComponent,
            agency_admin_header_component_1.AgencyAdminHeaderComponent,
            account_settings_component_1.AccountSettingsComponent,
            change_password_component_1.ChangePasswordComponent,
            global_networks_component_1.GlobalNetworksComponent,
            create_edit_global_network_component_1.CreateEditGlobalNetworkComponent,
            create_edit_region_component_1.CreateEditRegionComponent,
            add_generic_action_component_1.AddGenericActionComponent,
            agency_account_settings_component_1.AgencyAccountSettingsComponent,
            agency_account_details_component_1.AgencyAccountDetailsComponent,
            agency_change_password_component_1.AgencyChangePasswordComponent,
            agency_admin_settings_response_plan_component_1.AgencyAdminSettingsResponsePlanComponent,
            system_settings_response_plans_component_1.SystemSettingsResponsePlansComponent,
            system_settings_documents_component_1.SystemSettingsDocumentsComponent,
            new_agency_password_component_1.NewAgencyPasswordComponent,
            new_agency_details_component_1.NewAgencyDetailsComponent,
            keys_pipe_1.KeysPipe,
            enum_keys_pipe_1.EnumKeysPipe,
            enum_keyValues_pipe_1.EnumKeyValuesPipe,
            key_values_pipe_1.KeyValuesPipe,
            new_country_details_component_1.NewCountryDetailsComponent,
            new_country_password_component_1.NewCountryPasswordComponent,
            country_account_settings_component_1.CountryAccountSettingsComponent,
            country_change_password_component_1.CountryChangePasswordComponent,
            country_admin_header_component_1.CountryAdminHeaderComponent,
            country_admin_menu_component_1.CountryAdminMenuComponent,
            country_messages_component_1.CountryMessagesComponent,
            country_create_edit_message_component_1.CountryCreateEditMessageComponent,
            country_permission_settings_component_1.CountryPermissionSettingsComponent,
            country_modules_settings_component_1.CountryModulesSettingsComponent,
            country_clock_settings_component_1.CountryClockSettingsComponent,
            country_notification_settings_component_1.CountryNotificationSettingsComponent,
            country_add_external_recipient_component_1.CountryAddExternalRecipientComponent,
            country_staff_component_1.CountryStaffComponent,
            country_add_edit_partner_component_1.CountryAddEditPartnerComponent,
            country_add_edit_staff_component_1.CountryAddEditStaffComponent,
            create_edit_response_plan_component_1.CreateEditResponsePlanComponent,
            add_partner_organisation_component_1.AddPartnerOrganisationComponent,
            ordinal_pipe_1.OrdinalPipe,
            status_alert_component_1.StatusAlertComponent,
            agency_notifications_component_1.AgencyNotificationsComponent,
            minimum_component_1.MinimumPreparednessComponent,
            advanced_component_1.AdvancedPreparednessComponent,
            budget_component_1.BudgetPreparednessComponent,
            select_component_1.SelectPreparednessComponent,
            create_edit_component_1.CreateEditPreparednessComponent,
            create_alert_component_1.CreateAlertRiskMonitoringComponent,
            add_indicator_component_1.AddIndicatorRiskMonitoringComponent,
            add_hazard_component_1.AddHazardRiskMonitoringComponent,
            agency_submenu_component_1.AgencySubmenuComponent,
            country_submenu_component_1.CountrySubmenuComponent,
            alert_widget_component_1.AlertWidgetComponent,
            country_my_agency_component_1.CountryMyAgencyComponent,
            map_countries_list_component_1.MapCountriesListComponent,
            export_test_component_1.ExportTestComponent,
            dashboard_seasonal_calendar_component_1.DashboardSeasonalCalendarComponent,
            dashboard_update_alert_level_component_1.DashboardUpdateAlertLevelComponent,
            country_agencies_component_1.CountryAgenciesComponent,
            review_response_plan_component_1.ReviewResponsePlanComponent,
            facetoface_meeting_request_component_1.FacetofaceMeetingRequestComponent,
            country_statistics_ribbon_component_1.CountryStatisticsRibbonComponent,
            view_response_plan_component_1.ViewResponsePlanComponent,
            view_plan_component_1.ViewPlanComponent,
            external_partner_response_plan_component_1.ExternalPartnerResponsePlan
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_module_1.AppRoutingModule,
            angularfire2_1.AngularFireModule.initializeApp(exports.firebaseConfig, firebaseAuthConfig),
            ng_bootstrap_1.NgbModule.forRoot(),
            core_2.TranslateModule.forRoot({
                loader: {
                    provide: core_2.TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [http_1.Http]
                }
            }),
            angular2_modal_1.ModalModule.forRoot(),
            bootstrap_1.BootstrapModalModule,
            angular2_material_datepicker_1.DatepickerModule,
            angular_2_local_storage_1.LocalStorageModule.withConfig({
                prefix: 'my-app',
                storageType: 'localStorage'
            })
        ],
        providers: [RxHelper_1.RxHelper, bootstrap_2.Modal, user_service_1.UserService, session_service_1.SessionService, common_service_1.CommonService, settings_service_1.SettingsService, message_service_1.MessageService, notification_settings_service_1.NotificationSettingsService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
