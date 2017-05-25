import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";

@Component({
  selector: 'app-review-response-plan',
  templateUrl: './review-response-plan.component.html',
  styleUrls: ['./review-response-plan.component.css']
})

export class ReviewResponsePlanComponent implements OnInit, OnDestroy {

  // TODO - Update this
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;

  private responsePlanId; string;

  private responsePlanToShow: ResponsePlan;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.loadData();
        this.loadResponsePlanData();
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Private functions
   */

  private loadData() {
    this.getCountryId().then(() => {
      this.loadResponsePlanData();
    });
  }

  private getCountryId() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryId: any) => {
          this.countryId = countryId.$value;
          res(true);
        });
    });
    return promise;
  }

  private loadResponsePlanData() {



  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
