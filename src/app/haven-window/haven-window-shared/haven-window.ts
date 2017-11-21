import { Type } from '@angular/core';

import { HavenApp } from '../../haven-apps/haven-apps-shared/haven-app';
import { HavenWindowComponent } from '../haven-window-component/haven-window.component';

export class HavenWindow {
  id: number;
  title: string;

  position = new Position();
  size = new Size();
  savePosition = new Position();
  saveSize = new Size();

  maximized: boolean;
  backgroundAlpha: number;
  color: string;

  app: HavenApp;

  constructor(havenApp: HavenApp, title: string) {
    this.app = havenApp;
    this.position.left = 200;
    this.position.top = 200;
    this.size.width = 300;
    this.size.height = 300;
    this.backgroundAlpha = 1.0;
    this.title = title;
    this.color = '#a9b6bc';
  }
}

class Position {
  left: number;
  top: number;
}

class Size {
  width: number;
  height: number;
}

