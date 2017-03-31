/**
 * Created by Sanjaya on 20/03/2017.
 */
import {ActionType, ActionLevel} from '../utils/Enums';

export class MandatedPreparednessAction {
  public task: string;
  public type: ActionType;
  public department: string;
  public level: ActionLevel;
  public createdAt: number

  // constructor(task: string, type: ActionType, department: string, level : ActionLevel) {
  //   this.task = task;
  //   this.type = type;
  //   this.department = department;
  //   this.level = level;
  // }
}
