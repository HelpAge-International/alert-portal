import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-local-agency-settings-menu',
  templateUrl: './local-agency-settings-menu.component.html',
  styleUrls: ['./local-agency-settings-menu.component.scss']
})
export class LocalAgencySettingsMenuComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor() { }

  ngOnInit() {
  }
  
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
