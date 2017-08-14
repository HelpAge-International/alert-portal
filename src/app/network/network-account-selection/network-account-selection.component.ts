import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseApp} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkAdminAccount} from "./Models/network-admin-account";
import {Constants} from "../../utils/Constants";
import {NetworkUserAccountType, UserType} from "../../utils/Enums";
import {UserService} from "../../services/user.service";

declare var jQuery: any;

@Component({
  selector: 'app-network-account-selection',
  templateUrl: './network-account-selection.component.html',
  styleUrls: ['./network-account-selection.component.css']
})

export class NetworkAccountSelectionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  firebase: any;
  private uid: string;
  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;
  private networkAdminAccount: NetworkAdminAccount;
  private selectedAccountId: string;
  private selectedUserAccountType: any;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              @Inject(FirebaseApp) firebaseApp: any,
              private af: AngularFire,
              private userSerivce: UserService,
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
            console.log(UserType[userType]);
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

    this.af.database.list(Constants.APP_STATUS + "/networkAdmin/" + this.uid + "/networkIds")
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

  }

  onSelectedNetworkAdminAccount(networkId: string) {
    console.log(networkId);
    this.selectedAccountId = networkId;
    this.selectedUserAccountType = NetworkUserAccountType.NetworkAdmin;
  }

  onSelectedNetworkCountryAdminAccount(networkCountryId: string) {
    this.selectedUserAccountType = NetworkUserAccountType.NetworkCountryAdmin;

  }

  onSelectedOtherUserAccount() {
    //TODO: set the user account type to the firebase user type variable
    // this.selectedOtherUserAccountType =
  }

  onSubmit() {
    if (this.validate()) {
      switch (this.selectedUserAccountType) {
        case NetworkUserAccountType.NetworkAdmin:
          this.router.navigate(['/network/new-network-details', {networkId: this.selectedAccountId}]);
          break;
        case NetworkUserAccountType.NetworkCountryAdmin:
          //TODO
          break;
        case UserType.AgencyAdmin:
          break;
        case UserType.CountryAdmin:
          break;
        case UserType.CountryDirector:
          break;
        case UserType.CountryUser:
          break;
        case UserType.Donor:
          break;
        case UserType.Ert:
          break;
        case UserType.ErtLeader:
          break;
        case UserType.GlobalDirector:
          break;
        case UserType.GlobalUser:
          break;
        case UserType.RegionalDirector:
          break;
      }
    }
  }

  private validate() {
    console.log(this.selectedAccountId);
    if (!this.selectedAccountId) {
      this.alertSuccess = false;
      this.alertShow = true;
      this.alertMessage = "NETWORK_ADMIN.PLEASE_SELECT_ACCOUNT_TO_CONTINUE";
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
