import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ForgotPasswordComponent} from "./login/forgot-password/forgot-password.component";
import {SystemAdminComponent} from "./system-admin/agency/system-admin.component";
import {AddAgencyComponent} from "./system-admin/add-agency/add-agency.component";
import {MessagesComponent} from "./system-admin/messages/messages.component";
import {MessagesCreateComponent} from "./system-admin/messages/messages-create/messages-create.component";
import {MinPrepComponent} from "./system-admin/min-prep/min-prep.component";
import {MpaComponent} from "./system-admin/mpa/mpa.component";
import {CreateActionComponent} from "./system-admin/min-prep/create-action/create-action.component";
import {CreateMpaActionComponent} from './system-admin/mpa/create-mpa-action/create-mpa-action.component';
import {CountryOfficeComponent} from "./agency-admin/country-office/country-office.component";
import {CreateEditCountryComponent} from "./agency-admin/country-office/create-edit-country/create-edit-country.component";
import {AgencyMpaComponent} from "./agency-admin/agency-mpa/agency-mpa.component";
import {CreateEditMpaComponent} from "./agency-admin/agency-mpa/create-edit-mpa/create-edit-mpa.component";
import {StaffComponent} from "./agency-admin/staff/staff.component";
import {CreateEditStaffComponent} from "./agency-admin/staff/create-edit-staff/create-edit-staff.component";
import {CreateEditMessageComponent} from "./agency-admin/agency-messages/create-edit-message/create-edit-message.component";
import {AgencyMessagesComponent} from "./agency-admin/agency-messages/agency-messages.component";

import {DepartmentComponent} from "./agency-admin/settings/department/department.component";
import {SkillsComponent} from "./agency-admin/settings/skills/skills.component";
import {ModulesComponent} from "./agency-admin/settings/modules/modules.component";
import {ClockSettingsComponent} from "./agency-admin/settings/clock-settings/clock-settings.component";
import {AgencyAdminSettingsResponsePlanComponent} from "./agency-admin/settings/agency-admin-settings-response-plan/agency-admin-settings-response-plan.component";
import {DocumentsComponent} from "./agency-admin/settings/documents/documents.component";
import {NotificationComponent} from "./agency-admin/settings/notification/notification.component";

import {AccountSettingsComponent} from "./system-admin/account-settings/account-settings.component";
import {ChangePasswordComponent} from "./system-admin/account-settings/change-password/change-password.component";
import {GlobalNetworksComponent} from "./system-admin/global-networks/global-networks.component";
import {CreateEditGlobalNetworkComponent} from "./system-admin/global-networks/create-edit-global-network/create-edit-global-network.component";
import {AddGenericActionComponent} from "./agency-admin/agency-mpa/add-generic-action/add-generic-action.component";
import {AgencyAccountDetailsComponent} from "./agency-admin/agency-account-details/agency-account-details.component";
import {AgencyAccountSettingsComponent} from "./agency-admin/agency-account-settings/agency-account-settings.component";
import {AgencyChangePasswordComponent} from "./agency-admin/agency-account-settings/agency-change-password/agency-change-password.component";
import {CreateEditRegionComponent} from "./agency-admin/country-office/create-edit-region/create-edit-region.component";
import {SystemSettingsDocumentsComponent} from "./system-admin/system-settings/system-settings-documents/system-settings-documents.component";
import {SystemSettingsResponsePlansComponent} from "./system-admin/system-settings/system-settings-response-plans/system-settings-response-plans.component";
import {SystemSettingsComponent} from "./system-admin/system-settings/system-settings.component";
import {NewAgencyPasswordComponent} from "./agency-admin/new-agency/new-agency-password/new-agency-password.component";
import {NewAgencyDetailsComponent} from "./agency-admin/new-agency/new-agency-details/new-agency-details.component";
import {NewCountryPasswordComponent} from "./country-admin/new-country/new-country-password/new-country-password.component";
import {NewCountryDetailsComponent} from "./country-admin/new-country/new-country-details/new-country-details.component";
import {CountryAccountSettingsComponent} from "./country-admin/country-account-settings/country-account-settings.component";
import {CountryChangePasswordComponent} from "./country-admin/country-account-settings/country-change-password/country-change-password.component";
import {CountryMessagesComponent} from "./country-admin/country-messages/country-messages.component";
import {CountryCreateEditMessageComponent} from "./country-admin/country-messages/country-create-edit-message/country-create-edit-message.component";
import {CountryNotificationSettingsComponent} from "./country-admin/settings/country-notification-settings/country-notification-settings.component";
import {CountryPermissionSettingsComponent} from "./country-admin/settings/country-permission-settings/country-permission-settings.component";
import {CountryModulesSettingsComponent} from "./country-admin/settings/country-modules-settings/country-modules-settings.component";
import {CountryClockSettingsComponent} from "./country-admin/settings/country-clock-settings/country-clock-settings.component";
import {CountryAddExternalRecipientComponent} from "./country-admin/settings/country-notification-settings/country-add-external-recipient/country-add-external-recipient.component";
import {CountryStaffComponent} from "./country-admin/country-staff/country-staff.component";
import {CountryAddEditPartnerComponent} from "./country-admin/country-staff/country-add-edit-partner/country-add-edit-partner.component";
import {CountryAddEditStaffComponent} from "./country-admin/country-staff/country-add-edit-staff/country-add-edit-staff.component";
import {ResponsePlansComponent} from "./response-plans/response-plans.component";
import {CreateEditResponsePlanComponent} from "./response-plans/create-edit-response-plan/create-edit-response-plan.component";
import {AddPartnerOrganisationComponent} from "./response-plans/add-partner-organisation/add-partner-organisation.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {RiskMonitoringComponent} from "./risk-monitoring/risk-monitoring.component";
import {MapComponent} from "./map/map.component";
import {MinimumPreparednessComponent} from "./preparedness/minimum/minimum.component";
import {AdvancedPreparednessComponent} from "./preparedness/advanced/advanced.component";
import {BudgetPreparednessComponent} from "./preparedness/budget/budget.component";
import {SelectPreparednessComponent} from "./preparedness/select/select.component";
import {CreateEditPreparednessComponent} from "./preparedness/create-edit/create-edit.component";
import {CountryOfficeProfileComponent} from "./country-admin/country-office-profile/country-office-profile.component";
import {AgencyNotificationsComponent} from "./agency-admin/agency-notifications/agency-notifications.component";
import {ExportStartFundComponent} from "./export-start-fund/export-start-fund.component";

import {CreateAlertRiskMonitoringComponent} from './risk-monitoring/create-alert/create-alert.component';
import {AddIndicatorRiskMonitoringComponent} from './risk-monitoring/add-indicator/add-indicator.component';
import {AddHazardRiskMonitoringComponent} from './risk-monitoring/add-hazard/add-hazard.component';
import {MapCountriesListComponent} from "./map/map-countries-list/map-countries-list.component";

import {CountryMyAgencyComponent} from "./country-admin/country-my-agency/country-my-agency.component";
import {CountryAgenciesComponent} from "./country-admin/country-agencies/country-agencies.component";
import {DashboardSeasonalCalendarComponent} from "./dashboard/dashboard-seasonal-calendar/dashboard-seasonal-calendar.component";
import {DashboardUpdateAlertLevelComponent} from "./dashboard/dashboard-update-alert-level/dashboard-update-alert-level.component";
import {ReviewResponsePlanComponent} from "./dashboard/review-response-plan/review-response-plan.component";
import {FacetofaceMeetingRequestComponent} from "./dashboard/facetoface-meeting-request/facetoface-meeting-request.component";
import {ViewResponsePlanComponent} from "./commons/view-response-plan/view-response-plan.component";
import {CountryOfficePartnersComponent} from "./country-admin/country-office-profile/partners/partners.component";
import {ViewPlanComponent} from "./response-plans/view-plan/view-plan.component";
import {DirectorComponent} from "./director/director.component";
import {DirectorOverviewComponent} from "./director/director-overview/director-overview.component";
import {ExternalPartnerResponsePlan} from "./response-plans/external-partner-response-plan/external-partner-response-plan.component";
import {DonorModuleComponent} from "./donor-module/donor-module.component";
import {DonorCountryIndexComponent} from "./donor-module/donor-country-index/donor-country-index.component";
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import {CountryOfficeEquipmentComponent} from "./country-admin/country-office-profile/equipment/equipment.component";
import {CountryOfficeAddEditEquipmentComponent} from "./country-admin/country-office-profile/equipment/add-edit-equipment/add-edit-equipment.component";
import {CountryOfficeAddEditSurgeEquipmentComponent} from "./country-admin/country-office-profile/equipment/add-edit-surge-equipment/add-edit-surge-equipment.component";
import {CountryOfficeCoordinationComponent} from "./country-admin/country-office-profile/coordination/coordination.component";
import { CountryFieldOfficeSettingsComponent } from './country-admin/settings/country-field-office-settings/country-field-office-settings.component';
import {DonorListViewComponent} from "./donor-module/donor-list-view/donor-list-view.component";
import {CountryOfficeAddEditCoordinationComponent} from "./country-admin/country-office-profile/coordination/add-edit-coordination/add-edit-coordination.component";
import {CountryOfficeStockCapacityComponent} from "./country-admin/country-office-profile/stock-capacity/stock-capacity.component";
import {CountryOfficeAddEditStockCapacityComponent} from "./country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity/add-edit-stock-capacity.component";
import {CountryOfficeContactsComponent} from "./country-admin/country-office-profile/contacts/contacts.component";
import {CountryOfficeEditOfficeDetailsComponent} from "./country-admin/country-office-profile/contacts/edit-office-details/edit-office-details.component";
import {CountryOfficeAddEditPointOfContactComponent} from "./country-admin/country-office-profile/contacts/add-edit-point-of-contact/add-edit-point-of-contact.component";
import {CountryOfficeProgrammeComponent} from "./country-admin/country-office-profile/programme/programme.component";
import {AddEditMappingProgrammeComponent} from "./country-admin/country-office-profile/programme/add-edit-mapping/add-edit-mapping.component";
import {DonorAccountSettingsComponent} from "./donor-module/donor-account-settings/donor-account-settings.component";
import {DonorChangePasswordComponent} from "./donor-module/donor-account-settings/donor-change-password/donor-change-password.component";
import {CountryOfficeCapacityComponent} from "./country-admin/country-office-profile/office-capacity/office-capacity.component";
import {CountryOfficeDocumentsComponent} from "./country-admin/country-office-profile/documents/documents.component";
import {CountryNotificationsComponent} from "./country-admin/country-notifications/country-notifications.component";
import {ExportProposalComponent} from "./export-proposal/export-proposal.component";
import {AddEditSurgeCapacityComponent} from "./country-admin/country-office-profile/office-capacity/add-edit-surge-capacity/add-edit-surge-capacity.component";
import {DonorNotificationsComponent} from "./donor-module/donor-notifications/donor-notifications.component";
import {DirectorNotificationsComponent} from "./director/director-notifications/director-notifications.component";
import {DashboardOverviewComponent} from "./dashboard/dashboard-overview/dashboard-overview.component";
import {NewUserPasswordComponent} from "./new-user-password/new-user-password.component";
import {PartnerValidationComponent} from "./commons/partner-validation/partner-validation.component";
import {AfterValidationComponent} from "./commons/partner-validation/after-validation/after-validation.component";
import {DirectorAccountSettingsComponent} from "./director/director-account-settings/director-account-settings.component";
import {UnderMaintenanceComponent} from "./under-maintenance/under-maintenance.component";
import {NetworkCreatePasswordComponent} from "./network-admin/network-create-password/network-create-password.component";
import {NewNetworkDetailsComponent} from "./network-admin/new-network-details/new-network-details.component";
import {NetworkAccountSelectionComponent} from "./network-admin/network-account-selection/network-account-selection.component";
import {NetworkOfficesComponent} from "./network-admin/network-offices/network-offices.component";
import {NetworkAgenciesComponent} from "./network-admin/network-agencies/network-agencies.component";
import {NetworkMpaComponent} from "./network-admin/network-mpa/network-mpa.component";
import {NetworkAccountDetailsComponent} from "./network-admin/network-account-details/network-account-details.component";
import {NetworkAccountSettingsComponent} from "./network-admin/network-account-settings/network-account-settings.component";
import {NetworkChangePasswordComponent} from "./network-admin/network-account-settings/network-change-password/network-change-password.component";
import {NetworkMessageComponent} from "./network-admin/network-message/network-message.component";
import {AddEditNetworkOfficeComponent} from "./network-admin/network-offices/add-edit-network-office/add-edit-network-office.component";
import {NetworkModuleSettingsComponent} from "./network-admin/network-settings/network-module-settings/network-module-settings.component";
import {NetworkClockSettingsComponent} from "./network-admin/network-settings/network-clock-settings/network-clock-settings.component";
import {NetworkPlanSettingsComponent} from "./network-admin/network-settings/network-plan-settings/network-plan-settings.component";
import {NetworkDocumentSettingsComponent} from "./network-admin/network-settings/network-document-settings/network-document-settings.component";
import {InviteAgenciesComponent} from "./network-admin/network-agencies/invite-agencies/invite-agencies.component";
import {NetworkAgencyValidationComponent} from "./commons/network-agency-validation/network-agency-validation.component";
import {NetworkCreateEditMpaComponent} from "./network-admin/network-mpa/network-create-edit-mpa/network-create-edit-mpa.component";
import {NetworkAddGenericActionComponent} from "./network-admin/network-mpa/network-add-generic-action/network-add-generic-action.component";
import {NetworkCreateEditMessageComponent} from "./network-admin/network-message/network-create-edit-message/network-create-edit-message.component";
import {NetworkNotificationsComponent} from "./network-admin/network-notifications/network-notifications.component";
import {NetworkDashboardComponent} from "./network-country-admin/network-dashboard/network-dashboard.component";
import {NetworkRiskMinitoringComponent} from "./network-country-admin/network-risk-minitoring/network-risk-minitoring.component";
import {NetworkPlansComponent} from "./network-country-admin/network-plans/network-plans.component";
import {NetworkGlobalMapComponent} from "./network-country-admin/network-global-map/network-global-map.component";
import {NetworkCountryAgenciesComponent} from "./network-country-admin/network-administration/network-country-agencies/network-country-agencies.component";
import {NetworkCountryMessagesComponent} from "./network-country-admin/network-administration/network-country-messages/network-country-messages.component";
import {NetworkCountryMpaComponent} from "./network-country-admin/network-preparedness/network-country-mpa/network-country-mpa.component";
import {NetworkCountryApaComponent} from "./network-country-admin/network-preparedness/network-country-apa/network-country-apa.component";
import {NetworkCountrySelectAgenciesComponent} from "./network-country-admin/network-administration/network-country-agencies/network-country-select-agencies/network-country-select-agencies.component";
import {NetworkCountryValidationComponent} from "./commons/network-country-validation/network-country-validation.component";
import {NetworkCountryModuleSettingsComponent} from "./network-country-admin/network-administration/network-country-settings/network-country-module-settings/network-country-module-settings.component";
import {NetworkCountryClockSettingsComponent} from "./network-country-admin/network-administration/network-country-settings/network-country-clock-settings/network-country-clock-settings.component";
import {CreateEditNetworkPlanComponent} from "./network-country-admin/network-plans/create-edit-network-plan/create-edit-network-plan.component";
import { CountryOfficeAddEditFieldOfficeComponent } from './country-admin/settings/country-field-office-settings/country-office-add-edit-field-office/country-office-add-edit-field-office.component';

import {LocalNetworkAdminDashboardComponent} from "./local-network-admin/local-network-admin-dashboard/local-network-admin-dashboard.component";
import { LocalNetworkProfileProgrammeComponent } from './local-network-admin/local-network-profile/local-network-profile-programme/local-network-profile-programme.component';
import { LocalNetworkProfileOfficeCapacityComponent } from './local-network-admin/local-network-profile/local-network-profile-office-capacity/local-network-profile-office-capacity.component';
import { LocalNetworkProfilePartnersComponent } from './local-network-admin/local-network-profile/local-network-profile-partners/local-network-profile-partners.component';
import { LocalNetworkProfileEquipmentComponent } from './local-network-admin/local-network-profile/local-network-profile-equipment/local-network-profile-equipment.component';
import { LocalNetworkProfileCoordinationComponent } from './local-network-admin/local-network-profile/local-network-profile-coordination/local-network-profile-coordination.component';
import { LocalNetworkProfileStockCapacityComponent } from './local-network-admin/local-network-profile/local-network-profile-stock-capacity/local-network-profile-stock-capacity.component';
import { LocalNetworkProfileContactsComponent } from './local-network-admin/local-network-profile/local-network-profile-contacts/local-network-profile-contacts.component';
import { LocalNetworkProfileDocumentsComponent } from './local-network-admin/local-network-profile/local-network-profile-documents/local-network-profile-documents.component';
import { LocalNetworkCoordinationAddEditComponent } from './local-network-admin/local-network-profile/local-network-profile-coordination/local-network-coordination-add-edit/local-network-coordination-add-edit.component';
import { LocalNetworkAdministrationAgenciesComponent } from './local-network-admin/local-network-administration/local-network-administration-agencies/local-network-administration-agencies.component';
import { LocalNetworkAdministrationSettingsComponent } from './local-network-admin/local-network-administration/local-network-administration-settings/local-network-administration-settings.component';
import { LocalNetworkAdministrationMessagesComponent } from './local-network-admin/local-network-administration/local-network-administration-messages/local-network-administration-messages.component';
import { LocalInviteAgenciesComponent } from './local-network-admin/local-network-administration/local-network-administration-agencies/local-invite-agencies/local-invite-agencies.component';
import { LocalNetworkProfileStockCapacityAddEditComponent } from './local-network-admin/local-network-profile/local-network-profile-stock-capacity/local-network-profile-stock-capacity-add-edit/local-network-profile-stock-capacity-add-edit.component';
import {ViewNetworkPlanComponent} from "./network-country-admin/network-plans/view-network-plan/view-network-plan.component";
import {NetworkCountryCreateEditActionComponent} from "./network-country-admin/network-preparedness/network-country-create-edit-action/network-country-create-edit-actionn.component";
import {NetworkCountryActionSelectComponent} from "./network-country-admin/network-preparedness/network-country-action-select/network-country-action-select.component";
import { AddIndicatorNetworkCountryComponent } from './network-country-admin/network-risk-minitoring/add-indicator-network-country/add-indicator-network-country.component';
import { AddHazardNetworkCountryComponent } from './network-country-admin/network-risk-minitoring/add-hazard-network-country/add-hazard-network-country/add-hazard-network-country.component';
import {NetworkCountryCreateEditMessageComponent} from "./network-country-admin/network-administration/network-country-messages/network-country-create-edit-message/network-country-create-edit-message.component";
import {NetworkCountryNotificationsComponent} from "./network-country-admin/network-country-notifications/network-country-notifications.component";
import {NetworkCountryAccountSettingsComponent} from "./network-country-admin/network-country-account-settings/network-country-account-settings.component";
import {NetworkCountryChangePasswordComponent} from "./network-country-admin/network-country-account-settings/network-country-change-password/network-country-change-password.component";
import {NetworkCountryProfileProgrammeComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-programme/network-country-profile-programme.component";
import {NetworkCountryProfileOfficeCapacityComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-office-capacity/network-country-profile-office-capacity.component";
import {NetworkCountryProfilePartnersComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-partners/network-country-profile-partners.component";
import {NetworkCountryProfileEquipmentComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-equipment/network-country-profile-equipment.component";
import {NetworkCountryProfileCoordinationComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-coordination/network-country-profile-coordination.component";
import {NetworkCountryProfileStockCapacityComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-stock-capacity/network-country-profile-stock-capacity.component";
import {NetworkCountryProfileDocumentsComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-documents/network-country-profile-documents.component";
import {NetworkCountryProfileContactsComponent} from "./network-country-admin/network-country-office-profile/network-country-profile-contacts/network-country-profile-contacts.component";
import {LocalNetworkPlansComponent} from "./local-network-admin/local-network-plans/local-network-plans.component";
import {LocalNetworkPreparednessComponent} from "./local-network-admin/local-network-preparedness/local-network-preparedness.component";
import {LocalNetworkApaComponent} from "./local-network-admin/local-network-preparedness/local-network-apa/local-network-apa.component";
import {LocalNetworkClockComponent} from "./local-network-admin/local-network-administration/local-network-administration-settings/local-network-clock/local-network-clock.component";
import {LocalNetworkPlanComponent} from "./local-network-admin/local-network-administration/local-network-administration-settings/local-network-plan/local-network-plan.component";
import { NetworkCreateAlertComponent } from './network-country-admin/network-risk-minitoring/network-create-alert/network-create-alert.component';
import { NetworkDashboardUpdateAlertLevelComponent } from './network-country-admin/network-dashboard/network-dashboard-update-alert-level/network-dashboard-update-alert-level.component';
import {NetworkCalendarComponent} from "./network-country-admin/network-dashboard/network-calendar/network-calendar.component";
import {LocalNetworkCalendarComponent} from "./local-network-admin/local-network-admin-dashboard/local-network-calendar/local-network-calendar.component";
import { LocalNetworkRiskMonitoringComponent } from './local-network-admin/local-network-risk-monitoring/local-network-risk-monitoring.component';
import { AddHazardLocalNetworkComponent } from './local-network-admin/local-network-risk-monitoring/add-hazard-local-network/add-hazard-local-network.component';
import { AddIndicatorLocalNetworkComponent } from './local-network-admin/local-network-risk-monitoring/add-indicator-local-network/add-indicator-local-network.component';
import { LocalNetworkCreateAlertComponent } from './local-network-admin/local-network-risk-monitoring/local-network-create-alert/local-network-create-alert.component';
import { LocalNetworkDashboardUpdateAlertLevelComponent } from './local-network-admin/local-network-admin-dashboard/local-network-dashboard-update-alert-level/local-network-dashboard-update-alert-level.component';
import {NetworkGlobalMapListComponent} from "./network-country-admin/network-global-map-list/network-global-map-list.component";
import { SystemSettingsCocComponent } from "./system-admin/system-settings/system-settings-coc/system-settings-coc.component";
import { SystemSettingsTocComponent } from "./system-admin/system-settings/system-settings-toc/system-settings-toc.component";

/* Local Agency */

import { LocalAgencyDashboardComponent } from "./local-agency/local-agency-dashboard/local-agency-dashboard.component";
import { LocalAgencyRiskMonitoringComponent } from './local-agency/local-agency-risk-monitoring/local-agency-risk-monitoring.component';
import { LocalAgencyAddHazardComponent } from './local-agency/local-agency-risk-monitoring/local-agency-add-hazard/local-agency-add-hazard.component';
import { LocalAgencyAddIndicatorComponent } from './local-agency/local-agency-risk-monitoring/local-agency-add-indicator/local-agency-add-indicator.component';
import { LocalAgencyCreateAlertComponent } from './local-agency/local-agency-risk-monitoring/local-agency-create-alert/local-agency-create-alert.component';
import { LocalAgencyAdministrationStaffComponent } from './local-agency/local-agency-administration/local-agency-administration-staff/local-agency-administration-staff.component';
import { LocalAgencyAddEditStaffComponent } from './local-agency/local-agency-administration/local-agency-add-edit-staff/local-agency-add-edit-staff.component';
import { LocalAgencyAddEditPartnerComponent } from './local-agency/local-agency-administration/local-agency-add-edit-partner/local-agency-add-edit-partner.component';
import {CountryDepartmentsComponent} from "./country-admin/settings/country-departments/country-departments.component";
import { LocalAgencyMinimumPreparednessComponent } from './local-agency/local-agency-preparedness/local-agency-minimum-preparedness/local-agency-minimum-preparedness.component';
import { LocalAgencyAdevancedPreparednessComponent } from './local-agency/local-agency-preparedness/local-agency-adevanced-preparedness/local-agency-adevanced-preparedness.component';
import { LocalAgencyBudgetComponent } from './local-agency/local-agency-preparedness/local-agency-budget/local-agency-budget.component';
import { LocalAgencySelectPreparednessComponent } from './local-agency/local-agency-preparedness/local-agency-select-preparedness/local-agency-select-preparedness.component';
import { LocalAgencyCreateEditPreparednessComponent } from './local-agency/local-agency-preparedness/local-agency-create-edit-preparedness/local-agency-create-edit-preparedness.component';
import { LocalAgencyResponsePlansComponent } from "./local-agency/local-agency-response-plans/local-agency-response-plans.component";
import { LocalAgencyCreateEditResponsePlansComponent } from "./local-agency/local-agency-response-plans/local-agency-create-edit-response-plans/local-agency-create-edit-response-plans.component";
import { LocalAgencyAddPartnerOrganisationComponent } from "./local-agency/local-agency-response-plans/local-agency-add-partner-organisation/local-agency-add-partner-organisation.component";
import { LocalAgencyExternalPartnerResponsePlanComponent } from "./local-agency/local-agency-response-plans/local-agency-external-partner-response-plan/local-agency-external-partner-response-plan.component";
import { LocalAgencyViewPlanComponent } from "./local-agency/local-agency-response-plans/local-agency-view-plan/local-agency-view-plan.component";
import { LocalAgencyProfileComponent } from "./local-agency/local-agency-profile/local-agency-profile.component";
import { LocalAgencyContactsComponent } from './local-agency/local-agency-profile/local-agency-contacts/local-agency-contacts.component';
import { LocalAgencyCoordinationComponent } from './local-agency/local-agency-profile/local-agency-coordination/local-agency-coordination.component';
import { LocalAgencyDocumentsComponent } from './local-agency/local-agency-profile/local-agency-documents/local-agency-documents.component';
import { LocalAgencyEquipmentComponent } from './local-agency/local-agency-profile/local-agency-equipment/local-agency-equipment.component';
import { LocalAgencyOfficeCapacityComponent } from './local-agency/local-agency-profile/local-agency-office-capacity/local-agency-office-capacity.component';
import { LocalAgencyProfileMenuComponent } from './local-agency/local-agency-profile/local-agency-profile-menu/local-agency-profile-menu.component';
import { LocalAgencyPartnersComponent } from './local-agency/local-agency-profile/local-agency-partners/local-agency-partners.component';
import { LocalAgencyProgrammeComponent } from './local-agency/local-agency-profile/local-agency-programme/local-agency-programme.component';
import { LocalAgencyStockCapacityComponent } from './local-agency/local-agency-profile/local-agency-stock-capacity/local-agency-stock-capacity.component';
import { LocalAgencyAddEditMappingComponent } from "./local-agency/local-agency-profile/local-agency-programme/local-agency-add-edit-mapping/local-agency-add-edit-mapping.component";
import { LocalAgencyAddEditSurgeCapacityComponent } from "./local-agency/local-agency-profile/local-agency-office-capacity/local-agency-add-edit-surge-capacity/local-agency-add-edit-surge-capacity.component";
import { LocalAgencyAddEditEquipmentComponent } from './local-agency/local-agency-profile/local-agency-equipment/local-agency-add-edit-equipment/local-agency-add-edit-equipment.component';
import { LocalAgencyAddEditSurgeEquipmentComponent } from './local-agency/local-agency-profile/local-agency-equipment/local-agency-add-edit-surge-equipment/local-agency-add-edit-surge-equipment.component';
import { LocalAgencyAddEditCoordinationComponent } from './local-agency/local-agency-profile/local-agency-coordination/local-agency-add-edit-coordination/local-agency-add-edit-coordination.component';
import { LocalAgencyAddEditStockCapacityComponent } from './local-agency/local-agency-profile/local-agency-stock-capacity/local-agency-add-edit-stock-capacity/local-agency-add-edit-stock-capacity.component';
import { LocalAgencyAddEditPointOfContactComponent } from './local-agency/local-agency-profile/local-agency-contacts/local-agency-add-edit-point-of-contact/local-agency-add-edit-point-of-contact.component';
import { LocalAgencyEditOfficeDetailsComponent } from './local-agency/local-agency-profile/local-agency-contacts/local-agency-edit-office-details/local-agency-edit-office-details.component';
import { LocalAgencySettingsResponsePlanComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-settings-response-plan/local-agency-settings-response-plan.component';
import { LocalAgencyClockSettingsComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-clock-settings/local-agency-clock-settings.component';
import { LocalAgencyDepartmentComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-department/local-agency-department.component';
import { LocalAgencyModulesComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-modules/local-agency-modules.component';
import { LocalAgencyNotificationComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-notification/local-agency-notification.component';
import { LocalAgencySettingsMenuComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-settings-menu/local-agency-settings-menu.component';
import { LocalAgencySkillsComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-skills/local-agency-skills.component';
import { LocalAgencySettingsDocumentsComponent } from './local-agency/local-agency-administration/local-agency-settings/local-agency-settings-documents/local-agency-settings-documents.component';
import {LocalAgencyMessagesComponent} from "./local-agency/local-agency-messages/local-agency-messages.component";
import {LocalAgencyCreateEditMessageComponent} from "./local-agency/local-agency-messages/local-agency-create-edit-message/local-agency-create-edit-message.component";
import {LocalAgencyAccountSettingsComponent} from "./local-agency/local-agency-account-settings/local-agency-account-settings.component";
import {LocalAgencyChangePasswordComponent} from "./local-agency/local-agency-account-settings/local-agency-change-password/local-agency-change-password.component";
import { LocalAgencyAccountDetailsComponent } from './local-agency/local-agency-account-details/local-agency-account-details.component';
import {LocalAgencyDashboardSeasonalCalendarComponent} from "./local-agency/local-agency-dashboard/local-agency-dashboard-seasonal-calendar/local-agency-dashboard-seasonal-calendar.component";
import {LocalNetworkGlobalMapsComponent} from "./local-network-admin/local-network-global-maps/local-network-global-maps.component";
import {LocalNetworkGlobalMapsListComponent} from "./local-network-admin/local-network-global-maps-list/local-network-global-maps-list.component";
import {AgencyOverviewComponent} from "./agency-admin/agency-overview/agency-overview.component";
import {ViewCountriesComponent} from "./agency-admin/view-countries/view-countries.component";
import {SystemAdminViewCocComponent} from "./system-admin/account-settings/view-coc/system-admin-view-coc.component";
import {AgencyAdminViewCocComponent} from "./agency-admin/agency-account-settings/agency-admin-view-coc/agency-admin-view-coc.component";
import {CountryAdminSettingsCocViewComponent} from "./country-admin/country-account-settings/country-admin-settings-coc-view/country-admin-settings-coc-view.component";
import {DirectorAccountSettingsViewCocComponent} from "./director/director-account-settings/director-account-settings-view-coc/director-account-settings-view-coc.component";
import {LocalAgencyViewCocComponent} from "./local-agency/local-agency-account-details/local-agency-view-coc/local-agency-view-coc.component";
import {NetworkAdminViewCocComponent} from "./network-admin/network-account-settings/network-admin-view-coc/network-admin-view-coc.component";
import {NetworkCountryAdminViewCocComponent} from "./network-country-admin/network-country-account-settings/network-country-admin-view-coc/network-country-admin-view-coc.component";
import {AgencyAdminViewTocComponent} from "./agency-admin/agency-account-settings/agency-admin-view-toc/agency-admin-view-toc.component";
import {LocalAgencyViewTocComponent} from "./local-agency/local-agency-account-details/local-agency-view-toc/local-agency-view-toc.component";
import {SystemAdminModule} from "./system-admin/system-admin.module";
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},

  /**
   * Login
   */
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'login/:emailEntered', component: LoginComponent},

  /**
   * Privacy Policy
   */
  {path: 'privacy-policy', component: PrivacyPolicyComponent},

  /**
   * New User
   */
  {path: 'new-user-password', component: NewUserPasswordComponent},

  /**
   * System admin
   */
  // {path: 'system-admin/agency', loadChildren: "app/system-admin/system-admin.module#SystemAdminModule"},
  // {path: 'system-admin/min-prep/create', component: CreateActionComponent},
  // {path: 'system-admin/min-prep/create/:id', component: CreateActionComponent},
  // {path: 'system-admin/min-prep', component: MinPrepComponent},
  // {path: 'system-admin/mpa/create', component: CreateMpaActionComponent},
  // {path: 'system-admin/mpa/create/:id', component: CreateMpaActionComponent},
  // {path: 'system-admin/mpa', component: MpaComponent},
  // {path: 'system-admin/add-agency', component: AddAgencyComponent},
  // {path: 'system-admin/add-agency/:id', component: AddAgencyComponent},
  // {path: 'system-admin/messages/create', component: MessagesCreateComponent},
  // {path: 'system-admin/messages', component: MessagesComponent},
  // {path: 'system-admin/account-settings', component: AccountSettingsComponent},
  // {path: 'system-admin/account-settings/change-password', component: ChangePasswordComponent},
  // {path: 'system-admin/network', component: GlobalNetworksComponent},
  // {path: 'system-admin/network/create', component: CreateEditGlobalNetworkComponent},
  // {path: 'system-admin/network/create:id', component: CreateEditGlobalNetworkComponent},
  // {path: 'system-admin/system-settings', component: SystemSettingsComponent},
  // {path: 'system-admin/system-settings/system-settings-documents', component: SystemSettingsDocumentsComponent},
  // {path: 'system-admin/system-settings/system-settings-toc', component: SystemSettingsTocComponent},
  // {path: 'system-admin/system-settings/system-settings-coc', component: SystemSettingsCocComponent},
  // {path: 'system-admin/account-settings/view-coc/system-admin-view-coc', component: SystemAdminViewCocComponent},
  // {path: 'system-admin/system-settings/system-settings-response-plans', component: SystemSettingsResponsePlansComponent},

  /**
   * Agency admin
   */
  {path: 'agency-admin/new-agency/new-agency-password', component: NewAgencyPasswordComponent},
  {path: 'agency-admin/new-agency/new-agency-details', component: NewAgencyDetailsComponent},
  {path: 'agency-admin/country-office', component: CountryOfficeComponent},
  {path: 'agency-admin/country-office/create-edit-country', component: CreateEditCountryComponent},
  {path: 'agency-admin/country-office/create-edit-region', component: CreateEditRegionComponent},
  {path: 'agency-admin/country-office/create-edit-region:id', component: CreateEditRegionComponent},
  {path: 'agency-admin/agency-mpa', component: AgencyMpaComponent},
  {path: 'agency-admin/agency-mpa/create-edit-mpa', component: CreateEditMpaComponent},
  {path: 'agency-admin/agency-mpa/add-generic-action', component: AddGenericActionComponent},
  {path: 'agency-admin/country-office/create-edit-country/:id', component: CreateEditCountryComponent},
  {path: 'agency-admin/agency-messages/create-edit-message', component: CreateEditMessageComponent},
  {path: 'agency-admin/agency-messages/create-edit-message/:id', component: CreateEditMessageComponent},
  {path: 'agency-admin/agency-messages', component: AgencyMessagesComponent},
  {path: 'agency-admin/settings/departments', component: DepartmentComponent},
  {path: 'agency-admin/settings/skills', component: SkillsComponent},
  {path: 'agency-admin/settings/modules', component: ModulesComponent},
  {path: 'agency-admin/settings/clock-settings', component: ClockSettingsComponent},
  {path: 'agency-admin/settings/response-plans', component: AgencyAdminSettingsResponsePlanComponent},
  {path: 'agency-admin/settings/documents', component: DocumentsComponent},
  {path: 'agency-admin/settings/notifications', component: NotificationComponent},
  {path: 'agency-admin/settings', redirectTo: 'agency-admin/settings/departments', pathMatch: 'full'},
  {path: 'agency-admin/staff', component: StaffComponent},
  {path: 'agency-admin/staff/create-edit-staff', component: CreateEditStaffComponent},
  {path: 'agency-admin/staff/create-edit-staff:id', component: CreateEditStaffComponent},
  {path: 'agency-admin/agency-account-settings', component: AgencyAccountSettingsComponent},
  {path: 'agency-admin/agency-account-details', component: AgencyAccountDetailsComponent},
  {path: 'agency-admin/agency-account-settings/agency-change-password', component: AgencyChangePasswordComponent},
  {path: 'agency-admin/agency-notifications/agency-notifications', component: AgencyNotificationsComponent},
  {path: 'agency-admin/agency-overview', component: AgencyOverviewComponent},
  {path: 'agency-admin/agency-overview/:countryId/:isViewing', component: AgencyOverviewComponent},
  {path: 'agency-admin/account-settings/agency-admin-view-coc/agency-admin-view-coc', component: AgencyAdminViewCocComponent},
  {path: 'agency-admin/account-settings/agency-admin-view-toc/agency-admin-view-toc', component: AgencyAdminViewTocComponent},
  {path: 'agency-admin/view-countries', component: ViewCountriesComponent},

  /**
   * Country admin
   */
  {path: 'country-admin/settings/field-offices/add-edit', component: CountryOfficeAddEditFieldOfficeComponent},
  {path: 'country-admin/settings/field-offices/add-edit/:id', component: CountryOfficeAddEditFieldOfficeComponent},
  {path: 'country-admin/new-country/new-country-password', component: NewCountryPasswordComponent},
  {path: 'country-admin/new-country/new-country-details', component: NewCountryDetailsComponent},
  {path: 'country-admin/country-account-settings', component: CountryAccountSettingsComponent},
  {path: 'country-admin/country-account-settings/country-change-password', component: CountryChangePasswordComponent},
  {path: 'country-admin/country-messages', component: CountryMessagesComponent},
  {path: 'country-admin/country-messages/country-create-edit-message', component: CountryCreateEditMessageComponent},
  {
    path: 'country-admin/country-messages/country-create-edit-message/:id',
    component: CountryCreateEditMessageComponent
  },
  {path: 'country-admin/settings/field-offices', component: CountryFieldOfficeSettingsComponent},
  {path: 'country-admin/settings/country-clock-settings', component: CountryClockSettingsComponent},
  {path: 'country-admin/settings/country-modules-settings', component: CountryModulesSettingsComponent},
  {path: 'country-admin/settings/country-permission-settings', component: CountryPermissionSettingsComponent},
  {path: 'country-admin/settings/country-notification-settings', component: CountryNotificationSettingsComponent},
  {path: 'country-admin/settings/country-departments', component: CountryDepartmentsComponent},
  {
    path: 'country-admin/settings/country-notification-settings/country-add-external-recipient',
    component: CountryAddExternalRecipientComponent
  },
  {path: 'country-admin/country-staff', component: CountryStaffComponent},
  {path: 'country-admin/country-staff/country-add-edit-partner', component: CountryAddEditPartnerComponent},
  {path: 'country-admin/country-staff/country-add-edit-staff', component: CountryAddEditStaffComponent},
  // {path: 'country-admin/country-office-profile/:countryId', component: CountryOfficeProfileComponent},
  {path: 'country-admin/country-office-profile', component: CountryOfficeProfileComponent},
  {path: 'country-admin/country-office-profile/partners', component: CountryOfficePartnersComponent},
  {path: 'country-admin/country-office-profile/equipment', component: CountryOfficeEquipmentComponent},
  {
    path: 'country-admin/country-office-profile/equipment/add-edit-equipment',
    component: CountryOfficeAddEditEquipmentComponent
  },
  {
    path: 'country-admin/country-office-profile/equipment/add-edit-surge-equipment',
    component: CountryOfficeAddEditSurgeEquipmentComponent
  },
  {path: 'country-admin/country-office-profile/coordination', component: CountryOfficeCoordinationComponent},
  {
    path: 'country-admin/country-office-profile/coordination/add-edit-coordination',
    component: CountryOfficeAddEditCoordinationComponent
  },
  {path: 'country-admin/country-office-profile/stock-capacity', component: CountryOfficeStockCapacityComponent},
  {
    path: 'country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity',
    component: CountryOfficeAddEditStockCapacityComponent
  },
  {path: 'country-admin/country-office-profile/contacts', component: CountryOfficeContactsComponent},
  {
    path: 'country-admin/country-office-profile/contacts/edit-office-details',
    component: CountryOfficeEditOfficeDetailsComponent
  },
  {
    path: 'country-admin/country-office-profile/contacts/add-edit-point-of-contact',
    component: CountryOfficeAddEditPointOfContactComponent
  },
  {path: 'country-admin/country-my-agency', component: CountryMyAgencyComponent},
  {path: 'country-admin/country-agencies', component: CountryAgenciesComponent},
  {path: 'local-agency/country-agencies', component: CountryAgenciesComponent},
  {path: 'country-admin/country-office-profile/programme', component: CountryOfficeProgrammeComponent},
  {
    path: 'country-admin/country-office-profile/mapping-programme-add-edit',
    component: AddEditMappingProgrammeComponent
  },
  {
    path: 'country-admin/country-office-profile/mapping-programme-add-edit/:programmeId',
    component: AddEditMappingProgrammeComponent
  },
  {path: 'country-admin/country-office-profile/office-capacity', component: CountryOfficeCapacityComponent},
  {
    path: 'country-admin/country-office-profile/office-capacity/add-edit-surge-capacity',
    component: AddEditSurgeCapacityComponent
  },
  {path: 'country-admin/country-office-profile/documents', component: CountryOfficeDocumentsComponent},
  {path: 'country-admin/country-notifications', component: CountryNotificationsComponent},
  {path: 'country-admin/country-account-settings/country-admin-settings-coc-view', component: CountryAdminSettingsCocViewComponent},

  /**
   * Dashboard
   */
  {path: 'dashboard', component: DashboardComponent},
  {path: 'dashboard/dashboard-seasonal-calendar', component: DashboardSeasonalCalendarComponent},
  {path: 'dashboard/dashboard-update-alert-level', component: DashboardUpdateAlertLevelComponent},
  {path: 'dashboard/dashboard-update-alert-level/:id/:countryId', component: DashboardUpdateAlertLevelComponent},
  {path: 'dashboard/facetoface-meeting-request', component: FacetofaceMeetingRequestComponent},
  {path: 'dashboard/review-response-plan', component: ReviewResponsePlanComponent},
  {path: 'dashboard/review-response-plan/:id', component: ReviewResponsePlanComponent},
  {
    path: 'dashboard/review-response-plan/:id/:token/:countryId/:partnerOrganisationId',
    component: ReviewResponsePlanComponent
  },
  {path: 'dashboard/dashboard-overview', component: DashboardOverviewComponent},


  /**
   * Risk Monitoring
   */
  {path: 'risk-monitoring', component: RiskMonitoringComponent},
  {path: 'risk-monitoring/create-alert', component: CreateAlertRiskMonitoringComponent},
  {path: 'risk-monitoring/add-indicator/:hazardID/:indicatorID', component: AddIndicatorRiskMonitoringComponent},
  {path: 'risk-monitoring/add-indicator/:hazardID', component: AddIndicatorRiskMonitoringComponent},
  {path: 'risk-monitoring/add-hazard', component: AddHazardRiskMonitoringComponent},
  {path: 'risk-monitoring/add-hazard/:hazardId', component: AddHazardRiskMonitoringComponent},

  /**
   * Preparedness
   */
  {path: 'preparedness/minimum/:countryId/:agencyId', component: MinimumPreparednessComponent},
  {path: 'preparedness/minimum/:countryId', component: MinimumPreparednessComponent},
  {path: 'preparedness/minimum', component: MinimumPreparednessComponent},
  {path: 'preparedness/advanced/:countryId/:agencyId', component: AdvancedPreparednessComponent},
  {path: 'preparedness/advanced/:countryId', component: AdvancedPreparednessComponent},
  {path: 'preparedness/advanced', component: AdvancedPreparednessComponent},
  {path: 'preparedness/budget', component: BudgetPreparednessComponent},
  {path: 'preparedness/select', component: SelectPreparednessComponent},
  {path: 'preparedness/create-edit-preparedness', component: CreateEditPreparednessComponent},
  {path: 'preparedness/create-edit-preparedness/:id', component: CreateEditPreparednessComponent},

  /**
   * Response Plans
   */
  {path: 'response-plans', component: ResponsePlansComponent},
  {path: 'response-plans/create-edit-response-plan', component: CreateEditResponsePlanComponent},
  {path: 'response-plans/create-edit-response-plan/:id', component: CreateEditResponsePlanComponent},
  {path: 'response-plans/add-partner-organisation', component: AddPartnerOrganisationComponent},
  {path: 'response-plans/add-partner-organisation/:fromResponsePlans', component: AddPartnerOrganisationComponent},
  {path: 'response-plans/view-response-plan', component: ViewResponsePlanComponent},
  {path: 'response-plans/view-response-plan/:id', component: ViewResponsePlanComponent},
  {path: 'response-plans/view-plan', component: ViewPlanComponent},
  {path: 'response-plans/view-plan/:id', component: ViewPlanComponent},
  {path: 'response-plans/external-partner-response-plan/:countryID/:id/:token', component: ExternalPartnerResponsePlan},

  /**
   * Maps
   */
  {path: 'map', component: MapComponent},
  {path: 'map/map-countries-list', component: MapCountriesListComponent},

  /**
   * Directors
   */
  {path: 'director', component: DirectorComponent},
  {path: 'director/director-overview', component: DirectorOverviewComponent},
  {path: 'director/director-overview/:countryId/:isViewing', component: DirectorOverviewComponent},
  {path: 'director/director-notifications', component: DirectorNotificationsComponent},
  {path: 'director/director-account-settings', component: DirectorAccountSettingsComponent},
  {path: 'director/director-account-settings/director-account-settings-view-coc', component: DirectorAccountSettingsViewCocComponent},

  /**
   * Donor
   */
  {path: 'donor-module', component: DonorModuleComponent},
  {path: 'donor-module/donor-list-view', component: DonorListViewComponent},
  {path: 'donor-module/donor-country-index', component: DonorCountryIndexComponent},
  {path: 'donor-module/donor-account-settings', component: DonorAccountSettingsComponent},
  {path: 'donor-module/donor-account-settings/donor-change-password', component: DonorChangePasswordComponent},
  {path: 'donor-module/donor-notifications', component: DonorNotificationsComponent},

  /**
   * Response plan exporting
   * */
  {path: 'export-start-fund', component: ExportStartFundComponent},
  {path: 'export-proposal', component: ExportProposalComponent},

  /**
   * Partner Vlidation
   * */
  {path: 'partner-validation', component: PartnerValidationComponent},
  {path: 'after-validation', component: AfterValidationComponent},

  /**
   * Network Users
   */
  /* network admin*/
  {path: 'network/network-create-password', component: NetworkCreatePasswordComponent},
  {path: 'network/new-network-details', component: NewNetworkDetailsComponent},
  {path: 'network/network-account-details', component: NetworkAccountDetailsComponent},
  {path: 'network/network-account-settings', component: NetworkAccountSettingsComponent},
  {path: 'network/network-account-settings/network-change-password', component: NetworkChangePasswordComponent},
  {path: 'network/network-offices', component: NetworkOfficesComponent},
  {path: 'network/network-offices/add-edit-network-office', component: AddEditNetworkOfficeComponent},
  {path: 'network/network-agencies', component: NetworkAgenciesComponent},
  {path: 'network/network-agencies/invite-agencies', component: InviteAgenciesComponent},
  {path: 'network-agency-validation', component: NetworkAgencyValidationComponent},
  {path: 'network/network-settings/modules', component: NetworkModuleSettingsComponent},
  {path: 'network/network-settings/clock-settings', component: NetworkClockSettingsComponent},
  {path: 'network/network-settings/response-plans', component: NetworkPlanSettingsComponent},
  {path: 'network/network-settings/documents', component: NetworkDocumentSettingsComponent},
  {path: 'network/network-message', component: NetworkMessageComponent},
  {path: 'network/network-message/network-create-edit-message', component: NetworkCreateEditMessageComponent},
  {path: 'network/network-mpa', component: NetworkMpaComponent},
  {path: 'network/network-mpa/network-create-edit-mpa', component: NetworkCreateEditMpaComponent},
  {path: 'network/network-mpa/network-add-generic-action', component: NetworkAddGenericActionComponent},
  {path: 'network/network-account-selection', component: NetworkAccountSelectionComponent},
  {path: 'network-admin/network-notifications', component: NetworkNotificationsComponent},
  {path: 'network/network-account-selection', component: NetworkAccountSelectionComponent},
  {path: 'network/network-account-settings-view-coc', component: NetworkAdminViewCocComponent},


  /**
   * Local Network Admin
   */

  {path: 'network/local-network-dashboard', component: LocalNetworkAdminDashboardComponent},
  {path: 'network/local-network-office-profile/programme', component: LocalNetworkProfileProgrammeComponent},
  {path: 'network/local-network-office-profile/office-capacity', component: LocalNetworkProfileOfficeCapacityComponent},
  {path: 'network/local-network-office-profile/partners', component: LocalNetworkProfilePartnersComponent},
  {path: 'network/local-network-office-profile/equipment', component: LocalNetworkProfileEquipmentComponent},
  {path: 'network/local-network-office-profile/coordination', component: LocalNetworkProfileCoordinationComponent},
  {path: 'network/local-network-office-profile/coordination/add-edit', component: LocalNetworkCoordinationAddEditComponent},
  {path: 'network/local-network-office-profile/stock-capacity', component: LocalNetworkProfileStockCapacityComponent},
  {path: 'network/local-network-office-profile/documents', component: LocalNetworkProfileDocumentsComponent},
  {path: 'network/local-network-office-profile/contacts', component: LocalNetworkProfileContactsComponent},
  {path: 'network/local-network-administration/agencies', component: LocalNetworkAdministrationAgenciesComponent},
  {path: 'network/local-network-administration/agencies/invite', component: LocalInviteAgenciesComponent},
  {path: 'network/local-network-administration/settings', component: LocalNetworkAdministrationSettingsComponent},
  {path: 'network/local-network-administration/clock-settings', component: LocalNetworkClockComponent},
  {path: 'network/local-network-administration/plan-settings', component: LocalNetworkPlanComponent},
  {path: 'network/local-network-administration/messages', component: LocalNetworkAdministrationMessagesComponent},
  {path: 'network/local-network-office-profile/stock-capacity/add-edit', component: LocalNetworkProfileStockCapacityAddEditComponent},
  {path: 'network/local-network-plans', component: LocalNetworkPlansComponent},
  {path: 'network/local-network-preparedness-mpa', component: LocalNetworkPreparednessComponent},
  {path: 'network/local-network-preparedness-apa', component: LocalNetworkApaComponent},
  {path: 'network/local-network-global-maps', component: LocalNetworkGlobalMapsComponent},
  {path: 'network/local-network-global-maps-list', component: LocalNetworkGlobalMapsListComponent},
  {path: 'network/local-network-calendar', component: LocalNetworkCalendarComponent},
  {path: 'network/local-network-risk-monitoring', component: LocalNetworkRiskMonitoringComponent},
  {path: 'network/local-network-risk-monitoring/add-indicator/:hazardID/:indicatorID/:countryOfficeCode', component: AddIndicatorLocalNetworkComponent},
  {path: 'network/local-network-risk-monitoring/add-indicator/:hazardID/:indicatorID', component: AddIndicatorLocalNetworkComponent},
  {path: 'network/local-network-risk-monitoring/add-indicator/:hazardID', component: AddIndicatorLocalNetworkComponent},
  {path: 'network/local-network-risk-monitoring/add-hazard', component: AddHazardLocalNetworkComponent},
  {path: 'network/local-network-risk-monitoring/create-alert', component: LocalNetworkCreateAlertComponent},
  {path: 'network/local-network-dashboard/dashboard-update-alert-level', component: LocalNetworkDashboardUpdateAlertLevelComponent},
  {path: 'network/local-network-dashboard/dashboard-update-alert-level//:id/:networkId', component: LocalNetworkDashboardUpdateAlertLevelComponent},

  /**
   * Network Country Admin
   */
  {path: 'network-country/network-dashboard', component: NetworkDashboardComponent},
  {path: 'network-country/network-country-account-settings', component: NetworkCountryAccountSettingsComponent},
  {path: 'network-country/network-country-change-password', component: NetworkCountryChangePasswordComponent},
  {path: 'network-country/network-dashboard/dashboard-update-alert-level', component: NetworkDashboardUpdateAlertLevelComponent},
  {path: 'network-country/network-dashboard/dashboard-update-alert-level/:id/:networkCountryId', component: NetworkDashboardUpdateAlertLevelComponent},

  {path: 'network-country/network-risk-monitoring', component: NetworkRiskMinitoringComponent},
  {path: 'network-country/network-risk-monitoring/add-indicator/:hazardID/:indicatorID/:countryOfficeCode', component: AddIndicatorNetworkCountryComponent},
  {path: 'network-country/network-risk-monitoring/add-indicator/:hazardID/:indicatorID', component: AddIndicatorNetworkCountryComponent},
  {path: 'network-country/network-risk-monitoring/add-indicator/:hazardID', component: AddIndicatorNetworkCountryComponent},
  {path: 'network-country/network-risk-monitoring/add-hazard', component: AddHazardNetworkCountryComponent},
  {path: 'network-country/network-risk-monitoring/create-alert', component: NetworkCreateAlertComponent},
  {path: 'network-country/network-risk-monitoring/add-hazard/:hazardId', component: AddHazardNetworkCountryComponent},


  {path: 'network-country/network-plans', component: NetworkPlansComponent},
  {path: 'network-country/network-plans/view-network-plan', component: ViewNetworkPlanComponent},
  {path: 'network-country/network-plans/create-edit-network-plan', component: CreateEditNetworkPlanComponent},
  {path: 'network-country/network-global-map', component: NetworkGlobalMapComponent},
  {path: 'network-country/network-global-map-list', component: NetworkGlobalMapListComponent},
  {path: 'network-country/network-country-agencies', component: NetworkCountryAgenciesComponent},
  {path: 'network-country/network-country-agencies/select-agencies', component: NetworkCountrySelectAgenciesComponent},
  {path: 'network-country/network-country-settings/network-country-modules', component: NetworkCountryModuleSettingsComponent},
  {path: 'network-country/network-country-settings/network-country-clocks', component: NetworkCountryClockSettingsComponent},
  {path: 'network-country/network-country-messages', component: NetworkCountryMessagesComponent},
  {path: 'network-country/network-country-messages/create-edit-network-country-message', component: NetworkCountryCreateEditMessageComponent},
  {path: 'network-country/network-country-notifications', component: NetworkCountryNotificationsComponent},
  {path: 'network-country/network-country-mpa', component: NetworkCountryMpaComponent},
  {path: 'network-country/network-country-apa', component: NetworkCountryApaComponent},
  {path: 'network-country/network-country-create-edit-action', component: NetworkCountryCreateEditActionComponent},
  {path: 'network-country/network-country-create-edit-action/:id', component: NetworkCountryCreateEditActionComponent},
  {path: 'network-country/network-country-select-action', component: NetworkCountryActionSelectComponent},
  {path: 'network-country-validation', component: NetworkCountryValidationComponent},
  {path: 'network-country/network-country-office-profile-programme', component: NetworkCountryProfileProgrammeComponent},
  {path: 'network-country/network-country-office-profile-office-capacity', component: NetworkCountryProfileOfficeCapacityComponent},
  {path: 'network-country/network-country-office-profile-partners', component: NetworkCountryProfilePartnersComponent},
  {path: 'network-country/network-country-office-profile-equipment', component: NetworkCountryProfileEquipmentComponent},
  {path: 'network-country/network-country-office-profile-coordination', component: NetworkCountryProfileCoordinationComponent},
  {path: 'network-country/network-country-office-profile-stock-capacity', component: NetworkCountryProfileStockCapacityComponent},
  {path: 'network-country/network-country-office-profile-documents', component: NetworkCountryProfileDocumentsComponent},
  {path: 'network-country/network-country-office-profile-contacts', component: NetworkCountryProfileContactsComponent},
  {path: 'network-country/network-calendar', component: NetworkCalendarComponent},
  {path: 'network-country/account-settings-view-coc', component: NetworkCountryAdminViewCocComponent},


  /* Local Agency */
  {path: 'local-agency/dashboard', component: LocalAgencyDashboardComponent},
  {path: 'local-agency/dashboard-update-alert-level', component: DashboardUpdateAlertLevelComponent},
  {path: 'local-agency/dashboard-update-alert-level/:id/:agencyId', component: DashboardUpdateAlertLevelComponent},
  {path: 'local-agency/risk-monitoring', component: LocalAgencyRiskMonitoringComponent},
  {path: 'local-agency/risk-monitoring/add-hazard', component: LocalAgencyAddHazardComponent},
  {path: 'local-agency/risk-monitoring/add-hazard/:hazardID', component: LocalAgencyAddHazardComponent},
  {path: 'local-agency/risk-monitoring/add-indicator/:hazardID/:indicatorID', component: LocalAgencyAddIndicatorComponent},
  {path: 'local-agency/risk-monitoring/add-indicator/:hazardID', component: LocalAgencyAddIndicatorComponent},
  {path: 'local-agency/risk-monitoring/create-alert', component: LocalAgencyCreateAlertComponent},
  {path: 'local-agency/agency-staff', component: LocalAgencyAdministrationStaffComponent},
  {path: 'local-agency/agency-staff/add-edit-staff', component: LocalAgencyAddEditStaffComponent},
  {path: 'local-agency/agency-staff/add-edit-partner', component: LocalAgencyAddEditPartnerComponent},
  {path: 'local-agency/preparedness/minimum/:agencyId', component: LocalAgencyMinimumPreparednessComponent},
  {path: 'local-agency/preparedness/minimum', component: LocalAgencyMinimumPreparednessComponent},
  {path: 'local-agency/preparedness/advanced/:agencyId', component: LocalAgencyAdevancedPreparednessComponent},
  {path: 'local-agency/preparedness/advanced', component: LocalAgencyAdevancedPreparednessComponent},
  {path: 'local-agency/preparedness/budget', component: LocalAgencyBudgetComponent},
  {path: 'local-agency/preparedness/select', component: LocalAgencySelectPreparednessComponent},
  {path: 'local-agency/preparedness/create-edit-preparedness', component: LocalAgencyCreateEditPreparednessComponent},
  {path: 'local-agency/preparedness/create-edit-preparedness/:id', component: LocalAgencyCreateEditPreparednessComponent},
  {path: 'local-agency/response-plans', component: LocalAgencyResponsePlansComponent},
  {path: 'local-agency/response-plans/create-edit-response-plan', component: LocalAgencyCreateEditResponsePlansComponent},
  {path: 'local-agency/response-plans/create-edit-response-plan/:id', component: LocalAgencyCreateEditResponsePlansComponent},
  {path: 'local-agency/response-plans/add-partner-organisation', component: LocalAgencyAddPartnerOrganisationComponent},
  {path: 'local-agency/response-plans/add-partner-organisation/:fromResponsePlans', component: LocalAgencyAddPartnerOrganisationComponent},
  {path: 'local-agency/response-plans/external-partner-response-plan/:countryID/:id/:token', component: LocalAgencyExternalPartnerResponsePlanComponent},
  {path: 'local-agency/response-plans/view-plan', component: LocalAgencyViewPlanComponent},
  {path: 'local-agency/response-plans/view-plan/:id', component: LocalAgencyViewPlanComponent},
  {path: 'local-agency/profile', component: LocalAgencyProfileComponent},
  {path: 'local-agency/account-settings/local-agency-view-coc', component: LocalAgencyViewCocComponent},
  {path: 'local-agency/account-settings/local-agency-view-toc', component: LocalAgencyViewTocComponent},
  {path: 'local-agency/agency-overview', component: AgencyOverviewComponent},
  {path: 'local-agency/agency-overview/:countryId/:isViewing', component: AgencyOverviewComponent},

  {path: 'local-agency/profile/partners', component: LocalAgencyPartnersComponent},
  {path: 'local-agency/profile/equipment', component: LocalAgencyEquipmentComponent},
  {path: 'local-agency/profile/equipment/add-edit-equipment', component: LocalAgencyAddEditEquipmentComponent},
  {path: 'local-agency/profile/equipment/add-edit-surge-equipment', component: LocalAgencyAddEditSurgeEquipmentComponent},
  {path: 'local-agency/profile/coordination', component: LocalAgencyCoordinationComponent},
  {path: 'local-agency/profile/coordination/add-edit-coordination', component: LocalAgencyAddEditCoordinationComponent},
  {path: 'local-agency/profile/stock-capacity', component: LocalAgencyStockCapacityComponent},
  {path: 'local-agency/profile/stock-capacity/add-edit-stock-capacity', component: LocalAgencyAddEditStockCapacityComponent},
  {path: 'local-agency/profile/contacts', component: LocalAgencyContactsComponent},
  {path: 'local-agency/profile/contacts/edit-office-details', component: LocalAgencyEditOfficeDetailsComponent},
  {path: 'local-agency/profile/contacts/add-edit-point-of-contact', component: LocalAgencyAddEditPointOfContactComponent},
  {path: 'local-agency/profile/programme', component: LocalAgencyProgrammeComponent},
  {path: 'local-agency/profile/mapping-programme-add-edit', component: LocalAgencyAddEditMappingComponent},
  {path: 'local-agency/profile/mapping-programme-add-edit/:programmeId', component: LocalAgencyAddEditMappingComponent},
  {path: 'local-agency/profile/office-capacity', component: LocalAgencyOfficeCapacityComponent},
  {path: 'local-agency/profile/office-capacity/add-edit-surge-capacity', component: LocalAgencyAddEditSurgeCapacityComponent},
  {path: 'local-agency/profile/documents', component: LocalAgencyDocumentsComponent},
  {path: 'local-agency/settings/departments', component: LocalAgencyDepartmentComponent},
  {path: 'local-agency/settings/skills', component: LocalAgencySkillsComponent},
  {path: 'local-agency/settings/modules', component: LocalAgencyModulesComponent},
  {path: 'local-agency/settings/clock-settings', component: LocalAgencyClockSettingsComponent},
  {path: 'local-agency/settings/response-plans', component: LocalAgencySettingsResponsePlanComponent},
  {path: 'local-agency/settings/documents', component: LocalAgencyDocumentsComponent},
  {path: 'local-agency/settings/notifications', component: LocalAgencyNotificationComponent},
  {path: 'local-agency/settings', redirectTo: 'local-agency/settings/departments', pathMatch: 'full'},
  {path: 'local-agency/agency-messages/create-edit-message', component: LocalAgencyCreateEditMessageComponent},
  {path: 'local-agency/agency-messages/create-edit-message/:id', component: LocalAgencyCreateEditMessageComponent},
  {path: 'local-agency/agency-messages', component: LocalAgencyMessagesComponent},
  {path: 'local-agency/agency-account-settings', component: LocalAgencyAccountSettingsComponent},
  {path: 'local-agency/agency-account-settings/agency-change-password', component: LocalAgencyChangePasswordComponent},
  {path: 'local-agency/agency-account-details', component: LocalAgencyAccountDetailsComponent},
  {path: 'local-agency/dashboard/dashboard-seasonal-calendar', component: LocalAgencyDashboardSeasonalCalendarComponent},

  /**
   * Maintanace page
   * */
  {path: 'maintenance', component: UnderMaintenanceComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
}
