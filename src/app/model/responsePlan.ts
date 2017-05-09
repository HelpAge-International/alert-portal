import {
  HazardScenario, ResponsePlanSectors, PresenceInTheCountry, MethodOfImplementation,
  MediaFormat
} from "../utils/Enums";
import {ModelPlanActivity} from "./plan-activity.model";
import {ModelBudgetItem} from "./budget-item.model";
/**
 * Created by Sanjaya on 27/04/2017.
 */

export class ResponsePlan {

  // Section 1/10
  public planName: string;
  public geographicalLocation: string;
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
  public partners: string[]; // TODO - Update to list of Partner Organisations

  // Section 4/10
  public proposedResponse: string;
  public progressOfActivitiesPlan: string;
  public coordinationPlan: string;

  // Section 5/10
  public numOfBeneficiaries: number;
  public vulnerableGroups: string[];
  public targetPopulationInvolvementList: string[];

  // Section 6/10
  public riskManagementPlan: string;

  // Section 7/10
  // TODO - Add Section 7 attributes
  public activities: ModelPlanActivity[];

  // Section 8/10
  public mALSystemsDescription: string;
  public isMedia: boolean;
  public mediaFormat: MediaFormat;

  // Section 9/10
  // TODO - Add Section 9 attributes
  public doubleCounting: any[];

  // Section 10/10
  // TODO - Add Section 10 attributes
  public isOver1000: boolean;
  public item: any[];
  public itemOver1000: ModelBudgetItem[];

  // Other
  public sectionsCompleted: number;
  public totalSections: number;
  public isActive: boolean;
}
