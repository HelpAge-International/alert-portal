import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable} from 'rxjs';
import {MessageModel} from "../model/message.model";

@Injectable()
export class NotificationService {

  constructor(private af: AngularFire) {
  }

  getNotificationSettings(agencyId: string): Observable<any> {
    const notificationSettingsSubscription = this.af.database.list(Constants.APP_STATUS + '/agency/' + agencyId + '/notificationSetting')
      .map(items => {
        const notificationSettings: any[] = [];
        items.forEach(item => {
          notificationSettings[item.$key] = false;
        });
        return notificationSettings;
      });

    return notificationSettingsSubscription;
  }

  
  getAgencyNotifications(agencyId, unreadOnly = false): Observable<MessageModel[]>{
    return this.getNotifications("/messageRef/systemadmin/allagencyadminsgroup/" + agencyId, unreadOnly);
 }

 getCountryAdminNotifications(countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   let messagesList: MessageModel[] = [];

  //  let nodes = ["/messageRef/agency/" + agencyId + "/countryadmins/" + countryId,
  //               "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + countryId,
  //               "/messageRef/systemadmin/allcountryadminsgroup/" + countryId,
  //               "/messageRef/systemadmin/allusersgroup/" + countryId];

  // nodes.forEach(node => {
  //   this.getNotifications(node, unreadOnly).subscribe(messages => {
  //     messagesList.concat(messages);
  //   });
  // })
  // let nodesObservable = Observable.from(nodes);

  // let messages = [];
  
  // return nodesObservable.flatMap( node => { return this.getNotifications(node, unreadOnly)})
  //                       .flatMap(messageArray => {
  //                         messageArray.forEach(message => { messages.push(message); })
  //                         //messages = messages.concat(messageArray);
  //                         console.log(messages);
  //                         return messages;
  //                       });
                        
  
  // nodes.forEach(node => observables.push(this.getNotifications(node, unreadOnly)));

  // return Observable.combineLatest(observables).map(messagesArray => {
  //   let messages: MessageModel[] = [];
    
  //   messagesArray.forEach(messageArray => {
  //     messageArray.forEach(message => {
  //       messages.push(message);
  //     });
  //   });

  //   console.log(messages);
  //   return messages;
  // });
  return this.getNotifications("/messageRef/agency/" + agencyId + "/countryadmins/" + countryId, unreadOnly);
 }

setAgencyNotificationsAsRead(agencyId): Observable<any>{
  return this.setNotificationsAsRead("/messageRef/systemadmin/allagencyadminsgroup/" + agencyId);
}

setCountryAdminNotificationsAsRead(countryId, agencyId, unreadOnly = false){
   return this.setNotificationsAsRead("/messageRef/agency/" + agencyId + "/countryadmins/" + countryId);
 }
  deleteNotification(node): firebase.Promise<any>{
    if (!node) {
      Promise.reject('Missing node!');
    }

    return this.af.database.object(node).remove();
  }

  private getNotifications(node: string, unreadOnly): Observable<MessageModel[]>  {
    if(!node) {
      return;
    }
    return this.af.database.list(Constants.APP_STATUS + node)
      .map(list => {
        let messages = [];
        list.forEach((x) => {
          if(!unreadOnly || (unreadOnly && x.$value === true)) {
            this.getNotificationMessage(x.$key).subscribe(message => { messages.push(message); });
          }
        });

        return messages;
      });
  }
  
  private setNotificationsAsRead(node: string): Observable<any>  {
    if(!node) {
      return;
    }

    return this.af.database.list(Constants.APP_STATUS + node)
      .map(list => {
        let messagesData = {};
        list.forEach((x) => {
          if(x.$value === true) {
            let date = new Date().getTime();
            return this.af.database.object(Constants.APP_STATUS + node + '/' + x.$key).update({ date });
          }
        });
      });
  }

  private getNotificationMessage(messageId: string): Observable<MessageModel>{
    return this.af.database.object(Constants.APP_STATUS + "/message/" + messageId)
      .map(item => {
        let message = new MessageModel();
        message.mapFromObject(item);
        message.id = item.$key;
        return message;
      });
  }

}
