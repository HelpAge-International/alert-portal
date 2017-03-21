import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Message} from '../../../model/message';
import {Constants} from '../../../utils/Constants';
import {RxHelper} from "../../../utils/RxHelper";

@Component({
  selector: 'app-create-edit-message',
  templateUrl: './create-edit-message.component.html',
  styleUrls: ['./create-edit-message.component.css']
})

export class CreateEditMessageComponent implements OnInit, OnDestroy {

  private uid: string;
  private inactive: Boolean = true;
  private errorMessage: any;
  private messageTitle: string;
  private messageContent: string;
  private path: string;
  private allUsersSelected: Boolean;
  private countryAdminsSelected: Boolean;
  private countryDirectorsSelected: Boolean;
  private ertLeadsSelected: Boolean;
  private ertsSelected: Boolean;
  private msgData = {};
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("uid: " + this.uid);
      } else {
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {

    if (this.validate()) {
      this.createNewMessage();
      this.inactive = true;
    } else {
      this.inactive = false;
    }
  }

  private createNewMessage() {

    var currentDate = new Date();
    var currentDateInMilliseconds = currentDate.getTime();

    var newMessage: Message = new Message(this.uid, this.messageTitle, this.messageContent, currentDateInMilliseconds);
    this.path = Constants.APP_STATUS + '/message';

    this.af.database.list(this.path).push(newMessage)
      .then(msgId => {
        console.log('New Message added to message node');

        this.msgData['/administratorAgency/' + this.uid + '/sentmessages/' + msgId.key] = true;
        this.addMsgToMessageRef(msgId.key);
      });
  }

  private addMsgToMessageRef(key: string) {

    let agencyMessageRefPath: string = '/messageRef/agency/';

    if (this.allUsersSelected) {
      this.msgData[agencyMessageRefPath + 'agencyallusersgroup/' + this.uid + '/' + key] = true;
      console.log(agencyMessageRefPath + 'agencyallusersgroup/' + this.uid + '/' + key);

    } else {

      if (this.countryAdminsSelected) {
        this.msgData[agencyMessageRefPath + '/countryadmins/' + this.uid + '/' + key] = true;
      }

      if (this.countryDirectorsSelected) {
        this.msgData[agencyMessageRefPath + '/countrydirectors/' + this.uid + '/' + key] = true;
      }

      if (this.ertLeadsSelected) {
        this.msgData[agencyMessageRefPath + '/ertleads/' + this.uid + '/' + key] = true;
      }

      if (this.ertsSelected) {
        this.msgData[agencyMessageRefPath + '/erts/' + this.uid + '/' + key] = true;
      }
    }

    this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
      console.log("Message Ref successfully added to all nodes");
      this.router.navigate(['/agency-admin/agency-messages']);
    });

  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * @returns {boolean}
   */
  private validate() {

    if (!Boolean(this.messageTitle)) {
      this.errorMessage = "MESSAGES.NO_TITLE_ERROR";
      return false;
    } else if (!Boolean(this.messageContent)) {
      this.errorMessage = "MESSAGES.NO_CONTENT_ERROR";
      return false;
    } else if ((!this.allUsersSelected) && (!this.countryAdminsSelected) && (!this.countryDirectorsSelected)
      && (!this.ertLeadsSelected) && (!this.ertsSelected)) {
      this.errorMessage = "MESSAGES.NO_RECIPIENTS_ERROR";
      return false;
    }
    return true;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
