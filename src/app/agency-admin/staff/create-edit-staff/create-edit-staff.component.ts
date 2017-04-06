import {Component, OnInit, OnDestroy} from '@angular/core';
import {RxHelper} from "../../../utils/RxHelper";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router, ActivatedRoute} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Country, PersonTitle, SkillType, UserType} from "../../../utils/Enums";
import {Observable} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";

@Component({
  selector: 'app-create-edit-staff',
  templateUrl: 'create-edit-staff.component.html',
  styleUrls: ['create-edit-staff.component.css']
})
export class CreateEditStaffComponent implements OnInit, OnDestroy {
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION = Constants.USER_TYPE_SELECTION;
  STAFF_POSITION = Constants.STAFF_POSITION;
  STAFF_POSITION_SELECTION = Constants.STAFF_POSITION_SELECTION;
  OFFICE_TYPE = Constants.OFFICE_TYPE;
  OFFICE_TYPE_SELECTION = Constants.OFFICE_TYPE_SELECTION;
  NOTIFICATION_SETTINGS = Constants.NOTIFICATION_SETTINGS;

  Country = Country;

  title: number;
  firstName: string;
  lastName: string;
  userType: number;
  countryOffice: string;
  region: string;
  department: string;
  position: number;
  officeType: number;
  email: string;
  phone: string;
  skills: string[] = [];
  trainingNeeds: string;
  notifications: number[] = [];
  isResponseMember: boolean;

  hideWarning: boolean = true;
  hideRegion: boolean = true;
  hideCountry: boolean = false;
  private uid: string;
  private waringMessage: string;
  private countryList: FirebaseListObservable<any[]>;
  private departmentList: Observable<any[]>;
  private supportSkillList: FirebaseListObservable<any[]>;
  private techSkillsList: FirebaseListObservable<any[]>;
  private notificationList: FirebaseListObservable<any[]>;
  private notificationSettings: boolean[] = [];


  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      this.initData();
    });
  }

  private initData() {
    this.countryList = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid);
    this.departmentList = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
      .map(departments => {
        let names = [];
        departments.forEach(department => {
          names.push(department.$key);
        });
        return names;
      });
    this.supportSkillList = this.af.database.list(Constants.APP_STATUS + "/skill", {
      query: {
        orderByChild: "type",
        equalTo: SkillType.Support
      }
    });
    this.techSkillsList = this.af.database.list(Constants.APP_STATUS + "/skill", {
      query: {
        orderByChild: "type",
        equalTo: SkillType.Tech
      }
    });
    this.notificationList = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/notificationSetting");

  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  validateForm() {
    console.log("validate form");
    if (!this.title) {
      this.waringMessage = "Title cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.firstName) {
      this.waringMessage = "First name cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.lastName) {
      this.waringMessage = "Last name cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.userType) {
      this.waringMessage = "User type cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.region && !this.hideRegion) {
      this.waringMessage = "Region cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.countryOffice && !this.hideCountry) {
      this.waringMessage = "Country office cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.department) {
      this.waringMessage = "Department cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.position) {
      this.waringMessage = "Position cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.officeType) {
      this.waringMessage = "Office type cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.email) {
      this.waringMessage = "User type cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.phone) {
      this.waringMessage = "Phone number cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.trainingNeeds) {
      this.waringMessage = "Training needs cannot be empty!";
      this.showAlert();
      return;
    }
    if (!this.isResponseMember) {
      this.waringMessage = "Is response team must be selected!";
      this.showAlert();
      return;
    }
  }

  submit() {
    console.log("submit");
  }

  selectedUserType(userType) {
    this.notificationSettings = [];
    this.notificationList
      .first()
      .subscribe(settingList => {
        console.log(settingList);
        settingList.forEach(setting => {
          this.notificationSettings.push(setting.usersNotified[userType]);
        });
      });
  }

  cancel() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_STARFF);
  }

  private showAlert() {
    this.hideWarning = false;
    let subscribe = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.hideWarning = true;
    });
    this.subscriptions.add(subscribe);
  }
}
