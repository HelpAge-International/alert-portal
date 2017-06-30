import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {firebaseConfig} from "../../../app.module";
import * as firebase from "firebase";
import {ModelUserPublic} from "../../../model/user-public.model";
import {ModelNetwork, ModelNetworkOld} from "../../../model/network.model";
import {UUID} from "../../../utils/UUID";
import {PageControlService} from "../../../services/pagecontrol.service";

@Component({
  selector: 'app-create-edit-global-network',
  templateUrl: 'create-edit-global-network.component.html',
  styleUrls: ['create-edit-global-network.component.css']
})

export class CreateEditGlobalNetworkComponent implements OnInit, OnDestroy {

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

  COUNTRY = Constants.COUNTRIES;
  COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;

  private alerts = {};
  private secondApp: firebase.app.App;
  private networkId: string;
  private modelAdmin: ModelUserPublic;
  private preNetworkName: string;
  private preEmail: string;
  private networkAdminId: string;
  private isUserExist: boolean;
  private uidUserExist: string;
  private systemAdminUid: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.systemAdminUid = user.uid;
      this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
      this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
        console.log("load: " + params["id"]);
        if (params["id"]) {
          this.isEdit = true;
          this.networkId = params["id"];
          this.loadNetworkInfo(this.networkId);
        }
      });
    });
  }

  private loadNetworkInfo(networkId) {
    this.af.database.object(Constants.APP_STATUS + "/network/" + networkId)
      .flatMap(network => {
        this.preNetworkName = network.name;
        this.networkName = network.name;
        this.networkAdminId = network.networkAdminId;
        return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + network.networkAdminId)
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        this.modelAdmin = new ModelUserPublic(user.firstName, user.lastName, user.title, user.email);
        this.modelAdmin.addressLine1 = user.addressLine1;
        this.modelAdmin.addressLine2 = user.addressLine2;
        this.modelAdmin.addressLine3 = user.addressLine3;
        this.modelAdmin.country = user.country;
        this.modelAdmin.city = user.city;
        this.modelAdmin.postCode = user.postCode;

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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.secondApp.delete();
  }

  private showAlert() {
    this.hideWarning = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.hideWarning = true;
    });
  }

  submit() {
    console.log("submit");
    this.refreshData();
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
    this.af.database.list(Constants.APP_STATUS + "/network", {
      query: {
        orderByChild: "name",
        equalTo: this.networkName
      }
    })
      .take(1)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networks => {
        if (networks.length != 0) {
          this.waringMessage = "SYSTEM_ADMIN.GLOBAL_NETWORKS.NETWORK_NAME_DUPLICATE";
          this.showAlert();
          return;
        }
        if (this.isEdit) {
          this.updateNetworkName();
          this.saveNetworkAdminToFirebaseDB(this.networkAdminId, this.networkId);
        } else {
          this.saveNetworkToFirebase();
        }
      });
  }

  private findUidForExistingEmail(adminEmail: string, networkId: string) {
    this.af.database.list(Constants.APP_STATUS + "/userPublic/", {
      query: {
        orderByChild: "email",
        equalTo: adminEmail,
        limitToFirst: 1
      }
    })
      .do(users => {
        if (users.length > 0) {
          this.isUserExist = true;
          this.uidUserExist = users[0].$key;
        }
      })
      .first()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        if (this.isUserExist) {
          console.log("Existing user");
          this.referenceNetwork(this.uidUserExist, networkId);
          return;
        }
        this.waringMessage = "GLOBAL.GENERAL_ERROR";
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

  private saveNetworkToFirebase(){
    /**
     * Upload network data to /network/ node
    **/

    let newNetwork = new ModelNetwork();
    newNetwork.name = this.networkName;
    newNetwork.isActive = true;
    newNetwork.logoPath = "";
    newNetwork.isInitialisedNetwork = false;

    let networkPath = Constants.APP_STATUS + '/network/';
    this.af.database.list(networkPath).push(newNetwork)
      .then((value) => {
        console.log("New network created successfully");
        this.addUserToFirebaseAuth(value.key);
      });
  }

  private updateNetworkName(){
    let networkPath = Constants.APP_STATUS + '/network/'+this.networkId;
    this.af.database.object(networkPath+"/name").set(this.networkName).then(() => {
      console.log("Updated network name");
    });
    this.router.navigateByUrl(Constants.SYSTEM_ADMIN_NETWORK_HOME);
  }

  private addUserToFirebaseAuth(networkId: string) {
    /**
     * Saving new user into Firebase auth
     */

    let tempPassword = Constants.TEMP_PASSWORD;
    this.secondApp.auth().createUserWithEmailAndPassword(this.adminEmail, tempPassword).then(x => {
      console.log("User " + x.uid + " created successfully");
      this.secondApp.auth().signOut();
      this.saveNetworkAdminToFirebaseDB(x.uid, networkId);
    }, error => {
      console.log(error.message);
      if (error.message.includes("The email address is already in use by another account")) {
        console.log("Exisiting user. Reading email address.");
        this.findUidForExistingEmail(this.adminEmail, networkId);
        return;
      }
      this.waringMessage = "GLOBAL.GENERAL_ERROR";
      this.showAlert();
    });
  }

  private saveNetworkAdminToFirebaseDB(networkAdminId: string, networkId: string) {

    /**
     * Upload the network admin details to /userPublic
     **/

    let newNetworkAdmin = new ModelUserPublic(this.adminFirstName, this.adminLastName,
      this.adminTitle, this.adminEmail);
    newNetworkAdmin.addressLine1 = this.adminAddressLine1 ? this.adminAddressLine1 : "";
    newNetworkAdmin.addressLine2 = this.adminAddressLine2 ? this.adminAddressLine2 : "";
    newNetworkAdmin.addressLine3 = this.adminAddressLine3 ? this.adminAddressLine3 : "";
    newNetworkAdmin.city = this.adminCity ? this.adminCity : "";
    newNetworkAdmin.country = this.adminCountry ? this.adminCountry : -1;
    newNetworkAdmin.postCode = this.adminPostcode ? this.adminPostcode : "";
    newNetworkAdmin.phone = "";

    let userPublicPath = Constants.APP_STATUS + '/userPublic/';
    this.af.database.object(userPublicPath + "/" + networkAdminId).set(newNetworkAdmin)
      .then(_ => {
        console.log("New network admin added");
        this.referenceNetwork(networkAdminId, networkId);
      });
  }

  private referenceNetwork(networkAdminId: string, networkId: string){
    console.log("Referencing new network");
    this.networkId = networkId;

    /**
     * Updating network admin id in the network node
     **/

    let networkPath = Constants.APP_STATUS + '/network/'+networkId;
    this.af.database.object(networkPath+"/networkAdminId").set(networkAdminId).then(() => {
      console.log("Updated network node with network admin id");
    });

    /**
     * Other referencing
     **/

    let networkAdminPath = Constants.APP_STATUS + '/networkAdmin/'+networkAdminId;
    this.af.database.object(networkAdminPath, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((networkAdmin: any) => {
          console.log(networkAdmin.val());
          if(networkAdmin.val() != null){
            console.log("Update existing node");
            this.af.database.object(networkAdminPath + "/networkIds/" + this.networkId).set(true).then(() => {
              console.log("Network ID added to existing user");
            })
          } else{
            let newNetworkIds = {};
            newNetworkIds[this.networkId] = true;
            let systemAdminData = {};
            systemAdminData[this.systemAdminUid] = true;
            let newAdminData = {};

            newAdminData["networkIds"] = newNetworkIds;
            newAdminData["systemAdmin"] = systemAdminData;

            this.af.database.object(networkAdminPath).set(newAdminData).then(() => {
              console.log("New network ids pushed");

            }).catch(error => {
              console.log("New network ids push failed --> " + error.message);
              console.log(error.message);
              this.waringMessage = "GLOBAL.GENERAL_ERROR";
              this.showAlert();
            });
          }

          this.router.navigateByUrl(Constants.SYSTEM_ADMIN_NETWORK_HOME);
      });
  }

  private editNetwork() {
    console.log("edit network");
    if (this.adminEmail == this.preEmail) {
      this.saveNetworkAdminToFirebaseDB(this.networkAdminId, this.networkId);
    } else {
      this.editWithNewEmail();
    }
  }

  private editWithNewEmail() {
    console.log("edit with new email");
    let oldNetworkAdminId = this.networkAdminId;
    let networkAdminPath = Constants.APP_STATUS + '/networkAdmin/'+oldNetworkAdminId;
    this.af.database.object(networkAdminPath + "/networkIds/" + this.networkId).set(null).then(() => {
      console.log("Network id deleted from old user");
    });

    this.addUserToFirebaseAuth(this.networkId);
  }

  private refreshData() {
    this.isUserExist = false;
    this.uidUserExist = "";
  }
}
