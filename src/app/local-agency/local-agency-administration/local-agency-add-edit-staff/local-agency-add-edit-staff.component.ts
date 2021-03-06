import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {NotificationSettingEvents, SkillType, UserType} from "../../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {firebaseConfig} from "../../../app.module";
import {UUID} from "../../../utils/UUID";
import * as firebase from "firebase";
import {ModelUserPublic} from "../../../model/user-public.model";
import {ModelStaff} from "../../../model/staff.model";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ModelDepartment} from "../../../model/department.model";

declare var jQuery: any;

@Component({
  selector: 'app-local-agency-add-edit-staff',
  templateUrl: './local-agency-add-edit-staff.component.html',
  styleUrls: ['./local-agency-add-edit-staff.component.scss']
})
export class LocalAgencyAddEditStaffComponent implements OnInit {

  private secondApp: firebase.app.App;

  private uid: string;
  private localAgencyAdminId: string;
  private countryId: string;
  private agencyId: string;
  private isUserTypeChange: boolean;
  private editInitialUserType: UserType;

  private isEdit = false;
  private warningMessage: string;
  private hideWarning = true;
  private successMessage = 'COUNTRY_ADMIN.STAFF.SUCCESS_STAFF_MEMBER_ADDED';
  private hideSuccess = true;

  // private countryEnum = Countries;
  private countryEnum = Constants.COUNTRIES;

  private userTypeConstant = Constants.LOCAL_AGENCY_ADMIN_USER_TYPE;
  private userTypeSelection = Constants.LOCAL_AGENCY_ADMIN_USER_TYPE_SELECTION;
  private userTitle = Constants.PERSON_TITLE;
  private userTitleSelection = Constants.PERSON_TITLE_SELECTION;
  private officeTypeConstant = Constants.OFFICE_TYPE;
  private officeTypeSelection = Constants.OFFICE_TYPE_SELECTION;
  private notificationsSettingsSelection = Constants.NOTIFICATION_SETTINGS;
  private UserType = UserType;

  private countryList: FirebaseListObservable<any[]>;
  private departmentList: Observable<any[]>;
  private notificationList: FirebaseListObservable<any[]>;
  private notificationSettings: boolean[] = [];
  private skillsMap = new Map();
  private notificationsMap = new Map();
  private departmentMap = new Map();
  private staffSkills: string[] = [];
  private staffNotifications: number[] = [];
  private staffDepartments: string[] = [];

  title: number;
  firstName: string;
  lastName: string;
  userType: number;
  countryOffice: any;
  position: string;
  officeType: number;
  email: string;
  phone: string;
  skills: string[] = [];
  trainingNeeds: string;
  notifications: number[] = [];
  isResponseMember: boolean;

  private selectedStaffId: string;
  private selectedAgencyId: string;
  private emailInDatabase: string;
  private isEmailChange: boolean;
  private isUpdateOfficeOnly: boolean;
  private hideCountry: boolean;
  private hideRegion: boolean;
  private isFirstLogin: boolean;
  private systemId: string;
  private allSkills: any = {};
  private skillKeys: string[] = [];
  private editedSkills: any = [];
  private SupportSkill = SkillType.Support;
  private TechSkill = SkillType.Tech;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
      this.uid = user.uid;
      this.systemId = systemId
      this.agencyId = agencyId
            this.initData();
            this.route.params
              .takeUntil(this.ngUnsubscribe)
              .subscribe((params: Params) => {
                if (params['id']) {
                  this.selectedStaffId = params['id'];
                  this.selectedAgencyId = this.agencyId;
                  this.isEdit = true;
                  this.loadStaffInfo(this.selectedStaffId, this.selectedAgencyId);
                }
                /*Filtering country director option in the user types if there exists a country director for this country already*/
                this.updateUserTypeSelection();
              });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private showAlert() {
    this.hideWarning = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.hideWarning = true;
      });
  }

  private initData() {
    this.countryList = this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId);
    console.log(Constants.APP_STATUS + '/agency/' + this.agencyId + '/departments')
    this.departmentList = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + '/departments', {preserveSnapshot: true})
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
        console.log('hi')
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
              console.log(this.skillKeys)
            });
        });
      });

    this.notificationList = this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/notificationSetting');
  }

  private updateUserTypeSelection() {
    this.af.database.list(Constants.APP_STATUS + "/directorLocalAgency").takeUntil(this.ngUnsubscribe).subscribe(directorLocalAgencies => {
      let directorExists = false;
      directorLocalAgencies.forEach(directorLocalAgency => {
        if (!directorExists && this.agencyId == directorLocalAgency.$key) {
          directorExists = true;
          if (this.isEdit && this.userType == UserType.LocalAgencyDirector) {
            console.log("no filter out");
          } else {
            this.userTypeSelection = this.userTypeSelection.filter(function (el) {
              return el !== UserType.LocalAgencyDirector;
            });
            this.userTypeConstant = this.userTypeConstant.filter(function (el) {
              return el !== "GLOBAL.USER_TYPE.LOCAL_AGENCY_DIRECTORS";
            });
          }
        }
      });
    });
  }

  goBack() {
    this.router.navigateByUrl('/local-agency/agency-staff');
  }

  validateForm() {
    if (!this.title) {
      this.warningMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_TITLE';
      return false;
    }
    if (!this.firstName) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_FIRST_NAME';
      return false;
    }
    if (!this.lastName) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_LAST_NAME';
      return false;
    }
    if (!this.userType) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_USER_TYPE';
      return false;
    }
    if (!this.departmentSelected()) {
      this.warningMessage = 'AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_ERROR';
      return false;
    }
    if (!this.position) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_POSITION';
      return false;
    }
    if (!this.officeType) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_OFFICE_TYPE';
      return false;
    }
    if (!this.email) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_EMAIL';
      return false;
    }
    if (!CustomerValidator.PhoneNumberValidator(this.phone)) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_PHONE';
      return false;
    }
    if (typeof (this.isResponseMember) === 'undefined') {
      this.warningMessage = 'AGENCY_ADMIN.STAFF.NO_REPONSE_TEAM_ANSWER';
      return false;
    }
    if (!CustomerValidator.EmailValidator(this.email)) {
      this.warningMessage = 'GLOBAL.EMAIL_NOT_VALID';
      return false;
    }
    return true;
  }

  departmentSelected() {
    var selected = []
    this.departmentMap.forEach((value, key) => {
      if (value) {
        selected.push(value)
      }
    });
    return selected.filter(item => item == true).length > 0
  }

  submit() {
    if (this.validateForm()) {
      this.collectData();
    } else {
      this.showAlert();
    }
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
    this.departmentMap.forEach((value, key) => {
      if (value) {
        this.staffDepartments.push(key);
      }
    });
    if (!this.isEdit) {
      if (this.userType != UserType.NonAlert) {
        this.createNewUser();
      } else {
        this.createNonAlertUser();
      }
    } else {
      if (this.emailInDatabase === this.email) {
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

  supportSkillCheck(skill, isCheck) {
    this.skillsMap.set(skill.$key, isCheck);
  }

  techSkillCheck(skill, isCheck) {
    this.skillsMap.set(skill.$key, isCheck);
  }

  notificationCheck(notification, isCheck) {
    this.notificationsMap.set(Number(notification.$key), isCheck);
  }

  departmentCheck(department, isCheck) {
    this.departmentMap.set(department.id, isCheck)
  }

  private updateWithNewEmail() {
    this.isEmailChange = true;
    this.createNewUser();
  }

  private updateNoEmailChange() {

    if (this.editInitialUserType != this.userType) {
      this.isUserTypeChange = true;
    }
    this.updateFirebase(this.selectedStaffId);
  }

  private createNewUser() {
    this.secondApp.auth().createUserWithEmailAndPassword(this.email, Constants.TEMP_PASSWORD).then(newUser => {
      this.updateFirebase(newUser.uid);
      this.secondApp.auth().signOut();
    }, error => {
      this.warningMessage = error.message;
      this.showAlert();
    });
  }

  private updateFirebase(uid) {
    let staffData = {};

    // user public
    let user = new ModelUserPublic(this.firstName, this.lastName, this.title, this.email);
    user.phone = this.phone;
    user.country = -1;
    user.addressLine1 = '';
    user.addressLine2 = '';
    user.addressLine3 = '';
    user.city = '';
    user.postCode = '';

    staffData['/userPublic/' + uid + '/'] = user;

    // add to group
    staffData['/group/systemadmin/allusersgroup/' + uid + '/'] = true;
    staffData['/group/agency/' + this.agencyId + '/agencyallusersgroup/' + uid + '/'] = true;
    staffData['/group/agency/' + this.agencyId + '/' + Constants.GROUP_PATH_AGENCY[this.userType - 1] + '/' + uid + '/'] = true;


    // staff extra info
    let staff = new ModelStaff();
    console.log("User Type :");
    console.log(this.userType);

    staff.userType = Number(this.userType);

    staff.departments = this.staffDepartments;
    staff.position = this.position;
    staff.officeType = Number(this.officeType);
    staff.skill = this.staffSkills;
    staff.training = this.trainingNeeds ? this.trainingNeeds : 'None';
    staff.notification = this.staffNotifications;
    staff.isResponseMember = this.isResponseMember;
    staff.updatedAt = Date.now();

    if (this.isUpdateOfficeOnly) {
      staffData['/staff/' + this.selectedAgencyId + '/' + uid + '/'] = null;
    }


    if (!this.hideCountry) {
      staffData['/staff/' + this.agencyId + '/' + uid + '/'] = staff;
    } else if (!this.hideRegion) {
      staffData['/staff/globalUser/' + this.agencyId + '/' + uid + '/'] = staff;
      //staffData['/region/' + this.uid + '/' + this.region.$key + '/directorId'] = uid;
    } else {
      // staffData['/staff/' + this.countryOffice.$key + '/' + uid + '/'] = staff;
      staffData['/staff/globalUser/' + this.agencyId + '/' + uid + '/'] = staff;
    }


    if (this.isEmailChange) {
      staffData['/userPublic/' + this.selectedStaffId + '/'] = null;
      if (!this.hideCountry) {
        staffData['/staff/' + this.selectedAgencyId + '/' + this.selectedStaffId + '/'] = null;
      } else {
        staffData['/staff/globalUser/' + this.uid + '/' + this.selectedStaffId + '/'] = null;
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
        userData["firstLogin"] = this.isFirstLogin;
      }
    }



    let system = {};
    system[this.systemId] = true;
    userData["systemAdmin"] = system;
    if (this.userType == UserType.LocalAgencyDirector) {
      staffData["/directorLocalAgency/" + this.agencyId + "/"] = uid;
      staffData["/localAgencyDirector/" + uid] = userData;
    } else if (this.userType == UserType.ErtLeader) {
      staffData["/ertLeader/" + uid] = userData;
    } else if (this.userType == UserType.Ert) {
      staffData["/ert/" + uid] = userData;
    } else if (this.userType == UserType.NonAlert) {
      staffData["/nonAlert/" + uid] = userData;
    } else if (this.userType == UserType.AgencyUser) {
      staffData["/countryUser/" + uid] = userData;
    }

    //update userType status
    if (this.isUserTypeChange) {
      if (this.editInitialUserType === UserType.LocalAgencyDirector) {
        staffData["/directorLocalAgency/" + this.agencyId] = null;
        staffData["/localAgencyDirector/" + uid] = null;
      } else if (this.editInitialUserType == UserType.ErtLeader) {
        staffData["/ertLeader/" + uid] = null;
      } else if (this.editInitialUserType == UserType.Ert) {
        staffData["/ert/" + uid] = null;
      } else if (this.editInitialUserType == UserType.NonAlert) {
        staffData["/nonAlert/" + uid] = null;
      } else if (this.editInitialUserType == UserType.AgencyUser) {
        staffData["/countryUser/" + uid] = null;
      }
    }

    this.af.database.object(Constants.APP_STATUS).update(staffData).then(() => {
      this.hideWarning = true;
      this.hideSuccess = false;
      Observable.timer(1500)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          this.router.navigateByUrl('/local-agency/agency-staff');
        });
    }, error => {
      this.warningMessage = error.message;
      this.showAlert();
    });
  }

  private loadStaffInfo(staffId: string, officeId: string) {
    this.af.database.object(Constants.APP_STATUS + '/userPublic/' + staffId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        this.title = user.title;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.emailInDatabase = user.email;
        this.phone = user.phone;
      });

    let path = officeId !== 'null'
      ? Constants.APP_STATUS + '/staff/' + officeId + '/' + staffId
      : Constants.APP_STATUS + '/staff/globalUser/' + this.agencyId + '/' + staffId;

    this.af.database.object(path)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(staff => {
        this.userType = staff.userType;
        this.editInitialUserType = staff.userType;
        this.checkUserType();
        this.position = staff.position;
        this.officeType = staff.officeType;

        if (staff.departments && staff.departments.length > 0) {
          for (let department of staff.departments) {
            this.departmentMap.set(department, true);
          }
        } else {
          if(staff.department) {
            this.departmentMap.set(staff.department, true);
          }
        }

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

        let userNode = Constants.USER_PATHS[this.userType];
        this.af.database.object(Constants.APP_STATUS + '/' + userNode + '/' + staffId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(userData => {
            this.isFirstLogin = userData.firstLogin;
          });
      });

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

  selectedUserType(userType) {
    // userType-1 to ignore f all option
    console.log(UserType[userType]);

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
    this.checkUserType();

    //requested by client to lock red alert checked if user type is country director
    if (userType == UserType.LocalAgencyDirector) {
      this.notificationSettings[NotificationSettingEvents.RedAlertRequest] = true;
      this.notificationsMap.set(NotificationSettingEvents.RedAlertRequest, true);
    }
  }

  deleteStaff() {
    jQuery('#delete-action').modal('show');
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

  deleteAction() {
    jQuery('#delete-action').modal('hide');
    let delData = {};
    delData['/userPublic/' + this.selectedStaffId + '/'] = null;
    delData['/staff/' + this.selectedAgencyId + '/' + this.selectedStaffId + '/'] = null;

    delData['/group/systemadmin/allusersgroup/' + this.selectedStaffId + '/'] = null;
    delData['/group/agency/' + this.agencyId + '/agencyallusersgroup/' + this.selectedStaffId + '/'] = null;
    delData['/group/agency/' + this.agencyId + '/' + Constants.GROUP_PATH_AGENCY[this.userType - 1]
    + '/' + this.selectedStaffId + '/'] = null;

    if (this.userType === UserType.LocalAgencyDirector) {
      delData['/directorLocalAgency/' + this.agencyId + '/'] = null;
    }

    this.af.database.object(Constants.APP_STATUS).update(delData).then(() => {
      this.router.navigateByUrl('/local-agency/agency-staff');
    }, error => {
      this.warningMessage = error.message;
      this.showAlert();
    });
  }

}
