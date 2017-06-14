import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType, StockType } from '../../../utils/Enums';
import { RxHelper } from '../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../model/alert-message.model';
import { DisplayError } from "../../../errors/display.error";
import { UserService } from "../../../services/user.service";
import { StockCapacityModel } from "../../../model/stock-capacity.model";
import { StockService } from "../../../services/stock.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-stock-capacity',
  templateUrl: './stock-capacity.component.html',
  styleUrls: ['./stock-capacity.component.css']
})

export class CountryOfficeStockCapacityComponent implements OnInit, OnDestroy {
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;
  private agencyId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  STOCK_TYPE = StockType;
  
  // Models
  private alertMessage: AlertMessageModel = null;
  private stockCapacitiesIN: StockCapacityModel[];
  private stockCapacitiesOUT: StockCapacityModel[];
  
  // Helpers  
  constructor(private _userService: UserService,
              private _stockService: StockService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
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
        this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];

        this._stockService.getStockCapacities(this.agencyId, this.countryId).subscribe(stockCapacities => {
            this.stockCapacitiesIN = stockCapacities.filter(x => x.type == StockType.Country);
            this.stockCapacitiesOUT = stockCapacities.filter(x => x.type == StockType.External);
        })
      });
    });
    this.subscriptions.add(authSubscription);
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-office-profile/stock-capacity');
  }

  editCoordinationArrangement() {
    this.isEdit = true;
  }

  showCoordinationArrangement() {
    this.isEdit = false;
  }

  getStaffName(id) {
    let staffName = '';

    if (!id) {
      return staffName;
    }

    this._userService.getUser(id).subscribe(user => {
      if (user) {
        staffName = user.firstName + ' ' + user.lastName;
      }
    });

    return staffName;
  }
  addEditStockCapacity(stockType: StockType, stockCapacityId?: string) {
    if(stockCapacityId)
    {
      this.router.navigate(['/country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity',
                                  {id: stockCapacityId, stockType: stockType}], {skipLocationChange: true});
    }else{
      this.router.navigate(['/country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity',
                                  {stockType: stockType}], {skipLocationChange: true});
    }
  }
}