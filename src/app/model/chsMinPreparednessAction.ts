/**
 * Created by Sanjaya on 09/03/2017.
 */
import {ActionType} from '../utils/Enums';

export class ChsMinPreparednessAction {
  public task: string;
  public type: ActionType;

  constructor(task: string, type: ActionType) {
    this.task = task;
    this.type = type;
  }
}
