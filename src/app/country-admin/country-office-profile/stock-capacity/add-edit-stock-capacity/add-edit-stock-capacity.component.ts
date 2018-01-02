import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType, StockType} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {StockCapacityModel} from "../../../../model/stock-capacity.model";
import {StockService} from "../../../../services/stock.service";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
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

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _stockService: StockService,
              private router: Router,
              private route: ActivatedRoute) {
    this.stockCapacity = new StockCapacityModel();

    this.stockCapacity.stockType = StockType.Country;

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


      this.isLocalAgency ? this.initLocalAgency : this.initCountryOffice()

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
  }

  validateForm(): boolean {
    this.alertMessage = this.stockCapacity.validate();

    return !this.alertMessage;
  }

  submit() {
    if(this.isLocalAgency){
      console.log(';.;.;.;.;.;.;.;.;.;.;.;.;.;;;.;')
      console.log(this.stockCapacity)
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
      this._stockService.saveStockCapacity(this.countryId, this.stockCapacity)
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
}
