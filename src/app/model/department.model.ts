export class ModelDepartment {
  public id: string;
  public name: string;

  public static create(id: string, name: string): ModelDepartment {
    let x: ModelDepartment = new ModelDepartment();
    x.id = id;
    x.name = name;
    return x;
  }
}
