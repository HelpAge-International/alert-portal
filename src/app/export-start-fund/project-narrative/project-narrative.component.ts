import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResponsePlan} from "../../model/responsePlan";
import {UserService} from "../../services/user.service";
import {
  MediaFormat, MethodOfImplementation, NetworkUserAccountType, PresenceInTheCountry, ResponsePlanSectors, SourcePlan,
  UserType
} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";

@Component({
  selector: 'app-export-start-fund-project-narrative',
  templateUrl: './project-narrative.component.html',
  styleUrls: ['./project-narrative.component.css']
})

export class ProjectNarrativeComponent implements OnInit, OnDestroy {

  private SECTORS = Constants.RESPONSE_PLANS_SECTORS;
  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  @Input() responsePlanId: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private ResponsePlanSectors = ResponsePlanSectors;
  private responsePlan: ResponsePlan = new ResponsePlan;

  private COUNTRIES = [
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo, the Democratic Republic of the",
    "Cook Islands",
    "Costa Rica",
    "Ivory Coast",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (Vatican City State)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran, Islamic Republic of",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, Democratic People's Republic of",
    "Korea, Republic of",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Macedonia, the former Yugoslav Republic of",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territory, Occupied",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Réunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan, Province of China",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "United States Minor Outlying Islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Virgin Islands, British",
    "Virgin Islands, U.S.",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ]

  private planLeadName: string = '';
  private planLeadEmail: string = '';
  private planLeadPhone: string = '';
  private planLeadPosition: string = '';
  private memberAgencyName: string = '';
  private sectorsRelatedToMap = new Map<number, boolean>();
  private PresenceInTheCountry = PresenceInTheCountry;
  private MethodOfImplementation = MethodOfImplementation;
  private MediaFormat = MediaFormat;
  private partnersList: string[] = [];
  private sourcePlanId: number;
  private sourcePlanInfo1: string;
  private sourcePlanInfo2: string;
  private SourcePlan = SourcePlan;
  private groups: any[] = [];
  private vulnerableGroupsToShow = [];
  private userPath: string;
  private systemAdminUid: string;
  private agencyCountry: string;

  private agencyId: string;
  private networkCountryId: string;
  public isLocalAgency: boolean;
  private isLocalNetworkAdmin: boolean;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private userService: UserService,
              private networkService: NetworkService,
              private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {

      if(params['isLocalAgency']){
        this.isLocalAgency = true
        this.initLocalAgency()
      }else{
        this.isLocalAgency = false
        this.initCountryOffice()
      }

    });

  }

  initLocalAgency(){

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.agencyId = agencyId
          this.userPath = Constants.USER_PATHS[userType];
          this.downloadDataLocalAgency();
        });
  }

  initCountryOffice(){
    this.route.params.subscribe((params: Params) => {
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }
      if (params["id"] && params["networkCountryId"]) {
        this.responsePlanId = params["id"];
        this.networkCountryId = params["networkCountryId"];
        if (params["isViewing"]) {
          this.uid = params["uid"]
          this.systemAdminUid = params["systemId"]
          this.downloadResponsePlanData();
          this.downloadAgencyData(null);
          console.log(this.countryId, this.agencyId, this.networkCountryId, 'ID')
        } else {
          this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
            this.uid = user.uid;
            this.downloadResponsePlanData();
            this.downloadAgencyData(null);

          });
        }
      } else {
        this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
          this.uid = user.uid;
          this.userPath = Constants.USER_PATHS[userType];
          this.downloadData();
        });
      }

    })

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Private Functions
   */

  private downloadData() {
    this.userService.getUserType(this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(usertype => {
        this.USER_TYPE = Constants.USER_PATHS[usertype];

          this.getCountryId().then(() => {
            this.downloadResponsePlanData();
            this.downloadAgencyData(usertype);
          });

      });

  }

  private downloadDataLocalAgency() {

          this.downloadResponsePlanDataLocalAgency();
          this.downloadAgencyDataLocalAgency();

  }

  private downloadResponsePlanData() {
    if (!this.responsePlanId) {
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.responsePlanId = params["id"];
          }
        });
    }
    let id = this.networkCountryId ? this.networkCountryId : this.countryId;
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + '/' + this.responsePlanId;
    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlan = responsePlan;
        console.log(responsePlan);
        this.configGroups(responsePlan);

        if (responsePlan.sectorsRelatedTo) {
          responsePlan.sectorsRelatedTo.forEach(sector => {
            this.sectorsRelatedToMap.set(sector, true);
          });
        }

        this.bindProjectLeadData(responsePlan);
        this.bindPartnersData(responsePlan);
        this.bindSourcePlanData(responsePlan);

      });
  }

  private downloadResponsePlanDataLocalAgency() {
    if (!this.responsePlanId) {
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.responsePlanId = params["id"];
          }
        });
    }
    let id = this.agencyId;
    let responsePlansPath: string = Constants.APP_STATUS + '/responsePlan/' + id + '/' + this.responsePlanId;
    this.af.database.object(responsePlansPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlan: ResponsePlan) => {
        this.responsePlan = responsePlan;
        console.log(responsePlan, 'check data here');
        this.configGroups(responsePlan);

        if (responsePlan.sectorsRelatedTo) {
          responsePlan.sectorsRelatedTo.forEach(sector => {
            this.sectorsRelatedToMap.set(sector, true);
          });
        }

        this.bindProjectLeadDataLocalAgency(responsePlan);
        this.bindPartnersData(responsePlan);
        this.bindSourcePlanData(responsePlan);

      });
  }

  private downloadAgencyData(userType) {
    const normalUser = () => {
      this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyId) => {
          this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + "/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
            if (name != null) {
              this.memberAgencyName = name.$value;
            }

            console.log(agencyId, 'ID')
            this.af.database.object(Constants.APP_STATUS + '/agency/' + agencyId + '/country')
              .subscribe( country => {
                this.agencyCountry = country.$value;
              })

          });

        });
    };



    const networkUser = () => {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.responsePlan.planLead + "/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
        if (name != null) {
          this.memberAgencyName = name.$value;
        }
      });
    };
    this.networkCountryId ? networkUser() : normalUser();

  }


  private downloadAgencyDataLocalAgency() {

          this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/name").takeUntil(this.ngUnsubscribe).subscribe(name => {
            if (name != null) {
              this.memberAgencyName = name.$value;
            }
          });
  }

  private getCountry() {
    console.log(this.countryId, this.agencyId, this.networkCountryId, 'ID')
    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + '/country')
      .subscribe( country => {
        console.log(country, 'this is the country');
      })
  }

  private bindProjectLeadData(responsePlan: ResponsePlan) {
    if (responsePlan.planLead) {
      this.userService.getUser(responsePlan.planLead)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          console.log(user);
          this.planLeadName = user.firstName + " " + user.lastName;
          this.planLeadEmail = user.email;
          this.planLeadPhone = user.phone;

          this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryId + "/" + user.id + "/position").takeUntil(this.ngUnsubscribe).subscribe(position => {
            if (position != null) {
              this.planLeadPosition = position.$value;
            }
          });
        });
    }

  }

  private bindProjectLeadDataLocalAgency(responsePlan: ResponsePlan) {
    if (responsePlan.planLead) {
      this.userService.getUser(responsePlan.planLead)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          console.log(user);
          this.planLeadName = user.firstName + " " + user.lastName;
          this.planLeadEmail = user.email;
          this.planLeadPhone = user.phone;

          this.af.database.object(Constants.APP_STATUS + "/staff/" + this.agencyId + "/" + user.id + "/position").takeUntil(this.ngUnsubscribe).subscribe(position => {
            if (position != null) {
              this.planLeadPosition = position.$value;
            }
          });
        });
    }
  }

  private bindPartnersData(responsePlan: ResponsePlan) {
    this.partnersList = [];

    if (responsePlan.partnerOrganisations) {
      let partnerIds = Object.keys(responsePlan.partnerOrganisations).map(key => responsePlan.partnerOrganisations[key]);
      partnerIds.forEach(id => {
        this.userService.getOrganisationName(id)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(organisation => {
            if (organisation.organisationName) {
              this.partnersList.push(organisation.organisationName);
            }
          })
      });
    }
  }

  private bindSourcePlanData(responsePlan: ResponsePlan) {
    if (responsePlan.sectors) {
      Object.keys(responsePlan.sectors).forEach(sectorKey => {
        this.sourcePlanId = responsePlan.sectors[sectorKey]["sourcePlan"];
        this.sourcePlanInfo1 = responsePlan.sectors[sectorKey]["bullet1"];
        this.sourcePlanInfo2 = responsePlan.sectors[sectorKey]["bullet2"];
      });
    }
  }

  private configGroups(responsePlan: ResponsePlan) {
    const normalUser = () => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.userPath + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((systemAdminIds) => {
          this.systemAdminUid = systemAdminIds[0].$key;
          this.downloadGroups(responsePlan);
        });
    };
    const networkUser = () => {
      if (this.systemAdminUid) {
        this.downloadGroups(responsePlan);
      } else {
        let networkUserType = this.isLocalNetworkAdmin ? NetworkUserAccountType.NetworkAdmin : NetworkUserAccountType.NetworkCountryAdmin;
        this.networkService.getSystemIdForNetwork(this.uid, networkUserType)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(systemId => {
            this.systemAdminUid = systemId;
            this.downloadGroups(responsePlan);
          });
      }
    };
    this.networkCountryId ? networkUser() : normalUser();
  }

  /**
   * Utility Functions
   */

  private downloadGroups(responsePlan: ResponsePlan) {
    if (this.systemAdminUid) {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminUid + '/groups')
        .map(groupList => {
          let groups = [];
          groupList.forEach(group => {
            groups.push(group);
          });
          return groups;
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(groups => {
          this.groups = groups;
          console.log(this.groups);

          var vulnerableGroups = [];
          if (this.groups && responsePlan.vulnerableGroups) {
            this.groups.forEach(originalGroup => {
              responsePlan.vulnerableGroups.forEach(resGroupKey => {
                if (originalGroup.$key == resGroupKey) {
                  vulnerableGroups.push(originalGroup);
                }
              });
            });
          }
          this.vulnerableGroupsToShow = vulnerableGroups;
        });
    }
  }

  private getCountryId() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryId: any) => {
          this.countryId = countryId.$value;
          res(true);
        });
    });
    return promise;
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
