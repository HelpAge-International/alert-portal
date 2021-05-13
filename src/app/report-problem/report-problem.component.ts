import {Component, Input, OnInit} from '@angular/core';
import {BugReportingService} from "../services/bug-reporting.service";
import {AngularFire, AngularFireDatabase, FirebaseListObservable} from "angularfire2";
import {BugReportModel} from "../report-problem/bug-report-model";
import {Constants} from ".././utils/Constants";
import {CountryAdminHeaderComponent} from "../country-admin/country-admin-header/country-admin-header.component";
import {PageControlService} from ".././services/pagecontrol.service";
import * as firebase from 'firebase';
import * as html2canvas from 'html2canvas'

declare const jQuery: any;
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Countries, NetworkUserAccountType, UserType} from "../utils/Enums";
import {UserService} from "../services/user.service";
import {NetworkService} from "../services/network.service";
import {NetworkAccountDetailsComponent} from "../network-admin/network-account-details/network-account-details.component";

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.scss']
})
export class ReportProblemComponent implements OnInit {

  @Input() showIcon: boolean;

  private tooltipDisplay = "Click to take screenshot";
  private error: string;
  private bugId: string;
  private pushImgId: string;
  private bugDescription: string;
  private downloadLink: string;
  private imgFileName: string;

  private _networkId: string;
  private _networkCountryId: string;
  private _networkAdminId: string;
  private _networkLocation: number;

  private uid: string;
  private countryId: string;
  private agencyId: string;
  private agencyDetail: any;
  private systemId: string;
  private agencyAdminId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userType: UserType;
  private networkUserType: NetworkUserAccountType;
  private isAnonym: boolean = false;
  private selectedCountry: any;
  private countries = Constants.COUNTRIES;
  private countryLocation: any;

  //details for Email
  private sendEmailModel = new BugReportModel();

  constructor(private bugReport: BugReportingService,
              private af: AngularFire,
              private db: AngularFireDatabase,
              private networkService: NetworkService,
              private pageControl: PageControlService,
              private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,) {
  }

  ngOnInit() {
    this.sendEmailModel.computerDetails = window.navigator.appVersion;

    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {

          this._networkId = selection["id"];
          this.networkUserType = selection["userType"];
          console.log(this.networkUserType)

          if (this.networkUserType == NetworkUserAccountType.NetworkAdmin) {
            this.userService.getNetworkAdminDetail(this._networkId).takeUntil(this.ngUnsubscribe)
              .subscribe(model => {
                console.log(model)
                this._networkAdminId = model.networkAdminId;
                console.log(this._networkAdminId)

                this.sendEmailModel.country = null;
                this.sendEmailModel.agencyName = "";

                this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this._networkAdminId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(getUserDetails => {
                    this.sendEmailModel.fName = getUserDetails.firstName;
                    this.sendEmailModel.lName = getUserDetails.lastName;
                    this.sendEmailModel.email = getUserDetails.email;
                  });
              });
          } else if (this.networkUserType == NetworkUserAccountType.NetworkCountryAdmin) {
            this._networkCountryId = selection["networkCountryId"];

            console.log(this._networkCountryId)
            this.userService.getNetworkCountryDetail(this._networkId, this._networkCountryId).takeUntil(this.ngUnsubscribe)
              .subscribe(model => {
                console.log(model)
                this._networkAdminId = model.adminId;
                console.log(this._networkAdminId)

                this.sendEmailModel.country = model.location;
                this.sendEmailModel.agencyName = "";

                this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this._networkAdminId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(getUserDetails => {
                    this.sendEmailModel.fName = getUserDetails.firstName;
                    this.sendEmailModel.lName = getUserDetails.lastName;
                    this.sendEmailModel.email = getUserDetails.email;
                  });
              });
          }
        })
    });

    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      // gives access to the Id's

      this.systemId = systemId;
      this.agencyId = agencyId;
      this.countryId = countryId;
      this.userType = userType;
      this.isAnonym = !(user && !user.anonymous);
      console.log(this.userType)

      this.getUserData()
      this.getContentForEmail()
    })
  }

  getUserData() {
    // subscribing to get user ID
    console.log(this.userType)
    if (this.userType == UserType.LocalAgencyAdmin) {
      this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this.agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(getUserDetails => {
          console.log(getUserDetails)
          this.sendEmailModel.fName = getUserDetails.firstName;
          this.sendEmailModel.lName = getUserDetails.lastName;
          this.sendEmailModel.email = getUserDetails.email;
        });
    } else if (this.userType == UserType.AgencyAdmin) {
      this.userService.getAgencyDetail(this.agencyId).takeUntil(this.ngUnsubscribe)
        .subscribe(model => {
          this.agencyAdminId = model.adminId;
          this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this.agencyAdminId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(getUserDetails => {
              this.sendEmailModel.fName = getUserDetails.firstName;
              this.sendEmailModel.lName = getUserDetails.lastName;
              this.sendEmailModel.email = getUserDetails.email;
              console.log(getUserDetails)
            });
        });
    } else if (this.userType == UserType.SystemAdmin) {
      this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this.systemId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(getUserDetails => {
          this.sendEmailModel.fName = getUserDetails.firstName;
          this.sendEmailModel.lName = getUserDetails.lastName;
          this.sendEmailModel.email = getUserDetails.email;
        });
    } else {
      this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(getUserDetails => {
          console.log(getUserDetails)
          this.sendEmailModel.fName = getUserDetails.firstName;
          this.sendEmailModel.lName = getUserDetails.lastName;
          this.sendEmailModel.email = getUserDetails.email;
        });
    }
  }

  getContentForEmail() {
    // Subscribing to get names of agency
    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(getName => {
        this.sendEmailModel.agencyName = getName.name;
        this.sendEmailModel.country = getName.country;
      });

    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + '/' + this.countryId + "/location")
      .takeUntil(this.ngUnsubscribe)
      .subscribe((location: any) => {
        this.countryLocation = location.$value;
      });
  }

  public generateKeyForBugReport(): string {
    return firebase.database().ref(Constants.APP_STATUS + "/bugReporting/").push().key;
  }

  screenshot() {
    jQuery('.float').hide();

    this.bugId = this.generateKeyForBugReport();
    // console.log(this.bugId);
    let storageRef = firebase.storage().ref('reportingBug');
    const name = (+new Date()) + '-' + 'screenshot';
    let uploadTask = storageRef.child(this.bugId + '/' + name);

    // Screen shot the image and return base64
    html2canvas(document.getElementById('wrap')).then(canvas => {

      console.log(canvas);

      canvas.toBlob(blob => {

        uploadTask.put(blob).then(snapshot => {
          this.sendEmailModel.downloadUrl = snapshot.downloadURL;
          this.sendEmailModel.file = snapshot.metadata.name;
          //this.getImageName();

        })
      }),
        error => {
          this.error = error;
          console.log(error)
        }

    })

    jQuery("#reporting").modal("show");
  }

  reportBugData() {
    console.log(this.sendEmailModel)
    if (this.userType == UserType.AgencyAdmin || this.userType == UserType.LocalAgencyAdmin) {
      console.log(this.agencyAdminId)
      this.af.database.object(Constants.APP_STATUS + '/bugReporting/' + this.agencyId + '/' + this.bugId)
        .set({
          country: this.sendEmailModel.country,
          date: this.sendEmailModel.date.toLocaleString('en-GB', {timeZone: 'UTC'}),
          email: this.sendEmailModel.email,
          description: this.sendEmailModel.description,
          firstName: this.sendEmailModel.fName,
          lastName: this.sendEmailModel.lName,
          agencyName: this.sendEmailModel.agencyName,
          systemInfo: this.sendEmailModel.computerDetails,
          downloadLink: this.sendEmailModel.downloadUrl,
          fileName: this.sendEmailModel.file,
        }),
        error => {
          this.error = error;
          console.log(error)
        }
    } else if (this.userType == UserType.SystemAdmin) {
      this.af.database.object(Constants.APP_STATUS + '/bugReporting/' + this.systemId + '/' + this.bugId)
        .set({
          country: "",
          date: this.sendEmailModel.date.toLocaleString('en-GB', {timeZone: 'UTC'}),
          email: this.sendEmailModel.email,
          description: this.sendEmailModel.description,
          firstName: this.sendEmailModel.fName,
          lastName: this.sendEmailModel.lName,
          agencyName: "",
          systemInfo: this.sendEmailModel.computerDetails,
          downloadLink: this.sendEmailModel.downloadUrl,
          fileName: this.sendEmailModel.file,
        }),
        error => {
          this.error = error;
          console.log(error)
        }
    } else if (this._networkId != null && (this.networkUserType == NetworkUserAccountType.NetworkAdmin || this.networkUserType == NetworkUserAccountType.NetworkCountryAdmin)) {
      this.af.database.object(Constants.APP_STATUS + '/bugReporting/' + this._networkId + '/' + this.bugId)
        .set({
          country: this.sendEmailModel.country,
          date: this.sendEmailModel.date.toLocaleString('en-GB', {timeZone: 'UTC'}),
          email: this.sendEmailModel.email,
          description: this.sendEmailModel.description,
          firstName: this.sendEmailModel.fName,
          lastName: this.sendEmailModel.lName,
          agencyName: "",
          systemInfo: this.sendEmailModel.computerDetails,
          downloadLink: this.sendEmailModel.downloadUrl,
          fileName: this.sendEmailModel.file,
        }),
        error => {
          this.error = error;
          console.log(error)
        }
    } else {
      this.af.database.object(Constants.APP_STATUS + '/bugReporting/' + this.countryId + '/' + this.bugId)
        .set({
          country: this.sendEmailModel.country,
          date: this.sendEmailModel.date.toLocaleString('en-GB', {timeZone: 'UTC'}),
          email: this.sendEmailModel.email,
          description: this.sendEmailModel.description,
          firstName: this.sendEmailModel.fName,
          lastName: this.sendEmailModel.lName,
          agencyName: this.sendEmailModel.agencyName,
          systemInfo: this.sendEmailModel.computerDetails,
          downloadLink: this.sendEmailModel.downloadUrl,
          fileName: this.sendEmailModel.file,
        }),
        error => {
          this.error = error;
          console.log(error)
        }
    }
    jQuery("#reporting").modal("hide");
  }

  getImageName() {
    this.af.database.object(Constants.APP_STATUS + '/bugReporting/' + this.countryId + '/' + this.bugId)
      .subscribe(img => {
        console.log(img);
        this.imgFileName = img.fileName;
      })
  }


}
