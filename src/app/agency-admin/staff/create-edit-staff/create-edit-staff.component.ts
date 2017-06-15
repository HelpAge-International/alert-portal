import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {SkillType, UserType} from "../../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {ModelUserPublic} from "../../../model/user-public.model";
import {firebaseConfig} from "../../../app.module";
import {UUID} from "../../../utils/UUID";
import * as firebase from "firebase";
import {ModelStaff} from "../../../model/staff.model";
import {AgencyService} from "../../../services/agency-service.service";
import {UserService} from "../../../services/user.service";
declare var jQuery: any;

@Component({
  selector: 'app-create-edit-staff',
  templateUrl: 'create-edit-staff.component.html',
  styleUrls: ['create-edit-staff.component.css'],
  providers: [AgencyService]
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

  Countries = Constants.COUNTRIES;

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

  private allSkills: any = {};
  private skillKeys: string[] = [];
  private editedSkills: any = [];
  private SupportSkill = SkillType.Support;
  private TechSkill = SkillType.Tech;


  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyId: string;
  private systemId: string;
  private regionOfficeList: string[];

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute, private agencyService: AgencyService, private userService: UserService) {
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
          this.af.database.list(Constants.APP_STATUS + "/region/" + this.uid, {
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

    this.agencyService.getAgencyId(this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyId => {
        this.agencyId = agencyId;
        this.agencyService.getSystemId(this.agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(systemId => {
            this.systemId = systemId;

            this.countryList = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId);
            this.regionList = this.af.database.list(Constants.APP_STATUS + "/region/" + this.agencyId);
            this.departmentList = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments")
              .map(departments => {
                let names = [];
                departments.forEach(department => {
                  names.push(department.$key);
                });
                return names;
              });

            this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/skills')
              .takeUntil(this.ngUnsubscribe)
              .subscribe(_ => {
                _.filter(skill => skill.$value).map(skill => {
                  this.af.database.list(Constants.APP_STATUS + '/skill/', {
                    query: {
                      orderByKey: true,
                      equalTo: skill.$key
                    }
                  })
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(_skill => {
                      if (_skill[0] != undefined)
                        this.allSkills[_skill[0].$key] = _skill[0];
                      else
                        delete this.allSkills[skill.$key];

                      this.skillKeys = Object.keys(this.allSkills);
                    });
                });
              });

            this.notificationList = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/notificationSetting");

          });
      });


  }

  validateForm():boolean {
    console.log("validate form");
    if (!this.title) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_TITLE";
      this.showAlert();
      return false;
    }
    else if (!this.firstName) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_FIRST_NAME";
      this.showAlert();
      return false;
    }
    else if (!this.lastName) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_LAST_NAME";
      this.showAlert();
      return false;
    }
    else if (!this.userType) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_USER_TYPE";
      this.showAlert();
      return false;
    }
    else if (!this.region && !this.hideRegion) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_REGION";
      this.showAlert();
      return false;
    }
    else if (!this.countryOffice && !this.hideCountry) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_COUNTRY_OFFICE";
      this.showAlert();
      return false;
    }
    else if (!this.department) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_DEPARTMENT";
      this.showAlert();
      return false;
    }
    else if (!this.position) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_POSITION";
      this.showAlert();
      return false;
    }
    else if (!this.officeType) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_OFFICE_TYPE";
      this.showAlert();
      return false;
    }
    else if (!this.email) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_EMAIL";
      this.showAlert();
      return false;
    }
    else if (!this.phone) {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_PHONE";
      this.showAlert();
      return false;
    }
    else if (typeof (this.isResponseMember) == "undefined") {
      this.waringMessage = "AGENCY_ADMIN.STAFF.NO_REPONSE_TEAM_ANSWER";
      this.showAlert();
      return false;
    }
    else {
      return true;
    }
  }

  submit() {

    if (!CustomerValidator.EmailValidator(this.email)) {
      this.waringMessage = "GLOBAL.EMAIL_NOT_VALID";
      this.showAlert();
      return;
    }
    if (!this.validateForm()) {
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
    staff.department = this.department;
    staff.position = this.position;
    staff.officeType = Number(this.officeType);
    staff.skill = this.staffSkills;
    staff.training = this.trainingNeeds ? this.trainingNeeds : "None";
    staff.notification = this.staffNotifications;
    staff.isResponseMember = this.isResponseMember;
    staff.updatedAt = Date.now();

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

    //push user group
    let userData = {};
    let agency = {};
    agency[this.agencyId] = true;
    userData["agencyAdmin"] = agency;
    if (!this.hideCountry) {
      userData["countryId"] = this.countryOffice.$key;
    } else if (!this.hideRegion) {
      userData["regionId"] = this.region.$key;
    }
    let system = {};
    system[this.systemId] = true;
    userData["systemAdmin"] = system;
    if (this.userType == UserType.CountryDirector) {
      staffData["/directorCountry/" + this.countryOffice.$key + "/"] = uid;
      staffData["/countryDirector/" + uid] = userData;
    } else if (this.userType == UserType.RegionalDirector) {
      staffData["/directorRegion/" + this.region.$key + "/"] = uid;
      staffData["/regionDirector/" + uid] = userData;
    } else if (this.userType == UserType.ErtLeader) {
      staffData["/ertLeader/" + uid] = userData;
    } else if (this.userType == UserType.Ert) {
      staffData["/ert/" + uid] = userData;
    } else if (this.userType == UserType.GlobalDirector) {
      staffData["/globalDirector/" + uid] = userData;
    } else if (this.userType == UserType.GlobalUser) {
      staffData["/globalUser/" + uid] = userData;
    } else if (this.userType == UserType.Donor) {
      staffData["/donor/" + uid] = userData;
    } else if (this.userType == UserType.NonAlert) {
      staffData["/nonAlert/" + uid] = userData;
    } else if (this.userType == UserType.CountryUser) {
      staffData["/countryUser/" + uid] = userData;
    }

    this.af.database.object(Constants.APP_STATUS).update(staffData).then(() => {
      if (!this.hideRegion) {
        this.updateDirectorRegion(uid, this.regionOfficeList);
      } else {
        this.router.navigateByUrl(Constants.AGENCY_ADMIN_STARFF);
      }
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
    } else if (this.userType == UserType.GlobalDirector || this.userType == UserType.GlobalUser || this.userType == UserType.CountryUser) {
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

  selectRegion() {
    console.log(this.region.$key);
    this.af.database.object(Constants.APP_STATUS + "/region/" + this.agencyId + "/" + this.region.$key)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(region => {
        this.regionOfficeList = Object.keys(region.countries);
      });
  }

  private updateDirectorRegion(regionalDirectorId: string, officeList: Array<any>) {
    let directorRegion = {};
    for (let office of officeList) {
      directorRegion["/directorRegion/" + office + "/"] = regionalDirectorId;
    }
    this.af.database.object(Constants.APP_STATUS).update(directorRegion).then(() => {
      this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
    }, error => {
      console.log(error.message);
    });
  }
}
