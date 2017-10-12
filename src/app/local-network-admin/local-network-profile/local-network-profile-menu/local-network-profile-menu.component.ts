import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-local-network-profile-menu',
  templateUrl: './local-network-profile-menu.component.html',
  styleUrls: ['./local-network-profile-menu.component.css']
})
export class LocalNetworkProfileMenuComponent implements OnInit {

  @Input() isNetworkCountry : boolean;

  constructor() { }

  ngOnInit() {
  }

}
