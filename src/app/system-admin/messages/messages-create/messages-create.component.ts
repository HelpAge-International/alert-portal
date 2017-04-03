import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Message} from '../../../model/message';
import {Constants} from '../../../utils/Constants';
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";

@Component({
  selector: 'app-messages-create',
  templateUrl: './messages-create.component.html',
  styleUrls: ['./messages-create.component.css']
})

export class MessagesCreateComponent implements OnInit, OnDestroy {

  private uid: string;
  private inactive: Boolean = true;
  private errorMessage: any;
  private alerts = {};
  private messageTitle: string;
  private messageContent: string;
  private allUsersSelected: Boolean;
  private agencyAdminsSelected: Boolean;
  private countryAdminsSelected: Boolean;
  private currentDateTimeInMilliseconds;
  private msgData = {};
  private groups: string[] = [];
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("uid: " + this.uid);
      } else {
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.msgData = {};
    this.subscriptions.releaseAll();
  }

  onSubmit() {

    if (this.validate()) {
      this.createNewMessage();
      this.inactive = true;
    } else {
      this.inactive = false;
      Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.inactive = true;
      })
    }
  }

  private createNewMessage() {

    this.currentDateTimeInMilliseconds = new Date().getTime();

    let newMessage: Message = new Message(this.uid, this.messageTitle, this.messageContent, this.currentDateTimeInMilliseconds);
    let messagePath = Constants.APP_STATUS + '/message';

    this.af.database.list(messagePath).push(newMessage)
      .then(msgId => {
        console.log('New Message added to message node');

        let sentMsgPath = '/systemAdmin/' + this.uid + '/sentmessages/' + msgId.key;
        this.msgData[sentMsgPath] = true;
        this.addMsgToMessageRef(msgId.key);
      });
  }

  private addMsgToMessageRef(key: string) {

    let systemAdminGroupPath: string = Constants.APP_STATUS + '/group/systemadmin/';
    let systemAdminMessageRefPath: string = '/messageRef/systemadmin/';

    if (this.allUsersSelected) {

      let systemAdminAllUsersSelected: string = systemAdminGroupPath + 'allusersgroup/';
      let systemAdminAllUsersMessageRefPath: string = systemAdminMessageRefPath + 'allusersgroup/';

      let subscription = this.af.database.list(systemAdminAllUsersSelected)
        .subscribe(allUsersIds => {
          allUsersIds.forEach(userId => {
            this.msgData[systemAdminAllUsersMessageRefPath + userId.$key + '/' + key] = this.currentDateTimeInMilliseconds;
          });

          this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
            console.log("Message Ref successfully added to all nodes");
            this.router.navigate(['/system-admin/messages']);
          }).catch(error => {
            console.log("Message creation unsuccessful" + error);
          });
        })
      this.subscriptions.add(subscription);

    } else {

      if (this.agencyAdminsSelected) {
        this.groups.push('allagencyadminsgroup');
      }
      if (this.countryAdminsSelected) {
        this.groups.push('allcountryadminsgroup');
      }

      for (let group of this.groups) {

        let path = systemAdminGroupPath + group;
        let subscription = this.af.database.list(path).subscribe(list => {
          list.forEach(item => {
            this.msgData[systemAdminMessageRefPath + group + '/' + item.$key + '/' + key] = this.currentDateTimeInMilliseconds;
          });

          if (this.groups.indexOf(group) == this.groups.length - 1) {
            this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
              console.log("Message Ref successfully added to all nodes");
              this.router.navigate(['/system-admin/messages']);
            }).catch(error => {
              console.log("Message creation unsuccessful" + error);
            });
          }
        });
        this.subscriptions.add(subscription);
      }
    }

  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * @returns {boolean}
   */
  private validate() {

    if (!(this.messageTitle)) {
      this.alerts[this.messageTitle] = true;
      this.errorMessage = "MESSAGES.NO_TITLE_ERROR";
      return false;
    } else if (!(this.messageContent)) {
      this.alerts[this.messageContent] = true;
      this.errorMessage = "MESSAGES.NO_CONTENT_ERROR";
      return false;
    } else if ((!this.allUsersSelected) && (!this.agencyAdminsSelected) && (!this.countryAdminsSelected)) {
      this.errorMessage = "MESSAGES.NO_RECIPIENTS_ERROR";
      return false;
    }
    return true;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
