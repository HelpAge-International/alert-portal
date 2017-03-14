import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.css']
})
export class DialogComponent implements OnInit {

  title:string = "Deactivate?";
  content:string = "Are you sure you want to deactive?";

  constructor() { }

  ngOnInit() {
  }

  close() {

  }

}
