import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {RxHelper} from "../../utils/RxHelper";
import {ModelStaffDisplay} from "../../model/staff-display.model";
import {Observable} from "rxjs";
import {ModelStaff} from "../../model/staff.model";

@Component({
  selector: 'app-staff',
  templateUrl: 'staff.component.html',
  styleUrls: ['staff.component.css']
})
export class StaffComponent implements OnInit, OnDestroy {
  countries = Constants.COUNTRY;
  subscriptions: RxHelper;
  staffs: ModelStaffDisplay[];
  private uid: string;
  private staffDisplay: ModelStaffDisplay;
  countryOffices: FirebaseListObservable<any[]>;
  private officeId: string;
  private staff: ModelStaff;
  staffName: string;
  skillSet = new Set();
  private skillNames: string[] = [];

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper();
    this.staffs = [];
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
    this.countryOffices = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid);
    this.getStaffData();
  }

  private getStaffData() {
    this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid)
      .do(list => {
        list.forEach(item => {
          this.staffDisplay = new ModelStaffDisplay();
          this.staffDisplay.id = item.$key;
          this.staffDisplay.country = item.location;
          this.staffDisplay.staffs = [];
          this.staffs.push(this.staffDisplay);
        })
      })
      .flatMap(list => {
        let ids = [];
        list.forEach(x => {
          ids.push(x.$key);
        })
        return Observable.from(ids);
      })
      .flatMap(id => {
        this.officeId = id;
        return this.af.database.list(Constants.APP_STATUS + "/staff/" + id)
      })
      .do(x => {
        x.forEach(item => {
          this.staff = new ModelStaff();
          this.staff.id = item.$key;
          this.staff.position = item.position;
          this.staff.officeType = item.officeType;
          this.staff.trainingNeeds = item.training;
          this.staff.skills = item.skill;

          for (let item of this.staffs) {
            if (item.id == this.officeId) {
              item.staffs.push(this.staff);
            }
          }
        });
      })
      .subscribe(result => {
        console.log(result);
      });
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  addNewStaff() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_ADD_STARFF);
  }

  getStaffName(key): string {
    this.staffName = "";
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + key)
      .subscribe(user => {
        this.staffName = user.firstName + " " + user.lastName;
      });
    return this.staffName;
  }

  showSkills(skillList): string[] {
    let skillIds = [];
    for (let key in skillList) {
      skillIds.push(key);
    }
    Observable.from(skillIds)
      .flatMap(id => {
        return this.af.database.object(Constants.APP_STATUS + "/skill/" + id);
      })
      .distinct()
      .subscribe(skill => {
        if (!this.skillSet.has(skill.$key)) {
          this.skillNames.push(skill.name);
          this.skillSet.add(skill.$key);
        }
      })
    return this.skillNames;
  }

}
