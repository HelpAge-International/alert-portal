import {AlertLevels, AlertStatus, Countries} from "../utils/Enums";
import {ModelAffectedArea} from "./affectedArea.model";
/**
 * Created by Fei on 22/05/2017.
 */

export class ModelAlert {
  public id:string;
  public alertLevel: AlertLevels;
  public affectedAreas:ModelAffectedArea[];
  public affectedAreasDisplay:string[];
  public approvalDirectorId: string;
  public approvalStatus: AlertStatus;
  public createdBy: string;
  public createdByName: string;
  public estimatedPopulation: number;
  public hazardScenario: number;
  public infoNotes: string;
  public reasonForRedAlert: string;
  public timeCreated: number;
  public timeUpdated:number;
}



