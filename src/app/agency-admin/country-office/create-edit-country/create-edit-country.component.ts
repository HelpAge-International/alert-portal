import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {RxHelper} from "../../../utils/RxHelper";
import {Country, PersonTitle} from "../../../utils/Enums";
import {CustomerValidator} from "../../../utils/CustomValidator";
import * as firebase from "firebase";
import {firebaseConfig} from "../../../app.module";
import {ModelUserPublic} from "../../../model/user-public.model";
import {ModelCountryOffice} from "../../../model/countryoffice.model";

@Component({
  selector: 'app-create-edit-country',
  templateUrl: './create-edit-country.component.html',
  styleUrls: ['./create-edit-country.component.css']
})
export class CreateEditCountryComponent implements OnInit,OnDestroy {
  subscriptions: RxHelper;
  countryNames = Constants.COUNTRY;
  countrySelections = Constants.COUNTRY_SELECTION;
  titleNames = Constants.PERSON_TITLE;
  titleSelections = Constants.PERSON_TITLE_SELECTION;
  countryOfficeLocation: number = Country.UK;
  countryAdminTitle: number = PersonTitle.Mr;
  countryAdminFirstName: string;
  countryAdminLastName: string;
  countryAdminEmail: string;
  countryAdminAddress1: string;
  countryAdminAddress2: string;
  countryAdminAddress3: string;
  countryAdminCountry: number;
  countryAdminCity: string;
  countryAdminPostcode: string;
  hideWarning: boolean = true;
  waringMessage: string;
  isEdit: boolean = false;
  private uid: string;
  private secondApp: firebase.app.App;
  private countryData: {};
  private countryOfficeId: string;


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
      this.secondApp = firebase.initializeApp(firebaseConfig, "second");
      let subscription = this.route.params.subscribe((param: Params) => {
        if (param["id"]) {
          this.countryOfficeId = param["id"];
          this.isEdit = true;
          this.loadCountryInfo(this.countryOfficeId);
        }
      });
      this.subscriptions.add(subscription);
    });
    this.subscriptions.add(subscription);
  }

  private loadCountryInfo(countryOfficeId: string) {
    console.log("edit: "+countryOfficeId);
    this.af.database.object(Constants.APP_STATUS+"/countryOffice/"+this.uid+"/"+countryOfficeId+"/adminId")
      .flatMap(id => {
        return this.af.database.object(Constants.APP_STATUS+"/userPublic/"+id.$value)
      })
      .subscribe(user => {
        this.countryAdminTitle = user.title;
        this.countryAdminFirstName = user.firstName;
        this.countryAdminLastName = user.lastName;
        this.countryAdminEmail = user.email;
        console.log(user)
      })
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
    this.secondApp.delete();
  }

  cancel() {
    this.backHome();
  }

  private backHome() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
  }

  submit() {
    if (!this.validateForm()) {
      return;
    }
    if (this.isEdit) {
      this.updateCountryOffice();
    } else {
      this.createCountryOffice();
    }
    // this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
  }

  private validateForm(): boolean {
    if (!CustomerValidator.EmailValidator(this.countryAdminEmail)) {
      this.hideWarning = false;
      this.waringMessage = "ERROR.EMAIL_NOT_VALID";
      return false;
    } else {
      this.hideWarning = true;
      return true;
    }
  }

  private updateCountryOffice() {

  }

  private createCountryOffice() {
    this.validateLocation();
  }

  private validateLocation() {
    let subscription = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid, {
      query: {
        orderByChild: "location",
        equalTo: this.countryOfficeLocation
      }
    }).subscribe(result => {
      if (result.length != 0) {
        this.hideWarning = false;
        this.waringMessage = "ERROR.COUNTRY_DUPLICATE";
        return;
      }
      this.createNewUser();
    });
    this.subscriptions.add(subscription);
  }

  private createNewUser() {
    console.log("create new user...");
    let tempPass = "testtest";
    this.secondApp.auth().createUserWithEmailAndPassword(this.countryAdminEmail, tempPass).then(success => {
      console.log(success.uid + " was successfully created");
      let countryId = success.uid;
      this.updateFirebase(countryId);
      this.secondApp.auth().signOut();
    }, error => {
      console.log(error.message);
      this.waringMessage = error.message;
      this.hideWarning = false;
    })
  }

  private updateFirebase(countryId: string) {
    this.countryData = {};

    let countryAdmin = new ModelUserPublic(this.countryAdminFirstName, this.countryAdminLastName,
      this.countryAdminTitle, this.countryAdminEmail);
    countryAdmin.addressLine1 = this.countryAdminAddress1;
    countryAdmin.addressLine2 = this.countryAdminAddress2;
    countryAdmin.addressLine3 = this.countryAdminAddress3;
    countryAdmin.country = this.countryAdminCountry;
    countryAdmin.city = this.countryAdminCity;
    countryAdmin.postCode = this.countryAdminPostcode;
    this.countryData["/userPublic/" + countryId] = countryAdmin;

    this.countryData["/administratorCountry/" + countryId + "/agencyAdmin/"+this.uid] = true;
    this.countryData["/administratorCountry/" + countryId + "/countryId"] = countryId;

    this.countryData["/group/countrygroup/" + countryId] = true;

    let countryOffice = new ModelCountryOffice();
    countryOffice.adminId = countryId;
    countryOffice.location = this.countryOfficeLocation;
    countryOffice.isActive = true;
    this.countryData["/countryOffice/" + this.uid + "/" + countryId] = countryOffice;

    this.af.database.object(Constants.APP_STATUS).update(this.countryData).then(() => {
      this.backHome();
    }, error => {
      console.log(error.message);
    });
  }
}
