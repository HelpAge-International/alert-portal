import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ModelUserPublic} from "../../../model/user-public.model";
import {UserService} from "../../../services/user.service";
import {AgencyService} from "../../../services/agency-service.service";
import {NetworkService} from "../../../services/network.service";
import {ModelAgency} from "../../../model/agency.model";
import {CountryOfficeAddressModel} from "../../../model/countryoffice.address.model";
import {ContactService} from "../../../services/contact.service";
import {PointOfContactModel} from "../../../model/point-of-contact.model";
import {ModelStaff} from "../../../model/staff.model";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-local-network-profile-contacts',
  templateUrl: './local-network-profile-contacts.component.html',
  styleUrls: ['./local-network-profile-contacts.component.css']
})
export class LocalNetworkProfileContactsComponent implements OnInit, OnDestroy {
  agencies: any[];
  networkID: any;

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


  private countryOfficeAddress = new Map<string, CountryOfficeAddressModel>()
  private pointsOfContact = new Map<string, PointOfContactModel[]>()


  private userPublicDetails: ModelUserPublic[];
  private staffList: ModelStaff[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();


  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private _userService: UserService,
              private _agencyService: AgencyService,
              private _networkService: NetworkService,
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



    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      this._networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkID = selection["id"];
          this._networkService.getAgencyCountryOfficesByNetwork(this.networkID)
            .takeUntil(this.ngUnsubscribe)
            .subscribe( officeAgencyMap => {
              this.agencies = []

              officeAgencyMap.forEach((value: string, key: string) => {

                this._agencyService.getAgency(key)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(agency => {

                    this.agencies.push(agency)

                    this._agencyService.getCountryOffice(value, key)
                      .map(countryOffice => {
                        let countryOfficeAddress = new CountryOfficeAddressModel();
                        countryOfficeAddress.mapFromObject(countryOffice);

                        return countryOfficeAddress;
                      })
                      .subscribe(countryOfficeAddress => {
                        this.countryOfficeAddress.set(key, countryOfficeAddress)
                      });
                    this._contactService.getPointsOfContact(value)
                      .subscribe(pointsOfContact => {
                        this.pointsOfContact.set(key, pointsOfContact)
                        this.pointsOfContact.get(key).forEach(pointOfContact => {
                          this._userService.getUser(pointOfContact.staffMember).subscribe(user => {
                            this.userPublicDetails[pointOfContact.staffMember] = user;
                          });
                          this._userService.getStaff(value, pointOfContact.staffMember).subscribe(staff => {
                            this.staffList[pointOfContact.staffMember] = staff;
                          });
                        });
                      })
                  });
              })
            })
        })
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
