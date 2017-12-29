import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Constants} from "../../utils/Constants";
import {PageControlService} from "../../services/pagecontrol.service";
import {UserType} from "../../utils/Enums";
import {Location} from "@angular/common";

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
  private canCopy: boolean;
  private agencyOverview: boolean;

  private userType: UserType;
  private UserType = UserType;

  @Input() isLocalAgency: Boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pageControl: PageControlService,
              private location: Location,
              private userService: UserService) {
  }

  ngOnInit() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

      this.userType = userType;

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
          if (params["canCopy"]) {
            this.canCopy = params["canCopy"];
          }
          if (params["agencyOverview"]) {
            this.agencyOverview = params["agencyOverview"];
          }
          this.initData(this.countryId, this.agencyId);
        });

    });

  }

  private initData(countryId, agencyId) {
    if(this.isLocalAgency){
      this.userService.getAgencyDetail(agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agency => {
          this.countryName = Constants.COUNTRIES[agency.country];
        });
    } else {
      this.userService.getCountryDetail(countryId, agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(country => {
          this.countryName = Constants.COUNTRIES[country.location];
        });
    }

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  backToViewingPlan() {
    let headers = {
      "countryId": this.countryId,
      "isViewing": this.isViewing,
      "agencyId": this.agencyId,
      "from": "plan"
    };

    if (this.canCopy) {
      headers["canCopy"] = this.canCopy;
      if (this.agencyOverview) {
        headers["agencyOverview"] = this.agencyOverview;
      }
      this.router.navigate(this.isLocalAgency ? ["/local-agency/dashboard/dashboard-overview", headers] : ["/dashboard/dashboard-overview", headers]);
    } else {
      this.router.navigate(this.isLocalAgency ? ["/local-agency/director/director-overview", headers] : ["/director/director-overview", headers]);
    }
  }

  backForDonor() {
    this.location.back();
  }

}
