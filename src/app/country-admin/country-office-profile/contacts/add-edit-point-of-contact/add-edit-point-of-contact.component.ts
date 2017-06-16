import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../../utils/Constants';
import { AlertMessageType, StockType } from '../../../../utils/Enums';
import { RxHelper } from '../../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../../model/alert-message.model';
import { DisplayError } from "../../../../errors/display.error";
import { UserService } from "../../../../services/user.service";
import { PointOfContactModel } from "../../../../model/point-of-contact.model";
import { ModelStaff } from "../../../../model/staff.model";
import { ContactService } from "../../../../services/contact.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-point-of-contact',
  templateUrl: './add-edit-point-of-contact.component.html',
  styleUrls: ['./add-edit-point-of-contact.component.css'],
})

export class CountryOfficeAddEditPointOfContactComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  
  // Models
  private alertMessage: AlertMessageModel = null;
  private pointOfContact: PointOfContactModel;
  private staffList: ModelStaff[];
  private staffNamesList: any[];
  
  constructor(private _userService: UserService,
              private _contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper) {
                this.pointOfContact = new PointOfContactModel();
                this.staffList = [];
                this.staffNamesList = [];
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
        
        this._userService.getStaffList(this.countryId).subscribe(staffList => {
                this.staffList = staffList;
                this.staffList.forEach(staff => {

                  this._userService.getUser(staff.id).subscribe(user => {
                    this.staffNamesList[staff.id] = user.firstName + ' ' + user.lastName;
                  });
                });
        });

        const editSubscription = this.route.params.subscribe((params: Params) => {
                    if (params['id']) {
                      this._contactService.getPointOfContact(this.countryId, params['id'])
                            .subscribe(pointOfContact => { this.pointOfContact = pointOfContact; });
                    }
              });
      });
    })
    this.subscriptions.add(authSubscription);
  }

  validateForm(): boolean {
    this.alertMessage = this.pointOfContact.validate();

    return !this.alertMessage;
  }

  submit() {
      this._contactService.savePointOfContact(this.countryId, this.pointOfContact)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.CONTACTS.SUCCESS_SAVED_CONTACT', AlertMessageType.Success);
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

  
  deletePointOfContact() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    this._contactService.deletePointOfContact(this.countryId, this.pointOfContact)
      .then(() => {
        this.goBack();
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.CONTACTS.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
 }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}