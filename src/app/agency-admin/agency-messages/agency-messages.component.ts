import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {DialogService} from "../../dialog/dialog.service";
import {Observable} from "rxjs";
import {RxHelper} from "../../utils/RxHelper";
import Promise = firebase.Promise;

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

          this.msgData["/administratorAgency/" + this.uid + "/sentmessages/" + key] = null;
          this.msgData["/message/" + key] = null;

          let agencyAllUsersGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/agencyallusersgroup';
          let agencyCountryAdminsGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/countryadmins';
          let agencyCountryDirectorsGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/countrydirectors';
          let agencyErtLeadsGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/ertleads';
          let agencyErtsGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/erts';

          let agencyAllUsersMsgRefPath: string = "/messageRef/agency/" + this.uid + '/agencyallusersgroup/';
          let agencyCountryAdminsMsgRef: string = "/messageRef/agency/" + this.uid + '/countryadmins/';
          let agencyCountryDirectorsMsgRef: string = "/messageRef/agency/" + this.uid + '/countrydirectors/';
          let agencyErtLeadsMsgRef: string = "/messageRef/agency/" + this.uid + '/ertleads/';
          let agencyErtsMsgRef: string = "/messageRef/agency/" + this.uid + '/erts/';

          let subscription = this.af.database.list(agencyAllUsersGroupPath)
            .do(list => {
              list.forEach(item => {
                this.msgData[agencyAllUsersMsgRefPath + item.$key + "/" + key] = null;
                console.log("Msg Ref Path - " + agencyAllUsersMsgRefPath + item.$key + "/" + key);

              })
            })
            .subscribe(() => {
              this.af.database.list(agencyCountryAdminsGroupPath)
                .do(list => {
                  list.forEach(item => {
                    this.msgData[agencyCountryAdminsMsgRef + item.$key + "/" + key] = null;
                  })
                })
                .subscribe(() => {
                  this.af.database.list(agencyCountryDirectorsGroupPath)
                    .do(list => {
                      list.forEach(item => {
                        this.msgData[agencyCountryDirectorsMsgRef + item.$key + "/" + key] = null;
                      })
                    })
                    .subscribe(() => {
                      this.af.database.list(agencyErtLeadsGroupPath)
                        .do(list => {
                          list.forEach(item => {
                            this.msgData[agencyErtLeadsMsgRef + item.$key + "/" + key] = null;
                          })
                        })
                        .subscribe(() => {
                          this.af.database.list(agencyErtsGroupPath)
                            .do(list => {
                              list.forEach(item => {
                                this.msgData[agencyErtsMsgRef + item.$key + "/" + key] = null;
                              })
                            })
                            .subscribe(() => {
                              this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
                                console.log("Message Ref successfully deleted from all nodes");
                              }).catch(error => {
                                console.log("Message deletion unsuccessful" + error);
                              });
                            })
                        })
                    })
                })
            });
          this.subscriptions.add(subscription);

        }
      }
    );
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
