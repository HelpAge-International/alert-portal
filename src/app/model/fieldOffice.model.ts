import { GeoLocation } from "../utils/Enums";

export class fieldOffice {
  public id: string;
  public name: string;
  public locationLevel1: number;
  public locationLevel2: number;

  constructor(){


  }
  valid(){
    if(!this.name){
      return 'Please enter a name.'
    } else if(this.locationLevel1 == null){
      return 'Please enter a location'
    } else{
      return true;
    }

  }

}
