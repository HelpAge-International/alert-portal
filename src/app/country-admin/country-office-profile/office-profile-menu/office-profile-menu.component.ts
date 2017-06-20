import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-country-office-profile-menu',
  templateUrl: './office-profile-menu.component.html',
  styleUrls: ['./office-profile-menu.component.css']
})
export class CountryOfficeProfileMenuComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryID: string;
  private isViewing: boolean;
  private agencyId: string;


  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryID = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  viewingToProgramme() {
    console.log("view programme");
    this.router.navigate(["/director/director-overview", {
      "countryId": this.countryID,
      "isViewing": this.isViewing,
      "agencyId": this.agencyId,
      "from": "officeProfile"
    }]);
    // /director/director-overview;countryId=tPB9g8EwCLMceutAeAyWlYQUh8V2;isViewing=true;agencyId=qbyONHp4xqZy2eUw0kQHU7BAcov1;from=plan
  }

}
