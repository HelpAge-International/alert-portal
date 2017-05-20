import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { RxHelper } from "../../../utils/RxHelper";

import { PermissionSettingsModel } from "../../../model/permission-settings.model";
import { UserService } from "../../../services/user.service";
import { Constants } from '../../../utils/Constants';
import { UserType, AlertMessageType } from '../../../utils/Enums';
import { SettingsService } from "../../../services/settings.service";
import { AlertMessageModel } from "../../../model/alert-message.model";
import { DisplayError } from "../../../errors/display.error";

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
    Constants.USER_TYPE_SELECTION.filter( x => x != UserType.All && x != UserType.NonAlert && x != UserType.GlobalUser);

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private permissionSettings: PermissionSettingsModel;

  // Other
  private activePermission: any;
  private activePermissionSetting: any[];
  private permissionName: string;
  private settingName: string;

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

          this._settingsService.getCountryPermissionSettings(this.agencyId, this.countryId).subscribe(permissions => {
            this.permissionSettings = permissions;
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
    this.alertMessage = this.permissionSettings.validate();

    return !this.alertMessage;
  }

  submit() {
      this._settingsService.saveCountryPermissionSettings(this.agencyId, this.countryId, this.permissionSettings)
            .then(() => {
              this.alertMessage = new AlertMessageModel('PERMISSIONS.SAVED_PERMISSIONS', AlertMessageType.Success);
            })
            .catch(err => {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
  }

  selectUserType(activePermission: any, action, permissionName, settingName) 
  {
        this.activePermission = action;
        this.activePermissionSetting = Object.assign([], activePermission);
        this.permissionName = permissionName;
        this.settingName = settingName;

        jQuery("#select-user-type").modal("show");
  }

  saveUserType(){
    const firstIndex = this.activePermission[0];
    const secondIndex = this.activePermission[1];

    if(firstIndex && secondIndex)
    {
      this.permissionSettings[firstIndex][secondIndex] = this.activePermissionSetting;
    }else if(firstIndex){
      this.permissionSettings[firstIndex] = this.activePermissionSetting;
    }
    
    this.closeModal();
  }
  
  closeModal() {
        jQuery("#select-user-type").modal("hide");
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
