import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {Router} from '@angular/router';
import {Constants} from '../../utils/Constants';
import {Observable, Subject} from 'rxjs';
import Promise = firebase.Promise;
declare var jQuery: any;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit, OnDestroy {

  private uid: string;
  private sentMessages: FirebaseObjectObservable<any>[] = [];
  private msgData = {};
  private messageToDelete;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {

    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;

        this.af.database.list(Constants.APP_STATUS + '/systemAdmin/' + this.uid + '/sentmessages')
          .flatMap(list => {
            this.sentMessages = [];
            let tempList = [];
            list.forEach(x => {
              tempList.push(x)
            });
            return Observable.from(tempList)
          })
          .flatMap(item => {
            return this.af.database.object(Constants.APP_STATUS + '/message/' + item.$key)
          })
          .distinctUntilChanged()
          .takeUntil(this.ngUnsubscribe)
          .subscribe(x => {
            this.sentMessages.push(x);
          });

      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteMessage(sentMessage) {
    this.messageToDelete = sentMessage.$key;
    jQuery("#delete-message").modal("show");
  }

  deleteFromFirebase() {

    this.msgData = {};

    this.msgData['/systemAdmin/' + this.uid + '/sentmessages/' + this.messageToDelete] = null;
    this.msgData['/message/' + this.messageToDelete] = null;

    let allUsersGroupPath: string = Constants.APP_STATUS + '/group/systemadmin/allusersgroup';
    let allAgencyAdminsGroupPath: string = Constants.APP_STATUS + '/group/systemadmin/allagencyadminsgroup';
    let allCountryAdminsGroupPath: string = Constants.APP_STATUS + '/group/systemadmin/allcountryadminsgroup';
    let allNetworkAdminsGroupPath: string = Constants.APP_STATUS + '/group/systemadmin/allnetworkadminsgroup';

    let allUsersMsgRefPath: string = '/messageRef/systemadmin/allusersgroup/';
    let allAgencyAdminsMsgRef: string = '/messageRef/systemadmin/allagencyadminsgroup/';
    let allCountryAdminsMsgRef: string = '/messageRef/systemadmin/allcountryadminsgroup/';
    let allNetworkAdminsMsgRef: string = '/messageRef/systemadmin/allnetworkadminsgroup/';

    this.af.database.list(allUsersGroupPath)
      .do(list => {
        list.forEach(item => {
          this.msgData[allUsersMsgRefPath + item.$key + '/' + this.messageToDelete] = null;
        })
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.af.database.list(allAgencyAdminsGroupPath)
          .do(list => {
            list.forEach(item => {
              this.msgData[allAgencyAdminsMsgRef + item.$key + '/' + this.messageToDelete] = null;
            })
          })
          .takeUntil(this.ngUnsubscribe)
          .subscribe(() => {
            this.af.database.list(allCountryAdminsGroupPath)
              .do(list => {
                list.forEach(item => {
                  this.msgData[allCountryAdminsMsgRef + item.$key + '/' + this.messageToDelete] = null;
                })
              })
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.af.database.list(allNetworkAdminsGroupPath)
                  .do(list => {
                    list.forEach(item => {
                      this.msgData[allNetworkAdminsMsgRef + item.$key + '/' + this.messageToDelete] = null;
                    })
                  })
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(() => {
                    this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(() => {
                      console.log('Message Ref successfully deleted from all nodes');
                      jQuery("#delete-message").modal("hide");
                      // this.router.navigate(['/system-admin/messages']);
                    })
                  })
              })
          })
      });
  }

  closeModal() {
    jQuery("#delete-message").modal("hide");
  }

  private
  navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
