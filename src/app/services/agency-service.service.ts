import {Injectable} from '@angular/core';
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {RxHelper} from "../utils/RxHelper";

@Injectable()
export class AgencyServiceService {
  private agencyId: string;

  constructor(private af: AngularFire, private subscriptions: RxHelper) {
  }

  getAgencyId(agencyAdminId) {
    let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/agencyId")
      .map(id => {
        if (id.$value) {
          return id.$value;
        }
      })
    return subscription;
  }


}
