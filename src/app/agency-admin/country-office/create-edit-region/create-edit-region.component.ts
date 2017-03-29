import {Component, OnDestroy, OnInit} from "@angular/core";
import {RxHelper} from "../../../utils/RxHelper";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Country} from "../../../utils/Enums";

@Component({
  selector: 'app-create-edit-region',
  templateUrl: './create-edit-region.component.html',
  styleUrls: ['./create-edit-region.component.css']
})
export class CreateEditRegionComponent implements OnInit, OnDestroy {
  private COUNTRY_NAMES: string[] = Constants.COUNTRY;
  private COUNTRY_SELECTION: number[] = Constants.COUNTRY_SELECTION;
  private regionName: string;
  private countryBoxes:boolean[] = [true, false, false, false, false];
  private counter: number = 0;
  private countries: number[] = [this.counter];
  private regionalDirectorId: string;
  private uid: string;
  // private countrySelected = 0;
  private countrySelected1 = 0;
  private countrySelected2 = 0;
  private countrySelected3 = 0;
  private countrySelected4 = 0;
  private countrySelected5 = 0;
  private tempCountries: string[] = [];
  private errorMessage: string;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    console.log(JSON.stringify(this.countryBoxes))
    this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
    });
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  addCountrySelection() {
    console.log("add new country selection");
    if (this.counter < this.countryBoxes.length-1) {
      this.counter++;
      this.countryBoxes[this.counter] = true;
    } else {
      console.log("noe more country can add!");
    }
  }

  // countryChange(country) {
  //   console.log("country: " + country);
    // console.log("countrySelected: " + this.countrySelected);
    // console.log("countrySelected: "+ this.tempCountries[this.countrySelected]);

    // if (this.tempCountries[Country[this.countrySelected]] == null) {
    //   this.tempCountries.push(Country[this.countrySelected]);
    // } else {
    //   console.log(this.countrySelected + "already in the list")
    // }
    // this.countries.forEach(c => {
    //   console.log("Country ----" + c);
    // })
    // console.log("Temp list ----" + this.tempCountries);

    // this.countrySelected = 0;

  // }

  submit() {
    console.log("submit");
  }

  cancel() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
  }

}
