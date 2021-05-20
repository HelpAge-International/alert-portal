import { Injectable } from '@angular/core';
import { FirebaseApp } from "@angular/fire";
import {AngularFireDatabase} from "@angular/fire/database";

@Injectable()
export class BugReportingService {

  constructor(private af: FirebaseApp, private db: AngularFireDatabase) {
  }

}


