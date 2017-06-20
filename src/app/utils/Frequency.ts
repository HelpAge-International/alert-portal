/**
* Created by Kresimir Plese on 22/04/2017.
*/

import {DurationType} from "./Enums";

/**
 * Frequency
 */
export class Frequency{
	public value: number = 0;
	public type: DurationType = DurationType.Week;

	constructor(obj: Object){
		this.value = obj['value'];
		this.type = obj['durationType'];
	}

	/**
	 * Return true if this frequency is equal to compared one
 	 * @param  {Frequency}
	 * @return {boolean}
	 */
	public et(frequency: Frequency) : boolean {
		return this.value == frequency.value && this.type == frequency.type;
	}

	/**
	 * Return true if this frequency is greater than compared one
	 * @param  {Frequency}
	 * @return {boolean}
	 */
	public gt(frequency: Frequency) : boolean {

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
				return true

		return false;
	}

	/**
	 * Return true if this frequency is smaller than compared one
	 * @param  {Frequency}
	 * @return {boolean}
	 */
	public st(frequency: Frequency) : boolean {
		return !this.gt(frequency) && !this.et(frequency);
	}

}
