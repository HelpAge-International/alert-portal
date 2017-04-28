import {Component, OnInit} from '@angular/core';
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2"
import {Router} from "@angular/router";
import {RxHelper} from "../../utils/RxHelper";
import {Observable} from "rxjs";
import {Message} from "../../model/message";

declare var jQuery: any;
@Component({
    selector: 'app-agency-notifications',
    templateUrl: './agency-notifications.component.html',
    styleUrls: ['./agency-notifications.component.css']
})
export class AgencyNotificationsComponent implements OnInit {

    private uid: string;
    private messages = [];
    private sortedMessages = [];
    private messageToDeleteID;
    private messageToDeleteType;

    constructor(private af: AngularFire, private subscriptions: RxHelper, private router: Router) {}

    ngOnInit() {

        let subscription = this.af.auth.subscribe(auth => {
            if (auth) {
                this.uid = auth.uid;
                this.getMessages();
            } else {
                this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    }


    getMessages() {
        this.messages = [];
        this.sortedMessages = [];
        this._getMessageByType('allagencyadminsgroup');
        this._getMessageByType('allusersgroup');
    }

    deleteMessage(messageID: string, groupType: string) {
        if (!messageID || !groupType) {
            console.log('message ID and groupType requried params!');
            return;
        }
        this.messageToDeleteID = messageID;
        this.messageToDeleteType = groupType;
        jQuery("#delete-message").modal("show");
    }

    processDeleteMessage() {
        this.af.database.object(Constants.APP_STATUS + '/messageRef/systemadmin/' + this.messageToDeleteType + '/' + this.uid + '/' + this.messageToDeleteID).remove();
        this.closeModal();
        this.getMessages();
        return;
    }

    closeModal() {
        jQuery("#delete-message").modal("hide");
    }

    _getMessageByType(groupType: string) {
        let subscription = this.af.database.list(Constants.APP_STATUS + "/messageRef/systemadmin/" + groupType + "/" + this.uid).subscribe(list => {
            list.forEach((x) => {
                this._getMessageData(x.$key, x.$value, groupType);
            });

        });
        this.subscriptions.add(subscription);
    }

    _getMessageData(messageID: string, messageTime: number, groupType: string) {

        let subscription = this.af.database.object(Constants.APP_STATUS + "/message/" + messageID).subscribe((message: Message) => {
            if (message.time > messageTime) {
                this._updateReadMessageTime(groupType, messageID);
            }
            message.groupType = groupType;
            this.messages.push(message);
            this._sortMessages();
        });
        this.subscriptions.add(subscription);
    }

    _sortMessages() {
        this.sortedMessages = this.messages.sort(function (a, b) {
            return b.time - a.time;
        });
    }

    _updateReadMessageTime(groupType: string, messageID: string) {
        var currentTime = new Date().getTime();
        this.af.database.object(Constants.APP_STATUS + '/messageRef/systemadmin/' + groupType + '/' + this.uid + '/' + messageID)
            .set(currentTime)
            .then(() => {
                console.log('success update');
            }).catch((error: any) => {
                console.log(error, 'You do not have access!')
            });
    }

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }

}
