
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {PartnerOrganisationService} from "../../../services/partner-organisation.service";
import {PartnerOrganisationModel} from "../../../model/partner-organisation.model";
import {PartnerModel} from "../../../model/partner.model";
import {UserService} from "../../../services/user.service";
import {CountryAdminModel} from "../../../model/country-admin.model";
import {SessionService} from "../../../services/session.service";
import {CommonService} from "../../../services/common.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {AgencyService} from "../../../services/agency-service.service";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs";
import {AngularFire} from "angularfire2";
import {OperationAreaModel} from "../../../model/operation-area.model";

declare var jQuery: any;

@Component({
  selector: 'app-country-office-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css'],
  providers: [PartnerOrganisationService]
})

export class CountryOfficePartnersComponent implements OnInit, OnDestroy {
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
  private partnerOrganisations: PartnerOrganisationModel[] = [];
  private countryAdmin: CountryAdminModel;
  private areasOfOperation: string[];
  private countryLevelsValues: any;

  // Helpers
  private newNote: NoteModel[];
  private activeNote: NoteModel;
  private activePartnerOrganisation: PartnerOrganisationModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();
  private userAgencyId: string;

  @Input() isLocalAgency: boolean;

  @Input() isAgencyAdmin: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _commonService: CommonService,
              private _noteService: NoteService,
              private _sessionService: SessionService,
              private agencyService: AgencyService,
              private af: AngularFire,
              private router: Router) {
    this.areasOfOperation = [];
    this.partnerOrganisations = [];
    this.newNote = [];
  }

  ngOnDestroy() {
    this._sessionService.partner = null;
    this._sessionService.user = null;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()

    // get the country levels values
    this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(content => {
        this.countryLevelsValues = content;
      });
  }

  private initLocalAgency() {

    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

          this.uid = user.uid;
          this.userType = userType;
          this.userAgencyId = agencyId;

          if (this.agencyId && this.countryId && this.isViewing) {
            this._partnerOrganisationService.getCountryOfficePartnerOrganisations(this.agencyId, this.countryId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(partnerOrganisations => {
                this.partnerOrganisations = partnerOrganisations;

                this.assignProjectsToDisplayPerPartnerOrg();

                // Get the partner organisation notes
                this.partnerOrganisations.forEach(partnerOrganisation => {
                  const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
                  this._noteService.getNotes(partnerOrganisationNode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(notes => {
                    notes.forEach(note => {
                      if (this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)) {
                        this.agencyService.getAgency(note.agencyId)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe(agency => {
                            note.agencyName = agency.name;
                          })
                      }
                    })
                    partnerOrganisation.notes = notes;
                  });

                  // Create the new note model for partner organisation
                  this.newNote[partnerOrganisation.id] = new NoteModel();
                  this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
                });
              });

            PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
              this.countryPermissionsMatrix = isEnabled;
            }));
            // // get the country levels values
            // this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
            //   .subscribe(content => {
            //     this.countryLevelsValues = content;
            //   });

          } else {

            this._partnerOrganisationService.getLocalAgencyPartnerOrganisations(this.userAgencyId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(partnerOrganisations => {
                console.log(partnerOrganisations)
                this.partnerOrganisations = partnerOrganisations;

                this.assignProjectsToDisplayPerPartnerOrg();

                // Get the partner organisation notes
                this.partnerOrganisations.forEach(partnerOrganisation => {
                  const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
                  this._noteService.getNotes(partnerOrganisationNode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(notes => {
                    partnerOrganisation.notes = notes;
                  });

                  // Create the new note model for partner organisation
                  this.newNote[partnerOrganisation.id] = new NoteModel();
                  this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
                });
              });

            // // get the country levels values
            // this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
            //   .takeUntil(this.ngUnsubscribe)
            //   .subscribe(content => {
            //     this.countryLevelsValues = content;
            //   });

          }
        });
      });

  }

  private initCountryOffice() {
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

          this.uid = user.uid;
          this.userType = userType;
          this.userAgencyId = agencyId;

          if (this.agencyId && this.countryId && this.isViewing) {
            this._partnerOrganisationService.getCountryOfficePartnerOrganisations(this.agencyId, this.countryId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(partnerOrganisations => {
                this.partnerOrganisations = partnerOrganisations;

                this.assignProjectsToDisplayPerPartnerOrg();

                // Get the partner organisation notes
                this.partnerOrganisations.forEach(partnerOrganisation => {
                  const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
                  this._noteService.getNotes(partnerOrganisationNode).subscribe(notes => {
                    notes.forEach(note => {
                      if (this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)) {
                        this.agencyService.getAgency(note.agencyId)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe(agency => {
                            note.agencyName = agency.name;
                          })
                      }
                    })
                    partnerOrganisation.notes = notes;
                  });

                  // Create the new note model for partner organisation
                  this.newNote[partnerOrganisation.id] = new NoteModel();
                  this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
                });
              });
            // // get the country levels values
            // this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
            //   .subscribe(content => {
            //     this.countryLevelsValues = content;
            //   });
          } else {

            this.agencyId = agencyId;
            this.countryId = countryId;

            this._partnerOrganisationService.getCountryOfficePartnerOrganisations(this.agencyId, this.countryId)
              .subscribe(partnerOrganisations => {
                this.partnerOrganisations = partnerOrganisations;

                this.assignProjectsToDisplayPerPartnerOrg();

                // Get the partner organisation notes
                this.partnerOrganisations.forEach(partnerOrganisation => {
                  const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
                  this._noteService.getNotes(partnerOrganisationNode).subscribe(notes => {
                    notes.forEach(note => {
                      if (this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)) {
                        this.agencyService.getAgency(note.agencyId)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe(agency => {
                            note.agencyName = agency.name;
                          })
                      }
                    })
                    partnerOrganisation.notes = notes;
                  });

                  // Create the new note model for partner organisation
                  this.newNote[partnerOrganisation.id] = new NoteModel();
                  this.newNote[partnerOrganisation.id].uploadedBy = this.uid;
                });
              });

            // // get the country levels values
            // this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
            //   .subscribe(content => {
            //     this.countryLevelsValues = content;
            //     err => console.log(err);
            //   });
            // });
            // });
          }

          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
            this.countryPermissionsMatrix = isEnabled;
          }));

        });
      });
  }

  goBack() {
    if (this.isLocalAgency) {
      this.router.navigateByUrl('/local-agency/agency-staff');
    } else {
      this.router.navigateByUrl('/country-admin/country-staff');
    }

  }

  private assignProjectsToDisplayPerPartnerOrg() {
    this.partnerOrganisations.forEach(partnerOrganisation => {
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
    console.log(projectsToDisplay)
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
    if (this.isLocalAgency) {
      this.router.navigateByUrl('/local-agency/response-plans/add-partner-organisation');

    } else {
      this.router.navigateByUrl('/response-plans/add-partner-organisation');
    }

  }

  editPartnerOrganisation(partnerOrganisationId) {
    if (this.isLocalAgency) {
      this.router.navigate(['/local-agency/response-plans/add-partner-organisation', {id: partnerOrganisationId}], {skipLocationChange: true});
    } else {
      this.router.navigate(['/response-plans/add-partner-organisation', {id: partnerOrganisationId}], {skipLocationChange: true});
    }
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
    note.agencyId = this.userAgencyId
    if (this.validateNote(note)) {
      const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
      this._noteService.saveNote(partnerOrganisationNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
    jQuery('#edit-action').modal('show');
    this.activePartnerOrganisation = partnerOrganisation;
    this.activeNote = note;
  }

  editAction(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
    this.closeEditModal();

    if (this.validateNote(note)) {
      const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);
      this._noteService.saveNote(partnerOrganisationNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  closeEditModal() {
    jQuery('#edit-action').modal('hide');
  }

  deleteNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
    jQuery('#delete-action').modal('show');
    this.activePartnerOrganisation = partnerOrganisation;
    this.activeNote = note;
  }

  deleteAction(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
    this.closeDeleteModal();

    const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);

    this._noteService.deleteNote(partnerOrganisationNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeDeleteModal() {
    jQuery('#delete-action').modal('hide');
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

  private hasAreaOfOperation(partnerOrganisation: PartnerOrganisationModel, locationName: any): boolean {
    let exists = false;

    let areasOfOperation = this.getAreasOfOperation(partnerOrganisation.projectsToDisplay);

    if (areasOfOperation.join(",").search(locationName) !== -1) {
      exists = true;
    }

    return exists;
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
