/**
 * Created by Fei on 07/03/2017.
 */
export class ModelUserPublic {
  firstName:string;
  lastName:string;
  phone:string;
  title:number;
  email:string;

  constructor(firstName: string, lastName: string, phone: string, title: number, email:string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.title = title;
    this.email = email;
  }

}
