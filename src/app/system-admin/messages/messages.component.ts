import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { Router } from "@angular/router";
import { Constants } from '../../utils/Constants';
import { Message } from '../../model/message';

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

  deleteMessage() {
    // TODO - Delete all message refs
    console.log('Delete message button pressed');
  }

}
