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
import {Subject} from "rxjs/Subject";
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

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private stockCapacity: StockCapacityModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _stockService: StockService, private networkService: NetworkService,
              private router: Router,
              private route: ActivatedRoute) {
    this.stockCapacity = new StockCapacityModel();
    this.stockCapacity.stockType = StockType.Network; // set default stock type
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;


      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.route.params.subscribe((params: Params) => {
            if (params['id']) {
              this._stockService.getStockCapacityLocalNetwork(this.networkId, params['id'])
                .subscribe(stockCapacity => {
                  this.stockCapacity = stockCapacity;
                });
            }
            if (params['stockType']) {
              this.stockCapacity.stockType = Number(params['stockType']);
            }
          });

        })

    });
  }

  validateForm(): boolean {
    this.alertMessage = this.stockCapacity.validate();

    return !this.alertMessage;
  }

  submit() {
    console.log(this.stockCapacity)
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
    this.router.navigateByUrl('/network/local-network-office-profile/stock-capacity');
  }

  deleteStockCapacity() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

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



