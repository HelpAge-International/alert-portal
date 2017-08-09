import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from "../../../services/user.service";
import {Constants} from '../../../utils/Constants';
import {AlertMessageType, ModuleName, Privacy, UserType} from '../../../utils/Enums';
import {SettingsService} from "../../../services/settings.service";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {DisplayError} from "../../../errors/display.error";
import {ModuleSettingsModel} from "../../../model/module-settings.model";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import {AgencyService} from "../../../services/agency-service.service";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";


@Component({
  selector: 'app-country-modules-settings',
  templateUrl: './country-modules-settings.component.html',
  styleUrls: ['./country-modules-settings.component.css'],
  providers: [AgencyService]
})

export class CountryModulesSettingsComponent implements OnInit, OnDestroy {
  private agencyPrivacy: ModelAgencyPrivacy;
  private agencyId: string;
  private uid: string;
  private countryId: string;

  // Constants and enums
  private moduleName = Constants.MODULE_NAME;
  private privacyOptions = Privacy;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private moduleSettings: ModuleSettingsModel[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private _userService: UserService,
              private _settingsService: SettingsService,
              private agencyService: AgencyService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId;

      this.agencyService.getPrivacySettingForAgency(agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((privacy: ModelAgencyPrivacy) => {
          this.agencyPrivacy = privacy;
        });

      if (userType == UserType.CountryAdmin) {

        this._settingsService.getCountryModulesSettings(this.countryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((modules: ModuleSettingsModel[]) => {
            console.log(modules);
            this.moduleSettings = modules;
          })
      }

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setModulePrivacy(module: ModuleSettingsModel, value: number) {
    module.privacy = value;
  }

  // validateForm(): boolean {
  //   this.moduleSettings.forEach(module => {
  //     this.alertMessage = module.validate();
  //   });
  //
  //   return !this.alertMessage;
  // }

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

  checkDisable(moduleIndex, btnIndex) {
    let isDisable = false;
    let privacyToCheck = -1;
    if (moduleIndex == ModuleName.MinimumPreparednessActions) {
      privacyToCheck = this.agencyPrivacy.mpa;
    } else if (moduleIndex == ModuleName.AdvancedPreparednessActions) {
      privacyToCheck = this.agencyPrivacy.apa;
    } else if (moduleIndex == ModuleName.CHSPreparednessActions) {
      privacyToCheck = this.agencyPrivacy.chs;
    } else if (moduleIndex == ModuleName.RiskMonitoring) {
      privacyToCheck = this.agencyPrivacy.riskMonitoring;
    } else if (moduleIndex == ModuleName.CountryOfficeProfile) {
      privacyToCheck = this.agencyPrivacy.officeProfile;
    } else if (moduleIndex == ModuleName.ResponsePlanning) {
      privacyToCheck = this.agencyPrivacy.responsePlan;
    }
    if (privacyToCheck == Privacy.Network && btnIndex == 0) {
      isDisable = true;
    } else if (privacyToCheck == Privacy.Private && btnIndex == 0 || privacyToCheck == Privacy.Private && btnIndex == 2) {
      isDisable = true;
    }
    return isDisable;
  }
}
