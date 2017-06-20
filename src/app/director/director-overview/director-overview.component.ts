import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-director-overview',
  templateUrl: './director-overview.component.html',
  styleUrls: ['./director-overview.component.css']
})
export class DirectorOverviewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private menuTab = "officeProfile";
  private tabMap = new Map<string, boolean>();

  private countryId: string;
  private isViewing: boolean;
  private agencyId: string;
  private from: string;
  private agencyName: string;

  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.tabMap.set("officeProfile", true);
    this.tabMap.set("risk", false);
    this.tabMap.set("preparedness", false);
    this.tabMap.set("plan", false);
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
          this.getAgencyInfo(this.agencyId);
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["from"]) {
          this.from = params["from"];
          this.menuSelection(this.from);
        }
      });
  }

  private getAgencyInfo(agencyId: string) {
    this.userService.getAgencyDetail(agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agency => {
        this.agencyName = agency.name;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  menuSelection(menuName: string) {
    this.tabMap.forEach((v, k) => {
      this.tabMap.set(k, k == menuName);
    });
  }
}
