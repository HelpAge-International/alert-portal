import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/database";
import {TranslateService} from "@ngx-translate/core";
import {SettingsService} from "./settings.service";
import {SurgeCapacityService} from "./surge-capacity.service";
import {UserService} from "./user.service";
import {CommonService} from "./common.service";
import {AgencyService} from "./agency-service.service";
import {PartnerOrganisationService} from "./partner-organisation.service";
import {Constants} from "../utils/Constants";
import {Countries, CountriesMapsSearchInterface, Department, PersonTitle} from "../utils/Enums";
import {Angular2Csv} from "angular2-csv";
import {first} from "rxjs/operators";
import {ModelUserPublic} from "../model/user-public.model";
import {ModelStaff} from "../model/staff.model";


@Injectable()
export class ExportPersonalService {

  constructor(private afd: AngularFireDatabase,
              private translateService: TranslateService,
              private userService: UserService,
              private partnerService: PartnerOrganisationService,
              private surgeCapacityService: SurgeCapacityService,
              private agencyService: AgencyService,
              private settingService: SettingsService,
              private commonService: CommonService,
              private translate: TranslateService) {
  }

  public exportPersonalData(userId: string, countryId: string) {
    let personalData: any = {};
    this.afd.object(Constants.APP_STATUS + "/userPublic/" + userId)
      .valueChanges()
      .pipe(first())
      .subscribe((snap: ModelUserPublic) => {
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
        if (snap.country == undefined) {
          personalData.Country = ""
        }
        else {
          personalData.Country = CountriesMapsSearchInterface.getEnglishLocationFromEnumValue(snap.country)
        }
        personalData.Postcode = snap.postCode == null || snap.postCode == undefined ? '' : snap.postCode;

        // TOS
        personalData.Agreed_to_Terms_And_Conditions = (snap as any).latestToCAgreed;
        personalData.Agreed_to_Code_Of_Conduct = (snap as any).latestCoCAgreed;

        // Staff information
        if (countryId == null) {
          this.exportCSV([personalData], "Personal Information");
        }
        else {
          this.afd.object(Constants.APP_STATUS + "/staff/" + countryId + "/" + userId)
            .valueChanges()
            .pipe(first())
            .subscribe((staffSnap: ModelStaff) => {
              personalData.Position = staffSnap.position == null || staffSnap.position == undefined ? '' : staffSnap.position;
              personalData.Department = Department[staffSnap.department];
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
