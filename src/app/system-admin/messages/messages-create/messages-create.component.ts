import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Message} from '../../../model/message';
import {Constants} from '../../../utils/Constants';

@Component({
  selector: 'app-messages-create',
  templateUrl: './messages-create.component.html',
  styleUrls: ['./messages-create.component.css']
})

export class MessagesCreateComponent implements OnInit {

  private inactive: Boolean = true;
  private errorMessage: any;
  private messageTitle: string;
  private messageContent: string;
  private path: string = '';
  private allUsersSelected: Boolean;
  private agencyAdminsSelected: Boolean;
  private countryAdminsUsersSelected: Boolean;

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
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

    var newMessage: Message = new Message(Constants.uid, this.messageTitle, this.messageContent, 10000000);
    this.path = Constants.APP_STATUS + '/message';

    this.af.database.list(this.path).push(newMessage)
      .then(msgId => {
          console.log('New Message added');
          this.router.navigateByUrl('/system-admin/messages');

          this.path = Constants.APP_STATUS + '/systemAdmin/' + Constants.uid + '/sentmessages';
          this.af.database.list(this.path).push(msgId.key)
            .then(_ => {
                console.log('Message id added to system admin');
              }
            );

          this.addMsgToMessageRef(msgId.key);
        }
      );
  }

  private addMsgToMessageRef(msgId: string) {

    if (this.allUsersSelected) {
      this.path = Constants.APP_STATUS + '/messageRef/allusergroup/';
      this.af.database.list(this.path).push(msgId)
        .then(_ => {
            console.log('Message id added to all users group in messageRef');
          }
        );
    }

    if (this.agencyAdminsSelected) {
      this.path = Constants.APP_STATUS + '/messageRef/agencygroup';
      var agencies: FirebaseListObservable<any>;
      agencies = this.af.database.list(this.path);
      console.log('agencies-'+agencies);
      /*agencies.forEach(agency=> {
            console.log(agency.$key);

            this.path = Constants.APP_STATUS + '/messageRef/agencygroup/' + agency.$key;
            this.af.database.list(this.path).push(msgId)
              .then(_ => {
                  console.log('Message id added to agency group in messageRef');
                }
              )
          });*/
    }

    if (this.countryAdminsUsersSelected) {
      this.path = Constants.APP_STATUS + '/messageRef/countrygroup';
      this.af.database.list(this.path).push(msgId)
        .then(_ => {
            console.log('Message id added to country group in messageRef');
          }
        );
    }

  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * @returns {boolean}
   */
  private validate() {

    if (!Boolean(this.messageTitle)) {
      this.errorMessage = "Please enter a title for the message";
      return false;
    } else if (!Boolean(this.messageContent)) {
      this.errorMessage = "Please add some content to the message";
      return false;
    } else if ((!this.allUsersSelected) && (!this.agencyAdminsSelected) && (!this.countryAdminsUsersSelected)) {
      this.errorMessage = "Please select the recipients group";
      return false;
    }
    return true;
  }

}
