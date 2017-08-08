/**
 * Created by Fei on 04/05/2017.
 */
import { Gender } from "../utils/Enums";
import { BaseModel } from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ModelPlanActivity extends BaseModel {

  public name: string;
  public output: string;
  public indicator: string;
  public beneficiary = [];

  constructor(name: string, output: string, indicator: string, beneficiary: {}[]) {
    super();
    this.name = name;
    this.output = output;
    this.indicator = indicator;
    if(!beneficiary){
      for (let i = 0; i < 6; i++) {
        let beneData = new ActivityBeneficiaryModel();
        if (i < 3) {
          beneData.age = i;
          beneData.gender = Gender.feMale;
        } else {
          beneData.age = i - 3;
          beneData.gender = Gender.male;
        }
        beneData.value = 0;
        this.beneficiary.push(beneData);
      }
    }else{
      this.beneficiary = beneficiary;
    }
  }

  validate(excludedFields = []): AlertMessageModel {
        if (!this.name && !this.isExcluded('name', excludedFields)) {
            return new AlertMessageModel('RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITIES.NO_NAME');
        }
        if (!this.output && !this.isExcluded('output', excludedFields)) {
            return new AlertMessageModel('RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITIES.NO_OUTPUT');
        }
        if (!this.indicator && !this.isExcluded('indicator', excludedFields)) {
            return new AlertMessageModel('RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITIES.NO_INDICATOR');
        }
        return null;
    }

  isEmpty(): boolean{
    return !this.name && !this.output && !this.indicator;
  }

}

export class ActivityBeneficiaryModel{
  public age;
  public gender;
  public value;

  constructor() {} 
}
