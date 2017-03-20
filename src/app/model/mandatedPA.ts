/**
 * Created by Sanjaya on 20/03/2017.
 */
import {ActionType, Department, ActionLevel} from '../utils/Enums';

export class MandatedPreparednessAction {
  public task: string;
  public type: ActionType;
  public department: Department;
  public level: ActionLevel;

  constructor(task: string, type: ActionType, department: Department, level : ActionLevel) {
    this.task = task;
    this.type = type;
    this.department = department;
    this.level = level;
  }
}
