import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../../utils/Constants';
import { AlertMessageType, StockType } from '../../../../utils/Enums';
import { RxHelper } from '../../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../../model/alert-message.model';
import { DisplayError } from "../../../../errors/display.error";
import { UserService } from "../../../../services/user.service";
import { CountryOfficeAddressModel } from "../../../../model/countryoffice.address.model";
import { AgencyService } from "../../../../services/agency-service.service";
@Component({
  selector: 'app-country-office-edit-office-details',
  templateUrl: './edit-office-details.component.html',
  styleUrls: ['./edit-office-details.component.css'],
})

export class CountryOfficeEditOfficeDetailsComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;
  private agencyId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;
  COUNTRIES = Constants.COUNTRIES;
  
  // Models
  private alertMessage: AlertMessageModel = null;
  private countryOfficeAddress: CountryOfficeAddressModel;
  
  constructor(private _userService: UserService,
              private _agencyService: AgencyService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper) {
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
        this.agencyId = countryAdminUser.agencyAdmin ? Object.keys(countryAdminUser.agencyAdmin)[0] : '';
              
        this._agencyService.getCountryOffice(this.countryId, this.agencyId)
              .map(countryOffice => {
                let countryOfficeAddress = new CountryOfficeAddressModel();
                countryOfficeAddress.mapFromObject(countryOffice);

                return countryOfficeAddress;
              })
              .subscribe(countryOfficeAddress => {
                this.countryOfficeAddress = countryOfficeAddress;
              })
      });
    })
    this.subscriptions.add(authSubscription);
  }

  validateForm(): boolean {
    this.alertMessage = this.countryOfficeAddress.validate();

    return !this.alertMessage;
  }

  submit() {
      this._agencyService.saveCountryOfficeAddress(this.agencyId, this.countryId, this.countryOfficeAddress)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.CONTACTS.SUCCESS_SAVED_OFFICE_DETAILS', AlertMessageType.Success);
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
    this.router.navigateByUrl('/country-admin/country-office-profile/contacts');
  }

}