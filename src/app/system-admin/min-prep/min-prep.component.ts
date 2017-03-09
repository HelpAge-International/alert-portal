import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { Router } from "@angular/router";
import { Action } from '../../model/action';
import { Constants } from '../../utils/Constants';
import { ActionType } from '../../utils/Enums';

@Component({
  selector: 'app-min-prep',
  templateUrl: './min-prep.component.html',
  styleUrls: ['./min-prep.component.css']
})

export class MinPrepComponent implements OnInit {

  private chsMinPrepActions: FirebaseListObservable<any>;

  private path: string =  '';
  // ActionType = ActionType;

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.path = Constants.APP_STATUS + "/action/" + auth.uid;
        this.chsMinPrepActions = this.af.database.list(this.path, {
          query: {
            orderByChild: 'type',
            equalTo: ActionType.chs
          }
        });
      } else {
        // user is not logged in
        console.log("Error occurred - User isn't logged in");
        this.router.navigateByUrl("/login");
      }
    });
  }

  editChsMinPrepAction(chsMinPrepAction: Action) {
    // TODO - After add chs action is implemented
    console.log("Edit button pressed");
  }

  deleteChsMinPrepAction(chsMinPrepAction) {
    console.log("Delete button pressed");
      this.af.database.object(this.path+ "/" + chsMinPrepAction.$key).remove()
        .then(_ =>
        console.log("Chs action deleteed")
        );
  }
}
