import { Injectable } from '@angular/core';
import * as html2canvas from "html2canvas";
import { AngularFire, AngularFireDatabase, FirebaseListObservable } from "angularfire2";
import * as firebase from "firebase";
import { BugReportModel } from "../report-problem/bug-report-model";

declare const jQuery: any;

@Injectable()
export class BugReportingService {

  constructor(private af: AngularFire, private db: AngularFireDatabase) {
  }

}


