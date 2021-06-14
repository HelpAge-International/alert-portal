
import {from as observableFrom, Observable, Subject} from 'rxjs';
import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/database";
//import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {PageControlService} from "../../services/pagecontrol.service";
import {distinctUntilChanged, flatMap} from "rxjs/internal/operators";
import {takeUntil} from "rxjs/operators";
import {MessageModel} from "../../model/message.model";
declare var jQuery: any;

@Component({
  selector: 'app-agency-messages',
  templateUrl: './agency-messages.component.html',
  styleUrls: ['./agency-messages.component.css']
})

export class AgencyMessagesComponent implements OnInit, OnDestroy {

  private uid: string;
  private sentMessages: Observable<MessageModel>[] = [];
  private messageToDelete;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private afd: AngularFireDatabase, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.afd.list(Constants.APP_STATUS + '/administratorAgency/' + this.uid + '/sentmessages')
          .snapshotChanges()
          .pipe(flatMap(list => {
            this.sentMessages = [];
            let tempList = [];
            list.forEach(x => {
              tempList.push(x.payload.val());
            });
            return observableFrom(tempList)
          }))
          .pipe(flatMap(item => {
            return this.afd.object<MessageModel>(Constants.APP_STATUS + '/message/' + item.key).valueChanges()
          }))
          .pipe(distinctUntilChanged())
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(x => {
            this.sentMessages.push(Observable.of(x));
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

      this.afd.list(groupPath)
        .snapshotChanges()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(list => {
          list.forEach(item => {
            msgData[msgRefPath + '/' + item.key + '/' + this.messageToDelete] = null;
          });

          if (groups.indexOf(group) == groups.length - 1) {
            this.afd.object(Constants.APP_STATUS).update(msgData).then(() => {
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
