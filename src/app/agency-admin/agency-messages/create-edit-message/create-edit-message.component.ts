import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Router} from '@angular/router';
import {Message} from '../../../model/message';
import {Constants} from '../../../utils/Constants';
import {RxHelper} from '../../../utils/RxHelper';
import {Observable} from "rxjs";

@Component({
  selector: 'app-create-edit-message',
  templateUrl: './create-edit-message.component.html',
  styleUrls: ['./create-edit-message.component.css']
})

export class CreateEditMessageComponent implements OnInit, OnDestroy {

  private uid: string;
  private inactive: Boolean = true;
  private errorMessage: any;
  private alerts = {};
  private messageTitle: string;
  private messageContent: string;
  private allUsersSelected: Boolean;
  private globalDirectorSelected: Boolean;
  private globalUserSelected: Boolean;
  private regionalDirectorSelected: Boolean;
  private countryAdminsSelected: Boolean;
  private countryDirectorsSelected: Boolean;
  private ertLeadsSelected: Boolean;
  private ertsSelected: Boolean;
  private donorSelected: Boolean;
  private partnerSelected: Boolean;
  private currentDateTimeInMilliseconds;
  private msgData = {};
  private groups: string[] = [];

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log('uid: ' + this.uid);
      } else {
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });
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

        let sentMsgPath = '/administratorAgency/' + this.uid + '/sentmessages/' + msgId.key;
        this.msgData[sentMsgPath] = true;
        this.addMsgToMessageRef(msgId.key);
      });
  }

  private addMsgToMessageRef(key: string) {

    let agencyGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/';
    let agencyMessageRefPath: string = '/messageRef/agency/' + this.uid + '/';

    if (this.allUsersSelected) {

      let agencyAllUsersSelected: string = agencyGroupPath + 'agencyallusersgroup/';
      let agencyAllUsersMessageRefPath: string = agencyMessageRefPath + 'agencyallusersgroup/';

      this.af.database.list(agencyAllUsersSelected)
        .subscribe(agencyAllUsersIds => {
          agencyAllUsersIds.forEach(agencyAllUsersId => {
            this.msgData[agencyAllUsersMessageRefPath + agencyAllUsersId.$key + '/' + key] = this.currentDateTimeInMilliseconds;
          });

          this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
            console.log("Message Ref successfully added to all nodes");
            this.router.navigate(['/agency-admin/agency-messages']);
          }).catch(error => {
            console.log("Message creation unsuccessful" + error);
          });
        })

    } else {

      if (this.globalDirectorSelected) {
        this.groups.push('globaldirector');
      }
      if (this.globalUserSelected) {
        this.groups.push('globaluser');
      }
      if (this.regionalDirectorSelected) {
        this.groups.push('regionaldirector');
      }
      if (this.countryAdminsSelected) {
        this.groups.push('countryadmins');
      }
      if (this.countryDirectorsSelected) {
        this.groups.push('countrydirectors');
      }
      if (this.ertLeadsSelected) {
        this.groups.push('ertleads');
      }
      if (this.ertsSelected) {
        this.groups.push('erts');
      }
      if (this.donorSelected) {
        this.groups.push('donor');
      }
      if (this.partnerSelected) {
        this.groups.push('partner');
      }

      for (let group of this.groups) {

        let path = agencyGroupPath + group;
        let subscription = this.af.database.list(path).subscribe(list => {
          list.forEach(item => {
            this.msgData[agencyMessageRefPath + group + '/' + item.$key + '/' + key] = this.currentDateTimeInMilliseconds;
          });

          if (this.groups.indexOf(group) == this.groups.length-1) {
            this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
              console.log("Message Ref successfully added to all nodes");
              this.router.navigate(['/agency-admin/agency-messages']);
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

    if (!Boolean(this.messageTitle)) {
      this.alerts[this.messageTitle] = true;
      this.errorMessage = 'MESSAGES.NO_TITLE_ERROR';
      return false;
    } else if (!Boolean(this.messageContent)) {
      this.alerts[this.messageContent] = true;
      this.errorMessage = 'MESSAGES.NO_CONTENT_ERROR';
      return false;
    } else if ((!this.allUsersSelected)
      && (!this.globalDirectorSelected)
      && (!this.globalUserSelected)
      && (!this.regionalDirectorSelected)
      && (!this.countryAdminsSelected)
      && (!this.countryDirectorsSelected)
      && (!this.ertLeadsSelected)
      && (!this.ertsSelected)
      && (!this.donorSelected)
      && (!this.partnerSelected)) {
      this.errorMessage = 'MESSAGES.NO_RECIPIENTS_ERROR';
      return false;
    }
    return true;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
