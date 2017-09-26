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

  query: string;

  selScenario: string;
  scenarios = ['e3genmod'];

  selSource: string;
  sources = ['demand', 'supply', 'capactiy'];

  selGraph: string;
  graphs = ['line', 'guage', 'radar'];

  selDate: string;

  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2045, 11, 31);
  startDate = new Date(2016, 0, 1);

  state = 'inactive';

  constructor(private windowService: WindowService) { }

  ngOnInit() {
    this.selDate = 2016 + '/' + 1 + '/' + 1;
  }

  createWindow() {
    const newWin = new WindowPanel(this.query, `ngxgraph-${this.selGraph}`, `/${this.selScenario}/${this.selSource}/${this.selDate}`);
    this.windowService.addWindow(newWin);
  }

  dateChange(e) {
    const date = e.value;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.selDate = year + '/' + month + '/' + day;
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  createWindow2() {
    const newWin = new WindowPanel(this.query, `ngxgraph-line`, `AllCapacity`);
    this.windowService.addWindow(newWin);
  }


}
