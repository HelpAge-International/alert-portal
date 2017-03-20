import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Router, RouterLinkActive, ActivatedRoute} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {DialogService} from "../../system-admin/dialog/dialog.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-country-office',
  templateUrl: './country-office.component.html',
  styleUrls: ['./country-office.component.css']
})
export class CountryOfficeComponent implements OnInit,OnDestroy {

  private subscriptions: RxHelper;
  private uid: string;
  private countries: FirebaseListObservable<any[]>;
  private countryNames: string [] = Constants.COUNTRY;
  private admins: Observable<any>[];

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      console.log(user.auth.uid)
      this.uid = user.auth.uid;
      this.countries = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid);
    });
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  toggleActive(country) {
    let state: boolean = !country.isActive;
    let subscription = this.dialogService.createDialog("Deactivate " + country.name, "Are you sure you want to do this?")
      .subscribe(result => {
        if (!result) {
          return;
        }
        this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.uid + "/" + country.$key + "/isActive").set(state);
      });
    this.subscriptions.add(subscription);
  }

  editCountry(country) {
    this.router.navigate(["agency-admin/country-office/create-edit-country/", {id: country.$key}]);
  }

  getAdminName(key): string {
    // console.log(key)
    if (!key) {
      return;
    }
    let name: string = "";
    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + key)
      .subscribe(user => {
        name = user.firstName + " " + user.lastName;
      });
    this.subscriptions.add(subscription);
    // console.log(list)
    if (name) {
      return name;
    }
  }

}
