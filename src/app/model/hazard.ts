/**
 * Created by ser-j on 15/05/2017.
 */
import {HazardCategory} from '../utils/Enums';

// TODO need change structure this object
export class Hazard {
    public id: string;
    public category: HazardCategory;
    public isSeasonal: boolean;
    public risk: number;
    public isActive: boolean;
    public seasons: any = [];
}
