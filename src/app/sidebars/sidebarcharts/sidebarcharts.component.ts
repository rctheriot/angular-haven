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
import { PlotlyChartsService } from '../../plotly-charts/service/plotly-charts.service';
import { PlotlyQuery } from '../../plotly-charts/shared/plotlyQuery';

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

  selChart: string;
  charts = [];

  selYear: number;
  selMonth: number;
  selDay: number;
  date: Date;

  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2045, 11, 31);
  startDate = new Date(2016, 0, 1);

  state = 'inactive';

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private windowService: WindowService, private chartService: PlotlyChartsService) { }

  ngOnInit() {
    this.charts = this.chartService.getChartTypes();
    console.log(this.charts);
    this.selYear = this.startDate.getFullYear();
    this.selMonth = this.startDate.getMonth();
    this.selDay = this.startDate.getDate();
  }

  createWindow() {
    const query = new PlotlyQuery();
    query.chartType = this.selChart;
    query.year = this.selYear;
    query.month = this.selMonth;
    query.day = this.selDay;
    query.scenario = this.selScenario;
    const newWin = new WindowPanel(`${this.selScenario.toLocaleUpperCase()} - ${this.titleDate()}`, 'plotly', query);
    this.windowService.addWindow(newWin);
  }

  dateChange(e) {
    this.date = e.value;
    this.selYear = this.date.getFullYear();
    this.selMonth = this.date.getMonth() + 1;
    this.selDay = this.date.getDate();
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
