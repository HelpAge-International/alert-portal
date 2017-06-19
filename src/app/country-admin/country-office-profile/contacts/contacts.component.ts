import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType, ResponsePlanSectors } from '../../../utils/Enums';
import { RxHelper } from '../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../model/alert-message.model';
import { ModelUserPublic } from '../../../model/user-public.model';
import { UserService } from "../../../services/user.service";
import { DisplayError } from "../../../errors/display.error";
import { AgencyService } from "../../../services/agency-service.service";
import { ModelAgency } from "../../../model/agency.model";
import { CountryOfficeAddressModel } from "../../../model/countryoffice.address.model";
import { ContactService } from "../../../services/contact.service";
import { PointOfContactModel } from "../../../model/point-of-contact.model";
import { ModelStaff } from "../../../model/staff.model";

@Component({
  selector: 'app-country-office-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class CountryOfficeContactsComponent implements OnInit, OnDestroy {
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private agencyId: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  COUNTRIES = Constants.COUNTRIES;
  USER_TYPE = Constants.COUNTRY_ADMIN_USER_TYPE;

  
  // Models
  private alertMessage: AlertMessageModel = null;
  private agency: ModelAgency;
  private countryOfficeAddress: CountryOfficeAddressModel;
  private pointsOfContact: PointOfContactModel[];
  private userPublicDetails: ModelUserPublic[];
  private staffList: ModelStaff[];
  
  
  constructor(private _userService: UserService,
              private _agencyService: AgencyService,
              private _contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
                this.userPublicDetails = [];
                this.staffList = [];
    
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

        this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
        this.countryId = countryAdminUser.countryId;

        this._agencyService.getAgency(this.agencyId)
              .map(agency => {
                return agency as ModelAgency;
              })
              .subscribe(agency => {
                this.agency = agency;

                this._agencyService.getCountryOffice(this.countryId, this.agencyId)
                        .map(countryOffice => {
                          let countryOfficeAddress = new CountryOfficeAddressModel();
                          countryOfficeAddress.mapFromObject(countryOffice);

                          return countryOfficeAddress;
                        })
                        .subscribe(countryOfficeAddress => {
                          this.countryOfficeAddress = countryOfficeAddress;
                        })
                this._contactService.getPointsOfContact(this.countryId)
                      .subscribe(pointsOfContact => { 
                          this.pointsOfContact = pointsOfContact;
                          this.pointsOfContact.forEach(pointOfContact=>{
                            this._userService.getUser(pointOfContact.staffMember).subscribe(user => {
                              this.userPublicDetails[pointOfContact.staffMember] = user;
                            });
                            this._userService.getStaff(this.countryId, pointOfContact.staffMember).subscribe(staff => {
                              this.staffList[pointOfContact.staffMember] = staff;
                            });
                          });
                        });
              });
      });
    })
    this.subscriptions.add(authSubscription);
  }

  getPointOfContactName(id){
    let name = "";
    if(this.userPublicDetails && this.userPublicDetails[id])
    {
      name = this.userPublicDetails[id].firstName + ' ' + this.userPublicDetails[id].lastName;
    }
    
    return name;
  }

getPointOfContactEmail(id){
    let email = "";
    
    if(this.userPublicDetails && this.userPublicDetails[id])
    {
      email = this.userPublicDetails[id].email;
    }
    
    return email;
  }

  getPointOfContactMobile(id){
    let mobile = "";
    
    if(this.userPublicDetails && this.userPublicDetails[id])
    {
      mobile = this.userPublicDetails[id].phone;
    }
    
    return mobile;
  }

  getPointOfContactPosition(id){
    let position = "";
    
    if(this.staffList && this.staffList[id])
    {
      position = this.staffList[id].position;
    }
    
    return position;
  }

  editPointsOfContact() {
    this.isEdit = true;
  }

  viewPointsOfContact() {
    this.isEdit = false;
  }

  editOfficeDetails(){
    this.router.navigateByUrl('/country-admin/country-office-profile/contacts/edit-office-details');
  }

  addEditPointOfContact(pointOfContactId?: string) {
    if(pointOfContactId)
    {
      this.router.navigate(['/country-admin/country-office-profile/contacts/add-edit-point-of-contact',
                                  {id: pointOfContactId}], {skipLocationChange: true});
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/contacts/add-edit-point-of-contact');
    }
  }
}
