import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-mpa',
  templateUrl: './mpa.component.html',
  styleUrls: ['./mpa.component.css']
})
export class MpaComponent implements OnInit {
  actions;

  constructor(private af: AngularFire) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + user.auth.uid, {
        query: {
          orderByChild: "type",
          equalTo: 1
        }
      });
    });
  }

}
