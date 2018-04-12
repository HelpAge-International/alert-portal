import {UserType} from "../../utils/Enums";
import {el} from "@angular/platform-browser/testing/src/browser_util";

export class LocalNetworkViewModel {
  systemId:string;
  agencyId:string;
  countryId:string;
  userType:UserType;
  uid:string;
  networkId:string;
  isViewing:boolean;

  constructor(systemId, agencyId, countryId, userType, uid, networkId, isViewing) {
    this.systemId = systemId
    this.agencyId = agencyId
    this.countryId = countryId
    this.userType = userType
    this.uid = uid
    this.networkId = networkId
    this.isViewing = isViewing
  }

  mapFromObject(obj) {
    this.systemId = obj.systemId
    this.agencyId = obj.agencyId
    if (obj.countryId) {
      this.countryId = obj.countryId
    }
    this.userType = obj.userType
    this.uid = obj.uid
    this.networkId = obj.networkId
    this.isViewing = obj.isViewing
  }
}
