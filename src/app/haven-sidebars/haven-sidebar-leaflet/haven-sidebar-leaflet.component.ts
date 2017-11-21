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
import { HavenWindowComponent } from '../../haven-window/haven-window-component/haven-window.component';
import { HavenWindowService } from '../../haven-window/haven-window-services/haven-window.service';
import { HavenApp } from '../../haven-apps/haven-apps-shared/haven-app';

import { HavenLeafletService } from '../../haven-apps/haven-apps/haven-leaflet/haven-leaflet-services/haven-leaflet.service';
import { HavenLeafletComponent } from '../../haven-apps/haven-apps/haven-leaflet/haven-leaflet-component/haven-leaflet.component';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-haven-sidebar-leaflet',
  templateUrl: './haven-sidebar-leaflet.component.html',
  styleUrls: ['./haven-sidebar-leaflet.component.css'],
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
export class HavenSidebarLeafletComponent implements OnInit {

  state = 'inactive';

  mapActive = false;

  layers: any;
  selLayer: any;
  mapWindowId: number;

  constructor(private havenWindowService: HavenWindowService, private havenLeafletService: HavenLeafletService) { }

  ngOnInit() {
    this.havenLeafletService.layersObs.subscribe((layers) => { this.layers = layers; });
    this.havenLeafletService.mapEnabledObs.subscribe((mapStatus) => { this.mapActive = mapStatus; })
  }

  showMap() {
    const newApp = new HavenApp()
    newApp.appName = 'leaflet';
    const newWin = new HavenWindow(newApp, 'Map');
    this.mapWindowId = this.havenWindowService.addWindow(newWin);
    this.havenLeafletService.showMap();
  }

  hideMap() {
    this.havenWindowService.removeWindow(this.mapWindowId);
    this.havenLeafletService.hideMap();
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  toggleLayer(event) {
    if (event.checked) {
      this.havenLeafletService.showLayer(event.source.name);
    } else {
      this.havenLeafletService.hideLayer(event.source.name);
    }
  }

}
