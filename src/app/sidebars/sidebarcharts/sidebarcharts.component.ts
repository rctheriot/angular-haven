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
  selector: 'app-sidebarcharts',
  templateUrl: './sidebarcharts.component.html',
  styleUrls: ['./sidebarcharts.component.css'],
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
export class SidebarchartsComponent implements OnInit {

  query: string;

  selScenario: string;
  scenarios = ['e3genmod', 'e3', 'postapril'];

  selGraph: string;
  graphs = ['line', 'radar', 'area', 'stackhbar', 'stackvbar'];

  selDate: string;
  date: Date;

  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2045, 11, 31);
  startDate = new Date(2016, 0, 1);

  state = 'inactive';

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private windowService: WindowService) { }

  ngOnInit() {
    this.selDate = 2016 + '/' + 1 + '/' + 1;
  }

  createWindow() {
    const newWin = new WindowPanel(`${this.selScenario.toLocaleUpperCase()} - ${this.titleDate()}`, `ngxgraph-${this.selGraph}`, `/${this.selScenario}/${this.selDate}`);
    this.windowService.addWindow(newWin);
  }

  dateChange(e) {
    this.date = e.value;
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    this.selDate = year + '/' + month + '/' + day;
  }

  titleDate() {
    const year = this.date.getFullYear();
    const month = this.monthNames[this.date.getMonth()];
    const day = this.date.getDate();
    return `${day} ${month} ${year}`;
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }


}
