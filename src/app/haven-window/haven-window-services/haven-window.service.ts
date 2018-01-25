import { Injectable } from '@angular/core';
import { HavenWindow } from '../haven-window-shared/haven-window';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HavenWindowService {

  private windows: HavenWindow[] = []
  private windowsZIndex = {};

  WindowZUpdate = new Subject<Object>();
  HavenWindowAdd = new Subject<HavenWindow>();
  HavenWindowRemove = new Subject<HavenWindow>();

  numberOfWindows = 0;

  getWindows(): Promise<HavenWindow[]> {
    return Promise.resolve(this.windows);
  }

  removeWindow(wId) {
    for (let i = this.windows.length - 1; i >= 0; i--) {
      if (this.windows[i].id === wId) {
        this.HavenWindowRemove.next(this.windows[i]);
        this.windows.splice(i, 1);
        this.removeZWindow(wId);
      }
    }
  }

  addWindow(win: HavenWindow) {
    win.id = this.numberOfWindows;
    this.numberOfWindows++;
    this.windows.push(win);
    this.HavenWindowAdd.next(win);
    this.addZWindow(win.id);
    return win.id;
  }

  setWindows(Windows: any[]) {
    this.clearWindows();
    Windows.forEach( el => {
      this.addWindow(el);
      el.app.appInfo.winId = el.id;
    })
  }

  getWindow(wId: number): Promise<HavenWindow> {
    for (let i = this.windows.length - 1; i >= 0; i--) {
      if (this.windows[i].id === wId) { return Promise.resolve(this.windows[i]); };
    }
  }

  clearWindows() {
    for (let i = 0; i < this.windows.length; i++) {
      this.HavenWindowRemove.next(this.windows[i]);
      this.removeZWindow(this.windows[i].id);
    }
    this.windows.length = 0;
  }

  bringWindowForward(windowId: number) {
    const winZ = this.windowsZIndex[windowId];
    for (const winId in this.windowsZIndex) {
      if (this.windowsZIndex[winId] > winZ) {
        this.windowsZIndex[winId]--;
      }
    }
    this.windowsZIndex[windowId] = this.windows.length;
    this.WindowZUpdate.next(this.windowsZIndex);
  }

  addZWindow(windowId: number) {
    this.windowsZIndex[windowId] = this.windows.length;
    this.WindowZUpdate.next(this.windowsZIndex);
  }

  removeZWindow(windowId: number) {
    const winZ = this.windowsZIndex[windowId];
    delete this.windowsZIndex[windowId];
    for (const winId in this.windowsZIndex) {
      if (this.windowsZIndex[winId] > winZ) {
        this.windowsZIndex[winId]--;
      }
    }
    this.WindowZUpdate.next(this.windowsZIndex);
  }

}
