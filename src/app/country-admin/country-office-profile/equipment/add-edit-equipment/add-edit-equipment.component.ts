import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType, GeoLocation} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {EquipmentService} from "../../../../services/equipment.service";
import {EquipmentModel} from "../../../../model/equipment.model";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {Indicator} from "../../../../model/indicator";
import {CommonService} from "../../../../services/common.service";
import {Location} from "@angular/common";
import {AngularFire} from "angularfire2";
import {post} from "selenium-webdriver/http";

declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-equipment',
  templateUrl: './add-edit-equipment.component.html',
  styleUrls: ['./add-edit-equipment.component.css'],
})

export class CountryOfficeAddEditEquipmentComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;
  private agencyId: string;
  private equipmentId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private equipment: EquipmentModel;

  // ALT-2039
  private copyIndicatorId: string;
  public indicatorData: Indicator;
  private countries = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private countrySelection: any[] = [];
  private curCountrySelection: any[] = this.countrySelection;
  private countryLocation: number;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];
  private levelOneDisplay: any[] = [];
  private levelTwoDisplay: any[] = [];
  private levelOneShow: any;
  private selectedCountry: any;
  private selectedCountryVal: string;
  private geoLocation = Constants.GEO_LOCATION;
  private geoLocationList: number[] = [GeoLocation.national, GeoLocation.subnational];
  private isEdit: boolean = false;
  private selectedValue: any;
  private selectedValueL2: any;
  private presetId: any;
  private isPreset: boolean = true;
  private isPresetValue: any;

  private countryID: string;


  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _equipmentService: EquipmentService,
              private router: Router,
              private route: ActivatedRoute,
              private af: AngularFire,
              private _location: Location,
              private _commonService: CommonService,) {
    this.equipment = new EquipmentModel();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice();
  }

  initLocalAgency() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;

      this.agencyId = agencyId;

      this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
        if (params['id']) {
          this._equipmentService.getEquipmentLocalAgency(this.agencyId, params['id'])
            .takeUntil(this.ngUnsubscribe)
            .subscribe(equipment => {
              this.equipmentId = params['id'];
              this.equipment = equipment;
              this.selectedCountry = equipment.location;
              this.selectedValue = equipment.level1;
              this.selectedValueL2 = equipment.level2;
            });
        }
      });
    })
  }

  initCountryOffice() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;

      this.agencyId = agencyId;
      this.countryId = countryId;

      // this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
      //   this.countryId = countryAdminUser.countryId;

      this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
        if (params['id']) {
          this._equipmentService.getEquipment(this.countryId, params['id'])
            .takeUntil(this.ngUnsubscribe)
            .subscribe(equipment => {
              this.equipmentId = params['id'];
              this.equipment = equipment;
              this.selectedCountry = equipment.location;
              this.selectedValue = equipment.level1;
              this.selectedValueL2 = equipment.level2;
            });
        }
      });
      this.initCountrySelection();
      // });
    })

  }

  initCountrySelection() {
    /**
     * Preset the first drop down box to the country office
     */
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId + "/location")
      .takeUntil(this.ngUnsubscribe)
      .subscribe(getCountry => {
        //this.selectedCountry = getCountry.$value;

        //console.log(getCountry.$value, 'initCountrySelection');

        /**
         * Pass country to the level one values for selection
         */
        this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(content => {
            err => console.log(err);
            // Below needs to return the level1 array of the id selected
            this.levelOneDisplay = content[this.selectedCountry].levelOneValues;


          })

      });

  }

  // This function below is to determine the country selected
  // Return the array of level1 areas in the country selected.
  setCountryLevel(selectedC) {
    this.equipment.location = selectedC;
    this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        err => console.log(err);
        // Below needs to return the level1 array of the id selected
        this.levelOneDisplay = content[selectedC].levelOneValues;
      });
  }

  resetValue() {
    console.log('reset selection');
    // Reset Values to remove level 2 drop down
    this.levelTwoDisplay.length = 0;
  }

  setLevel1Value(selected) {
    this.equipment.level1 = selected;
    this.levelTwoDisplay = this.levelOneDisplay[selected].levelTwoValues;
  }

  setLevel2Value(selected) {
    this.equipment.level2 = selected;
  }

  checkTypeof(param: any) {
    if (typeof (param) == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  validateForm(): boolean {
    this.alertMessage = this.equipment.validate();

    return !this.alertMessage;
  }

  submit() {
    if (this.isLocalAgency) {
      this._equipmentService.saveEquipmentLocalAgency(this.agencyId, this.equipment)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SUCCESS_SAVED', AlertMessageType.Success);
            setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
          },
          err => {
            if (err instanceof DisplayError) {
              this.alertMessage = new AlertMessageModel(err.message);
            } else {
              this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
          });
    } else {
      let dataToSave = this.equipment;
      let postData = {
        location: this.equipment.location,
        level1: this.equipment.level1 ? this.equipment.level1 : null,
        level2: this.equipment.level2 ? this.equipment.level2 : null,
        agencyId: this.agencyId
      };

      if (!this.equipmentId) {
        this._equipmentService.saveEquipment(this.countryId, this.equipment);
        this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/equipment/' + this.countryId)
          .push(dataToSave)
          .update(postData)
          .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SUCCESS_SAVED', AlertMessageType.Success);
              setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
            },
            err => {
              if (err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              } else {
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
      } else {
        dataToSave.updatedAt = new Date().getTime();
        delete dataToSave.id;

        const newData = {};
        Object.keys(dataToSave).forEach((key) => {
          if (dataToSave[key]) {
            newData[key] = dataToSave[key]
          }
        });

        this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/equipment/' + this.countryId + '/' + this.equipmentId)
          .update(newData)
          .then((newData) => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SUCCESS_SAVED', AlertMessageType.Success);
            setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
          }).catch((err: any) => {
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
      }
    }
  }

  goBack() {
    this.isLocalAgency ? this.router.navigateByUrl('/local-agency/profile/equipment') : this.router.navigateByUrl('/country-admin/country-office-profile/equipment')
  }

  deleteEquipment() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    if (this.isLocalAgency) {
      this._equipmentService.deleteEquipmentLocalAgency(this.agencyId, this.equipment)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    } else {
      this._equipmentService.deleteEquipment(this.countryId, this.equipment)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    }
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}
