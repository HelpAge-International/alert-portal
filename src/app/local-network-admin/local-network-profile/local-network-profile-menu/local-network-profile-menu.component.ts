import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, NavigationEnd, NavigationStart} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {LocalStorageService} from "angular-2-local-storage";
import {Subject} from "rxjs/Subject";


@Component({
  selector: 'app-local-network-profile-menu',
  templateUrl: './local-network-profile-menu.component.html',
  styleUrls: ['./local-network-profile-menu.component.css']
})
export class LocalNetworkProfileMenuComponent implements OnInit,OnDestroy {

  private ngUnSubscribe:Subject<any> = new Subject

  ngOnDestroy(): void {
    this.ngUnSubscribe.next()
    this.ngUnSubscribe.complete()
  }

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
  private agencyOverview: boolean;

  constructor(private route: ActivatedRoute, private storageService: LocalStorageService, private router: Router) {
    this.initMenuActive();

    this.router.events.takeUntil(this.ngUnSubscribe).subscribe((event) => {
      //Update highlight on sub menu when navigating from dropdown menu
      if(event instanceof NavigationEnd) {
        if (event.url.includes("programme")) {
          this.handleMenuActive("programme");
        }
        else if (event.url.includes("officeCapacity")) {
          this.handleMenuActive("officeCapacity");
        }
        else if (event.url.includes("partners")) {
          this.handleMenuActive("partners");
        }
        else if (event.url.includes("equipment")) {
          this.handleMenuActive("equipment");
        }
        else if (event.url.includes("coordination")) {
          this.handleMenuActive("coordination");
        }
        else if (event.url.includes("stockCapacity")) {
          this.handleMenuActive("stockCapacity");
        }
        else if (event.url.includes("documents")) {
          this.handleMenuActive("documents");
        }
        else if (event.url.includes("contacts")) {
          this.handleMenuActive("contacts");
        }
        else {
          throw new Error("Local-Network-Profile-Menu: Invalid Url Arg");
        }
      }
    });
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
        console.log(params["officeTarget"]);
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
      if (params["agencyOverview"]) {
        this.agencyOverview = params["agencyOverview"];
      }
    });
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
    this.networkViewValues["officeTarget"] = "programme"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-programme', this.networkViewValues] : ['/network/local-network-office-profile/programme', this.networkViewValues])
  }

  goToOfficeCapacity() {
    console.log(this.networkViewValues)
    this.networkViewValues["officeTarget"] = "officeCapacity"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-office-capacity', this.networkViewValues] : ['/network/local-network-office-profile/office-capacity', this.networkViewValues])
  }

  goToPartners() {
    this.networkViewValues["officeTarget"] = "partners"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-partners', this.networkViewValues] : ['/network/local-network-office-profile/partners', this.networkViewValues])
  }

  goToEquipment() {
    this.networkViewValues["officeTarget"] = "equipment"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-equipment', this.networkViewValues] : ['/network/local-network-office-profile/equipment', this.networkViewValues])
  }

  goToCoordination() {
    this.networkViewValues["officeTarget"] = "coordination"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-coordination', this.networkViewValues] : ['/network/local-network-office-profile/coordination', this.networkViewValues])
  }

  goToStockCapacity() {
    this.networkViewValues["officeTarget"] = "stockCapacity"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-stock-capacity', this.networkViewValues] : ['/network/local-network-office-profile/stock-capacity', this.networkViewValues])
  }

  goToDocuments() {
    this.networkViewValues["officeTarget"] = "documents"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-documents', this.networkViewValues] : ['/network/local-network-office-profile/documents', this.networkViewValues])
  }

  goToContacts() {
    this.networkViewValues["officeTarget"] = "contacts"
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-contacts', this.networkViewValues] : ['/network/local-network-office-profile/contacts', this.networkViewValues])
  }

  viewingToProgramme() {
    console.log("view programme");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "programme"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }

    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
    // /director/director-overview;countryId=tPB9g8EwCLMceutAeAyWlYQUh8V2;isViewing=true;agencyId=qbyONHp4xqZy2eUw0kQHU7BAcov1;from=plan
  }

  viewingToOfficeCapacity() {
    console.log("view office capacity");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "officeCapacity"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
  }

  viewingToPartners() {
    console.log("view partners");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "partners"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
  }

  viewingToEquipment() {
    console.log("view equipment");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "equipment"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
  }

  viewingToCoordination() {
    console.log("view coordination");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "coordination"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
  }

  viewingToStockCapacity() {
    console.log("view stock capacity");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "stockCapacity"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
  }

  viewingToDocuments() {
    console.log("view documents");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "documents"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
  }

  viewingToContacts() {
    console.log("view contacts");
    let data = {}
    data["countryId"] = this.countryID
    data["isViewing"] = this.isViewing
    data["agencyId"] = this.agencyId
    data["from"] = "officeProfile"
    data["officeTarget"] = "contacts"
    data["isViewingFromExternal"] = this.isViewingFromExternal
    data["networkId"] = this.networkId
    if (this.canCopy) {
      data["canCopy"] = this.canCopy
    }
    if (this.agencyOverview) {
      data["agencyOverview"] = this.agencyOverview
    }
    if (this.networkCountryId) {
      data["networkCountryId"] = this.networkCountryId
    }
    if (this.canCopy) {
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    } else {
      this.router.navigate(["/director/director-overview", data]);
    }
  }
}
