import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AgencyAdminComponent} from "./agency-admin/agency-admin.component";
import {ForgotPasswordComponent} from "./login/forgot-password/forgot-password.component";
import {SystemAdminComponent} from "./system-admin/system-admin.component";
import {AddAgencyComponent} from "./system-admin/add-agency/add-agency.component";
import {MessagesComponent} from "./system-admin/messages/messages.component";
import {MessagesCreateComponent} from "./system-admin/messages/messages-create/messages-create.component";
import {MinPrepComponent} from "./system-admin/min-prep/min-prep.component";
import {MpaComponent} from "./system-admin/mpa/mpa.component";
import {CreateActionComponent} from "./system-admin/min-prep/create-action/create-action.component";
import {CreateMpaActionComponent} from './system-admin/mpa/create-mpa-action/create-mpa-action.component';
import {SystemSettingsComponent} from "./system-admin/system-settings/system-settings.component";
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

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login/:emailEntered', component: LoginComponent},
  {path: 'agency-admin', component: AgencyAdminComponent},
  {path: 'system-admin/system-settings', component: SystemSettingsComponent},
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
  {path: 'system-admin', component: SystemAdminComponent},
  {path: 'system-admin/network', component: SystemAdminComponent},
  {path: 'country-admin',  component: CountryAdminComponent},
  //TODO: define needed routes here. see the example above

  /**
   * Agency admin
   */
  {path: 'agency-admin/create-password', component: CreatePasswordComponent},
  {path: 'agency-admin/agency-details', component: AgencyDetailsComponent},
  {path: 'agency-admin/country-office', component: CountryOfficeComponent},
  {path: 'agency-admin/country-office/create-edit-country', component: CreateEditCountryComponent},
  {path: 'agency-admin/agency-mpa', component: AgencyMpaComponent},
  {path: 'agency-admin/agency-mpa/create-edit-mpa', component: CreateEditMpaComponent},
  {path: 'agency-admin/agency-messages/create-edit-message', component: CreateEditMessageComponent},
  {path: 'agency-admin/agency-messages', component: AgencyMessagesComponent},
  {path: 'agency-admin/staff', component: StaffComponent},
  {path: 'agency-admin/staff/create-edit-staff', component: CreateEditStaffComponent}
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
