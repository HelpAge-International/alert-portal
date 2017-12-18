import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
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
  private messageToDelete;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.af.database.list(Constants.APP_STATUS + '/administratorAgency/' + this.uid + '/sentmessages')
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
          .takeUntil(this.ngUnsubscribe)
          .subscribe(x => {
            this.sentMessages.push(x);
          });
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
    let msgData = {};
    let groups = [
      'agencyallusersgroup',
      'globaldirector',
      'globaluser',
      'regionaldirector',
      'countryadmins',
      'countrydirectors',
      'ertleads',
      'erts',
      'donor',
      'partner'];

    console.log(groups.length);
    msgData['/administratorAgency/' + this.uid + '/sentmessages/' + this.messageToDelete] = null;
    msgData['/message/' + this.messageToDelete] = null;

    let agencyGroupPath: string = Constants.APP_STATUS + '/group/agency/' + this.uid + '/';
    let agencyMessageRefPath: string = '/messageRef/agency/' + this.uid + '/';

    for (let group of groups) {

      let groupPath = agencyGroupPath + group;
      let msgRefPath = agencyMessageRefPath + group;

      this.af.database.list(groupPath)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(list => {
          list.forEach(item => {
            msgData[msgRefPath + '/' + item.$key + '/' + this.messageToDelete] = null;
          });

          if (groups.indexOf(group) == groups.length - 1) {
            this.af.database.object(Constants.APP_STATUS).update(msgData).then(() => {
              console.log("Message Ref successfully deleted from all nodes");
              jQuery("#delete-message").modal("hide");
            }).catch(error => {
              console.log("Message deletion unsuccessful" + error);
            });
          }
        });
    }

  }

  closeModal() {
    jQuery("#delete-message").modal("hide");
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
