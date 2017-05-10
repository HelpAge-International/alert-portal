import {
  HazardScenario, ResponsePlanSectors, PresenceInTheCountry, MethodOfImplementation,
  MediaFormat, ApprovalStatus
} from "../utils/Enums";
import {ModelPlanActivity} from "./plan-activity.model";
import {ModelBudgetItem} from "./budget-item.model";
/**
 * Created by Sanjaya on 27/04/2017.
 */

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
  // public proposedResponse: string;
  // public progressOfActivitiesPlan: string;
  // public coordinationPlan: string;
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
  // TODO - Add Section 7 attributes
  public sectors = {};

  // Section 8/10
  public mALSystemsDescription: string;
  public isMedia: boolean;
  public mediaFormat: number;

  // Section 9/10
  // TODO - Add Section 9 attributes
  public doubleCounting = {};

  // Section 10/10
  // TODO - Add Section 10 attributes
  public budget = {};
  // public isOver1000: boolean;
  // public item: any[];
  // public itemOver1000: ModelBudgetItem[];

  // Other
  public sectionsCompleted: number;
  public totalSections: number;
  public isActive: boolean;
  public status: ApprovalStatus;
}
