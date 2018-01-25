import { Type } from '@angular/core';

import { HavenApp } from '../../haven-apps/haven-apps-shared/haven-app';
import { HavenWindowComponent } from '../haven-window-component/haven-window.component';
import { isUndefined } from 'util';

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

  constructor(havenApp: HavenApp, title: string, left?: number, top?: number, width?: number, height?: number) {
    this.app = havenApp;
    isUndefined(left) ? this.position.left = 300 : this.position.left = left;
    isUndefined(top) ? this.position.top = 300 : this.position.top = top;
    (isUndefined(width) || width < 350) ? this.size.width = 400 : this.size.width = width;
    (isUndefined(height) || height < 300) ? this.size.height = 400 : this.size.height = height;
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

