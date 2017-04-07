import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule, Http} from "@angular/http";
import {AngularFireModule, AuthProviders, AuthMethods} from "angularfire2";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {SystemAdminComponent} from "./system-admin/agency/system-admin.component";
import {AgencyAdminComponent} from "./agency-admin/agency-admin.component";
import {CountryAdminComponent} from "./country-admin/country-admin.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ResponsePlansComponent} from "./response-plans/response-plans.component";
import {PreparednessComponent} from "./preparedness/preparedness.component";
import {RiskMonitoringComponent} from "./risk-monitoring/risk-monitoring.component";
import {CountryOfficeProfileComponent} from "./country-office-profile/country-office-profile.component";
import {MapComponent} from "./map/map.component";
import {DirectorDashboardComponent} from "./director-dashboard/director-dashboard.component";
import {DonorModuleComponent} from "./donor-module/donor-module.component";
import {AppRoutingModule} from "./app-routing.module";
import {ForgotPasswordComponent} from "./login/forgot-password/forgot-password.component";
import {AddAgencyComponent} from "./system-admin/add-agency/add-agency.component";
import {MessagesComponent} from "./system-admin/messages/messages.component";
import {SystemAdminMenuComponent} from "./system-admin/system-admin-menu/system-admin-menu.component";
import {MessagesCreateComponent} from "./system-admin/messages/messages-create/messages-create.component";
import {MinPrepComponent} from "./system-admin/min-prep/min-prep.component";
import {MpaComponent} from "./system-admin/mpa/mpa.component";
import {CreateActionComponent} from "./system-admin/min-prep/create-action/create-action.component";
import {CreateMpaActionComponent} from "./system-admin/mpa/create-mpa-action/create-mpa-action.component";
import {SystemSettingsComponent} from "./system-admin/system-settings/system-settings.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MaterialModule} from "@angular/material";
import "hammerjs";
import {SystemAdminHeaderComponent} from "./system-admin/system-admin-header/system-admin-header.component";
import {DialogComponent} from "./dialog/dialog.component";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {DialogService} from "./dialog/dialog.service";
import {CreatePasswordComponent} from "./agency-admin/create-password/create-password.component";
import {AgencyDetailsComponent} from "./agency-admin/agency-details/agency-details.component";
import {CountryOfficeComponent} from "./agency-admin/country-office/country-office.component";
import {CreateEditCountryComponent} from "./agency-admin/country-office/create-edit-country/create-edit-country.component";
import {CreateEditMpaComponent} from "./agency-admin/agency-mpa/create-edit-mpa/create-edit-mpa.component";
import {SettingsMenuComponent} from "./agency-admin/settings/settings-menu/settings-menu.component";
import {AgencyAdminMenuComponent} from "./agency-admin/agency-admin-menu/agency-admin-menu.component";
import {DepartmentComponent} from "./agency-admin/settings/department/department.component";
import {SkillsComponent} from "./agency-admin/settings/skills/skills.component";
import {ModulesComponent} from "./agency-admin/settings/modules/modules.component";
import {ClockSettingsComponent} from "./agency-admin/settings/clock-settings/clock-settings.component";
import {DocumentsComponent} from "./agency-admin/settings/documents/documents.component";
import {NetworkComponent} from "./agency-admin/settings/network/network.component";
import {CreateEditNetworkComponent} from "./agency-admin/settings/network/create-edit-network/create-edit-network.component";
import {NotificationComponent} from "./agency-admin/settings/notification/notification.component";
import {CreateEditNotificationComponent} from "./agency-admin/settings/notification/create-edit-notification/create-edit-notification.component";
import {StaffComponent} from "./agency-admin/staff/staff.component";
import {CreateEditStaffComponent} from "./agency-admin/staff/create-edit-staff/create-edit-staff.component";
import {AgencyMpaComponent} from "./agency-admin/agency-mpa/agency-mpa.component";
import {AgencyMessagesComponent} from "./agency-admin/agency-messages/agency-messages.component";
import {CreateEditMessageComponent} from "./agency-admin/agency-messages/create-edit-message/create-edit-message.component";
import {AgencyAdminHeaderComponent} from "./agency-admin/agency-admin-header/agency-admin-header.component";
import {AccountSettingsComponent} from './system-admin/account-settings/account-settings.component';
import {ChangePasswordComponent} from './system-admin/account-settings/change-password/change-password.component';
import {GlobalNetworksComponent} from './system-admin/global-networks/global-networks.component';
import {CreateEditGlobalNetworkComponent} from './system-admin/global-networks/create-edit-global-network/create-edit-global-network.component';
import {AddGenericActionComponent} from './agency-admin/agency-mpa/add-generic-action/add-generic-action.component';
import {AgencyAccountSettingsComponent} from './agency-admin/agency-account-settings/agency-account-settings.component';
import {AgencyAccountDetailsComponent} from './agency-admin/agency-account-details/agency-account-details.component';
import {AgencyChangePasswordComponent} from './agency-admin/agency-account-settings/agency-change-password/agency-change-password.component';
import {CreateEditRegionComponent} from './agency-admin/country-office/create-edit-region/create-edit-region.component';
import {RxHelper} from './utils/RxHelper';
import {ModalModule} from "angular2-modal";
import {BootstrapModalModule} from "angular2-modal/plugins/bootstrap";
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {AgencyAdminSettingsResponsePlanComponent} from './agency-admin/settings/agency-admin-settings-response-plan/agency-admin-settings-response-plan.component';

export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http);
}

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDC5QFD23t701ackZXBFhurvsMoIdJ3JZQ",
  authDomain: "alert-190fa.firebaseapp.com",
  // authDomain: "test.alertplatform.co.uk",
  databaseURL: "https://alert-190fa.firebaseio.com",
  storageBucket: "alert-190fa.appspot.com",
  messagingSenderId: "305491871378"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SystemAdminComponent,
    AgencyAdminComponent,
    CountryAdminComponent,
    DashboardComponent,
    ResponsePlansComponent,
    PreparednessComponent,
    RiskMonitoringComponent,
    CountryOfficeProfileComponent,
    MapComponent,
    DirectorDashboardComponent,
    DonorModuleComponent,
    ForgotPasswordComponent,
    AddAgencyComponent,
    MessagesComponent,
    SystemAdminMenuComponent,
    MessagesCreateComponent,
    MinPrepComponent,
    MpaComponent,
    CreateActionComponent,
    CreateMpaActionComponent,
    SystemSettingsComponent,
    SystemAdminHeaderComponent,
    DialogComponent,
    CreatePasswordComponent,
    AgencyDetailsComponent,
    CountryOfficeComponent,
    CreateEditCountryComponent,
    CreateEditMpaComponent,
    SettingsMenuComponent,
    AgencyAdminMenuComponent,
    DepartmentComponent,
    SkillsComponent,
    ModulesComponent,
    ClockSettingsComponent,
    DocumentsComponent,
    NetworkComponent,
    CreateEditNetworkComponent,
    NotificationComponent,
    CreateEditNotificationComponent,
    StaffComponent,
    CreateEditStaffComponent,
    AgencyMpaComponent,
    AgencyMessagesComponent,
    CreateEditMessageComponent,
    AgencyAdminHeaderComponent,
    AccountSettingsComponent,
    ChangePasswordComponent,
    GlobalNetworksComponent,
    CreateEditGlobalNetworkComponent,
    CreateEditRegionComponent,
    AddGenericActionComponent,
    AgencyAccountSettingsComponent,
    AgencyAccountDetailsComponent,
    AgencyChangePasswordComponent,
    AgencyAdminSettingsResponsePlanComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  entryComponents: [DialogComponent],
  providers: [DialogService, RxHelper, Modal],
  bootstrap: [AppComponent]
})

export class AppModule {
}
