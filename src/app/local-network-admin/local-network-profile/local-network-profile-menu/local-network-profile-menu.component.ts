import {Component, Input, OnInit} from '@angular/core';
import {Params, ActivatedRoute, Router} from "@angular/router";
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
  @Input() isNetworkCountry : boolean;

  constructor(private route: ActivatedRoute, private storageService: LocalStorageService, private router: Router) { }


  ngOnInit() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params.subscribe((params: Params) => {
      if (params['isViewing']) {
        this.isViewing = params['isViewing'];
      }
    })
  }

  goToProgrammes(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-programme', this.networkViewValues] : ['/network/local-network-office-profile/programme', this.networkViewValues])
  }

  goToOfficeCapacity(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-office-capacity', this.networkViewValues] : ['/network/local-network-office-profile/office-capacity', this.networkViewValues])
  }

  goToPartners(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-partners', this.networkViewValues] : ['/network/local-network-office-profile/partners', this.networkViewValues])
  }

  goToEquipment(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-equipment', this.networkViewValues] : ['/network/local-network-office-profile/equipment', this.networkViewValues])
  }

  goToCoordination(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-coordination', this.networkViewValues] : ['/network/local-network-office-profile/coordination', this.networkViewValues])
  }

  goToStockCapacity(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-stock-capacity', this.networkViewValues] : ['/network/local-network-office-profile/stock-capacity', this.networkViewValues])
  }

  goToDocuments(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-documents', this.networkViewValues] : ['/network/local-network-office-profile/documents', this.networkViewValues])
  }

  goToContacts(){
    this.router.navigate(this.isNetworkCountry ? ['/network-country/network-country-office-profile-contacts', this.networkViewValues] : ['/network/local-network-office-profile/contacts', this.networkViewValues])
  }
}
