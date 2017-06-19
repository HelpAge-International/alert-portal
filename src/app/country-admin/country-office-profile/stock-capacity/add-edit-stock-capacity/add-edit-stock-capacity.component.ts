import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../../utils/Constants';
import { AlertMessageType, StockType } from '../../../../utils/Enums';
import { RxHelper } from '../../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../../model/alert-message.model';
import { DisplayError } from "../../../../errors/display.error";
import { UserService } from "../../../../services/user.service";
import { StockCapacityModel } from "../../../../model/stock-capacity.model";
import { StockService } from "../../../../services/stock.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-stock-capacity',
  templateUrl: './add-edit-stock-capacity.component.html',
  styleUrls: ['./add-edit-stock-capacity.component.css'],
})

export class CountryOfficeAddEditStockCapacityComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  
  // Models
  private alertMessage: AlertMessageModel = null;
  private stockCapacity: StockCapacityModel;
  
  constructor(private _userService: UserService,
              private _stockService: StockService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper) {
                this.stockCapacity = new StockCapacityModel();
                this.stockCapacity.stockType = StockType.Country; // set default stock type
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
        this.countryId = countryAdminUser.countryId;
              
        const editSubscription = this.route.params.subscribe((params: Params) => {
          if (params['id']) {
            this._stockService.getStockCapacity(this.countryId, params['id'])
                  .subscribe(stockCapacity => { this.stockCapacity = stockCapacity; });
          }
          if (params['stockType']) {
            this.stockCapacity.stockType = Number(params['stockType']);
          }
        });
      });
    })
    this.subscriptions.add(authSubscription);
  }

  validateForm(): boolean {
    this.alertMessage = this.stockCapacity.validate();

    return !this.alertMessage;
  }

  submit() {
      this._stockService.saveStockCapacity(this.countryId, this.stockCapacity)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.SUCCESS_SAVED', AlertMessageType.Success);
              setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
            }, 
            err => 
            {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-office-profile/stock-capacity');
  }

  deleteStockCapacity() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    this._stockService.deleteStockCapacity(this.countryId, this.stockCapacity)
      .then(() => {
        this.goBack();
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
 }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}