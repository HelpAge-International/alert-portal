import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-export-start-fund',
  templateUrl: './export-start-fund.component.html',
  styleUrls: ['./export-start-fund.component.css']
})

export class ExportStartFundComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private networkCountryId: string;
  private isLocalNetworkAdmin: boolean;

  constructor(private route:ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.route.params
      .subscribe((params:Params) =>{
        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }
        if (params["isLocalNetworkAdmin"]) {
          this.isLocalNetworkAdmin = params["networkCountryId"];
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
