import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Countries} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-view-country-menu',
  templateUrl: './view-country-menu.component.html',
  styleUrls: ['./view-country-menu.component.css']
})
export class ViewCountryMenuComponent implements OnInit, OnDestroy {

  private CountryNames = Constants.COUNTRIES;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Output() onMenuSelected = new EventEmitter<string>();

  private menuSelected = "officeProfile";
  private menuMap = new Map<string, boolean>();
  private agencyId: string;
  private countryId: string;
  private countryLocation: number = -1;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {
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
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (this.agencyId && this.countryId) {
          this.loadCountry(this.agencyId, this.countryId);
        }
      });

  }

  private loadCountry(agencyId: string, countryId: string) {
    this.userService.getCountryDetail(countryId, agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        this.countryLocation = country.location;
        console.log(this.countryLocation);
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

  viewMinAction() {
    this.router.navigate(["/director/director-overview", {
      "countryId": this.countryId,
      "agencyId": this.agencyId,
      "isViewing": true,
      "from": "preparedness",
      "preparednessType": "min"
    }]);
  }

  viewAdvAction() {
    this.router.navigate(["/director/director-overview", {
      "countryId": this.countryId,
      "agencyId": this.agencyId,
      "isViewing": true,
      "from": "preparedness",
      "preparednessType": "adv"
    }]);
  }

  viewActionBudget() {
    this.router.navigate(["/director/director-overview", {
      "countryId": this.countryId,
      "agencyId": this.agencyId,
      "isViewing": true,
      "from": "preparedness",
      "preparednessType": "budget"
    }]);
  }


  getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }
}
