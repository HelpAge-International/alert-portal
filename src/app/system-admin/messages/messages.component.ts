import { Component, OnInit } from '@angular/core';
import { Message } from '../../model/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor() { }

  createNewMessage() {
    // TODO - After confirming with Ryan
    console.log('Create new message button pressed');
  }

  deleteMessage() {
      console.log('Delete message button pressed');
  }

  ngOnInit() {
  }

}
