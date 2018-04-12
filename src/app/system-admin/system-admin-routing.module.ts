import {NgModule} from "@angular/core";
import {MinPrepComponent} from "./min-prep/min-prep.component";
import {MpaComponent} from "./mpa/mpa.component";
import {SystemAdminViewCocComponent} from "./account-settings/view-coc/system-admin-view-coc.component";
import {SystemAdminComponent} from "./agency/system-admin.component";
import {CreateActionComponent} from "./min-prep/create-action/create-action.component";
import {RouterModule, Routes} from "@angular/router";
import {AccountSettingsComponent} from "./account-settings/account-settings.component";
import {MessagesComponent} from "./messages/messages.component";
import {ChangePasswordComponent} from "./account-settings/change-password/change-password.component";
import {SystemSettingsTocComponent} from "./system-settings/system-settings-toc/system-settings-toc.component";
import {CreateMpaActionComponent} from "./mpa/create-mpa-action/create-mpa-action.component";
import {SystemSettingsComponent} from "./system-settings/system-settings.component";
import {AddAgencyComponent} from "./add-agency/add-agency.component";
import {MessagesCreateComponent} from "./messages/messages-create/messages-create.component";
import {GlobalNetworksComponent} from "./global-networks/global-networks.component";
import {CreateEditGlobalNetworkComponent} from "./global-networks/create-edit-global-network/create-edit-global-network.component";
import {SystemSettingsDocumentsComponent} from "./system-settings/system-settings-documents/system-settings-documents.component";
import {SystemSettingsCocComponent} from "./system-settings/system-settings-coc/system-settings-coc.component";
import {SystemSettingsResponsePlansComponent} from "./system-settings/system-settings-response-plans/system-settings-response-plans.component";

const systemRoutes: Routes = [
  // {path: '', component: SystemAdminComponent},
  {path: 'system-admin/agency', component: SystemAdminComponent},
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
  {path: 'system-admin/account-settings', component: AccountSettingsComponent},
  {path: 'system-admin/account-settings/change-password', component: ChangePasswordComponent},
  {path: 'system-admin/network', component: GlobalNetworksComponent},
  {path: 'system-admin/network/create', component: CreateEditGlobalNetworkComponent},
  {path: 'system-admin/network/create:id', component: CreateEditGlobalNetworkComponent},
  {path: 'system-admin/system-settings', component: SystemSettingsComponent},
  {path: 'system-admin/system-settings/system-settings-documents', component: SystemSettingsDocumentsComponent},
  {path: 'system-admin/system-settings/system-settings-toc', component: SystemSettingsTocComponent},
  {path: 'system-admin/system-settings/system-settings-coc', component: SystemSettingsCocComponent},
  {path: 'system-admin/account-settings/view-coc/system-admin-view-coc', component: SystemAdminViewCocComponent},
  {path: 'system-admin/system-settings/system-settings-response-plans', component: SystemSettingsResponsePlansComponent},
]

@NgModule({
  imports:[
    RouterModule.forChild(systemRoutes)
  ],
  exports: [RouterModule]
})
export class SystemAdminRoutingModule {

}
