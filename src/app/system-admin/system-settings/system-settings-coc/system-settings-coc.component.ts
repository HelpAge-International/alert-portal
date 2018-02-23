import { Component, OnInit } from '@angular/core';
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-system-settings-coc',
  templateUrl: './system-settings-coc.component.html',
  styleUrls: ['./system-settings-coc.component.scss']
})
export class SystemSettingsCocComponent implements OnInit {

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
