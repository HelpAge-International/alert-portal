import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {NotificationSettingEvents, SkillType, UserType, OfficeType} from "../../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {firebaseConfig} from "../../../app.module";
import {UUID} from "../../../utils/UUID";
import * as firebase from "firebase";
import {ModelUserPublic} from "../../../model/user-public.model";
import {fieldOffice} from "../../../model/fieldOffice.model";
import {ModelStaff} from "../../../model/staff.model";
import {PageControlService} from "../../../services/pagecontrol.service";
import {FieldOfficeService} from "../../../services/field-office.service";
import {ModelDepartment} from "../../../model/department.model";
import {NetworkService} from "../../../services/network.service";
import {UserService} from "../../../services/user.service";

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
  private isUserTypeChange: boolean;
  private editInitialUserType: UserType;

  private isEdit = false;
  private warningMessage: string;
  private hideWarning = true;
  private successMessage = 'COUNTRY_ADMIN.STAFF.SUCCESS_STAFF_MEMBER_ADDED';
  private hideSuccess = true;

  // private countryEnum = Countries;
  private countryEnum = Constants.COUNTRIES;

  private userTypeConstant = Constants.COUNTRY_ADMIN_USER_TYPE;
  private userTypeSelection = Constants.COUNTRY_ADMIN_USER_TYPE_SELECTION;
  private userTitle = Constants.PERSON_TITLE;
  private userTitleSelection = Constants.PERSON_TITLE_SELECTION;
  private officeTypeConstant = Constants.OFFICE_TYPE;
  private officeTypeSelection = Constants.OFFICE_TYPE_SELECTION;
  private notificationsSettingsSelection = Constants.NOTIFICATION_SETTINGS;
  private UserType = UserType;
  public officeTypeEnum = OfficeType;

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
  private selectedOfficeId: string;
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

  public fieldOffices: Array<fieldOffice>

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public fieldOffice;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private networkService: NetworkService,
              private userService: UserService,
              private fieldOfficeService: FieldOfficeService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
      this.uid = user.uid;
      // Get the country id and agency administrator id
      this.countryId = countryId;
      this.agencyAdminId = agencyId
      this.systemId = systemId
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
          /*Filtering country director option in the user types if there exists a country director for this country already*/
          this.updateUserTypeSelection();
        });

      this.fieldOfficeService.getFieldOffices(countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(fieldOffices => {
          this.fieldOffices = fieldOffices;
        })
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

    //agency level dep
    this.departmentList = Observable.combineLatest(this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments', {preserveSnapshot: true}),
      this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId + "/" + this.countryId + '/departments', {preserveSnapshot: true}))
      .map(departments => {
        let names: ModelDepartment[] = [];
        departments.forEach(department => {
          if (department.val()) {
            Object.keys(department.val()).forEach(key => {
              names.push(ModelDepartment.create(key, department.val()[key]["name"]));
            })
          }
        });
        return names;
      })

    //get skills
    this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/skills')
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

    this.notificationList = this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId + "/" + this.countryId + '/defaultNotificationSettings');
  }

  private updateUserTypeSelection() {
    this.af.database.list(Constants.APP_STATUS + "/directorCountry").takeUntil(this.ngUnsubscribe).subscribe(directorCountries => {
      let directorExists = false;
      directorCountries.forEach(directorCountry => {
        if (!directorExists && this.countryId == directorCountry.$key) {
          directorExists = true;
          if (this.isEdit && this.userType == UserType.CountryDirector) {
            console.log("no filter out");
          }
          else if (this.isEdit && this.userType == UserType.NonAlert) {
            this.userTypeConstant = this.userTypeConstant.filter(function (el) {
              return el == "GLOBAL.USER_TYPE.NON_ALERT";
            });
            this.userTypeSelection = [this.UserType.NonAlert]
          }
          else {
            this.userTypeSelection = this.userTypeSelection.filter(function (el) {
              return el !== UserType.CountryDirector;
            });
            this.userTypeConstant = this.userTypeConstant.filter(function (el) {
              return el !== "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS";
            });
          }
        }
      });
    });
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
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
      return false
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
    if (!this.fieldOffice && this.officeType == this.officeTypeEnum.FieldOffice && this.fieldOffices.length > 0) {
      this.warningMessage = 'Please select a field office.';
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
    if (this.countryOffice && this.countryOffice.$key !== this.selectedOfficeId) {
      this.isUpdateOfficeOnly = true;
    }
    if (this.editInitialUserType != this.userType) {
      this.isUserTypeChange = true;
    }
    this.updateFirebase(this.selectedStaffId);
  }

  private createNewUser() {
    this.userService.getUserByEmail(this.email)
      .first()
      .subscribe(existUser => {
        if (!existUser) {
          let userId = this.networkService.generateKeyUserPublic()
          this.updateFirebase(userId);
        } else {
          this.warningMessage = "Email is already exist!"
          this.showAlert();
        }
      }, err => {
        this.warningMessage = err.message;
        this.showAlert()
      })
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
    staffData['/group/country/' + this.countryId + '/countryallusersgroup/' + uid + '/'] = true;
    staffData['/group/country/' + this.countryId + '/' + Constants.GROUP_PATH_AGENCY[this.userType - 1] + '/' + uid + '/'] = true;

    // staff extra info
    let staff = new ModelStaff();

    staff.userType = Number(this.userType);

    staff.position = this.position;
    staff.officeType = Number(this.officeType);
    staff.skill = this.staffSkills;
    staff.training = this.trainingNeeds ? this.trainingNeeds : 'None';
    staff.departments = this.staffDepartments;
    staff.notification = this.staffNotifications;
    staff.isResponseMember = this.isResponseMember;
    staff.updatedAt = Date.now();

    if (this.fieldOffice && this.officeType == this.officeTypeEnum.FieldOffice) {
      staff.fieldOffice = this.fieldOffice;
    } else {
      staff.fieldOffice = null;
    }

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

    //push user group
    let userData = {};
    let agency = {};
    agency[this.agencyAdminId] = true;
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

    if (!this.hideCountry) {
      userData["countryId"] = this.countryOffice.$key;
    }

    let system = {};
    system[this.systemId] = true;
    userData["systemAdmin"] = system;
    if (this.userType == UserType.CountryDirector) {
      staffData["/directorCountry/" + this.countryOffice.$key + "/"] = uid;
      staffData["/countryDirector/" + uid] = userData;
    } else if (this.userType == UserType.ErtLeader) {
      staffData["/ertLeader/" + uid] = userData;
    } else if (this.userType == UserType.Ert) {
      staffData["/ert/" + uid] = userData;
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
      } else if (this.editInitialUserType == UserType.ErtLeader) {
        staffData["/ertLeader/" + uid] = null;
      } else if (this.editInitialUserType == UserType.Ert) {
        staffData["/ert/" + uid] = null;
      } else if (this.editInitialUserType == UserType.NonAlert) {
        staffData["/nonAlert/" + uid] = null;
      } else if (this.editInitialUserType == UserType.CountryUser) {
        staffData["/countryUser/" + uid] = null;
      }
    }

    this.af.database.object(Constants.APP_STATUS).update(staffData).then(() => {
      this.hideWarning = true;
      this.hideSuccess = false;
      Observable.timer(1500).subscribe(() => {
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
        this.editInitialUserType = staff.userType;
        this.checkUserType();

        this.position = staff.position;
        this.officeType = staff.officeType;
        this.fieldOffice = staff.fieldOffice;

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
    this.notificationList
      .takeUntil(this.ngUnsubscribe)
      .subscribe(settingList => {
        this.notificationSettings = [];
        settingList.forEach(setting => {
          this.notificationSettings.push(setting.usersNotified[userType]);
          this.notificationsMap.set(Number(setting.$key), setting.usersNotified[userType]);
        });
      });
    this.checkUserType();

    //requested by client to lock red alert checked if user type is country director
    if (userType == UserType.CountryDirector) {
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
