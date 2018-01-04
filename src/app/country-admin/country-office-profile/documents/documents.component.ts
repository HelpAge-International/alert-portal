import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Countries, DocumentType, SizeType, UserType} from "../../../utils/Enums";
import {Subject} from "rxjs";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {UserService} from "../../../services/user.service";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})

export class CountryOfficeDocumentsComponent implements OnInit, OnDestroy {
  private userType: UserType;
  DOCUMENT_TYPE = Constants.DOCUMENT_TYPE;
  COUNTRIES = Constants.COUNTRIES;
  private CountriesEnum = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];
  private DocTypeEnum = Object.keys(DocumentType).map(k => DocumentType[k]).filter(v => typeof v === "string") as string[];
  private uid: string;
  private agencyId: string;
  private countryId: string;
  private isViewing: boolean;
  private locationId: string;

  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private countries: any[] = [];
  private users: any[] = [];

  private countrySelected = "-1";
  private docTypeSelected = "-1";
  private userSelected = "-1";

  private countriesFilterSubject: Subject<any>;
  private countriesFilter: any = {};

  private agenciesFilterSubject: Subject<any>;
  private agenciesFilter: any = {};

  private docFilterSubject: Subject<any>;
  private docFilter: any = {};

  private exportDocs: any[] = [];
  private docsCount = 0;
  private docsSize = 0;
  private firebase;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  @Input() isLocalAgency: boolean;


  constructor(private pageControl: PageControlService,
              private _userService: UserService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router) {

    this.docFilterSubject = new BehaviorSubject(undefined);
    this.docFilter = {
      query: {
        orderByChild: "module",
        equalTo: this.docFilterSubject
      }
    };

    this.countriesFilterSubject = new BehaviorSubject(undefined);
    this.countriesFilter = {
      query: {
        orderByChild: "location",
        equalTo: this.countriesFilterSubject
      }
    }

    this.agenciesFilterSubject = new BehaviorSubject(undefined);
    this.agenciesFilter = {
      query: {
        orderByChild: "country",
        equalTo: this.agenciesFilterSubject
      }
    }
  }


  ngOnInit() {

    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()

  }

  private initLocalAgency(){

        this.docFilterSubject.next();

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userType = userType;
          this.agencyId = agencyId;

            this.af.database.list(Constants.APP_STATUS + '/agency/', this.agenciesFilter)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countries => {
                this.countries = [];
                Object.keys(countries).map(country => {

                  let key = countries[country].$key;
                  if (key == this.agencyId) {
                    this.locationId = countries[country].country;
                    this.countries.push(countries[country])
                    //this.countriesFilterSubject.next(Countries[this.locationId]);


                  this.af.database.list(Constants.APP_STATUS + '/document/' + key, this.docFilter)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(_ => {
                      let docs = _;
                      docs = docs.filter(doc => {
                        if (this.userSelected == "-1")
                          return true;

                        return doc.uploadedBy == this.userSelected;
                      });
                      Object.keys(docs).map(doc => {
                        let uploadedBy = docs[doc].uploadedBy;
                        this.af.database.object(Constants.APP_STATUS + '/userPublic/' + uploadedBy)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe(_ => {
                            docs[doc]['uploadedBy'] = _.firstName + " " + _.lastName;
                          });
                      });
                      console.log(this.countries)
                      console.log(this.countries[countries[country]])
                      this.countries[0]['docs'] = docs;
                      this.countries[0]['docsfiltered'] = docs;
                      this.countries[0]['hasDocs'] = (docs.length > 0);
                    });
                  }
                });
              });

            this.af.database.list(Constants.APP_STATUS + '/group/agency/' + this.agencyId + '/agencyallusersgroup')
              .takeUntil(this.ngUnsubscribe)
              .subscribe(_ => {
                let users = _;
                Object.keys(users).map(user => {
                  let userKey = users[user].$key;
                  this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userKey)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(_ => {
                      this.users[user] = {key: userKey, fullName: _.firstName + " " + _.lastName};
                    });
                });
              })
        });
  }

  private initCountryOffice(){
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }

        this.docFilterSubject.next();

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userType = userType;

          if (this.agencyId && this.countryId && this.isViewing) {

            this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyId, this.countriesFilter)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(_ => {
                this.countries = _;
                Object.keys(this.countries).map(country => {
                  let key = this.countries[country].$key;

                  if (key == this.countryId) {
                    this.locationId = this.countries[country].location;
                    //this.countriesFilterSubject.next(Countries[this.locationId]);
                  }

                  this.af.database.list(Constants.APP_STATUS + '/document/' + key, this.docFilter)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(_ => {
                      let docs = _;
                      docs = docs.filter(doc => {
                        if (this.userSelected == "-1")
                          return true;

                        return doc.uploadedBy == this.userSelected;
                      });
                      Object.keys(docs).map(doc => {
                        let uploadedBy = docs[doc].uploadedBy;
                        this.af.database.object(Constants.APP_STATUS + '/userPublic/' + uploadedBy)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe(_ => {
                            docs[doc]['uploadedBy'] = _.firstName + " " + _.lastName;
                          });
                      });
                      this.countries[country]['docs'] = docs;
                      this.countries[country]['docsfiltered'] = docs;
                      this.countries[country]['hasDocs'] = (docs.length > 0);
                    });
                });
              });

            this.af.database.list(Constants.APP_STATUS + '/group/agency/' + this.agencyId + '/agencyallusersgroup')
              .takeUntil(this.ngUnsubscribe)
              .subscribe(_ => {
                let users = _;
                Object.keys(users).map(user => {
                  let userKey = users[user].$key;
                  this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userKey)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(_ => {
                      this.users[user] = {key: userKey, fullName: _.firstName + " " + _.lastName};
                    });
                });
              });

          } else {
            // this._userService.getAgencyId(Constants.USER_PATHS[this.userType], this.uid)
            //   .takeUntil(this.ngUnsubscribe)
            //   .subscribe(agencyId => {
            //     this.agencyId = agencyId;
            //
            //     this._userService.getCountryId(Constants.USER_PATHS[this.userType], this.uid)
            //       .takeUntil(this.ngUnsubscribe)
            //       .subscribe(countryId => {
            //         this.countryId = countryId;
            this.agencyId = agencyId;
            this.countryId = countryId;

            this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyId, this.countriesFilter)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(_ => {
                this.countries = _;
                Object.keys(this.countries).map(country => {
                  let key = this.countries[country].$key;

                  if (key == this.countryId) {
                    this.locationId = this.countries[country].location;
                    //this.countriesFilterSubject.next(Countries[this.locationId]);
                  }

                  this.af.database.list(Constants.APP_STATUS + '/document/' + key, this.docFilter)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(_ => {
                      let docs = _;
                      docs = docs.filter(doc => {
                        if (this.userSelected == "-1")
                          return true;

                        return doc.uploadedBy == this.userSelected;
                      });
                      Object.keys(docs).map(doc => {
                        let uploadedBy = docs[doc].uploadedBy;
                        this.af.database.object(Constants.APP_STATUS + '/userPublic/' + uploadedBy)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe(_ => {
                            docs[doc]['uploadedBy'] = _.firstName + " " + _.lastName;
                          });
                      });
                      this.countries[country]['docs'] = docs;
                      this.countries[country]['docsfiltered'] = docs;
                      this.countries[country]['hasDocs'] = (docs.length > 0);

                    });
                });
              });

            this.af.database.list(Constants.APP_STATUS + '/group/agency/' + this.agencyId + '/agencyallusersgroup')
              .takeUntil(this.ngUnsubscribe)
              .subscribe(_ => {
                let users = _;
                Object.keys(users).map(user => {
                  let userKey = users[user].$key;
                  this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userKey)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(_ => {
                      this.users[user] = {key: userKey, fullName: _.firstName + " " + _.lastName};
                    });
                });
              });
            //     });
            // });
          }

          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
            this.countryPermissionsMatrix = isEnabled;
          }));

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

  private cancelChanges() {
    this.ngOnInit();
  }

  private saveChanges() {
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  selectDocument() {
    this.exportDocs = [];
    this.countries.map(country => {
      country.docsfiltered.map(doc => {
        if (doc.selected) {
          this.exportDocs.push(doc);

          if (doc.sizeType == SizeType.KB)
            this.docsSize += doc.size * 0.001;
          else
            this.docsSize += doc.size;

        }
      })
    });

    this.docsCount = this.exportDocs.length;
  }

  private exportSelectedDocuments() {
    jQuery("#export_documents").modal("show");
  }

  private closeExportModal() {
    jQuery("#export_documents").modal("hide");
  }

  private export() {
    jQuery("#export_documents").modal("hide");

    let self = this;
    this.exportDocs.map(doc => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        self.download(xhr.response, doc.fileName, xhr.getResponseHeader("Content-Type"));
      };
      xhr.open('GET', doc.filePath);
      xhr.send();
    });
  }

  private download(data, name, type) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    var file = new Blob([data], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  }

  private countryDocsSelected(country, target) {
    country.docsfiltered = country.docsfiltered.map(doc => {
      doc.selected = country.selected;
      this.selectDocument()
      return doc;
    });
  }

  private filter() {
    // if there is "-1" in the this.docTypeSelected, DocumentType will return undefined, so next(undefined) returns no filter
    // the same logic is applied for other filters
    this.docFilterSubject.next(DocumentType[this.docTypeSelected]);
    // the filtering based on User is done client side, because FireBase supports orderBy only on one parameter

    this.countriesFilterSubject.next(Countries[this.countrySelected]);
  }

  // Feel free to extend to other fields for filtering if needed
  private searchByNameOrTitle(filter: string) {
    filter = filter.toLowerCase();

    this.countries.map(country => {
      country['docsfiltered'] = country.docs.filter(doc => {
        if (filter.length == 0)
          return true;

        let searchBy = doc.title + doc.fileName;
        searchBy = searchBy.toLowerCase();

        if (searchBy.search(filter) > -1)
          return true;

        return false;
      });
    });
  }

}
