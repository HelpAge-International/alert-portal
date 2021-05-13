import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Constants} from '../../../../utils/Constants';
import {AlertMessageType} from '../../../../utils/Enums';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertMessageModel} from '../../../../model/alert-message.model';
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {CountryOfficeAddressModel} from "../../../../model/countryoffice.address.model";
import {AgencyService} from "../../../../services/agency-service.service";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs";

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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private _userService: UserService,
              private _agencyService: AgencyService,
              private router: Router) {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()
  }

  initLocalAgency() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId
      this.agencyId = agencyId

      this._agencyService.getAgency(this.agencyId)
        .map(agency => {
          let countryOfficeAddress = new CountryOfficeAddressModel();
          countryOfficeAddress.mapFromObject(agency);

          return countryOfficeAddress;
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryOfficeAddress => {
          this.countryOfficeAddress = countryOfficeAddress;
        })
    })
  }

  initCountryOffice() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId
      this.agencyId = agencyId

      this._agencyService.getCountryOffice(this.countryId, this.agencyId)
        .map(countryOffice => {
          let countryOfficeAddress = new CountryOfficeAddressModel();
          countryOfficeAddress.mapFromObject(countryOffice);

          return countryOfficeAddress;
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryOfficeAddress => {
          this.countryOfficeAddress = countryOfficeAddress;
        })
    })
  }

  validateForm(): boolean {
    this.alertMessage = this.countryOfficeAddress.validate();

    return !this.alertMessage;
  }

  submit() {
    if (this.isLocalAgency) {
      this._agencyService.saveLocalAgencyAddress(this.agencyId, this.countryOfficeAddress)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.CONTACTS.SUCCESS_SAVED_OFFICE_DETAILS', AlertMessageType.Success);
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
      this._agencyService.saveCountryOfficeAddress(this.agencyId, this.countryId, this.countryOfficeAddress)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.CONTACTS.SUCCESS_SAVED_OFFICE_DETAILS', AlertMessageType.Success);
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
      this.router.navigateByUrl('/local-agency/profile/contacts');
    } else {
      this.router.navigateByUrl('/country-admin/country-office-profile/contacts');
    }
  }

}
