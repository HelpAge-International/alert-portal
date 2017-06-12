import {Component, OnInit} from '@angular/core';
import {AlertLevels} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-donor-country-index',
  templateUrl: './donor-country-index.component.html',
  styleUrls: ['./donor-country-index.component.css']
})

export class DonorCountryIndexComponent implements OnInit {

  private uid: string;
  private agencyId: string;
  private agencyName: string = '';
  private systemAdminId: string;

  private numOfAgenciesActive: number = 0;

  // Filter
  private alertLevelSelected = AlertLevels.All;
  private alertLevels = Constants.ALERT_LEVELS;
  private alertLevelsList: number[] = Constants.ALERT_LEVELS_LIST;

  constructor() {
  }

  ngOnInit() {
  }

  // TODO -
  filter() {

    if (this.alertLevelSelected == AlertLevels.All) {

    } else {

    }
  }

}
