import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-director-account-settings',
  templateUrl: './director-account-settings.component.html',
  styleUrls: ['./director-account-settings.component.css']
})
export class DirectorAccountSettingsComponent implements OnInit {

  private showProfile = true;

  constructor() {
  }

  ngOnInit() {
  }

  profileClicked() {
    this.showProfile = true;
  }

  passwordClicked() {
    this.showProfile = false;
  }

}
