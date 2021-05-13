
import {takeUntil} from 'rxjs/operators';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject} from "rxjs";

@Component({
  selector: 'app-local-agency-profile-menu',
  templateUrl: './local-agency-profile-menu.component.html',
  styleUrls: ['./local-agency-profile-menu.component.scss']
})
export class LocalAgencyProfileMenuComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryID: string;
  private isViewing: boolean;
  private agencyId: string;
  private activeMap = new Map<string, boolean>();
  private officeTarget: string;
  private canCopy: boolean;

  private dashboardPath = "/dashboard/dashboard-overview"
  private dashboardPathDirector = "/director/director-overview"

  // @Input() isAgencyAdmin: boolean;

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
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["countryId"]) {
          this.countryID = params["countryId"];
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
    this.navigateObj("programme");
    // /director/director-overview;countryId=tPB9g8EwCLMceutAeAyWlYQUh8V2;isViewing=true;agencyId=qbyONHp4xqZy2eUw0kQHU7BAcov1;from=plan
  }

  viewingToOfficeCapacity() {
    console.log("view office capacity");
    this.navigateObj("officeCapacity")

  }

  viewingToPartners() {
    console.log("view partners");
    this.navigateObj("partners")

  }

  viewingToEquipment() {
    console.log("view equipment");
    this.navigateObj("equipment")
  }

  viewingToCoordination() {
    console.log("view coordination");
    this.navigateObj("coordination")
  }

  viewingToStockCapacity() {
    console.log("view stock capacity");
    this.navigateObj("stockCapacity")
  }

  viewingToDocuments() {
    console.log("view documents");
    this.navigateObj("documents")
  }

  viewingToContacts() {
    console.log("view contacts");
    this.navigateObj("contacts")
  }

  private handleMenuActive(type: string) {
    this.activeMap.forEach((v, k) => {
      this.activeMap.set(k, k == type);
    });
  }

  private navigateObj(officeTarget:string) {
    const obj = {
      "isViewing": this.isViewing,
      "countryId" : this.countryID,
      "agencyId": this.agencyId,
      "from": "officeProfile",
      "officeTarget": officeTarget,
      "isLocalAgency": true
    }
    if (this.canCopy) {
      obj["canCopy"] = true
    }
    this.router.navigate([this.canCopy ? this.dashboardPath : this.dashboardPathDirector, obj]);
  }

}
