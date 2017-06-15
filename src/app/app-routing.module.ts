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
import {PreparednessComponent} from "./preparedness/preparedness.component";
import {MinimumPreparednessComponent} from "./preparedness/minimum/minimum.component";
import {AdvancedPreparednessComponent} from "./preparedness/advanced/advanced.component";
import {BudgetPreparednessComponent} from "./preparedness/budget/budget.component";
import {SelectPreparednessComponent} from "./preparedness/select/select.component";
import {CreateEditPreparednessComponent} from "./preparedness/create-edit/create-edit.component";
import {CountryOfficeProfileComponent} from "./country-admin/country-office-profile/country-office-profile.component";
import {AgencyNotificationsComponent} from "./agency-admin/agency-notifications/agency-notifications.component";
import {ExportTestComponent} from "./export-test/export-test.component";

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
import {DonorListViewComponent} from "./donor-module/donor-list-view/donor-list-view.component";
import { CountryOfficeAddEditCoordinationComponent } from "./country-admin/country-office-profile/coordination/add-edit-coordination/add-edit-coordination.component";
import { CountryOfficeStockCapacityComponent } from "./country-admin/country-office-profile/stock-capacity/stock-capacity.component";
import { CountryOfficeAddEditStockCapacityComponent } from "./country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity/add-edit-stock-capacity.component";

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
   * System admin
   */
  {path: 'system-admin/min-prep/create', component: CreateActionComponent},
  {path: 'system-admin/min-prep/create/:id', component: CreateActionComponent},
  {path: 'system-admin/min-prep', component: MinPrepComponent},
  {path: 'system-admin/mpa/create', component: CreateMpaActionComponent},
  {path: 'system-admin/mpa/create/:id', component: CreateMpaActionComponent},
  {path: 'system-admin/mpa', component: MpaComponent},
  {path: 'system-admin/add-agency', component: AddAgencyComponent},
  {path: 'system-admin/add-agency/:id', component: AddAgencyComponent},
  {path: 'system-admin/messages/create', component: MessagesCreateComponent},
  {path: 'system-admin/messages', component: MessagesComponent},
  {path: 'system-admin/agency', component: SystemAdminComponent},
  {path: 'system-admin/account-settings', component: AccountSettingsComponent},
  {path: 'system-admin/account-settings/change-password', component: ChangePasswordComponent},
  {path: 'system-admin/network', component: GlobalNetworksComponent},
  {path: 'system-admin/network/create', component: CreateEditGlobalNetworkComponent},
  {path: 'system-admin/network/create:id', component: CreateEditGlobalNetworkComponent},
  {path: 'system-admin/system-settings', component: SystemSettingsComponent},
  {path: 'system-admin/system-settings/system-settings-documents', component: SystemSettingsDocumentsComponent},
  {
    path: 'system-admin/system-settings/system-settings-response-plans',
    component: SystemSettingsResponsePlansComponent
  },

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

  /**
   * Country admin
   */
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
  {path: 'country-admin/settings/country-clock-settings', component: CountryClockSettingsComponent},
  {path: 'country-admin/settings/country-modules-settings', component: CountryModulesSettingsComponent},
  {path: 'country-admin/settings/country-permission-settings', component: CountryPermissionSettingsComponent},
  {path: 'country-admin/settings/country-notification-settings', component: CountryNotificationSettingsComponent},
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
  {path: 'country-admin/country-office-profile/coordination/add-edit-coordination', component: CountryOfficeAddEditCoordinationComponent},
  {path: 'country-admin/country-office-profile/stock-capacity', component: CountryOfficeStockCapacityComponent},
  {path: 'country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity', component: CountryOfficeAddEditStockCapacityComponent},
  {path: 'country-admin/country-my-agency', component: CountryMyAgencyComponent},
  {path: 'country-admin/country-agencies', component: CountryAgenciesComponent},

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


  /**
   * Risk Monitoring
   */
  {path: 'risk-monitoring', component: RiskMonitoringComponent},
  {path: 'risk-monitoring/create-alert', component: CreateAlertRiskMonitoringComponent},
  {path: 'risk-monitoring/add-indicator/:hazardID/:indicatorID', component: AddIndicatorRiskMonitoringComponent},
  {path: 'risk-monitoring/add-indicator/:hazardID', component: AddIndicatorRiskMonitoringComponent},
  {path: 'risk-monitoring/add-hazard', component: AddHazardRiskMonitoringComponent},

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
  {path: 'preparedness', component: PreparednessComponent},

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

  /**
   * Donor
   */
  {path: 'donor-module', component: DonorModuleComponent},
  {path: 'donor-module/donor-list-view', component: DonorListViewComponent},
  {path: 'donor-module/donor-country-index', component: DonorCountryIndexComponent},

  /*
   * test
   * */
  {path: 'export', component: ExportTestComponent}

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
