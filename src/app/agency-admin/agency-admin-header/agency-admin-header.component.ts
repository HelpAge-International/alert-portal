import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Message} from "../../model/message";
import {Subject} from "rxjs";

@Component({
  selector: 'app-agency-admin-header',
  templateUrl: './agency-admin-header.component.html',
  styleUrls: ['./agency-admin-header.component.css']
})

export class AgencyAdminHeaderComponent implements OnInit, OnDestroy {

  private uid: string;
  private firstName: string = "";
  private lastName: string = "";
  private agencyName: string = "";
  private counter: number = 0;
  private unreadMessages = [];
  private unreadSortedMessages = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private translate: TranslateService) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.getMessages();
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
          .takeUntil(this.ngUnsubscribe).subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
        this.af.database.object(Constants.APP_STATUS + "/agency/" + this.uid)
          .takeUntil(this.ngUnsubscribe).subscribe(agency => {
          this.agencyName = agency.name;
        });
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout() {
    console.log("logout");
    this.af.auth.logout();
  }

  test() {
    this.counter++;
    if (this.counter % 2 == 0) {
      this.translate.use("en");
    } else {
      this.translate.use("fr");
    }
  }

  goToNotifications() {
    this.router.navigateByUrl("agency-admin/agency-notifications/agency-notifications");
  }

  getMessages() {
    this._getMessageByType('allagencyadminsgroup');
    this._getMessageByType('allusersgroup');
  }

  _getMessageByType(groupType: string) {
    this.af.database.list(Constants.APP_STATUS + "/messageRef/systemadmin/" + groupType + "/" + this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {
        list.forEach((x) => {
          this._getMessageData(x.$key, x.$value);
        });

      });
  }

  _getMessageData(messageID: string, messageTime: number) {
    this.af.database.object(Constants.APP_STATUS + "/message/" + messageID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((message: Message) => {
        if (message.time > messageTime) {
          this.unreadMessages.push(message);
          this._sortMessages();
        }
      });
  }

  _sortMessages() {
    this.unreadSortedMessages = this.unreadMessages.sort(function (a, b) {
      return b.time - a.time;
    });
  }

}
