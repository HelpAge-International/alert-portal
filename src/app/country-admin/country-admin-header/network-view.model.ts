import {UserType} from "../../utils/Enums";

export class NetworkViewModel {
  systemId:string;
  agencyId:string;
  countryId:string;
  updateActionID:string;
  userType:UserType;
  uid:string;
  networkId:string;
  networkCountryId:string;
  isViewing:boolean;

  constructor(systemId, agencyId, countryId, updateActionID, userType, uid, networkId, networkCountryId, isViewing) {
    this.systemId = systemId
    this.agencyId = agencyId
    this.countryId = countryId
    this.updateActionID = updateActionID
    this.userType = userType
    this.uid = uid
    this.networkId = networkId
    this.networkCountryId = networkCountryId
    this.isViewing = isViewing
  }

  mapFromObject(obj) {
    this.systemId = obj.systemId
    this.agencyId = obj.agencyId
    this.countryId = obj.countryId
    this.updateActionID = obj.updateActionID
    this.userType = obj.userType
    this.uid = obj.uid
    this.networkId = obj.networkId
    this.networkCountryId = obj.networkCountryId
    this.isViewing = obj.isViewing
  }
}
