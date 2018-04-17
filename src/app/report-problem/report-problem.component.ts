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
import {Subject} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {Countries, UserType} from "../utils/Enums";
import {UserService} from "../services/user.service";
import {NetworkService} from "../services/network.service";

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.scss']
})
export class ReportProblemComponent implements OnInit {

  @Input() showIcon: boolean;

  @Input()
  set networkId(networkId: string) {
    this._networkId = networkId;
    //this.getNetworkAdminData()
  }

  @Input()
  set networkCountryId(networkCountryId: string) {
    this._networkCountryId = networkCountryId;
    //this.getNetworkAdminData()

  }

  @Input()
  set networkAdminId(networkAdminId: string) {
    this._networkAdminId = networkAdminId;
    this.getNetworkAdminData()

  }

  @Input()
  set networkLocation(networkLocation: number) {
    this._networkLocation = networkLocation;
    //this.getNetworkAdminData()

  }

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
  private isAnonym: boolean = false;
  private isNetworkCountryAdmin: boolean = false;

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
    // this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
    //   // gives access to the Id's
    //
    //   this.systemId = systemId;
    //   this.agencyId = agencyId;
    //   this.countryId = countryId;
    //   this.userType = userType;
    //   this.isAnonym = !(user && !user.anonymous);
    //   console.log(this.userType)
    //
    //   this.getUserData()
    //   this.getContentForEmail()
    // })
  }

  getNetworkAdminData(){
      console.log("-----in----")
      // this.sendEmailModel.country = this._networkLocation;
      // this.sendEmailModel.agencyName = "";
      // console.log(this.sendEmailModel.country)

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
            console.log(getUserDetails.firstName +" "+getUserDetails.lastName)
            this.sendEmailModel.fName = getUserDetails.firstName;
            this.sendEmailModel.lName = getUserDetails.lastName;
            this.sendEmailModel.email = getUserDetails.email;
          });
      });

      //
      // this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this._networkAdminId)
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe(getUserDetails => {
      //     console.log(getUserDetails.firstName +" "+getUserDetails.lastName)
      //     this.sendEmailModel.fName = getUserDetails.firstName;
      //     this.sendEmailModel.lName = getUserDetails.lastName;
      //     this.sendEmailModel.email = getUserDetails.email;
      //     console.log(this.sendEmailModel)
      //   });
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
    } else{

    //  console.log(this._networkId)

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
        // console.log(getName.name);
        this.sendEmailModel.agencyName = getName.name;
        this.sendEmailModel.country = getName.country;
      });

    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + '/' + this.countryId + "/location")
      .takeUntil(this.ngUnsubscribe)
      .subscribe((location: any) => {
        this.countryLocation = location.$value;
        // console.log(this.countryLocation, 'country location');
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
    debugger
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
    } else if (this._networkId!=null) {
      console.log(this.isNetworkCountryAdmin)
      console.log(this._networkCountryId)
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
