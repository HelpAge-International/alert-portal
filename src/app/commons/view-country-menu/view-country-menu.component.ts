import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-view-country-menu',
  templateUrl: './view-country-menu.component.html',
  styleUrls: ['./view-country-menu.component.css']
})
export class ViewCountryMenuComponent implements OnInit {

  @Output() onMenuSelected = new EventEmitter<string>();

  private menuSelected = "officeProfile";
  private menuMap = new Map<string, boolean>();

  constructor() {
    this.menuMap.set("officeProfile", false);
    this.menuMap.set("risk", false);
    this.menuMap.set("preparedness", false);
    this.menuMap.set("plan", false);
  }

  ngOnInit() {
    this.handleActiveClass("officeProfile");
  }

  private handleActiveClass(name: string) {
    this.menuMap.forEach((v, k) => {
      k == name ? v = true : v = false;
    });
  }

  menuSelection(menu: string) {
    this.onMenuSelected.emit(menu);
    this.menuSelected = menu;
    this.handleActiveClass(menu);
  }
}
