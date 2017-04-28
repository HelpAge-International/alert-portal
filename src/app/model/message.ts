/**
 * Created by Sanjaya on 10/03/2017.
 */

export class Message {
  public id: string;
  public senderId: string;
  public title: string;
  public content: string;
  public time: number;
  public groupType: string;

  constructor(senderId: string, title: string, content: string, time: number) {
    this.senderId = senderId;
    this.title = title;
    this.content = content;
    this.time = time;
  }
}
