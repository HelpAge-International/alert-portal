import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AgencyAdminComponent} from "./agency-admin/agency-admin.component";
import {ForgotPasswordComponent} from "./login/forgot-password/forgot-password.component";
import {SystemAdminComponent} from "./system-admin/agency/system-admin.component";
import {AddAgencyComponent} from "./system-admin/add-agency/add-agency.component";
import {MessagesComponent} from "./system-admin/messages/messages.component";
import {MessagesCreateComponent} from "./system-admin/messages/messages-create/messages-create.component";
import {MinPrepComponent} from "./system-admin/min-prep/min-prep.component";
import {MpaComponent} from "./system-admin/mpa/mpa.component";
import {CreateActionComponent} from "./system-admin/min-prep/create-action/create-action.component";
import {CreateMpaActionComponent} from './system-admin/mpa/create-mpa-action/create-mpa-action.component';
import {CountryAdminComponent} from "./country-admin/country-admin.component";
import {CreatePasswordComponent} from "./agency-admin/create-password/create-password.component";
import {AgencyDetailsComponent} from "./agency-admin/agency-details/agency-details.component";
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
import {SystemSettingsPreparednessComponent} from "./system-admin/system-settings/system-settings-preparedness/system-settings-preparedness.component";
import {SystemSettingsResponsePlansComponent} from "./system-admin/system-settings/system-settings-response-plans/system-settings-response-plans.component";

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},

  /**
   * Login
   */
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'login', component: LoginComponent},
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
  {path: 'system-admin/system-settings/system-settings-documents', component: SystemSettingsDocumentsComponent},
  {path: 'system-admin/system-settings/system-settings-preparedness', component: SystemSettingsPreparednessComponent},
  {path: 'system-admin/system-settings/system-settings-response-plans', component: SystemSettingsResponsePlansComponent},

  /**
   * Agency admin
   */
  {path: 'agency-admin', component: AgencyAdminComponent},
  {path: 'agency-admin/create-password', component: CreatePasswordComponent},
  {path: 'agency-admin/agency-details', component: AgencyDetailsComponent},
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
  {path: 'agency-admin/staff', component: StaffComponent},
  {path: 'agency-admin/staff/create-edit-staff', component: CreateEditStaffComponent},
  {path: 'agency-admin/agency-account-settings', component: AgencyAccountSettingsComponent},
  {path: 'agency-admin/agency-account-details', component: AgencyAccountDetailsComponent},
  {path: 'agency-admin/agency-account-settings/agency-change-password', component: AgencyChangePasswordComponent},

  /**
   * Country admin
   */
  {path: 'country-admin',  component: CountryAdminComponent}
  //TODO: define needed routes here. see the example above


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
