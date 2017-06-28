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
  let messagesList = [];

   let nodes = ["/messageRef/agency/" + agencyId + "/countryadmins/" + countryId,
                "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + countryId,
                "/messageRef/systemadmin/allcountryadminsgroup/" + countryId,
                "/messageRef/systemadmin/allusersgroup/" + countryId];

  
  //  return this.getNotifications(nodes[0], unreadOnly).map(messagesNode0 => {
  //       messagesList = messagesNode0;
  //       return this.getCountryAdminNotifications(nodes[1], unreadOnly).map(messagesNode1 => {
  //         messagesList = [...messagesList, messagesNode1];
  //         return this.getCountryAdminNotifications(nodes[2], unreadOnly).map(messagesNode2 => {
  //           messagesList = [...messagesList, messagesNode2];
  //           this.getCountryAdminNotifications(nodes[3], unreadOnly).map(messagesNode3 => {
  //             messagesList = [...messagesList, messagesNode3];
  //             return Observable.from(messagesList);
  //           });
  //       });
  //    });
  //     //return messagesList;
  //  });

  //return this.getNotifications(nodes, unreadOnly);

  // nodes.forEach(node => {
  //  return this.getNotifications(node, unreadOnly).subscribe(messages => {
  //     //console.log(messages);
  //     messagesList = messages;
  //     console.log(messagesList);
  //     return messagesList;
  //   });
  // });


  // let i = 1;
  // for(let key in nodes) {
  //   if( i === nodes.length)
  //   {
  //     console.log('return');
  //     return this.getNotifications(nodes[key], unreadOnly).flatMap(messages => {
  //       messagesList = [...messagesList, messages];
  //       return Observable.from(messagesList);
  //     });
  //   }else{
  //     console.log('dont return!');
  //     this.getNotifications(nodes[key], unreadOnly).flatMap(messages => {
  //       messagesList = [...messagesList, messages];
  //       i++;
  //       return Observable.from(messagesList);
  //     });
  //   }
  // }

  

  // return Observable.from(messagesList);
  
  // let nodesObservable = Observable.from(nodes);  
  // let observables = [];
  
  // return nodesObservable.flatMap( node => { return this.getNotifications(node, unreadOnly)})
  //                       // .flatMap(messageArray => {
  //                       //   console.log(messageArray);
  //                       //   messageArray.forEach(message => { messagesList.push(message); })
  //                       //   //messagesList = messagesList.concat(messageArray);
  //                       //   return messagesList;
  //                       // })
  //                       .map(messages => { 
  //                         messages.forEach(message => { messagesList.push(message); })
  //                         console.log(messages); 
                          
  //                         return messagesList; 
  //                       });
                        
  
  // nodes.forEach(node => observables.push(this.getNotifications(node, unreadOnly)));
  
  
  // return Observable.combineLatest(observables).flatMap(messages => {
    // messages.forEach(message => { msg.push(message); });
    // messagesArray.forEach(messageArray => {
    //   messageArray.forEach(message => {
    //     msg.push(message);
    //   });
    // console.log(msg);
    // });
    // return msg;
  //   return messages;
  // })
//   .map(messages => {  return messages; });
//   //.flatMap(messages => { console.log(messages); return messages; });
// return this.getNotifications(nodes[0], unreadOnly) && this.getNotifications(nodes[1], unreadOnly) && this.getNotifications(nodes[2], unreadOnly) && this.getNotifications(nodes[3], unreadOnly);
  return this.getNotifications("/messageRef/agency/" + agencyId + "/countryadmins/" + countryId, unreadOnly);
 }

 getCountryDirectorNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/agency/" + agencyId + "/countrydirectors/" + userId, unreadOnly);
 }

 getRegionalDirectorNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/agency/" + agencyId + "/regionaldirector/" + userId, unreadOnly);
 }

 getGlobalDirectorNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/agency/" + agencyId + "/globaldirector/" + userId, unreadOnly);
 }
 
 getGlobalUserNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/agency/" + agencyId + "/globaluser/" + userId, unreadOnly);
 }

 getDonorNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/country/" + countryId + "/donor/" + userId, unreadOnly);
 }

 getERTLeadsNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/country/" + countryId + "/ertleads/" + userId, unreadOnly);
 }

 getERTNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/country/" + countryId + "/erts/" + userId, unreadOnly);
 }

 getPartnerNotifications(countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/country/" + countryId + "/partner/" + countryId, unreadOnly);
 }

 getCountryUserNotifications(userId, countryId, agencyId, unreadOnly = false): Observable<MessageModel[]>{
   return this.getNotifications("/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId, unreadOnly);
 }

setAgencyNotificationsAsRead(agencyId): Observable<any>{
  return this.setNotificationsAsRead("/messageRef/systemadmin/allagencyadminsgroup/" + agencyId);
}

setCountryAdminNotificationsAsRead(countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/agency/" + agencyId + "/countryadmins/" + countryId);
 }

 setCountryDirectorNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/agency/" + agencyId + "/countrydirectors/" + userId);
 }

 setRegionalDirectorNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/agency/" + agencyId + "/regionaldirector/" + userId);
 }

 setGlobalDirectorNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/agency/" + agencyId + "/globaldirector/" + userId);
 }
 
 setGlobalUserNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/agency/" + agencyId + "/globaluser/" + userId);
 }
 
 setDonorNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/country/" + countryId + "/donor/" + userId);
 }
 
 setERTLeadsNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/country/" + countryId + "/ertleads/" + userId);
 }

 setERTNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/country/" + countryId + "/erts/" + userId);
 }

 setPartnerNotificationsAsRead(countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/country/" + countryId + "/partner/" + countryId);
 }
 
 setCountryUserNotificationsAsRead(userId, countryId, agencyId){
   return this.setNotificationsAsRead("/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId);
 }
 
 deleteAgencyAdminNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/systemadmin/allagencyadminsgroup/" + agencyId + "/" + messageId);
 }

 deleteCountryAdminNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/agency/" + agencyId + "/countryadmins/" + countryId + "/" + messageId);
 }

 deleteCountryDirectorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/agency/" + agencyId + "/countrydirectors/" + userId + "/" + messageId);
 }

deleteRegionalDirectorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/agency/" + agencyId + "/regionaldirector/" + userId + "/" + messageId);
}

 deleteGlobalDirectorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/agency/" + agencyId + "/globaldirector/" + userId + "/" + messageId);
 }

 deleteGlobalUserNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/agency/" + agencyId + "/globaluser/" + userId + "/" + messageId);
 }

 deleteDonorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/country/" + countryId + "/donor/" + userId + "/" + messageId);
 }
 
 deleteERTLeadsNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/country/" + countryId + "/ertleads/" + userId + "/" + messageId);
 }

 deleteERTNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/country/" + countryId + "/erts/" + userId + "/" + messageId);
 }

 deletePartnerNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/country/" + countryId + "/partner/" + userId + "/" + messageId);
 }

deleteCountryUserNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId + "/" + messageId);
 }
  deleteNotification(node): firebase.Promise<any>{
    if (!node) {
      Promise.reject('Missing node!');
    }
    return this.af.database.object(Constants.APP_STATUS + node).remove();
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
