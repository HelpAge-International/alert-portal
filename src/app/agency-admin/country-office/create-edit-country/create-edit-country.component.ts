import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Countries, PersonTitle, UserType} from "../../../utils/Enums";
import {CustomerValidator} from "../../../utils/CustomValidator";
import * as firebase from "firebase";
import {firebaseConfig} from "../../../app.module";
import {ModelUserPublic} from "../../../model/user-public.model";
import {ModelCountryOffice} from "../../../model/countryoffice.model";
import {Observable, Subject} from "rxjs";
import {AgencyService} from "../../../services/agency-service.service";
import {PageControlService} from "../../../services/pagecontrol.service";

@Component({
  selector: 'app-create-edit-country',
  templateUrl: './create-edit-country.component.html',
  styleUrls: ['./create-edit-country.component.css'],
  providers: [AgencyService]
})
export class CreateEditCountryComponent implements OnInit, OnDestroy {

  countryNames = Constants.COUNTRIES;
  countrySelections = Constants.COUNTRY_SELECTION;
  titleNames = Constants.PERSON_TITLE;
  titleSelections = Constants.PERSON_TITLE_SELECTION;
  countryOfficeLocation: number;
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
  private preEmail: string;
  private preCountryOfficeLocation: number;
  private isUserChange: boolean;
  private tempAdminId: string;
  private alerts = {};

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyModuleSetting: {};
  private agencyClockSetting: {};
  private systemId: string;
  private agencyId: string;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute, private agencyService: AgencyService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.secondApp = firebase.initializeApp(firebaseConfig, "second");
      this.systemId = systemId;
      this.agencyId = agencyId;
      this.handleClockSettings(this.agencyId);
      this.handleModuleSettings(this.agencyId);

      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((param: Params) => {
          if (param["id"]) {
            this.countryOfficeId = param["id"];
            this.isEdit = true;
            this.loadCountryInfo(this.countryOfficeId);
          }
        });
    });
  }

  private handleClockSettings(uid: string) {
    this.agencyService.getAgency(uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agency => {
        this.agencyClockSetting = agency.clockSettings;
      });
  }

  private handleModuleSettings(uid: string) {
    this.agencyService.getAgencyModuleSetting(uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snapshot => {
        this.agencyModuleSetting = snapshot.val();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.secondApp.delete();
    this.agencyService.unSubscribeNow();
  }

  private loadCountryInfo(countryOfficeId: string) {
    console.log("edit: " + countryOfficeId);
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + countryOfficeId)
      .do(result => {
        console.log(result);
        this.countryOfficeLocation = result.location;
        this.preCountryOfficeLocation = result.location;
        this.tempAdminId = result.adminId;
      })
      .flatMap(result => {
        return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + result.adminId)
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        console.log(user);
        this.countryAdminTitle = user.title;
        this.countryAdminFirstName = user.firstName;
        this.countryAdminLastName = user.lastName;
        this.countryAdminEmail = user.email;
        //store for compare later
        this.preEmail = user.email;
        this.countryAdminAddress1 = user.addressLine1;
        this.countryAdminAddress2 = user.addressLine2;
        this.countryAdminAddress3 = user.addressLine3;
        this.countryAdminCountry = user.country;
        this.countryAdminCity = user.city;
        this.countryAdminPostcode = user.postCode;
      });
  }

  cancel() {
    this.backHome();
  }

  private backHome() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
  }

  submit() {
    console.log("submit");
    if (!this.validateForm()) {
      return;
    }
    if (this.isEdit) {
      this.updateCountryOffice();
    } else {
      this.createCountryOffice();
    }
  }

  validate() {
    console.log("validate form");
    if (this.countryOfficeLocation < 0) {
      this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.NAME_MISSING";
      this.showAlert();
      return;
    } else if (!this.countryAdminFirstName) {
      this.alerts[this.countryAdminFirstName] = true;
      this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.F_NAME_MISSING";
      this.showAlert();
      return;
    } else if (!this.countryAdminLastName) {
      this.alerts[this.countryAdminLastName] = true;
      this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.L_NAME_MISSING";
      this.showAlert();
      return;
    } else if (!this.countryAdminEmail) {
      this.alerts[this.countryAdminEmail] = true;
      this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.EMAIL_MISSING";
      this.showAlert();
      return;
    } else {
      this.hideWarning = true;
    }
  }

  private validateForm(): boolean {
    if (!CustomerValidator.EmailValidator(this.countryAdminEmail)) {
      this.waringMessage = "GLOBAL.EMAIL_NOT_VALID";
      this.showAlert();
      return false;
    } else {
      this.hideWarning = true;
      return true;
    }
  }

  private updateCountryOffice() {
    if (this.preEmail == this.countryAdminEmail) {
      this.updateNoEmailChange();
    } else {
      this.updateWithNewEmail();
    }
  }

  private updateNoEmailChange() {
    console.log("no email change");
    if (this.preCountryOfficeLocation == this.countryOfficeLocation) {
      console.log("location not change: " + this.countryOfficeId);
      this.updateFirebase(this.countryOfficeId);
    } else {
      console.log("check location");
      this.validateLocation();
    }
  }

  private updateWithNewEmail() {
    console.log("change with new email");
    this.isUserChange = true;
    if (this.preCountryOfficeLocation == this.countryOfficeLocation) {
      this.createNewUser();
    } else {
      this.validateLocation();
    }
  }

  private createCountryOffice() {
    this.validateLocation();
  }

  private validateLocation() {
    this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId, {
      query: {
        orderByChild: "location",
        equalTo: this.countryOfficeLocation
      }
    })
      .takeUntil(this.ngUnsubscribe)
      .take(1)
      .subscribe(result => {
        if (result.length != 0) {
          this.hideWarning = false;
          this.waringMessage = "AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_DUPLICATE_COUNTRY";
          return;
        }
        if (this.isEdit && this.isUserChange) {
          this.createNewUser();
        } else if (this.isEdit) {
          this.updateFirebase(this.countryOfficeId);
        } else {
          this.createNewUser();
        }
      });
  }

  private createNewUser() {
    console.log("create new user...");
    let tempPass = Constants.TEMP_PASSWORD;
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
    if (this.isEdit && this.isUserChange) {
      this.changeAdminAndUpdate(countryId);
    } else if (this.isEdit) {
      this.updateData(countryId)
    } else {
      this.writeNewData(countryId)
    }

  }

  private changeAdminAndUpdate(countryId: string) {
    console.log("change admin and update");

    let updateAdminData = {};
    let countryAdmin = new ModelUserPublic(this.countryAdminFirstName, this.countryAdminLastName,
      this.countryAdminTitle, this.countryAdminEmail);

    countryAdmin.addressLine1 = this.countryAdminAddress1 ? this.countryAdminAddress1 : "";
    countryAdmin.addressLine2 = this.countryAdminAddress2 ? this.countryAdminAddress2 : "";
    countryAdmin.addressLine3 = this.countryAdminAddress3 ? this.countryAdminAddress3 : "";
    countryAdmin.country = this.countryAdminCountry ? this.countryAdminCountry : -1;
    countryAdmin.city = this.countryAdminCity ? this.countryAdminCity : "";
    countryAdmin.postCode = this.countryAdminPostcode ? this.countryAdminPostcode : "";
    updateAdminData["/userPublic/" + countryId] = countryAdmin;

    updateAdminData["/administratorCountry/" + countryId + "/firstLogin"] = true;
    updateAdminData["/administratorCountry/" + countryId + "/agencyAdmin/" + this.agencyId] = true;
    updateAdminData["/administratorCountry/" + countryId + "/countryId"] = this.countryOfficeId;
    updateAdminData["/administratorCountry/" + countryId + "/systemAdmin/" + this.systemId] = true;

    // updateAdminData["/group/systemadmin/allcountryadminsgroup/" + countryId] = true;
    // updateAdminData["/group/agency/" + this.agencyId + "/countryadmins/" + countryId] = true;

    updateAdminData["/countryOffice/" + this.agencyId + "/" + this.countryOfficeId + "/adminId"] = countryId;
    updateAdminData["/countryOffice/" + this.agencyId + "/" + this.countryOfficeId + "/location"] = this.countryOfficeLocation;

    //previous admin data need to be removed
    updateAdminData["/userPublic/" + this.tempAdminId] = null;
    updateAdminData["/administratorCountry/" + this.tempAdminId] = null;
    // updateAdminData["/group/systemadmin/allcountryadminsgroup/" + this.tempAdminId] = null;
    // updateAdminData["/group/agency/" + this.agencyId + "/countryadmins/" + this.tempAdminId] = null;

    this.af.database.object(Constants.APP_STATUS).update(updateAdminData).then(() => {
      this.unassignIndicators(countryId);
    }, error => {
      this.hideWarning = false;
      this.waringMessage = error.message;
      console.log(error.message);
    });
  }

  private unassignIndicators(countryId : string) {
    console.log(Constants.APP_STATUS + "/indicator/"+this.countryOfficeId);
    this.af.database.list(Constants.APP_STATUS + "/indicator/"+this.countryOfficeId).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {indicators.forEach((indicator, index) => {
        this.af.database.object(Constants.APP_STATUS + "/indicator/" + this.countryOfficeId + "/" + indicator.$key + "/assignee").set(null).then(() => {
          this.backHome();
        }, error => {
          this.hideWarning = false;
          this.waringMessage = error.message;
          console.log(error.message);
        });
      });
    });
  }


  private updateData(countryId: string) {
    this.countryData = {};

    this.countryData["/userPublic/" + countryId + "/firstName/"] = this.countryAdminFirstName;
    this.countryData["/userPublic/" + countryId + "/lastName/"] = this.countryAdminLastName;
    this.countryData["/userPublic/" + countryId + "/title/"] = this.countryAdminTitle;
    this.countryData["/userPublic/" + countryId + "/email/"] = this.countryAdminEmail;
    this.countryData["/userPublic/" + countryId + "/addressLine1/"] = this.countryAdminAddress1;
    this.countryData["/userPublic/" + countryId + "/addressLine2/"] = this.countryAdminAddress2;
    this.countryData["/userPublic/" + countryId + "/addressLine3/"] = this.countryAdminAddress3;
    this.countryData["/userPublic/" + countryId + "/country/"] = this.countryAdminCountry;
    this.countryData["/userPublic/" + countryId + "/city/"] = this.countryAdminCity;
    this.countryData["/userPublic/" + countryId + "/postCode/"] = this.countryAdminPostcode;


    this.countryData["/administratorCountry/" + countryId + "/agencyAdmin/" + this.agencyId] = true;
    this.countryData["/administratorCountry/" + countryId + "/countryId/"] = countryId;

    // this.countryData["/group/systemadmin/allcountryadminsgroup/" + countryId] = true;
    // this.countryData["/group/agency/" + this.agencyId + "/countryadmins/" + countryId] = true;

    this.countryData["/countryOffice/" + this.agencyId + "/" + countryId + "/adminId/"] = countryId;
    this.countryData["/countryOffice/" + this.agencyId + "/" + countryId + "/location/"] = this.countryOfficeLocation;
    this.countryData["/countryOffice/" + this.agencyId + "/" + countryId + "/isActive/"] = true;

    this.af.database.object(Constants.APP_STATUS).update(this.countryData).then(() => {
      this.backHome();
    }, error => {
      console.log(error.message);
    });
  }

  private writeNewData(countryId: string) {

    this.countryData = {};

    let countryAdmin = new ModelUserPublic(this.countryAdminFirstName, this.countryAdminLastName,
      this.countryAdminTitle, this.countryAdminEmail);

    countryAdmin.addressLine1 = this.countryAdminAddress1 ? this.countryAdminAddress1 : "";
    countryAdmin.addressLine2 = this.countryAdminAddress2 ? this.countryAdminAddress2 : "";
    countryAdmin.addressLine3 = this.countryAdminAddress3 ? this.countryAdminAddress3 : "";
    countryAdmin.country = this.countryAdminCountry ? this.countryAdminCountry : -1;
    countryAdmin.city = this.countryAdminCity ? this.countryAdminCity : "";
    countryAdmin.postCode = this.countryAdminPostcode ? this.countryAdminPostcode : "";
    this.countryData["/userPublic/" + countryId] = countryAdmin;

    this.countryData["/administratorCountry/" + countryId + "/agencyAdmin/" + this.agencyId] = true;
    this.countryData["/administratorCountry/" + countryId + "/systemAdmin/" + this.systemId] = true;
    this.countryData["/administratorCountry/" + countryId + "/countryId"] = countryId;
    this.countryData["/administratorCountry/" + countryId + "/firstLogin"] = true;

    this.countryData["/group/systemadmin/allcountryadminsgroup/" + countryId] = true;
    this.countryData["/group/systemadmin/allusersgroup/" + countryId] = true;
    this.countryData["/group/agency/" + this.agencyId + "/countryadmins/" + countryId] = true;
    this.countryData["/group/agency/" + this.agencyId + "/agencyallusersgroup/" + countryId] = true;

    let countryOffice = new ModelCountryOffice();
    countryOffice.adminId = countryId;
    countryOffice.location = this.countryOfficeLocation;
    countryOffice.isActive = true;

    //init notification settings
    let notificationList = [];

    for (let i = 0; i < 6; i++) {
      if (i == 0) {
        let notifyList = [];
        let item1 = {};
        item1[UserType.RegionalDirector] = false;
        notifyList.push(item1);
        let item2 = {};
        item1[UserType.CountryDirector] = false;
        notifyList.push(item2);
        let item3 = {};
        item1[UserType.ErtLeader] = false;
        notifyList.push(item3);
        let item4 = {};
        item1[UserType.Ert] = false;
        notifyList.push(item4);
        let item5 = {};
        item1[UserType.Donor] = false;
        notifyList.push(item5);
        let item6 = {};
        item1[UserType.CountryAdmin] = false;
        notifyList.push(item6);
        let tempData = {};
        tempData["usersNotified"] = notifyList;
        notificationList.push(tempData);
      } else {
        let notifyList = [];
        let item1 = {};
        item1[UserType.RegionalDirector] = false;
        notifyList.push(item1);
        let item2 = {};
        item1[UserType.CountryDirector] = false;
        notifyList.push(item2);
        let item3 = {};
        item1[UserType.ErtLeader] = false;
        notifyList.push(item3);
        let item4 = {};
        item1[UserType.Ert] = false;
        notifyList.push(item4);
        let item5 = {};
        item1[UserType.Donor] = false;
        notifyList.push(item5);
        let tempData = {};
        tempData["usersNotified"] = notifyList;
        notificationList.push(tempData);
      }
    }
    countryOffice.defaultNotificationSettings = notificationList;

    //init permission settings
    let permissionSetting = {};
    //chs
    let chs = {};
    for (let i = 2; i < 6; i++) {
      chs[i] = true;
    }
    permissionSetting["chsActions"] = chs;

    //country contacts
    let countryContacts = {};
    let countryContactsDelete = {};
    let countryContactsEdit = {};
    let countryContactsNew = {};
    for (let i = 3; i < 6; i++) {
      countryContactsDelete[i] = true;
      countryContactsEdit[i] = true;
      countryContactsNew[i] = true;
    }
    countryContacts["delete"] = countryContactsDelete;
    countryContacts["edit"] = countryContactsEdit;
    countryContacts["new"] = countryContactsNew;
    permissionSetting["countryContacts"] = countryContacts;

    //cross country + notes + other
    let crossCountry = {};
    let crossCountryAddNotes = {};
    let crossCountryCopyAction = {};
    let crossCountryDownload = {};
    let crossCountryEdit = {};
    let crossCountryView = {};
    let crossCountryViewContacts = {};
    let notes = {};
    let notesDelete = {};
    let notesEdit = {};
    let notesNew = {};
    let other = {};
    let otherDownloadDoc = {};
    let otherUploadDoc = {};
    for (let i = 3; i < 7; i++) {
      crossCountryAddNotes[i] = true;
      crossCountryDownload[i] = true;
      notesDelete[i] = true;
      notesEdit[i] = true;
      notesNew[i] = true;
      otherDownloadDoc[i] = true;
      if (i != 6) {
        crossCountryCopyAction[i] = true;
        crossCountryEdit[i] = true;
        crossCountryView[i] = true;
        crossCountryViewContacts[i] = true;
        otherUploadDoc[i] = true;
      }
    }
    crossCountry["addNotes"] = crossCountryAddNotes;
    crossCountry["copyAction"] = crossCountryCopyAction;
    crossCountry["download"] = crossCountryDownload;
    crossCountry["edit"] = crossCountryEdit;
    crossCountry["view"] = crossCountryView;
    crossCountry["viewContacts"] = crossCountryViewContacts;
    permissionSetting["crossCountry"] = crossCountry;
    notes["delete"] = notesDelete;
    notes["edit"] = notesEdit;
    notes["new"] = notesNew;
    permissionSetting["notes"] = notes;
    other["downloadDoc"] = otherDownloadDoc;
    other["uploadDoc"] = otherUploadDoc;
    permissionSetting["other"] = other;

    //custom apa and mpa, mandated apa and mpa
    let customApa = {};
    let customApaAssign = {};
    let customApaDelete = {};
    let customApaEdit = {};
    let customApaNew = {};
    let customMpa = {};
    let customMpaAssign = {};
    let customMpaDelete = {};
    let customMpaEdit = {};
    let customMpaNew = {};
    let mandatedApaAssign = {};
    let mandatedMpaAssign = {};
    for (let i = 3; i < 6; i++) {
      customApaAssign[i] = true;
      customApaDelete[i] = true;
      customApaEdit[i] = true;
      customApaNew[i] = true;
      customMpaAssign[i] = true;
      customMpaDelete[i] = true;
      customMpaEdit[i] = true;
      customMpaNew[i] = true;
      mandatedApaAssign[i] = true;
      mandatedMpaAssign[i] = true;
    }
    customApa["assign"] = customApaAssign;
    customApa["delete"] = customApaDelete;
    customApa["edit"] = customApaEdit;
    customApa["new"] = customApaNew;
    permissionSetting["customApa"] = customApa;
    customMpa["assign"] = customMpaAssign;
    customMpa["delete"] = customMpaDelete;
    customMpa["edit"] = customMpaEdit;
    customMpa["new"] = customMpaNew;
    permissionSetting["customMpa"] = customMpa;
    permissionSetting["mandatedApaAssign"] = mandatedApaAssign;
    permissionSetting["mandatedMpaAssign"] = mandatedMpaAssign;

    //inter agency
    let interAgency = {};
    let interAgencyAddNotes = {};
    let interAgencyCopyAction = {};
    let interAgencyDownload = {};
    let interAgencyEdit = {};
    let interAgencyView = {};
    let interAgencyViewContacts = {};
    for (let i = 3; i < 7; i++) {
      interAgencyAddNotes[i] = true;
      interAgencyCopyAction[i] = true;
      interAgencyDownload[i] = true;
      interAgencyEdit[i] = true;
      interAgencyView[i] = true;
      interAgencyViewContacts[i] = true;
    }
    interAgency["addNotes"] = interAgencyAddNotes;
    interAgency["copyAction"] = interAgencyCopyAction;
    interAgency["download"] = interAgencyDownload;
    interAgency["edit"] = interAgencyEdit;
    interAgency["view"] = interAgencyView;
    interAgency["viewContacts"] = interAgencyViewContacts;
    permissionSetting["interAgency"] = interAgency;

    countryOffice.permissionSettings = permissionSetting;

    //copy clock settings and module settings
    if (this.agencyClockSetting) {
      countryOffice.clockSettings = this.agencyClockSetting;
    }
    if (this.agencyModuleSetting) {
      this.countryData["/module/" + countryId] = this.agencyModuleSetting;
    }

    //actual model update
    this.countryData["/countryOffice/" + this.agencyId + "/" + countryId] = countryOffice;

    this.af.database.object(Constants.APP_STATUS).update(this.countryData).then(() => {
      this.backHome();
    }, error => {
      console.log(error.message);
    });
  }

  private showAlert() {
    this.hideWarning = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.hideWarning = true;
    });
  }
}
