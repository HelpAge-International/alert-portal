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
    if ((!this.hasDisability && !this.hasFurtherBeneficiary && (!this.beneficiary[0].value && !this.isExcluded('femaleRange1', excludedFields) ||
      !this.beneficiary[1].value && !this.isExcluded('femaleRange2', excludedFields) ||
      !this.beneficiary[2].value && !this.isExcluded('femaleRange3', excludedFields) ||
      !this.beneficiary[3].value && !this.isExcluded('maleRange1', excludedFields) ||
      !this.beneficiary[4].value && !this.isExcluded('maleRange2', excludedFields) ||
      !this.beneficiary[5].value && !this.isExcluded('maleRange3', excludedFields))) ||
      (this.hasDisability && !this.hasFurtherBeneficiary && (!this.furtherBeneficiary[0].value && !this.isExcluded('femaleFB1', excludedFields) ||
        !this.furtherBeneficiary[1].value && !this.isExcluded('femaleFB2', excludedFields) ||
        !this.furtherBeneficiary[2].value && !this.isExcluded('femaleFB3', excludedFields) ||
        !this.furtherBeneficiary[3].value && !this.isExcluded('femaleFB4', excludedFields) ||
        !this.furtherBeneficiary[4].value && !this.isExcluded('femaleFB5', excludedFields) ||
        !this.furtherBeneficiary[5].value && !this.isExcluded('femaleFB6', excludedFields) ||
        !this.furtherBeneficiary[6].value && !this.isExcluded('femaleFB7', excludedFields) ||
        !this.furtherBeneficiary[7].value && !this.isExcluded('femaleFB8', excludedFields) ||
        !this.furtherBeneficiary[8].value && !this.isExcluded('maleFB1', excludedFields) ||
        !this.furtherBeneficiary[9].value && !this.isExcluded('maleFB2', excludedFields) ||
        !this.furtherBeneficiary[10].value && !this.isExcluded('maleFB3', excludedFields) ||
        !this.furtherBeneficiary[11].value && !this.isExcluded('maleFB4', excludedFields) ||
        !this.furtherBeneficiary[12].value && !this.isExcluded('maleFB5', excludedFields) ||
        !this.furtherBeneficiary[13].value && !this.isExcluded('maleFB6', excludedFields) ||
        !this.furtherBeneficiary[14].value && !this.isExcluded('maleFB7', excludedFields) ||
        !this.furtherBeneficiary[15].value && !this.isExcluded('maleFB8', excludedFields))) ||
      (this.hasFurtherBeneficiary && this.hasDisability && (!this.disability[0].value && !this.isExcluded('femaleDB1', excludedFields) ||
        !this.disability[1].value && !this.isExcluded('femaleDB2', excludedFields) ||
        !this.disability[2].value && !this.isExcluded('femaleDB3', excludedFields) ||
        !this.disability[3].value && !this.isExcluded('maleDB1', excludedFields) ||
        !this.disability[4].value && !this.isExcluded('maleDB2', excludedFields) ||
        !this.disability[5].value && !this.isExcluded('maleDB3', excludedFields))) ||
      (this.hasDisability && this.hasFurtherBeneficiary && (!this.furtherDisability[0].value && !this.isExcluded('femaleFD1', excludedFields) ||
        !this.furtherDisability[1].value && !this.isExcluded('femaleFD2', excludedFields) ||
        !this.furtherDisability[2].value && !this.isExcluded('femaleFD3', excludedFields) ||
        !this.furtherDisability[3].value && !this.isExcluded('femaleFD4', excludedFields) ||
        !this.furtherDisability[4].value && !this.isExcluded('femaleFD5', excludedFields) ||
        !this.furtherDisability[5].value && !this.isExcluded('femaleFD6', excludedFields) ||
        !this.furtherDisability[6].value && !this.isExcluded('femaleFD7', excludedFields) ||
        !this.furtherDisability[7].value && !this.isExcluded('femaleFD8', excludedFields) ||
        !this.furtherDisability[8].value && !this.isExcluded('femaleFD1', excludedFields) ||
        !this.furtherDisability[9].value && !this.isExcluded('femaleFD2', excludedFields) ||
        !this.furtherDisability[10].value && !this.isExcluded('femaleFD3', excludedFields) ||
        !this.furtherDisability[11].value && !this.isExcluded('femaleFD4', excludedFields) ||
        !this.furtherDisability[12].value && !this.isExcluded('femaleFD5', excludedFields) ||
        !this.furtherDisability[13].value && !this.isExcluded('femaleFD6', excludedFields) ||
        !this.furtherDisability[14].value && !this.isExcluded('femaleFD7', excludedFields) ||
        !this.furtherDisability[15].value && !this.isExcluded('femaleFD8', excludedFields)))) {
      return new AlertMessageModel('RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITIES.BENEFICIARIES');
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
