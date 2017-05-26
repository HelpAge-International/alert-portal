import {Injectable} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {ModelFaceToFce} from "../dashboard/facetoface-meeting-request/facetoface.model";

@Injectable()
export class AgencyService {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyId: string;

  constructor(private af: AngularFire) {
  }

  getAgencyId(agencyAdminId) {
    let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/agencyId")
      .map(id => {
        if (id.$value) {
          return id.$value;
        }
      });
    return subscription;
  }

  getAllAgencySameCountry(countryId, agencyId){
    this.af.database.object(Constants.APP_STATUS+"/countryOffice/"+agencyId+"/"+countryId)
      .map(country => {
        let displayList:ModelFaceToFce[] = [];
        this.af.database.list(Constants.APP_STATUS+"/countryOffice/")
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencies => {
            // console.log(agencies);
            agencies.forEach(agency =>{
              let countries = Object.keys(agency).map(key => agency[key]);
              console.log(countries);
              countries.forEach(country =>{

              });
            });
          });
        return country;
      })
      .subscribe(x=>{console.log(x)})
  }

  unSubscribeNow() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
