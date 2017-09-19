import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Observable} from "rxjs/Observable";
declare var jQuery: any;

@Component({
  selector: 'app-network-message',
  templateUrl: './network-message.component.html',
  styleUrls: ['./network-message.component.css']
})
export class NetworkMessageComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private uid : string;
  private networkId: string;
  private showLoader: boolean;
  private sentMessages: FirebaseObjectObservable<any>[] = [];
  private messageToDelete;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private af: AngularFire) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.showLoader = false;
          this.downloadSentMessages();
        })
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

  deleteFromFirebase(){
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

    msgData['/administratorNetwork/' + this.uid + '/sentmessages/' + this.messageToDelete] = null;
    msgData['/message/' + this.messageToDelete] = null;

    this.networkService.getAgencyIdsForNetwork(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyIds =>{
        if (agencyIds != null){
          for (let agencyId of agencyIds) {
            console.log(agencyId);
            let agencyGroupPath: string = Constants.APP_STATUS + '/group/agency/' + agencyId + '/';
            let agencyMessageRefPath: string = '/messageRef/agency/' + agencyId + '/';

            for (let group of groups) {
              let groupPath = agencyGroupPath + group;
              let msgRefPath = agencyMessageRefPath + group;

              this.af.database.list(groupPath)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(list => {
                  list.forEach(item => {
                    msgData[msgRefPath + '/' + item.$key + '/' + this.messageToDelete] = null;
                  });
                  if ((agencyIds.indexOf(agencyId) == agencyIds.length - 1) && (groups.indexOf(group) == groups.length - 1)) {
                    this.af.database.object(Constants.APP_STATUS).update(msgData).then(() => {
                      this.downloadSentMessages();
                      console.log("Message Ref successfully deleted from all nodes");
                      jQuery("#delete-message").modal("hide");
                    }).catch(error => {
                      console.log("Message deletion unsuccessful" + error);
                    });
                  }
                });
            }
          }
        }
      });

    //TODO delete message for all the network country admins

  }

  closeModal() {
    jQuery("#delete-message").modal("hide");
  }
  private downloadSentMessages(){
    this.af.database.list(Constants.APP_STATUS + '/administratorNetwork/' + this.uid + '/sentmessages')
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
  }
}
