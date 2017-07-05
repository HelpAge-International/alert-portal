import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AngularFire} from "angularfire2";
import {PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-programme',
  templateUrl: './programme.component.html',
  styleUrls: ['./programme.component.css']
})

export class CountryOfficeProgrammeComponent implements OnInit, OnDestroy {

  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission

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


  private TmpSectorExpertise: any[] = [];
  private ResponsePlanSectorsList: number[] = [
    ResponsePlanSectors.wash,
    ResponsePlanSectors.health,
    ResponsePlanSectors.shelter,
    ResponsePlanSectors.nutrition,
    ResponsePlanSectors.foodSecurityAndLivelihoods,
    ResponsePlanSectors.protection,
    ResponsePlanSectors.education,
    ResponsePlanSectors.campManagement
  ];

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private af: AngularFire) {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
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
      });
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;
      if (this.isViewing) {
        this._getProgramme();
      } else {
        this._getCountryID().then(() => {
          this._getProgramme();
        });
      }
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

    this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + this.countryID + '/4WMapping/' + programmeID + '/programmeNotes')
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
        if (this.sectorExpertise && this.sectorExpertise.length > 0) {
          this.sectorExpertise.forEach((val, key) => {
            this.TmpSectorExpertise[val.key] = true;
          });
        }
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

  deleteLog() {
    this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + this.countryID + '/4WMapping/' + this.noteTmp['programmeID'] + '/programmeNotes/' + this.noteTmp['noteID']).remove().then(() => {
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

    var className = event.srcElement.className;
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

    // var dataToUpdate = this.TmpSectorExpertise;
    var dataToUpdate = {};

    this.TmpSectorExpertise.forEach((val, key) => {
      if(val) {
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

  setSelectorClass(sectorID: any) {
    var selected = '';
    this.sectorExpertise.forEach((val, key) => {
      if (val.key == sectorID) {
        selected = 'Selected';
      }
    });
    return selected;
  }

}




