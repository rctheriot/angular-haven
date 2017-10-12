import { Injectable } from '@angular/core';
import { WindowPanel } from './WindowPanel';
import { WINDOWS } from './windows';

@Injectable()
export class WindowService {

  numberOfWindows = 0;

  getWindows(): Promise<WindowPanel[]> {
    return Promise.resolve(WINDOWS);
  }

  removeWindow(cid) {
    for (let i = WINDOWS.length - 1; i >= 0; i--) {
      if (WINDOWS[i].id === cid) {
        WINDOWS.splice(i, 1);
      }
    }
  }

  addWindow(win: WindowPanel) {
    win.id = this.numberOfWindows;
    this.numberOfWindows++;
    WINDOWS.push(win);
    return win.id;
  }

  setWindows(Windows: any[]) {
    this.clearWindows();
    Windows.forEach( el => {
      this.addWindow(el);
    })
  }

  clearWindows() {
    WINDOWS.length = 0;
    this.numberOfWindows = 0;
  }

}
