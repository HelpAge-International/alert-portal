import {Component, Input, OnInit} from '@angular/core';
import {LocalStorageService} from "angular-2-local-storage";
import {Constants} from "../../utils/Constants";
import {NetworkViewModel} from "../../country-admin/country-admin-header/network-view.model";
import {CommonUtils} from "../../utils/CommonUtils";

@Component({
  selector: 'app-network-country-menu',
  templateUrl: './network-country-menu.component.html',
  styleUrls: ['./network-country-menu.component.css']
})
export class NetworkCountryMenuComponent implements OnInit {

  private networkViewModel: NetworkViewModel;
  private networkViewValues: {};
  @Input() isViewing:boolean;

  constructor(private storageService: LocalStorageService) {
  }

  ngOnInit() {
    let obj = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    if (obj) {
      this.networkViewModel = new NetworkViewModel(null, null, null, null, null, null, null, null);
      this.networkViewModel.mapFromObject(obj)
      this.networkViewValues = CommonUtils.buildNetworkViewValues(this.networkViewModel);
    }
  }

}
