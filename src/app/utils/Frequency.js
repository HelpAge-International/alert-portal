"use strict";
/**
* Created by Kresimir Plese on 22/04/2017.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = require("./Enums");
/**
 * Frequency
 */
var Frequency = (function () {
    function Frequency(obj) {
        this.value = 0;
        this.type = Enums_1.DurationType.Week;
        this.value = obj['value'];
        this.type = obj['durationType'];
    }
    /**
     * Return true if this frequency is equal to compared one
     * @param  {Frequency}
     * @return {boolean}
     */
    Frequency.prototype.et = function (frequency) {
        return this.value == frequency.value && this.type == frequency.type;
    };
    /**
     * Return true if this frequency is greater than compared one
     * @param  {Frequency}
     * @return {boolean}
     */
    Frequency.prototype.gt = function (frequency) {
        // If the frequencies are equal, then this frequency is not greater than compared one
        if (this.et(frequency))
            return false;
        //E.g. If this frequency type is years and compared frequency type is weeks, this frequency is smaller
        if (this.type > frequency.type)
            return false;
        //E.g. If this frequency type is weeks and compared frequency type is years, this frequency is greater
        if (this.type < frequency.type)
            return true;
        // Type's are equal, we must check the value
        if (this.type == frequency.type)
            if (this.value < frequency.value)
                return true;
        return false;
    };
    /**
     * Return true if this frequency is smaller than compared one
     * @param  {Frequency}
     * @return {boolean}
     */
    Frequency.prototype.st = function (frequency) {
        return !this.gt(frequency) && !this.et(frequency);
    };
    return Frequency;
}());
exports.Frequency = Frequency;
