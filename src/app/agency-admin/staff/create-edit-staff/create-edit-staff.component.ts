import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {NotificationSettingEvents, OfficeType, SkillType, UserType} from "../../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {ModelUserPublic} from "../../../model/user-public.model";
import {firebaseConfig} from "../../../app.module";
import {UUID} from "../../../utils/UUID";
import * as firebase from "firebase";
import {ModelStaff} from "../../../model/staff.model";
import {AgencyService} from "../../../services/agency-service.service";
import {UserService} from "../../../services/user.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ModelDepartment} from "../../../model/department.model";

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
  STAFF_POSITION = Constants.STAFF_POSITION;
  STAFF_POSITION_SELECTION = Constants.STAFF_POSITION_SELECTION;
  OFFICE_TYPE = Constants.OFFICE_TYPE;
  NOTIFICATION_SETTINGS = Constants.NOTIFICATION_SETTINGS;
  UserType = UserType;
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
  isFirstLogin: boolean;

  hideWarning: boolean = true;
  hideRegion: boolean = true;
  hideCountry: boolean = false;

  private uid: string;
  private waringMessage: string;
  private originalCountryList: any [];
  private countryList: any [];
  private directorCountries: any [];
  private userTypeSelection: any [];
  private officeTypes: any [];

  private regionList: Observable<any[]>;
  private departmentList: Observable<ModelDepartment[]>;
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

  private isDonor: boolean = false;

  private editInitialUserType: UserType;
  private isUserTypeChange: boolean;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
      this.agencyId = agencyId;
      this.systemId = systemId;
      this.initData();
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

    let path = officeId != "null" ? Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId : Constants.APP_STATUS + "/staff/globalUser/" + this.agencyId + "/" + staffId;

    this.af.database.object(path)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(staff => {
        this.userType = staff.userType;
        this.editInitialUserType = staff.userType;
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
          this.af.database.list(Constants.APP_STATUS + "/region/" + this.agencyId, {
            query: {
              orderByChild: "directorId",
              equalTo: staffId,
              limitToFirst: 1
            }
          })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(regions => {
              this.regionList = this.af.database.list(Constants.APP_STATUS + "/region/" + this.agencyId)
                .map(region => {
                  let filteredRegions = [];
                  region.forEach(item => {
                    if (item.directorId == "null" || (item.$key == regions[0].$key)) {
                      filteredRegions.push(item);
                      if (item.$key == regions[0].$key) {
                        this.region = item;
                      }
                    }
                  });
                  return filteredRegions;
                });
            });
        }
      });

    if (officeId != "null") {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + officeId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(x => {
          this.countryOffice = x;
        });
    }

    this.userService.getUserType(staffId).subscribe(userType => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + '/' + staffId + '/firstLogin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe(value => {
          this.isFirstLogin = value.$value;
        })
    });
  }

  private initData() {
    this.officeTypes = [];
    Constants.OFFICE_TYPE_SELECTION.forEach(officeType => {
      if (officeType != OfficeType.All) {
        this.officeTypes.push(officeType);
      }
    });

    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/isDonor", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.isDonor = snap.val();
        this.userTypeSelection = [];
        Constants.USER_TYPE_SELECTION.forEach(userType => {
          if (userType != UserType.All && userType != UserType.CountryAdmin && userType != UserType.Donor) {
            this.userTypeSelection.push(userType);
          }
        });

        if (this.isDonor) {
          this.userTypeSelection.push(UserType.Donor);
        }
      });

    this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countries => {
        this.countryList = countries;
        this.originalCountryList = countries;

        this.af.database.list(Constants.APP_STATUS + "/directorCountry")
          .takeUntil(this.ngUnsubscribe)
          .subscribe(directorCountries => {
            this.directorCountries = directorCountries;
          });
      });

    this.regionList = this.af.database.list(Constants.APP_STATUS + "/region/" + this.agencyId)
      .map(region => {
        let filteredRegions = [];
        region.forEach(item => {
          if (item.directorId == "null") {
            filteredRegions.push(item);
          }
        });
        return filteredRegions;
      });

    this.departmentList = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .map(departments => {
        let names: ModelDepartment[] = [];
        departments.forEach(department => {
          names.push(ModelDepartment.create(department.key, department.val().name));
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


    this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
      if (params["id"]) {
        this.selectedStaffId = params["id"];
        this.selectedOfficeId = params["officeId"];
        this.isEdit = true;

        this.loadStaffInfo(this.selectedStaffId, this.selectedOfficeId);
      }
    });

  }

  validateForm(): boolean {
    console.log("validate form");
    if (!this.title) {
      this.waringMessage = "GLOBAL.ACCOUNT_SETTINGS.NO_TITLE";
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
      this.waringMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_ERROR";
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

  private updateWithNewEmail() {
    console.log("new email new user");
    this.isEmailChange = true;
    this.createNewUser();
  }

  private updateNoEmailChange() {
    console.log("no email change no office change");
    if (this.countryOffice && this.countryOffice.$key != this.selectedOfficeId) {
      this.isUpdateOfficeOnly = true;
    }
    if (this.editInitialUserType != this.userType) {
      this.isUserTypeChange = true;
    }
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
    staffData["/group/agency/" + this.agencyId + "/agencyallusersgroup/" + uid + "/"] = true;
    console.log("group path: " + (this.userType - 1) + "/" + Constants.GROUP_PATH_AGENCY[this.userType - 1]);
    staffData["/group/agency/" + this.agencyId + "/" + Constants.GROUP_PATH_AGENCY[this.userType - 1] + "/" + uid + "/"] = true;
    if (this.userType == UserType.CountryDirector || this.userType == UserType.CountryAdmin || this.userType == UserType.ErtLeader || this.userType == UserType.Ert || this.userType == UserType.Donor) {
      staffData["/group/country/" + this.countryOffice.$key + "/countryallusersgroup/" + uid + "/"] = true;
      staffData["/group/country/" + this.countryOffice.$key + "/" + Constants.GROUP_PATH_AGENCY[this.userType - 1] + "/" + uid + "/"] = true;
    }
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
      staffData["/staff/globalUser/" + this.agencyId + "/" + uid + "/"] = staff;
      staffData["/region/" + this.agencyId + "/" + this.region.$key + "/directorId"] = uid;
    } else {
      staffData["/staff/globalUser/" + this.agencyId + "/" + uid + "/"] = staff;
    }

    if (this.isEmailChange) {
      staffData["/userPublic/" + this.selectedStaffId + "/"] = null;
      if (!this.hideCountry) {
        staffData["/staff/" + this.selectedOfficeId + "/" + this.selectedStaffId + "/"] = null;
      } else {
        staffData["/staff/globalUser/" + this.agencyId + "/" + this.selectedStaffId + "/"] = null;
      }
    }

    //push user group
    let userData = {};
    let agency = {};
    agency[this.agencyId] = true;
    userData["agencyAdmin"] = agency;

    if (!this.isEdit) {
      userData["firstLogin"] = true;
    } else {
      if (this.isEmailChange) {
        userData["firstLogin"] = true;
      } else {
        if (this.isFirstLogin != null) {
          userData["firstLogin"] = this.isFirstLogin;
        }
      }
    }

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

    //update userType status
    if (this.isUserTypeChange) {
      if (this.editInitialUserType === UserType.CountryDirector) {
        staffData["/directorCountry/" + this.countryOffice.$key] = null;
        staffData["/countryDirector/" + uid] = null;
      } else if (this.editInitialUserType === UserType.RegionalDirector) {
        staffData["/directorRegion/" + this.region.$key] = null;
        staffData["/regionDirector/" + uid] = null;
        // staffData["/globalUser/" + this.agencyId + "/" + uid] = null;
      } else if (this.editInitialUserType == UserType.ErtLeader) {
        staffData["/ertLeader/" + uid] = null;
      } else if (this.editInitialUserType == UserType.Ert) {
        staffData["/ert/" + uid] = null;
      } else if (this.editInitialUserType == UserType.GlobalDirector) {
        staffData["/globalDirector/" + uid] = null;
      } else if (this.editInitialUserType == UserType.GlobalUser) {
        staffData["/globalUser/" + uid] = null;
      } else if (this.editInitialUserType == UserType.Donor) {
        staffData["/donor/" + uid] = null;
      } else if (this.editInitialUserType == UserType.NonAlert) {
        staffData["/nonAlert/" + uid] = null;
      } else if (this.editInitialUserType == UserType.CountryUser) {
        staffData["/countryUser/" + uid] = null;
      }

      if ((this.editInitialUserType == UserType.GlobalDirector || this.editInitialUserType == UserType.RegionalDirector || this.editInitialUserType == UserType.GlobalUser || this.editInitialUserType == UserType.Donor) &&
        (this.userType == UserType.CountryDirector || this.userType == UserType.Ert || this.userType == UserType.ErtLeader || this.userType == UserType.CountryUser)) {
        staffData["/staff/globalUser/" + this.agencyId + "/" + uid] = null;
      } else if ((this.editInitialUserType == UserType.CountryDirector || this.editInitialUserType == UserType.Ert || this.editInitialUserType == UserType.ErtLeader || this.editInitialUserType == UserType.CountryUser) &&
        (this.userType == UserType.GlobalDirector || this.userType == UserType.RegionalDirector || this.userType == UserType.GlobalUser || this.userType == UserType.Donor)) {
        staffData["/staff/" + this.selectedOfficeId + "/" + uid] = null;
      }

    }

    console.log(staff);

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
    //userType-1 to ignore f all option
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

    //requested by client to lock red alert checked if user type is country director
    if (userType == this.UserType.CountryDirector) {
      this.notificationSettings[NotificationSettingEvents.RedAlertRequest] = true;
      this.notificationsMap.set(NotificationSettingEvents.RedAlertRequest, true);
    }
  }

  private checkUserType() {
    if (this.userType == UserType.CountryDirector) {
      let countryExistsInDirectorCountries = false;
      let filteredCountries = [];
      if (this.countryList && this.directorCountries) {
        this.countryList.forEach(country => {
          this.directorCountries.forEach(directorCountry => {
            if (country.$key == directorCountry.$key) {
              countryExistsInDirectorCountries = true;
            }
          });
          if (!countryExistsInDirectorCountries) {
            filteredCountries.push(country);
          }
          countryExistsInDirectorCountries = false;
        });
        this.countryList = filteredCountries;
      }
    } else {
      this.countryList = this.originalCountryList;
    }

    if (this.userType == UserType.RegionalDirector) {
      this.hideCountry = true;
      this.hideRegion = false;
    } else if (this.userType == UserType.GlobalDirector || this.userType == UserType.GlobalUser || this.userType == UserType.Donor) {
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
    delData["/staff/globalUser/" + this.agencyId + "/" + this.selectedStaffId + "/"] = null;
    delData["/donor/" + this.selectedStaffId + "/"] = null;

    delData["/group/systemadmin/allusersgroup/" + this.selectedStaffId + "/"] = null;
    delData["/group/agency/" + this.agencyId + "/agencyallusersgroup/" + this.selectedStaffId + "/"] = null;
    delData["/group/agency/" + this.agencyId + "/" + Constants.GROUP_PATH_AGENCY[this.userType - 1] + "/" + this.selectedStaffId + "/"] = null;


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
    if (officeList == null) {
      this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
      return;
    }

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
