/**
 * Created by Sanjaya on 09/03/2017.
 */
import {ActionType} from '../utils/Enums';

// TODO - Modify data types when the enums are created
export class Action {
  public id: string;
  public budjet: number;
  public department: number;
  public documentId: string;
  public dueDate: number;
  public frequencyBase: number;
  public frequencyValue: number;
  public isActive: Boolean;
  public isComplete: Boolean;
  public level: number;
  public progressState: number;
  public requireDoc: Boolean;
  public task: string;
  public type: ActionType;
  public assignHazard: any = [];
  public asignee: string;
}
