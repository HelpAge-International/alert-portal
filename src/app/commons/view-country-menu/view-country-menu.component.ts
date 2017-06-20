import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-view-country-menu',
  templateUrl: './view-country-menu.component.html',
  styleUrls: ['./view-country-menu.component.css']
})
export class ViewCountryMenuComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Output() onMenuSelected = new EventEmitter<string>();

  private menuSelected = "officeProfile";
  private menuMap = new Map<string, boolean>();

  constructor(private route: ActivatedRoute) {
    this.menuMap.set("officeProfile", false);
    this.menuMap.set("risk", false);
    this.menuMap.set("preparedness", false);
    this.menuMap.set("plan", false);
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["from"]) {
          this.handleActiveClass(params["from"])
        } else {
          this.handleActiveClass("officeProfile");
        }
      });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleActiveClass(name: string) {
    this.menuMap.forEach((v, k) => {
      this.menuMap.set(k, k == name);
    });
  }

  menuSelection(menu: string) {
    this.onMenuSelected.emit(menu);
    this.menuSelected = menu;
    this.handleActiveClass(menu);
  }
}
