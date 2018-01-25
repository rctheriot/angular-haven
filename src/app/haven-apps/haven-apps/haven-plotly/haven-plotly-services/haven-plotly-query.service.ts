import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'

import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { HavenFirestoreQueryService } from '../../../../haven-shared/haven-services/haven-firestore-query.service';
import { HavenWindowService } from '../../../../haven-window/haven-window-services/haven-window.service';
import { HavenWindow } from '../../../../haven-window/haven-window-shared/haven-window';
import { HavenWindowComponent } from '../../../../haven-window/haven-window-component/haven-window.component';
import { HavenApp } from '../../../../haven-apps/haven-apps-shared/haven-app';

import { PlotlyData } from '../haven-plotly-shared/plotlyData';
import { PlotlyQuery } from '../haven-plotly-shared/plotlyQuery';
import { HavenFirestoreQuery } from 'app/haven-shared/haven-services/haven-firestore-query';



@Injectable()
export class HavenPlotlyQueryService {

  private dbRef;

  public plotlyColors = {
    'Fossil': '#e6ab02',
    'BioFuel': '#a6761d',
    'Biomass': '#66a61e',
    'Solar': '#F99157',
    'Wind': '#7570b3',
    'Offshore Wind': '#1b9e77',
    'Load': '#666666',
  }

  scenarios = ['e3', 'postapril', 'e3genmod']
  colors = ['#6699CC', '#99C794', '#F99157']

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private fsQueryService: HavenFirestoreQueryService, private havenWindowService: HavenWindowService) { }

  getData(query: PlotlyQuery): Promise<PlotlyData> {
    switch (query.firestoreQuery.type) {
      case 'capacity':
        return this.getCapacity(query);
      case 'load':
        return this.getLoad(query);
      case 'supply':
        return this.getSupply(query);
      case 'netload':
        return this.getNetLoad(query);
    }
  }

  private getCapacity(query: PlotlyQuery): Promise<PlotlyData> {
    return this.fsQueryService.getCapacity(query.firestoreQuery).then(capacityData => {
      const plotlyData = new PlotlyData();
      plotlyData.data = capacityData;
      plotlyData.xAxisLabel = 'Time';
      plotlyData.yAxisLabel = 'Capacity MW';
      return Promise.resolve(plotlyData);
    })
  }

  private getLoad(query: PlotlyQuery): Promise<PlotlyData> {
    return this.fsQueryService.getLoad(query.firestoreQuery).then(loadData => {
      const plotlyData = new PlotlyData();
      plotlyData.data = loadData;
      plotlyData.xAxisLabel = 'Time';
      plotlyData.yAxisLabel = 'Load MWh';
      return Promise.resolve(plotlyData);
    })
  }

  private getSupply(query: PlotlyQuery): Promise<PlotlyData> {
    return this.fsQueryService.getSupply(query.firestoreQuery).then(supplyData => {
      const plotlyData = new PlotlyData();
      plotlyData.data = supplyData;
      plotlyData.xAxisLabel = 'Time';
      plotlyData.yAxisLabel = 'Suppy MWh';
      return Promise.resolve(plotlyData);
    })
  }

  private getNetLoad(query: PlotlyQuery): Promise<PlotlyData> {
    return this.fsQueryService.getNetLoad(query.firestoreQuery).then(supplyData => {
      const plotlyData = new PlotlyData();
      plotlyData.data = supplyData;
      plotlyData.xAxisLabel = 'Time';
      plotlyData.yAxisLabel = 'Netload MWh';
      return Promise.resolve(plotlyData);
    })
  }

  public UpdateWindowName(winId: number, query: any) {
    let title = '';
    switch (query.scope) {
      case 'yearly':
        title = `${query.scenario.toUpperCase()} ${query.type}  2016 - 2045`;
        break;
      case 'monthly':
        title = `${query.scenario.toUpperCase()} ${query.type} - ${query.year}`;
        break;
      case 'daily':
        title = `${query.scenario.toUpperCase()} ${query.type} - ${this.titleMonth(query.month)} ${query.year}`;
        break;
      case 'hourly':
        title = `${query.scenario.toUpperCase()} ${query.type} - ${this.titleMonth(query.month)} ${query.day}, ${query.year}`;
        break;
      default:
        title = `${query.scenario.toUpperCase()} ${query.type}`;
        break;
    }
    this.havenWindowService.getWindow(winId).then((window) => window.title = title);
  }

  private titleMonth(month: number): string {
    return this.monthNames[month];
  }

  public createPlotlyWindow(firestoreQuery: HavenFirestoreQuery, windowTitle: string) {
      const newApp = new HavenApp();
      newApp.appName = 'plotly-line';
      newApp.appInfo = { query: new PlotlyQuery(firestoreQuery, 'scatter') };
      const newWin = new HavenWindow(newApp, windowTitle);
      newWin.color = this.colors[this.scenarios.indexOf(firestoreQuery.scenario)];
      const winId = this.havenWindowService.addWindow(newWin);
      newApp.appInfo['winId'] = winId
  }

}
