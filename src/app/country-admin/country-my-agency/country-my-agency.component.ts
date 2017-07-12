import {Component, OnDestroy, OnInit} from "@angular/core";
import { AlertLevels, Countries, AlertStatus, ActionLevel, ActionType, HazardScenario } from "../../utils/Enums";
import {DomSanitizer} from "@angular/platform-browser";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {AgencyService} from "../../services/agency-service.service";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {PrepActionService, PreparednessAction} from "../../services/prepactions.service";

@Component({
  selector: 'app-country-account-settings',
  templateUrl: './country-my-agency.component.html',
  styleUrls: ['./country-my-agency.component.css'],
  providers: [ActionsService]
})

export class CountryMyAgencyComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyID: string;
  private systemAdminID: string;
  private countryId: string;

  private agencyName: string = '';
  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

  private countries = Constants.COUNTRIES;
  private countryOfficeData: any = [];
  private filteredCountryOfficeData: any = [];
  protected CountriesEnum = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];

  private countResponsePlans: any = [];
  private count: number = 0;
  private percentageCHS: any = [];

  private filter: any = 'all';

  private minTreshold: any = [];
  private advTreshold: any = [];

  private mpaStatusIcons: any = [];
  private mpaStatusColors: any = [];
  private advStatusIcons: any = [];
  private advStatusColors: any = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private UserType: number;

  private prepActionService: PrepActionService[] = [];
  private hazardRedAlert: Map<HazardScenario, boolean>[] = [];

  constructor(private pageControl: PageControlService,
              private agencyService: AgencyService,
              private route: ActivatedRoute, private af: AngularFire,
              private router: Router,
              protected _sanitizer: DomSanitizer,
              private userService: UserService,
              private actionsService: ActionsService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;
      this.userService.getCountryId(Constants.USER_PATHS[this.UserType], this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryId => {
          this.countryId = countryId;
          this._loadData();
        });

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  _loadData() {
    this._getAgencyID().then(() => {
      this._getCountryList().then(() => {
        this._getSystemAdminID().then(() => {
          
        })
      });
    });
  }

  _getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.agencyID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          this.getAgencyName();
          res(true);
        });
    });
    return promise;
  }

  private getAgencyName() {

    if (this.agencyID) {
      this.agencyService.getAgency(this.agencyID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agency => {
          this.agencyName = agency.name;
        })
    }
  }

  _getCountryList() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countries: any) => {
          this.countryOfficeData = [];
          this.countryOfficeData = countries.filter(country => country.$key != this.countryId);
          
          res(true);
        });
    });
    return promise;
  }


  _getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIDs: any) => {
          this.systemAdminID = agencyIDs[0].$key ? agencyIDs[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
