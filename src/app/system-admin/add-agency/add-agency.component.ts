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
import {PersonTitle} from "../../utils/Enums";

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.css']
})
export class AddAgencyComponent implements OnInit {

  waringMessage: string
  agencyName: string
  agencyAdminTitle: number
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
  pageTitle = "Add New Agency"
  isEdit = false;
  PersonTitle = PersonTitle;
  // personTitle:string [] = ["Mr", "Miss", "Dr"];
  personTitleList: number[] = [PersonTitle.Mr, PersonTitle.Miss, PersonTitle.Dr];
  private emailInDatabase: string;
  private agencyId: string;

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
          this.pageTitle = "Edit Agency";
          this.loadAgencyInfo(params["id"]);
        }
      });
  }

  private loadAgencyInfo(agencyId: string) {
    //load from agency
    this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId).subscribe((agency: ModelAgency) => {
      this.agencyName = agency.name;

      //load from user public
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + agency.adminId).subscribe((user: ModelUserPublic) => {
        this.agencyAdminTitle = user.title;
        this.agencyAdminFirstName = user.firstName;
        this.agencyAdminLastName = user.lastName;
        this.agencyAdminTitle = user.title;
        this.agencyAdminEmail = user.email;
        this.emailInDatabase = user.email;
      });
    });

  }

  onSubmit() {
    if (this.validateForm()) {
      if (this.isEdit) {
        //TODO Update Info
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
    });
  }

  private updateNoEmailChange() {
    console.log("no email change");
    console.log("agencyId: " + this.agencyId);
    this.updateToFirebase();
    this.backToHome();
  }

  private updateToFirebase() {
    //update user
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.agencyId + "/firstName")
      .set(this.agencyAdminFirstName);
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.agencyId + "/lastName")
      .set(this.agencyAdminLastName);
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.agencyId + "/title")
      .set(this.agencyAdminTitle);
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.agencyId + "/email")
      .set(this.agencyAdminEmail);
    //update agency
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/name").set(this.agencyName);
  }

  private registerNewAgency() {
    console.log("start register new agency");
    let secondApp = firebase.initializeApp(firebaseConfig, "second");
    let tempPassword = "testtest";
    secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(x => {
      console.log("user " + x.uid + " created successfully");
      let uid: string = x.uid;
      this.writeToFirebase(uid);
      secondApp.auth().signOut();
    }, y => {
      console.log(y.message);
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
    //write to userPublic node
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + uid)
      .set(new ModelUserPublic(this.agencyAdminFirstName, this.agencyAdminLastName, null, 0, this.agencyAdminEmail));

    //write to administratorAgency node
    let systemAdminUid = "hoXTsvefEranzaSQTWbkhpBenLn2";
    this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + uid + "/systemAdmin/" + systemAdminUid).set(true);
    if (this.isEdit) {
      this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + uid + "/agencyId").set(this.agencyId);
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/adminId").set(uid);
    } else {
      this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + uid + "/agencyId").set(uid);
      //write to agency node with temp data
      let agency = new ModelAgency();
      agency.name = this.agencyName;
      agency.isActive = true;
      agency.adminId = uid;
      agency.logoPath = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIccywWWDQhnGZDG6P4g4A9pJfSF9k8Xmsknac5C0TO-w_axRH";
      this.af.database.object(Constants.APP_STATUS + "/agency/" + uid).set(agency);
    }
    //back to home page
    this.backToHome();
  }

  private backToHome() {
    this.router.navigateByUrl("/system-admin");
  }
}
