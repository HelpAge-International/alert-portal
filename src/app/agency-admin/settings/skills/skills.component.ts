import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import Promise = firebase.Promise;
import {SkillType} from "../../../utils/Enums";
import {Subject} from "rxjs";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {

  private uid: string = "";
  private skillsObservable: FirebaseListObservable<any>;
  private deleting: boolean = false;
  private editing: boolean = false;
  private skillName: string[] = [];
  private deleteCandidates: any = {};
  private skills: any = {};
  private skillKeys: string[] = [];
  private editedSkills: any = [];
  private SupportSkill = SkillType.Support;
  private TechSkill = SkillType.Tech;

  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.af.database.list(Constants.APP_STATUS + '/agency/' + this.uid + '/skills')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(_ => {
            _.filter(skill => skill.$value).map(skill => {
              this.af.database.list(Constants.APP_STATUS + '/skill/', {
                query: {
                  orderByKey: true,
                  equalTo: skill.$key
                }
              })
                .takeUntil(this.ngUnsubscribe)
                .subscribe(_skill => {
                  if (_skill[0] != undefined)
                    this.skills[_skill[0].$key] = _skill[0];
                  else
                    delete this.skills[skill.$key];

                  this.skillKeys = Object.keys(this.skills);
                });
            });
          });

      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } catch (e) {
      console.log('Unable to releaseAll');
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  deleteSkills(event) {
    this.deleting = !this.deleting;
  }

  cancelDeleteSkills(event) {
    this.deleting = !this.deleting;
    this.deleteCandidates = {};
  }

  deleteSelectedSkills(event) {
    this.deleting = !this.deleting;
    for (let item in this.deleteCandidates) {
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/skills/' + item).remove();
      this.af.database.object(Constants.APP_STATUS + '/skill/' + item)
        .remove()
        .then(_ => {
          if (!this.alertShow) {
            this.alertSuccess = true;
            this.alertShow = true;
            this.alertMessage = "Skills succesfully removed!"
          }
        })
        .catch(err => console.log(err, 'You do not have access!'));
    }
  }

  onSkillSelected(skill) {
    if (skill in this.deleteCandidates)
      delete this.deleteCandidates[skill];
    else
      this.deleteCandidates[skill] = true;
  }

  editSkills(event) {
    this.editing = !this.editing;
  }

  cancelEditSkills(event) {
    this.editing = !this.editing;
    this.editedSkills = [];
    this.deleteCandidates = {};
  }

  saveEditedSkills(event) {
    this.editing = !this.editing;

    for (let skill in this.editedSkills)
      this.af.database.object(Constants.APP_STATUS + '/skill/' + skill)
        .update(this.editedSkills[skill])
        .then(_ => {
          if (!this.alertShow) {
            this.alertSuccess = true;
            this.alertShow = true;
            this.alertMessage = "Skills succesfully saved!"
          }
        })
        .catch(err => console.log(err, 'You do not have access!'));
  }

  setSkillValue(prop, value) {
    this.editedSkills[prop] = {name: value};
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  addSkill(event, type) {
    let skill = {name: this.skillName[type], type: type};

    this.af.database.list(Constants.APP_STATUS + '/skill/').push(
      skill
    ).then((item) => {
      let key = item.key;
      let agencySkills = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/skills/' + key)
        .set(true)
        .then(_ => {
          if (!this.alertShow) {
            this.alertSuccess = true;
            this.alertShow = true;
            this.alertMessage = "Skill succesfully added!"
          }
        })
        .catch(err => console.log(err, 'You do not have access!'));
    });

    this.skillName = [];
  }
}
