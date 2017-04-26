import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {RxHelper} from "../utils/RxHelper";
import {Constants} from "../utils/Constants";

@Component({
  selector: 'app-response-plans',
  templateUrl: './response-plans.component.html',
  styleUrls: ['./response-plans.component.css']
})

export class ResponsePlansComponent implements OnInit, OnDestroy {

  private uid: string;
  private activePlans: any[] = [];
  private archivedPlans: FirebaseListObservable<any[]>;
  private notes: FirebaseListObservable<any[]>;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("Admin uid: " + this.uid);
        this.checkUserType(this.uid);
      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  private checkUserType(uid: string) {
    let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + uid)
      .subscribe(admin => {
        if (admin.countryId) {
          this.getResponsePlans(admin.countryId);
        } else {
          console.log("check other user types!")
        }
      });
    this.subscriptions.add(subscription);
  }

  private getResponsePlans(id: string) {
    let subscription = this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id, {
      query: {
        orderByChild: "isActive",
        equalTo: true
      }
    })
      .subscribe(plans => {
        this.activePlans = plans;
      });
    this.subscriptions.add(subscription);

    this.archivedPlans = this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id, {
      query: {
        orderByChild: "isActive",
        equalTo: false
      }
    });

    this.notes = this.af.database.list(Constants.APP_STATUS + "/note/" + id)
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  getName(id) {
    let name = "";
    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + id)
      .subscribe(user => {
        name = user.firstName + " " + user.lastName;
      });
    this.subscriptions.add(subscription);

    return name;
  }

  goToNewOrEditPlan() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
