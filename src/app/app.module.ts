import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2'

import { AppComponent } from './app.component';
import { MyNewComponentComponent } from './my-new-component/my-new-component.component';
import { LoginComponent } from './login/login.component';
import { SystemAdminComponent } from './system-admin/system-admin.component';
import { AgencyAdminComponent } from './agency-admin/agency-admin.component';
import { CountryAdminComponent } from './country-admin/country-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResponsePlansComponent } from './response-plans/response-plans.component';
import { PreparednessComponent } from './preparedness/preparedness.component';
import { RiskMonitoringComponent } from './risk-monitoring/risk-monitoring.component';
import { CountryOfficeProfileComponent } from './country-office-profile/country-office-profile.component';
import { MapComponent } from './map/map.component';
import { DirectorDashboardComponent } from './director-dashboard/director-dashboard.component';
import { DonorModuleComponent } from './donor-module/donor-module.component';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDC5QFD23t701ackZXBFhurvsMoIdJ3JZQ",
  authDomain: "alert-190fa.firebaseapp.com",
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
    MyNewComponentComponent,
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
    DonorModuleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
