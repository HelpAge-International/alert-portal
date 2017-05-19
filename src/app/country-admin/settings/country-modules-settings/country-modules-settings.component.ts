import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { RxHelper } from "../../../utils/RxHelper";

import { UserService } from "../../../services/user.service";
import { Constants } from '../../../utils/Constants';
import { UserType, AlertMessageType, Privacy } from '../../../utils/Enums';
import { SettingsService } from "../../../services/settings.service";
import { AlertMessageModel } from "../../../model/alert-message.model";
import { DisplayError } from "../../../errors/display.error";
import { ModuleSettingsModel } from "../../../model/module-settings.model";


@Component({
  selector: 'app-country-modules-settings',
  templateUrl: './country-modules-settings.component.html',
  styleUrls: ['./country-modules-settings.component.css']
})
export class CountryModulesSettingsComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;

  // Constants and enums
  private moduleName = Constants.MODULE_NAME;
  private privacyOptions = Privacy;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private moduleSettings: ModuleSettingsModel[];

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
          this.countryId = countryAdminUser.countryId;

          this._settingsService.getModulesSettings(this.countryId).subscribe(modules => {
            this.moduleSettings = modules;
          })
        }
      });
    });
    this.subscriptions.add(authSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  setModulePrivacy(module: ModuleSettingsModel, value: number){
    module.privacy = value;
  }

  submit() {
      this._settingsService.saveModuleSettings(this.countryId, this.moduleSettings)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.MODULES.SAVED_SUCCESS', AlertMessageType.Success);
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
