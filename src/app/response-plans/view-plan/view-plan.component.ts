import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css']
})
export class ViewPlanComponent implements OnInit, OnDestroy {

  private countryName: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private countryId: string;
  private isViewing: boolean;
  private agencyId: string;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        this.initData(this.countryId, this.agencyId);
      });
  }

  private initData(countryId, agencyId) {
    this.userService.getCountryDetail(countryId, agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        console.log(country);
        this.countryName = Constants.COUNTRIES[country.location];
        console.log(this.countryName);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  backToViewingPlan() {
    this.router.navigate(["/director/director-overview", {
      "countryId": this.countryId,
      "isViewing": this.isViewing,
      "agencyId": this.agencyId,
      "from": "plan"
    }]);
  }

}
