import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Constants} from "../utils/Constants";
import {ModelAgency} from "../model/agency.model";
import {Router} from "@angular/router";


@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})

export class SystemAdminComponent implements OnInit {

  agencies: FirebaseListObservable<any>;
  uid: string;

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.subscribe(x => {
      if (x) {
        this.uid = x.auth.uid;
        console.log("uid: " + this.uid);
        this.agencies = this.af.database.list(Constants.APP_STATUS + "/agency");
      } else {
        this.navigateToLogin();
      }
    });

  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  toggleActive(agency) {
    agency.isActive = !agency.isActive;
    console.log(agency.isActive);
    this.af.database.object(Constants.APP_STATUS + "/agency/" + agency.$key + "/isActive").set(agency.isActive);
  }

  editAgency(agency) {
    this.router.navigate(['/system-admin/add-agency', {id: agency.$key}]);
  }

}
