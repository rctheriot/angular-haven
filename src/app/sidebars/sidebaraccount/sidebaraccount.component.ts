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

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../auth.service';

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
  selSession: string;

  state = 'inactive';

  sessions: FirebaseListObservable<any>;

  constructor(private windowService: WindowService, private db: AngularFireDatabase, private auth: AuthService) { }

  ngOnInit() {
    this.sessions = this.db.list(`sessions/${this.auth.getId()}`);
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  saveSession() {
    this.windowService.getWindows().then(windows => {
      this.sessions.push({name: this.sessionsName, session: windows});
    });
  }

  loadSession() {
    const dbitems = this.db.object(`/sessions/${this.auth.getId()}/${this.selSession}/session/`, { preserveSnapshot: true });
    const items = [];
    dbitems.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        items.push(snapshot.val());
      });
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
