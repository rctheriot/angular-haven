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
import { HavenDateSelectorService } from '../../haven-shared/haven-services/haven-date-selector.service';

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
  sliderRPSMin = 25;
  selREP = 50;
  sliderREPMax = 100;
  sliderREPMin = 20;
  selYear = 2030;

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
        charts: ['Line', 'Bar', 'Heatmap', 'Table', 'Garden']
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
        },
        {
          name: '8760',
          charts: ['3DSurface']
        },
      ],
    },
    {
      valueType: 'NetLoad',
      scenarios: this.scenarios,
      scopes: [{
        name: 'Monthly',
        charts: ['Line']
      },
      ],
    },
    {
      valueType: 'Supply',
      scenarios: this.scenarios,
      scopes: [
        {
          name: 'Monthly',
          charts: ['Line', 'Bar', 'Heatmap', 'Table']
        },
        {
          name: 'Daily',
          charts: ['Line', 'Bar', 'Heatmap', 'Table']
        },
        {
          name: 'Hourly',
          charts: ['Line', 'Bar', 'Heatmap', 'Table']
        }
      ],
    },
    {
      valueType: 'Map',
      scenarios: this.scenarios,
      scopes: [{
        name: '',
        charts: ['']
      },
      ],
    },
  ]

  chartTypeDict = {
    'Line': 'scatter',
    'Bar': 'bar',
    'Heatmap': 'heatmap',
    '3DSurface': '3dsurf',
    'Table': 'table',
    'Garden': 'garden'
  }

  selLoad = 'load_base';

  loadData = [
    {
      name: 'Base',
      value: 'load_base'
    },
    {
      name: 'Smart Charge',
      value: 'load_smart_charge'
    },
    {
      name: 'Dumb Charge',
      value: 'load_dumb_charge'
    },
  ]

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  colors = ['#6699CC', '#99C794', '#F99157']

  constructor(private havenWindowService: HavenWindowService, private havenDateSelector: HavenDateSelectorService) {
    this.selOption = this.optionsSelection[0];
    this.selScope = this.selOption.scopes[0];
    this.scenarios.push('e3', 'postapril', 'e3genmod');
    this.selScenario = this.scenarios[0];
  }

  ngOnInit() {
    this.queryUpdate();
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  createWindow() {
    if (this.selOption.valueType === 'Map') {
      this.createMapWindow();
    } else {
      this.createPlotlyWindow();
    }
  }

  createMapWindow() {
    const newApp = new HavenApp()
    newApp.appName = 'leaflet';
    const firestoreQuery = new HavenFirestoreQuery(
      this.queryYear,
      this.queryMonth - 1,
      this.queryDay,
      'monthly',
      this.selScenario.toLowerCase(),
      this.selOption.valueType.toLowerCase(),
      this.selLoad,
      false,
    )
    newApp.appInfo = { query: firestoreQuery };
    const newWin = new HavenWindow(newApp, 'Map', 265, 50, 1050, 900);
    newWin.color = this.colors[this.scenarios.indexOf(this.selScenario)];
    const winId = this.havenWindowService.addWindow(newWin);
    newApp.appInfo['winId'] = winId
  }

  createPlotlyWindow() {
    if (this.selScenario && this.selChart) {
      const consolidate = (this.selChart === '3DSurface' || this.selOption.valueType.toLowerCase() === 'netload' || this.selChart === 'Garden') ? false : true;
      const firestoreQuery = new HavenFirestoreQuery(
        this.queryYear,
        this.queryMonth - 1,
        this.queryDay,
        this.selScope.name.toLowerCase(),
        this.selScenario.toLowerCase(),
        this.selOption.valueType.toLowerCase(),
        this.selLoad,
        consolidate,
      )
      const newApp = new HavenApp();
      newApp.appName = this.getApp();
      newApp.appInfo = { query: new PlotlyQuery(firestoreQuery, this.chartTypeDict[this.selChart]), windowLock: false };
      let newWin = null;
      if (firestoreQuery.type === 'netload') {newWin = new HavenWindow(newApp, this.getChartWindowTitle(), 775, 625, 450, 400); newApp.appInfo.windowLock = true; }
      else {newWin = new HavenWindow(newApp, this.getChartWindowTitle()); }
      if (this.selChart === 'Garden') { newWin.size.width = 1758; newWin.size.height = 342; }
      newWin.color = this.colors[this.scenarios.indexOf(this.selScenario)];
      const winId = this.havenWindowService.addWindow(newWin);
      newApp.appInfo['winId'] = winId
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
      case 'Table':
        return 'plotly-table';
      case 'Garden':
        return 'garden'
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
      case '8760':
        return `${this.selScenario.toUpperCase()} ${this.selOption.valueType} - ${this.selYear}`;
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
    return ` ${month} ${day}, ${this.selYear}`
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
    this.havenDateSelector.setByRPS(value);
    this.selYear = this.havenDateSelector.ScenarioProfiles[this.selScenario].year;
    this.selREP = Math.trunc(this.havenDateSelector.ScenarioProfiles[this.selScenario].re * 100);
    this.queryUpdate();
  }

  sliderREPChange(event: any) {
    this.selREP = event.value;
    const value = this.selREP / 100;
    this.havenDateSelector.setByRE(value);
    this.selYear = this.havenDateSelector.ScenarioProfiles[this.selScenario].year;
    this.selRPS = Math.trunc(this.havenDateSelector.ScenarioProfiles[this.selScenario].rps * 100);
    this.queryUpdate();
  }

  updateProfile() {
    this.havenDateSelector.UpdateProfiles(this.queryMonth - 1, this.queryDay);
  }

  sliderDayChange(event: any) {
    this.selDay = event.value;
    this.queryUpdate();
  }

  valueChange(event: any) {
    this.selScope = this.selOption.scopes[0];
    this.selChart = this.selScope.charts[0];
  }

}
