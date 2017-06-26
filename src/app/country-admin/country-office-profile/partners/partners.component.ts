import {Component, OnInit, OnDestroy} from '@angular/core';
import {Constants} from '../../../utils/Constants';
import {AlertMessageType, ResponsePlanSectors} from '../../../utils/Enums';
import {RxHelper} from '../../../utils/RxHelper';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {AlertMessageModel} from '../../../model/alert-message.model';
import {PartnerOrganisationService} from '../../../services/partner-organisation.service';
import {PartnerOrganisationModel} from '../../../model/partner-organisation.model';
import {PartnerModel} from '../../../model/partner.model';
import {ModelUserPublic} from '../../../model/user-public.model';
import {UserService} from "../../../services/user.service";
import {CountryAdminModel} from "../../../model/country-admin.model";
import {DisplayError} from "../../../errors/display.error";
import {SessionService} from "../../../services/session.service";
import {CommonService} from "../../../services/common.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css'],
  providers: [PartnerOrganisationService]
})

export class CountryOfficePartnersComponent implements OnInit, OnDestroy {
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private agencyId: string;
  private countryId: string;
  private isViewing: boolean;

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

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _commonService: CommonService,
              private _noteService: NoteService,
              private _sessionService: SessionService,
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

    this.route.params
      .takeUntil(this.ngUnsubscribe)
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

        this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {

          this.uid = user.uid;

          if (this.agencyId && this.countryId) {
            this._partnerOrganisationService.getCountryOfficePartnerOrganisations(this.agencyId, this.countryId)
              .subscribe(partnerOrganisations => {
                this.partnerOrganisations = partnerOrganisations;

                // Get the partner organisation notes
                this.partnerOrganisations.forEach(partnerOrganisation => {
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
              .subscribe(content => {
                this.countryLevelsValues = content;
                err => console.log(err);
              });
          } else {
            this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {

              this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
              this.countryId = countryAdminUser.countryId;

              this._partnerOrganisationService.getCountryOfficePartnerOrganisations(this.agencyId, this.countryId)
                .subscribe(partnerOrganisations => {
                  this.partnerOrganisations = partnerOrganisations;

                  // Get the partner organisation notes
                  this.partnerOrganisations.forEach(partnerOrganisation => {
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
                .subscribe(content => {
                  this.countryLevelsValues = content;
                  err => console.log(err);
                });
            });
          }


        });

      });


  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
  }

  getAreasOfOperation(partnerOrganisation: PartnerOrganisationModel) {
    let areasOfOperation: string[] = [];
    if (partnerOrganisation && partnerOrganisation.projects && this.countryLevelsValues) {
      partnerOrganisation.projects.forEach(project => {
        project.operationAreas.forEach(location => {
          const locationName =
            this.countryLevelsValues[location.country]['levelOneValues'][location.level1]['levelTwoValues'][location.level2].value;
          areasOfOperation.push(locationName);
          if (!this.areasOfOperation.find(x => x == locationName)) {
            this.areasOfOperation.push(locationName);
            this.areasOfOperation.sort();
          }
        });
      })
      return areasOfOperation.join(',');
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

  private hasAreaOfOperation(partnerOrganisation: PartnerOrganisationModel, locationName: string): boolean {
    let exists = false;

    let areasOfOperation = this.getAreasOfOperation(partnerOrganisation);

    if (areasOfOperation.search(locationName) !== -1) {
      exists = true;
    }

    return exists;
  }
}
