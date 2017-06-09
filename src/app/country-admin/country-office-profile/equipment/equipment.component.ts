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
  
  constructor(private _userService: UserService,
              private _equipmentService: EquipmentService,
              private _noteService: NoteService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
    this.newNote = [];
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
        this.countryId = countryAdminUser.countryId;

        this._equipmentService.getEquipments(this.countryId)
              .subscribe(equipments => {
                this.equipments = equipments;
              });

        this._equipmentService.getSurgeEquipments(this.countryId)
              .subscribe(surgeEquipments => {
                this.surgeEquipments = surgeEquipments;
              });
      });
    })
    this.subscriptions.add(authSubscription);
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

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }

  // addNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel)
  // {
  //   if(this.validateNote(note))
  //   {
  //     const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id); 
  //     this._noteService.saveNote(partnerOrganisationNode, note).then(() => {
  //       this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
  //     })
  //     .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
  //   }
  // }

  // editNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
  //   jQuery('#edit-action').modal('show');
  //   this.activePartnerOrganisation = partnerOrganisation;
  //   this.activeNote = note;
  // }

// editAction(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
//     this.closeEditModal();

//     if(this.validateNote(note))
//     {
//       const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id); 
//       this._noteService.saveNote(partnerOrganisationNode, note).then(() => {
//         this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
//       })
//       .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
//     }
//  }

//   closeEditModal() {
//     jQuery('#edit-action').modal('hide');
//   }

//   deleteNote(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
//     jQuery('#delete-action').modal('show');
//     this.activePartnerOrganisation = partnerOrganisation;
//     this.activeNote = note;
//   }

//   deleteAction(partnerOrganisation: PartnerOrganisationModel, note: NoteModel) {
//     this.closeDeleteModal();

//     const partnerOrganisationNode = Constants.PARTNER_ORGANISATION_NODE.replace('{id}', partnerOrganisation.id);

//     this._noteService.deleteNote(partnerOrganisationNode, note)
//       .then(() => {
//         this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
//       })
//       .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
//  }

//   closeDeleteModal() {
//     jQuery('#delete-action').modal('hide');
//   }
}