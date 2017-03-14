import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {isSuccess} from "@angular/http/src/http_utils";
import {MdDialog} from "@angular/material";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-system-admin-header',
  templateUrl: 'system-admin-header.component.html',
  styleUrls: ['system-admin-header.component.css']
})
export class SystemAdminHeaderComponent implements OnInit {

  uid: string;
  firstName: string = "";
  lastName: string = "";

  constructor(private af: AngularFire, private router: Router, public dialog:MdDialog) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid).subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  showSetting() {
    console.log("show setting");
    this.af.auth.logout();
  }

  test() {
    console.log("open dialog")
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log("dialog closed");
    });
  }

}
