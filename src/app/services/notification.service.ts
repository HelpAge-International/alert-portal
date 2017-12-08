import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable} from 'rxjs';
import {MessageModel} from "../model/message.model";
import { UserType } from "../utils/Enums";
import { UserService } from "./user.service";

@Injectable()
export class NotificationService {

  constructor(private _userService: UserService,
              private af: AngularFire) {
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

  deleteNetworkAdminNotification(userId, networkId, messageId): firebase.Promise<any>{
    let deleteData = {};

    let nodesAdministratorNetwork = this.getNetworkAdministratorNodes(networkId, userId);

    for (let node of nodesAdministratorNetwork) {
      deleteData[node + '/' + messageId] = null;
    }

    return this.deleteNotification(deleteData);
  }

  deleteNetworkCountryAdminNotification(userId, networkId, networkCountryId, messageId): firebase.Promise<any>{
    let deleteData = {};

    let nodesAdministratorNetworkCountry = this.getNetworkCountryAdministratorNodes(networkId, networkCountryId, userId);

    for (let node of nodesAdministratorNetworkCountry) {
      deleteData[node + '/' + messageId] = null;
    }

    return this.deleteNotification(deleteData);
  }

 deleteAgencyAdminNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesAdministratorAgency = this.getAgencyAdministratorNodes(agencyId);

  for (let node of nodesAdministratorAgency) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

 deleteCountryAdminNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesAdministratorCountry = this.getCountryAdministratorNodes(agencyId, countryId, userId);

  for (let node of nodesAdministratorCountry) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

 deleteCountryDirectorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesCountryDirector = this.getCountryDirectorNodes(agencyId, countryId, userId);

  for (let node of nodesCountryDirector) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

deleteRegionalDirectorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesRegionDirector = this.getRegionDirectorNodes(agencyId, countryId, userId);

  for (let node of nodesRegionDirector) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
}

 deleteGlobalDirectorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesGlobalDirector = this.getGlobalDirectorNodes(agencyId, countryId, userId);

  for (let node of nodesGlobalDirector) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

 deleteGlobalUserNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesGlobalUser = this.getGlobalUserNodes(agencyId, countryId, userId);

  for (let node of nodesGlobalUser) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

 deleteDonorNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesDonor = this.getDonorNodes(agencyId, countryId, userId);

  for (let node of nodesDonor) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

 deleteERTLeadsNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesErtLeader = this.getErtLeaderNodes(agencyId, countryId, userId);

  for (let node of nodesErtLeader) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

 deleteERTNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesErt = this.getErtNodes(agencyId, countryId, userId);

  for (let node of nodesErt) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }

 deletePartnerNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   return this.deleteNotification("/messageRef/country/" + countryId + "/partner/" + userId + "/" + messageId);
 }

deleteCountryUserNotification(userId, countryId, agencyId, messageId): firebase.Promise<any>{
   let deleteData = {};

   let nodesCountryUser = this.getCountryUserNodes(agencyId, countryId, userId);

  for (let node of nodesCountryUser) {
    deleteData[node + '/' + messageId] = null;
  }

  return this.deleteNotification(deleteData);
 }
  deleteNotification(deleteData): firebase.Promise<any>{
    if (!deleteData) {
      Promise.reject('Missing data!');
    }
    return this.af.database.object(Constants.APP_STATUS).update(deleteData);
  }

  saveUserNotificationBasedOnNotificationSetting(message: MessageModel, notificationSetting: number, agencyId: string, countryId: string)
  {
    // Regular staff
    this._userService.getStaffList(countryId).subscribe(staffs => {
      staffs.forEach(staff => {
        if(staff.notification && staff.notification.indexOf(notificationSetting) !== -1)
        {
          this.saveUserNotification(staff.id, message, staff.userType, agencyId, countryId).then(() => {});
        }
      });
    });

    // Global staff
    this._userService.getGlobalStaffList(agencyId).subscribe(staffs => {
      staffs.forEach(staff => {
        if(staff.notification && (staff.userType === UserType.RegionalDirector || staff.userType === UserType.GlobalDirector)
            && staff.notification.indexOf(notificationSetting) !== -1)
        {
          this.saveUserNotification(staff.id, message, staff.userType, agencyId, countryId).then(() => {});
        }
      });
    });
  }

  saveUserNotificationBasedOnNotificationSettingLocalAgency(message: MessageModel, notificationSetting: number, agencyId: string)
  {
    // Regular staff
    this._userService.getStaffList(agencyId).subscribe(staffs => {
      staffs.forEach(staff => {
        if(staff.notification && staff.notification.indexOf(notificationSetting) !== -1)
        {
          this.saveUserNotificationLocalAgency(staff.id, message, staff.userType, agencyId).then(() => {});
        }
      });
    });

    // Global staff
    this._userService.getGlobalStaffList(agencyId).subscribe(staffs => {
      staffs.forEach(staff => {
        if(staff.notification && (staff.userType === UserType.RegionalDirector || staff.userType === UserType.GlobalDirector)
          && staff.notification.indexOf(notificationSetting) !== -1)
        {
          this.saveUserNotificationLocalAgency(staff.id, message, staff.userType, agencyId).then(() => {});
        }
      });
    });
  }

  saveUserNotificationWithoutDetails(userId: string, message: MessageModel): Observable<any>{
    if(!userId || !message)
    {
      throw new Error('userId or message missing.');
    }

    return this._userService.getUserType(userId)
        .map(x => {
          let userType = x;

          const userTypePath = Constants.USER_PATHS[userType];
          console.log(userTypePath);
          return this._userService.getAgencyId(userTypePath, userId)
            .subscribe(agency => {
              let agencyId = agency;
              return this._userService.getCountryId(userTypePath, userId)
                .subscribe(country => {
                  let countryId = country;
                  return this.saveUserNotification(userId, message, userType, agencyId, countryId);
                });
            });
          });
  }
  saveUserNotification(userId: string, message: MessageModel, userType: number, agencyId: string, countryId: string): firebase.Promise<any>{
    let node = '';

    if(!userId || !message || !userType || !agencyId || !countryId)
    {
      throw new Error('Missing required fields.')
    }

    switch(userType){
      case UserType.AgencyAdmin:
        node = "/messageRef/systemadmin/allagencyadminsgroup/" + agencyId +  "/{messageId}";
        break;
      case UserType.CountryAdmin:
        node = "/messageRef/agency/" + agencyId + "/countryadmins/" + userId + "/{messageId}";
        break;
      case UserType.CountryDirector:
        node = "/messageRef/agency/" + agencyId + "/countrydirectors/" + userId + "/{messageId}";
        break;
      case UserType.RegionalDirector:
        node = "/messageRef/agency/" + agencyId + "/regionaldirector/" + userId + "/{messageId}";
        break;
      case UserType.GlobalDirector:
        node = "/messageRef/agency/" + agencyId + "/globaldirector/" + userId + "/{messageId}";
        break;
      case UserType.GlobalUser:
        node = "/messageRef/agency/" + agencyId + "/globaluser/" + userId + "/{messageId}";
        break;
      case UserType.Donor:
        node = "/messageRef/country/" + countryId + "/donor/" + userId + "/{messageId}";
        break;
      case UserType.ErtLeader:
        node = "/messageRef/country/" + countryId + "/ertleads/" + userId + "/{messageId}";
        break;
      case UserType.Ert:
        node = "/messageRef/country/" + countryId + "/erts/" + userId + "/{messageId}";
        break;
      case UserType.NonAlert:
        node = "/messageRef/country/" + countryId + "/partner/" + userId + "/{messageId}";
        break;
      case UserType.CountryUser:
        node = "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId + "/{messageId}";
        break;

    }

    return this.saveNotification(node, message);
  }

  saveUserNotificationLocalAgency(userId: string, message: MessageModel, userType: number, agencyId: string): firebase.Promise<any>{
    let node = '';

    if(!userId || !message || !userType || !agencyId )
    {
      throw new Error('Missing required fields.')
    }

    switch(userType){
      case UserType.AgencyAdmin:
        node = "/messageRef/systemadmin/allagencyadminsgroup/" + agencyId +  "/{messageId}";
        break;
      case UserType.LocalAgencyAdmin:
        node = "/messageRef/agency/" + agencyId + "/localagencyadmins/" + userId + "/{messageId}";
        break;
      case UserType.LocalAgencyDirector:
        node = "/messageRef/agency/" + agencyId + "/localagencydirectors/" + userId + "/{messageId}";
        break;
      case UserType.RegionalDirector:
        node = "/messageRef/agency/" + agencyId + "/regionaldirector/" + userId + "/{messageId}";
        break;
      case UserType.GlobalDirector:
        node = "/messageRef/agency/" + agencyId + "/globaldirector/" + userId + "/{messageId}";
        break;
      case UserType.GlobalUser:
        node = "/messageRef/agency/" + agencyId + "/globaluser/" + userId + "/{messageId}";
        break;



    }

    return this.saveNotification(node, message);
  }

private saveNotification(node: string, message: MessageModel): firebase.Promise<any>{
  if(!node || !message) {
    console.log('no node or message')
    return;
  }

  return this.af.database.list(Constants.APP_STATUS + '/message').push(message)
    .then(
      (msg) => {
          let messageRefData = {};
          node = node.replace("{messageId}", msg.key);
          messageRefData[node] = true;
          this.af.database.object(Constants.APP_STATUS).update(messageRefData);
      }
    );
}

   getNotifications(node: string, unreadOnly): Observable<MessageModel[]>  {
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


  setNotificationsAsRead(node: string): Observable<any>  {
    if(!node) {
      return;
    }

    return this.af.database.list(Constants.APP_STATUS + node)
      .map(list => {
        list.forEach((message) => {
          if(message.$value === true) {
            let obj = {};
            obj[message.$key] = new Date().getTime();
            return this.af.database.object(Constants.APP_STATUS + node).update(obj);
          }
        });
      });
  }

   getNotificationMessage(messageId: string): Observable<MessageModel>{
    return this.af.database.object(Constants.APP_STATUS + "/message/" + messageId)
      .map(item => {
        let message = new MessageModel();
        message.mapFromObject(item);
        message.id = item.$key;
        return message;
      });
  }
  getNetworkAdministratorNodes(networkId: string, userId: string)
  {
    return [
      "/messageRef/network/" + networkId + "/networkallusersgroup/" + userId,
      "/messageRef/systemadmin/allusersgroup/" + userId,
      "/messageRef/systemadmin/allnetworkadminsgroup/" + userId];
  }
  getNetworkCountryAdministratorNodes(networkId: string, networkCountryId: string, userId: string)
  {
    return [
      "/messageRef/network/" + networkId + "/networkallusersgroup/" + userId,
      "/messageRef/network/" + networkId + "/networkcountryadmins/" + userId,
      "/messageRef/systemadmin/allnetworkcountryadminsgroup/" + userId,
      "/messageRef/systemadmin/allusersgroup/" + userId];
  }

  getAgencyAdministratorNodes(agencyId: string)
  {
    return [
          "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + agencyId,
          "/messageRef/systemadmin/allusersgroup/" + agencyId,
          "/messageRef/systemadmin/allagencyadminsgroup/" + agencyId];
  }

  getCountryAdministratorNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/agency/" + agencyId + "/countryadmins/" + countryId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + countryId,
            "/messageRef/systemadmin/allcountryadminsgroup/" + countryId,
            "/messageRef/systemadmin/allusersgroup/" + countryId];
  }

  getCountryUserNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/countryallusersgroup/" + userId]
  }

  getCountryDirectorNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/countrydirectors/" + userId,
            "/messageRef/country/" + countryId + "/countryallusersgroup/" + userId]
  }

  getRegionDirectorNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/regionaldirector/" + userId]
  }

  getGlobalDirectorNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/globaldirector/" + userId]
  }

  getGlobalUserNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/globaluser/" + userId]
  }

  getErtLeaderNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/countryallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/ertleads/" + userId]
  }

  getErtNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/countryallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/erts/" + userId]
  }

  getDonorNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/countryallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/donor/" + userId]
  }

  getPartnerNodes(agencyId: string, countryId: string, userId: string)
  {
    return [
            "/messageRef/systemadmin/allusersgroup/" + userId,
            "/messageRef/agency/" + agencyId + "/agencyallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/countryallusersgroup/" + userId,
            "/messageRef/country/" + countryId + "/partner/" + userId]
  }

}
