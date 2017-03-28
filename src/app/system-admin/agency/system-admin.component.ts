import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {DialogService} from "../../dialog/dialog.service";
import {Subscription, Observable} from "rxjs";


@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})

export class SystemAdminComponent implements OnInit,OnDestroy {

  agencies: FirebaseListObservable<any>;
  uid: string;
  private subscription: Subscription;

  constructor(private af: AngularFire, private router: Router,
              private dialogService: DialogService) {
  }

  ngOnInit() {
    this.subscription = this.af.auth.subscribe(x => {
      if (x) {
        this.uid = x.auth.uid;
        console.log("uid: " + this.uid);
        this.agencies = this.af.database.list(Constants.APP_STATUS + "/agency");
        // this.test();
      } else {
        this.navigateToLogin();
      }
    });
  }

  private test() {
    this.af.database.list(Constants.APP_STATUS + "/systemAdmin/" + this.uid + "/sentmessages")
      .flatMap(list => {
        let tempList = [];
        list.forEach(x => {
          tempList.push(x)
        })
        return Observable.from(tempList)
      })
      .flatMap(item => {
        return this.af.database.object(Constants.APP_STATUS + "/message/" + item.$key)
      })
      .subscribe(x => {
        console.log(x)
      });

    let data:number [] =[];
    Observable.of(1)
      .map(item =>{
        return item+10;
      })
      .flatMap(item => {
        return Observable.of(item);
      })
      .subscribe(result => {
        console.log(result)
      })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  toggleActive(agency) {
    this.dialogService.createDialog("DIALOG.TITLE", "DIALOG.CONTENT").subscribe(result => {
      if (result) {
        let state:boolean = !agency.isActive;
        console.log(agency.isActive);
        this.af.database.object(Constants.APP_STATUS + "/agency/" + agency.$key + "/isActive").set(state);
      }
    });
  }

  editAgency(agency) {
    this.router.navigate(['/system-admin/add-agency', {id: agency.$key}]);
  }

}
