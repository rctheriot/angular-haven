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
import { LeaflayersService } from '../../leaflet/leaflayers.service';


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

  layers: any;
  selLayer: any;

  constructor(private windowService: WindowService, private leafService: LeaflayersService) { }

  ngOnInit() {
    this.leafService.getLayers().then(layers => { this.layers = layers });
  }

  createMap() {
    const newWin = new WindowPanel('Map', `leafletmap`, '');
    this.windowService.addWindow(newWin);
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  showDOD(event) {
    this.leafService.dod = event.checked;
  }

  showFlood(event) {
    this.leafService.flood = event.checked;
  }

  showAgr(event) {
    this.leafService.agr = event.checked;
  }

  showLandUse(event) {
    this.leafService.landuse = event.checked;
  }

  showParks(event) {
    this.leafService.parks = event.checked;
  }

  showLava(event) {
    this.leafService.lava = event.checked;
  }

}
