import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ModelStaffDisplay} from "../../model/staff-display.model";
import {Observable, Subject} from "rxjs";
import {ModelStaff} from "../../model/staff.model";
import {OfficeType, SkillType, StaffPosition, UserType} from "../../utils/Enums";
declare var jQuery: any;

@Component({
  selector: 'app-staff',
  templateUrl: 'staff.component.html',
  styleUrls: ['staff.component.css']
})

export class StaffComponent implements OnInit, OnDestroy {

  private hideLoader: boolean;

  POSITION = Constants.STAFF_POSITION;
  POSITION_SELECTION = Constants.STAFF_POSITION_SELECTION;
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION = Constants.USER_TYPE_SELECTION;
  OFFICE_TYPE = Constants.OFFICE_TYPE;
  OFFICE_TYPE_SELECTION = Constants.OFFICE_TYPE_SELECTION;
  NOTIFICATION_SETTINGS = Constants.NOTIFICATION_SETTINGS;

  All_Department: string = "allDepartments";
  filterPosition: string = this.All_Department;
  filterUser: number = 0;
  filterOffice: number = 0;

  countries = Constants.COUNTRIES;
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
    UserType.ErtLeader, UserType.Ert, UserType.Donor, UserType.GlobalUser, UserType.CountryAdmin, UserType.NonAlert];
  private OfficeType = Constants.OFFICE_TYPE;
  private officeTypesList = [OfficeType.All, OfficeType.FieldOffice, OfficeType.LabOffice];
  private staffMap = new Map();
  private dealedStaff: string[] = [];
  private showCountryStaff = new Map();
  private staffEmail: string;
  private staffPhone: string;
  private supportSkills: string[] = [];
  private techSkills: string[] = [];
  private globalUsers: any[] = [];
  private departments: any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      this.initData();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initData() {
    this.getStaffData();
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
      .map(departmentList => {
        let departments = [];
        departmentList.forEach(x => {
          departments.push(x.$key);
        });
        return departments;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(x => {
        this.departments = x;
      });
  }

  private getStaffData() {
    this.staffs = [];
    this.dealedStaff = [];
    this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid)
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
          this.staffMap.get(id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(x => {
              x.forEach(item => {
                if (!this.dealedStaff.includes(item.$key)) {
                  if (this.filterPosition == this.All_Department && this.filterUser == UserType.All && this.filterOffice == OfficeType.All) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == this.All_Department && this.filterUser == item.userType && this.filterOffice == OfficeType.All) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == this.All_Department && this.filterUser == UserType.All && this.filterOffice == item.officeType) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == this.All_Department && this.filterUser == item.userType && this.filterOffice == item.officeType) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == item.department && this.filterUser == UserType.All && this.filterOffice == OfficeType.All) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == this.All_Department && this.filterUser == UserType.All && this.filterOffice == item.officeType) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == item.department && this.filterUser == UserType.All && this.filterOffice == item.officeType) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == item.department && this.filterUser == UserType.All && this.filterOffice == OfficeType.All) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == this.All_Department && this.filterUser == item.userType && this.filterOffice == OfficeType.All) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == item.department && this.filterUser == item.userType && this.filterOffice == OfficeType.All) {
                    this.addStaff(item, id);
                  } else if (this.filterPosition == item.department && this.filterUser == item.userType && this.filterOffice == item.officeType) {
                    this.addStaff(item, id);
                  }
                }
              });
            });
        });
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(x => {
        this.hideLoader = true;
      });

    // this.af.database.list(Constants.APP_STATUS + "/staff/globalUser/" + this.uid).takeUntil(this.ngUnsubscribe)
    //   .subscribe(users => {
    //     this.globalUsers = users;
    //   });
    this.filterGlobalUsers();
  }

  private addStaff(item, id) {
    this.staff = new ModelStaff();
    this.staff.id = item.$key;
    this.staff.position = item.position;
    this.staff.department = item.department;
    this.staff.officeType = item.officeType;
    this.staff.userType = item.userType;
    this.staff.training = item.training;
    this.staff.skill = item.skill;
    this.staff.notification = item.notification;
    this.staffs[this.officeId.indexOf(id)].staffs.push(this.staff);
    this.dealedStaff.push(item.$key);
  }

  addNewStaff() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_ADD_STARFF);
  }

  getStaffName(key): string {
    this.staffName = "";
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + key)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        this.staffName = user.firstName + " " + user.lastName;
      });
    return this.staffName;
  }

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

  editGlobalUser(staffId) {
    console.log("edit global user");
  }

  closeAdditionalInfo(staffId) {
    jQuery("#" + staffId).collapse("hide");
  }

  getStaffEmail(staffId) {
    this.staffEmail = "";
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staffId)
      .takeUntil(this.ngUnsubscribe)
      .first()
      .subscribe(user => {
        this.staffEmail = user.email;
      });
    return this.staffEmail;
  }

  getStaffPhone(staffId) {
    this.staffPhone = "";
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staffId)
      .takeUntil(this.ngUnsubscribe)
      .first()
      .subscribe(user => {
        this.staffPhone = user.phone;
      });
    return this.staffPhone;
  }

  getSupportSkills(officeId, staffId) {
    this.supportSkills = [];
    if (staffId) {
      let path = officeId ? Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId :
        Constants.APP_STATUS + "/staff/globalUser/" + this.uid + "/" + staffId;
      this.af.database.object(path)
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
        .takeUntil(this.ngUnsubscribe)
        .subscribe(skill => {
          if (skill.type == SkillType.Support) {
            this.supportSkills.push(skill.name);
          }
        });
    }
    return this.supportSkills;
  }

  getTechSkills(officeId, staffId) {
    this.techSkills = [];
    if (staffId) {
      let path = officeId ? Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId :
        Constants.APP_STATUS + "/staff/globalUser/" + this.uid + "/" + staffId;
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
        .takeUntil(this.ngUnsubscribe)
        .subscribe(skill => {
          if (skill.type == SkillType.Tech) {
            this.techSkills.push(skill.name);
          }
        });
    }
    return this.techSkills;
  }

  filterStaff() {
    console.log("filter staff");
    this.getStaffData();
    this.filterGlobalUsers();
  }

  private filterGlobalUsers() {
    this.globalUsers = [];
    this.af.database.list(Constants.APP_STATUS + "/staff/globalUser/" + this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(users => {
        if (this.filterPosition == this.All_Department && this.filterUser == UserType.All && this.filterOffice == OfficeType.All) {
          this.globalUsers = users;
        } else if (this.filterPosition == this.All_Department && this.filterUser != UserType.All && this.filterOffice == OfficeType.All) {
          users.forEach(user => {
            if (user.userType == this.filterUser) {
              let isDuplicate = false;
              for (let item of this.globalUsers) {
                if (item.$key == user.$key) {
                  isDuplicate = true;
                }
              }
              if (!isDuplicate) {
                this.globalUsers.push(user);
              }
            }
          });
        } else if (this.filterPosition == this.All_Department && this.filterUser == UserType.All && this.filterOffice != OfficeType.All) {
          users.forEach(user => {
            if (user.officeType == this.filterOffice) {
              let isDuplicate = false;
              for (let item of this.globalUsers) {
                if (item.$key == user.$key) {
                  isDuplicate = true;
                }
              }
              if (!isDuplicate) {
                this.globalUsers.push(user);
              }
            }
          });
        } else if (this.filterPosition == this.All_Department && this.filterUser != UserType.All && this.filterOffice != OfficeType.All) {
          users.forEach(user => {
            if (user.officeType == this.filterOffice && user.userType == this.filterUser) {
              let isDuplicate = false;
              for (let item of this.globalUsers) {
                if (item.$key == user.$key) {
                  isDuplicate = true;
                }
              }
              if (!isDuplicate) {
                this.globalUsers.push(user);
              }
            }
          });
        }
        else if (this.filterPosition != this.All_Department && this.filterUser == UserType.All && this.filterOffice == OfficeType.All) {
          users.forEach(user => {
            if (user.department == this.filterPosition) {
              let isDuplicate = false;
              for (let item of this.globalUsers) {
                if (item.$key == user.$key) {
                  isDuplicate = true;
                }
              }
              if (!isDuplicate) {
                this.globalUsers.push(user);
              }
            }
          });
        } else if (this.filterPosition != this.All_Department && this.filterUser == UserType.All && this.filterOffice != OfficeType.All) {
          users.forEach(user => {
            if (user.department == this.filterPosition && user.officeType == this.filterOffice) {
              let isDuplicate = false;
              for (let item of this.globalUsers) {
                if (item.$key == user.$key) {
                  isDuplicate = true;
                }
              }
              if (!isDuplicate) {
                this.globalUsers.push(user);
              }
            }
          });
        }
        else if (this.filterPosition != this.All_Department && this.filterUser != UserType.All && this.filterOffice == OfficeType.All) {
          users.forEach(user => {
            if (user.department == this.filterPosition && user.userType == this.filterUser) {
              let isDuplicate = false;
              for (let item of this.globalUsers) {
                if (item.$key == user.$key) {
                  isDuplicate = true;
                }
              }
              if (!isDuplicate) {
                this.globalUsers.push(user);
              }
            }
          });
        } else if (this.filterPosition != this.All_Department && this.filterUser != UserType.All && this.filterOffice != OfficeType.All) {
          users.forEach(user => {
            if (user.department == this.filterPosition && user.userType == this.filterUser && user.officeType == this.filterOffice) {
              let isDuplicate = false;
              for (let item of this.globalUsers) {
                if (item.$key == user.$key) {
                  isDuplicate = true;
                }
              }
              if (!isDuplicate) {
                this.globalUsers.push(user);
              }
            }
          });
        }
        console.log(this.globalUsers)
      });
  }

}
