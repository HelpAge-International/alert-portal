/**
 * Created by ser-j on 15/05/2017.
 */
import {HazardCategory, GeoLocation} from '../utils/Enums';

export class Indicator {
    public id: string;
    public category: HazardCategory;
    public name: string;
    public source: any = [];
    public assignee: string;
    public geoLocation: GeoLocation;
    public affectedLocation: any = [];
    public trigger: any = [];
}
