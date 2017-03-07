import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";


@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})
export class SystemAdminComponent implements OnInit {

  agencies:FirebaseListObservable<any>;

  constructor(private af:AngularFire) { }

  ngOnInit() {
    this.agencies = this.af.database.list("/sand/agency");
  }

}
