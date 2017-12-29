import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ModelUserPublic} from "../../../model/user-public.model";
import {UserService} from "../../../services/user.service";
import {AgencyService} from "../../../services/agency-service.service";
import {ModelAgency} from "../../../model/agency.model";
import {CountryOfficeAddressModel} from "../../../model/countryoffice.address.model";
import {ContactService} from "../../../services/contact.service";
import {PointOfContactModel} from "../../../model/point-of-contact.model";
import {ModelStaff} from "../../../model/staff.model";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-country-office-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class CountryOfficeContactsComponent implements OnInit, OnDestroy {
  private userType: UserType;
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private agencyId: string;
  private countryId: string;
  private isViewing: boolean;

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

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private _userService: UserService,
              private _agencyService: AgencyService,
              private _contactService: ContactService,
              private router: Router, private af: AngularFire) {
    this.userPublicDetails = [];
    this.staffList = [];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()

  }

  private initLocalAgency(){


    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

      this.uid = user.uid;
      this.userType = userType;

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
              });
            this._contactService.getPointsOfContact(this.countryId)
              .subscribe(pointsOfContact => {
                this.pointsOfContact = pointsOfContact;
                this.pointsOfContact.forEach(pointOfContact => {
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
  }

  private initCountryOffice(){
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
      });

    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

      this.uid = user.uid;
      this.userType = userType;

      if (this.countryId && this.agencyId && this.isViewing) {
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
              });
            this._contactService.getPointsOfContact(this.countryId)
              .subscribe(pointsOfContact => {
                this.pointsOfContact = pointsOfContact;
                this.pointsOfContact.forEach(pointOfContact => {
                  this._userService.getUser(pointOfContact.staffMember).subscribe(user => {
                    this.userPublicDetails[pointOfContact.staffMember] = user;
                  });
                  this._userService.getStaff(this.countryId, pointOfContact.staffMember).subscribe(staff => {
                    this.staffList[pointOfContact.staffMember] = staff;
                  });
                });
              });
          });
      } else {

        // this._userService.getCountryId(Constants.USER_PATHS[this.userType], this.uid)
        //   .takeUntil(this.ngUnsubscribe)
        //   .subscribe(countryId => {
        //     this.countryId = countryId;

        // this._userService.getAgencyId(Constants.USER_PATHS[this.userType], this.uid)
        //   .takeUntil(this.ngUnsubscribe)
        //   .subscribe(agencyId => {
        //     this.agencyId = agencyId;
        //   });
        this.agencyId = agencyId;
        this.countryId = countryId;

        this._agencyService.getAgency(this.agencyId)
          .map(agency => {
            return agency as ModelAgency;
          })
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agency => {
            this.agency = agency;

            this._agencyService.getCountryOffice(this.countryId, this.agencyId)
              .map(countryOffice => {
                let countryOfficeAddress = new CountryOfficeAddressModel();
                countryOfficeAddress.mapFromObject(countryOffice);
                return countryOfficeAddress;
              })
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryOfficeAddress => {
                this.countryOfficeAddress = countryOfficeAddress;
              });
            this._contactService.getPointsOfContact(this.countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(pointsOfContact => {
                this.pointsOfContact = pointsOfContact;
                this.pointsOfContact.forEach(pointOfContact => {
                  this._userService.getUser(pointOfContact.staffMember).subscribe(user => {
                    this.userPublicDetails[pointOfContact.staffMember] = user;
                  });
                  this._userService.getStaff(this.countryId, pointOfContact.staffMember).subscribe(staff => {
                    this.staffList[pointOfContact.staffMember] = staff;
                  });
                });
              });
          });
        // });
      }
      PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
        this.countryPermissionsMatrix = isEnabled;
      }));
    });
  }

  getPointOfContactName(id) {
    let name = "";
    if (this.userPublicDetails && this.userPublicDetails[id]) {
      name = this.userPublicDetails[id].firstName + ' ' + this.userPublicDetails[id].lastName;
    }

    return name;
  }

  getPointOfContactEmail(id) {
    let email = "";

    if (this.userPublicDetails && this.userPublicDetails[id]) {
      email = this.userPublicDetails[id].email;
    }

    return email;
  }

  getPointOfContactMobile(id) {
    let mobile = "";

    if (this.userPublicDetails && this.userPublicDetails[id]) {
      mobile = this.userPublicDetails[id].phone;
    }

    return mobile;
  }

  getPointOfContactPosition(id) {
    let position = "";

    if (this.staffList && this.staffList[id]) {
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

  editOfficeDetails() {
    this.router.navigateByUrl('/country-admin/country-office-profile/contacts/edit-office-details');
  }

  addEditPointOfContact(pointOfContactId?: string) {
    if (pointOfContactId) {
      this.router.navigate(['/country-admin/country-office-profile/contacts/add-edit-point-of-contact',
        {id: pointOfContactId}], {skipLocationChange: true});
    } else {
      this.router.navigateByUrl('/country-admin/country-office-profile/contacts/add-edit-point-of-contact');
    }
  }
}
