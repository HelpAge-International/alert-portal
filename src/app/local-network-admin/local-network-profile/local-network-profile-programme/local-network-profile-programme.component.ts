import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NetworkService} from "../../../services/network.service";
import {AgencyService} from "../../../services/agency-service.service";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors, UserType} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AngularFire} from "angularfire2";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";

declare var jQuery: any;

@Component({
  selector: 'app-local-network-profile-programme',
  templateUrl: './local-network-profile-programme.component.html',
  styleUrls: ['./local-network-profile-programme.component.css']
})
export class LocalNetworkProfileProgrammeComponent implements OnInit {
  testMap: Map<string, string>;

  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private USER_TYPE = UserType;

  private isViewing: boolean;
  private UserType: number;

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private uid: string;
  private networkID: string;
  private agencies = [];

  private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
  private ResponsePlanSectorsIcons = Constants.RESPONSE_PLANS_SECTORS_ICONS;

  private mapping = new Map<string,any[]>()
  private sectorExpertise = new Map<string,any[]>()
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
    ResponsePlanSectors.campmanagement
  ];


  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private networkService: NetworkService, private agencyService: AgencyService,
              private af: AngularFire) {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkID = selection["id"];
          this.networkService.getAgencyCountryOfficesByNetwork(this.networkID)
            .takeUntil(this.ngUnsubscribe)
            .subscribe( officeAgencyMap => {
              this.agencies = []

              officeAgencyMap.forEach((value: string, key: string) => {
                this.agencyService.getAgency(key)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe( agency => {
                      this.agencies.push(agency)
                  })
              })


              this._getProgramme(officeAgencyMap);
            })
        })
    })

  }

  saveNote(programmeID: any, agency: any) {

    this.af.database.object( Constants.APP_STATUS + '/network/' + this.networkID + '/agencies/' + agency.$key)
      .takeUntil(this.ngUnsubscribe)
      .subscribe( netAgency => {

        console.log(programmeID)
        console.log(agency)
        if (!this.logContent[programmeID]) {
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_NOTE', AlertMessageType.Error);
          return false;
        }

        var logData: any = {};
        logData.content = this.logContent[programmeID];
        logData.uploadBy = this.uid;
        logData.time = this._getCurrentTimestamp();

        this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + netAgency.countryCode + '/4WMapping/' + programmeID + '/programmeNotes')
          .push(logData)
          .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_NOTE', AlertMessageType.Success);
            this.logContent[programmeID] = '';
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });

      })
  }


  _getProgramme(officeAgencyMap) {
    officeAgencyMap.forEach((value: string, key: string) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((programms: any) => {
          this.mapping.set(key, []);
          this.sectorExpertise.set(key, []);
        console.log('------------')
        console.log(programms)
          var mapping = programms['4WMapping'];
          for (let m in mapping) {
            console.log('%$£@£$%')
            console.log(mapping[m])
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
            console.log(key)
            console.log(this.mapping)
            this.mapping.get(key).push(mapping[m]);

          }
          console.log(this.mapping)


          var sectorExpertise = programms['sectorExpertise'];
          for (let s in sectorExpertise) {
            var obj = {key: parseInt(s), val: sectorExpertise[s]};
            this.sectorExpertise.get(key).push(obj);

          }
          console.log(this.sectorExpertise)
        });
    })
  }


  setTmpNote(programmeID: string, note: any) {
    this.noteTmp['content'] = note.content;
    this.noteTmp['noteID'] = note.key;
    this.noteTmp['programmeID'] = programmeID;
  }

  saveLog(agency) {
    var dataToUpdate = {content: this.noteTmp['content']};
    this.af.database.object( Constants.APP_STATUS + '/network/' + this.networkID + '/agencies/' + agency.$key )
      .takeUntil(this.ngUnsubscribe)
      .subscribe( netAgency => {
        console.log(netAgency)
        this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + netAgency.countryCode + '/4WMapping/' + this.noteTmp['programmeID'] + '/programmeNotes/' + this.noteTmp['noteID'])
          .update(dataToUpdate)
          .then(_ => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_NOTE', AlertMessageType.Success);
            this.noteTmp = [];
          }).catch(error => {
          console.log("Message creation unsuccessful" + error);
        });
      })
  }

  deleteLog(agency) {

    this.af.database.object( Constants.APP_STATUS + '/network/' + this.networkID + '/agencies/' + agency.$key )
      .takeUntil(this.ngUnsubscribe)
      .subscribe( netAgency => {
        this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/programme/' + netAgency.countryCode + '/4WMapping/' + this.noteTmp['programmeID'] + '/programmeNotes/' + this.noteTmp['noteID']).remove().then(() => {
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_DELETE_NOTE', AlertMessageType.Success);
          this.noteTmp = [];
        });
      })
  }

  _convertObjectToArray(obj: any) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return arr;
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
    this.af.database.object(Constants.APP_STATUS + '/localNetworkProfile/programme/' + this.networkID + '/sectorExpertise/')
      .set(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_SELECTORS', AlertMessageType.Success);
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });
  }

}

