import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {DialogService} from "../dialog/dialog.service";
import Promise = firebase.Promise;
import {Observable} from "rxjs";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

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

        let subscription = this.af.database.list(Constants.APP_STATUS + "/systemAdmin/" + this.uid + "/sentmessages")
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

    this.dialogService.createDialog("DELETE_MESSAGE_DIALOG.TITLE", "DELETE_MESSAGE_DIALOG.CONTENT").subscribe(result => {

      if (result) {

        let key: string = sentMessage.$key;

        var allUsersGroupPath: string = "/messageRef/allusergroup/";
        var agencyGroupPath: string = Constants.APP_STATUS + "/group/agencygroup/";
        var countryGroupPath: string = Constants.APP_STATUS + "/group/countrygroup/";

        this.msgData["/systemAdmin/" + this.uid + "/sentmessages/" + key] = null;
        this.msgData["/message/" + key] = null;
        this.msgData[allUsersGroupPath + key] = null;

        let subscription = this.af.database.list(agencyGroupPath)
          .do(list =>{
            list.forEach(item => {
              this.msgData["/messageRef/agencygroup/"+item.$key+"/"+key]=null;
              console.log("item key: "+item.$key);
            })
          })
          .subscribe(() => {
            this.af.database.list(countryGroupPath)
              .do(list =>{
                list.forEach(item => {
                  this.msgData["/messageRef/countrygroup/"+item.$key+"/"+key]=null;
                  console.log("item key: "+item.$key);
                })
              }).subscribe(() => {
              this.af.database.object(Constants.APP_STATUS).update(this.msgData);
              console.log("Message Ref successfully deleted from all nodes");
            })
          })
        this.subscriptions.add(subscription);

      }
    });

  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
