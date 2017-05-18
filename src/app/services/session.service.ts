import { Injectable } from '@angular/core';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';
import { ModelUserPublic } from "../model/user-public.model";
import { PartnerModel } from "../model/partner.model";

@Injectable()
export class SessionService {
  private _user: ModelUserPublic;
  set user(user: ModelUserPublic){
    this._user = user;
  }
  get user(): ModelUserPublic{
    return this._user;
  }

  private _partner: PartnerModel;
  set partner(partner: PartnerModel){
    this._partner = partner;
  }
  get partner(): PartnerModel{
    return this._partner;
  }

  constructor(private subscriptions: RxHelper) {}

}