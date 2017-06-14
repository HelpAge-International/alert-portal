import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";

@Component({
  selector: 'app-export-start-fund',
  templateUrl: './export-start-fund.component.html',
  styleUrls: ['./export-start-fund.component.css']
})

export class ExportStartFundComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
