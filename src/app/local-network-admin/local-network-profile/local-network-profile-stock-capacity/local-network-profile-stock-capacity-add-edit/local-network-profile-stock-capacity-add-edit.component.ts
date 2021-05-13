
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType, StockType} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {NetworkService} from "../../../../services/network.service";
import {StockCapacityModel} from "../../../../model/stock-capacity.model";
import {StockService} from "../../../../services/stock.service";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";

declare var jQuery: any;

@Component({
  selector: 'app-local-network-profile-stock-capacity-add-edit',
  templateUrl: './local-network-profile-stock-capacity-add-edit.component.html',
  styleUrls: ['./local-network-profile-stock-capacity-add-edit.component.scss']
})
export class LocalNetworkProfileStockCapacityAddEditComponent implements OnInit, OnDestroy {


  private uid: string;
  private networkId: string;
  private agencyId: string;
  private isViewing: boolean;
  private countryId: string;
  private networkViewValues: {};

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private stockCapacity: StockCapacityModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  //network country re-use
  private isNetworkCountry: boolean;
  private networkCountryId: string;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _stockService: StockService, private networkService: NetworkService,
              private router: Router,
              private storageService: LocalStorageService,
              private route: ActivatedRoute) {
    this.stockCapacity = new StockCapacityModel();
    this.stockCapacity.stockType = StockType.Network; // set default stock type
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params.subscribe((params: Params) => {
      if (params['isViewing']) {
        this.isViewing = params['isViewing'];
      }
      if (params['agencyId']) {
        this.agencyId = params['agencyId'];
      }
      if (params['countryId']) {
        this.countryId = params['countryId'];
      }
      if (params['networkId']) {
        this.networkId = params['networkId'];
      }
      if (params['networkCountryId']) {
        this.networkCountryId = params['networkCountryId'];
      }
      if (params['isNetworkCountry']) {
        this.isNetworkCountry = params['isNetworkCountry'];
      }

      if(this.isViewing){

        if (params['id']) {
          this.isNetworkCountry ? this.getStockCapacityForNetworkCountry(params) : this.getStockCapacityForLocalNetworkAdmin(params);
        }
        if (params['stockType']) {
          this.stockCapacity.stockType = Number(params['stockType']);
        }

      } else {
        this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
          this.uid = user.uid;

          this.networkService.getSelectedIdObj(user.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(selection => {
              this.networkId = selection["id"];
              if (this.isNetworkCountry) {
                this.networkCountryId = selection["networkCountryId"];
              }
              if (params['id']) {
                this.isNetworkCountry ? this.getStockCapacityForNetworkCountry(params) : this.getStockCapacityForLocalNetworkAdmin(params);
              }
              if (params['stockType']) {
                this.stockCapacity.stockType = Number(params['stockType']);
              }

            })

        });
      }
    });

  }

  private getStockCapacityForNetworkCountry(params: Params) {
    this._stockService.getStockCapacityLocalNetworkCountry(this.networkCountryId, params['id']).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(stockCapacity => {
        this.stockCapacity = stockCapacity;
      });
  }

  private getStockCapacityForLocalNetworkAdmin(params: Params) {
    this._stockService.getStockCapacityLocalNetwork(this.networkId, params['id']).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(stockCapacity => {
        this.stockCapacity = stockCapacity;
      });
  }

  validateForm(): boolean {
    this.alertMessage = this.stockCapacity.validate();

    return !this.alertMessage;
  }

  submit() {
    console.log(this.stockCapacity)
    this.isNetworkCountry ? this.saveStockCapacityForNetworkCountry() : this.saveStockCapacityForLocalNetworkAdmin();
  }

  private saveStockCapacityForNetworkCountry() {
    this._stockService.saveStockCapacityNetworkCountry(this.networkCountryId, this.stockCapacity)
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

  private saveStockCapacityForLocalNetworkAdmin() {
    this._stockService.saveStockCapacityLocalNetwork(this.networkId, this.stockCapacity)
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

  goBack() {

    if(this.isViewing){
      this.router.navigate(this.isNetworkCountry ? ['network-country/network-country-office-profile-stock-capacity', this.networkViewValues ] : ['/network/local-network-office-profile/stock-capacity', this.networkViewValues]);
    } else {
      this.router.navigateByUrl(this.isNetworkCountry ? '/network-country/network-country-office-profile-stock-capacity' : '/network/local-network-office-profile/stock-capacity');
    }
  }

  deleteStockCapacity() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();
    this.isNetworkCountry ? this.deleteStockForNetworkCountry() : this.deleteStockForLocalNetworkAdmin();
  }

  private deleteStockForNetworkCountry() {
    this._stockService.deleteStockCapacityNetworkCountry(this.networkCountryId, this.stockCapacity)
      .then(() => {
        this.goBack();
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  private deleteStockForLocalNetworkAdmin() {
    this._stockService.deleteStockCapacityLocalNetwork(this.networkId, this.stockCapacity)
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



