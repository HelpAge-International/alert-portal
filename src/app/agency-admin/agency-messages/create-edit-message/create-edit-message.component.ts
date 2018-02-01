import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../../../model/message";
import {Constants} from "../../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";

@Component({
  selector: 'app-create-edit-message',
  templateUrl: './create-edit-message.component.html',
  styleUrls: ['./create-edit-message.component.css']
})

export class CreateEditMessageComponent implements OnInit, OnDestroy {

  private uid: string;
  private inactive: Boolean = true;
  private errorMessage: any;
  private alerts = {};
  private messageTitle: string;
  private messageContent: string;
  private allUsersSelected: Boolean;
  private globalDirectorSelected: Boolean;
  private globalUserSelected: Boolean;
  private regionalDirectorSelected: Boolean;
  private countryAdminsSelected: Boolean;
  private countryDirectorsSelected: Boolean;
  private ertLeadsSelected: Boolean;
  private ertsSelected: Boolean;
  private donorSelected: Boolean;
  private partnerSelected: Boolean;
  private currentDateTimeInMilliseconds;
  private msgData = {};
  private groups: string[] = [];
  private agencyGroupPath: string;
  private agencyMessageRefPath: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemAdminId) => {
        this.uid = user.uid;
        console.log('uid: ' + this.uid);
        this.agencyGroupPath = Constants.APP_STATUS + '/group/agency/' + agencyId + '/';
        this.agencyMessageRefPath = '/messageRef/agency/' + agencyId + '/';
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.msgData = {};
  }

  onSubmit() {

    if (this.validate()) {
      this.createNewMessage();
      this.inactive = true;
    } else {
      this.showAlert();
    }
  }

  private createNewMessage() {

    this.af.database.list(this.agencyGroupPath)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(groups => {
      if (groups.length == 0) {
        this.errorMessage = "MESSAGES.NO_USERS_IN_GROUP";
        this.showAlert();
        return;
      } else {
        this.currentDateTimeInMilliseconds = new Date().getTime();

        let newMessage: Message = new Message(this.uid, this.messageTitle, this.messageContent, this.currentDateTimeInMilliseconds);
        let messagePath = Constants.APP_STATUS + '/message';

        this.af.database.list(messagePath).push(newMessage)
          .then(msgId => {
            console.log('New Message added to message node');

            let sentMsgPath = '/administratorAgency/' + this.uid + '/sentmessages/' + msgId.key;
            this.msgData[sentMsgPath] = true;
            this.addMsgToMessageRef(msgId.key);
          });
      }
    });
  }

  private addMsgToMessageRef(key: string) {

    if (this.allUsersSelected) {

      let agencyAllUsersSelected: string = this.agencyGroupPath + 'agencyallusersgroup/';
      let agencyAllUsersMessageRefPath: string = this.agencyMessageRefPath + 'agencyallusersgroup/';

      this.af.database.list(agencyAllUsersSelected)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencyAllUsersIds => {
          agencyAllUsersIds.forEach(agencyAllUsersId => {
            this.msgData[agencyAllUsersMessageRefPath + agencyAllUsersId.$key + '/' + key] = true;
          });

          this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
            console.log("Message Ref successfully added to all nodes");
            this.router.navigate(this.isLocalAgency ? ['/local-agency/agency-messages'] : ['/agency-admin/agency-messages']);
          }).catch(error => {
            console.log("Message creation unsuccessful" + error);
          });
        });

    } else {

      if (this.globalDirectorSelected) {
        this.groups.push('globaldirector');
      }
      if (this.globalUserSelected) {
        this.groups.push('globaluser');
      }
      if (this.regionalDirectorSelected) {
        this.groups.push('regionaldirector');
      }
      if (this.countryAdminsSelected) {
        this.groups.push('countryadmins');
      }
      if (this.countryDirectorsSelected) {
        this.groups.push('countrydirectors');
      }
      if (this.ertLeadsSelected) {
        this.groups.push('ertleads');
      }
      if (this.ertsSelected) {
        this.groups.push('erts');
      }
      if (this.donorSelected) {
        this.groups.push('donor');
      }
      if (this.partnerSelected) {
        this.groups.push('partner');
      }

      for (let group of this.groups) {

        let path = this.agencyGroupPath + group;
        this.af.database.list(path)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(list => {
          list.forEach(item => {
            this.msgData[this.agencyMessageRefPath + group + '/' + item.$key + '/' + key] = true;
          });

          if (this.groups.indexOf(group) == this.groups.length - 1) {
            this.af.database.object(Constants.APP_STATUS).update(this.msgData).then(_ => {
              console.log("Message Ref successfully added to all nodes");
              this.router.navigate(this.isLocalAgency ? ['/local-agency/agency-messages'] : ['/agency-admin/agency-messages']);
            }).catch(error => {
              console.log("Message creation unsuccessful" + error);
            });
          }
        });
      }
    }
  }

  private showAlert() {
    this.inactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.inactive = true;
    });
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * @returns {boolean}
   */
  private validate() {

    if (!Boolean(this.messageTitle)) {
      this.alerts[this.messageTitle] = true;
      this.errorMessage = 'MESSAGES.NO_TITLE_ERROR';
      return false;
    } else if (!Boolean(this.messageContent)) {
      this.alerts[this.messageContent] = true;
      this.errorMessage = 'MESSAGES.NO_CONTENT_ERROR';
      return false;
    } else if ((!this.allUsersSelected)
      && (!this.globalDirectorSelected)
      && (!this.globalUserSelected)
      && (!this.regionalDirectorSelected)
      && (!this.countryAdminsSelected)
      && (!this.countryDirectorsSelected)
      && (!this.ertLeadsSelected)
      && (!this.ertsSelected)
      && (!this.donorSelected)
      && (!this.partnerSelected)) {
      this.errorMessage = 'MESSAGES.NO_RECIPIENTS_ERROR';
      return false;
    }
    return true;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
