import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {DialogService} from "../../dialog/dialog.service";
import Promise = firebase.Promise;
import {Observable} from "rxjs";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-agency-messages',
  templateUrl: './agency-messages.component.html',
  styleUrls: ['./agency-messages.component.css']
})

export class AgencyMessagesComponent implements OnInit, OnDestroy {

  private uid: string;
  private sentMessages: FirebaseObjectObservable<any>[] = [];
  private msgData = {};
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {

      if (auth) {
        this.uid = auth.uid;

        let subscription = this.af.database.list(Constants.APP_STATUS + "/administratorAgency/" + this.uid + "/sentmessages")
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
        this.subscriptions.add(subscription);
      } else {
        // user is not logged in
        console.log("Error occurred - User is not logged in");
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  deleteMessage(sentMessage) {

    console.log("Delete button pressed");
    this.dialogService.createDialog("DELETE_MESSAGE_DIALOG.TITLE", "DELETE_MESSAGE_DIALOG.CONTENT").subscribe(result => {

      if (result) {

        let key: string = sentMessage.$key;
        let agencyMessageRefPath: string = '/messageRef/agency/';

        this.msgData["/administratorAgency/" + this.uid + "/sentmessages/" + key] = null;
        this.msgData["/message/" + key] = null;
        this.msgData[agencyMessageRefPath + 'agencyallusersgroup/' + this.uid + '/' + key] = null;
        this.msgData[agencyMessageRefPath + '/countryadmins/' + this.uid + '/' + key] = null;
        this.msgData[agencyMessageRefPath + '/countrydirectors/' + this.uid + '/' + key] = null;
        this.msgData[agencyMessageRefPath + '/ertleads/' + this.uid + '/' + key] = null;
        this.msgData[agencyMessageRefPath + '/erts/' + this.uid + '/' + key] = null;


        this.af.database.object(Constants.APP_STATUS).update(this.msgData)
          .then(_ => {
            console.log("Message successfully deleted from all nodes");

          }).catch(error => {
          console.log("Message deletion unsuccessful" + error);
        });
      }

    });
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
