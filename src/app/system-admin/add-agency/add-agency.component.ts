import {Component, OnInit, OnDestroy} from "@angular/core";
import {CustomerValidator} from "../../utils/CustomValidator";
import * as firebase from "firebase";
import {firebaseConfig} from "../../app.module";
import {AngularFire} from "angularfire2";
import {ModelUserPublic} from "../../model/user-public.model";
import {Constants} from "../../utils/Constants";
import {ModelAgency} from "../../model/agency.model";
import {Router, ActivatedRoute, Params} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mergeMap";
import {PersonTitle, Country} from "../../utils/Enums";
import {DialogService} from "../../dialog/dialog.service";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.css']
})
export class AddAgencyComponent implements OnInit,OnDestroy {

  waringMessage: string
  agencyName: string
  agencyAdminTitle: number = 0;
  agencyAdminFirstName: string
  agencyAdminLastName: string
  agencyAdminEmail: string
  agencyAdminAddressLine1: string
  agencyAdminAddressLine2: string
  agencyAdminAddressLine3: string
  agencyAdminCountry: number
  agencyAdminCity: string
  agencyAdminPostCode: string
  hideWarning: boolean
  isEdit = false;
  // Country = Country;
  Country = Constants.COUNTRY;
  countryList: number[] = [Country.UK, Country.France, Country.Germany];
  // PersonTitle = PersonTitle;
  PersonTitle = Constants.PERSON_TITLE;
  personTitleList: number[] = [PersonTitle.Mr, PersonTitle.Miss, PersonTitle.Dr];
  private emailInDatabase: string;
  private agencyId: string;
  private userPublic: ModelUserPublic;
  private adminId: string;
  private rxhelper: RxHelper;
  private deleteAgency: any = {};
  private secondApp: firebase.app.App;
  private systemAdminUid: string;

  constructor(private af: AngularFire, private router: Router,
              private route: ActivatedRoute, private dialogService: DialogService) {
    this.rxhelper = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.systemAdminUid = user.auth.uid;
        this.secondApp = firebase.initializeApp(firebaseConfig, "second");
        this.waringMessage = "warning message!!!";
        this.hideWarning = true;
        let subscription = this.route.params
          .subscribe((params: Params) => {
            if (params["id"]) {
              this.agencyId = params["id"];
              this.isEdit = true;
              this.loadAgencyInfo(params["id"]);
            }
          });
        this.rxhelper.add(subscription);
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.rxhelper.add(subscription);
  }

  ngOnDestroy() {
    this.rxhelper.releaseAll();
    this.secondApp.delete();
  }

  private loadAgencyInfo(agencyId: string) {
    //load from agency
    let subscription = this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId).subscribe((agency: ModelAgency) => {
      this.agencyName = agency.name;
      this.adminId = agency.adminId;

      //load from user public
      let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + agency.adminId)
        .subscribe((user: ModelUserPublic) => {
          this.userPublic = user;
          this.agencyAdminTitle = user.title;
          this.agencyAdminFirstName = user.firstName;
          this.agencyAdminLastName = user.lastName;
          this.agencyAdminTitle = user.title;
          this.agencyAdminEmail = user.email;
          this.emailInDatabase = user.email;
          this.agencyAdminAddressLine1 = user.addressLine1;
          this.agencyAdminAddressLine2 = user.addressLine2;
          this.agencyAdminAddressLine3 = user.addressLine3;
          this.agencyAdminCountry = user.country;
          this.agencyAdminCity = user.city;
          this.agencyAdminPostCode = user.postCode;
        });
      this.rxhelper.add(subscription);
    });
    this.rxhelper.add(subscription);
  }

  onSubmit() {
    if (this.validateForm()) {
      if (this.isEdit) {
        this.updateAgencyInfo();
      } else {
        this.registerNewAgency();
      }
    }
  }

  private updateAgencyInfo() {
    console.log("update");
    console.log(this.agencyAdminEmail);
    console.log(this.emailInDatabase);
    if (this.agencyAdminEmail == this.emailInDatabase) {
      this.updateNoEmailChange();
    } else {
      this.updateWithNewEmail();
    }
  }

  private updateWithNewEmail() {
    console.log("new email");
    // let secondApp = firebase.initializeApp(firebaseConfig, "second");
    let tempPassword = "testtest";
    this.secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(x => {
      console.log("user " + x.uid + " created successfully");
      let uid: string = x.uid;
      this.writeToFirebase(uid);
      this.secondApp.auth().signOut();
    }, error => {
      console.log(error.message);
    });
  }

  private updateNoEmailChange() {
    console.log("no email change");
    console.log("agencyId: " + this.agencyId);
    this.updateToFirebase();
  }

  private updateToFirebase() {
    //update user
    if (this.userPublic) {
      this.userPublic.firstName = this.agencyAdminFirstName;
      this.userPublic.lastName = this.agencyAdminLastName;
      this.userPublic.title = this.agencyAdminTitle;
      if (this.agencyAdminAddressLine1) {
        this.userPublic.addressLine1 = this.agencyAdminAddressLine1;
      }
      if (this.agencyAdminAddressLine2) {
        this.userPublic.addressLine2 = this.agencyAdminAddressLine2;
      }
      if (this.agencyAdminAddressLine3) {
        this.userPublic.addressLine3 = this.agencyAdminAddressLine3;
      }
      if (this.agencyAdminCountry) {
        this.userPublic.country = this.agencyAdminCountry;
      }
      if (this.agencyAdminCity) {
        this.userPublic.city = this.agencyAdminCity;
      }
      if (this.agencyAdminPostCode) {
        this.userPublic.postCode = this.agencyAdminPostCode;
      }
      let updateData = {};
      updateData["/userPublic/" + this.adminId] = this.userPublic;
      updateData["/agency/" + this.agencyId + "/name"] = this.agencyName;
      this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {
        this.backToHome();
      }, error => {
        console.log(error.message);
      });
    }
  }

  private registerNewAgency() {
    this.validateAgencyName();
  }

  private validateAgencyName() {
    console.log("validate agency name");
    let subscription = this.af.database.list(Constants.APP_STATUS + "/agency", {
      query: {
        orderByChild: "name",
        equalTo: this.agencyName
      }
    }).subscribe(agencyList => {
      if (agencyList.length == 0) {
        console.log("create new user");
        this.createNewUser();
      } else {
        this.waringMessage = "ERROR.NAME_DUPLICATE";
        this.hideWarning = false;
      }
    });
    this.rxhelper.add(subscription);
  }

  private createNewUser() {
    console.log("start register new agency");
    // let secondApp = firebase.initializeApp(firebaseConfig, "fourth");
    let tempPassword = "testtest";
    this.secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(success => {
      console.log("user " + success.uid + " created successfully");
      let uid: string = success.uid;
      this.writeToFirebase(uid);
      this.secondApp.auth().signOut();
    }, error => {
      console.log(error.message);
      this.waringMessage = error.message;
      this.hideWarning = false;
    });
  }

  private validateForm(): boolean {
    if (!this.agencyName) {
      this.hideWarning = false;
      this.waringMessage = "ERROR.NAME_MISSING";
      return false;
    } else if (!CustomerValidator.EmailValidator(this.agencyAdminEmail)) {
      this.hideWarning = false;
      this.waringMessage = "ERROR.EMAIL_NOT_VALID";
      return false;
    } else {
      this.hideWarning = true;
      return true;
    }
  }

  private writeToFirebase(uid: string) {
    let agencyData = {};
    //write to userPublic node
    let newAgencyAdmin = new ModelUserPublic(this.agencyAdminFirstName, this.agencyAdminLastName,
      this.agencyAdminTitle, this.agencyAdminEmail);
    newAgencyAdmin.addressLine1 = "";
    newAgencyAdmin.addressLine2 = "";
    newAgencyAdmin.addressLine3 = "";
    newAgencyAdmin.city = "";
    newAgencyAdmin.country = -1;
    newAgencyAdmin.postCode = "";
    newAgencyAdmin.phone = "";

    //testing
    agencyData["/userPublic/" + uid] = newAgencyAdmin;
    // let systemAdminUid = "hoXTsvefEranzaSQTWbkhpBenLn2";
    agencyData["/administratorAgency/" + uid + "/systemAdmin/" + this.systemAdminUid] = true;
    if (this.isEdit) {
      agencyData["/administratorAgency/" + uid + "/agencyId"] = this.agencyId;
      agencyData["/agency/" + this.agencyId + "/adminId"] = uid;
      agencyData["/administratorAgency/" + this.adminId] = null;
      agencyData["/userPublic/" + this.adminId] = null;
      agencyData["/userPrivate/" + this.adminId] = null;
    } else {
      agencyData["/administratorAgency/" + uid + "/agencyId"] = uid;
      agencyData["/group/agencygroup/" + uid] = true;
      let agency = new ModelAgency();
      agency.name = this.agencyName;
      agency.isActive = true;
      agency.adminId = uid;
      agency.logoPath = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIccywWWDQhnGZDG6P4g4A9pJfSF9k8Xmsknac5C0TO-w_axRH";
      agencyData["/agency/" + uid] = agency;
    }
    this.af.database.object(Constants.APP_STATUS).update(agencyData).then(() => {
      this.backToHome();
    }, error => {
      console.log(error.message);
    });
  }

  private backToHome() {
    this.router.navigateByUrl(Constants.SYSTEM_ADMIN_HOME);
  }

  cancelSubmit() {
    this.backToHome();
  }

  delete() {
    console.log("delete");
    if (this.agencyId && this.adminId) {
      let subscription = this.dialogService.createDialog("test", "test test").subscribe(result => {
        console.log(result);
        //TODO delete agency (cant finish till whole system done)
        if (result) {
          this.deleteAgency["/userPublic/" + this.adminId] = null;
          this.deleteAgency["/administratorAgency/" + this.adminId] = null;
          this.deleteAgency["/group/agencygroup/" + this.adminId] = null;
          this.deleteAgency["/agency/" + this.agencyId] = null;
          this.deleteAgency["/messageRef/agencygroup/" + this.agencyId] = null;
          this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/sentmessages").subscribe(result => {
            result.forEach(item => {
              console.log(item.$key);
              this.deleteAgency["/message/" + item.$key] = null;
            });
            console.log(JSON.stringify(this.deleteAgency));
            this.af.database.object(Constants.APP_STATUS).update(this.deleteAgency).then(() => {
              this.router.navigateByUrl(Constants.SYSTEM_ADMIN_HOME);
            }, error => {
              console.log(error.message);
            });
          })
        }
      });
      this.rxhelper.add(subscription);
    }
  }
}
