import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Country, SkillType, UserType} from "../../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {ModelUserPublic} from "../../../model/user-public.model";
import {firebaseConfig} from "../../../app.module";
import {UUID} from "../../../utils/UUID";
import * as firebase from "firebase";
import {ModelStaff} from "../../../model/staff.model";
declare var jQuery: any;

@Component({
  selector: 'app-create-edit-staff',
  templateUrl: 'create-edit-staff.component.html',
  styleUrls: ['create-edit-staff.component.css']
})

export class CreateEditStaffComponent implements OnInit, OnDestroy {

  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION = Constants.USER_TYPE_SELECTION;
  STAFF_POSITION = Constants.STAFF_POSITION;
  STAFF_POSITION_SELECTION = Constants.STAFF_POSITION_SELECTION;
  OFFICE_TYPE = Constants.OFFICE_TYPE;
  OFFICE_TYPE_SELECTION = Constants.OFFICE_TYPE_SELECTION;
  NOTIFICATION_SETTINGS = Constants.NOTIFICATION_SETTINGS;

  Country = Country;

  title: number;
  firstName: string;
  lastName: string;
  userType: number;
  countryOffice: any;
  region: any;
  department: string;
  position: string;
  officeType: number;
  email: string;
  phone: string;
  skills: string[] = [];
  trainingNeeds: string;
  notifications: number[] = [];
  isResponseMember: boolean;

  hideWarning: boolean = true;
  hideRegion: boolean = true;
  hideCountry: boolean = false;
  private uid: string;
  private waringMessage: string;
  private countryList: FirebaseListObservable<any[]>;
  private regionList: FirebaseListObservable<any[]>;
  private departmentList: Observable<any[]>;
  private supportSkillList: FirebaseListObservable<any[]>;
  private techSkillsList: FirebaseListObservable<any[]>;
  private notificationList: FirebaseListObservable<any[]>;
  private notificationSettings: boolean[] = [];
  private secondApp: firebase.app.App;
  private skillsMap = new Map();
  private staffSkills: string[] = [];
  private notificationsMap = new Map();
  private staffNotifications: number[] = [];
  private selectedStaffId: string;
  private isEdit: boolean;
  private selectedOfficeId: string;
  private emailInDatabase: string;
  private isUpdateOfficeOnly: boolean;
  private isEmailChange: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
      this.initData();
      this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
        if (params["id"]) {
          this.selectedStaffId = params["id"];
          this.selectedOfficeId = params["officeId"];
          this.isEdit = true;
          this.loadStaffInfo(this.selectedStaffId, this.selectedOfficeId);
        }
      });
    });
  }

  ngOnDestroy() {
    this.secondApp.delete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadStaffInfo(staffId: string, officeId: string) {
    console.log("load staff info: " + staffId + "/ " + officeId);
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staffId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        // console.log(user);
        this.title = user.title;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.emailInDatabase = user.email;
        this.phone = user.phone;
      });

    let path = officeId != "null" ? Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId : Constants.APP_STATUS + "/staff/globalUser/" + this.uid + "/" + staffId;

    this.af.database.object(path)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(staff => {
        this.userType = staff.userType;
        this.checkUserType();
        this.department = staff.department;
        this.position = staff.position;
        this.officeType = staff.officeType;
        if (staff.skill && staff.skill.length > 0) {
          for (let skill of staff.skill) {
            this.skillsMap.set(skill, true);
          }
        }
        this.trainingNeeds = staff.training;
        this.isResponseMember = staff.isResponseMember;
        if (staff.notification && staff.notification.length > 0) {
          for (let notification of staff.notification) {
            this.notificationSettings[Number(notification)] = true;
            this.notificationsMap.set(Number(notification), true);
          }
        }
        if (staff.userType == UserType.RegionalDirector) {
          let subscription = this.af.database.list(Constants.APP_STATUS + "/region/" + this.uid, {
            query: {
              orderByChild: "directorId",
              equalTo: staffId,
              limitToFirst: 1
            }
          })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(regions => {
              this.region = regions[0];
            });
        }
      });

    if (officeId != "null") {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.uid + "/" + officeId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(x => {
          this.countryOffice = x;
        });
    }
  }

  private initData() {
    this.countryList = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid);
    this.regionList = this.af.database.list(Constants.APP_STATUS + "/region/" + this.uid);
    this.departmentList = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
      .map(departments => {
        let names = [];
        departments.forEach(department => {
          names.push(department.$key);
        });
        return names;
      });
    this.supportSkillList = this.af.database.list(Constants.APP_STATUS + "/skill", {
      query: {
        orderByChild: "type",
        equalTo: SkillType.Support
      }
    });
    this.techSkillsList = this.af.database.list(Constants.APP_STATUS + "/skill", {
      query: {
        orderByChild: "type",
        equalTo: SkillType.Tech
      }
    });
    this.notificationList = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/notificationSetting");
  }

  validateForm() {
    console.log("validate form");
    if (!this.title) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_TITLE";
      this.showAlert();
      return;
    }
    if (!this.firstName) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_FIRST_NAME";
      this.showAlert();
      return;
    }
    if (!this.lastName) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_LAST_NAME";
      this.showAlert();
      return;
    }
    if (!this.userType) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_USER_TYPE";
      this.showAlert();
      return;
    }
    if (!this.region && !this.hideRegion) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_REGION";
      this.showAlert();
      return;
    }
    if (!this.countryOffice && !this.hideCountry) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_COUNTRY_OFFICE";
      this.showAlert();
      return;
    }
    if (!this.department) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_DEPARTMENT";
      this.showAlert();
      return;
    }
    if (!this.position) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_POSITION";
      this.showAlert();
      return;
    }
    if (!this.officeType) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_OFFICE_TYPE";
      this.showAlert();
      return;
    }
    if (!this.email) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_EMAIL";
      this.showAlert();
      return;
    }
    if (!this.phone) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_PHONE";
      this.showAlert();
      return;
    }
    if (typeof (this.isResponseMember) == "undefined") {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_REPONSE_TEAM_ANSWER";
      this.showAlert();
      return;
    }
  }

  submit() {

    if (!CustomerValidator.EmailValidator(this.email)) {
      this.waringMessage = "GLOBAL.EMAIL_NOT_VALID";
      this.showAlert();
      return;
    }
    console.log("submit");
    this.collectData();
  }

  private collectData() {
    this.skillsMap.forEach((value, key) => {
      if (value) {
        this.staffSkills.push(key);
      }
    });
    this.notificationsMap.forEach((value, key) => {
      if (value) {
        this.staffNotifications.push(Number(key));
      }
    });
    if (!this.isEdit) {
      if (this.userType != UserType.NonAlert) {
        this.createNewUser();
      } else {
        this.createNonAlertUser();
      }
    } else {
      console.log("edit");
      if (this.emailInDatabase == this.email) {
        this.updateNoEmailChange();
      } else if (this.emailInDatabase == this.email && this.countryOffice && this.countryOffice.$key != this.selectedOfficeId) {
        this.updateOfficeChange();
      } else {
        this.updateWithNewEmail();
      }
    }
  }

  private createNonAlertUser() {
    let key = firebase.database().ref(Constants.APP_STATUS).push().key;
    console.log("Non-alert user key: " + key);
    this.updateFirebase(key);
  }

  private updateOfficeChange() {
    console.log("no new email but new office");
    this.isUpdateOfficeOnly = true;
    this.updateFirebase(this.selectedStaffId);
  }

  private updateWithNewEmail() {
    console.log("new email new user");
    this.isEmailChange = true;
    this.createNewUser();
  }

  private updateNoEmailChange() {
    console.log("no email change no office change");
    this.updateFirebase(this.selectedStaffId);
  }

  private createNewUser() {
    this.secondApp.auth().createUserWithEmailAndPassword(this.email, Constants.TEMP_PASSWORD).then(newUser => {
      console.log(newUser.uid + " was successfully created");
      this.updateFirebase(newUser.uid);
      this.secondApp.auth().signOut();
    }, error => {
      this.waringMessage = error.message;
      this.showAlert();
    });
  }

  private updateFirebase(uid) {
    console.log("update - country office:");
    console.log(this.countryOffice);
    let staffData = {};
    //user public
    let user = new ModelUserPublic(this.firstName, this.lastName, this.title, this.email);
    user.phone = this.phone;
    user.country = -1;
    user.addressLine1 = "";
    user.addressLine2 = "";
    user.addressLine3 = "";
    user.city = "";
    user.postCode = "";
    staffData["/userPublic/" + uid + "/"] = user;
    //add to group
    staffData["/group/systemadmin/allusersgroup/" + uid + "/"] = true;
    staffData["/group/agency/" + this.uid + "/agencyallusersgroup/" + uid + "/"] = true;
    staffData["/group/agency/" + this.uid + "/" + Constants.GROUP_PATH_AGENCY[this.userType - 1] + "/" + uid + "/"] = true;
    //staff extra info
    let staff = new ModelStaff();
    staff.userType = Number(this.userType);
    // if (!this.hideRegion) {
    //   staff.region = this.region;
    // }
    // if (!this.hideCountry) {
    //   staff.countryOffice = this.countryOffice.$key;
    // }
    staff.department = this.department;
    staff.position = this.position;
    staff.officeType = Number(this.officeType);
    staff.skill = this.staffSkills;
    staff.training = this.trainingNeeds ? this.trainingNeeds : "None";
    staff.notification = this.staffNotifications;
    staff.isResponseMember = this.isResponseMember;
    if (this.isUpdateOfficeOnly) {
      staffData["/staff/" + this.selectedOfficeId + "/" + uid + "/"] = null;
    }

    if (!this.hideCountry) {
      staffData["/staff/" + this.countryOffice.$key + "/" + uid + "/"] = staff;
    } else if (!this.hideRegion) {
      staffData["/staff/globalUser/" + this.uid + "/" + uid + "/"] = staff;
      staffData["/region/" + this.uid + "/" + this.region.$key + "/directorId"] = uid;
    } else {
      staffData["/staff/globalUser/" + this.uid + "/" + uid + "/"] = staff;
    }

    if (this.isEmailChange) {
      staffData["/userPublic/" + this.selectedStaffId + "/"] = null;
      if (!this.hideCountry) {
        staffData["/staff/" + this.selectedOfficeId + "/" + this.selectedStaffId + "/"] = null;
      } else {
        staffData["/staff/globalUser/" + this.uid + "/" + this.selectedStaffId + "/"] = null;
      }
    }

    if (this.userType == UserType.CountryDirector) {
      staffData["/directorCountry/" + this.countryOffice.$key + "/"] = uid;
    }

    this.af.database.object(Constants.APP_STATUS).update(staffData).then(() => {
      this.router.navigateByUrl(Constants.AGENCY_ADMIN_STARFF);
    }, error => {
      this.waringMessage = error.message;
      this.showAlert();
    });
  }

  selectedUserType(userType) {
    //userType-1 to ignore first all option
    this.notificationSettings = [];
    this.notificationList
      .takeUntil(this.ngUnsubscribe)
      .first()
      .subscribe(settingList => {
        settingList.forEach(setting => {
          this.notificationSettings.push(setting.usersNotified[userType - 1]);
          this.notificationsMap.set(Number(setting.$key), setting.usersNotified[userType - 1]);
        });
      });
    console.log(this.userType);
    this.checkUserType();
  }

  private checkUserType() {
    if (this.userType == UserType.RegionalDirector) {
      this.hideCountry = true;
      this.hideRegion = false;
    } else if (this.userType == UserType.GlobalDirector || this.userType == UserType.GlobalUser) {
      this.hideCountry = true;
      this.hideRegion = true;
    } else {
      this.hideCountry = false;
      this.hideRegion = true;
    }
  }

  supportSkillCheck(skill, isCheck) {
    this.skillsMap.set(skill.$key, isCheck);
  }

  techSkillCheck(skill, isCheck) {
    this.skillsMap.set(skill.$key, isCheck);
  }

  notificationCheck(notification, isCheck) {
    this.notificationsMap.set(Number(notification.$key), isCheck);
  }

  cancel() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_STARFF);
  }

  private showAlert() {
    this.hideWarning = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.hideWarning = true;
    });
  }

  deleteStaff() {
    console.log("delete staff:" + this.selectedOfficeId + "/" + this.selectedStaffId);
    jQuery("#delete-action").modal("show");
  }

  closeModal() {
    jQuery("#delete-action").modal("hide");
  }

  deleteAction() {
    jQuery("#delete-action").modal("hide");
    let delData = {};
    delData["/userPublic/" + this.selectedStaffId + "/"] = null;
    delData["/staff/" + this.selectedOfficeId + "/" + this.selectedStaffId + "/"] = null;

    delData["/group/systemadmin/allusersgroup/" + this.selectedStaffId + "/"] = null;
    delData["/group/agency/" + this.uid + "/agencyallusersgroup/" + this.selectedStaffId + "/"] = null;
    delData["/group/agency/" + this.uid + "/" + Constants.GROUP_PATH_AGENCY[this.userType - 1] + "/" + this.selectedStaffId + "/"] = null;

    this.af.database.object(Constants.APP_STATUS).update(delData).then(() => {
      this.router.navigateByUrl(Constants.AGENCY_ADMIN_STARFF);
    }, error => {
      this.waringMessage = error.message;
      this.showAlert();
    });
  }
}
