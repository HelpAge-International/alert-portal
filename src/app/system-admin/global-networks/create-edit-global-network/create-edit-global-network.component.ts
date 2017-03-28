import {Component, OnInit, OnDestroy} from "@angular/core";
import {RxHelper} from "../../../utils/RxHelper";
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {firebaseConfig} from "../../../app.module";
import * as firebase from "firebase";
import {ModelUserPublic} from "../../../model/user-public.model";
import {ModelNetwork} from "../../../model/network.model";

@Component({
  selector: 'app-create-edit-global-network',
  templateUrl: 'create-edit-global-network.component.html',
  styleUrls: ['create-edit-global-network.component.css']
})
export class CreateEditGlobalNetworkComponent implements OnInit,OnDestroy {
  subscriptions: RxHelper;

  waringMessage: string;
  hideWarning: boolean = true;
  networkName: string;
  adminTitle: number = 0;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminAddressLine1: string;
  adminAddressLine2: string;
  adminAddressLine3: string;
  adminCountry: number;
  adminCity: string;
  adminPostcode: string;
  isEdit = false;

  COUNTRY = Constants.COUNTRY;
  COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;

  private uid: string;
  private alerts = {};
  private secondApp: firebase.app.App;
  private networkId: string;
  private modelAdmin: ModelUserPublic;
  private preNetworkName: string;
  private preEmail: string;
  private adminId: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      this.secondApp = firebase.initializeApp(firebaseConfig, "third");
      let subscription = this.route.params.subscribe((params: Params) => {
        console.log("load: " + params["id"]);
        if (params["id"]) {
          this.isEdit = true;
          this.networkId = params["id"];
          this.loadNetworkInfo(this.networkId);
        }
      });
      this.subscriptions.add(subscription);
    });
    this.subscriptions.add(subscription);
  }

  private loadNetworkInfo(networkId) {
    let subscription = this.af.database.object(Constants.APP_STATUS + "/network/" + networkId)
      .flatMap(network => {
        this.preNetworkName = network.name;
        this.networkName = network.name;
        this.adminId = network.adminId;
        return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + network.adminId)
      })
      .subscribe(user => {
        //create model for later use
        this.modelAdmin = new ModelUserPublic(user.firstName, user.lastName, user.title, user.email);
        this.modelAdmin.addressLine1 = user.addressLine1;
        this.modelAdmin.addressLine2 = user.addressLine2;
        this.modelAdmin.addressLine3 = user.addressLine3;
        this.modelAdmin.country = user.country;
        this.modelAdmin.city = user.city;
        this.modelAdmin.postCode = user.postCode;
        //show data in ui
        this.adminTitle = user.title;
        this.adminFirstName = user.firstName;
        this.adminLastName = user.lastName;
        this.adminEmail = user.email;
        this.preEmail = user.email;
        this.adminAddressLine1 = user.addressLine1;
        this.adminAddressLine2 = user.addressLine2;
        this.adminAddressLine3 = user.addressLine3;
        this.adminCountry = user.country;
        this.adminCity = user.city;
        this.adminPostcode = user.postCode;
      });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
    this.secondApp.delete();
  }

  private showAlert() {
    this.hideWarning = false;
    let subscribe = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.hideWarning = true;
    });
    this.subscriptions.add(subscribe);
  }

  submit() {
    console.log("submit");
    if (!CustomerValidator.EmailValidator(this.adminEmail)) {
      this.waringMessage = "GLOBAL.EMAIL_NOT_VALID";
      this.showAlert();
      return;
    }
    if (this.isEdit && this.preNetworkName == this.networkName) {
      console.log("no name change update");
      this.editNetwork();
      return;
    }
    this.validateNetworkName();
  }

  private validateNetworkName() {
    let subscription = this.af.database.list(Constants.APP_STATUS + "/network", {
      query: {
        orderByChild: "name",
        equalTo: this.networkName
      }
    }).subscribe(networks => {
      if (networks.length != 0) {
        this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_NAME_DUPLICATE";
        this.showAlert();
        return;
      }
      if (this.isEdit) {
        this.editNetwork();
      } else {
        this.createNewAdmin();
      }
    });
    this.subscriptions.add(subscription);

  }

  private createNewAdmin() {
    let tempPassword = "testtest";
    this.secondApp.auth().createUserWithEmailAndPassword(this.adminEmail, tempPassword).then(success => {
      console.log("admin " + success.uid + " created successfully");
      let uid: string = success.uid;
      this.updateFirebase(uid);
      this.secondApp.auth().signOut();
    }, error => {
      console.log(error.message);
      this.waringMessage = error.message;
      this.showAlert();
    });
  }

  validate() {
    this.validForm();
  }

  cancel() {
    this.router.navigateByUrl(Constants.SYSTEM_ADMIN_NETWORK_HOME);
  }

  validForm(): boolean {
    if (!this.networkName) {
      this.alerts[this.networkName] = true;
      this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_NAME_EMPTY";
      this.showAlert();
      return false;
    } else if (!this.adminFirstName) {
      this.alerts[this.adminFirstName] = true;
      this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_ADMIN_FIRST_NAME";
      this.showAlert();
      return false;
    } else if (!this.adminLastName) {
      this.alerts[this.adminLastName] = true;
      this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_ADMIN_LAST_NAME";
      this.showAlert();
      return false;
    } else if (!this.adminEmail) {
      this.alerts[this.adminEmail] = true;
      this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_ADMIN_EMAIL";
      this.showAlert();
      return false;
    } else {
      this.hideWarning = true;
      return true;
    }
  }

  private updateFirebase(uid: string) {
    let networkData = {};

    //userPublic node
    let newNetworkAdmin = new ModelUserPublic(this.adminFirstName, this.adminLastName,
      this.adminTitle, this.adminEmail);
    newNetworkAdmin.addressLine1 = this.adminAddressLine1 ? this.adminAddressLine1 : "";
    newNetworkAdmin.addressLine2 = this.adminAddressLine2 ? this.adminAddressLine2 : "";
    newNetworkAdmin.addressLine3 = this.adminAddressLine3 ? this.adminAddressLine3 : "";
    newNetworkAdmin.city = this.adminCity ? this.adminCity : "";
    newNetworkAdmin.country = this.adminCountry ? this.adminCountry : -1;
    newNetworkAdmin.postCode = this.adminPostcode ? this.adminPostcode : "";
    newNetworkAdmin.phone = "";
    networkData["/userPublic/" + uid] = newNetworkAdmin;

    //admin node
    if (this.isEdit) {
      networkData["/adminNetwork/" + uid + "/networkId/"] = this.networkId;
    } else {
      networkData["/adminNetwork/" + uid + "/networkId/"] = uid;
    }
    networkData["/adminNetwork/" + uid + "/systemAdmin/" + this.uid + "/"] = true;

    //group
    networkData["/group/systemadmin/allusersgroup/" + uid + "/"] = true;
    networkData["/group/systemadmin/allnetworkadminsgroup/" + uid + "/"] = true;

    //network node
    if (this.isEdit) {
      networkData["/network/" + this.networkId + "/adminId"] = uid;
      networkData["/network/" + this.networkId + "/name"] = this.networkName;
      //clean up previous admin
      networkData["/userPublic/" + this.adminId] = null;
      networkData["/adminNetwork/" + this.adminId] = null;
      networkData["/group/systemadmin/allusersgroup/" + this.adminId] = null;
      networkData["/group/systemadmin/allnetworkadminsgroup/" + this.adminId] = null;
    } else {
      let network = new ModelNetwork();
      network.adminId = uid;
      network.name = this.networkName;
      network.isActive = true;
      network.logoPath = "https://lh3.googleusercontent.com/-9ETHQFY_l6A/AAAAAAAAAAI/AAAAAAAAAAA/lN3q2-pbJHU/W40-H40/photo.jpg?sz=64";
      networkData["/network/" + uid + "/"] = network;
    }

    //actual update
    this.af.database.object(Constants.APP_STATUS).update(networkData).then(() => {
      this.router.navigateByUrl(Constants.SYSTEM_ADMIN_NETWORK_HOME);
    }, error => {
      this.waringMessage = error.message;
      this.showAlert();
    })
  }

  private editNetwork() {
    console.log("edit network");
    if (this.adminEmail == this.preEmail) {
      this.editNoEmailChange();
    } else {
      this.editWithNewEmail();
    }
  }

  private editWithNewEmail() {
    console.log("editWithNewEmail");
    this.createNewAdmin();
  }

  private editNoEmailChange() {
    console.log("editNoEmailChange");
    let networkData = {};

    //network detail
    networkData["/network/" + this.networkId + "/name"] = this.networkName;

    //admin detail
    networkData["/userPublic/" + this.adminId + "/title"] = this.adminTitle;
    networkData["/userPublic/" + this.adminId + "/firstName"] = this.adminFirstName;
    networkData["/userPublic/" + this.adminId + "/lastName"] = this.adminLastName;
    networkData["/userPublic/" + this.adminId + "/email"] = this.adminEmail;
    networkData["/userPublic/" + this.adminId + "/addressLine1"] = this.adminAddressLine1;
    networkData["/userPublic/" + this.adminId + "/addressLine2"] = this.adminAddressLine2;
    networkData["/userPublic/" + this.adminId + "/addressLine3"] = this.adminAddressLine3;
    networkData["/userPublic/" + this.adminId + "/country"] = this.adminCountry;
    networkData["/userPublic/" + this.adminId + "/city"] = this.adminCity;
    networkData["/userPublic/" + this.adminId + "/postCode"] = this.adminPostcode;

    this.af.database.object(Constants.APP_STATUS).update(networkData).then(() => {
      this.router.navigateByUrl(Constants.SYSTEM_ADMIN_NETWORK_HOME);
    }, error => {
      this.waringMessage = error.message;
      this.showAlert();
    });
  }
}
