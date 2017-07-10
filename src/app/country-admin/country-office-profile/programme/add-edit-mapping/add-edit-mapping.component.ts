import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../../../services/user.service";
import {Constants} from '../../../../utils/Constants';
import {ResponsePlanSectors, AlertMessageType, Month} from '../../../../utils/Enums';
import {AlertMessageModel} from '../../../../model/alert-message.model';
import {ProgrammeMappingModel} from '../../../../model/programme-mapping.model';
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {PageControlService} from "../../../../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-mapping-programme',
  templateUrl: './add-edit-mapping.component.html',
  styleUrls: ['./add-edit-mapping.component.css']
})

export class AddEditMappingProgrammeComponent implements OnInit, OnDestroy {

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

  private Month = Constants.MONTH;
  private MonthList: number[] = [
    Month.january, Month.february, Month.march, Month.april,
    Month.may, Month.june, Month.july, Month.august, Month.september,
    Month.october, Month.november, Month.december
  ];

  private mapping: any[] = [];
  private sectorExpertise: any[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private programmeId: string;
  private programme: any;

  private when: any[] = [];


  constructor(private pageControl: PageControlService,
              private router: Router,
              private route: ActivatedRoute,
              private _userService: UserService,
              private af: AngularFire) {
    this.programme = new ProgrammeMappingModel();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryID = countryId;
      this.initData();
    });
  }

  initData() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        // this._getCountryID().then(() => {
        if (params && params['programmeId']) {
          this.programmeId = params['programmeId'];
          this._getProgramme(params['programmeId']);
        }
        // });
      });
  }


  _getProgramme(programmeID: string) {
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + programmeID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((programme: any) => {
        this.programme = new ProgrammeMappingModel();
        programme.id = programme.$key;
        this.programme.setData(programme);
        this._convertTimestampToDate(programme.when);
      });
  }


  _getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryID: any) => {
          this.countryID = countryID.$value ? countryID.$value : "";
          res(true);
        });
    });
    return promise;
  }


  setSelectorClass(sectorID: any) {
    var selected = '';
    if (this.programme.sector == sectorID) {
      selected = 'Selected';
    }
    return selected;
  }

  isActive(sectorID: any) {
    this.programme.sector = sectorID;
  }

  backButton() {
    this.router.navigate(['/country-admin/country-office-profile/programme']);
  }

  saveMapping() {
    this.setDate();
    this.alertMessage = this.programme.validate();
    if (!this.alertMessage) {
      var dataToSave = this.programme;

      if (!this.programmeId) {
        this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/')
          .push(dataToSave)
          .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_MAPPING', AlertMessageType.Success);
            this.programme = new ProgrammeMappingModel();
            this.when = [];
            this.router.navigate(['/country-admin/country-office-profile/programme/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      } else {
        dataToSave.updatedAt = new Date().getTime();
        delete dataToSave.id;
        this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + this.programmeId)
          .update(dataToSave)
          .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_MAPPING', AlertMessageType.Success);
            this.router.navigate(['/country-admin/country-office-profile/programme/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    }
  }

  setMonth(event: any) {
    this.when['month'] = parseInt(event.target.value);
  }

  setYear(event: any) {
    this.when['year'] = parseInt(event.target.value);
  }

  setDate() {
    if (this.when['month'] && this.when['year']) {
      var timeStamp = new Date(this.when['year'], this.when['month'], 15).getTime();
      this.programme.when = 0;
      this.programme.when = timeStamp;
    }
  }

  deleteMapping() {
    jQuery("#deleteMapping").modal("hide");
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + this.programmeId)
      .remove().then(() => {
      this.router.navigate(['/country-admin/country-office-profile/programme/']);
    });
  }

  _convertTimestampToDate(timestamp: number) {
    this.when = [];
    var date = new Date(timestamp);
    this.when['month'] = date.getMonth();
    this.when['year'] = date.getFullYear();
  }

}




