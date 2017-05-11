/**
 * Created by Sanjaya on 27/04/2017.
 */

import {
  HazardScenario, ResponsePlanSectors, PresenceInTheCountry, MethodOfImplementation,
  ApprovalStatus
} from "../utils/Enums";

export class ResponsePlan {

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
  public partnerOrganisations: string[];

  // Section 4/10
  public activitySummary = {};

  // Section 5/10
  public peoplePerHousehold: number;
  public numOfHouseholds: number;
  public beneficiariesNote: string;
  public vulnerableGroups: string[];
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
  public startDate:number;
}
