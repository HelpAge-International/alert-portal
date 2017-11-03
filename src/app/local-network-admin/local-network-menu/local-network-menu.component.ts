import {Component, Input, OnInit} from '@angular/core';
import {LocalNetworkViewModel} from "../../country-admin/country-admin-header/local-network-view.model";
import {LocalStorageService} from "angular-2-local-storage";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-local-network-menu',
  templateUrl: './local-network-menu.component.html',
  styleUrls: ['./local-network-menu.component.css']
})
export class LocalNetworkMenuComponent implements OnInit {

  @Input() isViewing: boolean
  private networkViewModel: LocalNetworkViewModel;

  constructor(private storageService: LocalStorageService) {
  }

  ngOnInit() {
    let obj = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    if (obj) {
      this.isViewing = true;
      this.networkViewModel = new LocalNetworkViewModel(null, null, null, null, null, null, null);
      this.networkViewModel.mapFromObject(obj)
    }
  }

}
