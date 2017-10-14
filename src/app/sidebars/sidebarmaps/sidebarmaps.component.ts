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
import { LeafMapService } from '../../leaflet/leafmap.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-sidebarmaps',
  templateUrl: './sidebarmaps.component.html',
  styleUrls: ['./sidebarmaps.component.css'],
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
export class SidebarmapsComponent implements OnInit {

  state = 'inactive';

  mapActive = false;

  layers: any;
  selLayer: any;
  mapWindowId: number;

  constructor(private windowService: WindowService, private leafService: LeafMapService) { }

  ngOnInit() {
    this.leafService.layersObs.subscribe((layers) => { this.layers = layers; });
    this.leafService.mapEnabledObs.subscribe((mapStatus) => { this.mapActive = mapStatus; })
  }

  showMap() {
    const newWin = new WindowPanel('Map', `leafletmap`, '', '#a9b6bc');
    this.mapWindowId = this.windowService.addWindow(newWin);
    this.leafService.showMap();
  }

  hideMap() {
    this.windowService.removeWindow(this.mapWindowId);
    this.leafService.hideMap();
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  toggleLayer(event) {
    if (event.checked) {
      this.leafService.showLayer(event.source.name);
    } else {
      this.leafService.hideLayer(event.source.name);
    }
  }

}
