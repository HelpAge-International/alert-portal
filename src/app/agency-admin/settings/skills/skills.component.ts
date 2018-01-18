import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {SkillType} from "../../../utils/Enums";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import Promise = firebase.Promise;

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {

  private uid: string = "";
  private agencyId: string;
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

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;

      this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/skills')
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
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + '/skills/' + item).remove();
      this.af.database.object(Constants.APP_STATUS + '/skill/' + item)
        .remove()
        .then(_ => {
          if (!this.alertShow) {
            this.alertSuccess = true;
            this.alertShow = true;
            this.alertMessage = "AGENCY_ADMIN.SETTINGS.SKILLS.SKILLS_REMOVED";
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
            this.alertMessage = "AGENCY_ADMIN.SETTINGS.SKILLS.SKILLS_SAVED";
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
      let agencySkills = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + '/skills/' + key)
        .set(true)
        .then(_ => {
          if (!this.alertShow) {
            this.alertSuccess = true;
            this.alertShow = true;
            this.alertMessage = "AGENCY_ADMIN.SETTINGS.SKILLS.SKILL_NEW";
          }
        })
        .catch(err => console.log(err, 'You do not have access!'));
    });

    this.skillName = [];
  }
}
