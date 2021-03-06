import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, Privacy, ResponsePlanSectors, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {PartnerOrganisationService} from "../../../services/partner-organisation.service";
import {AgencyService} from "../../../services/agency-service.service";
import {NetworkService} from "../../../services/network.service";
import {PartnerOrganisationModel} from "../../../model/partner-organisation.model";
import {PartnerModel} from "../../../model/partner.model";
import {UserService} from "../../../services/user.service";
import {CountryAdminModel} from "../../../model/country-admin.model";
import {SessionService} from "../../../services/session.service";
import {CommonService} from "../../../services/common.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
import {OperationAreaModel} from "../../../model/operation-area.model";
import {LocalStorageService} from "angular-2-local-storage";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";
import {SettingsService} from "../../../services/settings.service";

declare var jQuery: any;


@Component({
  selector: 'app-local-network-profile-partners',
  templateUrl: './local-network-profile-partners.component.html',
  styleUrls: ['./local-network-profile-partners.component.css'],
  providers: [PartnerOrganisationService]
})
export class LocalNetworkProfilePartnersComponent implements OnInit, OnDestroy {
  agencies = [];
  officeAgencyMap: Map<string, string>;
  networkId: any;

  private USER_TYPE = UserType;
  private userType: UserType;
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private agencyId: string;
  private countryId: string;
  private isViewing: boolean;
  private currProjectsToDisplay: any[];
  // Constants and enums
  private alertMessageType = AlertMessageType;
  filterOrganisation = null;
  filterSector = null;
  filterLocation = null;

  PARTNER_STATUS = Constants.PARTNER_STATUS;
  RESPONSE_PLAN_SECTORS = ResponsePlanSectors;
  RESPONSE_PLAN_SECTORS_SELECTION = Constants.RESPONSE_PLANS_SECTORS;

  // Models
  private alertMessage: AlertMessageModel = null;
  private partners: PartnerModel[];
  private partnerOrganisations = new Map<string, PartnerOrganisationModel[]>();
  private countryAdmin: CountryAdminModel;
  private areasOfOperation: string[];
  private countryLevelsValues: any;

  // Helpers
  private newNote: NoteModel[];
  private activeNote: NoteModel;
  private activePartnerOrganisation: PartnerOrganisationModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  //network country re-use
  @Input() isNetworkCountry: boolean;
  private networkCountryId: string;
  private networkViewValues: {};
  private isViewingFromExternal: boolean;

  private agencyCountryPrivacyMap = new Map<string, ModelAgencyPrivacy>()
  private Privacy = Privacy
  private isOpenAgencyMenus: boolean;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _commonService: CommonService,
              private _noteService: NoteService,
              private _sessionService: SessionService,
              private _agencyService: AgencyService,
              private _networkService: NetworkService,
              private networkService: NetworkService,
              private storageService: LocalStorageService,
              private settingService: SettingsService,
              private af: AngularFire,
              private router: Router) {
    this.areasOfOperation = [];
    this.newNote = [];
  }

  ngOnDestroy() {
    this._sessionService.partner = null;
    this._sessionService.user = null;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params['isViewing']) {
          this.isViewing = params['isViewing'];
        }
        if (params['agencyId']) {
          this.agencyId = params['agencyId'];
        }
        if (params['countryId']) {
          this.countryId = params['countryId'];
        }
        if (params['networkId']) {
          this.networkId = params['networkId'];
        }
        if (params['networkCountryId']) {
          this.networkCountryId = params['networkCountryId'];
        }
        if (params['uid']) {
          this.uid = params['uid'];
        }
        if (params['isViewingFromExternal']) {
          this.isViewingFromExternal = params['isViewingFromExternal'];
        }

        this.isNetworkCountry ? this.networkCountryAccess() : this.localNetworkAdminAccess();
      })
  }

  private networkCountryAccess() {
    if (this.isViewing) {

      this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(map => {
          console.log(map);
          this.officeAgencyMap = map;
          map.forEach((value: string, key: string) => {
            this._agencyService.getAgency(key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {
                this.agencies.push(agency);

                value !== key ? this.getCountryPartnerOrgs(key, value) : this.getLocalAgencyPartnerOrgs(key)

                // get the country levels values
                this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(content => {
                    this.countryLevelsValues = content;
                  });
              })

            //get privacy for country
            this.settingService.getPrivacySettingForCountry(value)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(key, privacy)
              })
          });


        });
    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        this.networkService.getSelectedIdObj(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];
            this.networkCountryId = selection["networkCountryId"];

            this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(map => {
                console.log(map);
                this.officeAgencyMap = map;

                map.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency);

                      this._partnerOrganisationService.getCountryOfficePartnerOrganisations(key, value)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(partnerOrganisations => {
                          this.partnerOrganisations.set(key, partnerOrganisations);

                          this.assignProjectsToDisplayPerPartnerOrg(key, value);

                          // Get the partner organisation notes
                          this.partnerOrganisations.get(key).forEach(partnerOrganisation => {
                            const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
                            this._noteService.getNotes(partnerOrganisationNode).subscribe(notes => {
                              partnerOrganisation.notes = notes;
                            });

                            // Create the new note model for partner organisation
                            this.newNote[partnerOrganisation.id] = new NoteModel();
                            this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
                          });
                        });

                      // get the country levels values
                      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(content => {
                          this.countryLevelsValues = content;
                        });
                    })

                  //get privacy for country
                  this.settingService.getPrivacySettingForCountry(value)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(privacy => {
                      this.agencyCountryPrivacyMap.set(key, privacy)
                    })
                });


              });
          });
      });
    }

  }

  private getCountryPartnerOrgs(key: string, value: string) {
    this._partnerOrganisationService.getCountryOfficePartnerOrganisations(key, value)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(partnerOrganisations => {
        this.partnerOrganisations.set(key, partnerOrganisations);

        this.assignProjectsToDisplayPerPartnerOrg(key, value);

        // Get the partner organisation notes
        this.partnerOrganisations.get(key).forEach(partnerOrganisation => {
          const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
          this._noteService.getNotes(partnerOrganisationNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
            partnerOrganisation.notes = notes;
          });

          // Create the new note model for partner organisation
          this.newNote[partnerOrganisation.id] = new NoteModel();
          this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
        });
      });
  }

  private getLocalAgencyPartnerOrgs(agencyId:string) {
    this._partnerOrganisationService.getLocalAgencyPartnerOrganisations(agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(partnerOrganisations => {
        this.partnerOrganisations.set(agencyId, partnerOrganisations);

        this.assignProjectsToDisplayPerPartnerOrg(agencyId);

        // Get the partner organisation notes
        this.partnerOrganisations.get(agencyId).forEach(partnerOrganisation => {
          const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
          this._noteService.getNotes(partnerOrganisationNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
            partnerOrganisation.notes = notes;
          });

          // Create the new note model for partner organisation
          this.newNote[partnerOrganisation.id] = new NoteModel();
          this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
        });
      });
  }

  private localNetworkAdminAccess() {
    if (this.isViewing) {
      this._networkService.getAgencyCountryOfficesByNetwork(this.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(officeAgencyMap => {
          this.officeAgencyMap = officeAgencyMap
          officeAgencyMap.forEach((value: string, key: string) => {
            this._agencyService.getAgency(key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {
                this.agencies.push(agency)

                value !== key ? this.getCountryPartnerOrgs(key, value) : this.getLocalAgencyPartnerOrgs(key)

                // get the country levels values
                this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(content => {
                    this.countryLevelsValues = content;
                  });
              })

            //get privacy for country
            this.settingService.getPrivacySettingForCountry(value)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(key, privacy)
              })
          })
        });

    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;
        this._networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];

            this._networkService.getAgencyCountryOfficesByNetwork(this.networkId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(officeAgencyMap => {
                this.officeAgencyMap = officeAgencyMap

                officeAgencyMap.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency)

                      this._partnerOrganisationService.getCountryOfficePartnerOrganisations(key, value)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(partnerOrganisations => {
                          this.partnerOrganisations.set(key, partnerOrganisations)

                          this.assignProjectsToDisplayPerPartnerOrg(key, value);

                          // Get the partner organisation notes
                          this.partnerOrganisations.get(key).forEach(partnerOrganisation => {
                            const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
                            this._noteService.getNotes(partnerOrganisationNode).subscribe(notes => {
                              partnerOrganisation.notes = notes;
                            });

                            // Create the new note model for partner organisation
                            this.newNote[partnerOrganisation.id] = new NoteModel();
                            this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
                          });
                        });

                      // get the country levels values
                      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(content => {
                          this.countryLevelsValues = content;
                        });
                    })

                  //get privacy for country
                  this.settingService.getPrivacySettingForCountry(value)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(privacy => {
                      this.agencyCountryPrivacyMap.set(key, privacy)
                    })
                })
              });
          })
      });
    }

  }

  private assignProjectsToDisplayPerPartnerOrg(key, value?) {
    this.partnerOrganisations.get(key).forEach(partnerOrganisation => {
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((value) => {
        let projects = [];
        if (partnerOrganisation && partnerOrganisation.projects) {
          partnerOrganisation.projects.forEach(project => {

            let affectedAreaObj = {country: "", areas: ""};
            let projectObj = {title: "", affectedAreas: []};

            projectObj.title = project.title;
            project.operationAreas.forEach(affectedArea => {
              affectedAreaObj = {country: "", areas: ""};
              if (affectedArea.country != null && affectedArea.country > -1) {
                affectedAreaObj.country = this.getCountryNameById(affectedArea.country);
                this.addLocationForFilter(affectedAreaObj.country);
              }
              if (affectedArea.level1 != null && affectedArea.level1 > -1) {
                affectedAreaObj.areas = ", " + value[affectedArea.country].levelOneValues[affectedArea.level1].value;
                this.addLocationForFilter(affectedAreaObj.areas);
              }
              if (affectedArea.level2 != null && affectedArea.level2 > -1) {
                affectedAreaObj.areas = ", " + value[affectedArea.country].levelOneValues[affectedArea.level2].value;
                this.addLocationForFilter(affectedAreaObj.areas);
              }
              projectObj.affectedAreas.push(affectedAreaObj);
            });
            projects.push(projectObj);
          });
        }
        partnerOrganisation.projectsToDisplay = projects;
      });
    });
  }

  private addLocationForFilter(location: string) {
    let parsedLocation = location.replace(/,/g, '');
    if (!this.areasOfOperation.includes(parsedLocation)) {
      this.areasOfOperation.push(parsedLocation);
    }
  }

  showAffectedAreasForPartner(projectsToDisplay: any[]) {
    this.currProjectsToDisplay = projectsToDisplay;
    jQuery("#view-areas").modal("show");
  }

  private getCountryNameById(countryId: number) {
    return Constants.COUNTRIES[countryId];
  }

  private getLocationName(location: OperationAreaModel): string {
    if (location.level2) {
      return this.countryLevelsValues[location.country]['levelOneValues'][location.level1]['levelTwoValues'][location.level2].value;
    } else if (location.level1) {
      return this.countryLevelsValues[location.country]['levelOneValues'][location.level1].value;
    } else {
      return Constants.COUNTRIES[location.country];
    }
  }

  editPartners() {
    this.isEdit = true;
  }

  showPartners() {
    this.isEdit = false;
  }

  addPartnerOrganisation() {
    this.router.navigateByUrl('/response-plans/add-partner-organisation');
  }

  editPartnerOrganisation(partnerOrganisationId) {
    this.router.navigate(['/response-plans/add-partner-organisation', {id: partnerOrganisationId}], {skipLocationChange: true});
  }

  hideFilteredPartners(partnerOrganisation: PartnerOrganisationModel): boolean {
    let hide = false;

    if (!partnerOrganisation) {
      return hide;
    }

    if (this.filterOrganisation && this.filterOrganisation != "null" && partnerOrganisation.id !== this.filterOrganisation) {
      hide = true;
    }

    if (this.filterSector && this.filterSector != "null"
      && !this.hasOrganisationProjectSector(partnerOrganisation, this.filterSector)) {
      hide = true;
    }

    if (this.filterLocation && this.filterLocation != "null" && !this.hasAreaOfOperation(partnerOrganisation, this.filterLocation)) {
      hide = true;
    }

    return hide;
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }

  addNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
    console.log(note)
    if (this.validateNote(note)) {
      const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
      this._noteService.saveNote(partnerOrganisationNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel, agency) {
    jQuery('#edit-action-' + agency.$key).modal('show');
    this.activePartnerOrganisation = partnerOrganisation;
    this.activeNote = note;
  }

  editAction(partnerOrganisation: PartnerOrganisationModel, note: NoteModel, agency) {
    this.closeEditModal(agency);

    if (this.validateNote(note)) {
      const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
      this._noteService.saveNote(partnerOrganisationNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  closeEditModal(agency) {
    jQuery('#edit-action-' + agency.$key).modal('hide');
  }

  deleteNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel, agency) {
    jQuery('#delete-action-' + agency.$key).modal('show');
    this.activePartnerOrganisation = partnerOrganisation;
    this.activeNote = note;
  }

  deleteAction(partnerOrganisation: PartnerOrganisationModel, note: NoteModel, agency) {
    this.closeDeleteModal(agency);

    const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);

    this._noteService.deleteNote(partnerOrganisationNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeDeleteModal(agency) {
    jQuery('#delete-action-' + agency.$key).modal('hide');
  }

  getUserName(userId) {
    let userName = "";

    this._userService.getUser(userId).subscribe(user => {
      userName = user.firstName + ' ' + user.lastName;
    });

    return userName;
  }

  private hasOrganisationProjectSector(partnerOrganisation: PartnerOrganisationModel, sector: string): boolean {
    let exists = false;
    partnerOrganisation.projects.forEach(project => {
      Object.keys(project.sector).forEach(key => {
        if (key == sector && project.sector[key]) {
          exists = true;
        }
      });
    })
    return exists;
  }

  hasOrganisationProjectSectorFilter(partnerOrganisations: PartnerOrganisationModel[], sector: string): boolean {
    let exists = false;
    if (sector == null || sector == "null") {
      exists = true
    }
    if (partnerOrganisations != null && this.partnerOrganisations.size > 0) {
      partnerOrganisations.forEach(partnerOrganisation => {
        partnerOrganisation.projects.forEach(project => {
          Object.keys(project.sector).forEach(key => {
            if (key == sector && project.sector[key]) {
              exists = true;
            }
          });
        })
      })
    }

    return exists;
  }

  private hasAreaOfOperation(partnerOrganisation: PartnerOrganisationModel, locationName: any): boolean {
    let exists = false;

    let areasOfOperation = this.getAreasOfOperation(partnerOrganisation.projectsToDisplay);

    if (areasOfOperation.join(",").search(locationName) !== -1) {
      exists = true;
    }

    return exists;
  }

  hasAreaOfOperationFilter(partnerOrganisations: PartnerOrganisationModel[], locationName: any): boolean {
    let exists = false;
    if (locationName == null || locationName == "null") {
      exists = true
    }
    if (partnerOrganisations != null && partnerOrganisations.length > 0) {
      partnerOrganisations.forEach(partnerOrganisation => {
        if (partnerOrganisation != null && partnerOrganisation.projectsToDisplay != null) {
          let areasOfOperation = this.getAreasOfOperation(partnerOrganisation.projectsToDisplay);
          if (areasOfOperation.join(",").search(locationName) !== -1) {
            exists = true;
          }
        }
      })
    }

    return exists;
  }

  getOrganisationsNames() {
    let partners = []
    this.partnerOrganisations.forEach((v, k) => {
      partners = partners.concat(v)
    })
    return partners
  }

  hasOrganisationNameFilter(partnerOrganisations: PartnerOrganisationModel[], id: String) {
    let exists = false;
    if (id == null || id == "null") {
      exists = true
    }
    if (partnerOrganisations != null && partnerOrganisations.length > 0) {
      partnerOrganisations.forEach(partnerOrganisation => {
        if (partnerOrganisation != null && partnerOrganisation.id == id) {
          exists = true;
        }
      })
    }

    return exists;
  }

  showAgencyHeadersIfHidden() {
    console.log("show agency header if hidden")
    this.openAgencyMenus()
  }

  /** Opening agency menus when a filter selected*/
  private openAgencyMenus() {
    if (!this.agencies || this.isOpenAgencyMenus){
      return;
    }

    this.isOpenAgencyMenus = true;

    this.agencies.forEach((value, index) => {
      console.log('#header_section_'+index);
      jQuery('#header_section_'+index).trigger('click');
    });
  }

  private getAreasOfOperation(projects): string[] {
    let areas = [];
    projects.forEach(project => {
      project.affectedAreas.forEach(area => {
        areas.push(area.country);
        if (area.areas) {
          areas.push(area.areas);
        }
      });

    });
    return areas;
  }

}
