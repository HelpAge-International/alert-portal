import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
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

export class DonorModuleComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public uid: string;
  public mapHelper: SuperMapComponents;
  public department: SDepHolder;
  private mDepartmentMap: Map<string, SDepHolder>;
  private agencyMap: Map<string, string> = new Map<string, string>();
  private departments: SDepHolder[];

  public agencyLogo: string;

  public minThreshRed: number;
  public minThreshYellow: number;
  public minThreshGreen: number;

  private userTypePath: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute, private userService: UserService) {
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
                  console.log(value);
                  this.departments.push(value);
                });
              },
              (mapCountryClicked) => {
                if (this.mDepartmentMap != null) {

                  // TODO - Navigate to country index here
                  // TODO - Get the clicked countries ID
                  let countryIdToSend: string = this.mDepartmentMap.get(mapCountryClicked).countryId;
                  console.log(countryIdToSend);
                  this.router.navigate(["donor-module/donor-country-index", {"countryId": countryIdToSend}]);
                }
                else {
                  console.log("TODO: Map is yet to initialise properly / it failed to do so");
                }
              }
            );

            /** Load in the markers on the map! */
            this.mapHelper.markersForAgencyAdmin(this.uid, Constants.USER_PATHS[usertype], (marker) => {
              marker.setMap(this.mapHelper.map);
            });

            /** Get the Agency logo */
            this.mapHelper.logoForAgencyAdmin(this.uid, Constants.USER_PATHS[usertype], (logo) => {
              this.agencyLogo = logo;
            });

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
