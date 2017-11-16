import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {MessageModel} from "../../model/message.model";
import {NotificationService} from "../../services/notification.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CommonUtils} from "../../utils/CommonUtils";

@Component({
  selector: 'app-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.css']
})
export class NotificationBadgeComponent implements OnInit, OnDestroy {

  private unreadMessages: MessageModel[];

  private _USER_TYPE: string;
  private _countryId: string;
  private _agencyId: string;
  private _userId: string;
  private _networkId: string;
  private _networkCountryId: string;

  private isViewing: boolean;

  @Input()
  set USER_TYPE(USER_TYPE: string) {
    this._USER_TYPE = USER_TYPE;
    console.log(this._USER_TYPE);
    this.getUnreadMessages();
  }

  @Input()
  set countryId(countryId: string) {
    this._countryId = countryId;
    this.getUnreadMessages();
  }

  @Input()
  set agencyId(agencyId: string) {
    this._agencyId = agencyId;
    this.getUnreadMessages();
  }

  @Input()
  set userId(userId: string) {
    this._userId = userId;
    this.getUnreadMessages();
  }

  @Input()
  set networkId(networkId: string) {
    this._networkId = networkId;
    this.getUnreadMessages();
  }

  @Input()
  set networkCountryId(networkCountryId: string) {
    this._networkCountryId = networkCountryId;
    this.getUnreadMessages();
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _notificationService: NotificationService,
              private af: AngularFire,
              private route:ActivatedRoute,
              private router: Router) {
    this.unreadMessages = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params) =>{
      if (params["isViewing"] && params["systemId"] && params["agencyId"] && params["countryId"] && params["userType"] && params["networkId"] && params["networkCountryId"]) {
        this.isViewing = params["isViewing"];
      }
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToNotifications() {
    console.log(this._USER_TYPE);
    switch (this._USER_TYPE) {
      case 'administratorNetworkCountry':
        let nodesAdministratorNetworkCountry = this._notificationService.getNetworkCountryAdministratorNodes(this._networkId, this._networkCountryId, this._userId);
        let consNetworkAdminCountry = 1;
        for (let node of nodesAdministratorNetworkCountry) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (consNetworkAdminCountry == nodesAdministratorNetworkCountry.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("network-country/network-country-notifications").then();
            } else {
              consNetworkAdminCountry++;
            }
          });
        }
        break;
      case 'administratorNetwork':
        let nodesAdministratorNetwork = this._notificationService.getNetworkAdministratorNodes(this._networkId, this._userId);
        let consNetworkAdmin = 1;
        for (let node of nodesAdministratorNetwork) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (consNetworkAdmin == nodesAdministratorNetwork.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("network-admin/network-notifications").then();
            } else {
              consNetworkAdmin++;
            }
          });
        }
        break;
      case 'administratorNetworkLocal':
        let nodesAdministratorNetworkLocal = this._notificationService.getNetworkAdministratorNodes(this._networkId, this._userId);
        let consNetworkAdminLocal = 1;
        for (let node of nodesAdministratorNetworkLocal) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (consNetworkAdminLocal == nodesAdministratorNetworkLocal.length) {
              this.unreadMessages = [];
              this.router.navigate(["network-admin/network-notifications", {"isLocalNetworkAdmin": true}]);
            } else {
              consNetworkAdminLocal++;
            }
          });
        }
        break;
      case 'administratorAgency':
        let nodesAdministratorAgency = this._notificationService.getAgencyAdministratorNodes(this._agencyId);

        let c1 = 1;
        for (let node of nodesAdministratorAgency) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c1 == nodesAdministratorAgency.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("agency-admin/agency-notifications/agency-notifications").then();
            } else {
              c1++;
            }
          });
        }
        break;
      case 'administratorCountry':
        let nodesAdministratorCountry = this._notificationService.getCountryAdministratorNodes(this._agencyId, this._countryId, this._userId);

        let c2 = 1;
        for (let node of nodesAdministratorCountry) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c2 == nodesAdministratorCountry.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications").then();
            } else {
              c2++;
            }
          });
        }
        break;
      case 'countryUser':
        let nodesCountryUser = this._notificationService.getCountryUserNodes(this._agencyId, this._countryId, this._userId);

        let c3 = 1;
        for (let node of nodesCountryUser) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c3 == nodesCountryUser.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications").then();
            } else {
              c3++;
            }
          });
        }
        break;
      case 'countryDirector':
        let nodesCountryDirector = this._notificationService.getCountryDirectorNodes(this._agencyId, this._countryId, this._userId);

        let c4 = 1;
        for (let node of nodesCountryDirector) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c4 == nodesCountryDirector.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications").then();
            } else {
              c4++;
            }
          });
        }
        break;
      case 'regionDirector':
        let nodesRegionDirector = this._notificationService.getRegionDirectorNodes(this._agencyId, this._countryId, this._userId);

        let c5 = 1;
        for (let node of nodesRegionDirector) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c5 == nodesRegionDirector.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications").then();
            } else {
              c5++;
            }
          });
        }
        break;
      case 'globalDirector':
        let nodesGlobalDirector = this._notificationService.getGlobalDirectorNodes(this._agencyId, this._countryId, this._userId);

        let c6 = 1;
        for (let node of nodesGlobalDirector) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c6 == nodesGlobalDirector.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications").then();
            } else {
              c6++;
            }
          });
        }
        break;
      case 'globalUser':
        let nodesGlobalUser = this._notificationService.getGlobalUserNodes(this._agencyId, this._countryId, this._userId);

        let c7 = 1;
        for (let node of nodesGlobalUser) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c7 == nodesGlobalUser.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications").then();
            } else {
              c7++;
            }
          });
        }
        break;
      case 'ertLeader':
        let nodesErtLeader = this._notificationService.getErtLeaderNodes(this._agencyId, this._countryId, this._userId);

        let c8 = 1;
        for (let node of nodesErtLeader) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c8 == nodesErtLeader.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications").then();
            } else {
              c8++;
            }
          });
        }
        break;
      case 'ert':
        let nodesErt = this._notificationService.getErtNodes(this._agencyId, this._countryId, this._userId);

        let c9 = 1;
        for (let node of nodesErt) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c9 == nodesErt.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications").then();
            } else {
              c9++;
            }
          });
        }
        break;
      case 'donor':
        let nodesDonor = this._notificationService.getDonorNodes(this._agencyId, this._countryId, this._userId);

        let c10 = 1;
        for (let node of nodesDonor) {
          this._notificationService.setNotificationsAsRead(node).takeUntil(this.ngUnsubscribe).subscribe(() => {
            if (c10 == nodesDonor.length) {
              this.unreadMessages = [];
              this.router.navigateByUrl("donor-module/donor-notifications").then();
            } else {
              c10++;
            }
          });
        }
        break;
    }
  }

  private getUnreadMessages() {
    if (this._USER_TYPE && this._userId && (this._countryId || this._agencyId || this._networkId || this._networkCountryId)) {
      switch (this._USER_TYPE) {
        case 'administratorNetworkCountry':
          let nodesAdministratorNetworkCountry = this._notificationService.getNetworkCountryAdministratorNodes(this._networkId, this._networkCountryId, this._userId);
          for (let node of nodesAdministratorNetworkCountry) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'administratorNetwork':
          let nodesAdministratorNetwork = this._notificationService.getNetworkAdministratorNodes(this._networkId, this._userId);
          for (let node of nodesAdministratorNetwork) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'administratorNetworkLocal':
          let nodesAdministratorNetworkLocal = this._notificationService.getNetworkAdministratorNodes(this._networkId, this._userId);
          for (let node of nodesAdministratorNetworkLocal) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'administratorAgency':
          let nodesAdministratorAgency = this._notificationService.getAgencyAdministratorNodes(this._agencyId);

          for (let node of nodesAdministratorAgency) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'administratorCountry':
          let nodesAdministratorCountry = this._notificationService.getCountryAdministratorNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesAdministratorCountry) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'countryUser':
          let nodesCountryUser = this._notificationService.getCountryUserNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesCountryUser) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'countryDirector':
          let nodesCountryDirector = this._notificationService.getCountryDirectorNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesCountryDirector) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'regionDirector':
          let nodesRegionDirector = this._notificationService.getRegionDirectorNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesRegionDirector) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'globalDirector':
          let nodesGlobalDirector = this._notificationService.getGlobalDirectorNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesGlobalDirector) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'globalUser':
          let nodesGlobalUser = this._notificationService.getGlobalUserNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesGlobalUser) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'ertLeader':
          let nodesErtLeader = this._notificationService.getErtLeaderNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesErtLeader) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'ert':
          let nodesErt = this._notificationService.getErtNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesErt) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
        case 'donor':
          let nodesDonor = this._notificationService.getDonorNodes(this._agencyId, this._countryId, this._userId);
          for (let node of nodesDonor) {
            this.af.database.list(Constants.APP_STATUS + node)
              .takeUntil(this.ngUnsubscribe).subscribe(list => {
              list.forEach((x) => {
                if (x.$value === true) { // only unread messages
                  this._notificationService.getNotificationMessage(x.$key)
                    .takeUntil(this.ngUnsubscribe).subscribe(message => {
                    if (!CommonUtils.messageExistInList(message.id, this.unreadMessages)) {
                      this.unreadMessages.push(message);
                    }
                    this.unreadMessages.sort(function (a, b) {
                      return b.time - a.time;
                    });
                  });
                }
              });
            });
          }
          break;
      }
    }
  }

}
