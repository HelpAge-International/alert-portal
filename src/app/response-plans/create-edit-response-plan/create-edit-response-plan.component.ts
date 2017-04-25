import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";
import {HazardScenario} from "../../utils/Enums";
import {Observable} from "rxjs";

@Component({
  selector: 'app-create-edit-response-plan',
  templateUrl: './create-edit-response-plan.component.html',
  styleUrls: ['./create-edit-response-plan.component.css']
})

export class CreateEditResponsePlanComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyAdminUid: string;
  private systemAdminUid: string;

  // Section 01
  private planName: string;
  private geographicalLocation: string;
  private staffMembers: FirebaseObjectObservable<any>[] = [];
  private staffMemberSelected;
  private hazardScenarioSelected = 0;
  private HazardScenario = HazardScenario;
  private hazardScenariosList = [
    HazardScenario.HazardScenario0,
    HazardScenario.HazardScenario1,
    HazardScenario.HazardScenario2,
    HazardScenario.HazardScenario3,
    HazardScenario.HazardScenario4,
    HazardScenario.HazardScenario5,
    HazardScenario.HazardScenario6,
    HazardScenario.HazardScenario7,
    HazardScenario.HazardScenario8,
    HazardScenario.HazardScenario9,
    HazardScenario.HazardScenario10
  ];

  // Section 02

  // Section 03

  private otherInterventionActivity: string;
  private isDirectlyThroughFieldStaff: boolean = true;

  // Section 04

  private proposedResponseText: string;
  private progressOfActivitiesPlanText: string;
  private coordinationPlanText: string;

  // Section 05

  private numOfPeoplePerHouseHold: number = 0;
  private numOfHouseHolds: number = 0;
  private beneficiaries: number = 0;
  private groups: FirebaseListObservable<any>;

  // Section 06

  // Section 07

  // Section 08

  // Section 09

  // Section 10

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  filterData() {
    console.log("Hazard Scenario Selected");
  }

  staffSelected() {
    console.log("Staff Member Selected");
    console.log(this.planName);
    console.log(this.geographicalLocation);
    console.log(this.hazardScenarioSelected);
    console.log(this.staffMemberSelected);
  }

  calculateBeneficiaries() {
    this.beneficiaries = this.numOfPeoplePerHouseHold * this.numOfHouseHolds;
    console.log("Beneficiaries ----" + this.beneficiaries);
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("Admin uid: " + this.uid);

        this.init();

        let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/agencyAdmin').subscribe((agencyAdminIds) => {
          this.agencyAdminUid = agencyAdminIds[0].$key;

          let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorAgency/" + this.agencyAdminUid + '/systemAdmin').subscribe((systemAdminIds) => {
            this.systemAdminUid = systemAdminIds[0].$key;

            console.log(this.agencyAdminUid);
            console.log(this.systemAdminUid);

            this.getGroups();
          });
          this.subscriptions.add(subscription);
        });
        this.subscriptions.add(subscription);

      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  directMethodOfImplementationSelected() {
    this.isDirectlyThroughFieldStaff = true;
  }

  partnersMethodOfImplementationSelected() {
    this.isDirectlyThroughFieldStaff = false;
  }

  goBack() {
    // TODO - Update to go back to add Response Plan
    this.router.navigateByUrl('response-plans');
  }

  private init() {
    this.getStaff();
  }

  private getStaff() {

    let subscription = this.af.database.list(Constants.APP_STATUS + '/staff/' + this.uid)
      .flatMap(list => {
        this.staffMembers = [];
        let tempList = [];
        list.forEach(x => {
          tempList.push(x)
        });
        return Observable.from(tempList)
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + item.$key)
      })
      .distinctUntilChanged()
      .subscribe(x => {
        this.staffMembers.push(x);
      });
    this.subscriptions.add(subscription);
  }

  private getGroups() {

    this.groups = this.af.database.list(Constants.APP_STATUS + "/system/" + this.uid + '/groups');
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
