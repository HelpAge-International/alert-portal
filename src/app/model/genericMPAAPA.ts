/**
 * Created by Sanjaya on 23/03/2017.
 */
import {ActionType, ActionLevel, GenericActionCategory} from '../utils/Enums';

export class GenericMpaOrApaAction {
  public task: string;
  public type: ActionType;
  public level: ActionLevel;
  public isActive: boolean;
  public category: GenericActionCategory;
  public createdAt: number;

  // constructor(task: string, type: ActionType, level: ActionLevel, category: GenericActionCategory) {
  //   this.task = task;
  //   this.type = type;
  //   this.level = level;
  //   this.category = category;
  // }
}
