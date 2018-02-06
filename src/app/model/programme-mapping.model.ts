/**
 * Created by ser-j on 14/06/2017.
 */

import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ProgrammeMappingModel extends BaseModel {
  public id: string;
  public sector: string;
  public what: number;
  public toWho: string;
  public when: number;
  public toDate: number;
  public where: number;
  public level1: number;
  public level2: string;
  public otherName?: string;

  validate(excludedFields = []): AlertMessageModel {

    if (typeof (this.sector) == 'undefined' && !this.isExcluded('sector', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_SECTOR');
    }

    if (!this.what && !this.isExcluded('what', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_WHAT');
    }

    /*if (!this.where && !this.isExcluded('where', excludedFields)) {
        return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_WHERE');
    }*/

    if (!this.toWho && !this.isExcluded('toWho', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_TO_WHO');
    }

    if (!this.when && !this.isExcluded('when', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_WHEN');
    }

    if (!this.toDate && !this.isExcluded('toDate', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.NO_TO');
    }


    return null;
  }


  setData(programmeMapping) {
    this.id = programmeMapping.id;
    this.sector = programmeMapping.sector;
    this.what = programmeMapping.what;
    this.toWho = programmeMapping.toWho;
    this.when = programmeMapping.when;
    this.toDate = programmeMapping.toDate;
    this.where = programmeMapping.where;
    this.level1 = programmeMapping.level1;
    this.level2 = programmeMapping.level2;
    programmeMapping.otherName ? this.otherName = programmeMapping.otherName : this.otherName = null;
  }

}
