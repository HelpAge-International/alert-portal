import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {TranslateService} from "@ngx-translate/core";
import {Angulartics2GoogleAnalytics} from "angulartics2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  groups: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire,
              public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
              private translate: TranslateService) {


    translate.setDefaultLang("en");

  }


  login() {
    this.af.auth.login();
  }

  logout() {
    this.af.auth.logout();
  }
}
