import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {AngularFire, FirebaseApp} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ActionLevel, ActionStatus, ThresholdName} from "../../utils/Enums";
import {Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
declare var jQuery: any;
import {LocalStorageService} from 'angular-2-local-storage';
import {MinimumPreparednessComponent} from '../minimum/minimum.component';
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})

export class AdvancedPreparednessComponent extends MinimumPreparednessComponent implements OnInit, OnDestroy {

  protected actionLevel = ActionLevel.APA;

  private hazards: Subject<any> = new Subject();
  private alerts: Subject<any> = new Subject();

  private alertFilterSubject: Subject<any>;
  private alertFilter: any = {};

  // private ngUnsubscribe: Subject<void> = new Subject<void>();

  firebase: any;

  constructor(protected pageControl: PageControlService, @Inject(FirebaseApp) firebaseApp: any, protected af: AngularFire, protected router: Router, protected route: ActivatedRoute, protected storage: LocalStorageService, protected userService:UserService) {
    super(pageControl, firebaseApp, af, router, route, storage, userService);
    this.firebase = firebaseApp;

    this.docFilterSubject = new BehaviorSubject(undefined);
    this.docFilter = {
      query: {
        orderByChild: "module",
        equalTo: this.docFilterSubject
      }
    };

    this.alertFilterSubject = new BehaviorSubject(undefined);
    this.alertFilter = {
      query: {
        orderByChild: "hazardScenario",
        equalTo: this.alertFilterSubject
      }
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.obsCountryId.subscribe(
          value => {
            this.af.database.list(Constants.APP_STATUS + '/hazard/' + this.countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(hazards => {
                this.hazards.next(hazards);
              });
          },
          error => console.log(error),
          () => console.log("finished")
        );

        this.af.database.list(Constants.APP_STATUS + '/action/')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(_ => {
            this.actions = [];
            _.map(actions => {
              let agencyId = actions.$key
              Object.keys(actions).map(action => {
                if (typeof actions[action] !== 'object')
                  return;

                actions[action].agencyId = agencyId;
                actions[action].key = action;
                actions[action].docsCount = 0;
                let userKey = actions[action].asignee;
                try {
                  actions[action].docsCount = Object.keys(actions[action].documents).length;

                  Object.keys(actions[action].documents).map(docId => {
                    this.af.database.object(Constants.APP_STATUS + '/document/' + agencyId + '/' + docId)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(_ => {
                        actions[action].documents[docId] = _;
                      });
                  });
                } catch (e) {

                }

                this.hazards
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(hazards => {
                    actions[action].hazards = hazards.filter(hazard => {
                      if (actions[action].hazardsAssigned) {
                        return (Object.keys(actions[action].hazardsAssigned).indexOf(hazard.$key) > -1)
                      }

                      return false;
                    });

                    actions[action].hazards.map(hazard => {
                      this.alertFilterSubject.next(hazard.hazardScenario);

                      this.af.database.list(Constants.APP_STATUS + '/alert/' + this.countryId, this.alertFilter)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(alerts => {
                          hazard.alerts = alerts;
                          alerts.map(alert => {
                            console.log(alert.alertLevel);
                            console.log(ThresholdName.Red);
                            if (alert.alertLevel == ThresholdName.Red)
                              this.changeActionStatus(actions[action]);
                          });

                        });

                      return hazard;
                    });
                  });

                this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userKey)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(_ => {
                    if (_.$exists()) {
                      this.users[userKey] = _.firstName + " " + _.lastName;
                      actions[action].assigned = true;
                    }
                    else {
                      this.users[userKey] = "Unassigned";//TODO translate somehow
                      actions[action].assigned = false;
                    }

                  });

                this.af.database.list(Constants.APP_STATUS + '/note/' + action, {
                  query: {
                    orderByChild: "time"
                  }
                })
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(_ => {
                    actions[action].notesCount = _.length;
                    actions[action].notes = _;
                    actions[action].notes.map(note => {
                      let uploadByUser = note.uploadBy;
                      this.af.database.object(Constants.APP_STATUS + '/userPublic/' + uploadByUser)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(_ => {
                          if (_.$exists()) {
                            note.uploadByUser = _.firstName + " " + _.lastName;
                          }
                          else {
                            note.uploadByUser = "N/A";
                          }
                        });

                      return note;
                    });

                  });

                if (actions[action].level == this.actionLevel) {
                  this.actions.push(actions[action]);
                }
              });
            });
          });
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  protected changeActionStatus(action) {
    let status = ActionStatus.InProgress;
    if (!action.assigned)
      status = ActionStatus.Expired;

    this.af.database.object(Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key)
      .update({
        actionStatus: status
      });
  }


}
