
import {map} from 'rxjs/operators/map';

import {takeUntil} from 'rxjs/operators/takeUntil';
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {NetworkService} from "../../../services/network.service";
import {AgencyService} from "../../../services/agency-service.service";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, OfficeType, Privacy, ResponsePlanSectors, SkillType, UserType} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {SurgeCapacityService} from "../../../services/surge-capacity.service";
import * as moment from "moment";
import {LocalStorageService} from "angular-2-local-storage";
import {SettingsService} from "../../../services/settings.service";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";

declare var jQuery: any;

@Component({
  selector: 'app-local-network-profile-office-capacity',
  templateUrl: './local-network-profile-office-capacity.component.html',
  styleUrls: ['./local-network-profile-office-capacity.component.css'],
  providers: [SurgeCapacityService]
})
export class LocalNetworkProfileOfficeCapacityComponent implements OnInit, OnDestroy {
  officeAgencyMap: Map<string, string>;

  private tSkillsFilter: any = 0;
  private sSkillsFilter: any = 0;
  private officeFilter: any = 0;
  private USER_TYPE = UserType;

  private responseStaffs = new Map<string, any[]>();
  private responseStaffsOrigin = new Map<string, any[]>();
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

  private agencies = [];

  //TODO check user permission to edit
  private canEdit: boolean = true;

  private UserType: number;
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private uid: string;
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

  private countryOfficeCapacity = new Map<string, any[]>();

  private origCountryOfficeCapacity = new Map<string, any[]>();
  private totalStaff = new Map<string, number>();
  private totalResponseStaff = new Map<string, number>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private activeType: string;
  private activeId: string;
  private activeNote: NoteModel;
  private surgeCapacities = new Map<string, any[]>();

  //network country re-use
  @Input() isNetworkCountry: boolean;
  private networkId: string;
  private networkCountryId: string;
  private networkViewValues: {};
  private countryId: string;
  private agencyId: string;
  private isViewingFromExternal: boolean;

  private agencyCountryPrivacyMap = new Map<string, ModelAgencyPrivacy>()
  private Privacy = Privacy;
  private isOpenAgencyMenus: boolean;

  constructor(private pageControl: PageControlService,
              private router: Router,
              private _noteService: NoteService,
              private surgeService: SurgeCapacityService,
              private route: ActivatedRoute,
              private _userService: UserService,
              private _networkService: NetworkService,
              private _agencyService: AgencyService,
              private networkService: NetworkService,
              private storageService: LocalStorageService,
              private settingService: SettingsService,
              private af: AngularFire) {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params['isViewing']) {
          this.isViewing = params['isViewing'];
        }
        if (params['agencyId']) {
          this.agencyId = params['agencyId'];
        }
        if (params['countryId']) {
          this.countryId = params['countryId'];
        }
        if (params['networkId']) {
          this.networkId = params['networkId'];
        }
        if (params['networkCountryId']) {
          this.networkCountryId = params['networkCountryId'];
        }
        if (params['uid']) {
          this.uid = params['uid'];
        }
        if (params['isViewingFromExternal']) {
          this.isViewingFromExternal = params['isViewingFromExternal'];
        }

        this.isNetworkCountry ? this.networkCountryAccess() : this.localNetworkAdminAccess();
      })

  }

  private networkCountryAccess() {

    if (this.isViewing) {

      this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(map => {
          console.log(map);
          this.officeAgencyMap = map;

          map.forEach((value: string, key: string) => {
            this._agencyService.getAgency(key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {
                this.agencies.push(agency)
                this._getSkills();
              })
            //get privacy for country
            this.settingService.getPrivacySettingForCountry(value).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(key, privacy)
              })
          });

          this._getTotalStaff(map);
          this.getStaff(map);
          this.getSurgeCapacity(map);
          this._getCountryOfficeCapacity(map).then();


        });

    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        this.networkService.getSelectedIdObj(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];
            this.networkCountryId = selection["networkCountryId"];

            this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(map => {
                console.log(map);
                this.officeAgencyMap = map;
                if (!map){
                  return;
                }
                map.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency)
                      this._getSkills();
                    })
                  //get privacy for country
                  this.settingService.getPrivacySettingForCountry(value).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(privacy => {
                      this.agencyCountryPrivacyMap.set(key, privacy)
                    })
                });

                this._getTotalStaff(map);
                this.getStaff(map);
                this.getSurgeCapacity(map);
                this._getCountryOfficeCapacity(map).then();

              });
          });
      });
    }

  }

  private localNetworkAdminAccess() {
    if (this.isViewing) {

      this._networkService.getAgencyCountryOfficesByNetwork(this.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(officeAgencyMap => {
          this.officeAgencyMap = officeAgencyMap

          officeAgencyMap.forEach((value: string, key: string) => {
            this._agencyService.getAgency(key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {
                this.agencies.push(agency)
                this._getSkills();
              })
            //get privacy for country
            this.settingService.getPrivacySettingForCountry(value).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(key, privacy)
              })
          })

          this._getTotalStaff(officeAgencyMap);
          this.getStaff(officeAgencyMap);
          this.getSurgeCapacity(officeAgencyMap);
          this._getCountryOfficeCapacity(officeAgencyMap).then(() => {


            console.log(this.agencies)
            officeAgencyMap.forEach((value: string, key: string) => {
              console.log(this.surgeCapacities)
            })
          });
        })

    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;
        this._networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];

            this._networkService.getAgencyCountryOfficesByNetwork(this.networkId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(officeAgencyMap => {
                this.officeAgencyMap = officeAgencyMap

                officeAgencyMap.forEach((value: string, key: string) => {
                  this._agencyService.getAgency(key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency)
                      this._getSkills();
                    })
                  //get privacy for country
                  this.settingService.getPrivacySettingForCountry(value).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(privacy => {
                      this.agencyCountryPrivacyMap.set(key, privacy)
                    })
                })

                this._getTotalStaff(officeAgencyMap);
                this.getStaff(officeAgencyMap);
                this.getSurgeCapacity(officeAgencyMap);
                this._getCountryOfficeCapacity(officeAgencyMap).then(() => {


                  console.log(this.agencies)
                  officeAgencyMap.forEach((value: string, key: string) => {
                    console.log(this.surgeCapacities)
                  })
                });

              })
          });

      })
    }

  }

  private getSurgeCapacity(officeAgencyMap) {
    officeAgencyMap.forEach((value: string, key: string) => {
      this.surgeService.getSuregeCapacity(value)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(surgeCapacities => {
          this.surgeCapacities.set(key, surgeCapacities);
          this.surgeCapacities.get(key).forEach(surge => {
            console.log(surge.sectors[0])
            surge.updatedAt = this.convertToLocal(surge.updatedAt);
            this.handleSectorImgPath(surge, surge.sectors[0]);
            surge["notes"] = this.handleNotes(surge);
            // Create the new note model
            this.newNote[surge.$key] = new NoteModel();
            this.newNote[surge.$key].uploadedBy = this.uid;
            console.log(this.surgeCapacities)
          });
        });
    })

    console.log(this.surgeCapacities)
  }

  private handleNotes(surge: any) {
    let notes = [];
    if (surge.notes) {
      notes = Object.keys(surge.notes).map(key => {
        let note = new NoteModel();
        let tempNote = surge.notes[key];
        note.id = key;
        note.mapFromObject(tempNote);
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

  //
  // ngAfterViewInit() {
  //   this.initPopover();
  // }
  //
  //
  // initPopover() {
  //   jQuery(function () {
  //     jQuery('[data-toggle="popover"]').popover({placement: "bottom"});
  //     console.log(jQuery('[data-toggle="popover"]').length);
  //   });
  // }
  //
  //
  getStaff(officeAgencyMap) {
    officeAgencyMap.forEach((value: string, key: string) => {
      this._userService.getStaffList(value).pipe(
        map(staffs => {
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
        }))
        .subscribe(responseStaffs => {
          this.totalResponseStaff.set(key, responseStaffs.length)
          this.responseStaffs.set(key, responseStaffs)
          this.responseStaffsOrigin.set(key, responseStaffs)

          this.responseStaffs.get(key).forEach(staff => {

            this.skillTechMap.set(staff.id, []);
            this.skillSupoMap.set(staff.id, []);
            this.staffNoteMap.set(staff.id, []);

            //get staff name
            this._userService.getUser(staff.id).pipe(
              takeUntil(this.ngUnsubscribe))
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
    })
  }

  _getTotalStaff(officeAgencyMap) {
    officeAgencyMap.forEach((value: string, key: string) => {
      console.log(Constants.APP_STATUS + '/countryOffice/' + key + '/' + value)
      let promise = new Promise((res, rej) => {
        this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + key + '/' + value)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((countryOffice: any) => {
            this.totalStaff.set(key, countryOffice.totalStaff ? countryOffice.totalStaff : 0)
            res(true);
          });
      });
      return promise;
    })
  }

  _getCountryOfficeCapacity(officeAgencyMap) {
    let promise = new Promise((res, rej) => {
      officeAgencyMap.forEach((value: string, key: string) => {
        this.af.database.object(Constants.APP_STATUS + '/staff/' + value)
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

            this.countryOfficeCapacity.set(key, this._convertObjectToArray(CountryOfficeStaff))
            this.origCountryOfficeCapacity = this.countryOfficeCapacity;
            res(true);
          });
      });
    });
    return promise;
  }

  filterDataAll(event: any, filterType: any) {
    var filterVal = event.target.value;
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
    this.openAgencyMenus();
  }

  /** Opening agency menus when a filter selected*/
  openAgencyMenus() {
    if (!this.agencies || this.isOpenAgencyMenus){
      return;
    }

    this.isOpenAgencyMenus = true;

    this.agencies.forEach(function (value, index){
      console.log('#header_section_'+index);
      jQuery('#header_section_'+index).trigger('click');
    });
  }

  //
  _getUserName(userID: string) {
    return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userID);
  }

  //
  _getSkill(skillID: string) {
    return this.af.database.object(Constants.APP_STATUS + '/skill/' + skillID);
  }

  //
  _getSkills() {
    this.agencies.forEach(agency => {
      this._agencyService.getSkillsForAgency(agency.$key)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(skill => {
          console.log(skill)
          if (skill.type == SkillType.Support && !this.suportedSkills.map(item => item.$key).includes(skill.$key)) {
            this.suportedSkills.push(skill);
          } else if (skill.type == SkillType.Tech && !this.techSkills.map(item => item.$key).includes(skill.$key)) {
            this.techSkills.push(skill);
          }
        })
    })
  }

  //
  _convertObjectToArray(obj: any) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return arr;
  }

  //
  getNotesNumber(staff): number {
    return staff.notes ? Object.keys(staff.notes).length : 0;
  }

  //
  getUserName(userId) {
    let userName = "";

    if (!userId) return userName;

    this._userService.getUser(userId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      userName = user.firstName + ' ' + user.lastName;
    });

    return userName;
  }

  //
  addNote(type: string, id: string, note: NoteModel, agency) {
    if (this.validateNote(note)) {
      let node = "";

      if (type == 'staff') {
        node = Constants.STAFF_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{staffId}', id);
      } else {
        node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', id);
      }

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

  deleteNote(type: string, id: string, note: NoteModel, agency) {
    jQuery('#delete-action-' + agency.$key).modal('show');
    this.activeType = type;
    this.activeId = id;
    this.activeNote = note;
  }

  deleteAction(type: string, id: string, note: NoteModel, agency) {
    this.closeDeleteModal(agency);

    let node = '';

    if (type == 'staff') {
      node = Constants.STAFF_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{staffId}', id);
    } else {
      node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', id);
    }

    this._noteService.deleteNote(node, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  editNote(type: string, id: string, note: NoteModel, agency) {
    jQuery('#edit-action-' + agency.$key).modal('show');
    this.activeId = id;
    this.activeNote = note;
    this.activeType = type;
  }

  editAction(type: string, id: string, note: NoteModel, agency) {
    this.closeEditModal(agency);
    console.log(agency)

    if (this.validateNote(note)) {
      let node = "";

      if (type == 'staff') {
        node = Constants.STAFF_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{staffId}', id);
      } else {
        node = Constants.SURGE_CAPACITY_NODE.replace('{countryId}', this.officeAgencyMap.get(agency.$key)).replace('{id}', id);
      }

      this._noteService.saveNote(node, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  closeDeleteModal(agency) {
    jQuery('#delete-action-' + agency.$key).modal('hide');
  }

  closeEditModal(agency) {
    jQuery('#edit-action-' + agency.$key).modal('hide');
  }

  convertToLocal(timestamp): number {
    return (moment().utcOffset() * 60 * 1000 + timestamp);
  }

  //
  getSurgeNotesNumber(surge): number {
    return surge.notes ? Object.keys(surge.notes).length : 0;
  }

}
