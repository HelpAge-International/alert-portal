import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-settings-toc',
  templateUrl: './system-settings-toc.component.html',
  styleUrls: ['./system-settings-toc.component.scss']
})
export class SystemSettingsTocComponent implements OnInit {

  private isEditing: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  edit(event) {
    this.isEditing = true;
  }

  cancelEdit(event) {
    //Cancel
    this.isEditing = false;
  }

  saveEdited() {
    //Save
  }

}
