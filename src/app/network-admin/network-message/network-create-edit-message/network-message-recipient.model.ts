import {BaseModel} from "../../../model/base.model";
import {AlertMessageModel} from "../../../model/alert-message.model";

export class NetworkMessageRecipientModel extends BaseModel {

  public allUsers: boolean;
  public globalDirectors: boolean;
  public globalUsers: boolean;
  public regionalDirectors: boolean;
  public countryAdmins: boolean;
  public countryDirectors: boolean;
  public ertLeaders: boolean;
  public erts: boolean;
  public donors: boolean;
  public partners: boolean;

  validate(excludedFields): AlertMessageModel {
    if (!this.allUsers && !this.isExcluded('allUsers', excludedFields) &&
      !this.globalDirectors && !this.isExcluded('globalDirectors', excludedFields) &&
      !this.globalUsers && !this.isExcluded('globalUsers', excludedFields) &&
      !this.regionalDirectors && !this.isExcluded('regionalDirectors', excludedFields) &&
      !this.countryAdmins && !this.isExcluded('countryAdmins', excludedFields) &&
      !this.countryDirectors && !this.isExcluded('countryDirectors', excludedFields) &&
      !this.ertLeaders && !this.isExcluded('ertLeaders', excludedFields) &&
      !this.erts && !this.isExcluded('erts', excludedFields) &&
      !this.donors && !this.isExcluded('donors', excludedFields) &&
      !this.partners && !this.isExcluded('partners', excludedFields)) {
      return new AlertMessageModel('MESSAGES.NO_RECIPIENTS_ERROR');
    }
    return null;
  }

}
