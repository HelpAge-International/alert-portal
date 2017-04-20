import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {RxHelper} from "../../utils/RxHelper";
import {ModelStaffDisplay} from "../../model/staff-display.model";
import {Observable} from "rxjs";
import {ModelStaff} from "../../model/staff.model";
import {OfficeType, SkillType, StaffPosition, UserType} from "../../utils/Enums";
declare var jQuery: any;

@Component({
  selector: 'app-staff',
  templateUrl: 'staff.component.html',
  styleUrls: ['staff.component.css']
})

export class StaffComponent implements OnInit, OnDestroy {
  POSITION = Constants.STAFF_POSITION;
  POSITION_SELECTION = Constants.STAFF_POSITION_SELECTION;
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION = Constants.USER_TYPE_SELECTION;
  OFFICE_TYPE = Constants.OFFICE_TYPE;
  OFFICE_TYPE_SELECTION = Constants.OFFICE_TYPE_SELECTION;
  NOTIFICATION_SETTINGS = Constants.NOTIFICATION_SETTINGS;

  SkillType = SkillType;

  countries = Constants.COUNTRY;
  staffs: ModelStaffDisplay[] = [];
  private uid: string;
  private staffDisplay: ModelStaffDisplay;
  private officeId: string [] = [];
  private staff: ModelStaff;
  staffName: string;
  skillSet = new Set();
  private skillNames: string[] = [];
  private Position = Constants.STAFF_POSITION;
  private positionsList = [StaffPosition.All, StaffPosition.OfficeDirector, StaffPosition.OfficeStarff];
  private UserType = Constants.USER_TYPE;
  private userTypesList = [UserType.All, UserType.GlobalDirector, UserType.RegionalDirector, UserType.CountryDirector,
    UserType.ErtLeader, UserType.Ert, UserType.Donor, UserType.GlobalUser, UserType.CountryAdmin];
  private OfficeType = Constants.OFFICE_TYPE;
  private officeTypesList = [OfficeType.All, OfficeType.FieldOffice, OfficeType.LabOffice];
  private staffMap = new Map();
  private dealedStaff: string[] = [];
  private showCountryStaff = new Map();
  private staffEmail: string;
  private staffPhone: string;
  private supportSkills: string[] = [];
  private techSkills: string[] = [];

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      this.initData();
    });
    this.subscriptions.add(subscription);
  }

  private initData() {
    this.getStaffData();
  }

  private getStaffData() {
    this.staffs = [];
    let subscription = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid)
      .do(list => {
        list.forEach(item => {
          this.staffDisplay = new ModelStaffDisplay();
          this.staffDisplay.id = item.$key;
          this.staffDisplay.country = item.location;
          this.staffDisplay.staffs = [];
          this.staffs.push(this.staffDisplay);
          this.showCountryStaff.set(this.staffDisplay.id, false);
        })
      })
      .flatMap(list => {
        let ids = [];
        list.forEach(x => {
          ids.push(x.$key);
        });
        return Observable.from(ids);
      })
      .map(id => {
        this.officeId.push(id);
        return this.staffMap.set(id, this.af.database.list(Constants.APP_STATUS + "/staff/" + id));
      })
      .do(() => {
        this.officeId.forEach(id => {
          let subscribe = this.staffMap.get(id)
            .subscribe(x => {
              x.forEach(item => {
                if (!this.dealedStaff.includes(item.$key)) {
                  this.staff = new ModelStaff();
                  this.staff.id = item.$key;
                  this.staff.position = item.position;
                  this.staff.officeType = item.officeType;
                  this.staff.userType = item.userType;
                  this.staff.training = item.training;
                  this.staff.skill = item.skill;
                  this.staff.notification = item.notification;
                  this.staffs[this.officeId.indexOf(id)].staffs.push(this.staff);
                  this.dealedStaff.push(item.$key);
                }
              });
            });
          this.subscriptions.add(subscribe);
        });
      })
      .subscribe();
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  addNewStaff() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_ADD_STARFF);
  }

  getStaffName(key): string {
    this.staffName = "";
    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + key)
      .subscribe(user => {
        this.staffName = user.firstName + " " + user.lastName;
      });
    this.subscriptions.add(subscription);
    return this.staffName;
  }

  // showSkills(skillList): string[] {
  //   let skillIds = [];
  //   for (let key in skillList) {
  //     skillIds.push(key);
  //   }
  //   let subscription = Observable.from(skillIds)
  //     .flatMap(id => {
  //       return this.af.database.object(Constants.APP_STATUS + "/skill/" + id);
  //     })
  //     .distinct()
  //     .subscribe(skill => {
  //       if (!this.skillSet.has(skill.$key)) {
  //         this.skillNames.push(skill.name);
  //         this.skillSet.add(skill.$key);
  //       }
  //     });
  //   this.subscriptions.add(subscription);
  //   return this.skillNames;
  // }

  hideCountryStaff(office) {
    let isHidden = this.showCountryStaff.get(office.id);
    this.showCountryStaff.set(office.id, !isHidden);
  }

  editStaff(officeId, staffId) {
    this.router.navigate([Constants.AGENCY_ADMIN_ADD_STARFF, {
      id: staffId,
      officeId: officeId
    }], {skipLocationChange: true});
  }

  closeAdditionalInfo(staffId) {
    jQuery("#" + staffId).collapse("hide");
  }

  showAdditionalInfo(officeId, staffId) {
    console.log("show additional info");
  }

  getStaffEmail(staffId) {
    this.staffEmail = "";
    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staffId)
      .first()
      .subscribe(user => {
        this.staffEmail = user.email;
      });
    this.subscriptions.add(subscription);
    return this.staffEmail;
  }

  getStaffPhone(staffId) {
    this.staffPhone = "";
    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staffId)
      .first()
      .subscribe(user => {
        this.staffPhone = user.phone;
      });
    this.subscriptions.add(subscription);
    return this.staffPhone;
  }

  getSupportSkills(officeId, staffId) {
    this.supportSkills = [];
    if (officeId && staffId) {
      let subscription = this.af.database.object(Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId)
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
    if (officeId && staffId) {
      let subscription = this.af.database.object(Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId)
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
