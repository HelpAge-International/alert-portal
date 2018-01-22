/**
 * Created by Fei on 04/05/2017.
 */
import {Gender} from "../utils/Enums";
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ModelPlanActivity extends BaseModel {

  public name: string;
  public output: string;
  public indicator: string;
  public beneficiary = [];
  public hasFurtherBeneficiary: boolean
  public hasDisability: boolean
  public furtherBeneficiary = []
  public disability = []
  public furtherDisability = []

  constructor(name: string, output: string, indicator: string,
              beneficiary: {}[], hasFurtherBeneficiary: boolean = false, hasDisability: boolean = false,
              furtherBeneficiary?: {}[], disability?: number[], furtherDisability?: number[]) {
    super();
    this.name = name;
    this.output = output;
    this.indicator = indicator;
    this.hasFurtherBeneficiary = hasFurtherBeneficiary
    this.hasDisability = hasDisability
    if (!beneficiary) {
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
    } else {
      this.beneficiary = beneficiary;
    }

    if (!furtherBeneficiary) {
      for (let i = 0; i < 16; i++) {
        let beneData = new ActivityBeneficiaryModel();
        if (i < 8) {
          beneData.age = i;
          beneData.gender = Gender.feMale;
        } else {
          beneData.age = i - 8;
          beneData.gender = Gender.male;
        }
        beneData.value = 0;
        this.furtherBeneficiary.push(beneData);
      }
    } else {
      this.furtherBeneficiary = furtherBeneficiary;
    }

    if (!disability) {
      this.disability = [0, 0, 0, 0, 0, 0];
    } else {
      for (let i = 0; i < 6; i++) {
        this.disability.push(disability[i]);
      }
    }

    if (!furtherDisability) {
      this.furtherDisability = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    } else {
      for (let i = 0; i < 16; i++) {
        this.furtherDisability.push(furtherDisability[i]);
      }
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

    let error = 'Number of disability cannot exceed beneficiary!'
    if (this.hasDisability && this.hasFurtherBeneficiary) {
      for (let x in this.furtherBeneficiary) {
        if (this.furtherDisability[x] > this.furtherBeneficiary.map(x => x.value)[x]) {
          return new AlertMessageModel(error)
        }
      }
    } else if (this.hasDisability && !this.hasFurtherBeneficiary) {
      for (let x in this.beneficiary) {
        if (this.disability[x] > this.beneficiary.map(x => x.value)[x]) {
          return new AlertMessageModel(error)
        }
      }
    }

    return null;
  }

  isEmpty(): boolean {
    return !this.name && !this.output && !this.indicator;
  }

}

export class ActivityBeneficiaryModel {
  public age;
  public gender;
  public value;

  constructor() {
  }
}
