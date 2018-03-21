import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, Countries, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {UserService} from "../../../services/user.service";
import {EquipmentService} from "../../../services/equipment.service";
import {EquipmentModel} from "../../../model/equipment.model";
import {SurgeEquipmentModel} from "../../../model/equipment-surge.model";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
import { CountryOfficeAddEditEquipmentComponent } from "./add-edit-equipment/add-edit-equipment.component";
import {AgencyService} from "../../../services/agency-service.service";
import {CommonService} from "../../../services/common.service";

declare var jQuery: any;

@Component({
  selector: 'app-country-office-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
})

export class CountryOfficeEquipmentComponent implements OnInit, OnDestroy {
  private USER_TYPE = UserType;
  private userType: UserType;
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;
  private agencyId: string;
  private isViewing: boolean;

  // For ALT-2039

  private levelOneDisplay: any[] = [];

  private selectedCountry: any;
  private programmeId: any;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private countries = Constants.COUNTRIES;
  private equipmentId: any;
  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private equipments: EquipmentModel[];
  private surgeEquipments: SurgeEquipmentModel[];

  // Helpers
  private newNote: NoteModel[];
  private activeNote: NoteModel;
  private activeEquipmentId: string;
  private activeEquipmentType: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();
  private userAgencyId: string;
  private locationObjs: any[] = [];

  @Input() isLocalAgency: boolean;

  @Input() isAgencyAdmin: boolean;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _equipmentService: EquipmentService,
              private _noteService: NoteService,
              private agencyService: AgencyService,
              private router: Router,
              private af: AngularFire,
              private jsonService: CommonService,
              private route: ActivatedRoute) {
    this.newNote = [];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()
  }

  private initLocalAgency(){
        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userType = userType;
          this.agencyId = agencyId;

            this._equipmentService.getEquipmentsLocalAgency(this.agencyId)
              .subscribe(equipments => {
                this.equipments = equipments;

                this.equipments.forEach(equipment => {
                  const equipmentNode = Constants.EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', equipment.id);

                  console.log(equipmentNode)
                  this._noteService.getNotes(equipmentNode).subscribe(notes => {
                    equipment.notes = notes;
                  });

                  // Create the new note model
                  this.newNote[equipment.id] = new NoteModel();
                  this.newNote[equipment.id].uploadedBy = this.uid;
                });
                this.generateLocations();
              });

            this._equipmentService.getSurgeEquipmentsLocalAgency(this.agencyId)
              .subscribe(surgeEquipments => {
                this.surgeEquipments = surgeEquipments;

                this.surgeEquipments.forEach(surgeEquipment => {
                  const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', surgeEquipment.id);

                  console.log(surgeEquipmentNode)
                  this._noteService.getNotes(surgeEquipmentNode).subscribe(notes => {
                    surgeEquipment.notes = notes;
                  });

                  // Create the new note model
                  this.newNote[surgeEquipment.id] = new NoteModel();
                  this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                });

              });
        });
  }

  private initCountryOffice(){
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

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userType = userType;
          this.countryId = countryId ? countryId : this.countryId;
          this.programmeId = systemId;
          this.userAgencyId = agencyId;

          if (this.countryId && this.agencyId && this.isViewing) {
            this._equipmentService.getEquipments(this.countryId)
              .subscribe(equipments => {
                this.equipments = equipments;

                this.equipments.forEach(equipment => {
                  const equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipment.id);

                  this._noteService.getNotes(equipmentNode).subscribe(notes => {
                    notes.forEach( note => {
                      if(this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)){
                        this.agencyService.getAgency(note.agencyId)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe( agency => {
                            note.agencyName = agency.name;
                          })
                      }
                    });
                    equipment.notes = notes;
                  });
                  // Create the new note model
                  this.newNote[equipment.id] = new NoteModel();
                  this.newNote[equipment.id].uploadedBy = this.uid;
                });
                this.generateLocations();
              });

            this._equipmentService.getSurgeEquipments(this.countryId)
              .subscribe(surgeEquipments => {
                this.surgeEquipments = surgeEquipments;

                this.surgeEquipments.forEach(surgeEquipment => {
                  const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', surgeEquipment.id);

                  this._noteService.getNotes(surgeEquipmentNode).subscribe(notes => {
                    notes.forEach( note => {
                      if(this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)){
                        this.agencyService.getAgency(note.agencyId)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe( agency => {
                            note.agencyName = agency.name;
                          })
                      }
                    })
                    surgeEquipment.notes = notes;
                  });

                  // Create the new note model
                  this.newNote[surgeEquipment.id] = new NoteModel();
                  this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                });

              });
          } else {

            this.agencyId = agencyId;
            this.countryId = countryId ? countryId : this.countryId;

            // this._userService.getAgencyId(Constants.USER_PATHS[this.userType], this.uid)
            //   .takeUntil(this.ngUnsubscribe)
            //   .subscribe(agencyId => {
            //     this.agencyId = agencyId;
            //     this._userService.getCountryId(Constants.USER_PATHS[this.userType], this.uid)
            //       .takeUntil(this.ngUnsubscribe)
            //       .subscribe(countryId => {
            //         this.countryId = countryId;

            this._equipmentService.getEquipments(this.countryId)
              .subscribe(equipments => {
                this.equipments = equipments;
                this.selectedCountry = equipments[0].location;
                this.equipments.forEach(equipment => {
                  const equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipment.id);

                  this._noteService.getNotes(equipmentNode).subscribe(notes => {
                    notes.forEach( note => {
                      if(this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)){
                        this.agencyService.getAgency(note.agencyId)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe( agency => {
                            note.agencyName = agency.name;
                          })
                      }
                    });
                    equipment.notes = notes;
                  });

                  // Create the new note model
                  this.newNote[equipment.id] = new NoteModel();
                  this.newNote[equipment.id].uploadedBy = this.uid;
                });
                this.generateLocations();
              });

            this._equipmentService.getSurgeEquipments(this.countryId)
              .subscribe(surgeEquipments => {
                this.surgeEquipments = surgeEquipments;

                this.surgeEquipments.forEach(surgeEquipment => {
                  const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', surgeEquipment.id);

                  this._noteService.getNotes(surgeEquipmentNode).subscribe(notes => {
                    notes.forEach( note => {
                      if(this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)){
                        this.agencyService.getAgency(note.agencyId)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe( agency => {
                            note.agencyName = agency.name;
                          })
                      }
                    })
                    surgeEquipment.notes = notes;
                  });

                  // Create the new note model
                  this.newNote[surgeEquipment.id] = new NoteModel();
                  this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                });

              });

            //     })
            // });
          }

          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
            this.countryPermissionsMatrix = isEnabled;
          }));

        });
      });
  }

  goBack() {
    if(this.isLocalAgency){
      this.router.navigateByUrl('/local-agency/agency-staff');
    }else{
      this.router.navigateByUrl('/country-admin/country-staff');
    }

  }

  editEquipment() {
    this.isEdit = true;
  }

  showEquipment() {
    this.isEdit = false;
  }

  addEditEquipment(equipmentId?: string) {
    if(this.isLocalAgency){
      if (equipmentId) {
        this.router.navigate(['/local-agency/profile/equipment/add-edit-equipment', {id: equipmentId}], {skipLocationChange: true});
      } else {
        this.router.navigateByUrl('/local-agency/profile/equipment/add-edit-equipment');
      }
    }else{
      if (equipmentId) {
        this.router.navigate(['/country-admin/country-office-profile/equipment/add-edit-equipment', {id: equipmentId}]);
      } else {
        this.router.navigateByUrl('/country-admin/country-office-profile/equipment/add-edit-equipment');
      }
    }
  }

  addEditSurgeEquipment(surgeEquipmentId?: string) {
    if(this.isLocalAgency){
      if (surgeEquipmentId) {
        this.router.navigate(['/local-agency/profile/equipment/add-edit-surge-equipment', {id: surgeEquipmentId}], {skipLocationChange: true});
      } else {
        this.router.navigateByUrl('/local-agency/profile/equipment/add-edit-surge-equipment');
      }
    }else{
      if (surgeEquipmentId) {
        this.router.navigate(['/country-admin/country-office-profile/equipment/add-edit-surge-equipment', {id: surgeEquipmentId}], {skipLocationChange: true});
      } else {
        this.router.navigateByUrl('/country-admin/country-office-profile/equipment/add-edit-surge-equipment');
      }
    }

  }

  getUserName(userId) {
    let userName = "";

    if (!userId) return userName;

    this._userService.getUser(userId).subscribe(user => {
      userName = user.firstName + ' ' + user.lastName;
    });

    return userName;
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }


  addNote(equipmentType: string, equipmentId: string, note: NoteModel) {
    if (this.validateNote(note)) {
      let equipmentNode = "";
      note.agencyId = this.userAgencyId

      if(this.isLocalAgency){
        if (equipmentType == 'equipment') {
          equipmentNode = Constants.EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', equipmentId);
        } else {
          equipmentNode = Constants.SURGE_EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', equipmentId);
        }
      }else{
        if (equipmentType == 'equipment') {
          equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
        } else {
          equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
        }
      }

      this._noteService.saveNote(equipmentNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editNote(equipmentType: string, equipmentId: string, note: NoteModel) {
    jQuery('#edit-action').modal('show');
    this.activeEquipmentId = equipmentId;
    this.activeNote = note;
    this.activeEquipmentType = equipmentType;
  }

  editAction(equipmentType: string, equipmentId: string, note: NoteModel) {
    this.closeEditModal();

    if (this.validateNote(note)) {
      let equipmentNode = "";

      if(this.isLocalAgency){
        if (equipmentType == 'equipment') {
          equipmentNode = Constants.EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', equipmentId);
        } else {
          equipmentNode = Constants.SURGE_EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', equipmentId);
        }
      }else{
        if (equipmentType == 'equipment') {
          equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
        } else {
          equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
        }
      }

      this._noteService.saveNote(equipmentNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  closeEditModal() {
    jQuery('#edit-action').modal('hide');
  }

  deleteNote(equipmentType: string, equipmentId: string, note: NoteModel) {
    jQuery('#delete-action').modal('show');
    this.activeEquipmentType = equipmentType;
    this.activeEquipmentId = equipmentId;
    this.activeNote = note;
  }

  deleteAction(equipmentType: string, equipmentId: string, note: NoteModel) {
    this.closeDeleteModal();

    let equipmentNode = '';

    if(this.isLocalAgency){
      if (equipmentType == 'equipment') {
        equipmentNode = Constants.EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', equipmentId);
      } else {
        equipmentNode = Constants.SURGE_EQUIPMENT_NODE_LOCAL_AGENCY.replace('{agencyId}', this.agencyId).replace('{id}', equipmentId);
      }
    }else{
      if (equipmentType == 'equipment') {
        equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
      } else {
        equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
      }
    }

    this._noteService.deleteNote(equipmentNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeDeleteModal() {
    jQuery('#delete-action').modal('hide');
  }

  generateLocations(){
    this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((json) => {
      this.equipments.forEach(mapping => {
        let obj = {
          country: "",
          areas: ""
        };
        if (mapping.location && mapping.location > -1) {
          obj.country = this.countries[mapping.location];
        }
        if (mapping.level1 && mapping.level1 > -1) {
          obj.areas = ", " + json[mapping.location].levelOneValues[mapping.level1].value
        }
        if (mapping.level2 && mapping.level2) {
          obj.areas = obj.areas + ", " + json[mapping.location].levelOneValues[mapping.level1].levelTwoValues[mapping.level2].value;
        }
        this.locationObjs.push(obj);
      });
    });
  }
}
