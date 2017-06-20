import {Component, OnInit, OnDestroy} from '@angular/core';
import {RxHelper} from '../../../../utils/RxHelper';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../../../services/user.service";
import {Constants} from '../../../../utils/Constants';
import {ResponsePlanSectors, AlertMessageType} from '../../../../utils/Enums';
import {AlertMessageModel} from '../../../../model/alert-message.model';
import {AngularFire} from "angularfire2";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-edit-programme',
  templateUrl: './edit-programme.component.html',
  styleUrls: ['./edit-programme.component.css']
})

export class CountryOfficeEditProgrammeComponent implements OnInit, OnDestroy {

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private uid: string;
  private countryID: string;
  private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
  private ResponsePlanSectorsList: number[] = [
    ResponsePlanSectors.wash,
    ResponsePlanSectors.health,
    ResponsePlanSectors.shelter,
    ResponsePlanSectors.nutrition,
    ResponsePlanSectors.foodSecurityAndLivelihoods,
    ResponsePlanSectors.protection,
    ResponsePlanSectors.education,
    ResponsePlanSectors.campManagement,
    ResponsePlanSectors.other
  ];

  private mapping: any[] = [];
  private sectorExpertise: any[] = [];
  private logContent: any[] = [];
  private noteTmp: any[] = [];
  private TmpSectorExpertise: any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private _userService: UserService,
              private af: AngularFire) {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this._getCountryID().then(() => {
        this._getProgramme();
      });
    })
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


  _getProgramme() {
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((programms: any) => {
        this.mapping = [];
        this.sectorExpertise = [];
        var mapping = programms['4WMapping'];
        for (let m in mapping) {
          mapping[m].key = m;
          this.mapping.push(mapping[m]);
        }

        var sectorExpertise = programms['sectorExpertise'];
        for (let s in sectorExpertise) {
          var obj = {key: parseInt(s), val: sectorExpertise[s]};
          this.sectorExpertise.push(obj);
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
      this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryID: any) => {
          this.countryID = countryID.$value ? countryID.$value : "";
          console.log(this.countryID);
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

  backButton() {
    this.router.navigate(['/country-admin/country-office-profile/']);
  }

  selectedSectors(event: any, sectorID: any) {

    if (this.sectorExpertise && this.sectorExpertise.length > 0) {
      this.sectorExpertise.forEach((val, key) => {
        this.TmpSectorExpertise[val.key] = true;
      });
    }

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
        this.TmpSectorExpertise.forEach((val, key) => {
          if (key == sectorID) {
            delete this.TmpSectorExpertise[sectorID];
          }
        });
      }
    }

  }

  saveSectors() {

    if (!this.TmpSectorExpertise || !this.TmpSectorExpertise.length) {
      this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SAVE_SELECTORS', AlertMessageType.Error);
      return false;
    }

    var dataToUpdate = this.TmpSectorExpertise;
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




