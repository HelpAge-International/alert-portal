import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.css']
})
export class DialogComponent implements OnInit {

  title: string = "Alert";
  content: string = "Are you sure you want to proceed this action?";

  constructor(public dialogRef: MdDialogRef<DialogComponent>) {
  }

  ngOnInit() {
  }

  close() {
    console.log("close dialog");
    this.dialogRef.close(false);
  }

  confirm() {
    console.log("confirm");
    this.dialogRef.close(true);
  }

}
