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

    //TODO - TIME INTERVAL
    var newMessage: Message = new Message(Constants.uid, this.messageTitle, this.messageContent, 10000000);
    this.path = Constants.APP_STATUS + '/message';

    this.af.database.list(this.path).push(newMessage)
      .then(msgId => {
          console.log('New Message added');

          this.path = Constants.APP_STATUS + '/systemAdmin/' + Constants.uid + '/sentmessages/';
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
        var agencyAdminGroupPath: string = Constants.APP_STATUS + '/messageRef/agencygroup/';
        var agencies: FirebaseListObservable<any> = this.af.database.list(agencyAdminGroupPath);

        agencies.subscribe(agencies => {
          agencies.forEach(agency => {
            this.af.database.object(agencyAdminGroupPath + agency.$key).subscribe((agency: any) => {
              this.af.database.object(agencyAdminGroupPath + agency.$key + '/' + key).set(true).then(_ => {
                  console.log('Message id added to agency group in messageRef');
                }
              );
            });

          });
        });
      }

      if (this.countryAdminsSelected) {
        var countryAdminGroupPath: string = Constants.APP_STATUS + '/messageRef/countrygroup/';
        var countries: FirebaseListObservable<any> = this.af.database.list(countryAdminGroupPath);

        countries.subscribe(countries => {
          countries.forEach(country => {
            this.af.database.object(countryAdminGroupPath + country.$key).subscribe((country: any) => {
              this.af.database.object(countryAdminGroupPath + country.$key + '/' + key).set(true).then(_ => {
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
      this.errorMessage = "Please enter a title for the message";
      return false;
    } else if (!Boolean(this.messageContent)) {
      this.errorMessage = "Please add some content to the message";
      return false;
    } else if ((!this.allUsersSelected) && (!this.agencyAdminsSelected) && (!this.countryAdminsSelected)) {
      this.errorMessage = "Please select the recipients group";
      return false;
    }
    return true;
  }

}
