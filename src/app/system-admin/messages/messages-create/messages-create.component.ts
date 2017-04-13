import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
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
  private networkAdminsSelected: Boolean;
  private currentDateTimeInMilliseconds;
  private msgData = {};
  private groups: string[] = [];
  private subscriptions: RxHelper;
  private systemAdminGroupPath: string = Constants.APP_STATUS + '/group/systemadmin/';
  private systemAdminMessageRefPath: string = '/messageRef/systemadmin/';

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
      this.showAlert();
    }
  }

  private createNewMessage() {

    let subscription = this.af.database.list(this.systemAdminGroupPath).subscribe(groups => {
      if (groups.length == 0) {
        this.errorMessage = "MESSAGES.NO_USERS_IN_GROUP";
        this.showAlert();
        return;
      } else {
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
    });
    this.subscriptions.add(subscription);
  }

  private addMsgToMessageRef(key: string) {

    if (this.allUsersSelected) {

      let systemAdminAllUsersSelected: string = this.systemAdminGroupPath + 'allusersgroup/';
      let systemAdminAllUsersMessageRefPath: string = this.systemAdminMessageRefPath + 'allusersgroup/';

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
        });
      this.subscriptions.add(subscription);

    } else {

      if (this.agencyAdminsSelected) {
        this.groups.push('allagencyadminsgroup');
      }
      if (this.countryAdminsSelected) {
        this.groups.push('allcountryadminsgroup');
      }
      if (this.networkAdminsSelected) {
        this.groups.push('allnetworkadminsgroup');
      }

      for (let group of this.groups) {

        let path = this.systemAdminGroupPath + group;
        let subscription = this.af.database.list(path).subscribe(list => {
          list.forEach(item => {
            this.msgData[this.systemAdminMessageRefPath + group + '/' + item.$key + '/' + key] = this.currentDateTimeInMilliseconds;
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

  private showAlert() {
    this.inactive = false;
    let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.inactive = true;
    });
    this.subscriptions.add(subscription);
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
    } else if ((!this.allUsersSelected) && (!this.agencyAdminsSelected) && (!this.countryAdminsSelected) && (!this.networkAdminsSelected)) {
      this.errorMessage = "MESSAGES.NO_RECIPIENTS_ERROR";
      return false;
    }
    return true;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
