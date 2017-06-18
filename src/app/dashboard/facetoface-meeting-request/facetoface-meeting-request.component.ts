import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Countries} from "../../utils/Enums";
import {AgencyService} from "../../services/agency-service.service";
import {ModelFaceToFce} from "./facetoface.model";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-facetoface-meeting-request',
  templateUrl: 'facetoface-meeting-request.component.html',
  styleUrls: ['facetoface-meeting-request.component.css'],
  providers: [AgencyService]
})
export class FacetofaceMeetingRequestComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private COUNTRIES = Countries;
  private uid: string;
  private countryId: string;
  private agencyId: string;

  private displayList: ModelFaceToFce[] = [];
  private agencySelectionMap = new Map();
  private emails: string;

  private countryLocation: any;
  private CountriesList = Constants.COUNTRIES;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute, private agencyService: AgencyService, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["countryId"] && params["agencyId"]) {
            this.countryId = params["countryId"];
            this.agencyId = params["agencyId"];
            this.initData(this.countryId, this.agencyId);
          }
        });
    });
  }

  private initData(countryId, agencyId) {
    // let allAgencySameCountry = this.agencyService.getAllAgencySameCountry(countryId, agencyId);
    // console.log(allAgencySameCountry[0]);
    this.getAllAgencySameCountry(countryId, agencyId);
  }

  checkAgency(item, value) {
    console.log("******")
    console.log(item)
    console.log(value)
    console.log("******")
    this.agencySelectionMap.set(item.countryDirectorEmail, value);
    console.log(this.agencySelectionMap);
  }

  sendEmail() {
    console.log(this.agencySelectionMap);
    this.agencySelectionMap.forEach((v, k) => {
      if (v) {
        if (this.emails) {
          this.emails.concat(";" + k);
        } else {
          this.emails = k;
        }
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.agencyService.unSubscribeNow();
  }

  getAllAgencySameCountry(countryId, agencyId) {
    this.displayList = [];
    this.agencyService.getCountryOffice(countryId, agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        this.countryLocation = country.location;
        this.agencyService.getAllCountryOffices()
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencies => {
            agencies = agencies.filter(agency => agency.$key != agencyId);
            agencies.forEach(agency => {
              let countries = Object.keys(agency).filter(key => !(key.indexOf("$") > -1)).map(key => {
                let temp = agency[key];
                temp["countryId"] = key;
                return temp;
              });
              console.log(countries);
              console.log(Object.keys(agency).filter(key => !(key.indexOf("$") > -1)));
              countries = countries.filter(countryItem => countryItem.location == country.location);
              console.log(countries)
              if (countries.length > 0) {
                let faceToface = new ModelFaceToFce();
                faceToface.agencyId = agency.$key;
                faceToface.countryId = countries[0].countryId;
                this.displayList.push(faceToface);
                console.log(this.displayList);

                this.agencyService.getAgency(faceToface.agencyId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(agency => {
                    console.log("agency")
                    console.log(faceToface.agencyId)
                    console.log(agency)
                    // this.displayList.forEach(item =>{
                    //   if (item.agencyId == agency.$key) {
                    //     item.agencyName = agency.name;
                    //     item.agencyLogoPath = agency.logoPath;
                    //   }
                    // });
                    faceToface.agencyName = agency.name;
                    faceToface.agencyLogoPath = agency.logoPath;
                  });

                console.log(faceToface.countryId)
                this.agencyService.getCountryDirector(faceToface.countryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(director => {
                    console.log("director")
                    console.log(faceToface.countryId)
                    console.log(director)
                    // this.displayList.forEach(item =>{
                    //   if (item.countryId == agency.$key) {
                    //     item.agencyName = agency.name;
                    //     item.agencyLogoPath = agency.logoPath;
                    //   }
                    // });
                    faceToface.countryDirectorId = director.$key;
                    faceToface.countryDirectorName = director.first ? (director.firstName + " " + director.lastName) : "None";
                    faceToface.countryDirectorEmail = director.email;
                  });
              }
            });
          });
      });
  }

}
