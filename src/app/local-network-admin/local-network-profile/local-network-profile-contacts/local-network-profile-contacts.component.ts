
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, Privacy, UserType} from "../../../utils/Enums";
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
import {Subject} from "rxjs";
import {AngularFire} from "angularfire2";
import {LocalStorageService} from "angular-2-local-storage";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";
import {SettingsService} from "../../../services/settings.service";

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

  //network country re-use
  @Input() isNetworkCountry: boolean;
  private networkCountryId: string;
  private networkViewValues: {};
  private isViewingFromExternal: boolean;

  private agencyCountryPrivacyMap = new Map<string, ModelAgencyPrivacy>()
  private Privacy = Privacy


  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private _userService: UserService,
              private _agencyService: AgencyService,
              private _networkService: NetworkService,
              private _contactService: ContactService,
              private storageService: LocalStorageService,
              private settingService: SettingsService,
              private router: Router, private af: AngularFire) {
    this.userPublicDetails = [];
    this.staffList = [];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
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
          this.networkID = params['networkId'];
        }
        if (params['networkCountryId']) {
          this.networkCountryId = params['networkCountryId'];
        }
        if (params['uid']) {
          this.uid = params['uid'];
        }
        if (params['isViewingFromExternal']) {
          this.isViewingFromExternal = params['isViewingFromExternal'];
        }

        console.log(this.isNetworkCountry)
        this.isNetworkCountry ? this.networkCountryAccess() : this.localNetworkAdminAccess();
      })

  }

  private networkCountryAccess() {
    if (this.isViewing) {
      this._networkService.mapAgencyCountryForNetworkCountry(this.networkID, this.networkCountryId).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(officeAgencyMap => {

          this.agencies = []
          officeAgencyMap.forEach((value: string, key: string) => {

            this._agencyService.getAgency(key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {

                this.agencies.push(agency)

                value !== key ? this.loadNormalCountry(value, key) : this.loadLocalAgency(key)

              });

            //get privacy for country
            this.settingService.getPrivacySettingForCountry(value).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(key, privacy)
              })

          })

        });
    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        this._networkService.getSelectedIdObj(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkID = selection["id"];
            this.networkCountryId = selection["networkCountryId"];

            this._networkService.mapAgencyCountryForNetworkCountry(this.networkID, this.networkCountryId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(officeAgencyMap => {

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
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(countryOfficeAddress => {
                          this.countryOfficeAddress.set(key, countryOfficeAddress)
                        });

                      this._contactService.getPointsOfContact(value).pipe(
                        takeUntil(this.ngUnsubscribe))
                        .subscribe(pointsOfContact => {
                          this.pointsOfContact.set(key, pointsOfContact)
                          this.pointsOfContact.get(key).forEach(pointOfContact => {
                            this._userService.getUser(pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
                              this.userPublicDetails[pointOfContact.staffMember] = user;
                            });
                            this._userService.getStaff(value, pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(staff => {
                              this.staffList[pointOfContact.staffMember] = staff;
                            });
                          });
                        })
                    });

                  //get privacy for country
                  this.settingService.getPrivacySettingForCountry(value).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(privacy => {
                      this.agencyCountryPrivacyMap.set(key, privacy)
                    })
                })

              });
          });
      });
    }

  }

  private localNetworkAdminAccess() {
    if (this.isViewing) {

      this._networkService.getAgencyCountryOfficesByNetwork(this.networkID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(officeAgencyMap => {
          this.agencies = []

          officeAgencyMap.forEach((value: string, key: string) => {

            this._agencyService.getAgency(key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {

                this.agencies.push(agency)

                value !== key ? this.loadNormalCountry(value, key) : this.loadLocalAgency(key)
              });

            //get privacy for country
            this.settingService.getPrivacySettingForCountry(value).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(key, privacy)
              })
          })
        })
    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;
        this._networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkID = selection["id"];
            this._networkService.getAgencyCountryOfficesByNetwork(this.networkID)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(officeAgencyMap => {
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
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(countryOfficeAddress => {
                          this.countryOfficeAddress.set(key, countryOfficeAddress)
                        });
                      this._contactService.getPointsOfContact(value).pipe(
                        takeUntil(this.ngUnsubscribe))
                        .subscribe(pointsOfContact => {
                          this.pointsOfContact.set(key, pointsOfContact)
                          this.pointsOfContact.get(key).forEach(pointOfContact => {
                            this._userService.getUser(pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
                              this.userPublicDetails[pointOfContact.staffMember] = user;
                            });
                            this._userService.getStaff(value, pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(staff => {
                              this.staffList[pointOfContact.staffMember] = staff;
                            });
                          });
                        })
                    });

                  //get privacy for country
                  this.settingService.getPrivacySettingForCountry(value).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(privacy => {
                      this.agencyCountryPrivacyMap.set(key, privacy)
                    })
                })
              })
          })
      });
    }

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

  private loadNormalCountry(value: string, key: string) {
    this._agencyService.getCountryOffice(value, key)
      .map(countryOffice => {
        let countryOfficeAddress = new CountryOfficeAddressModel();
        countryOfficeAddress.mapFromObject(countryOffice);

        return countryOfficeAddress;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryOfficeAddress => {
        this.countryOfficeAddress.set(key, countryOfficeAddress)
      });

    this._contactService.getPointsOfContact(value).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(pointsOfContact => {
        this.pointsOfContact.set(key, pointsOfContact)
        this.pointsOfContact.get(key).forEach(pointOfContact => {
          this._userService.getUser(pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
            this.userPublicDetails[pointOfContact.staffMember] = user;
          });
          this._userService.getStaff(value, pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(staff => {
            this.staffList[pointOfContact.staffMember] = staff;
          });
        });
      })
  }

  private loadLocalAgency(agencyId: string) {
    this._agencyService.getLocalAgency(agencyId)
      .map(localAgency => {
        let localAgencyAddress = new CountryOfficeAddressModel();
        localAgencyAddress.mapFromObject(localAgency);

        return localAgencyAddress;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(localAgencyAddress => {
        this.countryOfficeAddress.set(agencyId, localAgencyAddress)
      });

    this._contactService.getPointsOfContactLocalAgency(agencyId).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(pointsOfContact => {
        this.pointsOfContact.set(agencyId, pointsOfContact)
        this.pointsOfContact.get(agencyId).forEach(pointOfContact => {
          this._userService.getUser(pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
            this.userPublicDetails[pointOfContact.staffMember] = user;
          });
          this._userService.getStaff(agencyId, pointOfContact.staffMember).pipe(takeUntil(this.ngUnsubscribe)).subscribe(staff => {
            this.staffList[pointOfContact.staffMember] = staff;
          });
        });
      })
  }

}
