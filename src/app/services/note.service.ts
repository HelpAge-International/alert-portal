import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { NoteModel } from "../model/note.model";

@Injectable()
export class NoteService {

  constructor(private af: AngularFire) { }

    public getNotes(node: string): Observable<NoteModel[]> {
      const getNotesSubscription = this.af.database.list(Constants.APP_STATUS + node)
      .map(items => {
        console.log(items)
        const notes: NoteModel[] = [];
        items.forEach(item => {
          let note = new NoteModel();
          note.mapFromObject(item);
          note.id = item.$key;
          notes.push(note);
        });
        return notes;
      });

    return getNotesSubscription;
    }

  public saveNote(node: string, note: NoteModel): firebase.Promise<any>{
    if(!node || !note)
    {
      return Promise.reject('Missing node or note');
    }

    // Update the timestamp
    note.time = new Date().getTime();

    if(note.id)
    {
      const nodeData = {};
      nodeData[node + '/' + note.id] = note;
      return this.af.database.object(Constants.APP_STATUS).update(nodeData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + node).push(note);
    }
  }

  public deleteNote(node: string, note: NoteModel): firebase.Promise<any> {
    if(!node || !note || !note.id )
    {
      return Promise.reject('Missing node or note');
    }

    const nodeData = {};

    nodeData[node + '/' + note.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(nodeData);
  }
}
