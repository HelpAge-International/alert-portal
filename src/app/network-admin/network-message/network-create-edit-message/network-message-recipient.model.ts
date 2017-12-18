import {BaseModel} from "../../../model/base.model";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {NetworkMessageRecipientType} from "../../../utils/Enums";

export class NetworkMessageRecipientModel extends BaseModel {

  public allUsers: boolean;
  public networkCountryAdmins: boolean;
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
      !this.networkCountryAdmins && !this.isExcluded('networkCountryAdmins', excludedFields) &&
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

  getRecipientTypes(): NetworkMessageRecipientType [] {
    let recipients: NetworkMessageRecipientType[] = [];

    if (this.allUsers){
      recipients.push(NetworkMessageRecipientType.AllUsers);
    }else{
      if (this.networkCountryAdmins){
        recipients.push(NetworkMessageRecipientType.NetworkCountryAdmins);
      }
      if (this.globalDirectors){
        recipients.push(NetworkMessageRecipientType.GlobalDirectors);
      }
      if (this.globalUsers){
        recipients.push(NetworkMessageRecipientType.GlobalUsers);
      }
      if (this.regionalDirectors){
        recipients.push(NetworkMessageRecipientType.RegionalDirectors);
      }
      if (this.countryAdmins){
        recipients.push(NetworkMessageRecipientType.CountryAdmins);
      }
      if (this.countryDirectors){
        recipients.push(NetworkMessageRecipientType.CountryDirectors);
      }
      if (this.ertLeaders){
        recipients.push(NetworkMessageRecipientType.ERTLeaders);
      }
      if (this.erts){
        recipients.push(NetworkMessageRecipientType.ERTs);
      }
      if (this.donors){
        recipients.push(NetworkMessageRecipientType.Donors);
      }
      if (this.partners){
        recipients.push(NetworkMessageRecipientType.Partners);
      }
    }
    return recipients;
  }
}
