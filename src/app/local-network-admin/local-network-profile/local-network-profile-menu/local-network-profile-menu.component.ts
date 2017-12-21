import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {LocalStorageService} from "angular-2-local-storage";

@Component({
  selector: 'app-local-network-profile-menu',
  templateUrl: './local-network-profile-menu.component.html',
  styleUrls: ['./local-network-profile-menu.component.css']
})
export class LocalNetworkProfileMenuComponent implements OnInit {

  private isViewing: boolean;
  private activeMap = new Map<string, boolean>();
  private networkViewValues: {};
  @Input() isNetworkCountry: boolean;
  private countryID: string;
  private isViewingFromExternal: boolean;
  private agencyId: string;
  private officeTarget: string;
  private canCopy: boolean;
  private networkId: string;
  private networkCountryId: string;

  constructor(private route: ActivatedRoute, private storageService: LocalStorageService, private router: Router) {
    this.initMenuActive();
  }


  ngOnInit() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params.subscribe((params: Params) => {
      if (params['isViewing']) {
        this.isViewing = params['isViewing'];
      }
      if (params["countryId"]) {
        this.countryID = params["countryId"];
      }
      if (params["isViewingFromExternal"]) {
        this.isViewingFromExternal = params["isViewingFromExternal"];
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
      if (params["networkId"]) {
        this.networkId = params["networkId"];
      }
      if (params["networkCountryId"]) {
        this.networkCountryId = params["networkCountryId"];
      }
    })
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

  private handleMenuActive(type: string) {
    this.activeMap.forEach((v, k) => {
      this.activeMap.set(k, k == type);
    });
  }

  goToProgrammes() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-programme', this.networkViewValues] : ['/network/local-network-office-profile/programme', this.networkViewValues])
  }

  goToOfficeCapacity() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-office-capacity', this.networkViewValues] : ['/network/local-network-office-profile/office-capacity', this.networkViewValues])
  }

  goToPartners() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-partners', this.networkViewValues] : ['/network/local-network-office-profile/partners', this.networkViewValues])
  }

  goToEquipment() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-equipment', this.networkViewValues] : ['/network/local-network-office-profile/equipment', this.networkViewValues])
  }

  goToCoordination() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-coordination', this.networkViewValues] : ['/network/local-network-office-profile/coordination', this.networkViewValues])
  }

  goToStockCapacity() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-stock-capacity', this.networkViewValues] : ['/network/local-network-office-profile/stock-capacity', this.networkViewValues])
  }

  goToDocuments() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-documents', this.networkViewValues] : ['/network/local-network-office-profile/documents', this.networkViewValues])
  }

  goToContacts() {
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-contacts', this.networkViewValues] : ['/network/local-network-office-profile/contacts', this.networkViewValues])
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "programme",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "officeCapacity",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "partners",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "equipment",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "coordination",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "stockCapacity",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "documents",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
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
        "canCopy": true,
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    } else {
      this.router.navigate(["/director/director-overview", {
        "countryId": this.countryID,
        "isViewing": this.isViewing,
        "agencyId": this.agencyId,
        "from": "officeProfile",
        "officeTarget": "contacts",
        "isViewingFromExternal": this.isViewingFromExternal,
        "networkId": this.networkId,
        "networkCountryId": this.networkCountryId
      }]);
    }
  }
}
