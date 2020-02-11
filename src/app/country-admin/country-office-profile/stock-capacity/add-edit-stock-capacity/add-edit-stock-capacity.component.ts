import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType, GeoLocation, StockType} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {StockCapacityModel} from "../../../../model/stock-capacity.model";
import {StockService} from "../../../../services/stock.service";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {Indicator} from "../../../../model/indicator";
import {CommonService} from "../../../../services/common.service";
import {AngularFire} from "angularfire2";
import {NoteService} from "../../../../services/note.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-stock-capacity',
  templateUrl: './add-edit-stock-capacity.component.html',
  styleUrls: ['./add-edit-stock-capacity.component.css'],
})

export class CountryOfficeAddEditStockCapacityComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;
  private agencyId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private stockCapacity: StockCapacityModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Variables for ALT-2039
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
  private selectedCountryArr: any[] = [];
  private geoLocation = Constants.GEO_LOCATION;
  private geoLocationList: number[] = [GeoLocation.national, GeoLocation.subnational];
  private isEdit: boolean = false;
  private selectedValue: any;
  private selectedValueL2: any;
  private presetId: any;
  private isPreset: boolean = true;
  private isPresetValue: any;


  private activeStockCapacity: StockCapacityModel;

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _stockService: StockService,
              private router: Router,
              private af: AngularFire,
              private route: ActivatedRoute,
              private _commonService: CommonService,
              private _noteService: NoteService) {
    this.stockCapacity = new StockCapacityModel();
    this.stockCapacity.stockType = StockType.Country; // set default stock type

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId;
      this.agencyId = agencyId;
      this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()
    });
  }

  initLocalAgency(){
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this._stockService.getStockCapacityLocalAgency(this.agencyId, params['id'])
          .subscribe(stockCapacity => {
            this.stockCapacity = stockCapacity;
          });
      }

      if (params['stockType']) {
        this.stockCapacity.stockType = Number(params['stockType']);
      }
    });
  }

  initCountryOffice(){
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this._stockService.getStockCapacity(this.countryId, params['id'])
          .subscribe(stockCapacity => {
            this.stockCapacity = stockCapacity;
          });
      }
      if (params['stockType']) {
        this.stockCapacity.stockType = Number(params['stockType']);
      }
    });
    this.initCountrySelection();
  }

  validateForm(): boolean {
    this.alertMessage = this.stockCapacity.validate();
    return !this.alertMessage;
  }

  submit() {
    if(this.isLocalAgency){
      this.stockCapacity.location = this.selectedCountry;
      this.stockCapacity.level1 = this.selectedValue ? this.levelOneDisplay[this.selectedValue].id : null;
      this.stockCapacity.level2 = this.selectedValueL2 ? this.selectedValueL2 : null;

      console.log("Country: " + this.stockCapacity.location);
      console.log("Level 1: " +this.stockCapacity.level1);
      console.log("Level 2: " +this.stockCapacity.level2);

      this._stockService.saveStockCapacityLocalAgency(this.agencyId, this.stockCapacity)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.SUCCESS_SAVED', AlertMessageType.Success);
            setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
          },
          err => {
            if (err instanceof DisplayError) {
              this.alertMessage = new AlertMessageModel(err.message);
            } else {
              this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
          });
    }else{
      var postData = {
        location: this.selectedCountry,
        level1: this.selectedValue ? this.levelOneDisplay[this.selectedValue].id : null,
        level2: this.selectedValueL2 ? this.selectedValueL2 : null,
        agencyId: this.agencyId
      };
      this.stockCapacity.location = this.selectedCountry;
      this.stockCapacity.level1 = this.selectedValue ? this.levelOneDisplay[this.selectedValue].id : null;
      this.stockCapacity.level2 = this.selectedValueL2 ? this.selectedValueL2 : null;

      this._stockService.saveStockCapacity(this.countryId, this.stockCapacity);

      this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/capacity/')
        .push(this.stockCapacity)
        .update(postData)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.SUCCESS_SAVED', AlertMessageType.Success);
            setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
          },
          err => {
            if (err instanceof DisplayError) {
              this.alertMessage = new AlertMessageModel(err.message);
            } else {
              this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
          });
    }
  }

  goBack() {
    if (this.isLocalAgency) {
      this.router.navigateByUrl('/local-agency/profile/stock-capacity');
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/stock-capacity');
    }
  }

  deleteStockCapacity() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    if(this.isLocalAgency){
      this._stockService.deleteStockCapacityLocalAgency(this.agencyId, this.stockCapacity)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    }else{
      this._stockService.deleteStockCapacity(this.countryId, this.stockCapacity)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    }
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

  checkTypeof(param: any) {
    if (typeof (param) == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  initCountrySelection() {

    /**
     * Preset the first drop down box to the country office
     */
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId + "/location")
      .takeUntil(this.ngUnsubscribe)
      .subscribe(getCountry => {
        this.selectedCountry = getCountry.$value;
        console.log(getCountry.$value, 'initCountrySelection');

        /**
         * Pass country to the level one values for selection
         */
        this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(pre => {
            this.levelOneDisplay = pre[this.selectedCountry].levelOneValues;
          })

      });
  }

  resetValue(){
    // Reset Values to remove level 2 drop down
    this.levelTwoDisplay.length = 0;
  }

  // This function below is to determine the country selected
  // Return the array of level1 areas in the country selected.
  setCountryLevel(selectedCountry) {
    this.stockCapacity.location = selectedCountry;
    this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        err => console.log(err);
        // Below needs to return the level1 array of the id selected
        this.levelOneDisplay = content[selectedCountry].levelOneValues;
      });
  }

  setLevel1Value(selected) {
    this.stockCapacity.level1 = selected
    for (var i = 0; i < this.levelOneDisplay.length; i++) { 
      var x = this.levelOneDisplay[i];
      if (x['id'] == selected) {
        this.levelTwoDisplay = this.levelOneDisplay[i].levelTwoValues;
      }
    }
  }

  setLevel2Value(selected) {
    this.stockCapacity.level2 = selected;
  }
}
