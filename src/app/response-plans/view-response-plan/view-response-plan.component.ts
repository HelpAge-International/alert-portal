import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";

@Component({
  selector: 'app-view-response-plan',
  templateUrl: './view-response-plan.component.html',
  styleUrls: ['./view-response-plan.component.css']
})
export class ViewResponsePlanComponent implements OnInit, OnDestroy {

  // TODO - Update this
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;

  private responsePlanId: string;

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

    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.responsePlanId;

    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlanToShow = responsePlan;
        this.loadSection1(responsePlan);
        this.loadSection2(responsePlan);
        this.loadSection3(responsePlan);
        this.loadSection4(responsePlan);
        this.loadSection5(responsePlan);
        this.loadSection6(responsePlan);
        this.loadSection7(responsePlan);
        this.loadSection8(responsePlan);
        this.loadSection9(responsePlan);
        this.loadSection10(responsePlan);
      });

  }

  private loadSection1(responsePlan: ResponsePlan) {

  }

  private loadSection2(responsePlan: ResponsePlan) {

  }

  private loadSection3(responsePlan: ResponsePlan) {

  }

  private loadSection4(responsePlan: ResponsePlan) {

  }

  private loadSection5(responsePlan: ResponsePlan) {

  }

  private loadSection6(responsePlan: ResponsePlan) {

  }

  private loadSection7(responsePlan: ResponsePlan) {

  }

  private loadSection8(responsePlan: ResponsePlan) {

  }

  private loadSection9(responsePlan: ResponsePlan) {

  }

  private loadSection10(responsePlan: ResponsePlan) {

  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
