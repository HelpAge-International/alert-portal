import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseApp} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkAdminAccount} from "./models/network-admin-account";
import {Constants} from "../../utils/Constants";
import {NetworkUserAccountType, UserType} from "../../utils/Enums";
import {UserService} from "../../services/user.service";
import {NetworkService} from "../../services/network.service";
import {NetworkCountryModel} from "../../network-country-admin/network-country.model";

declare var jQuery: any;

@Component({
  selector: 'app-network-account-selection',
  templateUrl: './network-account-selection.component.html',
  styleUrls: ['./network-account-selection.component.css'],
  providers: [NetworkService]
})

export class NetworkAccountSelectionComponent implements OnInit, OnDestroy {


  private Countries = Constants.COUNTRIES;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  firebase: any;
  private uid: string;
  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;
  private networkAdminAccount: NetworkAdminAccount;
  private selectedAccountId: string;
  private selectedNetworkCountryId: string;
  private selectedUserAccountType: any;

  private agencyDetail: any;
  private UserType = UserType;
  private userType: UserType;
  private networkCountries:NetworkCountryModel[] = [];
  private networkIdMap = new Map<string, string>();

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              @Inject(FirebaseApp) firebaseApp: any,
              private af: AngularFire,
              private userSerivce: UserService,
              private networkService: NetworkService,
              private router: Router) {
    this.firebase = firebaseApp;
  }

  ngOnInit(): void {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user, prevUserType, networkIds, networkCountryIds) => {
      this.uid = user.uid;
      console.log("Network admin uid: " + this.uid);

      this.downloadNetworkAdminAccount();
      this.downloadAllNetworkCountryAdminAccounts();

      this.userSerivce.getUserType(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(userType => {
          if (userType) {
            this.userType = userType;
            this.userSerivce.getAgencyId(Constants.USER_PATHS[userType], this.uid)
              .flatMap(agencyId => {
                console.log(agencyId)
                return this.userSerivce.getAgencyDetail(agencyId);
              })
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agencyDetail => {
                this.agencyDetail = agencyDetail;
                console.log(this.agencyDetail)
              });
          }
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private downloadNetworkAdminAccount() {
    this.networkAdminAccount = new NetworkAdminAccount();
    this.networkAdminAccount.networks = [];

    this.af.database.list(Constants.APP_STATUS + "/administratorNetwork/" + this.uid + "/networkIds")
      .flatMap(networkIds => {
        let keys = [];
        networkIds.forEach(id => {
          keys.push(id.$key);
        });
        return Observable.from(keys);
      })
      .flatMap(key => {
        return this.af.database.object(Constants.APP_STATUS + "/network/" + key);
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((network) => {
        this.filterAndInsertToList(network);
      });
  }

  private filterAndInsertToList(newNetwork) {
    var isExistingNetwork = false;
    var existingIndex = -1;
    console.log(newNetwork.name);

    this.networkAdminAccount.networks.forEach(function (existingNetwork, index) {
      if (newNetwork.$key == existingNetwork.$key) {
        isExistingNetwork = true;
        existingIndex = index;
      }
    });

    if (isExistingNetwork) {
      if (newNetwork.isActive) {
        this.networkAdminAccount.networks[existingIndex] = newNetwork;
      } else {
        this.networkAdminAccount.networks.splice(existingIndex, 1);
      }
    } else {
      if (newNetwork.isActive) {
        this.networkAdminAccount.networks.push(newNetwork);
      }
    }
  }

  private downloadAllNetworkCountryAdminAccounts() {

    this.networkService.getAllNetworkCountries(this.uid)
      .map(officeObjs => {
        console.log(officeObjs)
        return officeObjs.map(obj => {
          return obj["networkCountryIds"].map(id => {
            this.networkIdMap.set(id, obj["networkId"]);
            return this.networkService.getNetworkCountry(obj["networkId"], id)
          })
        })
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networks => {
        networks.forEach(networkCountries => {
          networkCountries.forEach(networkCountry => {
            networkCountry
              .takeUntil(this.ngUnsubscribe)
              .subscribe(office => {
                this.networkCountries.push(office);
              })
          })
        })
      })
  }

  onSelectedNetworkAdminAccount(networkId: string) {
    console.log(networkId);
    this.selectedAccountId = networkId;
    this.selectedUserAccountType = NetworkUserAccountType.NetworkAdmin;
  }

  onSelectedNetworkCountryAdminAccount(networkCountryId: string, networkId: string) {
    this.selectedUserAccountType = NetworkUserAccountType.NetworkCountryAdmin;
    console.log(networkCountryId);
    console.log(networkId);
    this.selectedAccountId = networkId;
    this.selectedNetworkCountryId = networkCountryId;
  }

  onSelectedRegularAccount(agencyId) {
    this.selectedAccountId = agencyId;
    this.selectedUserAccountType = this.userType;
  }

  onSubmit() {
    if (this.validate()) {
      console.log("submit");
      switch (this.selectedUserAccountType) {
        case NetworkUserAccountType.NetworkAdmin:
          this.goToNetworkAdmin();
          break;
        case NetworkUserAccountType.NetworkCountryAdmin:
          //TODO
          this.goToNetworkCountryAdmin();
          break;
        default:
          this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          });
          break;
      }
    }
  }

  private goToNetworkAdmin() {
    //TODO DOUBLE CHECK
    let selectionUpdate = {};
    selectionUpdate["/networkUserSelection/" + this.uid + "/selectedNetwork"] = this.selectedAccountId;
    selectionUpdate["/networkUserSelection/" + this.uid + "/selectedNetworkCountry"] = null;
    this.af.database.object(Constants.APP_STATUS).update(selectionUpdate).then(() => {

      let firstLoginCheck = [];
      if (this.userType) {
        Observable.merge(this.networkService.checkNetworkUserFirstLogin(this.uid, this.selectedUserAccountType), this.userSerivce.checkFirstLoginRegular(this.uid, this.userType))
          .take(2)
          .subscribe(firstLogin => {
            firstLoginCheck.push(firstLogin);
            if (firstLoginCheck.length == 2) {
              if (firstLoginCheck[0] != null && firstLoginCheck[0] == true && firstLoginCheck[1] != null && firstLoginCheck[1] == true) {
                this.router.navigateByUrl("network/network-create-password");
              } else {
                //TODO NAVIGATTE TO NETWORK ADMIN DASHBOARD
                console.log("navigate to network admin page!!!");
                this.router.navigateByUrl('/network/network-offices');
              }
            }
          });
      } else {
        this.networkService.checkNetworkUserFirstLogin(this.uid, this.selectedUserAccountType)
          .first()
          .subscribe(firstLogin => {
            if (firstLogin) {
              this.router.navigateByUrl("network/network-create-password");
            } else {
              console.log("to main page");
              //TODO NAVIGATE TO ADMIN PAGE
              this.router.navigateByUrl('/network/network-offices');
            }
          })
      }
    });
  }

  private goToNetworkCountryAdmin() {
    let selectionUpdate = {};
    selectionUpdate["/networkUserSelection/" + this.uid + "/selectedNetwork"] = this.selectedAccountId;
    selectionUpdate["/networkUserSelection/" + this.uid + "/selectedNetworkCountry"] = this.selectedNetworkCountryId;
    this.af.database.object(Constants.APP_STATUS).update(selectionUpdate).then(() => {

      let firstLoginCheck = [];
      if (this.userType) {
        Observable.merge(this.networkService.checkNetworkUserFirstLogin(this.uid, this.selectedUserAccountType), this.userSerivce.checkFirstLoginRegular(this.uid, this.userType))
          .take(2)
          .subscribe(firstLogin => {
            firstLoginCheck.push(firstLogin);
            if (firstLoginCheck.length == 2) {
              if (firstLoginCheck[0] != null && firstLoginCheck[0] == true && firstLoginCheck[1] != null && firstLoginCheck[1] == true) {
                this.router.navigateByUrl("network/network-create-password");
              } else {
                //TODO NAVIGATTE TO NETWORK ADMIN DASHBOARD
                console.log("navigate to network admin page!!!");
                this.router.navigateByUrl('/network-country/network-dashboard');
              }
            }
          });
      } else {
        this.networkService.checkNetworkUserFirstLogin(this.uid, this.selectedUserAccountType)
          .first()
          .subscribe(firstLogin => {
            if (firstLogin) {
              this.router.navigateByUrl("network/network-create-password");
            } else {
              console.log("to main page");
              //TODO NAVIGATE TO ADMIN PAGE
              this.router.navigateByUrl('/network-country/network-dashboard');
            }
          })
      }
    });
  }

  private validate() {
    console.log(this.selectedAccountId);
    if (!this.selectedAccountId) {
      this.alertSuccess = false;
      this.alertShow = true;
      this.alertMessage = "PLEASE_SELECT_ACCOUNT_TO_CONTINUE";
      return false;
    }
    return true;
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }


}
