import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {ModuleName, PermissionsAgency, Privacy} from "../../../utils/Enums";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";
import {UserService} from "../../../services/user.service";
import {SettingsService} from "../../../services/settings.service";

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
  providers: [SettingsService]
})

export class ModulesComponent implements OnInit, OnDestroy {

  MODULE_NAME = Constants.MODULE_NAME;
  protected ModuleName = Object.keys(ModuleName).map(k => ModuleName[k]).filter(v => typeof v !== "string") as string[];
  private Public = Privacy.Public;
  private Private = Privacy.Private;
  private Network = Privacy.Network;

  private uid: string = "";
  private modules: any[] = [];
  private saved: boolean = false;
  private agencyId: string;
  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public listOfEnabledEnableButtons: Map<PermissionsAgency, boolean>;
  private disableMap: Map<PermissionsAgency, PermissionsAgency[]>;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private userService: UserService,
              private settingService: SettingsService,
              private router: Router) {
    this.disableMap = PageControlService.agencyDisableMap();
    this.listOfEnabledEnableButtons = new Map<PermissionsAgency, boolean>();
    this.listOfEnabledEnableButtons.set(PermissionsAgency.RiskMonitoring, false);
    this.listOfEnabledEnableButtons.set(PermissionsAgency.CountryOffice, false);
    this.listOfEnabledEnableButtons.set(PermissionsAgency.ResponsePlanning, false);
    this.listOfEnabledEnableButtons.set(PermissionsAgency.MinimumPreparedness, false);
    this.listOfEnabledEnableButtons.set(PermissionsAgency.AdvancedPreparedness, false);
    this.listOfEnabledEnableButtons.set(PermissionsAgency.CHSPreparedness, false);
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;

      this.af.database.list(Constants.APP_STATUS + '/module/' + this.agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(_ => {
          this.ModuleName.map(moduleName => {
            this.modules[moduleName] = {$key: moduleName, privacy: -1, status: false};
          });

          _.map(module => {
            this.modules[module.$key] = module;
          });

          this.populateEnabledButtonsList();
        });
    });
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } catch (e) {
      console.log('Unable to releaseAll');
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private changePrivacy(moduleId, privacy) {
    this.modules[moduleId].privacy = privacy;
  }

  private changeStatus(moduleId, status) {
    this.modules[moduleId].status = status;
    if (!status) {
      let items = this.disableMap.get(moduleId);
      if (items != null) {
        for (let x of items) {
          this.changeStatus(x, false);
        }
      }
    }
    this.populateEnabledButtonsList();
  }

  private cancelChanges() {
    this.ngOnInit();
  }

  private saveChanges() {
    var moduleItems = {};
    var modules = this.modules.map((module, index) => {

      moduleItems[index] = this.modules[index];

      delete moduleItems[index].$key;
      delete moduleItems[index].$exists;

      return this.modules[index];
    });

    this.af.database.object(Constants.APP_STATUS + '/module/' + this.agencyId)
      .set(moduleItems)
      .then(_ => {
        if (!this.alertShow) {
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.MODULE_NAME.SAVE_SUCCESS";
          this.updateCountryPrivacySettings(moduleItems);
        }
      })
      .catch(err => console.log(err, 'You do not have access!'));
  }

  private updateCountryPrivacySettings(moduleItems) {
    let module = new ModelAgencyPrivacy();
    module.mapObject(moduleItems);
    console.log(module);
    this.userService.getAllCountryIdsForAgency(this.agencyId)
      .first()
      .subscribe(countryIds => {
        countryIds.forEach(countryId => {
          this.settingService.getPrivacySettingForCountry(countryId)
            .first()
            .subscribe((countryPrivacy: ModelAgencyPrivacy) => {

              this.settingService.updateCountryPrivacy(countryId, module, countryPrivacy);

            });
        });
      });
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  showAlert() {
    this.alertSuccess = false;
    this.alertShow = true;
    this.alertMessage = "AGENCY_ADMIN.SETTINGS.MODULE_NAME.MODULE_NAME";
  }

  /**
   * Permissions propagation
   */
  populateEnabledButtonsList() {
    // console.log(this.disableMap);
    this.disableMap.forEach((val, key) => {
      for (let x of val) {
        // console.log("Key : " + key + " --> " + x);
        // console.log(" --> " + this.modules[key].status);
        this.listOfEnabledEnableButtons.set(x, !this.modules[key].status);
      }
    });
    // console.log(this.listOfEnabledEnableButtons);
  }
}
