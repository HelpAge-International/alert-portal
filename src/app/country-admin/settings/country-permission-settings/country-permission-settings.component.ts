import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PermissionSettingsModel} from "../../../model/permission-settings.model";
import {UserService} from "../../../services/user.service";
import {Constants} from '../../../utils/Constants';
import {AlertMessageType, UserType} from '../../../utils/Enums';
import {SettingsService} from "../../../services/settings.service";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {DisplayError} from "../../../errors/display.error";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";


declare var jQuery: any;

@Component({
  selector: 'app-country-permission-settings',
  templateUrl: './country-permission-settings.component.html',
  styleUrls: ['./country-permission-settings.component.css']
})

export class CountryPermissionSettingsComponent implements OnInit, OnDestroy {
  private uid: string;
  private agencyId: string;
  private countryId: string;

  // Constants and enums
  private userTypeConstant = Constants.USER_TYPE;
  private userTypeSelection =
    Constants.USER_TYPE_SELECTION.filter(x => x != UserType.All && x != UserType.NonAlert && x != UserType.GlobalUser
      && x != UserType.CountryAdmin && x != UserType.RegionalDirector && x != UserType.GlobalDirector);

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private permissionSettings: PermissionSettingsModel;

  // Other
  private activePermission: any;
  private activePermissionSetting: any[];
  private permissionName: string;
  private settingName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _settingsService: SettingsService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId;

      this._settingsService.getCountryPermissionSettings(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(permissions => {
          this.permissionSettings = permissions;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  validateForm(): boolean {
    this.alertMessage = this.permissionSettings.validate();

    return !this.alertMessage;
  }

  submit() {
    if (this.validateForm()) {
      this._settingsService.saveCountryPermissionSettings(this.agencyId, this.countryId, this.permissionSettings)
        .then(() => {
          this.alertMessage = new AlertMessageModel('PERMISSIONS.SAVED_PERMISSIONS', AlertMessageType.Success);
        })
        .catch(err => {
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
    }
  }

  selectUserType(activePermission: any, action, permissionName, settingName) {
    this.activePermission = action;
    this.activePermissionSetting = Object.assign([], activePermission);
    this.permissionName = permissionName;
    this.settingName = settingName;

    jQuery("#select-user-type").modal("show");
  }

  saveUserType() {
    const firstIndex = this.activePermission[0];
    const secondIndex = this.activePermission[1];

    if (firstIndex && secondIndex) {
      this.permissionSettings[firstIndex][secondIndex] = this.activePermissionSetting;
    } else if (firstIndex) {
      this.permissionSettings[firstIndex] = this.activePermissionSetting;
    }

    this.submit();

    this.closeModal();
  }

  closeModal() {
    jQuery("#select-user-type").modal("hide");
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
