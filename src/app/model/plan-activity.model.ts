/**
 * Created by Fei on 04/05/2017.
 */
export class ModelPlanActivity {

  public name: string;
  public output: string;
  public indicator: string;
  public beneficiary = [];

  constructor(name: string, output: string, indicator: string, beneficiary: {}[]) {
    this.name = name;
    this.output = output;
    this.indicator = indicator;
    this.beneficiary = beneficiary;
  }

}
