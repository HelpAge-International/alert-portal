import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Constants} from '../utils/Constants';
import {Observable} from 'rxjs';

@Injectable()
export class CommonService {

  constructor(private _http: Http) {}


  getJsonContent(path: string): Observable<any> {
    return this._http.get(path).map(res => { return res.json() || {} });
  }
}
