import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, AngularFireAuth} from "angularfire2";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-system-admin-header',
  templateUrl: 'system-admin-header.component.html',
  styleUrls: ['system-admin-header.component.css']
})
export class SystemAdminHeaderComponent implements OnInit {

  uid: string;
  firstName: string ="";
  lastName: string ="";

  constructor(private af: AngularFire) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      this.uid = user.auth.uid;
      if (this.uid) {
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid).subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
      }
    });

  }

}
