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

import { HavenWindow } from '../../haven-window/haven-window-shared/haven-window';
import { HavenWindowService } from '../../haven-window/haven-window-services/haven-window.service';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-haven-sidebar-sessions',
  templateUrl: './haven-sidebar-sessions.component.html',
  styleUrls: ['./haven-sidebar-sessions.component.css'],
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
export class HavenSidebarSessionsComponent implements OnInit {

  shareSessionEmail: string;
  sessionsName: string;
  selSession = 'asdf';

  state = 'inactive';

  sessions: any[];

  constructor(private havenWindowService: HavenWindowService, private db: AngularFireDatabase, private auth: AuthService) {
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
    this.havenWindowService.getWindows().then(windows => {
      this.db.list(`sessions/${this.auth.getId()}`).push({ name: this.sessionsName, session: windows });
    });
  }

  loadSession() {
    const windowList = [];
    firebase.database().ref(`/sessions/${this.auth.getId()}/${this.selSession}/session/`).once('value').then((windows) => {
      windows.forEach(window => {
        windowList.push(window.val());
      })
      this.havenWindowService.setWindows(windowList);
    });
  }

  deleteSession() {
    this.db.object(`/sessions/${this.auth.getId()}/${this.selSession}`).remove();
  }

  clearSession() {
    this.havenWindowService.clearWindows();
    this.selSession = null;
    this.sessionsName = null;
    this.shareSessionEmail = null;
  }

}
