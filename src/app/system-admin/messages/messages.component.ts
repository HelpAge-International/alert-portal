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
  private msgData = {};

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

        this.msgData['/systemAdmin/' + this.uid + '/sentmessages/' + key] = null;
        this.msgData['/message/' + key] = null;
        var allUsersGroupPath: string = '/messageRef/allusergroup/';
        this.msgData[allUsersGroupPath + key] = null;

        var agencyGroupPath: string = Constants.APP_STATUS + '/group/agencygroup/';
        var countryGroupPath: string = Constants.APP_STATUS + '/group/countrygroup/';
        this.af.database.list(agencyGroupPath)
          .do(list => {
            list.forEach(item => {
              this.msgData['/messageRef/agencygroup/' + item.$key + '/' + key] = null;
              console.log("item key: " + item.$key);
            })
          })
          .subscribe(() => {
            let subscription = this.af.database.list(countryGroupPath)
              .do(list => {
                list.forEach(item => {
                  this.msgData['/messageRef/countrygroup/' + item.$key + '/' + key] = null;
                  console.log("item key: " + item.$key);
                })
              }).subscribe(() => {
                this.af.database.object(Constants.APP_STATUS).update(this.msgData);
            });
            console.log("Done")
          })
        // agencies.toPromise().then(success => {
        //
        // }).
        //
        // agencies.do(agencies => {
        //   agencies.forEach(agency => {
        //     console.log('/messageRef/agencygroup/' + agency.$key + '/' + key);
        //     this.msgData['/messageRef/agencygroup/' + agency.$key + '/' + key] = null;
        //   });
        // }).subscribe(_ => {
        //   this.af.database.object(Constants.APP_STATUS).update(this.msgData);
        // });
      }
    });

  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
