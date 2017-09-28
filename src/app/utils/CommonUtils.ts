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

  static updateObjectByMap(object,map) {
    if (!object) {
      throw new Error("Object can not be empty!");
    }
    Object.keys(object).forEach(key =>{
      object[key] = map.get(key);
    });
    return object;
  }

}
