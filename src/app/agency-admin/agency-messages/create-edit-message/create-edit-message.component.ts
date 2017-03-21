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
  private allUsersSelected: Boolean;
  private countryAdminsSelected: Boolean;
  private countryDirectorsSelected: Boolean;
  private ertLeadsSelected: Boolean;
  private ertsSelected: Boolean;
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
    let newMessagePath = Constants.APP_STATUS + '/message';

    this.af.database.list(newMessagePath).push(newMessage)
      .then(msgId => {
        console.log('New Message added to message node');

        var sentMsgPath = Constants.APP_STATUS + '/administratorAgency/' + this.uid + '/sentmessages/' + msgId.key;
        this.af.database.object(sentMsgPath + msgId.key).set(true).then(_ => {
            console.log('Message id added to agency admin');
          }
        );
        this.addMsgToMessageRef(msgId.key);
      });
  }

  private addMsgToMessageRef(key: string) {

   let agencyGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/';
    var agencyMessageRefPath: string = Constants.APP_STATUS + '/messageRef/agency/' + this.uid + '/';

    if (this.allUsersSelected) {
      var agencyAllUsersSelected: string = agencyGroupPath + 'agencyallusersgroup/';
      var agencyAllUsers: FirebaseListObservable<any> = this.af.database.list(agencyAllUsersSelected);

      var agencyAllUsersMessageRefPath: string = agencyMessageRefPath + 'agencyallusersgroup/';

      let subscription = agencyAllUsers.subscribe(agencyAllUsersIds => {
        agencyAllUsersIds.forEach(agencyAllUsersId => {
          console.log(agencyAllUsersId);
          this.af.database.object(agencyAllUsersMessageRefPath + agencyAllUsersId.$key + '/' + key).set(true).then(_ => {
                console.log('Message id added to agency group in messageRef');
              });
          });
        });
      this.subscriptions.add(subscription);

    } else {

      if (this.countryAdminsSelected) {

        var agencyCountryAdminsSelected: string = agencyGroupPath + 'countryadmins/';
        var agencyCountryAdmins: FirebaseListObservable<any> = this.af.database.list(agencyCountryAdminsSelected);

        var agencyCountryAdminsMessageRefPath: string = agencyMessageRefPath + 'countryadmins/';

        let subscription = agencyCountryAdmins.subscribe(agencyCountryAdminsIds => {
          agencyCountryAdminsIds.forEach(agencyCountryAdminId => {
            console.log(agencyCountryAdminId);
            this.af.database.object(agencyCountryAdminsMessageRefPath + agencyCountryAdminId.$key + '/' + key).set(true).then(_ => {
              console.log('Message id added to agency/countryAdmins group in messageRef');
            });
          });
        });
        this.subscriptions.add(subscription);
      }

      if (this.countryDirectorsSelected) {

        var agencyCountryDirectorsSelected: string = agencyGroupPath + 'countrydirectors/';
        var agencyCountryDirectors: FirebaseListObservable<any> = this.af.database.list(agencyCountryDirectorsSelected);

        var agencyCountryDirectorsMessageRefPath: string = agencyMessageRefPath + 'countrydirectors/';

        let subscription = agencyCountryDirectors.subscribe(agencyCountryDirectorsIds => {
          agencyCountryDirectorsIds.forEach(agencyCountryDirectorId => {
            console.log(agencyCountryDirectorId);
            this.af.database.object(agencyCountryDirectorsMessageRefPath + agencyCountryDirectorId.$key + '/' + key).set(true).then(_ => {
              console.log('Message id added to agency/countrydirectors group in messageRef');
            });
          });
        });
        this.subscriptions.add(subscription);
      }

      if (this.ertLeadsSelected) {

        var agencyErtLeadsSelected: string = agencyGroupPath + 'ertleads/';
        var agencyErtLeads: FirebaseListObservable<any> = this.af.database.list(agencyErtLeadsSelected);

        var agencyErtLeadsMessageRefPath: string = agencyMessageRefPath + 'ertleads/';

        let subscription = agencyErtLeads.subscribe(agencyErtLeadsIds => {
          agencyErtLeadsIds.forEach(agencyErtLeadId => {
            console.log(agencyErtLeadId);
            this.af.database.object(agencyErtLeadsMessageRefPath + agencyErtLeadId.$key + '/' + key).set(true).then(_ => {
              console.log('Message id added to agency/ertleads group in messageRef');
            });
          });
        });
        this.subscriptions.add(subscription);
      }

      if (this.ertsSelected) {

        var agencyErtsSelected: string = agencyGroupPath + 'erts/';
        var agencyErts: FirebaseListObservable<any> = this.af.database.list(agencyErtsSelected);

        var agencyErtsMessageRefPath: string = agencyMessageRefPath + 'erts/';

        let subscription = agencyErts.subscribe(agencyErtsIds => {
          agencyErtsIds.forEach(agencyErtId => {
            console.log(agencyErtId);
            this.af.database.object(agencyErtsMessageRefPath + agencyErtId.$key + '/' + key).set(true).then(_ => {
              console.log('Message id added to agency/erts group in messageRef');
            });
          });
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
