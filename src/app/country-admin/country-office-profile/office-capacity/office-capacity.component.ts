import {Component, OnInit, OnDestroy} from '@angular/core';
import {RxHelper} from '../../../utils/RxHelper';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../../services/user.service";
import {Constants} from '../../../utils/Constants';
import {ResponsePlanSectors, AlertMessageType, SkillType, OfficeType} from '../../../utils/Enums';
import {AlertMessageModel} from '../../../model/alert-message.model';
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-capacity',
  templateUrl: './office-capacity.component.html',
  styleUrls: ['./office-capacity.component.css']
})

export class CountryOfficeCapacityComponent implements OnInit, OnDestroy {
  private responseStaffs: any[];
  private agencyId: string;
  private isViewing: boolean;
  private userMap = new Map<string, string>();

  private UserType: number;
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private uid: string;
  private countryID: string;
  private agencyID: string;
  private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
  private ResponsePlanSectorsList: number[] = [
    ResponsePlanSectors.wash,
    ResponsePlanSectors.health,
    ResponsePlanSectors.shelter,
    ResponsePlanSectors.nutrition,
    ResponsePlanSectors.foodSecurityAndLivelihoods,
    ResponsePlanSectors.protection,
    ResponsePlanSectors.education,
    ResponsePlanSectors.campManagement,
    ResponsePlanSectors.other
  ];

  private skillTypeList: number[] = [SkillType.Support, SkillType.Tech];
  private skillType = Constants.SKILL_TYPE;
  private officeTypeList: number[] = [OfficeType.All, OfficeType.FieldOffice, OfficeType.LabOffice];
  private officeType = Constants.OFFICE_TYPE;

  private suportedSkills: any[] = [];
  private techSkills: any[] = [];

  private filter: any[] = [];

  private countryOfficeCapacity: any[] = [];
  private origCountryOfficeCapacity: any[] = [];
  private totalStaff: number;
  private totalResponseStaff: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(private pageControl: PageControlService,
              private subscriptions: RxHelper,
              private router: Router,
              private route: ActivatedRoute,
              private _userService: UserService,
              private af: AngularFire) {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryID = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }

        this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
          this.uid = user.uid;
          this.UserType = userType;
          this._getAgencyID().then(() => {
            this._getTotalStaff();
          });
          this._getCountryID().then(() => {
            this.getStaff();
            this._getCountryOfficeCapacity().then(() => {

            });
          });
          this._getSkills();
        });

      });

  }

  ngAfterViewInit() {
    this.initPopover();
  }


  initPopover() {
    jQuery(function () {
      jQuery('[data-toggle="popover"]').popover({placement: "bottom"});
      console.log(jQuery('[data-toggle="popover"]').length);
    });
  }


  getStaff() {
    this._userService.getStaffList(this.countryID)
      .map(staffs => {
        console.log(staffs)
        let responseStaffs = [];
        staffs.forEach(staff => {
          if (staff.isResponseMember) {
            responseStaffs.push(staff);
          }
        });
        return responseStaffs;
      })
      .subscribe(responseStaffs => {
        this.responseStaffs = responseStaffs;
        this.totalResponseStaff = this.responseStaffs.length;

        this.responseStaffs.forEach(staff => {
          this._userService.getUser(staff.id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              this.userMap.set(user.id, user.firstName + " " + user.lastName);
            });

          staff.skill.forEach(skill => {
            //TODO ADD SKILLS
          })

        });

      });
  }

  _getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/countryId')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryID: any) => {
          this.countryID = countryID.$value ? countryID.$value : "";
          res(true);
        });
    });
    return promise;
  }

  _getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  _getTotalStaff() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryOffice: any) => {
          this.totalStaff = countryOffice.totalStaff ? countryOffice.totalStaff : 0;
          res(true);
        });
    });
    return promise;
  }


  _getCountryOfficeCapacity() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + '/staff/' + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((CountryOfficeStaff: any) => {
          for (let staff in CountryOfficeStaff) {
            CountryOfficeStaff[staff].skills = [];
            CountryOfficeStaff[staff].skills.support = [];
            CountryOfficeStaff[staff].skills.tech = [];
            CountryOfficeStaff[staff].key = staff;
            /* getUser FullName */
            this._getUserName(staff).takeUntil(this.ngUnsubscribe)
              .subscribe((user: any) => {
                CountryOfficeStaff[staff].name = user.firstName + ' ' + user.lastName;
              });
            /* get skills */
            var skills = CountryOfficeStaff[staff].skill;
            skills.forEach((skillID, key) => {
              this._getSkill(skillID).takeUntil(this.ngUnsubscribe)
                .subscribe((skill: any) => {
                  if (!skill.type) {
                    CountryOfficeStaff[staff].skills.support.push(skill.name);
                  } else {
                    CountryOfficeStaff[staff].skills.tech.push(skill.name);
                  }
                });
            });
          }

          this.countryOfficeCapacity = this._convertObjectToArray(CountryOfficeStaff);
          this.origCountryOfficeCapacity = this.countryOfficeCapacity;
          res(true);
        });
    });
    return promise;
  }

  filterData(event: any, filterType: any) {
    var filterVal = event.target.value;

    var officeFilter = filterType == 'office' ? filterVal : 0;
    var sSkillsFilter = filterType == 'sSkills' ? filterVal : 0;
    var tSkillsFilter = filterType == 'tSkills' ? filterVal : 0;

    var result = [];

    this.origCountryOfficeCapacity.forEach((capacity, key) => {

      var isSkillsFilter = false;
      var iStSkillsFilter = false;

      capacity.skill.forEach((val, key) => {
        if (sSkillsFilter == val) {
          isSkillsFilter = true;
        }
        if (iStSkillsFilter == val) {
          iStSkillsFilter = true;
        }
      });

      if (
        (officeFilter == capacity.officeType || officeFilter == 0) &&
        (isSkillsFilter || sSkillsFilter == 0) &&
        (iStSkillsFilter || tSkillsFilter == 0)
      ) {
        result.push(capacity);
      }
    });

    this.countryOfficeCapacity = result;

  }

  _getUserName(userID: string) {
    return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userID);
  }

  _getSkill(skillID: string) {
    return this.af.database.object(Constants.APP_STATUS + '/skill/' + skillID);
  }

  _getSkills() {
    this.af.database.object(Constants.APP_STATUS + '/skill/').takeUntil(this.ngUnsubscribe)
      .subscribe((skills: any) => {
        for (let skill in skills) {
          var objSkill = {key: skill, name: skills[skill].name};
          if (!skills[skill].type) {
            this.suportedSkills.push(objSkill);
          } else {
            this.techSkills.push(objSkill);
          }
        }
      });
  }

  _convertObjectToArray(obj: any) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return arr;
  }


}
