/**
 * Created by Sanjaya on 27/04/2017.
 */

import {
  HazardScenario, ResponsePlanSectors, PresenceInTheCountry, MethodOfImplementation,
  ApprovalStatus
} from "../utils/Enums";
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ResponsePlan extends BaseModel {

  //Section 0 for network only
  public participatingAgencies: any;

  // Section 1/10
  public name: string;
  public location: string;
  public planLead: string;
  public hazardScenario: HazardScenario;

  // Section 2/10
  public scenarioCrisisList: string[];
  public impactOfCrisisList: string[];
  public availabilityOfFundsList: string[];

  // Section 3/10
  public sectorsRelatedTo: ResponsePlanSectors[];
  public otherRelatedSector: string;
  public presenceInTheCountry: PresenceInTheCountry;
  public methodOfImplementation: MethodOfImplementation;
  public partnerOrganisations: string[] = [];

  // Section 4/10
  public activitySummary = {};

  // Section 5/10
  public peoplePerHousehold: number;
  public numOfHouseholds: number = 0;
  public beneficiariesNote: string;
  public vulnerableGroups = [];
  public otherVulnerableGroup: string;
  public targetPopulationInvolvementList: string[];

  // Section 6/10
  public riskManagementPlan: string;

  // Section 7/10
  public sectors = {};

  // Section 8/10
  public monAccLearning = {};

  // Section 9/10
  public doubleCounting = {};

  // Section 10/10
  public budget = {};

  // Other
  public sectionsCompleted: number;
  public totalSections: number;
  public isActive: boolean;
  public status: ApprovalStatus;
  public startDate: number;
  public timeCreated: number;
  public id: string;
  public createdBy: string;
  public timeUpdated: number;
  public updatedBy: string;
  public isEditing: boolean;
  public editingUserId: string;

  //network
  public createdByAgencyId: string;
  public createdByCountryId: string;

  //Approval
  public approval = {};

  validate(excludedFields: any): AlertMessageModel {
    throw new Error("Method not implemented.");
  }
}

