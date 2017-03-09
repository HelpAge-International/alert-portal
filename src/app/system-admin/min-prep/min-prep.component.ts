import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from '../../utils/Constants'
import {ActionType} from '../../utils/Enums'

@Component({
  selector: 'app-min-prep',
  templateUrl: './min-prep.component.html',
  styleUrls: ['./min-prep.component.css']
})

export class MinPrepComponent implements OnInit {

  private chsMinPrepActions: FirebaseListObservable<any>;

  constructor(private af: AngularFire) {

  }

  ngOnInit() {
    console.log(Constants.uid);

    this.chsMinPrepActions = this.af.database.list(Constants.APP_STATUS + "/agency/" + Constants.uid);
  }

}
