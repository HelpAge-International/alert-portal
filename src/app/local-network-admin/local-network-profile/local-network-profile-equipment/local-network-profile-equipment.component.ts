import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {NetworkService} from "../../../services/network.service";
import {AgencyService} from "../../../services/agency-service.service";
import {UserService} from "../../../services/user.service";
import {EquipmentService} from "../../../services/equipment.service";
import {EquipmentModel} from "../../../model/equipment.model";
import {SurgeEquipmentModel} from "../../../model/equipment-surge.model";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
import {LocalStorageService} from "angular-2-local-storage";

declare var jQuery: any;


@Component({
  selector: 'app-local-network-profile-equipment',
  templateUrl: './local-network-profile-equipment.component.html',
  styleUrls: ['./local-network-profile-equipment.component.css']
})
export class LocalNetworkProfileEquipmentComponent implements OnInit, OnDestroy {
  officeAgencyMap: Map<string, string>;
  agencies = [];
  networkID: any;

  private USER_TYPE = UserType;
  private userType: UserType;
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;
  private agencyId: string;
  private isViewing: boolean;

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private equipments = new Map<string, EquipmentModel[]>()
  private surgeEquipments = new Map<string, SurgeEquipmentModel[]>()


  // Helpers
  private newNote: NoteModel[];
  private activeNote: NoteModel;
  private activeEquipmentId: string;
  private activeEquipmentType: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  //network country re-use
  @Input() isNetworkCountry: boolean;
  private networkCountryId: string;
  private networkViewValues: {};
  private isViewingFromExternal: boolean;


  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _equipmentService: EquipmentService,
              private _noteService: NoteService,
              private _networkService: NetworkService,
              private _agencyService: AgencyService,
              private router: Router,
              private af: AngularFire,
              private storageService: LocalStorageService,
              private route: ActivatedRoute) {
    this.newNote = [];
  }

  ngOnDestroy() {
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
          this.networkID = params['networkId'];
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
    if(this.isViewing){

            this._networkService.mapAgencyCountryForNetworkCountry(this.networkID, this.networkCountryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(map => {
                this.officeAgencyMap = map;

                map.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency);

                      this._equipmentService.getEquipments(value)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(equipments => {
                          this.equipments.set(key, equipments);

                          this.equipments.get(key).forEach(equipment => {
                            const equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', equipment.id);

                            this._noteService.getNotes(equipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                              equipment.notes = notes;
                            });

                            // Create the new note model
                            this.newNote[equipment.id] = new NoteModel();
                            this.newNote[equipment.id].uploadedBy = this.uid;
                          });
                        });

                      this._equipmentService.getSurgeEquipments(value)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(surgeEquipments => {
                          this.surgeEquipments.set(key, surgeEquipments);

                          this.surgeEquipments.get(key).forEach(surgeEquipment => {
                            const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', surgeEquipment.id);

                            this._noteService.getNotes(surgeEquipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                              surgeEquipment.notes = notes;
                            });

                            // Create the new note model
                            this.newNote[surgeEquipment.id] = new NoteModel();
                            this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                          });

                        });
                    })
                });


              });

    }else{
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        this._networkService.getSelectedIdObj(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkID = selection["id"];
            this.networkCountryId = selection["networkCountryId"];
            console.log(selection)

            this._networkService.mapAgencyCountryForNetworkCountry(this.networkID, this.networkCountryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(map => {
                this.officeAgencyMap = map;

                map.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency);

                      this._equipmentService.getEquipments(value)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(equipments => {
                          this.equipments.set(key, equipments);

                          this.equipments.get(key).forEach(equipment => {
                            const equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', equipment.id);

                            this._noteService.getNotes(equipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                              equipment.notes = notes;
                            });

                            // Create the new note model
                            this.newNote[equipment.id] = new NoteModel();
                            this.newNote[equipment.id].uploadedBy = this.uid;
                          });
                        });

                      this._equipmentService.getSurgeEquipments(value)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(surgeEquipments => {
                          this.surgeEquipments.set(key, surgeEquipments);

                          this.surgeEquipments.get(key).forEach(surgeEquipment => {
                            const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', surgeEquipment.id);

                            this._noteService.getNotes(surgeEquipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                              surgeEquipment.notes = notes;
                            });

                            // Create the new note model
                            this.newNote[surgeEquipment.id] = new NoteModel();
                            this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                          });

                        });
                    })
                });


              });
          });
      });
    }

  }

  private localNetworkAdminAccess() {
    if(this.networkViewValues || this.isViewingFromExternal){
      console.log("networkViewValues")
            this._networkService.getAgencyCountryOfficesByNetwork(this.networkID)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(officeAgencyMap => {
                this.officeAgencyMap = officeAgencyMap
                this.agencies = []

                officeAgencyMap.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency)

                    })

                  this._equipmentService.getEquipments(value)
                    .subscribe(equipments => {
                      this.equipments.set(key, equipments)

                      this.equipments.get(key).forEach(equipment => {
                        const equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', equipment.id);

                        this._noteService.getNotes(equipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                          equipment.notes = notes;
                        });

                        // Create the new note model
                        this.newNote[equipment.id] = new NoteModel();
                        this.newNote[equipment.id].uploadedBy = this.uid;
                      });
                    });

                  this._equipmentService.getSurgeEquipments(value)
                    .subscribe(surgeEquipments => {
                      this.surgeEquipments.set(key, surgeEquipments)

                      this.surgeEquipments.get(key).forEach(surgeEquipment => {
                        const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', surgeEquipment.id);

                        this._noteService.getNotes(surgeEquipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                          surgeEquipment.notes = notes;
                        });

                        // Create the new note model
                        this.newNote[surgeEquipment.id] = new NoteModel();
                        this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                      });

                    });
                })
              })

    }else{
      console.log("normal login")
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;
        this._networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkID = selection["id"];
            this._networkService.getAgencyCountryOfficesByNetwork(this.networkID)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(officeAgencyMap => {
                this.officeAgencyMap = officeAgencyMap
                this.agencies = []

                officeAgencyMap.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency)

                    })

                  this._equipmentService.getEquipments(value)
                    .subscribe(equipments => {
                      this.equipments.set(key, equipments)

                      this.equipments.get(key).forEach(equipment => {
                        const equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', equipment.id);

                        this._noteService.getNotes(equipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                          equipment.notes = notes;
                        });

                        // Create the new note model
                        this.newNote[equipment.id] = new NoteModel();
                        this.newNote[equipment.id].uploadedBy = this.uid;
                      });
                    });

                  this._equipmentService.getSurgeEquipments(value)
                    .subscribe(surgeEquipments => {
                      this.surgeEquipments.set(key, surgeEquipments)

                      this.surgeEquipments.get(key).forEach(surgeEquipment => {
                        const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', value).replace('{id}', surgeEquipment.id);

                        this._noteService.getNotes(surgeEquipmentNode).takeUntil(this.ngUnsubscribe).subscribe(notes => {
                          surgeEquipment.notes = notes;
                        });

                        // Create the new note model
                        this.newNote[surgeEquipment.id] = new NoteModel();
                        this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                      });

                    });
                })
              })
          })
      })
    }

  }

  editEquipment() {
    this.isEdit = true;
  }

  showEquipment() {
    this.isEdit = false;
  }

  addEditEquipment(equipmentId?: string) {
    if (equipmentId) {
      this.router.navigate(['/country-admin/country-office-profile/equipment/add-edit-equipment', {id: equipmentId}], {skipLocationChange: true});
    } else {
      this.router.navigateByUrl('/country-admin/country-office-profile/equipment/add-edit-equipment');
    }
  }

  addEditSurgeEquipment(surgeEquipmentId?: string) {
    if (surgeEquipmentId) {
      this.router.navigate(['/country-admin/country-office-profile/equipment/add-edit-surge-equipment', {id: surgeEquipmentId}], {skipLocationChange: true});
    } else {
      this.router.navigateByUrl('/country-admin/country-office-profile/equipment/add-edit-surge-equipment');
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


  addNote(equipmentType: string, equipmentId: string, note: NoteModel, agency) {
    if (this.validateNote(note)) {
      let equipmentNode = "";

      if (equipmentType == 'equipment') {
        equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', equipmentId);
      } else {
        equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', equipmentId);
      }

      this._noteService.saveNote(equipmentNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editNote(equipmentType: string, equipmentId: string, note: NoteModel, agency) {
    jQuery('#edit-action-' + agency.$key).modal('show');
    this.activeEquipmentId = equipmentId;
    this.activeNote = note;
    this.activeEquipmentType = equipmentType;
  }

  editAction(equipmentType: string, equipmentId: string, note: NoteModel, agency) {
    this.closeEditModal(agency);

    if (this.validateNote(note)) {
      let equipmentNode = "";

      if (equipmentType == 'equipment') {
        equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', equipmentId);
      } else {
        equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', equipmentId);
      }

      this._noteService.saveNote(equipmentNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  closeEditModal(agency) {
    jQuery('#edit-action-' + agency.$key).modal('hide');
  }

  deleteNote(equipmentType: string, equipmentId: string, note: NoteModel, agency) {
    jQuery('#delete-action-' + agency.$key).modal('show');
    this.activeEquipmentType = equipmentType;
    this.activeEquipmentId = equipmentId;
    this.activeNote = note;
  }

  deleteAction(equipmentType: string, equipmentId: string, note: NoteModel, agency) {
    this.closeDeleteModal(agency);

    let equipmentNode = '';

    if (equipmentType == 'equipment') {
      equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', equipmentId);
    } else {
      equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', equipmentId);
    }

    this._noteService.deleteNote(equipmentNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeDeleteModal(agency) {
    jQuery('#delete-action-' + agency.$key).modal('hide');
  }

}
