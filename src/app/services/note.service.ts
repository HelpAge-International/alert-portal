import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { NoteModel } from "../model/note.model";

@Injectable()
export class NoteService {

  constructor(private afd: AngularFireDatabase) { }

    public getNotes(node: string): Observable<NoteModel[]> {
      const getNotesSubscription = this.afd.list<NoteModel>(Constants.APP_STATUS + node)
        .snapshotChanges()
      .map(items => {
        const notes: NoteModel[] = [];
        items.forEach(item => {
          let note = new NoteModel();
          note.mapFromObject(item.payload.val());
          note.id = item.key;
          notes.push(note);
        });
        return notes;
      });

    return getNotesSubscription;
    }

  public saveNote(node: string, note: NoteModel): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(nodeData);
    }else{
      return this.afd.list(Constants.APP_STATUS + node).push(note).then();
    }
  }

  public deleteNote(node: string, note: NoteModel): Promise<any> {
    if(!node || !note || !note.id )
    {
      return Promise.reject('Missing node or note');
    }

    const nodeData = {};

    nodeData[node + '/' + note.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(nodeData);
  }
}
