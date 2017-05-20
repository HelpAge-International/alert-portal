import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class PermissionSettingsModel extends BaseModel {
  public chsActions: any[];
  public mandatedApaAssign: any[];
  public mandatedMpaAssign: any[];
  public countryContacts: ContactsPermissionSettingsModel;
  public crossCountry: CrossCountryPermissionSettingsModel;
  public customApa: CustomPAPermissionSettingsModel;
  public customMpa: CustomPAPermissionSettingsModel;
  public interAgency: InterAgencyPermissionSettingsModel;
  public notes: NotesPermissionSettingsModel;
  public other: OtherPermissionSettingsModel;

  constructor(){
    super();
    this.chsActions = [];
    this.countryContacts = new ContactsPermissionSettingsModel();
    this.crossCountry = new CrossCountryPermissionSettingsModel();
    this.customApa = new CustomPAPermissionSettingsModel();
    this.customMpa = new CustomPAPermissionSettingsModel();
    this.interAgency = new InterAgencyPermissionSettingsModel();
    this.notes = new NotesPermissionSettingsModel();
    this.other = new OtherPermissionSettingsModel();
  }

  validate(excludedFields = []): AlertMessageModel {
    if (!this.chsActions && !this.isExcluded('chsActions', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_CSH_ACTIONS');
    }
    if (!this.mandatedApaAssign && !this.isExcluded('mandatedApaAssign', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_MANDATED_APA_ASSIGN');
    }
    if (!this.mandatedMpaAssign && !this.isExcluded('mandatedMpaAssign', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_MANDATED_MPA_ASSIGN');
    }
    if (!this.countryContacts && !this.isExcluded('countryContacts', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_COUNTRY_CONTACTS');
    }
    if (!this.crossCountry && !this.isExcluded('crossCountry', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_CROSS_COUNTRY');
    }
    if (!this.customApa && !this.isExcluded('customApa', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_CUSTOM_APA');
    }
    if (!this.customMpa && !this.isExcluded('customMpa', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_CUSTOM_MPA');
    }
    if (!this.interAgency && !this.isExcluded('interAgency', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_INTER_AGENCY');
    }
    if (!this.notes && !this.isExcluded('notes', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_NOTES');
    }
    if (!this.other && !this.isExcluded('other', excludedFields)) {
      return new AlertMessageModel('PERMISSIONS.NO_OTHER');
    }
    return null;
  }
}

export class ContactsPermissionSettingsModel extends BaseModel{
    public delete: any[];
    public edit: any[];
    public new: any[];

    constructor(){
        super();
        this.delete = [];
        this.edit = [];
        this.new = [];
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class CrossCountryPermissionSettingsModel extends BaseModel{
    public addNote: any[];
    public copyAction: any[];
    public download: any[];
    public edit: any[];
    public view: any[];
    public viewContacts: any[];

    constructor(){
        super();
        this.addNote = [];
        this.copyAction = [];
        this.download = [];
        this.edit = [];
        this.view = [];
        this.viewContacts = [];
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class CustomPAPermissionSettingsModel extends BaseModel{
    public assign: any[];
    public delete: any[];
    public edit: any[];
    public new: any[];

    constructor(){
        super();
        this.assign = [];
        this.edit = [];
        this.delete = [];
        this.new = [];
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class InterAgencyPermissionSettingsModel extends BaseModel{
    public addNote: any[];
    public copyAction: any[];
    public download: any[];
    public edit: any[];
    public view: any[];
    public viewContacts: any[];

    constructor(){
        super();
        this.addNote = [];
        this.copyAction = [];
        this.download = [];
        this.edit = [];
        this.view = [];
        this.viewContacts = [];
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class NotesPermissionSettingsModel extends BaseModel{
    public delete: any[];
    public edit: any[];
    public new: any[];

    constructor(){
        super();
        this.edit = [];
        this.delete = [];
        this.new = [];
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class OtherPermissionSettingsModel extends BaseModel{
    public downloadDoc: any[];
    public uploadDoc: any[];

    constructor(){
        super();
        this.downloadDoc = [];
        this.uploadDoc = [];
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}