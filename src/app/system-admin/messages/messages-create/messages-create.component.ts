import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
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
  private agencyAdminsOnlySelected: Boolean;
  private countryAdminsOnlyUsersSelected: Boolean;

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
      .then(_ => {
          console.log('New Message added');
          this.router.navigateByUrl("/system-admin/messages");
        }
      );

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
    } else if ((!this.allUsersSelected) && (!this.agencyAdminsOnlySelected) && (!this.countryAdminsOnlyUsersSelected)) {
      this.errorMessage = "Please select the recipients group";
      return false;
    }
    return true;
  }

}
