import { AlertMessageModel } from './alert-message.model';

export abstract class BaseModel {
  abstract validate(excludedFields): AlertMessageModel;

  /*
  * Flag to check if a particular field should be excluded from validation
  *
  * @param field          string  The field to check
  * @param excludedFields Array   The list of excluded fields
  *
  * @return boolean [true] if the field should be excluded from validation, [false] otherwise
  */
  protected isExcluded(field: string, excludedFields: any): boolean {
    return excludedFields.length > 0 && excludedFields.includes(field);
  }
}
