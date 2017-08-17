import {Component, OnDestroy, OnInit} from "@angular/core";
import {CustomerValidator} from "../../utils/CustomValidator";
import * as firebase from "firebase";
import {firebaseConfig} from "../../app.module";
import {AngularFire} from "angularfire2";
import {ModelUserPublic} from "../../model/user-public.model";
import {Constants} from "../../utils/Constants";
import {ModelAgency} from "../../model/agency.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mergeMap";
import {DurationType, Privacy} from "../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {UUID} from "../../utils/UUID";
import {ModuleSettingsModel} from "../../model/module-settings.model";
import {NotificationSettingsModel} from "../../model/notification-settings.model";
import {PageControlService} from "../../services/pagecontrol.service";

declare var jQuery: any;

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.css']
})

export class AddAgencyComponent implements OnInit, OnDestroy {

  private errorMessage: string;
  private inactive: boolean = true;
  private alerts = {};
  agencyName: string;
  agencyAdminTitle: number = 0;
  agencyAdminFirstName: string;
  agencyAdminLastName: string;
  agencyAdminEmail: string;
  agencyAdminAddressLine1: string;
  agencyAdminAddressLine2: string;
  agencyAdminAddressLine3: string;
  agencyAdminCountry: number;
  agencyAdminCity: string;
  agencyAdminPostCode: string;
  isEdit = false;
  Country = Constants.COUNTRIES;
  countryList: number[] = Constants.COUNTRY_SELECTION;
  PersonTitle = Constants.PERSON_TITLE;
  personTitleList: number[] = Constants.PERSON_TITLE_SELECTION;
  private emailInDatabase: string;
  private agencyId: string;
  private userPublic: ModelUserPublic;
  private adminId: string;
  private deleteAgency: any = {};
  private secondApp: firebase.app.App;
  private systemAdminUid: string;
  private preAgencyName: string;
  private isDonor: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.systemAdminUid = user.uid;
      this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
      this.inactive = true;
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.agencyId = params["id"];
            this.isEdit = true;
            this.loadAgencyInfo(params["id"]);
          }
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadAgencyInfo(agencyId: string) {
    //load from agency
    this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agency => {
        this.agencyName = agency.name;
        this.preAgencyName = agency.name;
        this.adminId = agency.adminId;
        this.isDonor = agency.isDonor;

        //load from user public
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + agency.adminId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            this.userPublic = new ModelUserPublic(user.firstName, user.lastName, user.title, user.email);
            this.userPublic.addressLine1 = user.addressLine1;
            this.userPublic.addressLine2 = user.addressLine2;
            this.userPublic.addressLine3 = user.addressLine3;
            this.userPublic.country = user.country;
            this.userPublic.city = user.city;
            this.userPublic.postCode = user.postCode;

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
    if (this.validate()) {
      if (this.isEdit) {
        this.updateAgencyInfo();
      } else {
        this.registerNewAgency();
      }
    } else {
      this.showAlert();
    }
  }

  donorSelected() {
    this.isDonor = true;
  }

  notDonorSelected() {
    this.isDonor = false;
  }

  private updateAgencyInfo() {
    console.log("update");
    console.log(this.agencyAdminEmail);
    console.log(this.emailInDatabase);
    console.log(this.isDonor);
    if (this.agencyAdminEmail == this.emailInDatabase) {
      this.updateNoEmailChange();
    } else {
      this.updateWithNewEmail();
    }
  }

  private updateWithNewEmail() {
    console.log("new email");
    // let secondApp = firebase.initializeApp(firebaseConfig, "second");
    let tempPassword = Constants.TEMP_PASSWORD;
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
    this.validateAgencyName();
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
      updateData["/agency/" + this.agencyId + "/isDonor"] = this.isDonor;

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
    if (this.preAgencyName && this.preAgencyName == this.agencyName) {
      this.updateToFirebase();
      return;
    }
    console.log("validate agency name");
    this.af.database.list(Constants.APP_STATUS + "/agency", {
      query: {
        orderByChild: "name",
        equalTo: this.agencyName
      }
    })
      .take(1)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyList => {
        if (agencyList.length == 0) {
          if (this.isEdit) {
            this.updateToFirebase();
          } else {
            console.log("create new user");
            this.createNewUser();
          }
        } else {
          this.errorMessage = "SYSTEM_ADMIN.AGENCIES.NAME_DUPLICATE";
          this.showAlert();
        }
      });
  }

  private createNewUser() {
    console.log("start register new agency");
    // let secondApp = firebase.initializeApp(firebaseConfig, "fourth");
    let tempPassword = Constants.TEMP_PASSWORD;
    this.secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(success => {
      console.log("user " + success.uid + " created successfully");
      let uid: string = success.uid;
      this.writeToFirebase(uid);
      // this.secondApp.auth().sendPasswordResetEmail(this.agencyAdminEmail);
      this.secondApp.auth().signOut();
    }, (error: any) => {
      console.log(error.message);
      console.log(error.code);
      if (error.code == 'auth/email-already-in-use') {
        this.errorMessage = "SYSTEM_ADMIN.AGENCIES.EMAIL_IN_USE_ERROR";
      } else {
        this.errorMessage = "GLOBAL.GENERAL_ERROR";
      }
      this.showAlert();
    });
  }

  private writeToFirebase(uid: string) {
    let agencyData = {};
    //write to userPublic node
    let newAgencyAdmin = new ModelUserPublic(this.agencyAdminFirstName, this.agencyAdminLastName,
      this.agencyAdminTitle, this.agencyAdminEmail);
    newAgencyAdmin.addressLine1 = this.agencyAdminAddressLine1 ? this.agencyAdminAddressLine1 : "";
    newAgencyAdmin.addressLine2 = this.agencyAdminAddressLine2 ? this.agencyAdminAddressLine2 : "";
    newAgencyAdmin.addressLine3 = this.agencyAdminAddressLine3 ? this.agencyAdminAddressLine3 : "";
    newAgencyAdmin.city = this.agencyAdminCity ? this.agencyAdminCity : "";
    newAgencyAdmin.country = this.agencyAdminCountry ? this.agencyAdminCountry : -1;
    newAgencyAdmin.postCode = this.agencyAdminPostCode ? this.agencyAdminPostCode : "";
    newAgencyAdmin.phone = "";
    agencyData["/userPublic/" + uid] = newAgencyAdmin;
    agencyData["/administratorAgency/" + uid + "/systemAdmin/" + this.systemAdminUid] = true;

    if (this.isEdit) {
      agencyData["/administratorAgency/" + uid + "/agencyId"] = this.agencyId;
      console.log(this.emailInDatabase + "/" + this.agencyAdminEmail);
      if (this.emailInDatabase != this.agencyAdminEmail) {
        agencyData["/administratorAgency/" + uid + "/firstLogin"] = true;
      }
      agencyData["/agency/" + this.agencyId + "/adminId"] = uid;
      agencyData["/agency/" + this.agencyId + "/isDonor"] = this.isDonor;
      //delete old node
      agencyData["/administratorAgency/" + this.adminId] = null;
      agencyData["/group/systemadmin/allagencyadminsgroup/" + this.adminId] = null;
      agencyData["/group/systemadmin/allusersgroup/" + this.adminId] = null;
      agencyData["/userPublic/" + this.adminId] = null;
      agencyData["/userPrivate/" + this.adminId] = null;

    } else {
      agencyData["/administratorAgency/" + uid + "/agencyId"] = uid;
      agencyData["/administratorAgency/" + uid + "/firstLogin"] = true;
      agencyData["/group/systemadmin/allagencyadminsgroup/" + uid] = true;
      agencyData["/group/systemadmin/allusersgroup/" + uid] = true;
      let agency = new ModelAgency(this.agencyName);
      agency.isDonor = this.isDonor;
      agency.isActive = true;
      agency.adminId = uid;

      //init notification settings
      let notificationList: NotificationSettingsModel[] = [];

      for (let i = 0; i < 6; i++) {
        let nofificationModel = new NotificationSettingsModel();
        nofificationModel.usersNotified = [];
        for (let i = 0; i < 8; i++) {
          nofificationModel.usersNotified.push(false);
        }
        notificationList.push(nofificationModel);
      }
      agency.notificationSetting = notificationList;


      // init clock settings
      let clockSetting = {};
      let prepareness = {};
      prepareness["durationType"] = DurationType.Year;
      prepareness["value"] = Constants.DEFAULT_CLOCK_SETTINGS_DURATION_VAL;
      clockSetting["preparedness"] = prepareness;
      let response = {};
      response["durationType"] = DurationType.Year;
      response["value"] = Constants.DEFAULT_CLOCK_SETTINGS_DURATION_VAL;
      clockSetting["responsePlans"] = prepareness;
      let validFor = {};
      validFor["durationType"] = DurationType.Year;
      validFor["value"] = Constants.DEFAULT_CLOCK_SETTINGS_DURATION_VAL;
      let logs = {};
      logs["durationType"] = DurationType.Year;
      logs["value"] = Constants.DEFAULT_CLOCK_SETTINGS_DURATION_VAL;
      let risk = {};
      risk["hazardsValidFor"] = validFor;
      risk["showLogsFrom"] = logs;
      clockSetting["riskMonitoring"] = risk;
      agency.clockSettings = clockSetting;

      //init response plan settings
      let hierarchy: boolean[] = [false, false];
      let sections: boolean[] = [true, true, true, true, true, true, true, true, true, true];
      let responseSetting = {};
      responseSetting["approvalHierachy"] = hierarchy;
      responseSetting["sections"] = sections;
      agency.responsePlanSettings = responseSetting;

      //actual model update
      agencyData["/agency/" + uid] = agency;

      //init module settings in different node
      let moduleList: ModuleSettingsModel[] = [];
      for (let i = 0; i < 6; i++) {
        let setting = new ModuleSettingsModel();
        setting.privacy = Privacy.Public;
        setting.status = true;
        moduleList.push(setting);
      }
      agencyData["/module/" + uid] = moduleList;

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

  // Deletion of an agency is no longer needed for the client
  // delete() {
  //   jQuery("#delete-agency").modal("show");
  // }
  //
  // deleteAgencyFromFirebase() {
  //   console.log("Delete agency button pressed");
  //
  //   if (this.agencyId && this.adminId) {
  //     //TODO delete agency (cant finish till whole system done)
  //     this.deleteAgency["/userPublic/" + this.adminId] = null;
  //     this.deleteAgency["/administratorAgency/" + this.adminId] = null;
  //     this.deleteAgency["/group/systemadmin/allagencyadminsgroup/" + this.adminId] = null;
  //     this.deleteAgency["/group/systemadmin/allusersgroup/" + this.adminId] = null;
  //     this.deleteAgency["/agency/" + this.agencyId] = null;
  //     this.deleteAgency["/messageRef/agencygroup/" + this.agencyId] = null;
  //     this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/sentmessages").subscribe(result => {
  //       result.forEach(item => {
  //         console.log(item.$key);
  //         this.deleteAgency["/message/" + item.$key] = null;
  //       });
  //       console.log(JSON.stringify(this.deleteAgency));
  //       this.af.database.object(Constants.APP_STATUS).update(this.deleteAgency).then(() => {
  //         console.log("Agency deleted");
  //         jQuery("#delete-agency").modal("hide");
  //         this.router.navigateByUrl(Constants.SYSTEM_ADMIN_HOME);
  //       }, error => {
  //         console.log(error.message);
  //       });
  //     })
  //   }
  // }
  //
  // closeModal() {
  //   jQuery("#delete-agency").modal("hide");
  // }

  private showAlert() {
    this.inactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.inactive = true;
      });
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validate() {

    if (!(this.agencyName)) {
      this.alerts[this.agencyName] = true;
      this.errorMessage = "SYSTEM_ADMIN.AGENCIES.NAME_MISSING";
      return false;
    } else if (!(this.agencyAdminFirstName)) {
      this.alerts[this.agencyAdminFirstName] = true;
      this.errorMessage = "SYSTEM_ADMIN.AGENCIES.F_NAME_MISSING";
      return false;
    } else if (!(this.agencyAdminLastName)) {
      this.alerts[this.agencyAdminLastName] = true;
      this.errorMessage = "SYSTEM_ADMIN.AGENCIES.L_NAME_MISSING";
      return false;
    } else if (!(this.agencyAdminEmail)) {
      this.alerts[this.agencyAdminEmail] = true;
      this.errorMessage = "SYSTEM_ADMIN.AGENCIES.EMAIL_MISSING";
      return false;
    } else if (!CustomerValidator.EmailValidator(this.agencyAdminEmail)) {
      this.alerts[this.agencyAdminEmail] = true;
      this.errorMessage = "SYSTEM_ADMIN.AGENCIES.EMAIL_INVALID";
      return false;
    }
    return true;
  }
}
