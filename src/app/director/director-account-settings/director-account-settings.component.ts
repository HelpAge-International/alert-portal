import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-director-account-settings',
  templateUrl: './director-account-settings.component.html',
  styleUrls: ['./director-account-settings.component.css']
})
export class DirectorAccountSettingsComponent implements OnInit {

  private showProfile = true;
  private showCoC = false;

  constructor() {
  }

  ngOnInit() {
  }

  profileClicked() {
    this.showProfile = true;
    this.showCoC = false;
  }

  passwordClicked() {
    this.showProfile = false;
    this.showCoC = false;
  }

  cocClicked(){
    this.showCoC = true;
    this.showProfile = false;
  }

}
