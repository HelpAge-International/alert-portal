import { BaseModel } from "./base.model";
import { OperationAreaModel } from "./operation-area.model";
import { AlertMessageModel } from "./alert-message.model";
import { CustomerValidator } from "../utils/CustomValidator";
import { NoteModel } from "./note.model";

export class PartnerOrganisationModel extends BaseModel {
  public id: string;
  public organisationName: string;
  public relationship: string;
  public title: number;
  public firstName: string;
  public lastName: string;
  public phone: string;
  public email: string;
  public position: string;
  public projects: PartnerOrganisationProjectModel[];
  public notes: Array<NoteModel>;
  public partners: any[];
  public isApproved: boolean;
  public externalPartner: boolean;
  public modifiedAt: number;

  constructor(){
    super();
    this.projects = [new PartnerOrganisationProjectModel()];
    this.notes = [];
    this.partners = [];
    this.isApproved = false;
    this.externalPartner = true;
  }


  validate(excludedFields = []): AlertMessageModel {
    if (!this.organisationName && !this.isExcluded('organisationName', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_ORGANISATION_NAME');
    }
    if (!this.relationship && !this.isExcluded('relationship', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_RELATIONSHIP');
    }
    if (!this.title && !this.isExcluded('title', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_TITLE');
    }
    if (!this.firstName && !this.isExcluded('firstName', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME');
    }
    if (!this.lastName && !this.isExcluded('lastName', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME');
    }
    if (!this.position && !this.isExcluded('position', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_POSITION');
    }
    if (!this.email && !this.isExcluded('email', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_EMAIL');
    }
    if (!CustomerValidator.EmailValidator(this.email) && !this.isExcluded('email', excludedFields)) {
      return new AlertMessageModel('GLOBAL.EMAIL_NOT_VALID');
    }
    if (!this.phone && !this.isExcluded('phone', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_PHONE');
    }
    
    return null;
  }
} 
export class PartnerOrganisationProjectModel extends BaseModel {
  public title: string;
  public endDate: number;
  public sector: any[];
  public operationAreas: OperationAreaModel[];

  constructor(){
    super();
    this.operationAreas = [new OperationAreaModel()];
    this.sector = [];
  }

  validate(excludedFields = []): AlertMessageModel {
    if (!this.title && !this.isExcluded('title', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_PROJECT_TITLE');
    }
    if (Object.keys(this.sector).length < 1 && !this.isExcluded('sector', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_PROJECT_SECTOR');
    }
    if (!this.endDate && !this.isExcluded('endDate', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_PROJECT_END_DATE');
    }
    return null;
  }
}