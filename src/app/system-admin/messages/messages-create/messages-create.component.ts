import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { Router } from "@angular/router";
import { Message } from '../../../model/message';
import { Constants } from '../../../utils/Constants';

@Component({
  selector: 'app-messages-create',
  templateUrl: './messages-create.component.html',
  styleUrls: ['./messages-create.component.css']
})


export class MessagesCreateComponent implements OnInit {

  private uid: string;
  private inactive: Boolean = true;
  private errorMessage: any;
  private messageTitle: string;
  private messageContent: string;
  private path: string;
  private allUsersSelected: Boolean;
  private agencyAdminsSelected: Boolean;
  private countryAdminsSelected: Boolean;

  constructor(private af: AngularFire, private router: Router) {
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
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
          console.log('New Message added');

          this.path = Constants.APP_STATUS + '/systemAdmin/' + this.uid + '/sentmessages/';
          this.af.database.object(this.path + msgId.key).set(true).then(_ => {
              console.log('Message id added to system admin');
            }
          );

          this.addMsgToMessageRef(msgId.key);
        }
      );

  }

  private addMsgToMessageRef(key: string) {

    if (this.allUsersSelected) {
      this.af.database.object(Constants.APP_STATUS + '/messageRef/allusergroup/' + key).set(true).then(_ => {
          console.log('Message id added to all users group in messageRef');
        }
      );
    } else {

      if (this.agencyAdminsSelected) {
        var agencyAdminGroupPath: string = Constants.APP_STATUS + '/group/agencygroup/';
        var agencyIds: FirebaseListObservable<any> = this.af.database.list(agencyAdminGroupPath);

        var agencyGroupPath: string = Constants.APP_STATUS + '/messageRef/agencygroup/';
        // var agencies: FirebaseListObservable<any> = this.af.database.list(agencyGroupPath);

        agencyIds.subscribe(agencyIds => {
          agencyIds.forEach(agencyId => {
            console.log(agencyId);
            this.af.database.object(agencyGroupPath + agencyId.$key).subscribe((agency: any) => {
              this.af.database.object(agencyGroupPath + agency.$key + '/' + key).set(true).then(_ => {
                  console.log('Message id added to agency group in messageRef');
                }
              );
            });

          });
        });
      }

      if (this.countryAdminsSelected) {
        var countryAdminGroupPath: string = Constants.APP_STATUS + '/group/countrygroup/';
        var countryIds: FirebaseListObservable<any> = this.af.database.list(countryAdminGroupPath);

        var countryGroupPath: string = Constants.APP_STATUS + '/messageRef/countrygroup/';
        // var countries: FirebaseListObservable<any> = this.af.database.list(countryGroupPath);

        countryIds.subscribe(countryIds => {
          countryIds.forEach(countryId => {
            this.af.database.object(countryGroupPath + countryId.$key).subscribe((country: any) => {
              this.af.database.object(countryGroupPath + country.$key + '/' + key).set(true).then(_ => {
                  console.log('Message id added to country group in messageRef');
                }
              );
            });

          });
        });
      }
    }

    this.router.navigate(['/system-admin/messages']);

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
    } else if ((!this.allUsersSelected) && (!this.agencyAdminsSelected) && (!this.countryAdminsSelected)) {
      this.errorMessage = "MESSAGES.NO_RECIPIENTS_ERROR";
      return false;
    }
    return true;
  }

}
