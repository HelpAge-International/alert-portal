import {NgModule} from "@angular/core";
import {SystemSettingsDocumentsComponent} from "./system-settings/system-settings-documents/system-settings-documents.component";
import {SystemSettingsResponsePlansComponent} from "./system-settings/system-settings-response-plans/system-settings-response-plans.component";
import {SystemAdminHeaderComponent} from "./system-admin-header/system-admin-header.component";
import {SystemAdminViewCocComponent} from "./account-settings/view-coc/system-admin-view-coc.component";
import {SystemAdminComponent} from "./agency/system-admin.component";
import {SystemSettingsTocComponent} from "./system-settings/system-settings-toc/system-settings-toc.component";
import {SystemAdminMenuComponent} from "./system-admin-menu/system-admin-menu.component";
import {SystemSettingsComponent} from "./system-settings/system-settings.component";
import {SystemSettingsCocComponent} from "./system-settings/system-settings-coc/system-settings-coc.component";
import {SharedModule} from "../commons/shared.module";
import {HttpLoaderFactory} from "../app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Http} from "@angular/http";
import {MinPrepComponent} from "./min-prep/min-prep.component";
import {MpaComponent} from "./mpa/mpa.component";
import {CreateActionComponent} from "./min-prep/create-action/create-action.component";
import {AccountSettingsComponent} from "./account-settings/account-settings.component";
import {AddAgencyComponent} from "./add-agency/add-agency.component";
import {GlobalNetworksComponent} from "./global-networks/global-networks.component";
import {MessagesCreateComponent} from "./messages/messages-create/messages-create.component";
import {MessagesComponent} from "./messages/messages.component";
import {ChangePasswordComponent} from "./account-settings/change-password/change-password.component";
import {CreateMpaActionComponent} from "./mpa/create-mpa-action/create-mpa-action.component";
import {SystemAdminRoutingModule} from "./system-admin-routing.module";
import {CreateEditGlobalNetworkComponent} from "./global-networks/create-edit-global-network/create-edit-global-network.component";

@NgModule({
  declarations: [
    SystemAdminComponent,
    SystemAdminMenuComponent,
    SystemAdminHeaderComponent,
    SystemSettingsComponent,
    SystemSettingsResponsePlansComponent,
    SystemSettingsDocumentsComponent,
    SystemSettingsTocComponent,
    SystemSettingsCocComponent,
    SystemAdminViewCocComponent,
    CreateActionComponent,
    MinPrepComponent,
    CreateMpaActionComponent,
    MpaComponent,
    AddAgencyComponent,
    MessagesCreateComponent,
    MessagesComponent,
    AccountSettingsComponent,
    ChangePasswordComponent,
    GlobalNetworksComponent,
    CreateEditGlobalNetworkComponent
  ],
  imports: [
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    SystemAdminRoutingModule
  ],
  exports: [
    SystemAdminComponent,
    SystemAdminMenuComponent,
    SystemAdminHeaderComponent,
    SystemSettingsComponent,
    SystemSettingsResponsePlansComponent,
    SystemSettingsDocumentsComponent,
    SystemSettingsTocComponent,
    SystemSettingsCocComponent,
    SystemAdminViewCocComponent,
    CreateActionComponent,
    MinPrepComponent,
    CreateMpaActionComponent,
    MpaComponent,
    AddAgencyComponent,
    MessagesCreateComponent,
    MessagesComponent,
    AccountSettingsComponent,
    ChangePasswordComponent,
    GlobalNetworksComponent,
    CreateEditGlobalNetworkComponent
  ]
})
export class SystemAdminModule {

}
