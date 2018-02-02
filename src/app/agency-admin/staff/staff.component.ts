import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ModelStaffDisplay} from "../../model/staff-display.model";
import {Observable, Scheduler, Subject} from "rxjs";
import {ModelStaff} from "../../model/staff.model";
import {OfficeType, SkillType, StaffPosition, UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {ModelDepartment} from "../../model/department.model";
import {AgencyService} from "../../services/agency-service.service";
import {SettingsService} from "../../services/settings.service";

declare var jQuery: any;

@Component({
  selector: 'app-staff',
  templateUrl: 'staff.component.html',
  styleUrls: ['staff.component.css'],
  providers: [AgencyService]
})

export class StaffComponent implements OnInit, OnDestroy {

  private hideLoader: boolean;

  POSITION = Constants.STAFF_POSITION;
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION = Constants.USER_TYPE_SELECTION;
  OFFICE_TYPE = Constants.OFFICE_TYPE;
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
  private UserType = Constants.USER_TYPE;
  private userTypesList = [UserType.All, UserType.GlobalDirector, UserType.RegionalDirector, UserType.CountryDirector,
    UserType.ErtLeader, UserType.Ert, UserType.Donor, UserType.GlobalUser, UserType.CountryAdmin, UserType.NonAlert];
  private OfficeType = Constants.OFFICE_TYPE;
  private officeTypesList = [OfficeType.All, OfficeType.FieldOffice, OfficeType.MainOffice];
  private staffMap = new Map();
  private dealedStaff: string[] = [];
  private showCountryStaff = new Map();
  private globalUsers: any[] = [];
  private departments: ModelDepartment[] = [];
  private departmentMap: Map<string, string> = new Map<string, string>();
  private agencyId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //resolve live frozen bug
  private staffObjMap = new Map()
  private supportSkillMap = new Map()
  private techSkillMap = new Map()

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private agencyService: AgencyService,
              private settingService: SettingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.showCountryStaff.set("globaluser", true);
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.initData();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initData() {
    this.getStaffData();
    this.initDepartments();
  }

  private initDepartments() {
    this.departmentMap.clear();
    this.departments = [];
    //agency level
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
          this.departmentMap.set(x.id, x.name);
        });
      });
    //all country level for this agency
    this.agencyService.getAllCountryIdsForAgency(this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryIds => {
        countryIds.forEach(id => {
          this.settingService.getCountryLocalDepartments(this.agencyId, id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((countryDepts: ModelDepartment[]) => {
              countryDepts.forEach(dep => {
                this.departments.push(dep)
                this.departmentMap.set(dep.id, dep.name)
              })
            })
        })
      })

  }

  private getStaffData() {
    this.staffs = [];
    this.dealedStaff = [];
    this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId)
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
                //resolve frozen bug
                this.getStaffObj(item.$key)
                this.getSupportSkills(id, item.$key)
                this.getTechSkills(id, item.$key)

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
      .subscribe(() => {
        this.hideLoader = true;
      });

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

  hideCountryStaff(office) {
    if (office.id) {
      let isHidden = this.showCountryStaff.get(office.id);
      this.showCountryStaff.set(office.id, !isHidden);
    } else {
      let isHidden = this.showCountryStaff.get("globaluser");
      this.showCountryStaff.set("globaluser", !isHidden);
    }
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

  getStaffObj(staffId) {
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staffId)
      .takeUntil(this.ngUnsubscribe)
      .first()
      .subscribe(user => {
        this.staffObjMap.set(staffId, user)
      });
  }

  getSupportSkills(officeId, staffId) {
    let supportSkills = [];
    if (staffId) {
      let path = officeId ? Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId :
        Constants.APP_STATUS + "/staff/globalUser/" + this.agencyId + "/" + staffId;
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
            supportSkills.push(skill.name);
            this.supportSkillMap.set(staffId, supportSkills)
          }
        });
    }
  }

  getTechSkills(officeId, staffId) {
    let techSkills = [];
    if (staffId) {
      let path = officeId ? Constants.APP_STATUS + "/staff/" + officeId + "/" + staffId :
        Constants.APP_STATUS + "/staff/globalUser/" + this.agencyId + "/" + staffId;
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
          if (skill.type == SkillType.Tech) {
            techSkills.push(skill.name);
            this.techSkillMap.set(staffId, techSkills)
          }
        });
    }
  }

  filterStaff() {
    console.log("filter staff");
    this.getStaffData();
    this.filterGlobalUsers();
  }

  private filterGlobalUsers() {
    this.globalUsers = [];
    this.af.database.list(Constants.APP_STATUS + "/staff/globalUser/" + this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(users => {

        //resolve frozen bug
        users.forEach(user => {
          this.getStaffObj(user.$key)
          this.getSupportSkills(null, user.$key)
          this.getTechSkills(null, user.$key)
        })

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
        console.log(this.globalUsers);
        this.hideLoader = true;
      });
  }

}
