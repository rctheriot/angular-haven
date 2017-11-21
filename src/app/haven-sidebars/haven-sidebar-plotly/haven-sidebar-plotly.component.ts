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

import { HavenFirestoreQuery } from '../../haven-shared/haven-services/haven-firestore-query';
import { HavenFirestoreQueryService } from '../../haven-shared/haven-services/haven-firestore-query.service';

import * as firebase from 'firebase';
import { PlotlyQuery } from 'app/haven-apps/haven-apps/haven-plotly/haven-plotly-shared/plotlyQuery';

@Component({
  selector: 'app-haven-sidebar-plotly',
  templateUrl: './haven-sidebar-plotly.component.html',
  styleUrls: ['./haven-sidebar-plotly.component.css'],
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
export class HavenSidebarPlotlyComponent implements OnInit {

  state = 'inactive';

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

  selOption: any;
  selScope: any;
  selScenario: string;
  selChart: string;

  scenarios = [];

  optionsSelection = [
    {
      valueType: 'Capacity',
      scenarios: this.scenarios,
      scopes: [{
        name: 'Yearly',
        charts: ['Line', 'Bar', 'Heatmap']
      },
      ],
    },
    {
      valueType: 'Load',
      scenarios: this.scenarios,
      scopes: [
        {
          name: 'Yearly',
          charts: ['Line', 'Bar', 'Heatmap', '3DSurface']
        },
        {
          name: 'Monthly',
          charts: ['Line', 'Bar', 'Heatmap', '3DSurface']
        },
        {
          name: 'Daily',
          charts: ['Line', 'Bar', 'Heatmap', '3DSurface']
        },
        {
          name: 'Hourly',
          charts: ['Line', 'Bar', 'Heatmap']
        }
      ],
    },
    {
      valueType: 'Supply',
      scenarios: this.scenarios,
      scopes: [
        {
          name: 'Monthly',
          charts: ['Line', 'Bar', 'Heatmap']
        },
        {
          name: 'Daily',
          charts: ['Line', 'Bar', 'Heatmap']
        },
        {
          name: 'Hourly',
          charts: ['Line', 'Bar', 'Heatmap']
        }
      ],
    }
  ]

  chartTypeDict = {
    'Line': 'scatter',
    'Bar': 'bar',
    'Heatmap': 'heatmap',
    '3DSurface': '3dsurf'
  }

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  rpsValues = [];
  repValues = [];

  colors = ['#6699CC', '#99C794', '#F99157']

  constructor(private havenWindowService: HavenWindowService, private havenFirestore: HavenFirestoreQueryService) {
    this.selOption = this.optionsSelection[0];
    this.selScope = this.selOption.scopes[0];
  }

  ngOnInit() {

    firebase.database().ref().child(`/scenarios/key/`).once('value').then((scenarios) => {
      scenarios.forEach(scenario => {
        this.scenarios.push(scenario.val().name);
        this.selScenario = this.selOption.scenarios[0];
      })
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
      const consolidate = (this.selChart === '3DSurface') ? false : true;
      const firestoreQuery = new HavenFirestoreQuery(
        this.queryYear,
        this.queryMonth - 1,
        this.queryDay,
        this.selScope.name.toLowerCase(),
        this.selScenario.toLowerCase(),
        this.selOption.valueType.toLowerCase(),
        consolidate,
      )
      const newApp = new HavenApp();
      newApp.appName = this.getApp();
      newApp.appInfo = { query: new PlotlyQuery(firestoreQuery, this.chartTypeDict[this.selChart]) }
      const newWin = new HavenWindow(newApp, this.getChartWindowTitle());
      newWin.color = this.colors[this.scenarios.indexOf(this.selScenario)];
      this.havenWindowService.addWindow(newWin);
    }
  }

  getApp() {
    switch (this.selChart) {
      case 'Line':
        return 'plotly-line';
      case 'Bar':
        return 'plotly-bar';
      case 'Heatmap':
        return 'plotly-heatmap';
      case '3DSurface':
        return 'plotly-3dsurface';

    }
  }

  getChartWindowTitle(): string {
    switch (this.selScope.name) {
      case 'Yearly':
        return `${this.selScenario.toUpperCase()} ${this.selOption.valueType}  2016 - 2045`;
      case 'Monthly':
        return `${this.selScenario.toUpperCase()} ${this.selOption.valueType} - ${this.selYear}`;
      case 'Daily':
        return `${this.selScenario.toUpperCase()} ${this.selOption.valueType} - ${this.titleMonth()} ${this.selYear}`;
      case 'Hourly':
        return `${this.selScenario.toUpperCase()} ${this.selOption.valueType} - ${this.titleMonth()} ${this.titleDay()}, ${this.selYear}`;
      default:
        return `${this.selScenario.toUpperCase()} ${this.selOption.valueType}`;
    }
  }

  titleDay(): string {
    const date = this.dateFromDay(this.selYear, this.selDay);
    return date.getDate().toString();
  }

  titleMonth(): string {
    const date = this.dateFromDay(this.selYear, this.selDay);
    return this.monthNames[date.getMonth()];
  }

  titleDate(): string {
    const date = this.dateFromDay(this.selYear, this.selDay);
    const month = this.monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`
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

  selChange(model: any) {
    this.selModel = model;
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
