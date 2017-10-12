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

import * as firebase from 'firebase';

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

  state = 'inactive';

  selScenario: string;
  scenarios = [];

  selChart: string;
  charts = [];

  queryYear: number;
  queryMonth: number;
  queryDay: number;

  selModel = 'RPS';

  selRPS = 100;
  sliderRPSMax = 200;
  sliderRPSMin = 1;

  selREP = 50;
  sliderREPMax = 100;
  sliderREPMin = 1;

  selYear = 2030;
  sliderYearMax = 2045;
  sliderYearMin = 2016;

  selDay = 180;
  sliderDayMin = 1;
  sliderDayMax = 365;

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  rpsValues = [];
  repValues = [];

  colors = ['#6DC3C9', '#599E5C', '#ff944d']

  constructor(private windowService: WindowService, private chartService: PlotlyChartsService) { }

  ngOnInit() {
    this.charts = this.chartService.getChartTypes();
    firebase.database().ref().child(`/scenarios/key/`).once('value').then((scenarios) => {
      scenarios.forEach(scenario => {
        this.scenarios.push(scenario.val().name);
      })
      this.selScenario = this.scenarios[0];
    }).then(() => {
      firebase.database().ref().child(`/rps/`).once('value').then((years) => {
        years.forEach(year => {
          this.rpsValues.push({ year: year.key, values: year.val() });
        })
        this.setRPS();
      });
      firebase.database().ref().child(`/renewpercent/`).once('value').then((years) => {
        years.forEach(year => {
          this.repValues.push({ year: year.key, values: year.val() });
        })
        this.setREP();
      });
    }).then(() => { this.queryUpdate(); });
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  createWindow() {
    if (this.selScenario && this.selChart) {
      const query = new PlotlyQuery();
      query.chartType = this.selChart;
      query.year = this.queryYear;
      query.month = this.queryMonth;
      query.day = this.queryDay;
      query.scenario = this.selScenario;
      const color = this.colors[this.scenarios.indexOf(this.selScenario)];
      const newWin = new WindowPanel(
        `${this.selScenario.toLocaleUpperCase()} - ${this.titleDate()} ${this.queryYear} - RPS: ${this.selRPS}% - REP: ${this.selREP}%`,
        'plotly', query, color);
      this.windowService.addWindow(newWin);
    }
  }

  titleDate(): string {
    const date = this.dateFromDay(this.selYear, this.selDay);
    const month = this.monthNames[date.getMonth()];
    const day = date.getDate();
    return `${day} ${month}`;
  }

  dateFromDay(year, day): Date {
    const date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }

  queryUpdate() {
    const date = this.dateFromDay(this.selYear, this.selDay);
    this.queryYear = date.getFullYear();
    this.queryMonth = date.getMonth() + 1;
    this.queryDay = date.getDate();
  }

  radioChange(event: any) {
    this.selModel = event.value;
  }

  sliderRPSChange(event: any) {
    this.selRPS = event.value;
    const value = this.selRPS / 100;
    this.selYear = 2017;
    this.rpsValues.forEach(el => {
      if (value > el.values[this.selScenario]) {
        this.selYear = Number(el.year);
      }
    })
    this.setREP();
    this.queryUpdate();
  }

  sliderREPChange(event: any) {
    this.selREP = event.value;
    const value = this.selREP / 100;
    this.selYear = 2017;
    this.repValues.forEach(el => {
      if (value > el.values[this.selScenario]) {
        this.selYear = Number(el.year);
      }
    })
    this.setRPS();
    this.queryUpdate();
  }

  sliderYearChange(event: any) {
    this.selYear = event.value;
    this.setRPS();
    this.setREP();
    this.queryUpdate();
  }

  sliderDayChange(event: any) {
    this.selDay = event.value;
    this.queryUpdate();
  }

  setREP() {
    this.repValues.forEach(el => {
      if (this.selYear === Number(el.year)) {
        this.selREP = Math.trunc(el.values[this.selScenario] * 100);
      }
    })
  }

  setRPS() {
    this.rpsValues.forEach(el => {
      if (this.selYear === Number(el.year)) {
        this.selRPS = Math.trunc(el.values[this.selScenario] * 100);
      }
    })
  }

}
