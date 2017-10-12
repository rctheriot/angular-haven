import {
  Component,
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';

import { WindowPanel } from '../../window/shared/windowPanel';
import { WindowService } from '../../window/shared/window.service';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-sidebaraccount',
  templateUrl: './sidebaraccount.component.html',
  styleUrls: ['./sidebaraccount.component.css'],
  animations: [
    trigger('movePanel', [
      state('active', style({
        transform: 'translate(10px, 0px)',
      })),
      state('inactive', style({
        transform: 'translate(-205px, 0px)',
      })),
      transition('active => inactive', animate('500ms ease-in-out')),
      transition('inactive => active', animate('500ms ease-in-out'))
    ]),
  ],
})
export class SidebaraccountComponent implements OnInit {

  shareSessionEmail: string;
  sessionsName: string;
  selSession = 'asdf';

  state = 'inactive';

  sessions: any[];

  constructor(private windowService: WindowService, private db: AngularFireDatabase, private auth: AuthService) {
    const itemsRef = db.list(`sessions/${this.auth.getId()}`);
    itemsRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.val();
        const $key = action.payload.key;
        return { $key, ...data };
      });
    }).subscribe(items => {
      this.sessions = items;
    });
  }

  ngOnInit() {

  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  saveSession() {
    this.windowService.getWindows().then(windows => {
      this.db.list(`sessions/${this.auth.getId()}`).push({ name: this.sessionsName, session: windows });
    });
  }

  loadSession() {
    const items = [];
    firebase.database().ref(`/sessions/${this.auth.getId()}/${this.selSession}/session/`).once('value').then((snapshots) => {
      snapshots.forEach(snapshot => {
        items.push(snapshot.val());
      })
      this.windowService.setWindows(items);
    });
  }

  shareSession() {

  }

  deleteSession() {
    this.db.object(`/sessions/${this.auth.getId()}/${this.selSession}`).remove();
  }

  clearSession() {
    this.windowService.clearWindows();
    this.selSession = null;
    this.sessionsName = null;
    this.shareSessionEmail = null;
  }

}
