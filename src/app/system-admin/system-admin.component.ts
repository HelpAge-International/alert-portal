import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../utils/Constants";
import {ModelAgency} from "../model/agency.model";
import {MdDialog} from "@angular/material";
import {Router} from "@angular/router";


@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})

export class SystemAdminComponent implements OnInit {

  agencies: FirebaseListObservable<any>;

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.agencies = this.af.database.list(Constants.APP_STATUS + "/agency");
  }

  toggleActive(agency: ModelAgency) {
    console.log(agency);
    agency.isActive = !agency.isActive;
  }

  editAgency(agency) {
    this.router.navigate(['/system-admin/add-agency', {id: agency.$key}]);
  }

}
