import { Component, OnInit } from '@angular/core';

import { WindowPanel } from '../window/shared/windowPanel';
import { WindowService } from '../window/shared/window.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loaded: boolean;
  windows: WindowPanel[];

  constructor(private windowService: WindowService) {
    this.loaded = false;
  }

  ngOnInit() {
    this.getWindows();
  }

  getWindows() {
    this.windowService.getWindows().then(windows => {
      this.windows = windows;
      this.loaded = true;
    });
  }

}
