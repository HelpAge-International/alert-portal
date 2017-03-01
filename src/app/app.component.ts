import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  groups: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire){

    // for testing purposes - testing connection to firebase
    this.groups = af.database.list('/sand/group')

    console.log(this.groups)
  }

  login() {
    this.af.auth.login();
  }

  logout() {
    this.af.auth.logout();
  }
}
