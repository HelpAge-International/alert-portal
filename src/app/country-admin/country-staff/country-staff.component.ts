import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {ModelStaff} from "../../model/staff.model";
import {ModelUserPublic} from "../../model/user-public.model";
import {OfficeType, SkillType} from "../../utils/Enums";
import {UserService} from "../../services/user.service";
import {PartnerModel} from "../../model/partner.model";
import {PartnerOrganisationModel} from "../../model/partner-organisation.model";
import {PartnerOrganisationService} from "../../services/partner-organisation.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {ModelDepartment} from "../../model/department.model";

declare var jQuery: any;

@Component({
  selector: 'app-country-staff',
  templateUrl: './country-staff.component.html',
  styleUrls: ['./country-staff.component.css'],
  providers: [UserService, PartnerOrganisationService]
})
export class CountryStaffComponent implements OnInit, OnDestroy {

  partnersList: PartnerModel[];
  private agencyAdminId: string;
  private countryId: any;
  private uid: string;

  private Position = Constants.STAFF_POSITION;
  private UserType = Constants.COUNTRY_ADMIN_USER_TYPE;
  private userTypesList = Constants.COUNTRY_ADMIN_USER_TYPE_SELECTION;
  private OfficeType = Constants.OFFICE_TYPE;
  private officeTypesList = [OfficeType.All, OfficeType.FieldOffice, OfficeType.MainOffice];
  private notificationSettings = Constants.NOTIFICATION_SETTINGS;

  All_Department = 'All departments';
  filterDepartment: string = this.All_Department;
  filterUserType = 0;
  filterOffice = 0;

  private staff: ModelStaff;
  private staffPublicUser: ModelUserPublic[] = [];
  private staffList: ModelStaff[] = [];
  private skillSet = new Set();
  private skillNames: string[] = [];
  private staffMap = new Map();
  private partnerPublicUser: ModelUserPublic[] = [];
  private partnerOrganisations: PartnerOrganisationModel[] = [];
  private supportSkills: string[] = [];
  private techSkills: string[] = [];
  private departments: ModelDepartment[] = [];
  private departmentMap: Map<string, string> = new Map<string, string>();

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + this.uid)
        .subscribe(countryAdmin => {
          // Get the country id and agency administrator id
          this.countryId = countryAdmin.countryId;
          this.agencyAdminId = countryAdmin.agencyAdmin ? Object.keys(countryAdmin.agencyAdmin)[0] : '';
          this.initData();
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initData() {
    this.getStaffData();
    this.getPartnerData();
    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments', {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        this.departments = [];
        this.departmentMap.clear();
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
          this.departmentMap.set(x.id, x.name);
        })
      });
  }

  private getStaffData() {
    this.af.database.list(Constants.APP_STATUS + '/staff/' + this.countryId)
      .do(list => {
        list.forEach(item => {
          this.staffList.push(this.addStaff(item));
          this.getStaffPublicUser(item.$key);
        });
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe();
  }

  private getPartnerData() {
    this._userService.getPartnerUserIds(this.agencyAdminId, this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(partners => {
        this.partnersList = [];
        partners.forEach(partnerId => {
          this._userService.getPartnerUserById(partnerId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(partner => {
              this.partnersList.push(partner);

              this._userService.getUser(partner.id)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(partnerPublicUser => {
                  this.partnerPublicUser[partner.id] = partnerPublicUser;
                });

              this._partnerOrganisationService.getPartnerOrganisation(partner.partnerOrganisationId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(partnerOrganisation => {
                  this.partnerOrganisations[partner.id] = partnerOrganisation
                });
            });
        });
        // this.partnersList = partners;
        // this.partnersList.forEach(partner => {
        //   this._userService.getUser(partner.id)
        //     .takeUntil(this.ngUnsubscribe)
        //     .subscribe(partnerPublicUser => {
        //       this.partnerPublicUser[partner.id] = partnerPublicUser;
        //     });
        //   this._partnerOrganisationService.getPartnerOrganisation(partner.partnerOrganisationId)
        //     .takeUntil(this.ngUnsubscribe)
        //     .subscribe(partnerOrganisation => {
        //       this.partnerOrganisations[partner.id] = partnerOrganisation
        //     });
        // });
      });
  }

  hideFilteredStaff(staff: ModelStaff): boolean {
    let hide = false;

    if (!staff) {
      return hide;
    }

    if (this.filterDepartment && this.filterDepartment !== this.All_Department && staff.department !== this.filterDepartment) {
      hide = true;
    }

    if (this.filterUserType && this.filterUserType > 0 && staff.userType != this.filterUserType) {
      hide = true;
    }

    if (this.filterOffice && this.filterOffice > 0 && staff.officeType != this.filterOffice) {
      hide = true;
    }

    return hide;
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

  addNewStaff() {
    this.router.navigateByUrl('/country-admin/country-staff/country-add-edit-staff');
  }

  addNewPartner() {
    this.router.navigateByUrl('/country-admin/country-staff/country-add-edit-partner');
  }

  getStaffUserType(userType) {
    for (let i = 0; i < this.userTypesList.length; i++) {
      if (this.userTypesList[i] === userType) {
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

  editPartner(partnerId) {
    this.router.navigate(['/country-admin/country-staff/country-add-edit-partner', {
      id: partnerId
    }], {skipLocationChange: true});
  }

  getStaffPublicUser(userId) {
    this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userId)
      .takeUntil(this.ngUnsubscribe)
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
        .takeUntil(this.ngUnsubscribe)
        .subscribe(skill => {
          if (skill.type == SkillType.Tech) {
            this.techSkills.push(skill.name);
          }
        });
    }
    return this.techSkills;
  }
}
