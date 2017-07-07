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
  private activeMap = new Map<string, boolean>();
  private officeTarget: string;
  private canCopy: boolean;


  constructor(private route: ActivatedRoute, private router: Router) {
    this.initMenuActive();
  }

  private initMenuActive() {
    this.activeMap.set("programme", true);
    this.activeMap.set("officeCapacity", false);
    this.activeMap.set("partners", false);
    this.activeMap.set("equipment", false);
    this.activeMap.set("coordination", false);
    this.activeMap.set("stockCapacity", false);
    this.activeMap.set("documents", false);
    this.activeMap.set("contacts", false);
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
        if (params["officeTarget"]) {
          this.officeTarget = params["officeTarget"];
          this.handleMenuActive(this.officeTarget);
        }
        if (params["canCopy"]) {
          this.canCopy = params["canCopy"];
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  viewingToProgramme() {
    console.log("view programme");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "programme",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "programme"
      }]);
    }
    // /director/director-overview;countryId=tPB9g8EwCLMceutAeAyWlYQUh8V2;isViewing=true;agencyId=qbyONHp4xqZy2eUw0kQHU7BAcov1;from=plan
  }

  viewingToOfficeCapacity() {
    console.log("view office capacity");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "officeCapacity",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "officeCapacity"
      }]);
    }
  }

  viewingToPartners() {
    console.log("view partners");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "partners",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "partners",
      }]);
    }
  }

  viewingToEquipment() {
    console.log("view partners");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "equipment",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "equipment",
      }]);
    }
  }

  viewingToCoordination() {
    console.log("view coordination");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "coordination",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "coordination",
      }]);
    }
  }

  viewingToStockCapacity() {
    console.log("view stock capacity");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "stockCapacity",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "stockCapacity"
      }]);
    }
  }

  viewingToDocuments() {
    console.log("view documents");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "documents",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "documents"
      }]);
    }
  }

  viewingToContacts() {
    console.log("view contacts");
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "contacts",
        "canCopy": true
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "contacts"
      }]);
    }
  }

  private handleMenuActive(type: string) {
    this.activeMap.forEach((v, k) => {
      this.activeMap.set(k, k == type);
    });
  }

}
