import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Subject} from "rxjs/Subject";

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

  constructor(private route: ActivatedRoute) {
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
