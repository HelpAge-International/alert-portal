import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {Router} from '@angular/router';
import {Constants} from '../../utils/Constants';
import {Observable} from 'rxjs';
import {RxHelper} from '../../utils/RxHelper';
import Promise = firebase.Promise;
declare var jQuery: any;

@Component({
  selector: 'app-agency-messages',
  templateUrl: './agency-messages.component.html',
  styleUrls: ['./agency-messages.component.css']
})

export class AgencyMessagesComponent implements OnInit, OnDestroy {

  private uid: string;
  private sentMessages: FirebaseObjectObservable<any>[] = [];
  private msgData = {};
  private messageToDelete;
  private groups: string[] = [];

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;

        let subscription = this.af.database.list(Constants.APP_STATUS + '/administratorAgency/' + this.uid + '/sentmessages')
          .flatMap(list => {
            this.sentMessages = [];
            let tempList = [];
            list.forEach(x => {
              tempList.push(x);
            });
            return Observable.from(tempList)
          })
          .flatMap(item => {
            return this.af.database.object(Constants.APP_STATUS + '/message/' + item.$key)
          })
          .distinctUntilChanged()
          .subscribe(x => {
            this.sentMessages.push(x);
          });

        this.subscriptions.add(subscription);

      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  // TODO - FIX - Message references dont get deleted from 'messageRef' node
  deleteMessage(sentMessage) {
    this.messageToDelete = sentMessage.$key;
    jQuery("#delete-message").modal("show");
  }

  deleteFromFirebase() {

    this.msgData['/message/' + this.messageToDelete] = null;
    this.msgData['/administratorAgency/' + this.uid + '/sentmessages/' + this.messageToDelete] = null;

    this.groups.push('agencyallusersgroup');
    this.groups.push('globaldirector');
    this.groups.push('globaluser');
    this.groups.push('regionaldirector');
    this.groups.push('countryadmins');
    this.groups.push('countrydirectors');
    this.groups.push('ertleads');
    this.groups.push('erts');
    this.groups.push('donor');
    this.groups.push('partner');

    let agencyGroupPath: string = '/group/agency/' + this.uid + '/';
    let agencyMessageRefPath: string = '/messageRef/agency/' + this.uid + '/';

    for (let group of this.groups) {

      let groupPath = agencyGroupPath + group;
      let msgRefPath = agencyMessageRefPath + group;

      let subscription = this.af.database.list(groupPath)
        .subscribe(list => {
          list.forEach(item => {
            console.log("this.messageToDelete" + this.messageToDelete);
            this.msgData[msgRefPath + '/' + item.$key + '/' + this.messageToDelete] = null;
          });
          if (this.groups.indexOf(group) == this.groups.length - 1) {

            this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
              console.log("Message Ref successfully deleted from all nodes");
              jQuery("#delete-message").modal("hide");
            }).catch(error => {
              console.log("Message deletion unsuccessful" + error);
            });
          }
        });
      this.subscriptions.add(subscription);
    }
  }

  closeModal() {
    jQuery("#delete-message").modal("hide");
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
