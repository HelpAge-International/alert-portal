/**
 * Created by Sanjaya on 20/03/2017.
 */
import {ActionType, ActionLevel} from '../utils/Enums';

export class MandatedPreparednessAction {

  public task: string;
  public type: ActionType;
  public department: string;
  public level: ActionLevel;
  public createdAt: number;
  public isActive: boolean;
}
