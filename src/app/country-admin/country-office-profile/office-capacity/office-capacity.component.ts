import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, OfficeType, ResponsePlanSectors, SkillType, UserType} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {SurgeCapacityService} from "../../../services/surge-capacity.service";
import {AgencyService} from "../../../services/agency-service.service";
import * as moment from "moment";

declare var jQuery: any;

@Component({
  selector: 'app-country-office-capacity',
  templateUrl: './office-capacity.component.html',
  styleUrls: ['./office-capacity.component.css'],
  providers: [SurgeCapacityService]
})

export class CountryOfficeCapacityComponent implements OnInit, OnDestroy {
  private tSkillsFilter: any = 0;
  private sSkillsFilter: any = 0;
  private officeFilter: any = 0;
  private USER_TYPE = UserType;

  private responseStaffs: any[];
  private responseStaffsOrigin: any[];
  private isViewing: boolean;
  private userMap = new Map<string, string>();
  private skillTechMap = new Map<string, string[]>();
  private skillSupoMap = new Map<string, string[]>();
  private staffNoteMap = new Map<string, any[]>();
  private newNote: NoteModel[] = [];
  private ArrivalTimeType = ["hours", "days", "weeks", "months", "years"];
  private ResponseSectors = ResponsePlanSectors;
  private sectorImgPathMap = new Map<number, string>();
  private isEditingCapacity: boolean;

  //TODO check user permission to edit
  private canEdit: boolean = true;

  private UserType: number;
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private uid: string;
  private countryID: string;
  private agencyID: string;
  private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
  private ResponsePlanSectorsList: number[] = [
    ResponsePlanSectors.wash,
    ResponsePlanSectors.health,
    ResponsePlanSectors.shelter,
    ResponsePlanSectors.nutrition,
    ResponsePlanSectors.foodSecurityAndLivelihoods,
    ResponsePlanSectors.protection,
    ResponsePlanSectors.education,
    ResponsePlanSectors.campmanagement,
    ResponsePlanSectors.other
  ];

  private skillTypeList: number[] = [SkillType.Support, SkillType.Tech];
  private skillType = Constants.SKILL_TYPE;
  private officeTypeList: number[] = [OfficeType.All, OfficeType.FieldOffice, OfficeType.MainOffice];
  private officeType = Constants.OFFICE_TYPE;

  private suportedSkills: any[] = [];
  private techSkills: any[] = [];

  private filter: any[] = [];

  private countryOfficeCapacity: any[] = [];
  private origCountryOfficeCapacity: any[] = [];
  private totalStaff: number;
  private totalResponseStaff: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private activeType: string;
  private activeId: string;
  private activeNote: NoteModel;
  private surgeCapacities = [];

  public countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();
  private userAgencyId: string;

  @Input() isLocalAgency: boolean;

  @Input() isAgencyAdmin: boolean;

  constructor(private pageControl: PageControlService,
              private router: Router,
              private _noteService: NoteService,
              private surgeService: SurgeCapacityService,
              private route: ActivatedRoute,
              private _userService: UserService,
              private _agencyService: AgencyService,
              private af: AngularFire) {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    console.log(this.isLocalAgency)
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()
  }

  private initLocalAgency() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyID = params["agencyId"];
        }
        if (params["countryId"]) {
          this.countryID = params["countryId"];
        }

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.UserType = userType;
          this.userAgencyId = agencyId;
          if (this.agencyID && this.countryID) {
            this._getTotalStaff();
            this.getStaff();
            this.getSurgeCapacity();
            this._getCountryOfficeCapacity();
            PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
              this.countryPermissionsMatrix = isEnabled;
            }));
          } else {
            this.agencyID = agencyId;
            this._getTotalStaffLocalAgency();
            this.getStaffLocalAgency();
            this.getSurgeCapacityLocalAgency();
            this._getCountryOfficeCapacityLocalAgency()
          }
          this._getSkills();

        });

      })

  }

  private initCountryOffice() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryID = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyID = params["agencyId"];
        }

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.UserType = userType;
          this.userAgencyId = agencyId;

          if (this.agencyID && this.countryID) {
            this._getTotalStaff();
            this.getStaff();
            this.getSurgeCapacity();
            this._getCountryOfficeCapacity();
          } else {
            this.agencyID = agencyId;
            this.countryID = countryId;
            this._getTotalStaff();
            this.getStaff();
            this.getSurgeCapacity();
            this._getCountryOfficeCapacity();
          }

          this._getSkills();

          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
            this.countryPermissionsMatrix = isEnabled;
          }));
        });


      });
  }

  private getSurgeCapacity() {
    this.surgeService.getSuregeCapacity(this.countryID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(surgeCapacities => {
        this.surgeCapacities = surgeCapacities;
        this.surgeCapacities.forEach(surge => {
          surge.updatedAt = this.convertToLocal(surge.updatedAt);
          this.handleSectorImgPath(surge, surge.sectors[0]);
          surge["notes"] = this.handleNotes(surge);
          // Create the new note model
          this.newNote[surge.$key] = new NoteModel();
          this.newNote[surge.$key].uploadedBy = this.uid;
        });
      });
  }

  private getSurgeCapacityLocalAgency() {
    this.surgeService.getSuregeCapacity(this.agencyID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(surgeCapacities => {
        this.surgeCapacities = surgeCapacities;
        this.surgeCapacities.forEach(surge => {
          surge.updatedAt = this.convertToLocal(surge.updatedAt);
          this.handleSectorImgPath(surge, surge.sectors[0]);
          surge["notes"] = this.handleNotes(surge);
          // Create the new note model
          this.newNote[surge.$key] = new NoteModel();
          this.newNote[surge.$key].uploadedBy = this.uid;
        });
      });
  }

  private handleNotes(surge: any) {
    let notes = [];
    if (surge.notes) {
      notes = Object.keys(surge.notes).map(key => {
        let note = new NoteModel();
        let tempNote = surge.notes[key];
        note.id = key;
        note.mapFromObject(tempNote);
        if (this.agencyID && (note.agencyId && note.agencyId != this.agencyID) || !this.agencyID && (note.agencyId != this.userAgencyId)) {
          this._agencyService.getAgency(note.agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agency => {
              note.agencyName = agency.name;
            })
        } else {
          note.agencyName = null;
        }
        return note;
      })
    }
    return notes;
  }

  private handleSectorImgPath(surge, sector) {
    switch (sector) {
      case ResponsePlanSectors.wash:
        this.sectorImgPathMap.set(surge.$key, "water.svg");
        break;
      case ResponsePlanSectors.health:
        this.sectorImgPathMap.set(surge.$key, "health.svg");
        break;
      case ResponsePlanSectors.shelter:
        this.sectorImgPathMap.set(surge.$key, "shelter.svg");
        break;
      case ResponsePlanSectors.nutrition:
        this.sectorImgPathMap.set(surge.$key, "nutrition.svg");
        break;
      case ResponsePlanSectors.foodSecurityAndLivelihoods:
        this.sectorImgPathMap.set(surge.$key, "food.svg");
        break;
      case ResponsePlanSectors.protection:
        this.sectorImgPathMap.set(surge.$key, "protection.svg");
        break;
      case ResponsePlanSectors.education:
        this.sectorImgPathMap.set(surge.$key, "education.svg");
        break;
      case ResponsePlanSectors.campmanagement:
        this.sectorImgPathMap.set(surge.$key, "campmanagement.svg");
        break;
    }
  }

  ngAfterViewInit() {
    this.initPopover();
  }


  initPopover() {
    jQuery(function () {
      jQuery('[data-toggle="popover"]').popover({placement: "bottom"});
      console.log(jQuery('[data-toggle="popover"]').length);
    });
  }


  getStaff() {
    this._userService.getStaffList(this.countryID)
      .map(staffs => {
        let responseStaffs = [];
        staffs.forEach(staff => {
          if (staff.isResponseMember) {
            responseStaffs.push(staff);
          }
          // Create the new note model
          this.newNote[staff.id] = new NoteModel();
          this.newNote[staff.id].uploadedBy = this.uid;
        });
        return responseStaffs;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(responseStaffs => {
        this.totalResponseStaff = responseStaffs.length;
        this.responseStaffs = responseStaffs;
        this.responseStaffsOrigin = responseStaffs;

        this.responseStaffs.forEach(staff => {

          this.skillTechMap.set(staff.id, []);
          this.skillSupoMap.set(staff.id, []);
          this.staffNoteMap.set(staff.id, []);

          //get staff name
          this._userService.getUser(staff.id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              this.userMap.set(user.id, user.firstName + " " + user.lastName);
            });

          //get staff skills
          staff.skill.forEach(skill => {
            this.af.database.object(Constants.APP_STATUS + "/skill/" + skill)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(skill => {
                if (skill.type == SkillType.Tech) {
                  this.skillTechMap.get(staff.id).push(skill.name);
                } else if (skill.type == SkillType.Support) {
                  this.skillSupoMap.get(staff.id).push(skill.name);
                }
              });
          });

          //get staff notes
          if (staff.notes) {
            let notes = Object.keys(staff.notes).map(key => {
              let note = new NoteModel();
              note.id = key;
              note.content = staff.notes[key]["content"];
              note.time = staff.notes[key]["time"];
              note.uploadedBy = staff.notes[key]["uploadedBy"];
              return note;
            });
            this.staffNoteMap.set(staff.id, notes);
          }
        });

        //handle filter
      });
  }

  getStaffLocalAgency() {
    this._userService.getStaffList(this.agencyID)
      .map(staffs => {
        let responseStaffs = [];
        staffs.forEach(staff => {
          if (staff.isResponseMember) {
            responseStaffs.push(staff);
          }
          // Create the new note model
          this.newNote[staff.id] = new NoteModel();
          this.newNote[staff.id].uploadedBy = this.uid;
        });
        return responseStaffs;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(responseStaffs => {
        this.totalResponseStaff = responseStaffs.length;
        this.responseStaffs = responseStaffs;
        this.responseStaffsOrigin = responseStaffs;

        this.responseStaffs.forEach(staff => {

          this.skillTechMap.set(staff.id, []);
          this.skillSupoMap.set(staff.id, []);
          this.staffNoteMap.set(staff.id, []);

          //get staff name
          this._userService.getUser(staff.id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              this.userMap.set(user.id, user.firstName + " " + user.lastName);
            });

          //get staff skills
          staff.skill.forEach(skill => {
            this.af.database.object(Constants.APP_STATUS + "/skill/" + skill)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(skill => {
                if (skill.type == SkillType.Tech) {
                  this.skillTechMap.get(staff.id).push(skill.name);
                } else if (skill.type == SkillType.Support) {
                  this.skillSupoMap.get(staff.id).push(skill.name);
                }
              });
          });

          //get staff notes
          if (staff.notes) {
            let notes = Object.keys(staff.notes).map(key => {
              let note = new NoteModel();
              note.id = key;
              note.content = staff.notes[key]["content"];
              note.time = staff.notes[key]["time"];
              note.uploadedBy = staff.notes[key]["uploadedBy"];
              return note;
            });
            this.staffNoteMap.set(staff.id, notes);
          }
        });
        //handle filter
      });
  }

  _getTotalStaff() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyID + '/' + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryOffice: any) => {
          this.totalStaff = countryOffice.totalStaff ? countryOffice.totalStaff : 0;
          res(true);
        });
    });
    return promise;
  }

  _getTotalStaffLocalAgency() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agency: any) => {
          this.totalStaff = agency.totalStaff ? agency.totalStaff : 0;
          res(true);
        });
    });
    return promise;
  }


  _getCountryOfficeCapacity() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + '/staff/' + this.countryID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((CountryOfficeStaff: any) => {
          for (let staff in CountryOfficeStaff) {
            if (staff.indexOf("$") < 0) {
              CountryOfficeStaff[staff].skills = [];
              CountryOfficeStaff[staff].skills.support = [];
              CountryOfficeStaff[staff].skills.tech = [];
              CountryOfficeStaff[staff].key = staff;
              /* getUser FullName */
              this._getUserName(staff).takeUntil(this.ngUnsubscribe)
                .subscribe((user: any) => {
                  CountryOfficeStaff[staff].name = user.firstName + ' ' + user.lastName;
                });
              /* get skills */
              var skills = CountryOfficeStaff[staff].skill;
              if (skills) {
                skills.forEach((skillID, key) => {
                  this._getSkill(skillID).takeUntil(this.ngUnsubscribe)
                    .subscribe((skill: any) => {
                      if (!skill.type) {
                        CountryOfficeStaff[staff].skills.support.push(skill.name);
                      } else {
                        CountryOfficeStaff[staff].skills.tech.push(skill.name);
                      }
                    });
                });
              }
            }
          }

          this.countryOfficeCapacity = this._convertObjectToArray(CountryOfficeStaff);
          this.origCountryOfficeCapacity = this.countryOfficeCapacity;
          res(true);
        });
    });
    return promise;
  }

  _getCountryOfficeCapacityLocalAgency() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + '/staff/' + this.agencyID)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((CountryOfficeStaff: any) => {
          for (let staff in CountryOfficeStaff) {
            if (staff.indexOf("$") < 0) {
              CountryOfficeStaff[staff].skills = [];
              CountryOfficeStaff[staff].skills.support = [];
              CountryOfficeStaff[staff].skills.tech = [];
              CountryOfficeStaff[staff].key = staff;
              /* getUser FullName */
              this._getUserName(staff).takeUntil(this.ngUnsubscribe)
                .subscribe((user: any) => {
                  CountryOfficeStaff[staff].name = user.firstName + ' ' + user.lastName;
                });
              /* get skills */
              var skills = CountryOfficeStaff[staff].skill;
              if (skills) {
                skills.forEach((skillID, key) => {
                  this._getSkill(skillID).takeUntil(this.ngUnsubscribe)
                    .subscribe((skill: any) => {
                      if (!skill.type) {
                        CountryOfficeStaff[staff].skills.support.push(skill.name);
                      } else {
                        CountryOfficeStaff[staff].skills.tech.push(skill.name);
                      }
                    });
                });
              }
            }
          }

          this.countryOfficeCapacity = this._convertObjectToArray(CountryOfficeStaff);
          this.origCountryOfficeCapacity = this.countryOfficeCapacity;
          res(true);
        });
    });
    return promise;
  }


  filterData(event: any, filterType: any) {
    var filterVal = event.target.value;

    // this.officeFilter = filterType == 'office' ? filterVal : 0;
    // this.sSkillsFilter = filterType == 'sSkills' ? filterVal : 0;
    // this.tSkillsFilter = filterType == 'tSkills' ? filterVal : 0;
    switch (filterType) {
      case "office":
        this.officeFilter = filterVal;
        break;
      case "sSkills":
        this.sSkillsFilter = filterVal;
        break;
      case "tSkills":
        this.tSkillsFilter = filterVal;
        break;
    }

    var result = [];

    this.responseStaffsOrigin.forEach(staff => {

      var isSkillsFilter = false;
      var iStSkillsFilter = false;

      staff.skill.forEach((val, key) => {
        if (this.sSkillsFilter == val) {
          isSkillsFilter = true;
        }
        if (this.tSkillsFilter == val) {
          iStSkillsFilter = true;
        }
      });
      // if (
      //   (this.officeFilter == staff.officeType || this.officeFilter == 0) &&
      //   (isSkillsFilter || this.sSkillsFilter == 0) &&
      //   (iStSkillsFilter || this.tSkillsFilter == 0)
      // ) {
      //   result.push(staff);
      // }
      if (this.officeFilter == 0 && this.sSkillsFilter == 0 && this.tSkillsFilter == 0) {
        result = this.responseStaffsOrigin;
      } else if (this.officeFilter == staff.officeType && this.sSkillsFilter == 0 && this.tSkillsFilter == 0) {
        result.push(staff);
      } else if (this.officeFilter == 0 && isSkillsFilter && this.tSkillsFilter == 0) {
        result.push(staff);
      } else if (this.officeFilter == 0 && this.sSkillsFilter == 0 && iStSkillsFilter) {
        result.push(staff);
      } else if (this.officeFilter == staff.officeType && isSkillsFilter && this.tSkillsFilter == 0) {
        result.push(staff);
      } else if (this.officeFilter == 0 && isSkillsFilter && iStSkillsFilter) {
        result.push(staff);
      } else if (this.officeFilter == staff.officeType && this.sSkillsFilter == 0 && iStSkillsFilter) {
        result.push(staff);
      } else if (this.officeFilter == staff.officeType && isSkillsFilter && iStSkillsFilter) {
        result.push(staff);
      }
    });

    this.responseStaffs = result;

  }

  _getUserName(userID: string) {
    return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userID);
  }

  _getSkill(skillID: string) {
    return this.af.database.object(Constants.APP_STATUS + '/skill/' + skillID);
  }

  _getSkills() {
    this._agencyService.getSkillsForAgency(this.agencyID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(skill => {
        if (skill.type == SkillType.Support && !this.suportedSkills.map(item => item.$key).includes(skill.$key)) {
          this.suportedSkills.push(skill);
        } else if (skill.type == SkillType.Tech && !this.techSkills.map(item => item.$key).includes(skill.$key)) {
          this.techSkills.push(skill);
        }
      })
    // this.af.database.object(Constants.APP_STATUS + '/skill/').takeUntil(this.ngUnsubscribe)
    //   .subscribe((skills: any) => {
    //     for (let skill in skills) {
    //       if (skill.indexOf("$") < 0) {
    //         var objSkill = {key: skill, name: skills[skill].name};
    //         if (!skills[skill].type) {
    //           this.suportedSkills.push(objSkill);
    //         } else {
    //           this.techSkills.push(objSkill);
    //         }
    //       }
    //     }
    //   });
  }


  _convertObjectToArray(obj: any) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return arr;
  }

  getNotesNumber(staff): number {
    return staff.notes ? Object.keys(staff.notes).length : 0;
  }

  getUserName(userId) {
    let userName = "";

    if (!userId) return userName;

    this._userService.getUser(userId).takeUntil(this.ngUnsubscribe).subscribe(user => {
      userName = user.firstName + ' ' + user.lastName;
    });

    return userName;
  }

  addNote(type: string, id: string, note: NoteModel) {
    if (this.validateNote(note)) {
      let node = "";

      if (this.isLocalAgency) {
        if (type == 'staff') {
          node = Constants.STAFF_NODE.replace('{countryId}', this.agencyID).replace('{staffId}', id);
        } else {
          node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.agencyID).replace('{id}', id);
        }
      } else {
        if (type == 'staff') {
          node = Constants.STAFF_NODE.replace('{countryId}', this.countryID).replace('{staffId}', id);
        } else {
          node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.countryID).replace('{id}', id);
        }
      }

      note.agencyId = this.userAgencyId

      this._noteService.saveNote(node, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }

  deleteNote(type: string, id: string, note: NoteModel) {
    jQuery('#delete-action').modal('show');
    this.activeType = type;
    this.activeId = id;
    this.activeNote = note;
  }

  deleteAction(type: string, id: string, note: NoteModel) {
    this.closeDeleteModal();

    let node = '';

    if (this.isLocalAgency) {
      if (type == 'staff') {
        node = Constants.STAFF_NODE.replace('{countryId}', this.agencyID).replace('{staffId}', id);
      } else {
        node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.agencyID).replace('{id}', id);
      }
    } else {
      if (type == 'staff') {
        node = Constants.STAFF_NODE.replace('{countryId}', this.countryID).replace('{staffId}', id);
      } else {
        node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.countryID).replace('{id}', id);
      }
    }

    this._noteService.deleteNote(node, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  editNote(type: string, id: string, note: NoteModel) {
    jQuery('#edit-action').modal('show');
    this.activeId = id;
    this.activeNote = note;
    this.activeType = type;
  }

  editAction(type: string, id: string, note: NoteModel) {
    this.closeEditModal();

    if (this.validateNote(note)) {
      let node = "";

      if (type == 'staff') {
        node = Constants.STAFF_NODE.replace('{countryId}', this.countryID).replace('{staffId}', id);
      } else {
        node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.countryID).replace('{id}', id);
      }

      this._noteService.saveNote(node, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  closeDeleteModal() {
    jQuery('#delete-action').modal('hide');
  }

  closeEditModal() {
    jQuery('#edit-action').modal('hide');
  }

  addEditSurgeCapacity(id?: string) {
    if (this.isLocalAgency) {
      if (id) {
        this.router.navigate(['/local-agency/profile/office-capacity/add-edit-surge-capacity', {id: id}], {skipLocationChange: true});
      } else {
        this.router.navigateByUrl('/local-agency/profile/office-capacity/add-edit-surge-capacity');
      }
    } else {
      if (id) {
        this.router.navigate(['/country-admin/country-office-profile/office-capacity/add-edit-surge-capacity', {id: id}], {skipLocationChange: true});
      } else {
        this.router.navigateByUrl('/country-admin/country-office-profile/office-capacity/add-edit-surge-capacity');
      }
    }
  }

  convertToLocal(timestamp): number {
    return (moment().utcOffset() * 60 * 1000 + timestamp);
  }

  getSurgeNotesNumber(surge): number {
    return surge.notes ? Object.keys(surge.notes).length : 0;
  }

  editViewCapacity() {
    this.isEditingCapacity = !this.isEditingCapacity;
  }

  editTotalStaff() {
    console.log(this.totalStaff);
    jQuery("#edit-total-staff").modal("hide");
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyID + "/" + this.countryID + "/totalStaff").set(this.totalStaff);
  }

  editSurgeCapacity(id) {
    if (this.isLocalAgency) {
      this.router.navigate(["/local-agency/profile/office-capacity/add-edit-surge-capacity", {"id": id}]);
    } else {
      this.router.navigate(["/country-admin/country-office-profile/office-capacity/add-edit-surge-capacity", {"id": id}]);
    }
  }

}
