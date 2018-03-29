import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, Countries, ResponsePlanSectors, UserType} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AngularFire} from "angularfire2";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import { AddEditMappingProgrammeComponent } from "./add-edit-mapping/add-edit-mapping.component";
import {CommonService} from "../../../services/common.service";
import {AgencyService} from "../../../services/agency-service.service";

declare var jQuery: any;

@Component({
  selector: 'app-country-office-programme',
  templateUrl: './programme.component.html',
  styleUrls: ['./programme.component.css']
})

export class CountryOfficeProgrammeComponent implements OnInit, OnDestroy {

  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private USER_TYPE = UserType;

  private isViewing: boolean;
  private UserType: number;

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private uid: string;
  private countryID: string;

  private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
  private ResponsePlanSectorsIcons = Constants.RESPONSE_PLANS_SECTORS_ICONS;

  private mapping: any[] = [];
  private sectorExpertise: any[] = [];
  private logContent: any[] = [];
  private noteTmp: any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyId: string;
  public ResponsePlansEnum = ResponsePlanSectors;
  private selectedCountry: any;
  private programmeId: any;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private countries = Constants.COUNTRIES;
  private TmpSectorExpertise: any[] = [];
  private locationObjs: any[] = [];
  private ResponsePlanSectorsList: number[] = [
    ResponsePlanSectors.wash,
    ResponsePlanSectors.health,
    ResponsePlanSectors.shelter,
    ResponsePlanSectors.nutrition,
    ResponsePlanSectors.foodSecurityAndLivelihoods,
    ResponsePlanSectors.protection,
    ResponsePlanSectors.education,
    ResponsePlanSectors.campmanagement
  ];

  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();
  private userAgencyId: string;

  @Input() isLocalAgency: boolean;

  @Input() isAgencyAdmin: boolean;

  constructor(private pageControl: PageControlService,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private jsonService: CommonService,
              private agencyService: AgencyService,
              private af: AngularFire) {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice();
  }

  initLocalAgency(){
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.UserType = userType;
          if (!this.isViewing) {
            this.agencyId = agencyId;
          }
          this._getProgrammeLocalAgency();
        });
      });

  }

  initCountryOffice(){
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryID = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.UserType = userType;
          this.userAgencyId = agencyId;
          console.log('agencyId: ' + this.agencyId)
          console.log('userAgencyId: ' + this.userAgencyId)
          if (this.isViewing) {
            this._getProgramme();
          } else {
            this.countryID = countryId;
            // this._getCountryID().then(() => {
            this._getProgramme();
            // });

          }

          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
            this.countryPermissionsMatrix = isEnabled;
          }));
        });
      });


  }




  saveNote(programmeID: any) {
    if (!this.logContent[programmeID]) {
      this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_NOTE', AlertMessageType.Error);
      return false;
    }

    var logData: any = {};
    logData.content = this.logContent[programmeID];
    logData.uploadBy = this.uid;
    logData.time = this._getCurrentTimestamp();
    logData.agencyId = this.userAgencyId

    this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + this.countryID + '/4WMapping/' + programmeID + '/programmeNotes')
      .push(logData)
      .then(() => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_NOTE', AlertMessageType.Success);
        this.logContent[programmeID] = '';
      }).catch((error: any) => {
      console.log(error, 'You do not have access!')
    });
  }

  saveNoteLocalAgency(programmeID: any) {
    if (!this.logContent[programmeID]) {
      this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_NOTE', AlertMessageType.Error);
      return false;
    }

    var logData: any = {};
    logData.content = this.logContent[programmeID];
    logData.uploadBy = this.uid;
    logData.time = this._getCurrentTimestamp();

    this.af.database.list(Constants.APP_STATUS + '/localAgencyProfile/programme/' + this.agencyId + '/4WMapping/' + programmeID + '/programmeNotes')
      .push(logData)
      .then(() => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_NOTE', AlertMessageType.Success);
        this.logContent[programmeID] = '';
      }).catch((error: any) => {
      console.log(error, 'You do not have access!')
    });
  }

  editProgramme() {
    this.isEdit = true;
  }

  showProgramme() {
    this.isEdit = false;
  }

  _getProgramme() {
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((programms: any) => {
        this.mapping = [];
        this.sectorExpertise = [];
        var mapping = programms['4WMapping'];
        for (let m in mapping) {
          mapping[m].key = m;
          mapping[m].notes = [];
          var notes = mapping[m].programmeNotes;
          var arrayNotes = [];
          for (let n in notes) {
            notes[n].key = n;
            arrayNotes.push(notes[n]);
          }
          arrayNotes.forEach((note, key) => {
            this.getUsers(note.uploadBy)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((user: any) => {

                if(this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)){
                  this.agencyService.getAgency(note.agencyId)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe( agency => {
                      note.agencyName = agency.name;
                    })
                }

                note.uploadByFullName = user.firstName + ' ' + user.lastName;
              });
          });
          arrayNotes = this._sortLogsByDate(arrayNotes);
          mapping[m].notes = arrayNotes;
          this.mapping.push(mapping[m]);
          this.programmeId = this.mapping[0].key;
        }
        this.convertCountryNumber();
        var sectorExpertise = programms['sectorExpertise'];
        for (let s in sectorExpertise) {
          var obj = {key: parseInt(s), val: sectorExpertise[s]};
          this.sectorExpertise.push(obj);
        }

        // Adding to select sector expertise pop up list
        if (this.sectorExpertise && this.sectorExpertise.length > 0) {
          this.sectorExpertise.forEach((val, key) => {
            this.TmpSectorExpertise[val.key] = true;
          });
        }
        this.generateLocations();
      });
  }

  _getProgrammeLocalAgency() {
    this.af.database.object(Constants.APP_STATUS + "/localAgencyProfile/programme/" + this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((programms: any) => {
        this.mapping = [];
        this.sectorExpertise = [];
        var mapping = programms['4WMapping'];
        for (let m in mapping) {
          mapping[m].key = m;
          mapping[m].notes = [];
          var notes = mapping[m].programmeNotes;
          var arrayNotes = [];

          for (let n in notes) {
            notes[n].key = n;
            arrayNotes.push(notes[n]);
          }

          arrayNotes.forEach((note, key) => {
            this.getUsers(note.uploadBy)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((user: any) => {
                note.uploadByFullName = user.firstName + ' ' + user.lastName;
              });
          });
          arrayNotes = this._sortLogsByDate(arrayNotes);
          mapping[m].notes = arrayNotes;
          this.mapping.push(mapping[m]);
        }

        var sectorExpertise = programms['sectorExpertise'];
        for (let s in sectorExpertise) {
          var obj = {key: parseInt(s), val: sectorExpertise[s]};
          this.sectorExpertise.push(obj);
        }

        // Adding to select sector expertise pop up list
        if (this.sectorExpertise && this.sectorExpertise.length > 0) {
          this.sectorExpertise.forEach((val, key) => {
            this.TmpSectorExpertise[val.key] = true;
          });
        }
        this.generateLocations();
      });
  }

  setTmpNote(programmeID: string, note: any) {
    this.noteTmp['content'] = note.content;
    this.noteTmp['noteID'] = note.key;
    this.noteTmp['programmeID'] = programmeID;
  }

  saveLog() {
    var dataToUpdate = {content: this.noteTmp['content']};

    this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + this.countryID + '/4WMapping/' + this.noteTmp['programmeID'] + '/programmeNotes/' + this.noteTmp['noteID'])
      .update(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_NOTE', AlertMessageType.Success);
        this.noteTmp = [];
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });
  }

  saveLogLocalAgency() {
    var dataToUpdate = {content: this.noteTmp['content']};

    this.af.database.object(Constants.APP_STATUS + '/localAgencyProfile/programme/' + this.agencyId + '/4WMapping/' + this.noteTmp['programmeID'] + '/programmeNotes/' + this.noteTmp['noteID'])
      .update(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_NOTE', AlertMessageType.Success);
        this.noteTmp = [];
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });
  }

  deleteLog() {
    this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + this.countryID + '/4WMapping/' + this.noteTmp['programmeID'] + '/programmeNotes/' + this.noteTmp['noteID']).remove().then(() => {
      this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_DELETE_NOTE', AlertMessageType.Success);
      this.noteTmp = [];
    });
  }

  deleteLogLocalAgency() {
    this.af.database.object(Constants.APP_STATUS + '/localAgencyProfile/programme/' + this.agencyId + '/4WMapping/' + this.noteTmp['programmeID'] + '/programmeNotes/' + this.noteTmp['noteID']).remove().then(() => {
      this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_DELETE_NOTE', AlertMessageType.Success);
      this.noteTmp = [];
    });
  }

  _convertObjectToArray(obj: any) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return arr;
  }

  convertCountryNumber(){


    /**
     * Convert number from Firebase into country name
     */
    this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + this.countryID + '/4WMapping/' + this.programmeId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(getCountry => {
        console.log(getCountry);
        this.selectedCountry = getCountry.where;
        console.log(getCountry.where, 'Country Name');

        for (let key in Countries) {

          if (key.includes(this.selectedCountry))
          {
            console.log('true');
            this.selectedCountry = Countries[key];
            console.log(this.selectedCountry);
          }
        }


      });


  }

  _getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/countryId')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryID: any) => {
          this.countryID = countryID.$value ? countryID.$value : "";
          res(true);
        });
    });
    return promise;
  }

  getUsers(userID: string) {
    return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID);
  }

  _getCurrentTimestamp() {
    var currentTimeStamp = new Date().getTime();
    return currentTimeStamp;
  }

  _sortLogsByDate(array: any) {
    var byDate = array.slice(0);
    var result = byDate.sort(function (a, b) {
      return b.time - a.time;
    });

    return result;
  }

  selectedSectors(event: any, sectorID: any) {
    var stateElement: boolean = true;
    var className = "";
    if (event.target) {
      className = event.target.className;
    } else {
      className = event.srcElement.className;
    }
    const pattern = /.Selected/;
    if (!pattern.test(className)) {
      stateElement = false;
    }

    if (stateElement) {
      this.TmpSectorExpertise[sectorID] = true;
    } else {
      if (this.TmpSectorExpertise && this.TmpSectorExpertise.length > 0) {
        delete this.TmpSectorExpertise[sectorID];
      }
    }
  }

  saveSectors() {
    if (!this.TmpSectorExpertise || !this.TmpSectorExpertise.length) {
      this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SAVE_SELECTORS', AlertMessageType.Error);
      return false;
    }
    var dataToUpdate = {};
    this.TmpSectorExpertise.forEach((val, key) => {
      if (val) {
        dataToUpdate[key] = val;
      }
    });
    this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + this.countryID + '/sectorExpertise/')
      .set(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_SELECTORS', AlertMessageType.Success);
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });
  }

  saveSectorsLocalAgency() {
    if (!this.TmpSectorExpertise || !this.TmpSectorExpertise.length) {
      this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SAVE_SELECTORS', AlertMessageType.Error);
      return false;
    }
    var dataToUpdate = {};
    this.TmpSectorExpertise.forEach((val, key) => {
      if (val) {
        dataToUpdate[key] = val;
      }
    });

    this.af.database.object(Constants.APP_STATUS + '/localAgencyProfile/programme/' + this.agencyId + '/sectorExpertise/')
      .set(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_SELECTORS', AlertMessageType.Success);
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });
  }

  setSelectorClass(sectorID: any) {
    var selected = '';
    this.sectorExpertise.forEach((val, key) => {
      if (val.key == sectorID) {
        selected = 'Selected';
      }
    });
    return selected;
  }

  generateLocations(){
    this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((json) => {
      this.mapping.forEach(mapping => {
        let obj = {
          country: "",
          areas: ""
        };
        if (mapping.where && mapping.where > -1) {
          obj.country = this.countries[mapping.where];
        }
        if (mapping.level1 && mapping.level1 > -1) {
          obj.areas = ", " + json[mapping.where].levelOneValues[mapping.level1].value
        }
        if (mapping.level2 && mapping.level2 > -1) {
          obj.areas = obj.areas + ", " + json[mapping.where].levelOneValues[mapping.level1].levelTwoValues[mapping.level2].value;
        }
        this.locationObjs.push(obj);
      });
    });
  }
}



