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