import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from "../../../services/user.service";
import {Constants} from '../../../utils/Constants';
import {AlertMessageType, Privacy} from '../../../utils/Enums';
import {SettingsService} from "../../../services/settings.service";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {DisplayError} from "../../../errors/display.error";
import {ModuleSettingsModel} from "../../../model/module-settings.model";
import {Subject} from "rxjs";


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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _userService: UserService,
              private _settingsService: SettingsService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this._userService.getAuthUser().takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryAdminUser => {
        if (countryAdminUser) {
          this.countryId = countryAdminUser.countryId;

          this._settingsService.getCountryModulesSettings(this.countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(modules => {
            this.moduleSettings = modules;
          })
        }
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setModulePrivacy(module: ModuleSettingsModel, value: number) {
    module.privacy = value;
  }

  validateForm(): boolean {
    this.moduleSettings.forEach(module => {
      this.alertMessage = module.validate();
    })

    return !this.alertMessage;
  }

  submit() {
    this._settingsService.saveCountryModuleSettings(this.countryId, this.moduleSettings)
      .then(() => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.MODULES.SAVED_SUCCESS', AlertMessageType.Success);
      })
      .catch(err => {
        if (err instanceof DisplayError) {
          this.alertMessage = new AlertMessageModel(err.message);
        } else {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
        }
      });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
