import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
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
  private sentMessages: [FirebaseObjectObservable<any>];
  private messages: FirebaseListObservable<any>;
  private path: string =  '';

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {

    /*this.af.auth.subscribe(auth => {

     if (auth) {
     this.path = Constants.APP_STATUS + '/systemAdmin/' + auth.uid + '/sentmessages';
     this.messageRefs = this.af.database.list(this.path);

     console.log("herererer" + this.messageRefs.forEach(e=> { console.log(e.$key)}));

     this.messageRefs.forEach(element => {

     element.forEach(message => {
     // console.log(message.$key);
     this.path = Constants.APP_STATUS + '/message/' + message.$key;
     console.log(this.path);
     var msg = this.af.database.object(this.path);

     console.log(msg);
     this.sentMessages.push(msg);
     this.messages.push(msg);
     });

     });
     console.log(this.sentMessages);

     } else {
     // user is not logged in
     console.log("Error occurred - User isn't logged in");
     this.router.navigateByUrl("/login");
     }
     });*/
  }

  createNewMessage() {
    // TODO - After confirming with Ryan
    console.log('Create new message button pressed');
  }

  deleteMessage() {
      console.log('Delete message button pressed');
  }

}
