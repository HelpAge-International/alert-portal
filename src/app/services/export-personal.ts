import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {TranslateService} from "@ngx-translate/core";
import {SettingsService} from "./settings.service";
import {SurgeCapacityService} from "./surge-capacity.service";
import {UserService} from "./user.service";
import {CommonService} from "./common.service";
import {AgencyService} from "./agency-service.service";
import {PartnerOrganisationService} from "./partner-organisation.service";
import {Constants} from "../utils/Constants";
import {Countries, Department, PersonTitle} from "../utils/Enums";
import {Angular2Csv} from "angular2-csv";


@Injectable()
export class ExportPersonalService {

  constructor(private af: AngularFire,
              private translateService: TranslateService,
              private userService: UserService,
              private partnerService: PartnerOrganisationService,
              private surgeCapacityService: SurgeCapacityService,
              private agencyService: AgencyService,
              private settingService: SettingsService,
              private commonService: CommonService) {
  }

  public exportPersonalData(userId: string, countryId: string) {
    let personalData: any = {};
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userId)
      .first()
      .subscribe((snap) => {
        // Names
        personalData.Title = PersonTitle[snap.title];
        personalData.First_Name = snap.firstName == null || snap.firstName == undefined ? '' : snap.firstName;
        personalData.Last_Name = snap.lastName == null || snap.lastName == undefined ? '' : snap.lastName;

        personalData.Phone = snap.phone == null || snap.phone == undefined ? '' : snap.phone;
        personalData.Email_Address = snap.email == null || snap.email == undefined ? '' : snap.email;
        personalData.Language = snap.language == null || snap.language == undefined ? '' : snap.language;

        // Address
        personalData.Address_Line_1 = snap.addressLine1 == null || snap.addressLine1 == undefined ? '' : snap.addressLine1;
        personalData.Address_Line_2 = snap.addressLine2 == null || snap.addressLine2 == undefined ? '' : snap.addressLine2;
        personalData.City = snap.city == null || snap.city == undefined ? '' : snap.city;
        personalData.Country = Countries[snap.country];
        personalData.Postcode = snap.postCode == null || snap.postCode == undefined ? '' : snap.postCode;

        // TOS
        personalData.Agreed_to_Terms_And_Conditions = snap.latestToCAgreed;
        personalData.Agreed_to_Code_Of_Conduct = snap.latestCoCAgreed;

        // Staff information
        if (countryId == null) {
          this.exportCSV([personalData], "Personal Information");
        }
        else {
          this.af.database.object(Constants.APP_STATUS + "/staff/" + countryId + "/" + userId)
            .first()
            .subscribe(staffSnap => {
              console.log("Looking at " + Constants.APP_STATUS + "/staff/" + countryId + "/" + userId);
              console.log(staffSnap);
              personalData.Position = staffSnap.position == null || staffSnap.position == undefined ? '' : staffSnap.position;
              personalData.Department = Department[staffSnap.department];
              console.log("Prepping data export");
              console.log(personalData);
              this.exportCSV([personalData], "Personal Information");
            });
        }
      });
  }

  public exportCSV(dataToSave: any, fileName: string) {
    let options: any = {
      headers: Object.keys(dataToSave[0])
    };
    new Angular2Csv(dataToSave, fileName, options);
  }
}
