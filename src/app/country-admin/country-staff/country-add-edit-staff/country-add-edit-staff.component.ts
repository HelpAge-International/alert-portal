import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Countries, SkillType, UserType} from "../../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {firebaseConfig} from "../../../app.module";
import {UUID} from "../../../utils/UUID";
import * as firebase from "firebase";
import {ModelUserPublic} from "../../../model/user-public.model";
import {ModelStaff} from "../../../model/staff.model";
import {PageControlService} from "../../../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-add-edit-staff',
  templateUrl: './country-add-edit-staff.component.html',
  styleUrls: ['./country-add-edit-staff.component.css']
})

export class CountryAddEditStaffComponent implements OnInit, OnDestroy {
  private secondApp: firebase.app.App;

  private uid: string;
  private agencyAdminId: string;
  private countryId: string;

  private isEdit = false;
  private warningMessage: string;
  private hideWarning = true;
  private successMessage = 'COUNTRY_ADMIN.STAFF.SUCCESS_STAFF_MEMBER_ADDED';
  private hideSuccess = true;

  private countryEnum = Countries;

  private userTypeConstant = Constants.COUNTRY_ADMIN_USER_TYPE;
  private userTypeSelection = Constants.COUNTRY_ADMIN_USER_TYPE_SELECTION;
  private userTitle = Constants.PERSON_TITLE;
  private userTitleSelection = Constants.PERSON_TITLE_SELECTION;
  private officeTypeConstant = Constants.OFFICE_TYPE;
  private officeTypeSelection = Constants.OFFICE_TYPE_SELECTION;
  private notificationsSettingsSelection = Constants.NOTIFICATION_SETTINGS;

  private countryList: FirebaseListObservable<any[]>;
  private departmentList: Observable<any[]>;
  private supportSkillList: any;
  private techSkillsList: any;
  private notificationList: FirebaseListObservable<any[]>;
  private notificationSettings: boolean[] = [];
  private skillsMap = new Map();
  private notificationsMap = new Map();
  private staffSkills: string[] = [];
  private staffNotifications: number[] = [];

  title: number;
  firstName: string;
  lastName: string;
  userType: number;
  countryOffice: any;
  department: string;
  position: string;
  officeType: number;
  email: string;
  phone: string;
  skills: string[] = [];
  trainingNeeds: string;
  notifications: number[] = [];
  isResponseMember: boolean;

  private selectedStaffId: string;
  private selectedOfficeId: string;
  private emailInDatabase: string;
  private isEmailChange: boolean;
  private isUpdateOfficeOnly: boolean;
  private hideCountry: boolean;
  private hideRegion: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
      this.uid = user.uid;

      this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryAdmin => {
            // Get the country id and agency administrator id
            this.countryId = countryAdmin.countryId;
            this.agencyAdminId = countryAdmin.agencyAdmin ? Object.keys(countryAdmin.agencyAdmin)[0] : '';
            this.initData();
            this.route.params
              .takeUntil(this.ngUnsubscribe)
              .subscribe((params: Params) => {
                if (params['id']) {
                  this.selectedStaffId = params['id'];
                  this.selectedOfficeId = this.countryId;
                  this.isEdit = true;
                  this.loadStaffInfo(this.selectedStaffId, this.selectedOfficeId);
                }
              });
          },
          error => {
            this.warningMessage = 'GLOBAL.GENERAL_ERROR';
            this.showAlert();
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
    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId + '/' + this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryOffice => {
        this.countryOffice = countryOffice;
      });

    this.countryList = this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId);
    this.departmentList = this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments')
      .map(departments => {
        let names = [];
        departments.forEach(department => {
          names.push(department.$key);
        });
        return names;
      });

    this.af.database.list(Constants.APP_STATUS + '/skill')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(skills => {
      this.techSkillsList = skills.filter(skill => skill.type === SkillType.Tech);
      this.supportSkillList = skills.filter(skill => skill.type === SkillType.Support);
    });

    this.notificationList = this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/notificationSetting');
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
  }

  validateForm() {
    if (!this.title) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_TITLE';
      this.showAlert();
      return;
    }
    if (!this.firstName) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_FIRST_NAME';
      this.showAlert();
      return;
    }
    if (!this.lastName) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_LAST_NAME';
      this.showAlert();
      return;
    }
    if (!this.userType) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_USER_TYPE';
      this.showAlert();
      return;
    }
    if (!this.countryOffice) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_COUNTRY_OFFICE';
      this.showAlert();
      return;
    }
    if (!this.department) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_DEPARTMENT';
      this.showAlert();
      return;
    }
    if (!this.position) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_POSITION';
      this.showAlert();
      return;
    }
    if (!this.officeType) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_OFFICE_TYPE';
      this.showAlert();
      return;
    }
    if (!this.email) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_EMAIL';
      this.showAlert();
      return;
    }
    if (!this.phone) {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_PHONE';
      this.showAlert();
      return;
    }
    if (typeof (this.isResponseMember) === 'undefined') {
      this.warningMessage = 'COUNTRY_ADMIN.STAFF.NO_RESPONSE_TEAM_ANSWER';
      this.showAlert();
      return;
    }
    if (!CustomerValidator.EmailValidator(this.email)) {
      this.warningMessage = 'GLOBAL.EMAIL_NOT_VALID';
      this.showAlert();
      return;
    }
  }

  submit() {
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
      if (this.emailInDatabase === this.email && this.countryOffice && this.countryOffice.$key !== this.selectedOfficeId) {
        this.updateOfficeChange();
      } else if (this.emailInDatabase === this.email) {
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

  private updateOfficeChange() {
    this.isUpdateOfficeOnly = true;
    this.updateFirebase(this.selectedStaffId);
  }

  private updateWithNewEmail() {
    this.isEmailChange = true;
    this.createNewUser();
  }

  private updateNoEmailChange() {
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
    staffData['/group/agency/' + this.agencyAdminId + '/agencyallusersgroup/' + uid + '/'] = true;
    staffData['/group/agency/' + this.agencyAdminId + '/' + Constants.GROUP_PATH_AGENCY[this.userType - 1] + '/' + uid + '/'] = true;

    // staff extra info
    let staff = new ModelStaff();
    console.log(this.userType);
    staff.userType = Number(this.userType);

    staff.department = this.department;
    staff.position = this.position;
    staff.officeType = Number(this.officeType);
    staff.skill = this.staffSkills;
    staff.training = this.trainingNeeds ? this.trainingNeeds : 'None';
    staff.notification = this.staffNotifications;
    staff.isResponseMember = this.isResponseMember;

    if (this.isUpdateOfficeOnly) {
      staffData['/staff/' + this.selectedOfficeId + '/' + uid + '/'] = null;
    }

    if (!this.hideCountry) {
      staffData['/staff/' + this.countryOffice.$key + '/' + uid + '/'] = staff;
    } else if (!this.hideRegion) {
      staffData['/staff/globalUser/' + this.agencyAdminId + '/' + uid + '/'] = staff;
      //staffData['/region/' + this.uid + '/' + this.region.$key + '/directorId'] = uid;
    } else {
      staffData['/staff/' + this.countryOffice.$key + '/' + uid + '/'] = staff;
      staffData['/staff/globalUser/' + this.agencyAdminId + '/' + uid + '/'] = staff;
    }

    if (this.isEmailChange) {
      staffData['/userPublic/' + this.selectedStaffId + '/'] = null;
      if (!this.hideCountry) {
        staffData['/staff/' + this.selectedOfficeId + '/' + this.selectedStaffId + '/'] = null;
      } else {
        staffData['/staff/globalUser/' + this.uid + '/' + this.selectedStaffId + '/'] = null;
      }
    }

    if (this.userType === UserType.CountryDirector) {
      staffData['/directorCountry/' + this.countryOffice.$key + '/'] = uid;
    }

    this.af.database.object(Constants.APP_STATUS).update(staffData).then(() => {
      this.hideWarning = true;
      this.hideSuccess = false;
      Observable.timer(1500)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
        this.router.navigateByUrl('/country-admin/country-staff');
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
      : Constants.APP_STATUS + '/staff/globalUser/' + this.agencyAdminId + '/' + staffId;

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
    // userType-1 to ignore first all option
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
    delData['/staff/' + this.selectedOfficeId + '/' + this.selectedStaffId + '/'] = null;

    delData['/group/systemadmin/allusersgroup/' + this.selectedStaffId + '/'] = null;
    delData['/group/agency/' + this.agencyAdminId + '/agencyallusersgroup/' + this.selectedStaffId + '/'] = null;
    delData['/group/agency/' + this.agencyAdminId + '/' + Constants.GROUP_PATH_AGENCY[this.userType - 1]
    + '/' + this.selectedStaffId + '/'] = null;

    if (this.userType === UserType.CountryDirector) {
      delData['/directorCountry/' + this.countryOffice.$key + '/'] = null;
    }

    this.af.database.object(Constants.APP_STATUS).update(delData).then(() => {
      this.router.navigateByUrl('/country-admin/country-staff');
    }, error => {
      this.warningMessage = error.message;
      this.showAlert();
    });
  }
}
