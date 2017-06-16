import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Countries} from "../utils/Enums";
import {DepHolder, SDepHolder, SuperMapComponents} from "../utils/MapHelper";
import {Subject} from "rxjs/Subject";
import {UserService} from "../services/user.service";
declare var jQuery: any;

@Component({
  selector: 'app-donor-module',
  templateUrl: './donor-module.component.html',
  styleUrls: ['./donor-module.component.css']
})

// TODO  - Notifications

export class DonorModuleComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private loaderInactive: boolean;

  public uid: string;
  public mapHelper: SuperMapComponents;
  public department: SDepHolder;
  private mDepartmentMap: Map<string, SDepHolder>;
  private agencyMap: Map<string, string> = new Map<string, string>();
  private departments: SDepHolder[];

  public minThreshRed: number;
  public minThreshYellow: number;
  public minThreshGreen: number;

  private userTypePath: string;

  constructor(private af: AngularFire, private router: Router, private userService: UserService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
  }

  goToListView() {
    console.log('Here');
    this.router.navigate(['/donor-module/donor-list-view']);
    // this.router.navigateByUrl('/donor-module/donor-list-view');
  }

  ngOnInit() {
    this.department = new SDepHolder("Something");
    this.department.location = -1;
    this.department.departments.push(new DepHolder("Loading", 100, 1));
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;

        this.userService.getUserType(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(usertype => {
            this.userTypePath = Constants.USER_PATHS[usertype];
            /** Initialise map and colour the relevant countries */
            this.mapHelper.initMapFrom("global-map", this.uid, Constants.USER_PATHS[usertype],
              (departments) => {
                this.mDepartmentMap = departments;
                this.departments = [];
                this.minThreshRed = this.mapHelper.minThreshRed;
                this.minThreshYellow = this.mapHelper.minThreshYellow;
                this.minThreshGreen = this.mapHelper.minThreshGreen;
                this.mDepartmentMap.forEach((value, key) => {
                  this.departments.push(value);
                });
                this.loaderInactive = true;
              },
              (mapCountryClicked) => {
                if (this.mDepartmentMap != null) {
                  let countryIdToSend: string = this.mDepartmentMap.get(mapCountryClicked).countryId;
                  this.router.navigate(["donor-module/donor-country-index", {countryId: countryIdToSend, agencyId: this.mapHelper.agencyAdminId}]);
                }
                else {
                  console.log("TODO: Map is yet to initialise properly / it failed to do so");
                }
              }
            );
          });


      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

}
