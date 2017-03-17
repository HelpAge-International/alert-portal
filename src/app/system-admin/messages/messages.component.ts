import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from '../../utils/Constants';
import {DialogService} from "../dialog/dialog.service";
import Promise = firebase.Promise;
import {Observable} from "rxjs";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private uid: string;
  private sentMessages: FirebaseObjectObservable<any>[] = [];

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
  }

  ngOnInit() {

    this.af.auth.subscribe(auth => {

      if (auth) {
        this.uid = auth.uid;

        this.af.database.list(Constants.APP_STATUS + "/systemAdmin/" + this.uid + "/sentmessages")
          .flatMap(list => {
            this.sentMessages = [];
            let tempList = [];
            list.forEach(x => {
              tempList.push(x)
            })
            return Observable.from(tempList)
          })
          .flatMap(item => {
            return this.af.database.object(Constants.APP_STATUS + "/message/" + item.$key)
          }).distinctUntilChanged()
          .subscribe(x => {
            console.log(x)
              this.sentMessages.push(x);
          })

      } else {
        // user is not logged in
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });
  }

  deleteMessage(sentMessage) {
    this.dialogService.createDialog('DELETE_MESSAGE_DIALOG.TITLE', 'DELETE_MESSAGE_DIALOG.CONTENT').subscribe(result => {
      if (result) {
        let key: string = sentMessage.$key;

        let msgData = {};

        msgData['/systemAdmin/' + this.uid + '/sentmessages/' + key] = null;
        msgData['/message/' + key] = null;

        var allUsersGroupPath: string = '/messageRef/allusergroup/';
        msgData[allUsersGroupPath + key] = null;

        var agencyGroupPath: string = Constants.APP_STATUS + '/messageRef/agencygroup/';
        var agencies: FirebaseListObservable<any> = this.af.database.list(agencyGroupPath);
        agencies.subscribe(agencies => {
          agencies.forEach(agency => {
            console.log('/messageRef/agencygroup/' + agency.$key + '/' + key);
            msgData['/messageRef/agencygroup/' + agency.$key + '/' + key] = null;
          });
        });

        var countryGroupPath: string = Constants.APP_STATUS + '/messageRef/countrygroup/';
        var countries: FirebaseListObservable<any> = this.af.database.list(countryGroupPath);
        countries.subscribe(countries => {
          countries.forEach(country => {
            console.log('/messageRef/countrygroup/' + country.$key + '/' + key);
            msgData['/messageRef/countrygroup/' + country.$key + '/' + key] = null;
          });
        });

        console.log(msgData);

        this.af.database.object(Constants.APP_STATUS).update(msgData).then(() => {
          console.log("Successful");
          this
        }, error => {
          console.log(error.message);
        });
      }
    });

  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
