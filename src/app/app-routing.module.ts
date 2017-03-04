import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
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
import { CreateMpaActionComponent } from './system-admin/mpa/create-mpa-action/create-mpa-action.component';
import {SystemSettingsComponent} from "./system-admin/system-settings/system-settings.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'forgot-password',  component: ForgotPasswordComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'agency-admin',  component: AgencyAdminComponent },
  { path: 'system-admin/system-settings',  component: SystemSettingsComponent},
  { path: 'system-admin/min-prep/create',  component: CreateActionComponent},
  { path: 'system-admin/min-prep',  component: MinPrepComponent},
  { path: 'system-admin/mpa/create',  component: CreateMpaActionComponent},
  { path: 'system-admin/mpa',  component: MpaComponent},
  { path: 'system-admin/add-agency',  component: AddAgencyComponent },
  { path: 'system-admin/messages/create',  component: MessagesCreateComponent },
  { path: 'system-admin/messages',  component: MessagesComponent },
  { path: 'system-admin',  component: SystemAdminComponent },
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
export class AppRoutingModule { }
