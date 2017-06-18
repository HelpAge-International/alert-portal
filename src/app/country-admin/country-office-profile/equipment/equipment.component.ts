import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType } from '../../../utils/Enums';
import { RxHelper } from '../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../model/alert-message.model';
import { DisplayError } from "../../../errors/display.error";
import { NoteModel } from "../../../model/note.model";
import { NoteService } from "../../../services/note.service";
import { UserService } from "../../../services/user.service";
import { EquipmentService } from "../../../services/equipment.service";
import { EquipmentModel } from "../../../model/equipment.model";
import { SurgeEquipmentModel } from "../../../model/equipment-surge.model";
import {PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
})

export class CountryOfficeEquipmentComponent implements OnInit, OnDestroy {
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;

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

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _equipmentService: EquipmentService,
              private _noteService: NoteService,
              private router: Router,
              private route: ActivatedRoute){
    this.newNote = [];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
        this.countryId = countryAdminUser.countryId;

        this._equipmentService.getEquipments(this.countryId)
              .subscribe(equipments => {
                this.equipments = equipments;

                this.equipments.forEach(equipment => {
                  const equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipment.id);

                  this._noteService.getNotes(equipmentNode).subscribe(notes => {
                    equipment.notes = notes;
                  });

                  // Create the new note model
                  this.newNote[equipment.id] = new NoteModel();
                  this.newNote[equipment.id].uploadedBy = this.uid;
                });
              });

        this._equipmentService.getSurgeEquipments(this.countryId)
              .subscribe(surgeEquipments => {
                this.surgeEquipments = surgeEquipments;

                this.surgeEquipments.forEach(surgeEquipment => {
                  const surgeEquipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', surgeEquipment.id);

                  this._noteService.getNotes(surgeEquipmentNode).subscribe(notes => {
                    surgeEquipment.notes = notes;
                  });

                  // Create the new note model
                  this.newNote[surgeEquipment.id] = new NoteModel();
                  this.newNote[surgeEquipment.id].uploadedBy = this.uid;
                });

              });
      });
    });
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
  }

  editEquipment() {
    this.isEdit = true;
  }

  showEquipment() {
    this.isEdit = false;
  }

  addEditEquipment(equipmentId?: string) {
    if(equipmentId)
    {
      this.router.navigate(['/country-admin/country-office-profile/equipment/add-edit-equipment', {id: equipmentId}], {skipLocationChange: true});
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/equipment/add-edit-equipment');
    }
  }

  addEditSurgeEquipment(surgeEquipmentId?: string) {
    if(surgeEquipmentId)
    {
      this.router.navigate(['/country-admin/country-office-profile/equipment/add-edit-surge-equipment', {id: surgeEquipmentId}], {skipLocationChange: true});
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/equipment/add-edit-surge-equipment');
    }

  }

getUserName(userId) {
    let userName = "";

    if(!userId) return userName;

    this._userService.getUser(userId).subscribe(user => {
      userName = user.firstName + ' ' + user.lastName;
    });

    return userName;
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }


  addNote(equipmentType: string, equipmentId: string, note: NoteModel)
  {
    if(this.validateNote(note))
    {
      let equipmentNode = "";

      if(equipmentType == 'equipment')
      {
        equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
      }else{
        equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
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

    if(this.validateNote(note))
    {
      let equipmentNode = "";

      if(equipmentType == 'equipment')
      {
        equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
      }else{
        equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
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

    if(equipmentType == 'equipment')
    {
      equipmentNode = Constants.EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
    }else{
      equipmentNode = Constants.SURGE_EQUIPMENT_NODE.replace('{countryId}', this.countryId).replace('{id}', equipmentId);
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
}
