import {Injectable} from "@angular/core";
import {MdDialog, MdDialogRef} from "@angular/material";
import {Observable} from "rxjs";
import {DialogComponent} from "./dialog.component";
/**
 * Created by Fei on 15/03/2017.
 */

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) {
  }

  createDialog(title: string, content: string): Observable<boolean> {
    let dialogRef: MdDialogRef<DialogComponent> = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.content = content;
    return dialogRef.afterClosed();
  }
}
