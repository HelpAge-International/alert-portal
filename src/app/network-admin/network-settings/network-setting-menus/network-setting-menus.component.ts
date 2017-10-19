import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-network-setting-menus',
  templateUrl: './network-setting-menus.component.html',
  styleUrls: ['./network-setting-menus.component.css']
})
export class NetworkSettingMenusComponent implements OnInit {

  @Input() isLocalNetworkAdmin: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
