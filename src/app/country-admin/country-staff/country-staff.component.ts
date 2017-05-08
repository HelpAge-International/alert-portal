import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Router} from '@angular/router';
import {Constants} from '../../utils/Constants';
import {RxHelper} from '../../utils/RxHelper';
import {ModelStaffDisplay} from '../../model/staff-display.model';
import {Observable} from 'rxjs';
import {ModelStaff} from '../../model/staff.model';
import {ModelUserPublic} from '../../model/user-public.model';
import {OfficeType, SkillType, StaffPosition, UserType} from '../../utils/Enums';
declare var jQuery: any;
@Component({
  selector: 'app-country-staff',
  templateUrl: './country-staff.component.html',
  styleUrls: ['./country-staff.component.css']
})
export class CountryStaffComponent implements OnInit, OnDestroy {
  private agencyAdminId: string;
  private countryId: any;
  private uid: string;

  private Position = Constants.STAFF_POSITION;
  private UserType = Constants.COUNTRY_ADMIN_USER_TYPE;
  private userTypesList = Constants.COUNTRY_ADMIN_USER_TYPE_SELECTION;
  private OfficeType = Constants.OFFICE_TYPE;
  private officeTypesList = [OfficeType.All, OfficeType.FieldOffice, OfficeType.LabOffice];
  private notificationSettings = Constants.NOTIFICATION_SETTINGS;

  All_Department = 'All departments';
  filterPosition: string = this.All_Department;
  filterUser = 0;
  filterOffice = 0;

  private staff: ModelStaff;
  private staffPublicUser: ModelUserPublic[] = [];
  private staffList: ModelStaff[] = [];
  private skillSet = new Set();
  private skillNames: string[] = [];
  private staffMap = new Map();
  private supportSkills: string[] = [];
  private techSkills: string[] = [];
  private departments: any[] = [];

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      const countryAdminSubscription = this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + this.uid)
            .subscribe(countryAdmin => {
                // Get the country id and agency administrator id
                this.countryId = countryAdmin.countryId;
                this.agencyAdminId = countryAdmin.agencyAdmin ? Object.keys(countryAdmin.agencyAdmin)[0] : '';
                this.initData();
            });
    });
    this.subscriptions.add(subscription);
  }

  private initData() {
    this.getStaffData();
    const subscription = this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments')
      .map(departmentList => {
        let departments = [this.All_Department];
        departmentList.forEach(x => {
          departments.push(x.$key);
        });
        return departments;
      })
      .subscribe(x => {
        this.departments = x;
      });
    this.subscriptions.add(subscription);
  }

  private getStaffData() {
    const staffSubscription = this.af.database.list(Constants.APP_STATUS + '/staff/' + this.countryId)
      .do(list => {
        list.forEach(item => {
          this.staffList.push(this.addStaff(item));
          this.getStaffPublicUser(item.$key);
        });
      })
      .subscribe();
    this.subscriptions.add(staffSubscription);
  }

  private addStaff(item) {
    this.staff = new ModelStaff();
    this.staff.id = item.$key;
    this.staff.position = item.position;
    this.staff.department = item.department;
    this.staff.officeType = item.officeType;
    this.staff.userType = item.userType;
    this.staff.training = item.training;
    this.staff.skill = item.skill;
    this.staff.notification = item.notification;

    return this.staff;
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  addNewStaff() {
    this.router.navigateByUrl('/country-admin/country-staff/country-add-edit-staff');
  }

  getStaffUserType(userType){
    for (let i = 0; i < this.userTypesList.length; i++) {
      if(this.userTypesList[i] === userType){
        return this.UserType[i];
      }
    }
    return '';
  }
  editStaff(officeId, staffId) {
    this.router.navigate(['/country-admin/country-staff/country-add-edit-staff', {
      id: staffId,
      officeId: officeId
    }], {skipLocationChange: true});
  }

  getStaffPublicUser(userId){
    const staffPublicUserSubscription = this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userId)
              .subscribe(userPublic => {
                this.staffPublicUser[userId] =
                    new ModelUserPublic(userPublic.firstName, userPublic.lastName, userPublic.title, userPublic.email);

                this.staffPublicUser[userId].phone = userPublic.phone;
              });
  }

  closeAdditionalInfo(staffId) {
    jQuery('#' + staffId).collapse('hide');
  }
  getSupportSkills(officeId, staffId) {
    this.supportSkills = [];
    if (staffId) {
      let path = Constants.APP_STATUS + '/staff/' + officeId + '/' + staffId;
      let subscription = this.af.database.object(path)
        .first()
        .map(user => {
          let userSkill = [];
          if (user.skill) {
            for (let skill of user.skill) {
              userSkill.push(skill);
            }
          }
          return userSkill;
        })
        .flatMap(skills => {
          return Observable.from(skills);
        })
        .flatMap(skill => {
          return this.af.database.object(Constants.APP_STATUS + "/skill/" + skill);
        })
        .subscribe(skill => {
          if (skill.type == SkillType.Support) {
            this.supportSkills.push(skill.name);
          }
        });
      this.subscriptions.add(subscription);
    }
    return this.supportSkills;
  }

  getTechSkills(officeId, staffId) {
    this.techSkills = [];
    if (staffId) {
      let path = Constants.APP_STATUS + '/staff/' + officeId + '/' + staffId;
      let subscription = this.af.database.object(path)
        .first()
        .map(user => {
          let userSkill = [];
          if (user.skill) {
            for (let skill of user.skill) {
              userSkill.push(skill)
            }
          }
          return userSkill;
        })
        .flatMap(skills => {
          return Observable.from(skills);
        })
        .flatMap(skill => {
          return this.af.database.object(Constants.APP_STATUS + "/skill/" + skill);
        })
        .subscribe(skill => {
          if (skill.type == SkillType.Tech) {
            this.techSkills.push(skill.name);
          }
        });
      this.subscriptions.add(subscription);
    }
    return this.techSkills;
  }
}
