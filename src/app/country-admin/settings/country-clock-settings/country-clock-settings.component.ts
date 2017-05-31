import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { RxHelper } from "../../../utils/RxHelper";
import { Constants } from '../../../utils/Constants';

import { UserService } from "../../../services/user.service";
import { SettingsService } from "../../../services/settings.service";
import { AlertMessageModel } from "../../../model/alert-message.model";
import { DisplayError } from "../../../errors/display.error";
import { ClockSettingsModel } from "../../../model/clock-settings.model";
import { AlertMessageType } from "../../../utils/Enums";

@Component({
  selector: 'app-country-clock-settings',
  templateUrl: './country-clock-settings.component.html',
  styleUrls: ['./country-clock-settings.component.css']
})
export class CountryClockSettingsComponent implements OnInit, OnDestroy {
  private uid: string;
  private agencyId: string;
  private countryId: string;

  DURATION_TYPE = Constants.DURATION_TYPE;
  DURATION_TYPE_SELECTION = Constants.DURATION_TYPE_SELECTION;
  private durations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private clockSettings: ClockSettingsModel;

  constructor(private _userService: UserService,
              private _settingsService: SettingsService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
        if(countryAdminUser)
        {
          this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
          this.countryId = countryAdminUser.countryId;

          this._settingsService.getCountryClockSettings(this.agencyId, this.countryId).subscribe(clockSettings => {
            this.clockSettings = clockSettings;
          })
        }
      });
    });
    this.subscriptions.add(authSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  validateForm(): boolean {
    this.alertMessage = this.clockSettings.validate();

    return !this.alertMessage;
  }

  submit() {

      this._settingsService.saveCountryClockSettings(this.agencyId, this.countryId, this.clockSettings)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.SAVED_SUCCESS', AlertMessageType.Success);
            })
            .catch(err => {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
  }
  
  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

}
