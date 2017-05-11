import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class PermissionsModel extends BaseModel {
  public assignCHS: boolean;
  public assignMandatedApa: boolean;
  public assignMandatedMpa: boolean;
  public contacts: ContactsPermissionModel;
  public crossCountry: CrossCountryPermissionModel;
  public customApa: CustomPAPermissionModel;
  public customMpa: CustomPAPermissionModel;
  public interAgency: InterAgencyPermissionModel;
  public notes: NotesPermissionModel;
  public other: OtherPermissionModel;

  constructor(){
    super();
    this.assignCHS = false;
    this.assignMandatedApa = false;
    this.assignMandatedMpa = false;
    this.contacts = new ContactsPermissionModel();
    this.crossCountry = new CrossCountryPermissionModel();
    this.customApa = new CustomPAPermissionModel();
    this.customMpa = new CustomPAPermissionModel();
    this.interAgency = new InterAgencyPermissionModel();
    this.notes = new NotesPermissionModel();
    this.other = new OtherPermissionModel();
  }

  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}

export class ContactsPermissionModel extends BaseModel{
    public delete: boolean;
    public edit: boolean;
    public new: boolean;

    constructor(){
        super();
        this.delete = false;
        this.edit = false;
        this.new = false;
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class CrossCountryPermissionModel extends BaseModel{
    public addNote: boolean;
    public copyAction: boolean;
    public download: boolean;
    public edit: boolean;
    public view: boolean;
    public viewContacts: boolean;

    constructor(){
        super();
        this.addNote = false;
        this.copyAction = false;
        this.download = false;
        this.edit = false;
        this.view = false;
        this.viewContacts = false;
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class CustomPAPermissionModel extends BaseModel{
    public assign: boolean;
    public delete: boolean;
    public edit: boolean;
    public new: boolean;

    constructor(){
        super();
        this.assign = false;
        this.edit = false;
        this.delete = false;
        this.new = false;
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class InterAgencyPermissionModel extends BaseModel{
    public addNote: boolean;
    public copyAction: boolean;
    public download: boolean;
    public edit: boolean;
    public view: boolean;
    public viewContacts: boolean;

    constructor(){
        super();
        this.addNote = false;
        this.copyAction = false;
        this.download = false;
        this.edit = false;
        this.view = false;
        this.viewContacts = false;
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class NotesPermissionModel extends BaseModel{
    public delete: boolean;
    public edit: boolean;
    public new: boolean;

    constructor(){
        super();
        this.edit = false;
        this.delete = false;
        this.new = false;
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}

export class OtherPermissionModel extends BaseModel{
    public downloadDoc: boolean;
    public uploadDoc: boolean;

    constructor(){
        super();
        this.downloadDoc = false;
        this.uploadDoc = false;
    }

    validate(excludedFields = []): AlertMessageModel {
        return null;
    }
}