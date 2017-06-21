import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule, Http} from "@angular/http";
import {AngularFireModule, AuthProviders, AuthMethods} from "angularfire2";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {SystemAdminComponent} from "./system-admin/agency/system-admin.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ResponsePlansComponent} from "./response-plans/response-plans.component";
import {PreparednessComponent} from "./preparedness/preparedness.component";
import {RiskMonitoringComponent} from "./risk-monitoring/risk-monitoring.component";
import {CountryOfficeProfileComponent} from "./country-admin/country-office-profile/country-office-profile.component";
import {MapComponent} from "./map/map.component";
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
import "hammerjs";
import {SystemAdminHeaderComponent} from "./system-admin/system-admin-header/system-admin-header.component";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
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
import {SystemSettingsResponsePlansComponent} from './system-admin/system-settings/system-settings-response-plans/system-settings-response-plans.component';
import {SystemSettingsDocumentsComponent} from './system-admin/system-settings/system-settings-documents/system-settings-documents.component';
import {NewAgencyPasswordComponent} from './agency-admin/new-agency/new-agency-password/new-agency-password.component';
import {NewAgencyDetailsComponent} from './agency-admin/new-agency/new-agency-details/new-agency-details.component';
import {KeysPipe} from './utils/pipes/keys.pipe';
import {EnumKeysPipe} from './utils/pipes/enum-keys.pipe';
import {KeyValuesPipe} from './utils/pipes/key-values.pipe';
import {NewCountryDetailsComponent} from './country-admin/new-country/new-country-details/new-country-details.component';
import {NewCountryPasswordComponent} from './country-admin/new-country/new-country-password/new-country-password.component';
import {CountryAccountSettingsComponent} from './country-admin/country-account-settings/country-account-settings.component';
import {CountryChangePasswordComponent} from './country-admin/country-account-settings/country-change-password/country-change-password.component';
import {CountryAdminHeaderComponent} from './country-admin/country-admin-header/country-admin-header.component';
import {CountryAdminMenuComponent} from './country-admin/country-admin-menu/country-admin-menu.component';
import {CountryMessagesComponent} from './country-admin/country-messages/country-messages.component';
import {CountryCreateEditMessageComponent} from './country-admin/country-messages/country-create-edit-message/country-create-edit-message.component';
import {CountryPermissionSettingsComponent} from './country-admin/settings/country-permission-settings/country-permission-settings.component';
import {CountryModulesSettingsComponent} from './country-admin/settings/country-modules-settings/country-modules-settings.component';
import {CountryClockSettingsComponent} from './country-admin/settings/country-clock-settings/country-clock-settings.component';
import {CountryNotificationSettingsComponent} from './country-admin/settings/country-notification-settings/country-notification-settings.component';
import {CountryAddExternalRecipientComponent} from './country-admin/settings/country-notification-settings/country-add-external-recipient/country-add-external-recipient.component';
import {CountryStaffComponent} from './country-admin/country-staff/country-staff.component';
import {CountryAddEditPartnerComponent} from './country-admin/country-staff/country-add-edit-partner/country-add-edit-partner.component';
import {CountryAddEditStaffComponent} from './country-admin/country-staff/country-add-edit-staff/country-add-edit-staff.component';
import {CreateEditResponsePlanComponent} from './response-plans/create-edit-response-plan/create-edit-response-plan.component';
import {AddPartnerOrganisationComponent} from './response-plans/add-partner-organisation/add-partner-organisation.component';
import {OrdinalPipe} from './utils/pipes/ordinal.pipe';
import {StatusAlertComponent} from './commons/status-alert/status-alert.component';
import {AgencyNotificationsComponent} from './agency-admin/agency-notifications/agency-notifications.component';
import {DatepickerModule} from 'angular2-material-datepicker';
import {MinimumPreparednessComponent} from './preparedness/minimum/minimum.component';
import {AdvancedPreparednessComponent} from './preparedness/advanced/advanced.component';
import {BudgetPreparednessComponent} from './preparedness/budget/budget.component';
import {SelectPreparednessComponent} from './preparedness/select/select.component';
import {CreateEditPreparednessComponent} from './preparedness/create-edit/create-edit.component';
import {CreateAlertRiskMonitoringComponent} from './risk-monitoring/create-alert/create-alert.component';
import {AddIndicatorRiskMonitoringComponent} from './risk-monitoring/add-indicator/add-indicator.component';
import {AddHazardRiskMonitoringComponent} from './risk-monitoring/add-hazard/add-hazard.component';
import {CountryMyAgencyComponent} from "./country-admin/country-my-agency/country-my-agency.component";
import {ExportStartFundComponent} from './export-start-fund/export-start-fund.component';
import {LocalStorageModule} from 'angular-2-local-storage';
import {CountryAgenciesComponent} from "./country-admin/country-agencies/country-agencies.component";
import {AgencySubmenuComponent} from './preparedness/agency-submenu/agency-submenu.component';
import {CountrySubmenuComponent} from './preparedness/country-submenu/country-submenu.component';
import {AlertWidgetComponent} from './commons/alert-widget/alert-widget.component';
import {MapCountriesListComponent} from './map/map-countries-list/map-countries-list.component';
import {UserService} from "./services/user.service";
import {NoteService} from "./services/note.service"
import {DashboardSeasonalCalendarComponent} from './dashboard/dashboard-seasonal-calendar/dashboard-seasonal-calendar.component';
import {DashboardUpdateAlertLevelComponent} from './dashboard/dashboard-update-alert-level/dashboard-update-alert-level.component';
import {SessionService} from "./services/session.service";
import {CommonService} from "./services/common.service";
import {SettingsService} from "./services/settings.service";
import {CountryAdminSettingsMenuComponent} from "./country-admin/settings/settings-menu/settings-menu.component";
import {CountryOfficeProfileMenuComponent} from "./country-admin/country-office-profile/office-profile-menu/office-profile-menu.component";
import {EnumKeyValuesPipe} from "./utils/pipes/enum-keyValues.pipe";
import {MessageService} from "./services/message.service";
import {NotificationService} from "./services/notification.service";
import {ReviewResponsePlanComponent} from './dashboard/review-response-plan/review-response-plan.component';
import {FacetofaceMeetingRequestComponent} from './dashboard/facetoface-meeting-request/facetoface-meeting-request.component';
import {CountryStatisticsRibbonComponent} from './country-statistics-ribbon/country-statistics-ribbon.component';
import {ViewResponsePlanComponent} from './commons/view-response-plan/view-response-plan.component';
import {CountryOfficePartnersComponent} from "./country-admin/country-office-profile/partners/partners.component";
import {ViewPlanComponent} from './response-plans/view-plan/view-plan.component';
import {DirectorMenuComponent} from './director/director-menu/director-menu.component';
import {DirectorComponent} from './director/director.component';
import {DirectorHeaderComponent} from './director/director-header/director-header.component';
import {DirectorOverviewComponent} from './director/director-overview/director-overview.component';
import {ViewCountryMenuComponent} from './commons/view-country-menu/view-country-menu.component';
import {AlertLoaderComponent} from './commons/alert-loader/alert-loader.component';
import {CountryOfficeEquipmentComponent} from "./country-admin/country-office-profile/equipment/equipment.component";
import {EquipmentService} from "./services/equipment.service";
import {CountryOfficeAddEditEquipmentComponent} from "./country-admin/country-office-profile/equipment/add-edit-equipment/add-edit-equipment.component";
import {CountryOfficeAddEditSurgeEquipmentComponent} from "./country-admin/country-office-profile/equipment/add-edit-surge-equipment/add-edit-surge-equipment.component";
import {CountryOfficeCoordinationComponent} from "./country-admin/country-office-profile/coordination/coordination.component";
import {CoordinationArrangementService} from "./services/coordination-arrangement.service";
import {CountryOfficeAddEditCoordinationComponent} from "./country-admin/country-office-profile/coordination/add-edit-coordination/add-edit-coordination.component";
import {AgencyService} from "./services/agency-service.service";
import {ExternalPartnerResponsePlan} from "./response-plans/external-partner-response-plan/external-partner-response-plan.component";
import {DonorCountryIndexComponent} from './donor-module/donor-country-index/donor-country-index.component';
import {DonorHeaderComponent} from './donor-module/donor-header/donor-header.component';
import {DonorMenuComponent} from './donor-module/donor-menu/donor-menu.component';
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import {DonorListViewComponent} from './donor-module/donor-list-view/donor-list-view.component';
import {ReplacePipe} from "./utils/pipes/replace.pipe";
import {CountryOfficeStockCapacityComponent} from "./country-admin/country-office-profile/stock-capacity/stock-capacity.component";
import {StockService} from "./services/stock.service";
import {CountryOfficeAddEditStockCapacityComponent} from "./country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity/add-edit-stock-capacity.component";
import {CountryOfficeContactsComponent} from "./country-admin/country-office-profile/contacts/contacts.component";
import {CountryOfficeEditOfficeDetailsComponent} from "./country-admin/country-office-profile/contacts/edit-office-details/edit-office-details.component";
import {CountryOfficeAddEditPointOfContactComponent} from "./country-admin/country-office-profile/contacts/add-edit-point-of-contact/add-edit-point-of-contact.component";
import {CountryOfficeDocumentsComponent} from "./country-admin/country-office-profile/documents/documents.component";
import {ContactService} from "./services/contact.service";
import {ProjectNarrativeComponent} from "./export-start-fund/project-narrative/project-narrative.component";
import {ProjectBudgetComponent} from "./export-start-fund/project-budget/project-budget.component";
import {ProjectReportComponent} from "./export-start-fund/project-report/project-report.component";
import {CountryOfficeProgrammeComponent} from "./country-admin/country-office-profile/programme/programme.component";
import {CountryOfficeEditProgrammeComponent} from "./country-admin/country-office-profile/programme/edit-programme/edit-programme.component";
import {AddEditMappingProgrammeComponent} from "./country-admin/country-office-profile/programme/add-edit-mapping/add-edit-mapping.component";
import {PageControlService} from "./services/pagecontrol.service";
import {DonorAccountSettingsComponent} from './donor-module/donor-account-settings/donor-account-settings.component';
import {DonorChangePasswordComponent} from './donor-module/donor-account-settings/donor-change-password/donor-change-password.component';
import {NewDonorPasswordComponent} from './donor-module/new-donor-password/new-donor-password.component';
import {CountryOfficeCapacityComponent} from "./country-admin/country-office-profile/office-capacity/office-capacity.component";
import {BudgetReportComponent} from "./export-start-fund/budget-report/budget-report.component";
import {ProjectActivitiesComponent} from "./export-start-fund/project-activities/project-activities.component";
import {TechnicalGuidanceComponent} from "./export-start-fund/technical-guidance/technical-guidance.component";
import {GuidanceReportComponent} from "./export-start-fund/guidance-report/guidance-report.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TooltipComponent} from "./utils/tooltips/tooltip.component";
import { TimeAgoPipe } from "./utils/pipes/time-ago.pipe";
import { CountryNotificationsComponent } from "./country-admin/country-notifications/country-notifications.component";

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
    ResetPasswordComponent,
    SystemAdminComponent,
    DashboardComponent,
    ResponsePlansComponent,
    PreparednessComponent,
    RiskMonitoringComponent,
    CountryOfficeProfileComponent,
    MapComponent,
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
    CountryOfficeComponent,
    CreateEditCountryComponent,
    CreateEditMpaComponent,
    SettingsMenuComponent,
    CountryAdminSettingsMenuComponent,
    CountryOfficeProfileMenuComponent,
    CountryOfficePartnersComponent,
    CountryOfficeEquipmentComponent,
    CountryOfficeAddEditEquipmentComponent,
    CountryOfficeAddEditSurgeEquipmentComponent,
    CountryOfficeCoordinationComponent,
    CountryOfficeAddEditCoordinationComponent,
    CountryOfficeStockCapacityComponent,
    CountryOfficeAddEditStockCapacityComponent,
    CountryOfficeContactsComponent,
    CountryOfficeEditOfficeDetailsComponent,
    CountryOfficeAddEditPointOfContactComponent,
    CountryOfficeDocumentsComponent,
    CountryOfficeCapacityComponent,
    AgencyAdminMenuComponent,
    DepartmentComponent,
    SkillsComponent,
    ModulesComponent,
    ClockSettingsComponent,
    DocumentsComponent,
    NetworkComponent,
    CreateEditNetworkComponent,
    NotificationComponent,
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
    AgencyAdminSettingsResponsePlanComponent,
    SystemSettingsResponsePlansComponent,
    SystemSettingsDocumentsComponent,
    NewAgencyPasswordComponent,
    NewAgencyDetailsComponent,
    KeysPipe,
    EnumKeysPipe,
    EnumKeyValuesPipe,
    KeyValuesPipe,
    NewCountryDetailsComponent,
    NewCountryPasswordComponent,
    CountryAccountSettingsComponent,
    CountryChangePasswordComponent,
    CountryAdminHeaderComponent,
    CountryAdminMenuComponent,
    CountryMessagesComponent,
    CountryCreateEditMessageComponent,
    CountryPermissionSettingsComponent,
    CountryModulesSettingsComponent,
    CountryClockSettingsComponent,
    CountryNotificationSettingsComponent,
    CountryAddExternalRecipientComponent,
    CountryStaffComponent,
    CountryAddEditPartnerComponent,
    CountryAddEditStaffComponent,
    CreateEditResponsePlanComponent,
    AddPartnerOrganisationComponent,
    OrdinalPipe,
    StatusAlertComponent,
    AgencyNotificationsComponent,
    MinimumPreparednessComponent,
    AdvancedPreparednessComponent,
    BudgetPreparednessComponent,
    SelectPreparednessComponent,
    CreateEditPreparednessComponent,
    CreateAlertRiskMonitoringComponent,
    AddIndicatorRiskMonitoringComponent,
    AddHazardRiskMonitoringComponent,
    AgencySubmenuComponent,
    CountrySubmenuComponent,
    AlertWidgetComponent,
    CountryMyAgencyComponent,
    MapCountriesListComponent,
    ExportStartFundComponent,
    DashboardSeasonalCalendarComponent,
    DashboardUpdateAlertLevelComponent,
    CountryAgenciesComponent,
    ReviewResponsePlanComponent,
    FacetofaceMeetingRequestComponent,
    CountryStatisticsRibbonComponent,
    ViewResponsePlanComponent,
    ViewPlanComponent,
    DirectorMenuComponent,
    DirectorComponent,
    DirectorHeaderComponent,
    DirectorOverviewComponent,
    ViewCountryMenuComponent,
    AlertLoaderComponent,
    DonorCountryIndexComponent,
    DonorHeaderComponent,
    DonorMenuComponent,
    AlertLoaderComponent,
    ExternalPartnerResponsePlan,
    ReplacePipe,
    CountryOfficeProgrammeComponent,
    DonorListViewComponent,
    ReplacePipe,
    ProjectNarrativeComponent,
    ProjectBudgetComponent,
    ProjectReportComponent,
    CountryOfficeEditProgrammeComponent,
    AddEditMappingProgrammeComponent,
    DonorAccountSettingsComponent,
    DonorChangePasswordComponent,
    NewDonorPasswordComponent,
    BudgetReportComponent,
    ProjectActivitiesComponent,
    TechnicalGuidanceComponent,
    GuidanceReportComponent,
    TooltipComponent,
    GuidanceReportComponent,
    TimeAgoPipe,
    CountryNotificationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
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
    BootstrapModalModule,
    DatepickerModule,
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    })
  ],
  providers: [
              RxHelper,
              Modal,
              UserService,
              SessionService,
              CommonService,
              SettingsService,
              MessageService,
              NotificationService,
              NoteService,
              EquipmentService,
              CoordinationArrangementService,
              AgencyService,
              StockService,
              PageControlService,
              ContactService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
