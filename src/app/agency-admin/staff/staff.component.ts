import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {RxHelper} from "../../utils/RxHelper";
import {ModelStaffDisplay} from "../../model/staff-display.model";
import {Observable} from "rxjs";
import {ModelStaff} from "../../model/staff.model";
import {StaffPosition, UserType, OfficeType} from "../../utils/Enums";

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

  showSkills(skillList): string[] {
    let skillIds = [];
    for (let key in skillList) {
      skillIds.push(key);
    }
    let subscription = Observable.from(skillIds)
      .flatMap(id => {
        return this.af.database.object(Constants.APP_STATUS + "/skill/" + id);
      })
      .distinct()
      .subscribe(skill => {
        if (!this.skillSet.has(skill.$key)) {
          this.skillNames.push(skill.name);
          this.skillSet.add(skill.$key);
        }
      });
    this.subscriptions.add(subscription);
    return this.skillNames;
  }

  hideCountryStaff(office) {
    let isHidden = this.showCountryStaff.get(office.id);
    this.showCountryStaff.set(office.id, !isHidden);
  }

  editStaff(officeId, staffId) {
    this.router.navigate([Constants.AGENCY_ADMIN_ADD_STARFF, {id: staffId, officeId: officeId}]);
  }

}
