import { AlertMessageModel } from './alert-message.model';

export abstract class BaseModel {
  abstract validate(excludedFields): AlertMessageModel;

  /*
  * Maps an object to an instance of the model - used to map firebase returned objects to models 
  *
  * @param obj  Object  The object to be mapped
  */
  public mapFromObject(obj: Object) {
        for (var propName in obj) {
            // do not map Firebase keys ( starting with $ )
            if(!(propName.charAt(0) === '$'))
            {
                this[propName] = obj[propName];
            }
        }
    }

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
