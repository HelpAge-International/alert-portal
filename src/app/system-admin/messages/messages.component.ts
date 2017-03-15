import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from '../../utils/Constants';
import {Message} from '../../model/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private messageRefs: FirebaseListObservable<any>;
  private sentMessages: Message[] = [];
  private path: string = '';

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {

    this.af.auth.subscribe(auth => {

      if (auth) {
        this.path = Constants.APP_STATUS + '/systemAdmin/' + auth.uid + '/sentmessages';
        this.messageRefs = this.af.database.list(this.path);

        this.messageRefs.subscribe(messageRefs => {
          messageRefs.forEach(messageRef => {
            this.af.database.object(Constants.APP_STATUS + '/message/' + messageRef.$key).subscribe((message: Message) => {
              this.sentMessages.push(message);
            });
          });
        });

      } else {
        // user is not logged in
        console.log("Error occurred - User isn't logged in");
        this.router.navigateByUrl("/login");
      }
    });
  }

  deleteMessage(sentMessage) {
    let key: string = sentMessage.$key;

    this.af.database.object(this.path + "/" + key).remove()
      .then(_ => {
        console.log("Message deleted from system admin")
      });

    this.af.database.object(Constants.APP_STATUS + '/message/' + key).remove()
      .then(_ => {
        console.log("Message deleted from messages")
      });

    this.deleteMessageRefFromAllUsers(key);
    this.deleteMessageRefFromAllAgencies(key);
    this.deleteMessageRefFromAllCountries(key);

  }

  private deleteMessageRefFromAllUsers(key) {

    var allUsersGroupPath: string = Constants.APP_STATUS + '/messageRef/allusergroup/';
    this.af.database.object(allUsersGroupPath + key).remove().then(_ => {
        console.log('Message id removed from all users group in messageRef');
      }
    );
  }

  private deleteMessageRefFromAllAgencies(key) {

    var agencyGroupPath: string = Constants.APP_STATUS + '/messageRef/agencygroup/';
    var agencies: FirebaseListObservable<any> = this.af.database.list(agencyGroupPath);

    agencies.subscribe(agencies => {
      agencies.forEach(agency => {
        this.af.database.object(agencyGroupPath + agency.$key).subscribe((agencyId: any) => {
          this.af.database.object(agencyGroupPath + agencyId.$key + '/' + key).remove().then(_ => {
              console.log('Message id removed from agency group in messageRef');
            }
          );
        });

      });
    });
  }

  private deleteMessageRefFromAllCountries(key) {

    var countryGroupPath: string = Constants.APP_STATUS + '/messageRef/countrygroup/';
    var countries: FirebaseListObservable<any> = this.af.database.list(countryGroupPath);

    countries.subscribe(countries => {
      countries.forEach(country => {
        this.af.database.object(countryGroupPath + country.$key).subscribe((countryId: any) => {
          this.af.database.object(countryGroupPath + countryId.$key + '/' + key).remove().then(_ => {
              console.log('Message id removed from country group in messageRef');
            }
          );
        });

      });
    });
  }

}
