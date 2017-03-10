import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor() { }

  createNewMessage() {
    console.log('Create new message button pressed');
  }

  deleteMessage() {
      console.log('Delete message button pressed');
  }

  ngOnInit() {
  }

}
