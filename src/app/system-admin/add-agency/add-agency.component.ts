import {Component, OnInit} from '@angular/core';
import {CustomerValidator} from "../../utils/CustomValidator";
import * as firebase from "firebase";
import {firebaseConfig} from "../../app.module";
import {AngularFire} from "angularfire2";
import {ModelUserPublic} from "../../model/user-public.model";
import {Constants} from "../../utils/Constants";
import {ModelAgency} from "../../model/agency.model";
import {Router, ActivatedRoute, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import {PersonTitle, Country} from "../../utils/Enums";

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.css']
})
export class AddAgencyComponent implements OnInit {

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
  PersonTitle = PersonTitle;
  Country = Country;
  countryList: number[] = [Country.UK, Country.France, Country.Germany];
  personTitleList: number[] = [PersonTitle.Mr, PersonTitle.Miss, PersonTitle.Dr];
  private emailInDatabase: string;
  private agencyId: string;
  private userPublic: ModelUserPublic;
  private adminId: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.waringMessage = "warning message!!!";
    this.hideWarning = true;
    this.route.params
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.agencyId = params["id"];
          this.isEdit = true;
          this.loadAgencyInfo(params["id"]);
        }
      });
  }

  private loadAgencyInfo(agencyId: string) {
    //load from agency
    this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId).subscribe((agency: ModelAgency) => {
      this.agencyName = agency.name;
      this.adminId = agency.adminId;

      //load from user public
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + agency.adminId)
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
    });

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
    let secondApp = firebase.initializeApp(firebaseConfig, "second");
    let tempPassword = "testtest";
    secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(x => {
      console.log("user " + x.uid + " created successfully");
      let uid: string = x.uid;
      this.writeToFirebase(uid);
      secondApp.auth().signOut();
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
      this.af.database.object(Constants.APP_STATUS).update(updateData).then(_ => {
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
    this.af.database.list(Constants.APP_STATUS + "/agency", {
      query: {
        orderByChild: "name",
        equalTo: this.agencyName
      }
    }).subscribe(agencyList => {
      if (agencyList.length == 0) {
        console.log("create new user");
        this.createNewUser();
      } else {
        this.waringMessage = "Agency name duplicate!";
        this.hideWarning = false;
      }
    });
  }

  private createNewUser() {
    console.log("start register new agency");
    let secondApp = firebase.initializeApp(firebaseConfig, "second");
    let tempPassword = "testtest";
    secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(success => {
      console.log("user " + success.uid + " created successfully");
      let uid: string = success.uid;
      this.writeToFirebase(uid);
      secondApp.auth().signOut();
    }, error => {
      console.log(error.message);
      this.waringMessage = error.message;
      this.hideWarning = false;
    });
  }

  private validateForm(): boolean {
    if (!this.agencyName) {
      this.hideWarning = false;
      this.waringMessage = "Name is missing!";
      return false;
    } else if (!CustomerValidator.EmailValidator(this.agencyAdminEmail)) {
      this.hideWarning = false;
      this.waringMessage = "Email is not valid!!";
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
    let systemAdminUid = "hoXTsvefEranzaSQTWbkhpBenLn2";
    agencyData["/administratorAgency/" + uid + "/systemAdmin/" + systemAdminUid] = true;
    if (this.isEdit) {
      agencyData["/administratorAgency/" + uid + "/agencyId"] = this.agencyId;
      agencyData["/agency/" + this.agencyId + "/adminId"] = uid;
    } else {
      agencyData["/administratorAgency/" + uid + "/agencyId"] = uid;
      agencyData["/group/agencygroup/"+uid] = true;
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
}
