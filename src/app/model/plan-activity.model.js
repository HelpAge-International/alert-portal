"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Fei on 04/05/2017.
 */
var ModelPlanActivity = (function () {
    function ModelPlanActivity(name, output, indicator, beneficiary) {
        this.beneficiary = [];
        this.name = name;
        this.output = output;
        this.indicator = indicator;
        this.beneficiary = beneficiary;
    }
    return ModelPlanActivity;
}());
exports.ModelPlanActivity = ModelPlanActivity;
