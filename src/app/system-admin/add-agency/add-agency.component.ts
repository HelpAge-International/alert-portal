import {Component, OnInit} from '@angular/core';
import {CustomerValidator} from "../../utils/CustomValidator";
import * as firebase from "firebase";
import {firebaseConfig} from "../../app.module";
import {AngularFire} from "angularfire2";
import {ModelUserPublic} from "../../model/user-public.model";

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

  constructor(private af: AngularFire) {
  }

  ngOnInit() {
    this.waringMessage = "warning message!!!";
    this.hideWarning = true;
  }

  onSubmit() {
    console.log("register new agency: " + this.agencyAdminEmail)
    if (this.validateForm()) {
      this.registerNewAgency();
    }
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
    this.af.database.object("/sand/userPublic/"+uid)
      .set(new ModelUserPublic(this.agencyAdminFirstName, this.agencyAdminLastName, null, 0));
  }
}
