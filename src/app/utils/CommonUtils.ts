import {MessageModel} from "../model/message.model";

export class CommonUtils {

  static convertObjectToList(object): Array<any> {
    if (!object) {
      throw new Error("Object can not be empty!");
    }
    let keys = Object.keys(object);
    let tempList = [];
    for (let key of keys) {
      tempList.push(object[key]);
    }
    return tempList;
  }

  static convertMapToObjectOnlyWithTrueValue(map: Map<string, boolean>) {
    let obj = {};
    map.forEach((v, k) => {
      if (v) {
        obj[k] = v;
      }
    });
    return obj;
  }

  static convertMapToKeysInArray(map) {
    let keys = [];
    map.forEach((v, k) => keys.push(k));
    return keys;
  }

  static convertMapToValuesInArray(map) {
    let values = [];
    map.forEach((v, k) => values.push(v));
    return values;
  }

  static reverseMap(map) {
    let reverseMap = new Map();
    map.forEach((v, k) => reverseMap.set(v, k));
    return reverseMap;
  }

  static updateObjectByMap(object, map) {
    if (!object) {
      throw new Error("Object can not be empty!");
    }
    Object.keys(object).forEach(key => {
      object[key] = map.get(key);
    });
    return object;
  }

  static trueValueExistInMap(map): boolean {
    let objOnlyTrueValue = CommonUtils.convertMapToObjectOnlyWithTrueValue(map);
    return Object.keys(objOnlyTrueValue).length > 0;
  }

  static trueValueFromMapAsKeys(map) {
    let objOnlyTrueValue = CommonUtils.convertMapToObjectOnlyWithTrueValue(map);
    return Object.keys(objOnlyTrueValue);
  }

  static messageExistInList(messageId: string, messageList: MessageModel[]) {
    return messageList.map(msg => msg.id).indexOf(messageId) != -1;
  }

}
