import {ActionLevel, ActionType} from "../../../utils/Enums";
import {BaseModel} from "../../../model/base.model";
import {AlertMessageModel} from "../../../model/alert-message.model";

export class NetworkMpaModel extends BaseModel {

  public task: string;
  public type: ActionType;
  public level: ActionLevel;
  public createdAt: number;
  public isActive: boolean;

  validate(excludedFields: any): AlertMessageModel {
    if (!this.task && !this.isExcluded('task', excludedFields)) {
      return new AlertMessageModel('What needs to be done must be filled!');
    }
    if (!this.level && !this.isExcluded('level', excludedFields)) {
      return new AlertMessageModel('Level need to be selected!');
    }
    return null;
  }
}
