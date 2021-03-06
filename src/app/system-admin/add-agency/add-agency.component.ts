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
import {DurationType, Privacy, UserType} from "../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {UUID} from "../../utils/UUID";
import {ModuleSettingsModel} from "../../model/module-settings.model";
import {NotificationSettingsModel} from "../../model/notification-settings.model";
import {PageControlService} from "../../services/pagecontrol.service";
import {UserService} from "../../services/user.service";
import {NetworkService} from "../../services/network.service";

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
  agencyAdminCountry: string;
  agencyAdminCity: string;
  agencyAdminPostCode: string;
  isEdit = false;
  Country = Constants.COUNTRIES;
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
  private isGlobalAgency: boolean = true;
  private country: string;

  COUNTRY = Constants.COUNTRIES;
  COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private userService: UserService,
              private networkService: NetworkService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      if (userType === UserType.SystemAdmin) {
        this.systemAdminUid = systemId;
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
      } else {
        this.router.navigateByUrl("/login")
      }
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

        //checks to see if isGlobal exists on the agency as old agencies may not have the property
        if (agency.hasOwnProperty('isGlobalAgency')) {
          this.isGlobalAgency = agency.isGlobalAgency;
        } else {
          this.isGlobalAgency = true
        }

        if (!this.isGlobalAgency) {
          this.country = this.COUNTRY[agency.countryCode];
        }

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
            this.agencyAdminCountry = this.COUNTRY[user.country];
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
    this.createNewUser()
    // let tempPassword = Constants.TEMP_PASSWORD;
    // console.log(this.agencyAdminEmail)
    // console.log(tempPassword)
    // this.secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(x => {
    //   console.log("user " + x.uid + " created successfully");
    //   let uid: string = x.uid;
    //   this.writeToFirebase(uid);
    //   this.secondApp.auth().signOut();
    // }, (error: any) => {
    //   console.log(error.message);
    //   console.log(error.code);
    //   if (error.code == 'auth/email-already-in-use') {
    //     this.errorMessage = "SYSTEM_ADMIN.AGENCIES.EMAIL_IN_USE_ERROR";
    //   } else {
    //     this.errorMessage = "GLOBAL.GENERAL_ERROR";
    //   }
    //   this.showAlert();
    // });
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
        this.userPublic.country = this.COUNTRY.indexOf(this.agencyAdminCountry);
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
      updateData["/agency/" + this.agencyId + "/isGlobalAgency"] = this.isGlobalAgency;
      if (!this.isGlobalAgency) {
        updateData["/agency/" + this.agencyId + "/countryCode"] = this.COUNTRY.indexOf(this.country);
      } else {
        updateData["/agency/" + this.agencyId + "/countryCode"] = null;
      }

      this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {
        this.backToHome();
      }, error => {
        console.log(error.message);
        this.errorMessage = "GLOBAL.GENERAL_ERROR";
        this.showAlert();
      });
    }
  }

  selectAgencyType(value) {
    this.isGlobalAgency = value;
    console.log(this.isGlobalAgency);
  }

  selectCountry() {
    console.log(this.country);
    console.log(this.COUNTRY.indexOf(this.country));
  }

  onSelectAgencyAdminCountry(){
    console.log(this.agencyAdminCountry);
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

    this.userService.getUserByEmail(this.agencyAdminEmail)
      .first()
      .subscribe(existUser => {
        if (!existUser) {
          let userId = this.networkService.generateKeyUserPublic()
          this.writeToFirebase(userId)
        } else {
          this.errorMessage = "Email is already exist!"
          this.showAlert();
        }
      }, err => {
        this.errorMessage = err.message;
        this.showAlert()
      })


    // let tempPassword = Constants.TEMP_PASSWORD;
    // this.secondApp.auth().createUserWithEmailAndPassword(this.agencyAdminEmail, tempPassword).then(success => {
    //   console.log("user " + success.uid + " created successfully");
    //   let uid: string = success.uid;
    //   this.writeToFirebase(uid);
    //   // this.secondApp.auth().sendPasswordResetEmail(this.agencyAdminEmail);
    //   this.secondApp.auth().signOut();
    // }, (error: any) => {
    //   console.log(error.message);
    //   console.log(error.code);
    //   if (error.code == 'auth/email-already-in-use') {
    //     this.errorMessage = "SYSTEM_ADMIN.AGENCIES.EMAIL_IN_USE_ERROR";
    //   } else {
    //     this.errorMessage = "GLOBAL.GENERAL_ERROR";
    //   }
    //   this.showAlert();
    // });
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
    newAgencyAdmin.country = this.COUNTRY.indexOf(this.agencyAdminCountry);
    newAgencyAdmin.postCode = this.agencyAdminPostCode ? this.agencyAdminPostCode : "";
    newAgencyAdmin.phone = "";
    agencyData["/userPublic/" + uid] = newAgencyAdmin;
    if (!this.isGlobalAgency) {
      agencyData["/administratorLocalAgency/" + uid + "/systemAdmin/" + this.systemAdminUid] = true;
    }
    agencyData["/administratorAgency/" + uid + "/systemAdmin/" + this.systemAdminUid] = true;

    if (this.isEdit) {
      if (!this.isGlobalAgency) {
        console.log('global agency??')
        agencyData["/administratorLocalAgency/" + uid + "/agencyId"] = this.agencyId;
      }
      agencyData["/administratorAgency/" + uid + "/agencyId"] = this.agencyId;
      console.log(this.emailInDatabase + "/" + this.agencyAdminEmail);
      if (this.emailInDatabase != this.agencyAdminEmail) {
        if (!this.isGlobalAgency) {
          agencyData["/administratorLocalAgency/" + uid + "/firstLogin"] = true;
        }
        agencyData["/administratorAgency/" + uid + "/firstLogin"] = true;
      }
      agencyData["/agency/" + this.agencyId + "/adminId"] = uid;
      agencyData["/agency/" + this.agencyId + "/isDonor"] = this.isDonor;
      agencyData["/agency/" + this.agencyId + "/isGlobalAgency"] = this.isGlobalAgency;
      if (!this.isGlobalAgency) {
        console.log('global agency??')
        agencyData["/agency/" + this.agencyId + "/countryCode"] = this.COUNTRY.indexOf(this.country);
      } else {
        agencyData["/agency/" + this.agencyId + "/countryCode"] = null;
      }
      //delete old node
      if (!this.isGlobalAgency) {
        agencyData["/administratorLocalAgency/" + this.adminId] = null;
      }
      agencyData["/administratorAgency/" + this.adminId] = null;
      agencyData["/group/systemadmin/allagencyadminsgroup/" + this.adminId] = null;
      agencyData["/group/systemadmin/allusersgroup/" + this.adminId] = null;
      agencyData["/userPublic/" + this.adminId] = null;
      agencyData["/userPrivate/" + this.adminId] = null;


    } else {
      if (!this.isGlobalAgency) {
        console.log('global agency??')
        agencyData["/administratorLocalAgency/" + uid + "/agencyId"] = uid;
      }
      agencyData["/administratorAgency/" + uid + "/agencyId"] = uid;
      agencyData["/administratorAgency/" + uid + "/firstLogin"] = true;
      agencyData["/group/systemadmin/allagencyadminsgroup/" + uid] = true;
      agencyData["/group/systemadmin/allusersgroup/" + uid] = true;
      let agency = new ModelAgency(this.agencyName);
      agency.isDonor = this.isDonor;
      agency.isActive = true;
      agency.adminId = uid;
      agency.isGlobalAgency = this.isGlobalAgency;
      if (!this.isGlobalAgency) {
        agency.countryCode = this.COUNTRY.indexOf(this.country);
      } else {
        agency.countryCode = null;
      }

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
      this.errorMessage = "GLOBAL.GENERAL_ERROR";
      this.showAlert();
    });
  }

  private backToHome() {
    this.router.navigateByUrl(Constants.SYSTEM_ADMIN_HOME);
  }

  cancelSubmit() {
    this.backToHome();
  }

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
